// src/components/BtnPermissionControl.tsx

import React from "react";

interface BtnPermissionControlProps {
  hasAccess: boolean;
  children: React.ReactNode;
}

const BtnPermissionControl: React.FC<BtnPermissionControlProps> = ({
  hasAccess,
  children,
}) => {
  if (!hasAccess) return null;
  return <>{children}</>;
};

export default BtnPermissionControl;
