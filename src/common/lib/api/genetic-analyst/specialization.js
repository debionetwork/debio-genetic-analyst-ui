import apiClientRequest from "@/common/lib/api"

export const getSpecialization = async () => {
  const { data: data } = await apiClientRequest.get("/specialization-category")
  return data
}
