/* eslint-disable camelcase */
import apiClientRequest from "@/common/lib/api"

export const getNotifications = async ({ to_id, end_block, from }) => {
  const { data } = await apiClientRequest.get(`/notification/${to_id}`, {
    params: { start_block: 0, end_block, role: "GA", from }
  })

  return data
}

export const setReadNotification = async (ids) => {
  const { data } = await apiClientRequest.put("/notification/set-read-many/", { ids })

  return data
}

export const setBulkReadNotification = async (to_id) => {
  const { data } = await apiClientRequest.put(`/notification/set-read/${to_id}`)

  return data
}
