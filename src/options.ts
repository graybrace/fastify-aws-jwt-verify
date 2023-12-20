export interface FastifyAwsCognitoOptions {
    region: string
    userPoolId: string
    clientId?: string
}

export const verifyOptions = ({ region, userPoolId }: FastifyAwsCognitoOptions) => {
    if (!region) {
        throw new Error('region must be specified')
    }
    if (!userPoolId) {
        throw new Error('userPoolId must be specified')
    }
}