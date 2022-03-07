export interface User {
    id?: number;
    email: string;
    password?: string;
}

export interface UserLogin extends User {
    token: string;
}