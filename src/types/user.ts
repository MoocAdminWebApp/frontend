import { Gender } from "./enum";
import { RoleDto } from "./role";
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

export interface UserDto extends BaseEntityDto {
  userName: string;
  email?: string;
  age: number;
  phone?: string;
  address?: string;
  gender: Gender;
  avatar?: string;
  roles: RoleDto[];
}

export interface CreateOrUpdateUserBaseDto {
  id: number; // When id==0, it indicates a new addition; otherwise, it indicates an update
  userName: string;
  email?: string;
  age: number;
  phone?: string;
  address?: string;
  gender: Gender;
  avatar?: string;
  roleIds: number[];
}

export interface CreateUserDto extends CreateOrUpdateUserBaseDto {
  password: string;
}

export interface UpdateUserDto extends CreateOrUpdateUserBaseDto {
  roles: RoleDto[];
}
