export interface User {
    id?: number;
    email: string;
    password?: string;
    pk?: string;
}

export interface UserLogin extends User {
    token: string;
}