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

export interface LoginResultDto {
  // userId: number;
  // userName: string;
  // email: string;
  data: string;
  //refreshToken: string;
  // expiresTime: number;
}

//used for UserForm
// export interface UserDto extends BaseEntityDto {
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   access: EAccessType;
//   active: boolean;
//   createBy: Date;
//   updateBy: Date;
// }

export interface UserDto extends BaseEntityDto {
  title: string;
  mark: string;
  count: number;
  acitve: boolean;
  dataTime: Date;
}

export interface CreateOrUpdateUserBaseDto {
  id: number; // When id==0, it indicates a new addition; otherwise, it indicates an update
  title: string;
  mark: string;
  count: number;
  acitve: boolean;
  dataTime: Date;
}

export interface CreateUserDto extends CreateOrUpdateUserBaseDto {}

export interface UpdateUserDto extends CreateOrUpdateUserBaseDto {}
