import { FastifyInstance } from "fastify";

export const injectToken = (fastify: FastifyInstance, path: string) => {
    return fastify.inject({
        path,
        headers: {
            authorization: 'Bearer test-token'
        }
    })
}