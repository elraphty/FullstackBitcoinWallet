import { Response } from "express";
import { ValidationError } from "express-validator";
import { DataResponse, ErrorResponse, ErrorValidationResponse } from "../interfaces";

export const responseSuccess = (res: Response, status: number, msg: string, data: any): Response => {
    const result: DataResponse = {
        msg,
        data
    }

    return res.status(status).send(result);
};

export const responseError = (res: Response, status: number, msg: string): void => {
    const result: ErrorResponse = {
        msg,
    }

    res.status(status).send(result);
};

export const responseErrorValidation = (res: Response, status: number, errors: ValidationError[]): void => {
    const result: ErrorValidationResponse = {
        msg: 'Validation Error',
        errors,
    }

    res.status(status).send(result);
};