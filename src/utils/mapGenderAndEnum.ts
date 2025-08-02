import { Gender } from "../types/enum";

export const mapGenderStringToEnum = (genderStr: string | ""| undefined): number => {
  if(!genderStr)
  return Gender.Other
  switch (genderStr) {
    case "MALE":
      return Gender.Male;
    case "FEMALE":
      return Gender.Female;
    case "OTHER":
    default:
      return Gender.Other;
  }
};

export const mapGenderEnumToString = (gender: number): string => {
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