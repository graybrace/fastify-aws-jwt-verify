import Fastify, { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { CognitoUser } from "../authorizers/cognito-user.interface";
import { fastifyCognitoPlugin } from "../plugin";

interface TestServerOptions {
    globalClientId?: string
    clientId?: string
    groups?: string[]
    user: CognitoUser
}

const startTestServer = async (options: TestServerOptions) => {
    const fastify = Fastify()

    await fastify.register(fp(async(fastify: FastifyInstance) => {
        fastify.testuser = options.user
    }))

    await fastify.register(fp(fastifyCognitoPlugin), {
        region: 'us-east-1',
        userPoolId: 'mock-user-pool',
        clientId: options.globalClientId
    })

    fastify.get('/authenticate', {
        onRequest: fastify.authenticator
    }, () => 'Success')

    fastify.get('/authorize', {
        onRequest: fastify.authorizer(options)
    }, () => 'Success')

    fastify.get('/auth/client', {
        onRequest: fastify.auth.client(options.clientId)
    }, () => 'Success')

    fastify.get('/auth/groups', {
        onRequest: fastify.auth.groups(...(options.groups || []))
    }, () => 'Success')

    fastify.get('/public', () => 'Success')

    await fastify.listen({port: 0})

    return fastify
}

export const useTestServer = (options: TestServerOptions) => {
    let fastify: FastifyInstance

    beforeAll(async() => {
        fastify = await startTestServer(options)
    })

    afterAll(async() => {
        await fastify.close()
    })

    return () => fastify
}