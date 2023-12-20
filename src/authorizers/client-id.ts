import { CognitoUser } from "./cognito-user.interface";

export const authorizeClientId = (user: CognitoUser, clientId: string) => {
    if (user.client_id !== clientId) {
        throw new Error(`User '${user.sub}' not authorized for client '${clientId}'`)
    }
}