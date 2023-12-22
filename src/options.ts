import { CognitoJwtVerifierMultiProperties, CognitoJwtVerifierProperties } from "aws-jwt-verify/cognito-verifier";
import { TokenProvider } from "./token";

type FastifyMultiPoolCognitoOptions = {
    multi: CognitoJwtVerifierMultiProperties[]
}

export type FastifyCognitoOptions = (CognitoJwtVerifierProperties | FastifyMultiPoolCognitoOptions) & {
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
    return "multi" in options
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
    if (!options.multi || options.multi.length === 0) {
        throw new Error('multi must be omitted or nonempty')
    }
    if (options.multi.length <= 1) {
        throw new Error('multi must specify multiple user pools')
    }
    options.multi.forEach((opts, i) => {
        const error = getSingleError(opts)
        if (error) {
            throw new Error(`multi[${i}].${error}`)
        }
    })
}