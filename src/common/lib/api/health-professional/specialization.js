import apiClientRequest from "@/common/lib/api"

export const getHealthProfessionalSpecialization = async () => {
  const { data } = await apiClientRequest.get("/second-opinion/health-professional-specialization")
  return data
}
