import { Response } from "light-my-request";

const expectResponse = (res: Response, statusCode: number, body?: string) => {
    expect(res.statusCode).toBe(statusCode)
    if (body !== undefined) {
        expect(res.body).toBe(body)
    }
}

export const expectSuccess = (res: Response) => {
    expectResponse(res, 200, 'Success')
}

export const expectUnauthorized = (res: Response) => {
    expectResponse(res, 401)
}

export const expectForbidden = (res: Response, message: string) => {
    expectResponse(res, 403)
    expect(res.json<{ message: string}>().message).toBe(message)
}