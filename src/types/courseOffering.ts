import { Dayjs } from "dayjs";
export interface CourseOfferingDto{
    id:number;
    courseName:string;
    teacherName:string;
    semester:string;
    location:string;
    schedule:string;
    status:number;
    courseId:number;
    courseCode:string;
    capacity:number;
    enrolledCount:number;
    createdBy:number;
    updatedBy:number;
    createdAt:Date;
    updatedAt:Date;
}

export interface CreateCourseOfferingDto{
    courseName:string;
    teacherName:string;
    semester:string;
    location:string;
    schedule:string;
    status:number | string;
    courseId:number | string;
    courseCode:string;
    capacity:number;
}

export interface UpdateCourseOfferingDto extends CreateCourseOfferingDto{
    id:number;
}

export interface CourseOfferingFormValues {
  id?: number;
  courseId: number | string;
  courseCode: string;
  courseName: string;
  teacherName: string;
  semester: string;
  location: string;
  schedule: [Dayjs | null, Dayjs | null]; 
  status: number | string;
  capacity: number;
}