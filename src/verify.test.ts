import { CognitoJwtVerifierMultiProperties, CognitoJwtVerifierProperties } from "aws-jwt-verify/cognito-verifier";
import { handleError } from "./errors";
import { verify, verifyMulti } from "./verify";

jest.mock('./errors', () => {
    const originalModule = jest.requireActual('./errors')

    return {
        __esModule: true,
        ...originalModule,
        handleError: jest.fn(() => {
            throw new Error('mocked error')
        }),
    }
})

jest.mock('aws-jwt-verify', () => {
    const originalModule = jest.requireActual('aws-jwt-verify')

    const mockVerifier = {
        verify: jest.fn(async(token: string) => {
            if (token === 'bad token') {
                throw new Error('bad token')
            } else {
                return 'good result'
            }
        })
    }

    return {
        __esModule: true,
        ...originalModule,
        CognitoJwtVerifier: {
            create: (options: CognitoJwtVerifierProperties | CognitoJwtVerifierProperties[]) => {
                const userPoolId = "length" in options ? options[0].userPoolId : options.userPoolId
                if (userPoolId === 'bad user pool') {
                    throw new Error('bad creation parameters')
                } else {
                    return mockVerifier
                }
            }
        },
    }
})

afterEach(() => {
    jest.clearAllMocks()
})

test('single user pool verifier creation error handles error', async() => {
    await expect(async() => await verify('test token', { userPoolId: 'bad user pool' }))
        .rejects.toThrow('mocked error')
    expect(handleError).toHaveBeenCalledTimes(1)
    expect(handleError).toHaveBeenCalledWith(new Error('bad creation parameters'))
})

test('single user pool verifier error during verification handles error', async() => {
    await expect(async() => await verify('bad token', { userPoolId: 'good user pool' }))
        .rejects.toThrow('mocked error')
    expect(handleError).toHaveBeenCalledTimes(1)
    expect(handleError).toHaveBeenCalledWith(new Error('bad token'))
})

test('single user pool verifier returns verify result', async() => {
    expect(await verify('test token', { userPoolId: 'good user pool' }))
        .toBe('good result')
})

const MOCK_USER_POOLS = [
    {
        userPoolId: 'mock user pool 1',
        clientId: 'mock client 1',
        tokenUse: 'access'
    } satisfies CognitoJwtVerifierMultiProperties,
    {
        userPoolId: 'mock user pool 2',
        clientId: 'mock client 2',
        tokenUse: 'access'
    } satisfies CognitoJwtVerifierMultiProperties
]

test('multi user pool verifier creation error handles error', async() => {
    await expect(async() => await verifyMulti('test token', [
        {
            ...MOCK_USER_POOLS[0],
            userPoolId: 'bad user pool'
        },
        ...MOCK_USER_POOLS.slice(1)
    ]))
        .rejects.toThrow('mocked error')
    expect(handleError).toHaveBeenCalledTimes(1)
    expect(handleError).toHaveBeenCalledWith(new Error('bad creation parameters'))
})

test('multi user pool verifier error during verification handles error', async() => {
    await expect(async() => await verifyMulti('bad token', MOCK_USER_POOLS))
        .rejects.toThrow('mocked error')
    expect(handleError).toHaveBeenCalledTimes(1)
    expect(handleError).toHaveBeenCalledWith(new Error('bad token'))
})

test('multi user pool verifier returns verify result', async() => {
    expect(await verifyMulti('test token', MOCK_USER_POOLS))
        .toBe('good result')
})