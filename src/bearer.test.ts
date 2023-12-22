import { Unauthorized } from "http-errors";
import { extractBearerToken } from "./bearer";

test('missing headers throws', () => {
    expect(() => extractBearerToken({}))
        .toThrow(new Unauthorized('Authorization header missing or empty'))
})

test('missing or empty authorization header throws', () => {
    expect(() => extractBearerToken({ headers: {} }))
        .toThrow(new Unauthorized('Authorization header missing or empty'))
})

test('missing or empty authorization header throws', () => {
    expect(() => extractBearerToken({
        headers: {
            authorization: ''
        }
    })).toThrow(new Unauthorized('Authorization header missing or empty'))
})

test.each([
    ['blah blah blah'],
    ['Bearer ']
])('mal-formed authorization header throws', authorization => {
    expect(() => extractBearerToken({ headers: { authorization } }))
        .toThrow(new Unauthorized('Bearer token missing or malformed'))
})

test('well-formed authorization header returns token', () => {
    expect(extractBearerToken({
        headers: {
            authorization: 'Bearer my-token'
        }
    })).toBe('my-token')
})