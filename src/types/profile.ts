import { BaseEntityDto } from "./types";
import { EGenderType } from "./enum";

/******
 ** The following interfaces are used for profile management
 *******/
export interface ProfileDto extends BaseEntityDto {
  countryCode?: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  city?: string;
  streetAddress?: string;
  postalCode?: string;
  birthdate?: string;
  gender: EGenderType;
  avatar?: string;
  bio?: string;
}

export interface CreateOrUpdateProfileDto extends ProfileDto {
  id: number; // When id==0, it indicates a new addition; otherwise, it indicates an update
}

export interface CreateProfileDto extends CreateOrUpdateProfileDto {}

export interface UpdateProfileDto extends CreateOrUpdateProfileDto {}
