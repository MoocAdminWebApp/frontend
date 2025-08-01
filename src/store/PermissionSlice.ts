import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MenuDto } from "../types/menu";
import { MenuType, StatusType } from "../types/enum";
import {
  Home as HomeIcon,
  People as PeopleIcon,
  SupervisorAccount as RoleIcon,
  School as CourseOfferingIcon,
  Quiz as QuizIcon,
} from "@mui/icons-material";

// Importing icons for the sidebar menu
// System Management
import SettingsIcon from "@mui/icons-material/Settings";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import WidgetsIcon from "@mui/icons-material/Widgets";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";

// Course Management
import SchoolIcon from "@mui/icons-material/School";
import CategoryIcon from "@mui/icons-material/Category";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";

// Exam Management
// import QuizIcon from "@mui/icons-material/Quiz";
import AssignmentIcon from "@mui/icons-material/Assignment";

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
        status: StatusType.Active,
        comment: "",
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
        comment: "",
        status: StatusType.Active,
        menuType: MenuType.Dir,
        level: 2,
        icon: HomeIcon,
        children: [
          {
            id: 2,
            title: "Demo",
            permission: "",
            comment: "",
            menuType: MenuType.Menu,
            status: StatusType.Active,
            level: 2,
            parentId: 1,
            route: "Demo",
            componentPath: "./pages/demo/index.jsx",
            orderNum: 0,
            children: [],
            icon: HomeIcon,
          },
        ],
      },

      // New Menu Items
      {
        id: 10,
        title: "System Management",
        parentId: null,
        route: "",
        orderNum: 0,
        level: 1,
        menuType: MenuType.Dir,
        status: StatusType.Active,
        componentPath: "",
        children: [
          {
            id: 11,
            title: "Role",
            permission: "",
            comment: "",
            menuType: MenuType.Menu,
            status: StatusType.Active,
            level: 2,
            parentId: 1,
            route: "Role",
            componentPath: "./pages/role/index.jsx",
            orderNum: 0,
            children: [],
            icon: AdminPanelSettingsIcon,
          },
          {
            id: 12,
            title: "User",
            permission: "",
            comment: "",
            menuType: MenuType.Menu,
            status: StatusType.Active,
            level: 2,
            parentId: 1,
            route: "User",
            componentPath: "./pages/user/index.jsx",
            orderNum: 0,
            children: [],
            icon: PersonIcon,
          },
          {
            id: 13,
            title: "Menu",
            permission: "",
            comment: "",
            menuType: MenuType.Menu,
            status: StatusType.Active,
            level: 2,
            parentId: 1,
            route: "Menu",
            componentPath: "../pages/menu/index.tsx",
            orderNum: 2,
            children: [],
            icon: WidgetsIcon,
          },
          {
            id: 14,
            title: "Permission",
            permission: "",
            comment: "",
            menuType: MenuType.Menu,
            status: StatusType.Active,
            level: 2,
            parentId: 1,
            route: "", // "Permission" is a placeholder, adjust as needed
            componentPath: "../pages/permission/index.tsx",
            orderNum: 3,
            children: [],
            icon: SecurityIcon,
          },
          {
            id: 15,
            title: "Menu Tree Testing",
            permission: "",
            comment: "",
            menuType: MenuType.Menu,
            status: StatusType.Active,
            level: 2,
            parentId: 1,
            route: "MenuTree",
            componentPath: "../pages/menuTree/index.tsx",
            orderNum: 2,
            children: [],
            icon: WidgetsIcon,
          },
        ],
        permission: "",
        comment: "",
        icon: SettingsIcon,
      },

      {
        id: 20,
        title: "Course Management",
        orderNum: 0,
        level: 1,
        menuType: MenuType.Dir,
        status: StatusType.Active,
        parentId: null,
        route: "",
        componentPath: "",
        children: [
          {
            id: 21,
            title: "Categories",
            permission: "",
            comment: "",
            menuType: MenuType.Menu,
            status: StatusType.Active,
            level: 2,
            parentId: 1,
            route: "Category", // "Category" is a placeholder, adjust as needed
            componentPath: "../pages/category/index.tsx",
            orderNum: 0,
            children: [],
            icon: CategoryIcon,
          },
          {
            id: 22,
            title: "Courses",
            permission: "",
            comment: "",
            menuType: MenuType.Menu,
            status: StatusType.Active,
            level: 2,
            parentId: 1,
            route: "Course", // "Course" is a placeholder, adjust as needed
            componentPath: "../pages/course/index.tsx",
            orderNum: 1,
            children: [],
            icon: MenuBookIcon,
          },
          {
            id: 23,
            title: "Chapters",
            permission: "",
            comment: "",
            menuType: MenuType.Menu,
            status: StatusType.Active,
            level: 2,
            parentId: 1,
            route: "Chapter", // "Chapter" is a placeholder, adjust as needed
            componentPath: "../pages/chapter/index.tsx",
            orderNum: 2,
            children: [],
            icon: ImportContactsIcon,
          },
          {
            id: 24,
            title: "Course Offering",
            permission: "",
            comment: "",
            menuType: MenuType.Menu,
            status: StatusType.Active,
            level: 2,
            parentId: 100,
            route: "CourseOffering",
            componentPath: "./pages/courseOffering/index.tsx",
            orderNum: 0,
            children: [],
            icon: CourseOfferingIcon,
          },
          {
            id: 25,
            title: "Carousel",
            permission: "",
            comment: "",
            menuType: MenuType.Menu,
            status: StatusType.Active,
            level: 2,
            parentId: 1,
            route: "Carousel",
            componentPath: "./pages/carousel/index.jsx",
            orderNum: 4,
            children: [],
            icon: ViewCarouselIcon,
          },
        ],
        permission: "",
        comment: "",
        icon: SchoolIcon,
      },

      {
        id: 30,
        title: "Exam Management",
        orderNum: 0,
        level: 1,
        menuType: MenuType.Dir,
        status: StatusType.Active,
        parentId: null,
        route: "",
        componentPath: "",
        children: [
          {
            id: 31,
            title: "Question Bank",
            permission: "",
            comment: "",
            menuType: MenuType.Menu,
            status: StatusType.Active,
            level: 2,
            parentId: 100,
            route: "QuestionBank",
            componentPath: "./pages/QuestionBank/index.tsx",
            orderNum: 0,
            children: [],
            icon: QuizIcon,
          },
        ],
        permission: "",
        comment: "",
        icon: AssignmentIcon,
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
      localStorage.setItem("user_menuItems", JSON.stringify(action.payload.menuItems));
      localStorage.setItem("user_permissions", JSON.stringify(action.payload.permissions));
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
