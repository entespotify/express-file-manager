declare global {
    namespace Express {
        interface Request {
            user?: any
        }
    }
}

export interface User {
    id: string,
    email: string,
    password: string,
    name: string
}