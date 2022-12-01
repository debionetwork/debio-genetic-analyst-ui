import { checkIsLoggedIn } from "@/common/lib/route-guard"

const generateAccountRoutes = [
  {
    path: "/generate",
    name: "generate-account",
    meta: { pageHeader: "Generate Account" },
    beforeEnter: checkIsLoggedIn,
    component: () => import(/* webpackChunkName */ "@/views/LandingPage/GenerateAccount")
  },
  {
    path: "/generate",
    name: "generate-mnemonic",
    meta: { pageHeader: "Mnemonic", parent: "generate-account" },
    component: () => import(/* webpackChunkName */ "@/views/LandingPage/GenerateAccount/GenerateMnemonic")
  },
  {
    path: "/generate",
    name: "verify-mnemonic",
    meta: { pageHeader: "Verify", parent: "generate-account" },
    component: () => import(/* webpackChunkName */ "@/views/LandingPage/GenerateAccount/VerifyMnemonic")
  },
  {
    path: "/generate",
    name: "set-password",
    meta: { pageHeader: "Set Password", parent: "generate-account" },
    component: () => import(/* webpackChunkName */ "@/views/LandingPage/GenerateAccount/SetPassword")
  },
  {
    path: "/generate/:flag?",
    name: "registration-successful",
    meta: { pageHeader: "Success", parent: "generate-account" },
    component: () => import(/* webpackChunkName */ "@/views/LandingPage/GenerateAccount/RegistrationSuccessful")
  }
]

export default generateAccountRoutes
