import Kilt from "@kiltprotocol/sdk-js"
import { uploadFile as pinataIpfsUploadFile, downloadJson, getIpfsMetaData as pinataIpfsGetIpfsMetadata, downloadDocumentFileInBrowser } from "@debionetwork/pinata-ipfs"

const pinataJwtKey = process.env.VUE_APP_PINATA_JWT_KEY

export const uploadFile = val => {
  const options = {
    pinataMetadata: {
      name: val.title,
      keyvalues: {
        type: val.type,
        date: +new Date()
      }
    },
    pinataOptions: { cidVersion: 0 }
  }

  return pinataIpfsUploadFile(
    options,
    val.file,
    pinataJwtKey
  )
}

export const getFileUrl = cid => {
  return `${process.env.VUE_APP_PINATA_GATEWAY}/ipfs/${cid}`
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
