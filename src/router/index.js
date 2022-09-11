import Vue from "vue"
import VueRouter from "vue-router"
import indexRoutes from "./routes"
import landingPageRoutes from "./routes/landing-page"
import getEnv from "../common/lib/utils/env"

Vue.use(VueRouter)

const routes = [
  ...indexRoutes,
  ...landingPageRoutes,
  {
    path: "*",
    component: () => import(/* webpackChunkName */ "@/views/NotFound")
  }
]

const router = new VueRouter({
  mode: "history",
  base: getEnv("BASE_URL"),
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

export default router

