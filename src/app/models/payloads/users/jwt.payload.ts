import { User } from "./user.model";


export interface JwtInfo {
    aud: string;
    exp: number;
    iat: number;
    iss: string;
}

export type JwtPayload = Pick<User, "id" | "email"> & JwtInfo;
