export interface CategoryColumn {
  key: string;
  label: string;
  width: string;
  align?: "left" | "center" | "right";
}

export const categoryColumns: CategoryColumn[] = [
  { key: "id", label: "ID", width: "10%", align: "left" },
  { key: "name", label: "Name", width: "35%", align: "left" },
  { key: "public", label: "Public", width: "15%", align: "left" },
  { key: "createdAt", label: "Created At", width: "25%", align: "left" },
  { key: "action", label: "Action", width: "15%", align: "left" },
];

export const getColumnWidth = (key: string): string => categoryColumns.find((col) => col.key === key)?.width || "auto";

export const getColumnAlign = (key: string): string => categoryColumns.find((col) => col.key === key)?.align || "left";
