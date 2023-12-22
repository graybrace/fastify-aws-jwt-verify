import { FastifyRequest } from "fastify";
import { getToken } from "./token";
import { extractBearerToken } from "./bearer";

jest.mock('./bearer', () => {
    const originalModule = jest.requireActual('./bearer');

    return {
        __esModule: true,
        ...originalModule,
        extractBearerToken: jest.fn(() => 'mock token'),
    }
})

// Don't need a complete request since we're just verifying that this
// gets passed to the expected token provider, not that the provider works
const MOCK_REQUEST = {
    id: 'test-1'
} as FastifyRequest

test('get bearer token calls extractBearerToken', () => {
    expect(getToken(MOCK_REQUEST, 'Bearer')).toBe('mock token')
    expect(extractBearerToken).toHaveBeenCalledTimes(1)
    expect(extractBearerToken).toHaveBeenCalledWith(MOCK_REQUEST)
})

test('custom token provider is called with request', () => {
    const mockTokenProvider = jest.fn((req: FastifyRequest) => `mock token: ${req.id}`)
    expect(getToken(MOCK_REQUEST, mockTokenProvider)).toBe('mock token: test-1')
    expect(mockTokenProvider).toHaveBeenCalledTimes(1)
    expect(mockTokenProvider).toHaveBeenCalledWith(MOCK_REQUEST)
})