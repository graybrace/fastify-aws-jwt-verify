import { FastifyRequest } from "fastify";
import { extractBearerToken } from "./bearer";

type TokenGetter = (req: FastifyRequest) => string
export type TokenProvider = "Bearer" | TokenGetter

export const getToken = (req: FastifyRequest, provider: TokenProvider): string => {
    switch (provider) {
        case "Bearer":
            return extractBearerToken(req)
        default:
            return provider(req)
    }
}