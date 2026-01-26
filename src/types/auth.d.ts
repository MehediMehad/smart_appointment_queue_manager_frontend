export type TUserPayload = {
    userId: string;
    email: string;
    role: "USER" | "ADMIN";
    iat?: number;
    exp?: number;
};