import apiClientRequest from "@/common/lib/api"

export const getSpecializationCategory = async () => {
  const { data: data } = await apiClientRequest.get("/specialization-category")
  return data
}
