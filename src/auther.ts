import { FastifyRequest } from "fastify";
import { FastifyCognitoOptions, isMulti } from "./options";
import { getToken } from "./token";
import { verify, verifyMulti } from "./verify";

const authenticateAndAuthorize = async(req: FastifyRequest, options: FastifyCognitoOptions) => {
    const token = getToken(req, options.tokenProvider)
    return isMulti(options) ? verifyMulti(token, options.multi) : verify(token, options)
}

export const createAuther = (options: FastifyCognitoOptions) => {
    return async(req: FastifyRequest) => {
        req.user = await authenticateAndAuthorize(req, options)
    }
}

export type Auther = ReturnType<typeof createAuther>