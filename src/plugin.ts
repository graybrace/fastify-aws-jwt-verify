import { FastifyInstance } from "fastify";
import FastifyJwtJwks from "fastify-jwt-jwks";
import { createAuther } from "./auther";
import { AuthorizerOptions } from "./authorizers/default";
import { getJwksUrl, getUserPoolUrl } from "./cognito";
import { FastifyAwsCognitoOptions, verifyOptions } from "./options";

export const fastifyCognitoPlugin = async(fastify: FastifyInstance, options: FastifyAwsCognitoOptions) => {
    verifyOptions(options)

    // TODO: Can this all be trimmed down by using aws-jwt-verify (https://github.com/awslabs/aws-jwt-verify)
    // Register fastify-jwt-jwks for Bearer access token decode + verify => sets req.user
    await fastify.register(FastifyJwtJwks, {
        jwksUrl: getJwksUrl(options.region, options.userPoolId),
        issuer: getUserPoolUrl(options.region, options.userPoolId)
    })

    // Authentication without any specific authorization
    fastify.decorate('authenticator', createAuther({ clientId: options.clientId }))

    // Create authenticator from all options
    fastify.decorate('authorizer', (authOptions: AuthorizerOptions = {}) => createAuther(
        {
            clientId: options.clientId,
            ...authOptions
        }
    ))

    // Specific authorizer factories based on authorization type
    fastify.decorate('auth', {
        groups: (...groups: string[]) => createAuther({ groups }),
        client: (clientId: string) => createAuther({ clientId: clientId || options.clientId })
    })
}