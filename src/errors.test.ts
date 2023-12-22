import {
    JwtExpiredError,
    JwtInvalidClaimError,
    JwtNotBeforeError,
    JwtParseError,
    ParameterValidationError
} from "aws-jwt-verify/error";
import { Forbidden, InternalServerError, Unauthorized } from "http-errors";
import { handleError } from "./errors";

test('ParameterValidationError throws generic error', () => {
    expect(() => handleError(new ParameterValidationError('some parameter validation failed')))
        .toThrow(new InternalServerError('Failed to check access to resource'))
})

test('JwtParseError throws Unauthorized', () => {
    expect(() => handleError(new JwtParseError('some parsing falure')))
        .toThrow(new Unauthorized('Unable to parse JWT token'))
})

test('JwtNotBeforeError throws Unauthorized', () => {
    expect(() => handleError(new JwtNotBeforeError('too soon!', 'something')))
        .toThrow(new Unauthorized('too soon!'))
})

test('JwtExpiredError throws Unauthorized', () => {
    expect(() => handleError(new JwtExpiredError('too late!', 'something')))
        .toThrow(new Unauthorized('too late!'))
})

test('JwtInvalidClaimError throws Forbidden', () => {
    class AdhocClaimError extends JwtInvalidClaimError {}
    expect(() => handleError(new AdhocClaimError('bad claim!', 'something')))
        .toThrow(new Forbidden('bad claim!'))
})

test('generic error throws Unauthorized', () => {
    expect(() => handleError(new Error('some generic error')))
        .toThrow(new Unauthorized('some generic error'))
})

test('non-error re-throws', () => {
    expect(() => handleError('abc'))
        .toThrow('abc')
})