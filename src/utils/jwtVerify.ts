import { importJWK, jwtVerify, JWTPayload, JWK } from "jose";
import { getAuthServerAddress } from "./commons.js";
import { SSO_JWKS_ENDPOINT } from "./constants.js";

const ssoServer = getAuthServerAddress();
let cachedJwks: Record<string, JWK> = {};

/**
 * Fetches and caches the JWKS (JSON Web Key Set) from the SSO server.
 * @returns A record of JWKs indexed by their key ID (kid).
 * @throws Error if the JWKS fetch fails.
 */
async function fetchJwks(): Promise<Record<string, JWK>> {
    try {
        // Return cached JWKS if available
        if (Object.keys(cachedJwks).length > 0) {
            return cachedJwks;
        }

        const response = await fetch(ssoServer + SSO_JWKS_ENDPOINT);
        if (!response.ok) {
            throw new Error(`Failed to fetch JWKS: ${response.statusText}`);
        }

        const { keys } = (await response.json()) as { keys: JWK[] };
        keys.forEach((key: JWK) => {
            cachedJwks[key.kid] = key;
        });

        return cachedJwks;
    } catch (error) {
        console.error("Error fetching JWKS:", error.message);
        throw new Error("Unable to fetch JWKS from the SSO server.");
    }
}

/**
 * Verifies the provided JWT using the JWKS from the SSO server.
 * @param token The JWT to verify.
 * @returns The decoded JWT payload if verification is successful.
 * @throws Error if the JWT is invalid, expired, or verification fails.
 */
export async function verifyAccessToken(token: string): Promise<JWTPayload> {
    try {
        // Decode the JWT header to extract the key ID (kid)
        const [header] = token.split(".");
        const { kid } = JSON.parse(Buffer.from(header, "base64").toString());

        if (!kid) {
            throw new Error("JWT is missing 'kid' in the header.");
        }

        // Fetch the JWKS and find the matching key
        const jwks = await fetchJwks();
        const jwk = jwks[kid];

        if (!jwk) {
            throw new Error(`No matching JWK found for kid: ${kid}`);
        }

        // Import the JWK and verify the JWT
        const publicKey = await importJWK(jwk, "RS256");
        const { payload } = await jwtVerify(token, publicKey);

        return payload;
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        throw new Error("Invalid or expired token.");
    }
}
