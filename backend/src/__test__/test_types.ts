export interface Tokens {
    [role: string]: { access_token: string; id: string };
}

export interface AuthResponse {
    access_token: string;
    username: string;
    roles: string[];
    active: boolean;
    id: string;
}

export interface NoteObject {
    user: string;
    title: string;
    text: string;
}
