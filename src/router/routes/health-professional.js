import { checkIsLoggedIn } from "@/common/lib/route-guard"

export default [
  {
    path: "/",
    component: () => import(/* webpackChunkName */ "@/views/Dashboard/HealthProfessional/Layout"),
    beforeEnter: checkIsLoggedIn,
    name: "health-professional",
    redirect: { name: "hp-dashboard" },
    children: [
      {
        path: "/health-professional",
        name: "hp-dashboard",
        meta: { pageHeader: "Dashboard", parent: "health-professional" },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/HealthProfessional/Home")
        // beforeEnter: checkAccountStatus
      },
      {
        path: "/health-professional/account",
        name: "hp-account",
        meta: { pageHeader: "Account", parent: "health-professional" },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/HealthProfessional/Account")
        // beforeEnter: checkAccountStatus
      }
    ]
  }
]
