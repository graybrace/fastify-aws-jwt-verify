import { CognitoIdOrAccessTokenPayload } from "aws-jwt-verify/jwt-model";
import fp from "fastify-plugin";
import { Auther } from "./auther";
import { FastifyCognitoOptions } from "./options";
import { fastifyCognitoPlugin } from "./plugin";

declare module 'fastify' {
    interface FastifyInstance {
        auth: {
            create: (options: FastifyCognitoOptions) => Auther
            groups: (...groups: string[]) => Auther
            client: (...clientIds: string[]) => Auther
        }
    }

    interface FastifyRequest {
        user: CognitoIdOrAccessTokenPayload<unknown, unknown>
    }
}

const FastifyCognito = fp(fastifyCognitoPlugin, {
    fastify: '>=4.x',
    name: 'fastify-cognito'
})
export default FastifyCognito