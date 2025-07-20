import { BaseEntityDto } from "./types";

export interface QuestionDto extends BaseEntityDto {
  category: string;
  type: "Single" | "Multiple" | "ShortAnswer" | "TrueFalse";
  content: string;
  difficulty: "Easy" | "Medium" | "Hard";
  options: QuestionOptionDto[];
  dataTime: Date;
}

export interface QuestionOptionDto {
  id: number;
  content: string;
  isCorrect: boolean;
}

export interface CreateOrUpdateQuestionDto {
  id: number // When id==0, it indicates a new addition; otherwise, it indicates an update
  category: string;
  type: "Single" | "Multiple" | "ShortAnswer" | "TrueFalse";
  content: string;
  difficulty: "Easy" | "Medium" | "Hard";
  options: QuestionOptionDto[];
  dataTime: Date
}

export interface CreateQuestionDto extends CreateOrUpdateQuestionDto {}

export interface UpdateQuestionDto extends CreateOrUpdateQuestionDto {}
