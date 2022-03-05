import bcrypt from 'bcryptjs';

/**
 * @class BcryptHelper
 */


/**
 * this function hashes a password and returns the hash
 * @param {*} password
 */
export const hashPassword = (password: string): string => {
    const hash = bcrypt.hashSync(password, 10)
    return hash
}

/**
 *
 * @param {*} password
 * @param {*} hash
 * @param {*} callback
 */

export const verifyPassword = (password: string, hash: string): boolean => {
    return bcrypt.compareSync(password, hash);
};