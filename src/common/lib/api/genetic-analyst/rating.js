import apiClientRequest from "@/common/lib/api"

export const getRatingService = async (id) => {
  const { data } = await apiClientRequest.get(`/rating/service/${id}`)
  return data
}

export const getRatingLab = async (address) => {
  const { data } = await apiClientRequest.get(`/rating/lab/${address}`)
  return data
}
