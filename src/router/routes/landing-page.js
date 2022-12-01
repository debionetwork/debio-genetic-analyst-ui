import signInRoutes from "./signIn"
import generateAccountRoutes from "./generate-account"

const landingPageRoutes = [{
  path: "/landing-page",
  component: () => import(/* webpackChunkName */ "@/views/LandingPage/Layout"),
  children: [
    {
      path: "/landing-page",
      name: "landing-page",
      meta: { pageHeader: "Landing Page" },
      component: () => import(/* webpackChunkName */ "@/views/LandingPage")
    },

    ...generateAccountRoutes,
    ...signInRoutes
  ]
}]

export default landingPageRoutes
