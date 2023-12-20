export interface CognitoUser {
    client_id: string
    'cognito:groups'?: string[]
    sub: string
}