export const getUserPoolUrl = (region: string, userPoolId: string): string => {
    return `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`
}

export const getJwksUrl = (region: string, userPoolId: string): string => {
    return `${getUserPoolUrl(region, userPoolId)}/.well-known/jwks.json`
}