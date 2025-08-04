// src/components/BtnPermissionControl.tsx

import React from "react";
import { usePagePermission } from "../../hooks/usePagePermission";

interface BtnPermissionControlProps {
  /** Determine whether:
   * case 1: the rendering decision has been made by the parent page already, or
   * case 2: need to be figured out here
   */
  isDirectRendering?: boolean;
  /** case 1:
   * the rendering decision has been directly passed from the parent page
   * implementation: Create New XXX Button, Assign XXX Button
   */
  hasAccess?: boolean;
  children: React.ReactNode;

  /** case 2:
   * the parent page passes its prefix and the actions contained here, and requires the hook to decide whether to render the corresponding component
   * implementation: Edit/Delete/View Buttons for each row
   */
  pagePrefix?: string;
  action?: string;
}

const BtnPermissionControl: React.FC<BtnPermissionControlProps> = ({
  isDirectRendering = true,
  pagePrefix,
  action = "",
  hasAccess,
  children,
}) => {
  const actions = action ? [action] : [];
  const { renderPage } = usePagePermission(pagePrefix || "", actions);
  const hasRenderPermission = renderPage?.[action];
  // case 1: direct rendering
  if (isDirectRendering) {
    return hasAccess ? <>{children}</> : null;
  }

  // case 2: use usePagePermission hook
  return hasRenderPermission ? <>{children}</> : null;
};

export default BtnPermissionControl;
