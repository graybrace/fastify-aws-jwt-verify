import { CognitoIdOrAccessTokenPayload } from "aws-jwt-verify/jwt-model";
import fp from "fastify-plugin";
import { Auther } from "./auther";
import { FastifyCognitoOptions } from "./options";
import { fastifyAwsJwtVerifyPlugin } from "./plugin";

declare module 'fastify' {
    interface FastifyInstance {
        auth: {
            /**
             * Create handler that verifies the JWT token before continuing.
             * If options is provided, any set fields override the same base
             * plugin configuration fields. If omitted, the base configuration
             * is used as-is.
             */
            require: (options?: FastifyCognitoOptions) => Auther

            /**
             * Create handler that verifies the JWT token before continuing,
             * using the base plugin configuration with the specified list of
             * allowed Cognito groups. If groups is specified, it overrides
             * any groups specified in the base plugin configuration.
             */
            groups: (...groups: string[]) => Auther

            /**
             * Create handler that verifies the JWT token before continuing,
             * using the base plugin configuration with the specified list of
             * allowed client IDs. If clientIds is specified, it overrides
             * any client IDs specified in the base plugin configuration.
             */
            client: (...clientIds: string[]) => Auther
        }
    }

    interface FastifyRequest {
        /**
         * User payload extracted during JWT verification, if successful
         */
        user: CognitoIdOrAccessTokenPayload<unknown, unknown>
    }
}

const FastifyAwsJwtVerify = fp(fastifyAwsJwtVerifyPlugin, {
    fastify: '>=4.x',
    name: 'fastify-aws-jwt-verify'
})
export default FastifyAwsJwtVerify