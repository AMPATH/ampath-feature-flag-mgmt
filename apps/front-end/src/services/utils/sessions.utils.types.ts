interface SessionT {
    uuid: string;
    username: string;
    role_name: string;
    person_name: string;
    access_token: string;
    expires_at: string;
}

export type { SessionT }