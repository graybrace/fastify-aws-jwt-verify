import { CognitoJwtVerifierProperties } from "aws-jwt-verify/cognito-verifier";
import Fastify, { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { FastifyCognitoOptions } from "../options";
import { fastifyCognitoPlugin } from "../plugin";

export type TestServerInit = Required<Pick<CognitoJwtVerifierProperties, 'clientId' | 'groups'>> & {
    options: FastifyCognitoOptions
}

export const useTestServer = (init: TestServerInit) => {
    let fastify: FastifyInstance

    beforeAll(async() => {
        fastify = await startTestServer(init)
    })

    afterAll(async() => {
        await fastify.close()
    })

    return () => fastify
}

const toStrings = (s?: string | string[] | null): string[] => {
    if (s == null) {
        return []
    } else if (typeof s === 'string') {
        return [s]
    } else {
        return s
    }
}

const startTestServer = async (init: TestServerInit) => {
    const fastify = Fastify()

    await fastify.register(fp(fastifyCognitoPlugin), {
        tokenProvider: 'Bearer',
        userPoolId: 'mock user pool',
        clientId: 'mock global client',
        tokenUse: 'access'
    })

    fastify.get('/auth/create', {
        onRequest: fastify.auth.create(init.options)
    }, () => 'Success')

    fastify.get('/auth/client', {
        onRequest: fastify.auth.client(...toStrings(init.clientId))
    }, () => 'Success')

    fastify.get('/auth/groups', {
        onRequest: fastify.auth.groups(...toStrings(init.groups))
    }, () => 'Success')

    fastify.get('/public', () => 'Success')

    await fastify.listen({port: 0})

    return fastify
}