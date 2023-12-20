import { getJwksUrl, getUserPoolUrl } from "./cognito";

describe('cognito url building', () => {
    test('user pool base url', () => {
        expect(getUserPoolUrl('us-east-1', 'up-123'))
            .toBe('https://cognito-idp.us-east-1.amazonaws.com/up-123')
    })

    test('jwks url', () => {
        expect(getJwksUrl('us-east-1', 'up-123'))
            .toBe('https://cognito-idp.us-east-1.amazonaws.com/up-123/.well-known/jwks.json')
    })
})