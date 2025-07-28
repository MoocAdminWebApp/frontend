import internal from "stream";

export const formatDateValue = (params: any): string => {
  if (!params) return "";
  try {
    return new Date(params).toISOString().split("T")[0]; // yyyy-mm-dd
  } catch (e) {
    return "";
  }
};
