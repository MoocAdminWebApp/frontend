export interface CourseDto {
  id: number;
  courseName: string;
  courseDescription?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  instructorId: number;
  instructor?: {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
  };
  createdAt: string; 
  updatedAt: string;
}

export interface CreateCourseDto {
  courseName: string;
  courseDescription?: string;
  instructorId: number;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export interface UpdateCourseDto extends CreateCourseDto {
  id: number;
}

