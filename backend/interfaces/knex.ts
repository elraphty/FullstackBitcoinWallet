export interface User {
    id?: number;
    email: string;
    password?: string;
    pk?: string;
    pub?: string;
}

export interface P2SH {
    id?: number;
    userid?: number;
    address: string;
    redeem?: string;
}

export interface UserLogin extends User {
    token: string;
}