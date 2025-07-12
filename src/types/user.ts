import { Gender } from "./enum";
import { BaseEntityDto } from "./types";
import { EAccessType } from "./enum";

//used for login
export interface User {
  userId: number;
  lastName: string;
  firstName: string;
  email?: string;
  avatar?: string;
}
//used for login
export interface LoginResultDto {
  // userId: number;
  // userName: string;
  // email: string;
  data: string;
  //refreshToken: string;
  // expiresTime: number;
}

//The following interfaces are used for user management
export interface UserDto extends BaseEntityDto {
  email: string;
  //password: string;
  firstName: string;
  lastName: string;
  access: EAccessType;
  active: boolean;
  // createAt: Date;
  // updateAt: Date;
  // createBy: number;
  // updateBy: number;
}

export interface CreateOrUpdateUserBaseDto {
  id: number; // When id==0, it indicates a new addition; otherwise, it indicates an update
  email: string;
  //password: string;
  firstName: string;
  lastName: string;
  access: EAccessType;
  active: boolean;
  // createAt: Date;
  // updateAt: Date;
  // createBy: number;
  // updateBy: number;
}

export interface CreateUserDto extends CreateOrUpdateUserBaseDto {}

export interface UpdateUserDto extends CreateOrUpdateUserBaseDto {}
