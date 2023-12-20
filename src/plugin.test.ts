jest.mock("fastify-jwt-jwks")
import { expectForbidden, expectSuccess, expectUnauthorized } from "./test/expect";
import { injectToken } from "./test/inject";
import { useTestServer } from "./test/server";

declare module 'fastify' {
    interface FastifyInstance {
        testuser: object
    }
}

const TEST_USER = {
    client_id: 'test-client-id',
    'cognito:groups': [ 'group1', 'group2', 'group3' ],
    sub: 'test-user'
}

const SERVER_OPTIONS = [
    // No authorization requirements
    {
        user: TEST_USER
    },
    // Global client ID
    {
        globalClientId: 'global-client-id',
        user: TEST_USER
    },
    // Global client ID + local client ID
    {
        clientId: 'test-client-id',
        globalClientId: 'global-client-id',
        user: TEST_USER
    },
    // Groups
    {
        globalClientId: 'global-client-id',
        groups: [ 'group1', 'group3' ],
        user: TEST_USER
    },
    // Client ID + groups
    {
        clientId: 'test-client-id',
        groups: [ 'group1', 'group3' ],
        user: TEST_USER
    }
]

describe('cognito-authed server', () => {
    describe('no token tests', () => {
        SERVER_OPTIONS.forEach(options => {
            const getFastify = useTestServer(options)

            test('public does not need token', async() => {
                expectSuccess(await getFastify().inject('/public'))
            })

            test('authenticate rejects no token', async() => {
                expectUnauthorized(await getFastify().inject('/authenticate'))
            })

            test('authorize rejects no token', async() => {
                expectUnauthorized(await getFastify().inject('/authorize'))
            })

            test('auth/client rejects no token', async() => {
                expectUnauthorized(await getFastify().inject('/auth/client'))
            })

            test('auth/groups rejects no token', async() => {
                expectUnauthorized(await getFastify().inject('/auth/groups'))
            })
        })
    })

    describe('authentication only', () => {
        const getFastify = useTestServer(SERVER_OPTIONS[0])

        test('authenticate successful with token', async() => {
            expectSuccess(await injectToken(getFastify(), '/authenticate'))
        })

        test('authorize successful with token', async() => {
            expectSuccess(await injectToken(getFastify(), '/authorize'))
        })

        test('auth/client successful with token', async() => {
            expectSuccess(await injectToken(getFastify(), '/auth/client'))
        })

        test('auth/groups successful with token', async() => {
            expectSuccess(await injectToken(getFastify(), '/auth/groups'))
        })
    })

    describe('global client id', () => {
        const getFastify = useTestServer(SERVER_OPTIONS[1])

        test('authenticate rejects bad client id', async() => {
            const res = await injectToken(getFastify(), '/authenticate')
            expectForbidden(res, "User 'test-user' not authorized for client 'global-client-id'")
        })

        test('authorize rejects bad client id', async() => {
            const res = await injectToken(getFastify(), '/authorize')
            expectForbidden(res, "User 'test-user' not authorized for client 'global-client-id'")
        })

        test('authorize rejects bad client id', async() => {
            const res = await injectToken(getFastify(), '/auth/client')
            expectForbidden(res, "User 'test-user' not authorized for client 'global-client-id'")
        })

        test('auth/groups successful with token', async() => {
            expectSuccess(await injectToken(getFastify(), '/auth/groups'))
        })
    })

    describe('global + local client id', () => {
        const getFastify = useTestServer(SERVER_OPTIONS[2])

        test('authenticate rejects bad client id', async() => {
            const res = await injectToken(getFastify(), '/authenticate')
            expectForbidden(res, "User 'test-user' not authorized for client 'global-client-id'")
        })

        test('authorize successful with local client id', async() => {
            expectSuccess(await injectToken(getFastify(), '/authorize'))
        })

        test('authorize successful with local client id', async() => {
            expectSuccess(await injectToken(getFastify(), '/auth/client'))
        })

        test('auth/groups successful with token', async() => {
            expectSuccess(await injectToken(getFastify(), '/auth/groups'))
        })
    })

    describe('groups', () => {
        const getFastify = useTestServer(SERVER_OPTIONS[3])

        test('authenticate rejects bad client id', async() => {
            const res = await injectToken(getFastify(), '/authenticate')
            expectForbidden(res, "User 'test-user' not authorized for client 'global-client-id'")
        })

        test('authorize rejects client id', async() => {
            const res = await injectToken(getFastify(), '/authorize')
            expectForbidden(res, "User 'test-user' not authorized for client 'global-client-id'")
        })

        test('authorize rejects client id', async() => {
            const res = await injectToken(getFastify(), '/auth/client')
            expectForbidden(res, "User 'test-user' not authorized for client 'global-client-id'")
        })

        test('auth/groups successful with groups', async() => {
            expectSuccess(await injectToken(getFastify(), '/auth/groups'))
        })
    })

    describe('local client id + groups', () => {
        const getFastify = useTestServer(SERVER_OPTIONS[4])

        test('authenticate rejects bad client id', async() => {
            expectSuccess(await injectToken(getFastify(), '/authenticate'))
        })

        test('authorize rejects client id', async() => {
            expectSuccess(await injectToken(getFastify(), '/authorize'))
        })

        test('authorize rejects client id', async() => {
            expectSuccess(await injectToken(getFastify(), '/auth/client'))
        })

        test('auth/groups successful with groups', async() => {
            expectSuccess(await injectToken(getFastify(), '/auth/groups'))
        })
    })
})