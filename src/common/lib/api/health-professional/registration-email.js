import apiClientRequest from "@/common/lib/api";
import localStorage from "@/common/lib/local-storage";

export async function sendPHRegisteredEmail() {
  const data = await apiClientRequest.post(`email/registered-health-professional/${localStorage.getAddress()}`)
  return data
}
