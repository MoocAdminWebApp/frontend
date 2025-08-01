export const formatDateTime = (params: any): string => {
  if (!params) return "-";
  try {
    return new Date(params).toLocaleString(); // yyyy-mm-dd
  } catch (e) {
    return "-";
  }
};
