import store from "./store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useEffect, useRef, useState, useMemo } from "react";

import { del, get, post, put } from "../request/axios/index";
import { MenuDto } from "../types/menu";
import { MenuType, StatusType } from "../types/enum";
import { ListResultDto } from "../types/types";
import { buildSidebarStructure } from "../utils/treeStructureUtil";

// Importing icons for the sidebar menu
import {
  // System Management
  Settings as SystemMgmtIcon,
  AdminPanelSettings as RoleIcon,
  Widgets as MenuIcon,
  Person as UserIcon,
  Security as PermissionIcon,

  // Course Management
  MenuBook as CourseMgmtIcon,
  School as CourseIcon,
  EventAvailable as CourseOfferingIcon,
  ViewModule as ChapterIcon,
  Category as CategoryIcon,
  ViewCarousel as CarouselIcon,

  // Exam Management
  Assignment as ExamMgmtIcon,
  Quiz as QuestionBankIcon,

  // Default
  HelpOutline as DefaultIcon,
} from "@mui/icons-material";

export const initSidebarMenu = async () => {
  const resp = await get<MenuDto[]>("/menus");
  if (resp.isSuccess) {
    const structured = buildSidebarStructure(resp.data);
    store.dispatch(
      setPermissions({
        menuItems: structured,
        permissions: [],
      })
    );
  }
};

interface PermissionState {
  menuItems: Array<MenuDto> | null;
  permissions: Array<string> | null;
}

const getInitialState = (): PermissionState => {
  // let sidebardata;
  const getsidebardata = async () => {
    const resp = await get<MenuDto[]>(`/menus`);
    if (resp.isSuccess) {
      const convertedSidebarData = buildSidebarStructure(resp.data);
      console.log("sidebar construction data:", convertedSidebarData);
      // sidebardata = convertedSidebarData;
    }
  };
  getsidebardata();

  return {
    permissions: null,
    // Attention: The sidebar is set to dynamically loading based on the DB data (menu table), but the following hardcoded data is kept before all the functions are settle down
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
        icon: DefaultIcon,
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
        icon: DefaultIcon,
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
            icon: DefaultIcon,
          },
          {
            id: 3,
            title: "Custom Component Demo",
            permission: "",
            comment: "",
            menuType: MenuType.Menu,
            status: StatusType.Active,
            level: 2,
            parentId: 1,
            route: "CustomDemo",
            componentPath: "./pages/customDemo/index.jsx",
            orderNum: 0,
            children: [],
            icon: DefaultIcon,
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
            icon: DefaultIcon,
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
            icon: DefaultIcon,
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
            icon: DefaultIcon,
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
            icon: DefaultIcon,
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
            icon: DefaultIcon,
          },
        ],
        permission: "",
        comment: "",
        icon: DefaultIcon,
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
            route: "", // "Category" is a placeholder, adjust as needed
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
            componentPath: "./pages/course/index.tsx",
            orderNum: 1,
            children: [],
            icon: DefaultIcon,
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
            route: "", // "Chapter" is a placeholder, adjust as needed
            componentPath: "../pages/chapter/index.tsx",
            orderNum: 2,
            children: [],
            icon: DefaultIcon,
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
            icon: DefaultIcon,
          },
        ],
        permission: "",
        comment: "",
        icon: DefaultIcon,
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
            icon: DefaultIcon,
          },
        ],
        permission: "",
        comment: "",
        icon: DefaultIcon,
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
