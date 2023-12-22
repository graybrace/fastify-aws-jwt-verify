import { Unauthorized } from "http-errors";
import { extractBearerToken } from "./bearer";

test('missing headers throws', () => {
    expect(() => extractBearerToken({})).toThrow(new Unauthorized('Authorization header missing or empty'))
})

test('missing or empty authorization header throws', () => {
    expect(makeAuthorizationTester()).toThrow(new Unauthorized('Authorization header missing or empty'))
})

test('missing or empty authorization header throws', () => {
    expect(makeAuthorizationTester('')).toThrow(new Unauthorized('Authorization header missing or empty'))
})

test.each([
    ['blah blah blah'],
    ['Bearer ']
])('mal-formed authorization header throws', authorization => {
    expect(makeAuthorizationTester(authorization)).toThrow(new Unauthorized('Bearer token missing or malformed'))
})

test('well-formed authorization header returns token', () => {
    expect(makeAuthorizationTester('Bearer my-token')()).toBe('my-token')
})

const makeAuthorizationTester = (authorization?: string) => {
    return () => extractBearerToken({ headers: { authorization } })
}