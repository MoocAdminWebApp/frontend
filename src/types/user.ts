
import { Gender } from "./enum";
import { BaseEntityDto } from "./types";

export interface User {
  userId: number;
  lastName: string;
  firstName: string;
  email?: string;
  avatar?: string;
}

export interface LoginResultDto {
  // userId: number;
  // userName: string;
  // email: string;
  data: string;
  //refreshToken: string;
  // expiresTime: number;
}


