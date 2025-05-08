import { BaseEntityDto } from "./types";

export interface DemoDto extends BaseEntityDto {
  title: string;
  mark: string;
  count: number;
  acitve: boolean;
  dataTime: Date;
}

export interface CreateOrUpdateDemoBaseDto {
  id: number; // When id==0, it indicates a new addition; otherwise, it indicates an update
  title: string;
  mark: string;
  count: number;
  acitve: boolean;
  dataTime: Date;
}

export interface CreateDemoDto extends CreateOrUpdateDemoBaseDto {}

export interface UpdateDemoDto extends CreateOrUpdateDemoBaseDto {}
