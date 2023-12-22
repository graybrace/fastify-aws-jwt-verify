import {
    JwtExpiredError,
    JwtInvalidClaimError,
    JwtNotBeforeError,
    JwtParseError,
    ParameterValidationError
} from "aws-jwt-verify/error";
import { Forbidden, InternalServerError, Unauthorized } from "http-errors";

export const handleError = (err: unknown) => {
    if (err instanceof ParameterValidationError) {
        // Don't expose internal JWT verification implementation to API consumer
        throw new InternalServerError('Failed to check access to resource')
    } else if (err instanceof JwtParseError) {
        // Don't expose any more info
        throw new Unauthorized('Unable to parse JWT token')
    } else if (err instanceof JwtNotBeforeError || err instanceof JwtExpiredError) {
        throw new Unauthorized(err.message)
    } else if (err instanceof JwtInvalidClaimError) {
        throw new Forbidden(err.message)
    } else if (err instanceof Error) {
        throw new Unauthorized(err.message)
    } else {
        throw err
    }
}