import { Response } from "express";
import { DataResponse, ErrorResponse } from "../interfaces";

export const responseSuccess = (res: Response, status: number, msg: string, data: any): void => {
    const result: DataResponse = {
        msg,
        data
    }

    res.status(status).send(result);
};

export const responseError = (res: Response, status: number, msg: string): void => {
    const result: ErrorResponse = {
        msg,
    }

    res.status(status).send(result);
};