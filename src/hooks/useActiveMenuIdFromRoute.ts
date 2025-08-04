import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

/**
 * Hook to get active menuId from current pathname (using routeMap in Redux)
 * Automatically returns null if no match is found
 */
export function useActiveMenuIdFromRoute(): number | null {
  const location = useLocation();
  // console.log("Current pathname:", location.pathname);
  const routeMap = useSelector((state: RootState) => state.permission.routeMap);

  const pathname = location.pathname.replace("/", "");

  // If exact match is found in routeMap, return its id
  if (routeMap && Object.prototype.hasOwnProperty.call(routeMap, pathname)) {
    return routeMap[pathname];
  }

  return null;
}
