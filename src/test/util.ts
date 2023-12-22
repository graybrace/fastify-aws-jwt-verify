export const toStrings = (s?: string | string[] | null): string[] => {
    if (s == null) {
        return []
    } else if (typeof s === 'string') {
        return [s]
    } else {
        return s
    }
}