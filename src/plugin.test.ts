import { CognitoJwtVerifierMultiProperties, CognitoJwtVerifierProperties } from "aws-jwt-verify/cognito-verifier";
import Fastify from "fastify";
import fp from "fastify-plugin";
import { InternalServerError, Unauthorized } from "http-errors";
import { FastifyCognitoOptions } from "./options";
import { fastifyCognitoPlugin } from "./plugin";
import { TestServerInit, useTestServer } from "./test/server";

jest.mock('./options', () => {
    const originalModule = jest.requireActual('./options')

    return {
        __esModule: true,
        ...originalModule,
        verifyOptions: jest.fn((options: FastifyCognitoOptions) => {
            if (options.tokenProvider !== 'Bearer') {
                throw new Error('mocked error')
            }
        }),
    }
})

jest.mock('./verify', () => {
    const originalModule = jest.requireActual('./verify')

    const verify = (token: string, msg: string) => {
        if (token === 'unauthorized') {
            throw new Unauthorized(msg)
        } else if (token === 'error') {
            throw new InternalServerError(msg)
        }
    }

    return {
        __esModule: true,
        ...originalModule,
        verify: jest.fn(async<T extends CognitoJwtVerifierProperties>(
            token: string,
            options: T & Partial<CognitoJwtVerifierProperties>
        ) => {
            verify(token, options.userPoolId)
        }),
        verifyMulti: jest.fn(async<T extends CognitoJwtVerifierProperties>(
            token: string,
            options: (T & Partial<CognitoJwtVerifierMultiProperties>)[]
        ) => {
            verify(token, options[0].userPoolId)
        })
    }
})

const SINGLE_OPTIONS: TestServerInit = {
    options: {
        clientId: 'client',
        tokenProvider: 'Bearer',
        userPoolId: 'user pool'
    },
    clientId: 'client',
    groups: 'group 1'
}

const MULTI_OPTIONS: TestServerInit = {
    options: {
        multi: [
            {
                clientId: 'client',
                tokenUse: 'access',
                userPoolId: 'user pool 1'
            },
            {
                clientId: 'client',
                tokenUse: 'access',
                userPoolId: 'user pool 2'
            }
        ],
        tokenProvider: 'Bearer'
    },
    clientId: 'client',
    groups: 'group 1'
}

const SERVER_OPTIONS: TestServerInit[] = [ SINGLE_OPTIONS, MULTI_OPTIONS ]

describe('no token tests', () => {
    SERVER_OPTIONS.forEach(options => {
        const getFastify = useTestServer(options)

        test('public does not need token', async() => {
            const res = await getFastify().inject('/public')
            expect(res.statusCode).toBe(200)
        })

        test('auth/create rejects no token', async() => {
            const res = await getFastify().inject('/auth/create')
            expect(res.statusCode).toBe(401)
        })

        test('auth/client rejects no token', async() => {
            const res = await getFastify().inject('/auth/client')
            expect(res.statusCode).toBe(401)
        })

        test('auth/groups rejects no token', async() => {
            const res = await getFastify().inject('/auth/groups')
            expect(res.statusCode).toBe(401)
        })
    })
})

test('verify failure throws during plugin registration', async() => {
    const fastify = Fastify()
    await expect(async() => await fastify.register(fp(fastifyCognitoPlugin), {
        tokenProvider: () => 'mock token',
        userPoolId: 'mock user pool',
        clientId: 'mock global client',
        tokenUse: 'access'
    })).rejects.toThrow('mocked error')
})

describe('authers call verify helpers', () => {
    describe.each([
        [ 'single user pool', SINGLE_OPTIONS ],
        [ 'multi user pool', MULTI_OPTIONS ]
    ])('%s', (_, opts) => {
        const getFastify = useTestServer(opts)

        test.each([
            [ '/auth/create', 'unauthorized',   401 ],
            [ '/auth/client', 'unauthorized',   401 ],
            [ '/auth/groups', 'unauthorized',   401 ],
            [ '/auth/create', 'error',          500 ],
            [ '/auth/client', 'error',          500 ],
            [ '/auth/groups', 'error',          500 ],
            [ '/auth/create', 'good',          200 ],
            [ '/auth/client', 'good',          200 ],
            [ '/auth/groups', 'good',          200 ]
        ])('%s, token = %s gives %i', async(path, token, statusCode) => {
            const res= await getFastify().inject({
                headers: { authorization: `Bearer ${token}` },
                path
            })
            expect(res.statusCode).toBe(statusCode)
        })
    })
})