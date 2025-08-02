//has to be called after login with a valid roleId

export function getStoredPermissions(id: number): string[] {
  const raw = localStorage.getItem(`role_permissions_${id}`);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);

    // 确保解析后是非空数组且包含字符串项
    if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
      return parsed;
    }

    return [];
  } catch {
    return [];
  }
}