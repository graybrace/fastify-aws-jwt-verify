import { verifyOptions } from "./options";

describe('option verification', () => {
    test('region missing', () => {
        expect(() => {
            verifyOptions({
                region: '',
                userPoolId: 'USER POOL'
            })
        }).toThrow('region must be specified')
    })

    test('user pool id missing', () => {
        expect(() => {
            verifyOptions({
                region: 'REGION',
                userPoolId: ''
            })
        }).toThrow('userPoolId must be specified')
    })

    test('all options missing', () => {
        expect(() => {
            verifyOptions({
                region: '',
                userPoolId: ''
            })
        }).toThrow('region must be specified')
    })

    test('all options specified', () => {
        expect(() => {
            verifyOptions({
                region: 'REGION',
                userPoolId: 'USER POOL'
            })
        }).not.toThrow()
    })
})