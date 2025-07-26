export interface CourseDto {
  id: number;
  courseName: string;
  courseDescription?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  instructorId: number;
  instructor?: {
    id: number;
    name: string;
    email?: string;
  };
  createdAt: string; // 或 Date，根据你的使用习惯
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

