import { authorize } from "./default";
import { CognitoUser } from "./cognito-user.interface";

describe('default authorizer', () => {
    test('client id mismatch', () => {
        expect(() => {
            authorize(makeTestUser('client456'), { clientId: 'client123' })
        }).toThrow("User 'user1' not authorized for client 'client123'")
    })

    test('client id match only', () => {
        expect(() => {
            authorize(makeTestUser('client123'), { clientId: 'client123' })
        }).not.toThrow()
    })

    test('group mismatch', () => {
        expect(() => {
            authorize(makeTestUser(undefined, [ 'group2' ]), { groups: [ 'group1' ]})
        }).toThrow("User 'user1' not authorized for groups: 'group1'")
    })

    test('client id and group mismatch', () => {
        expect(() => {
            authorize(makeTestUser('client456', [ 'group2' ]), {
                clientId: 'client123',
                groups: [ 'group1' ]
            })
        }).toThrow("User 'user1' not authorized for client 'client123'")
    })

    test('client id and group match', () => {
        expect(() => {
            authorize(makeTestUser('client123', [ 'group1' ]), {
                clientId: 'client123',
                groups: [ 'group1' ]
            })
        }).not.toThrow()
    })
})

const makeTestUser = (clientId?: string, groups?: string[]): CognitoUser => {
    return {
        client_id: clientId,
        "cognito:groups": groups,
        sub: 'user1'
    }
}