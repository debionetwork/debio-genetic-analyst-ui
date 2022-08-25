/* eslint-disable camelcase */
import localStorage from "./local-storage"
import { getNotifications } from "./api"
import store from "@/store"

const routes = {
  "New Order": "ga-order-details",
  "Add service": "ga-edit-service"
}

export async function getUnlistedNotification (end_block) {
  const from = "Debio Network"
  const to_id = localStorage.getAddress()

  const { data } = await getNotifications({ to_id, end_block, from })

  const storageName = `LOCAL_NOTIFICATION_BY_ADDRESS_${to_id}_analyst`

  let tempNotification = []
  const currentNotifications = localStorage.getLocalStorageByName(storageName)

  if (!currentNotifications) localStorage.setLocalStorageByName(storageName, JSON.stringify(tempNotification))

  for (const event of data) {
    const { id, block_number, read, created_at, description, entity, reference_id } = event

    const dateSet = new Date(created_at)
    const timestamp = dateSet.getTime().toString()
    const notifDate = dateSet.toLocaleString("en-US", {
      weekday: "short",
      day: "numeric",
      year: "numeric",
      month: "long",
      hour: "numeric",
      minute: "numeric"
    })

    const referenceFormater = event?.reference_id?.includes("0x")
      ? `${reference_id.slice(0, 4)}...${reference_id.slice(-4)}`
      : reference_id

    const message = description.replace("[]", referenceFormater)

    tempNotification.push({
      message,
      id,
      timestamp,
      route: routes[entity],
      params: reference_id,
      block: block_number,
      read,
      notifDate
    })
  }

  localStorage.setLocalStorageByName(storageName, JSON.stringify(tempNotification.reverse()))
  store.commit("substrate/SET_LIST_NOTIFICATION", tempNotification.reverse())
}
