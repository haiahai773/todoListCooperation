import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login.vue"),
    },
    {
      path: "/user",
      name: "user",
      component: () => import("@/views/user/user.vue"),
      children: [
        {
          path: "list",
          name: "list",
          component: () => import("@/components/list.vue"),
        },
        {
          path: "calendar",
          name: "calendar",
          component: () => import("@/components/calendar.vue"),
        },
        {
          path: "quation",
          name: "quation",
          component: () => import("@/components/quation.vue"),
        },
        {
          path: "tomato",
          name: "tomato",
          component: () => import("@/components/tomato.vue"),
        },
      ],
    },
    {
      path: "/orga",
      name: "orga",
      component: () => import("@/views/orga/orga.vue"),
      children: [
        {
          path: "member",
          name: "member",
          component: () => import("@/components/member.vue"),
        },
        {
          path: "asign",
          name: "asign",
          component: () => import("@/components/asign.vue"),
        },
        {
          path: "calendarOrga",
          name: "calendarOrga",
          component: () => import("@/components/calendarOrga.vue"),
        },
      ],
    },
  ],
});

//白名单，未登录也可以访问
const whiteList: Array<string> = ["/", "/login"];

const userList: Array<string> = ["/user/list", "/user/quation", "/user/tomato"];

//路由前置守卫做页面权限管理
router.beforeEach((to, from, next) => {
  console.log(to.path);

  //如果在白名单里，则直接通行
  if (whiteList.includes(to.path)) {
    next();
    return;
  }

  //如果有token，说明登陆了，放行 /user/list 和 /user/quation
  if (localStorage.getItem("token")) {
    if (userList.includes(to.path)) {
      next();
      return;
    } else {
      next("/login");
      return;
    }
  }

  //未登录，且访问权限页面则回到登录
  next("/login");
  return;
});

export default router;
