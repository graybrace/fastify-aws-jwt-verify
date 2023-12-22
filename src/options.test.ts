import { CognitoVerifyProperties } from "aws-jwt-verify/cognito-verifier";
import { FastifyCognitoOptions, verifyOptions } from "./options";

// Simple wrapper just to make testing a return value possible for simpler tests
const testVerifyOptions = (options: FastifyCognitoOptions) => {
    verifyOptions(options)
    return true
}

const GOOD_USER_POOL: CognitoVerifyProperties = {
    clientId: 'client',
    tokenUse: 'access'
}

const GOOD_SINGLE_OPTIONS: FastifyCognitoOptions = {
    tokenProvider: 'Bearer',
    userPoolId: 'user pool',
    ...GOOD_USER_POOL
}

test('missing tokenProvider throws', () => {
    expect(() => testVerifyOptions({
        ...GOOD_SINGLE_OPTIONS,
        tokenProvider: undefined
    })).toThrow('tokenProvider is required')
})

test('missing userPoolId throws', () => {
    expect(() => testVerifyOptions({
        ...GOOD_SINGLE_OPTIONS,
        userPoolId: undefined
    })).toThrow('userPoolId is required')
})

test('missing clientId throws', () => {
    expect(() => testVerifyOptions({
        ...GOOD_SINGLE_OPTIONS,
        clientId: undefined
    })).toThrow('clientId must be specified or explicitly null')
})

test('clientId can be null', () => {
    expect(testVerifyOptions({
        ...GOOD_SINGLE_OPTIONS,
        clientId: null
    })).toBe(true)
})

test('missing tokenUse throws', () => {
    expect(() => testVerifyOptions({
        ...GOOD_SINGLE_OPTIONS,
        tokenUse: undefined
    })).toThrow('tokenUse must be specified or explicitly null')
})

test('tokenUse can be null', () => {
    expect(testVerifyOptions({
        ...GOOD_SINGLE_OPTIONS,
        tokenUse: null
    })).toBe(true)
})

test('multi being empty throws', () => {
    expect(() => testVerifyOptions({
        tokenProvider: 'Bearer',
        multi: []
    })).toThrow('multi must be omitted or nonempty')
})

test('multi with one user pool throws', () => {
    expect(() => testVerifyOptions({
        tokenProvider: 'Bearer',
        multi: [
            {
                userPoolId: 'user pool',
                ...GOOD_USER_POOL
            }
        ]
    })).toThrow('multi must specify multiple user pools')
})

test('multi with bad user pool throws', () => {
    expect(() => testVerifyOptions({
        tokenProvider: 'Bearer',
        multi: [
            {
                userPoolId: 'user pool 1',
                ...GOOD_USER_POOL,
                clientId: undefined
            },
            {
                userPoolId: 'user pool 2',
                ...GOOD_USER_POOL
            }
        ]
    })).toThrow('multi[0].clientId must be specified or explicitly null')
})

test('multi with good user pools returns', () => {
    expect(testVerifyOptions({
        tokenProvider: 'Bearer',
        multi: [
            {
                userPoolId: 'user pool 1',
                ...GOOD_USER_POOL
            },
            {
                userPoolId: 'user pool 2',
                ...GOOD_USER_POOL
            }
        ]
    })).toBe(true)
})