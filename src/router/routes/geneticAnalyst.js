import { checkIsLoggedIn, checkAccountStatus } from "@/common/lib/route-guard"
import registrationRoutes from "./registration"
import store from "@/store/index"

export default [
  {
    path: "/",
    component: () => import(/* webpackChunkName */ "@/views/Dashboard/GeneticAnalyst/Layout"),
    beforeEnter: checkIsLoggedIn,
    name: "genetic-analyst",
    redirect: { name: "ga-dashboard" },
    children: [
      {
        path: "/",
        name: "ga-dashboard",
        meta: { pageHeader: "Home" },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/GeneticAnalyst/Home"),
        beforeEnter: checkAccountStatus
      },
      {
        path: "/",
        name: "ga-dashboard-verification",
        meta: { pageHeader: "Home" },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/GeneticAnalyst/Home/Unverified"),
        beforeEnter: (to, from, next) => {
          if (store.state.substrate.GAAccount.verificationStatus === "Verified") next({ name: "ga-dashboard" })
          else next()
        }
      },
      {
        path: "my-account",
        name: "ga-account",
        meta: { pageHeader: "My Account" },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/GeneticAnalyst/Account")
      },
      {
        path: "services",
        name: "ga-services",
        meta: { pageHeader: "My Services" },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/GeneticAnalyst/Services")
      },
      {
        path: "service/add",
        name: "ga-add-services",
        meta: { pageHeader: "Add Services", parent: "ga-services" },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/GeneticAnalyst/Services/AddService")
      },
      {
        path: "service/edit/:id",
        name: "ga-edit-service",
        meta: { pageHeader: "Edit Service", parent: "ga-services" },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/GeneticAnalyst/Services/EditService")
      },
      {
        path: "orders",
        name: "ga-orders",
        meta: { pageHeader: "Orders" },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/GeneticAnalyst/Orders")
      },
      {
        path: "order-details/:id",
        name: "ga-order-details",
        meta: { pageHeader: "Details", parent: "ga-orders" },
        component: () => import(/* webpackChunkName */ "@/views/Dashboard/GeneticAnalyst/Orders/Details")
      },
      ...registrationRoutes
    ]
  }
]
