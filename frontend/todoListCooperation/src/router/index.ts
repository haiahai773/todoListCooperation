import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: ()=>import("@/views/login.vue") 
    },
    {
      path: "/user",
      name: "user",
      component: ()=>import("@/views/user/user.vue"),
      children: [
        {
          path: "list",
          name: "list",
          component: ()=>import("@/components/list.vue"),
        },
        {
          path: "calendar",
          name: "calendar",
          component: ()=>import("@/components/calendar.vue")
        },
        {
          path: "quation",
          name: "quation",
          component: ()=>import("@/components/quation.vue")
        },
        {
          path: "tomato",
          name: "tomato",
          component: ()=>import("@/components/tomato.vue")
        }
      ]
    },
    {
      path: "/orga",
      name: "orga",
      component: ()=>import("@/views/orga/orga.vue"),
      children: [
        {
          path: "member",
          name: "member",
          component: ()=>import("@/components/member.vue")
        },
        {
          path: "asign",
          name: "asign",
          component: ()=>import("@/components/asign.vue")
        },
        {
          path: "calendarOrga",
          name: "calendarOrga",
          component: ()=>import("@/components/calendarOrga.vue")
        }
      ]
    } 
  ]
})

export default router
