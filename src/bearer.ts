import { Unauthorized } from "http-errors";

const BEARER_PREFIX = "Bearer "

interface AuthorizableRequest {
    headers?: {
        authorization?: string
    }
}

export const extractBearerToken = (req: AuthorizableRequest): string => {
    if (!req.headers || !req.headers.authorization) {
        throw new Unauthorized('Authorization header missing or empty')
    }
    const authorization = req.headers.authorization
    if (!authorization.startsWith(BEARER_PREFIX) || authorization.length <= BEARER_PREFIX.length) {
        throw new Unauthorized('Bearer token missing or malformed')
    }
    return authorization.slice(BEARER_PREFIX.length)
}