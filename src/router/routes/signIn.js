import { checkIsLoggedIn } from "@/common/lib/route-guard"

const signInRoutes = [
  {
    path: "/sign-in",
    name: "sign-in",
    meta: { pageHeader: "Sign In" },
    beforeEnter: checkIsLoggedIn,
    component: () => import(/* webpackChunkName */ "@/views/LandingPage/SignIn")
  },
  {
    path: "/sign-in",
    name: "forgot-password",
    meta: { pageHeader: "Forgot Password", parent: "sign-in" },
    component: () => import(/* webpackChunkName */ "@/views/LandingPage/SignIn/ForgotPassword")
  },
  {
    path: "/sign-in",
    name: "input-mnemonic",
    meta: { pageHeader: "Input Mnemonic", parent: "sign-in" },
    component: () => import(/* webpackChunkName */ "@/views/LandingPage/SignIn/InputMnemonic")
  },
  {
    path: "/sign-in",
    name: "change-password",
    meta: { pageHeader: "Change Password", parent: "sign-in" },
    component: () => import(/* webpackChunkName */ "@/views/LandingPage/SignIn/ChangePassword")
  },
  {
    path: "/sign-in",
    name: "change-password-successful",
    meta: { pageHeader: "Change Password", parent: "sign-in" },
    component: () => import(/* webpackChunkName */ "@/views/LandingPage/SignIn/ChangePasswordSuccessful")
  },
  {
    path: "/select-role",
    name: "select-role",
    meta: { pageHeader: "Select Role" },
    beforeEnter: checkIsLoggedIn,
    component: () => import(/* webpackChunkName */ "../../views/LandingPage/SelectRole")
  }

]

export default signInRoutes
