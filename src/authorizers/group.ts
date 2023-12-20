import { CognitoUser } from "./cognito-user.interface";

export const authorizeGroups = (user: CognitoUser, groups: string[]) => {
    const cognitoGroups = new Set(user["cognito:groups"] || [])
    const missingGroups = groups.filter(group => !cognitoGroups.has(group))
    if (missingGroups.length > 0) {
        throw new Error(`User '${user.sub}' not authorized for groups: ${formatGroups(missingGroups)}`)
    }
}

const formatGroups = (groups: string[]) => {
    return groups.map(group => `'${group}'`).join(', ')
}