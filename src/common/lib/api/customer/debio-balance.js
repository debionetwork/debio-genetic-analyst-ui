import apiClientRequest from "@/common/lib/api"

export const getDbioBalance = async () => {
  const { data } = await apiClientRequest.get("/conversion/cache")

  return data
}

export const getConversionCache = async (from, to) => {
  const { data } = await apiClientRequest.get(`/conversion/cache`, {
    params: {
      from, 
      to
    }
  })
  return data
}
