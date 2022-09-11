import Kilt from "@kiltprotocol/sdk-js"
import axios from "axios"
import store from "@/store"
import {
  getIpfsMetaData as pinataIpfsGetIpfsMetadata,
  uploadFile as pinataIpfsUploadFile,
  downloadDocumentFileInBrowser,
  downloadJson
} from "@debionetwork/pinata-ipfs"
import getEnv from "./utils/env"

const pinataJwtKey = getEnv("VUE_APP_PINATA_JWT_KEY")

export const uploadFile = val => {
  const options = {
    pinataMetadata: {
      name: val.title,
      keyvalues: {
        required: getEnv("VUE_APP_PINATA_REQUIRED_DOCUMENT"),
        type: val.type,
        fileSize: val.size,
        date: +new Date()
      }
    },
    pinataOptions: { cidVersion: 0 }
  }

  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  store.dispatch("geneticData/setCancel", {
    source
  })

  return pinataIpfsUploadFile(
    options,
    val.file,
    pinataJwtKey,
    source.token,
    (progressEvent) => {
      if (progressEvent.lengthComputable) {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        store.dispatch("geneticData/getLoadingProgress", {
          progress: percentCompleted
        })
      }
    }
  )
}

export const getFileUrl = cid => {
  return `${getEnv("VUE_APP_PINATA_GATEWAY")}/${cid}`
}

export const downloadFile = async (ipfsLink, withMetaData = false) => {
  console.log("Downloading...")
  const result = await downloadJson(
    ipfsLink,
    withMetaData,
    pinataJwtKey
  )
  console.log("Success Downloaded!")

  return result
}

export const getIpfsMetaData = async (cid) => {
  return await pinataIpfsGetIpfsMetadata(
    cid,
    pinataJwtKey
  )
}

export const decryptFile = (obj, pair) => {
  const box = Object.values(obj[0].data.box)
  const nonce = Object.values(obj[0].data.nonce)
  let decryptedFile

  const toDecrypt = {
    box: Uint8Array.from(box),
    nonce: Uint8Array.from(nonce)
  }

  decryptedFile = Kilt.Utils.Crypto.decryptAsymmetric(toDecrypt, pair.publicKey, pair.secretKey)

  if (!decryptedFile) console.log("Undefined File", decryptedFile)
  else return decryptedFile
}

export const downloadDocumentFile = (data, fileName, type) => {
  try {
    downloadDocumentFileInBrowser(
      data,
      fileName,
      type
    )
  } catch (error) {
    console.error(error)
  }
}
