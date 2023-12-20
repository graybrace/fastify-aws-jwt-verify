import { FastifyReply, FastifyRequest } from "fastify";
import { authorize, AuthorizerOptions } from "./authorizers/default";
import { CognitoUser } from "./authorizers/cognito-user.interface";

const authenticateAndAuthorize = async(req: FastifyRequest, reply: FastifyReply, options: AuthorizerOptions) => {
    await req.server.authenticate(req, reply)
    const cognitoUser = req.user as CognitoUser
    try {
        authorize(cognitoUser, options)
    } catch (err) {
        if (err instanceof Error) {
            return reply.code(403).send({
                statusCode: 403,
                status: 'Forbidden',
                message: err.message
            })
        }
        throw err
    }
}

export const createAuther = (options: AuthorizerOptions = {}) => {
    return async(req: FastifyRequest, reply: FastifyReply) => {
        return authenticateAndAuthorize(req, reply, options)
    }
}

export type Auther = ReturnType<typeof createAuther>