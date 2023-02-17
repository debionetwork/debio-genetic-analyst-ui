import apiClientRequest from "@/common/lib/api"
import axios from "axios"
import getEnv from "@/common/lib/utils/env"

export const checkMyriadUsername = async (username) => {
  const { data } = await apiClientRequest.get("/myriad/username/check", {
    params: {
      username
    }
  })
  return data
}

export async function myriadCheckUser (address) {
  const { data } = await apiClientRequest.get(`myriad/check/user/${address}`)
  return data
}

export async function myriadRegistration(info) {
  const { data } =  await apiClientRequest.post(`myriad/register`, info)
  return data
}

export async function getNonce(address) {
  const { data } = await apiClientRequest.get(`myriad/auth/nonce/${address}`)
  return data.nonce
}

export async function myriadAuth(info) {
  const { data } = apiClientRequest.post(`myriad/auth`, info)
  return data
}

export async function myriadContentTotal(userId, jwt) {
  console.log(userId)
  const request = axios.create({
    baseURL: getEnv("VUE_APP_BACKEND_API"),
    headers: {
      "Content-Type": "application/json",
      "debio-api-key": getEnv("VUE_APP_DEBIO_API_KEY"),
      "JWT": jwt
    },
    auth: {
      username: getEnv("VUE_APP_USERNAME"),
      password: getEnv("VUE_APP_PASSWORD")
    }
  })

  const data = request.get(`/myriad/content/comment/total/${userId}`)
  return data
}

export async function myriadContents(jwt) {
  const request = axios.create({
    baseURL: getEnv("VUE_APP_BACKEND_API"),
    headers: {
      "Content-Type": "application/json",
      "debio-api-key": getEnv("VUE_APP_DEBIO_API_KEY"),
      "JWT": jwt
    },
    auth: {
      username: getEnv("VUE_APP_USERNAME"),
      password: getEnv("VUE_APP_PASSWORD")
    }
  })

  const data = request.get(`/myriad/content/unlockable`, {
    params: {
      limit: 1000,
      page: 1   
    }
  })
  return data  
}


export async function myriadTipTotal(jwt) {
  const request = axios.create({
    baseURL: getEnv("VUE_APP_BACKEND_API"),
    headers: {
      "Content-Type": "application/json",
      "debio-api-key": getEnv("VUE_APP_DEBIO_API_KEY"),
      "JWT": jwt
    },
    auth: {
      username: getEnv("VUE_APP_USERNAME"),
      password: getEnv("VUE_APP_PASSWORD")
    }
  })

  const data = request.get(`/myriad/tip/total`, {
    params: { 
      status: "sent",
      referenceType: "post",
      networkType: "debio",
      symbol: "USDT"
    }
  })
  return data
}
