import * as React from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
} from '@mui/material';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  List as ListIcon,
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { MenuDto } from '../../types/menu';
import { MenuType } from '../../types/enum';
//import menuItems, { MenuItem } from '../../menuItems';

// 递归渲染树形菜单
const renderMenu = (items: MenuDto[], currentPath: string, openIds: number[], toggleOpen: (id: number) => void) => {
  return items.map((item) => {

    let children = item.children?.filter((child) => child.menuType !== MenuType.Btn);

    return item.menuType !== MenuType.Btn && (<React.Fragment key={item.id}>
      <ListItem
        key={item.id}
        component={item.route ? Link : 'div'}
        to={item.route}
        onClick={() => {
          if (children.length > 0) {
            toggleOpen(item.id);
          }
        }}
        sx={{
          backgroundColor: currentPath === item.route ? '#e0e0e0' : 'transparent',
          borderRadius: 1,
          mb: 1,
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        <ListItemIcon sx={{ color: currentPath === item.route ? '#1976d2' : 'inherit' }}>
          {item.icon || <HomeIcon />}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="body1" sx={{ fontWeight: currentPath === item.route ? 'bold' : 'normal' }}>
              {item.title}
            </Typography>
          }
        />
        {children.length > 0 && (
          <Box sx={{ ml: 'auto' }}>
            {openIds.includes(item.id) ? <ExpandMoreIcon /> : <ChevronRightIcon />}
          </Box>
        )}
      </ListItem>
      {children.length > 0 && (
        <Collapse in={openIds.includes(item.id)} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            {renderMenu(children, currentPath, openIds, toggleOpen)}
          </List>
        </Collapse>
      )}
    </React.Fragment>)

  });

};

const SideMenu: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [openIds, setOpenIds] = useState<number[]>([]);
  const { menuItems } = useSelector((state: RootState) => state.permission);
  // 切换菜单项的展开状态
  const toggleOpen = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {menuItems && renderMenu(menuItems, currentPath, openIds, toggleOpen)}
    </List>
  );
};

export default SideMenu;