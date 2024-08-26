export type Role = "employee" | "manager" | "admin";

export interface User {
    username: string;
    password: string;
    roles: Role[];
    active: boolean;
}
