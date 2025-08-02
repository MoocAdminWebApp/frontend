export interface CourseDto {
  id: number;
  courseName: string;
  courseDescription?: string;
  courseCode?:string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  instructorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseDto {
  id?: number;
  courseName: string;
  courseDescription?: string;
  courseCode?:string;
  instructorId: number;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export interface UpdateCourseDto extends CreateCourseDto {
  id: number;
}

