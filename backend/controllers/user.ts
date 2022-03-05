import { Request, Response, NextFunction } from 'express';
import knex from '../db/knex';
import { validationResult } from 'express-validator';
import { responseSuccess, responseErrorValidation, responseError } from '../helpers';
import { User } from '../interfaces/knex';
import { hashPassword, verifyPassword } from '../helpers/password';
import { signUser } from '../helpers/jwt';

// Controller for registering user
export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseErrorValidation(res, 400, errors.array());
        }

        const email: string = req.body.email;
        const pass: string = req.body.password;

        const count: User[] = await knex<User>('users').where({ email });

        if (count.length > 0) {
            return responseError(res, 404, 'User already exists');
        }

        const password: string = hashPassword(pass);

        await knex<User>('users').insert({ email, password });

        responseSuccess(res, 200, 'Successfully created user', {});
    } catch (err) {
        next(err);
    }
};

// Controller for user login
export const userLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseErrorValidation(res, 400, errors.array());
        }

        const email: string = req.body.email;
        const pass: string = req.body.password;

        const userCount = await knex<User>('users').count().where({ email }).first();

        if (Number(userCount?.count) > 0) {
            const user = await knex<User>('users')
                .where({email})
                .first()

            if (!verifyPassword(pass, user.password)) {
                return responseError(res, 404, 'Error with login')
            }

            const token = signUser(user);

            // // delete user password
            delete user.password

            // Add token to user object
            user.token = token

            return responseSuccess(res, 200, 'Successfully login', user)
        } else {
            return responseError(res, 404, 'Not a valid user')
        }
    } catch (err) {
        next(err);
    }
};