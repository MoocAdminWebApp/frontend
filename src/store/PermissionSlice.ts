import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MenuDto } from "../types/menu";
import { MenuType } from "../types/enum";
import { Home as HomeIcon ,People as PeopleIcon, AdminPanelSettings as RoleIcon, School as CourseOfferingIcon, Quiz as QuizIcon, MenuBook as MenuBookIcon} from "@mui/icons-material";

interface PermissionState {
  menuItems: Array<MenuDto> | null;
  permissions: Array<string> | null;
}

const getInitialState = (): PermissionState => {
  return {
    permissions: null,
    menuItems: [
      {
        id: 0,
        title: "Dashboard",
        orderNum: -1,
        level: 0,
        menuType: MenuType.Menu,
        route: "/",
        componentPath: "./pages/Dashboard.jsx",
        children: [],
        permission: "",
        mark: "",
        icon: HomeIcon,
      },
      {
        id: 1,
        title: "Demo Menu",
        parentId: null,
        route: "",
        permission: "",
        componentPath: "",
        orderNum: 0,
        mark: "",
        menuType: MenuType.Dir,
        level: 2,
        icon:HomeIcon,
        children: [
          {
            id: 2,
            title: "Demo",
            permission: "Demo.Page",
            mark: "",
            menuType: MenuType.Menu,
            level: 2,
            parentId: 1,
            route: "Demo",
            componentPath: "./pages/demo/index.jsx",
            orderNum: 0,
            children: [],
            icon:HomeIcon
          },
        ],
      },
      {
        id: 2,
        title: "Admin Menu",
        parentId: null,
        route: "",
        permission: "",
        componentPath: "",
        orderNum: 0,
        mark: "",
        menuType: MenuType.Dir,
        level: 2,
        icon:PeopleIcon,
        children: [
          {
            id: 2,
            title: "User",
            permission: "",
            mark: "",
            menuType: MenuType.Menu,
            level: 2,
            parentId: 1,
            route: "User",
            componentPath: "./pages/demo/index.jsx",
            orderNum: 0,
            children: [],
            icon:PeopleIcon
          },
          {
            id: 3,
            title: "Role",
            permission: "",
            mark: "",
            menuType: MenuType.Menu,
            level: 2,
            parentId: 1,
            route: "Role",
            componentPath: "./pages/demo/index.jsx",
            orderNum: 0,
            children: [],
            icon:RoleIcon
          },
          {
            id: 4,
            title: "CourseOffering", 
            permission: "",         
            mark: "",
            menuType: MenuType.Menu,
            level: 2,
            parentId: 100,
            route: "CourseOffering", 
            componentPath: "./pages/courseOffering/index.tsx",
            orderNum: 0,
            children: [],
            icon: CourseOfferingIcon, 
          },
          {
            id: 5,
            title: "QuestionBank", 
            permission: "",         
            mark: "",
            menuType: MenuType.Menu,
            level: 2,
            parentId: 100,
            route: "QuestionBank", 
            componentPath: "./pages/QuestionBank/index.tsx",
            orderNum: 0,
            children: [],
            icon: QuizIcon, 
          },
        ],
      },
      {
        id: 3,
        title: "Course Menu",
        parentId: null,
        route: "",
        permission: "",
        componentPath: "",
        orderNum: 0,
        mark: "",
        menuType: MenuType.Dir,
        level: 2,
        icon:PeopleIcon,
        children: [
          {
            id: 2,
            title: "Course",
            permission: "",
            mark: "",
            menuType: MenuType.Menu,
            level: 2,
            parentId: 1,
            route: "Course",
            componentPath: "./pages/demo/index.jsx",
            orderNum: 0,
            children: [],
            icon:MenuBookIcon
          },
        ],
      },
    ],
  };
};

const permissionSlice = createSlice({
  name: "permission",
  initialState: getInitialState(),
  reducers: {
    setPermissions(
      state,
      action: PayloadAction<{
        menuItems: Array<MenuDto>;
        permissions: Array<string>;
      }>
    ) {
      state.menuItems = action.payload.menuItems;
      state.permissions = action.payload.permissions;
      localStorage.setItem(
        "user_menuItems",
        JSON.stringify(action.payload.menuItems)
      );
      localStorage.setItem(
        "user_permissions",
        JSON.stringify(action.payload.permissions)
      );
    },
    clearPermissions(state) {
      state.menuItems = null;
      state.permissions = null;
      localStorage.removeItem("user_menuItems");
      localStorage.removeItem("user_permissions");
    },
  },
});

export const { setPermissions, clearPermissions } = permissionSlice.actions;
export default permissionSlice.reducer;