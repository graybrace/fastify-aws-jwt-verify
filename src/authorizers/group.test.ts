import { authorizeGroups } from "./group";
import { CognitoUser } from "./cognito-user.interface";

describe('group authorizer', () => {
    test('no required groups', () => {
        expect(() => {
            authorizeGroups(makeTestUser(), [])
        }).not.toThrow()
    })

    test('no groups on user', () => {
        expect(() => {
            authorizeGroups(makeTestUser(), [ 'group1' ])
        }).toThrow("User 'user1' not authorized for groups: 'group1'")
    })

    test('missing 1 group', () => {
        expect(() => {
            authorizeGroups(makeTestUser([ 'group1' ]), [ 'group1', 'group2' ])
        }).toThrow("User 'user1' not authorized for groups: 'group2'")
    })

    test('missing all groups', () => {
        expect(() => {
            authorizeGroups(makeTestUser(), [ 'group1', 'group2', 'group3' ])
        }).toThrow("User 'user1' not authorized for groups: 'group1', 'group2', 'group3'")
    })

    test('matching groups out of order', () => {
        expect(() => {
            authorizeGroups(makeTestUser([ 'group2', 'group1' ]), [ 'group1', 'group2' ])
        }).not.toThrow()
    })

    test('matching group with extra group', () => {
        expect(() => {
            authorizeGroups(makeTestUser([ 'group1', 'group2' ]), [ 'group1' ])
        }).not.toThrow()
    })
})

const makeTestUser = (groups?: string[]): CognitoUser => {
    return {
        client_id: 'client123',
        'cognito:groups': groups,
        sub: 'user1'
    }
}