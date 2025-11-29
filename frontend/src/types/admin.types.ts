import { Gender } from "./auth.types";

export interface AdminInput {
    name: string;
    parent_last_name: string;
    maternal_last_name?: string;
    username: string;
    password: string;
    phone_number?: string;
    birthday?: string;
    gender?: Gender;
}
