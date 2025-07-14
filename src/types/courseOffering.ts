export interface CourseOfferingDto{
    id:number;
    courseName:string;
    teacherName:string;
    semester:string;
    location:string;
    schedule:string;
    status:number;
    courseId:number;
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
    status:number;
    courseId:number;
    capacity:number;
}

export interface UpdateCourseOfferingDto extends CreateCourseOfferingDto{
    id:number;
}