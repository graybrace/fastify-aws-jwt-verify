import { FastifyInstance } from "fastify";
import { createAuther } from "./auther";
import { FastifyAwsJwtVerifyOptions, verifyOptions } from "./options";

export const fastifyAwsJwtVerifyPlugin = async(fastify: FastifyInstance, options: FastifyAwsJwtVerifyOptions) => {
    verifyOptions(options)

    fastify.decorate('auth', {
        require: (autherOptions?: Partial<FastifyAwsJwtVerifyOptions>) => createAuther({
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