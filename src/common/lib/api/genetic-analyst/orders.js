import apiClientRequest from "@/common/lib/api";
import localStorage from "@/common/lib/local-storage";

export async function GAGetOrders(keyword) {
  const { data } = await apiClientRequest.get(`substrate/genetic-analysis-order/list/analyst/${localStorage.getAddress()}`, {
    params: {
      keyword,
      size: 1000,
      page: 1
    }
  });

  return data;
}

export async function sendRegisteredEmail() {
  const data = await apiClientRequest.post(`email/registered-genetic-analyst/${localStorage.getAddress()}`)
  return data
}
