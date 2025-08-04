import { useEffect, useState, useMemo } from "react";
import { get } from "../request/axios";

/**
 * Obtain the permission prefix based on menuId
 */
export function usePagePrefixFromMenuId(menuId: number | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagePrefix, setPagePrefix] = useState<string>("");

  // 🚫 Skip fetch if no menuId
  const shouldFetch = useMemo(() => !!menuId, [menuId]);

  useEffect(() => {
    if (!shouldFetch) return;

    const fetchPrefix = async () => {
      setLoading(true);
      setError(null);

      try {
        const resp = await get(`/menus/permissionprefix/${menuId}`);
        if (resp.isSuccess && typeof resp.data === "string") {
          const prefix = resp.data.trim();
          console.log("Permission Prefix Fetched:", prefix);
          setPagePrefix(prefix);
        } else {
          setPagePrefix("");
        }
      } catch (err) {
        console.error("Error fetching permission prefix:", err);
        setError("Failed to load permission prefix");
      } finally {
        setLoading(false);
      }
    };

    fetchPrefix();
  }, [shouldFetch, menuId]);

  // ✅ Memoized return to avoid triggering re-renders
  return useMemo(
    () => ({ pagePrefix, loading, error }),
    [pagePrefix, loading, error]
  );
}
