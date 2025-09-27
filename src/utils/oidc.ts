import * as client from 'openid-client';
import { getAuthClientId, getAuthClientSecret, getAuthServerAddress } from './commons.js';
import { OPEN_ID_CONFIG_ENDPOINT } from './constants.js';

let config: client.Configuration | null = null;

/**
 * Fetches and caches the OpenID Connect configuration from the server.
 * @returns The OpenID Connect configuration.
 * @throws Error if the discovery process fails.
 */
async function getOIDCConfig(): Promise<client.Configuration> {
	if (config) return config;

	try {
		const server = getAuthServerAddress();
		const clientId = getAuthClientId();
		const clientSecret = getAuthClientSecret();
		const issuer = new URL(server + OPEN_ID_CONFIG_ENDPOINT);

		config = await client.discovery(issuer, clientId, clientSecret);
		return config;
	} catch (error) {
		console.error("Failed to fetch OIDC configuration:", error.message);
		throw new Error("Unable to fetch OpenID Connect configuration.");
	}
}

/**
 * Generates an authorization URL for user login.
 * @param scope The scope of the authorization request.
 * @param redirect_uri The redirect URI for the authorization response.
 * @returns An object containing the authorization URL and state.
 * @throws Error if the configuration or URL generation fails.
 */
export async function getAuthorizationUrl(scope: string, redirect_uri: string) {
	try {
		const cfg = await getOIDCConfig();
		const state = client.randomState();

		const parameters: Record<string, string> = {
			redirect_uri,
			scope,
			state,
		};

		const url = client.buildAuthorizationUrl(cfg, parameters);
		return { url, state };
	} catch (error) {
		console.error("Failed to generate authorization URL:", error.message);
		throw new Error("Unable to generate authorization URL.");
	}
}

/**
 * Exchanges an authorization code for tokens.
 * @param code The authorization code received from the authorization server.
 * @param redirect_uri The redirect URI used in the authorization request.
 * @param expectedState The expected state to validate against.
 * @returns The token response containing access and refresh tokens.
 * @throws Error if the token exchange fails.
 */
export async function exchangeCodeForTokens(
	code: string,
	redirect_uri: string,
	expectedState: string
): Promise<client.TokenEndpointResponse> {
	try {
		const cfg = await getOIDCConfig();
		const tokens = await client.authorizationCodeGrant(cfg, new URL(redirect_uri), {
			expectedState,
		});
		return tokens;
	} catch (error) {
		console.error("Failed to exchange authorization code for tokens:", error.message);
		throw new Error("Unable to exchange authorization code for tokens.");
	}
}

/**
 * Refreshes an access token using a refresh token.
 * @param refresh_token The refresh token to use for obtaining new tokens.
 * @returns The token response containing new access and refresh tokens.
 * @throws Error if the token refresh process fails.
 */
export async function refreshTokenFlow(refresh_token: string): Promise<client.TokenEndpointResponse> {
	try {
		const cfg = await getOIDCConfig();
		const tokens = await client.refreshTokenGrant(cfg, refresh_token);
		return tokens;
	} catch (error) {
		console.error("Failed to refresh tokens:", error.message);
		throw new Error("Unable to refresh tokens.");
	}
}
