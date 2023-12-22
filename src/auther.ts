import { FastifyRequest } from "fastify";
import { FastifyAwsJwtVerifyOptions, isMulti } from "./options";
import { getToken } from "./token";
import { verify, verifyMulti } from "./verify";

const authenticateAndAuthorize = async(req: FastifyRequest, options: FastifyAwsJwtVerifyOptions) => {
    const token = getToken(req, options.tokenProvider)
    return isMulti(options) ? verifyMulti(token, options.pools) : verify(token, options)
}

export const createAuther = (options: FastifyAwsJwtVerifyOptions) => {
    return async(req: FastifyRequest) => {
        req.user = await authenticateAndAuthorize(req, options)
    }
}

export type Auther = ReturnType<typeof createAuther>