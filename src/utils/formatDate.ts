export const formatDateValue = (value: any): string => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString(); 
  } catch (e) {
    return "-";
  }
};