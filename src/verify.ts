import { CognitoJwtVerifier } from "aws-jwt-verify";
import { CognitoJwtVerifierMultiProperties, CognitoJwtVerifierProperties } from "aws-jwt-verify/cognito-verifier";
import { handleError } from "./errors";

export const verify = async<T extends CognitoJwtVerifierProperties>(
    token: string,
    options: T & Partial<CognitoJwtVerifierProperties>
) => {
    try {
        const verifier = CognitoJwtVerifier.create(options)
        return await verifier.verify(token)
    } catch (err) {
        handleError(err)
    }
}

export const verifyMulti = async<T extends CognitoJwtVerifierMultiProperties>(
    token: string,
    options: (T & Partial<CognitoJwtVerifierMultiProperties>)[]
) => {
    try {
        const verifier = CognitoJwtVerifier.create(options)
        return await verifier.verify(token)
    } catch (err) {
        handleError(err)
    }
}