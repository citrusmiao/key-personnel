import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/register",
    component: () => import("@/views/register/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/manage",
    meta: { title: "重点人员数据管理", icon: "el-icon-s-help" },
    alwaysShow: true,
    children: [
      {
        path: "manage",
        name: "manage",
        component: () => import("@/views/manage"),
        meta: { title: " 重点人员数据管理" },
      },
      {
        path: "information",
        name: "information",
        component: () => import("@/views/information"),
        meta: { title: " 重点人员信息展示" },
      },
    ],
  },
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    meta: { title: "重点人员数据查询", icon: "el-icon-s-help" },
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/home/home.vue"),
        meta: { title: " 大规模核酸检测数据查询服务" },
      },
      {
        path: "monitor",
        name: "Monitor",
        component: () => import("@/views/home/monitor.vue"),
        meta: { title: " 大规模核酸检测数据查询服务" },
      },
      {
        path: "monitorSD",
        name: "MonitorSD",
        component: () => import("@/views/home/monitorSD.vue"),
        meta: { title: " 当日未检人员数据查询" },
      },
      {
        path: "monitorOD",
        name: "MonitorOD",
        component: () => import("@/views/home/monitorOD.vue"),
        meta: { title: " 未1天1检人员数据查询" },
      },
      {
        path: "monitorTD",
        name: "MonitorTD",
        component: () => import("@/views/home/monitorTD.vue"),
        meta: { title: " 未3天2检人员数据查询" },
      },
      {
        path: "monitorSVD",
        name: "MonitorSVD",
        component: () => import("@/views/home/monitorSVD.vue"),
        meta: { title: " 未7天3检人员数据查询" },
      },
      {
        path: "control",
        name: "Control",
        component: () => import("@/views/home/control.vue"),
        meta: { title: "重点人员排查管控数据服务查询" },
      },
      {
        path: "track",
        name: "track",
        component: () => import("@/views/home/track.vue"),
        meta: { title: "轨迹" },
      },
    ],
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
