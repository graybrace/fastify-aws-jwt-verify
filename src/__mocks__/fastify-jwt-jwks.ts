import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

export default fp(async(fastify: FastifyInstance) => {
    fastify.decorate('authenticate', async(req: FastifyRequest, reply: FastifyReply) => {
        console.log("mock authenticate:", req.headers.authorization)
        if (req.headers.authorization !== 'Bearer test-token') {
            reply.code(401).send()
        } else {
            req.user = fastify.testuser
            console.log("req.user:", JSON.stringify(req.user, undefined, 2))
        }
    })
})