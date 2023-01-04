import apiClientRequest from "@/common/lib/api"

export const checkMyriadUsername = async (username) => {
  const { data } = await apiClientRequest.get("/myriad/username/check", {
    params: {
      username
    }
  })
  return data
}
