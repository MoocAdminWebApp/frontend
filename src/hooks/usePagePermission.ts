import { useSelector } from "react-redux"; // allows functional components to extract and access data from the Redux store.

/**  Customized hook: usePagePermission
 * use page prefix to filter user's related permission in the current page
 * e.g. "Course" --> check whether the user has "course:view", "course:create", "course:update", "course:delete"
 * @param pagePrefix page prefix, such as "course"、"user"
 * @param actions defaultly set to ["create", "view", "update", "delete"]
 * @returns { [action: string]: boolean } indicating whether each action is authorised
 */
export function usePagePermission(
  pagePrefix: string,
  actions: string[] = ["create", "update", "delete", "view", "assign"]
): { renderPage: Record<string, boolean> } {
  // Retrieve user's all the permission list from redux
  const allPermissions = useSelector((state: any) => state.auth.permissions);

  // construct the object that indicating whether the corresponding operation is allowed
  const renderPage: Record<string, boolean> = {};

  for (const action of actions) {
    renderPage[action] = allPermissions.includes(`${pagePrefix}:${action}`);
  }
  return { renderPage };
}
