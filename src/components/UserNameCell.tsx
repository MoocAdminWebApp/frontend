import React from "react";
import { Typography } from "@mui/material";

interface UserNameCellProps {
  user?: {
    firstName?: string | null;
    lastName?: string | null;
  };
  fallback?: string;
}

const UserNameCell: React.FC<UserNameCellProps> = ({
  user,
  fallback = "Unknown",
}) => {
  if (!user) return <Typography>{fallback}</Typography>;

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return <Typography>{fullName || fallback}</Typography>;
};

export default UserNameCell;
