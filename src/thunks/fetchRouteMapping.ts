// thunk/fetchRouteMapping.ts
import { get } from "../request/axios";
import { AppThunk } from "../store/store";
import { setRouteMap } from "../store/PermissionSlice";

export const fetchRouteMapping = (): AppThunk => async (dispatch) => {
  try {
    const resp = await get<{ id: number; route: string }[]>(`/menus/route`);
    if (resp.isSuccess && Array.isArray(resp.data)) {
      const map: Record<string, number> = {};
      for (const item of resp.data) {
        if (item.route) {
          map[item.route] = item.id;
        }
      }
      dispatch(setRouteMap(map));
    } else {
      console.error("Failed to fetch route mapping", resp.message);
    }
  } catch (err) {
    console.error("Error fetching route mapping", err);
  }
};
