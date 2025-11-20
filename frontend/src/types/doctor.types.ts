import { Gender } from "./auth.types";

export interface DoctorInput {
  name: string;
  parent_last_name: string;
  maternal_last_name?: string;
  username: string;
  password: string;
  phone_number?: string;
  birthday?: string; // YYYY-MM-DD
  gender?: Gender;
  specialty: string;
  license: string;
}