import apiClientRequest from "@/common/lib/api"

export const submitRatingOrder = async (labId, serviceId, orderId, ratingBy, rating, review) => {
  const payload = {
    lab_id: labId,
    service_id: serviceId,
    order_id: orderId,
    rating_by: ratingBy,
    rating: rating,
    review: review
  }

  const { data } = await apiClientRequest.post("/rating", payload);

  return data;
}

export const getRatingByOrderId = async (orderId) => {
  const { data: { data } } = await apiClientRequest.get(`/rating/order/${orderId}`)

  return data
}

export const getRatingService = async (id) => {
  const { data } = await apiClientRequest.get(`/rating/service/${id}`)
  return data
}

export const getRatingLab = async (address) => {
  const { data } = await apiClientRequest.get(`/rating/lab/${address}`)
  return data
}
