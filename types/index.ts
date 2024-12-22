export type AuthResponse = {
    error: string;
} | {
    success: true;
    message: string;
} | void;