export type ChapterStatus = "DRAFT" | "PUBLISHED" | "HIDDEN";

export interface CreateChapterDto {
  chapterNumber: number;
  courseId: number;
  title: string;
  description?: string | null;
  orderNum?: number;
  status?: ChapterStatus;
  content?: string | null;
  videoUrl?: string | null;
  duration?: number | null;
  createdBy?: number | null;
  updatedBy?: number | null;
}


export interface ChapterDto {
  id?: number;
  chapterNumber: number;
  courseId: number;
  title: string;
  description?: string | null;
  orderNum: number;
  status: "DRAFT" | "PUBLISHED" | "HIDDEN";
  content?: string | null;
  videoUrl?: string | null;
  duration?: number | null;
  createdBy?: number | null;
  updatedBy?: number | null;
}

export type UpdateChapterDto = ChapterDto; // 或者直接用 ChapterDto 代替
