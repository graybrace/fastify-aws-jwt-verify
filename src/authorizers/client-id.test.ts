import { authorizeClientId } from "./client-id";
import { CognitoUser } from "./cognito-user.interface";

const USER: CognitoUser = {
    client_id: 'abc123',
    sub: 'user1'
}

describe('client id authorizer', () => {
    test('wrong client id', () => {
        expect(() => {
            authorizeClientId(USER, 'xyz456')
        }).toThrow("User 'user1' not authorized for client 'xyz456'")
    })

    test('matching client id', () => {
        expect(() => {
            authorizeClientId(USER, 'abc123')
        }).not.toThrow()
    })
})