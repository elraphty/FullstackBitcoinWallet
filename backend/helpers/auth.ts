import { NextFunction, Request, Response } from 'express';
import { verifyUser } from './jwt';
import { responseError } from '.';
import { User } from '../interfaces/knex';
import { RequestUser } from '../interfaces';
interface TokenData {
  data: User
};

export const authUser = (req: Request, res: Response, next: NextFunction) => {
  // check if there is an authorization header
  if (!req.headers.authorization) return responseError(res, 503, 'Unauthorized');
  else {

    const token = req.headers.authorization.substring(7);

    verifyUser(token, (err: string, ans: TokenData) => {
      if (err) {
        return responseError(res, 503, 'Not an authorized user');
      }

      const reqUser = req as RequestUser;

      // set user to session
      reqUser.user = ans.data;

      return next();
    });
  }
};
