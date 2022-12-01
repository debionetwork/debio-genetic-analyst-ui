import { checkIsLoggedIn } from "@/common/lib/route-guard"

export default [
  {
    path: "/health-professional",
    component: () => import(/* webpackChunkName */ "@/views/Dashboard/HealthProfessional/Layout"),
    beforeEnter: checkIsLoggedIn,
    name: "health-professional",
    redirect: { name: "hp-dashboard" },
    children: [
      {
        path: "/",
        name: "hp-dashboard",
        meta: { pageHeader: "Home", parent: "health-professional" },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/HealthProfessional/Home")
        // beforeEnter: checkAccountStatus
      },
      {
        path: "/account",
        name: "hp-account",
        meta: { pageHeader: "Account", parent: "health-professional" },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/HealthProfessional/Account")
        // beforeEnter: checkAccountStatus
      }
    ]
  }
]
