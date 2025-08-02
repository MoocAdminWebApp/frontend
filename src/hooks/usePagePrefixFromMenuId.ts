import { useEffect, useState } from "react";
import { get } from "../request/axios";

/**
 * Obtain the permission prefix based on menuId
 */
export function usePagePrefixFromMenuId(menuId: number | null) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagePrefix, setPagePrefixState] = useState<string | null>(null);

  useEffect(() => {
    if (!menuId) return;

    const fetchPrefix = async () => {
      setLoading(true);
      setError(null);

      try {
        const resp = await get(`/menus/permissionprefix/${menuId}`);
        if (resp.isSuccess && typeof resp.data === "string") {
          const permissionPrefix = resp.data.trim();
          console.log(`Permission Prefix: ${permissionPrefix}`);
          setPagePrefixState(permissionPrefix);
        } else {
          setPagePrefixState(null);
        }
      } catch (err) {
        setError("Failed to load permission prefix");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrefix();
  }, [menuId]);

  return { pagePrefix, loading, error };
}
