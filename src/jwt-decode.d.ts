// src/jwt-decode.d.ts
declare module 'jwt-decode' {
    export default function jwt_decode<T = any>(token: string): T;
}
