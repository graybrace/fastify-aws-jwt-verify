import { CognitoJwtVerifierProperties } from "aws-jwt-verify/cognito-verifier";
import Fastify, { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Auther } from "../auther";
import { FastifyAwsJwtVerifyOptions } from "../options";
import { fastifyAwsJwtVerifyPlugin } from "../plugin";
import { toStrings } from "./util";

export type TestServerInit = Required<Pick<CognitoJwtVerifierProperties, 'clientId' | 'groups'>> & {
    options: FastifyAwsJwtVerifyOptions
}

export const hoistTestServer = (init: TestServerInit) => {
    let fastify: FastifyInstance

    beforeAll(async() => {
        fastify = await startTestServer(init)
    })

    afterAll(async() => {
        await fastify.close()
    })

    return () => fastify
}

const startTestServer = async(init: TestServerInit) => {
    const fastify = Fastify()

    await fastify.register(fp(fastifyAwsJwtVerifyPlugin), {
        tokenProvider: 'Bearer',
        userPoolId: 'mock user pool',
        clientId: 'mock global client',
        tokenUse: 'access'
    })

    // One endpoint per configuration method, plus one (public) with no auth requirement
    getSuccess(fastify, '/auth/create', fastify.auth.require(init.options))
    getSuccess(fastify, '/auth/client', fastify.auth.client(...toStrings(init.clientId)))
    getSuccess(fastify, '/auth/groups', fastify.auth.groups(...toStrings(init.groups)))
    getSuccess(fastify, '/public')

    await fastify.listen({ port: 0 })

    return fastify
}

const getSuccess = (fastify: FastifyInstance, path: string, onRequest?: Auther) => {
    fastify.get(path, { onRequest }, success)
}

const success = () => 'Success'