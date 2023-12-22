import { CognitoJwtVerifierMultiProperties, CognitoJwtVerifierProperties } from "aws-jwt-verify/cognito-verifier";
import { TokenProvider } from "./token";

type FastifyMultiPoolCognitoOptions = {
    pools: CognitoJwtVerifierMultiProperties[]
}

export type FastifyCognitoOptions = (CognitoJwtVerifierProperties | FastifyMultiPoolCognitoOptions) & {
    /**
     * Specifies how the JWT token is provided in requests
     * - Bearer: given in Authorization header as 'Bearer <TOKEN>'
     *
     * Function specification must accept the request object and
     * return the string token specified in the request
     */
    tokenProvider: TokenProvider
}

export const verifyOptions = ({ tokenProvider, ...options }: FastifyCognitoOptions) => {
    if (!tokenProvider) {
        throw new Error('tokenProvider is required')
    }
    if (isMulti(options)) {
        verifyMultiOptions(options)
    } else {
        verifySingleOptions(options)
    }
}

export const isMulti = (options: CognitoJwtVerifierProperties | FastifyMultiPoolCognitoOptions): options is FastifyMultiPoolCognitoOptions => {
    return "pools" in options
}

const getSingleError = (options: CognitoJwtVerifierProperties): string | undefined => {
    if (!options.userPoolId) {
        return 'userPoolId is required'
    }
    if (options.clientId === undefined) {
        return 'clientId must be specified or explicitly null'
    }
    if (options.tokenUse === undefined) {
        return 'tokenUse must be specified or explicitly null'
    }
}

const verifySingleOptions = (options: CognitoJwtVerifierProperties) => {
    const error = getSingleError(options)
    if (error) {
        throw new Error(error)
    }
}

const verifyMultiOptions = (options: FastifyMultiPoolCognitoOptions) => {
    if (!options.pools || options.pools.length === 0) {
        throw new Error('pools must be omitted or nonempty')
    }
    if (options.pools.length <= 1) {
        throw new Error('pools must specify multiple user pools')
    }
    options.pools.forEach((opts, i) => {
        const error = getSingleError(opts)
        if (error) {
            throw new Error(`pools[${i}].${error}`)
        }
    })
}