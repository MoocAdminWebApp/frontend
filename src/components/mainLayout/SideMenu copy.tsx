import * as React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { usePagePrefixFromMenuId } from "../../hooks/usePagePrefixFromMenuId";

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

import { RootState } from "../../store/store";
import { MenuDto } from "../../types/menu";
import { MenuType } from "../../types/enum";

const SideMenu: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { menuItems } = useSelector((state: RootState) => state.permission);

  const [openIds, setOpenIds] = useState<number[]>([]); // Expanded/Collapsed menus
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null); // clicked menu

  const { pagePrefix } = usePagePrefixFromMenuId(activeMenuId);

  const toggleOpen = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const onMenuClick = (menuId: number) => {
    setActiveMenuId(menuId);
  };

  const renderMenu = (
    items: MenuDto[],
    currentPath: string,
    openIds: number[],
    toggleOpen: (id: number) => void
  ) => {
    return items.map((item) => {
      const children =
        item.children?.filter((child) => child.menuType !== MenuType.Btn) ?? [];

      return (
        item.menuType !== MenuType.Btn && (
          <React.Fragment key={item.id}>
            <ListItem
              key={item.id}
              component={item.route ? Link : "div"}
              to={item.route}
              onClick={() => {
                onMenuClick(item.id); // update activeMenuId everytime clicking the item
                if (children.length > 0) toggleOpen(item.id);
              }}
              sx={{
                backgroundColor:
                  currentPath === item.route ? "#e0e0e0" : "transparent",
                mb: 1,
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: currentPath === item.route ? "#1976d2" : "inherit",
                }}
              >
                {item.icon && <item.icon />}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight:
                        currentPath === item.route ? "bold" : "normal",
                    }}
                  >
                    {item.title}
                  </Typography>
                }
              />
              {children.length > 0 && (
                <Box sx={{ ml: "auto" }}>
                  {openIds.includes(item.id) ? (
                    <ExpandMoreIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </Box>
              )}
            </ListItem>
            {children.length > 0 && (
              <Collapse
                in={openIds.includes(item.id)}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding sx={{ pl: 2 }}>
                  {renderMenu(children, currentPath, openIds, toggleOpen)}{" "}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        )
      );
    });
  };

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {menuItems && renderMenu(menuItems, currentPath, openIds, toggleOpen)}
    </List>
  );
};

export default SideMenu;
