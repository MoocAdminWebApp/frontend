export const getFullAvatarUrl = (avatarPath: string): string => {
  if (!avatarPath) return "";
  if (avatarPath.startsWith("http")) return avatarPath;
  return `${process.env.REACT_APP_BASE_API_URL}${avatarPath}`;
};
