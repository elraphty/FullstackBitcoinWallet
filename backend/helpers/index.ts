import { Response } from "express";
import { DataResponse } from "../interfaces";

export const responseSuccess = (res: Response, status: number, msg: string, data: any): void => {
    const result: DataResponse = {
        msg,
        data
    }

    res.status(status).send(result);
};