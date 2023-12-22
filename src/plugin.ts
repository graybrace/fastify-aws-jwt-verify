import { FastifyInstance } from "fastify";
import { createAuther } from "./auther";
import { FastifyCognitoOptions, verifyOptions } from "./options";

export const fastifyCognitoPlugin = async(fastify: FastifyInstance, options: FastifyCognitoOptions) => {
    verifyOptions(options)

    fastify.decorate('auth', {
        create: (autherOptions: FastifyCognitoOptions) => createAuther({
           ...options,
           ...autherOptions
        }),
        client: (...clientIds: string[]) => createAuther({
            ...options,
            clientId: clientIds
        }),
        groups: (...groups: string[]) => createAuther({
            ...options,
            groups
        })
    })
}