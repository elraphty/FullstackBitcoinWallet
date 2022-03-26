export interface User {
    id?: number;
    email: string;
    password?: string;
    pk?: string;
    pub?: string;
}

export interface UserLogin extends User {
    token: string;
}