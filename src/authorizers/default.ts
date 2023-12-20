import { authorizeClientId } from "./client-id";
import { authorizeGroups } from "./group";
import { CognitoUser } from "./cognito-user.interface";

export interface AuthorizerOptions {
    clientId?: string
    groups?: string[]
}

export const authorize = (user: CognitoUser, options: AuthorizerOptions) => {
    if (options.clientId) {
        authorizeClientId(user, options.clientId)
    }
    if (options.groups?.length > 0) {
        authorizeGroups(user, options.groups)
    }
}