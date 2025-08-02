import { BaseEntityDto } from "./types";
import { EAccessType } from "./enum";

/******
 ** The following interfaces are used for login
 *******/
export interface User {
  userId: number;
  profileId:number;
  email?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone:string;
  address:string;
  birthdate:string;
  gender:string;
}
export interface LoginResultDto {
  // userId: number;
  // userName: string;
  // email: string;
  data: string;
  //refreshToken: string;
  // expiresTime: number;
}

/******
 ** The following interfaces are used for user management
 *******/
export interface UserDto extends BaseEntityDto {
  email: string;
  firstName: string;
  lastName: string;
  access: EAccessType;
  active: boolean;
}

export interface CreateOrUpdateUserBaseDto {
  id: number; // When id==0, it indicates a new addition; otherwise, it indicates an update
  email: string;
  firstName: string;
  lastName: string;
  access: EAccessType;
  active: boolean;
}

export interface CreateUserDto extends CreateOrUpdateUserBaseDto {}

export interface UpdateUserDto extends CreateOrUpdateUserBaseDto {}
