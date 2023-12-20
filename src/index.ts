import fp from "fastify-plugin";
import { Auther } from "./auther";
import { AuthorizerOptions } from "./authorizers/default";
import { fastifyCognitoPlugin } from "./plugin";

declare module 'fastify' {
    interface FastifyInstance {
        authenticator: Auther,
        authorizer: (authOptions?: AuthorizerOptions) => Auther,
        auth: {
            groups: (...groups: string[]) => Auther
            client: (clientId: string) => Auther
        }
    }
}

const FastifyCognito = fp(fastifyCognitoPlugin, {
    fastify: '>=4.x',
    name: 'fastify-cognito'
})
export default FastifyCognito