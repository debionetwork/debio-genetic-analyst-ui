import axios from "axios"
import VueRouter from "@/router"
import * as Sentry from "@sentry/vue"

// EXPORT API COLLECTIONS HERE
export * from "./customer"
export * from "./genetic-analyst"

// AXIOS INSTANCE EXPORT BY DEFAULT
// PLEASE DISCUSS BEFORE YOU WANT TO EDIT THIS SCRIPT
const apiClientRequest = axios.create({
  baseURL: process.env.VUE_APP_BACKEND_API,
  headers: {
    "Content-Type": "application/json",
    "debio-api-key": process.env.VUE_APP_DEBIO_API_KEY

  },
  auth: {
    username: process.env.VUE_APP_USERNAME,
    password: process.env.VUE_APP_PASSWORD
  }
})

apiClientRequest.interceptors.response.use(
  response => {
    responseValidation(response)

    return response;
  },
  error => {
    Sentry.captureException(error);

    responseValidation(error)

    return Promise.reject(error);
  }
);

export default apiClientRequest

const responseValidation = (response) => {
  if (response?.status === 503) VueRouter.push({ name: "maintenance" })
  else if (String(response?.status)[0] === "4" || String(response?.status)[0] === "5") VueRouter.push({ query: { error: true } })

  return response;
}
