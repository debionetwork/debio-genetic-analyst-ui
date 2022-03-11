import apiClientRequest from "@/common/lib/api"

export const getCategories = async () => {
  const { data: data } = await apiClientRequest.get("/service-category")
  return data
}

export const getSpecializationCategory = async () => {
  const { data: data } = await apiClientRequest.get("/specialization-category")
  return data
}
