import { useEffect, useState } from "react";

/**
 * Custom hook to track the currently active sidebar menu ID.
 * The value is stored in localStorage and read on component mount.
 */
const useActiveMenuId = (): number | null => {
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("activeMenuId");
    if (storedId !== null) {
      const parsed = parseInt(storedId, 10);
      if (!isNaN(parsed)) {
        setActiveMenuId(parsed);
      }
    }
  }, []);

  return activeMenuId;
};

export default useActiveMenuId;
