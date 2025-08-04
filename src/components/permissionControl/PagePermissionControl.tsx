// components/PagePermissionControl.tsx
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Page403 from "../../pages/page403";

interface Props {
  prefix: string;
  children: React.ReactNode;
}

const PagePermissionControl: React.FC<Props> = ({ prefix, children }) => {
  const permissions = useSelector(
    (state: RootState) => state.permission.permissions
  );

  if (!permissions?.includes(`${prefix}:viewall`)) {
    return <Page403 />;
  }

  return <>{children}</>;
};

export default PagePermissionControl;
