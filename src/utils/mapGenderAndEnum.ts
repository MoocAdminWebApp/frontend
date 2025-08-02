import { Gender } from "../types/enum";

export const mapGenderStringToEnum = (genderStr: string | ""| undefined): Gender => {
  if(!genderStr)
  return Gender.Other
    
  switch (genderStr.toLowerCase()) {
    case "MALE":
      return Gender.Male;
    case "FEMALE":
      return Gender.Female;
    case "OTHER":
    default:
      return Gender.Other;
  }
};

export const mapGenderEnumToString = (gender: Gender): string => {
  switch (gender) {
    case Gender.Male:
      return "MALE";
    case Gender.Female:
      return "FEMALE";
    case Gender.Other:
    default:
      return "OTHER";
  }
};