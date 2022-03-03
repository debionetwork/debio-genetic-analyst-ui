import Kilt from "@kiltprotocol/sdk-js"
import axios from "axios"
import NodeFormData from "form-data"

const pinataKey = process.env.VUE_APP_PINATA_KEY
const pinataSecretKey = process.env.VUE_APP_PINATA_SECRET_KEY
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

  return new Promise((resolve, reject) => {
    const data = new NodeFormData()
    const endpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS"

    data.append("file", val.file)

    if (options?.pinataMetadata) data.append("pinataMetadata", JSON.stringify(options?.pinataMetadata))
    if (options?.pinataOptions) data.append("pinataOptions", JSON.stringify(options?.pinataOptions))

    axios.post(endpoint, data, {
      withCredentials: true,
      maxContentLength: "Infinity", // NOTE: Allow axios to upload large file
      maxBodyLength: "Infinity",
      headers: {
        "Content-type": `multipart/form-data boundary=${data._boundary}`,
        "authorization": `Bearer ${pinataJwtKey}`,
        "pinata_api_key": pinataKey,
        "pinata_secret_api_key": pinataSecretKey
      }
    }).then(result => {
      if (result.status !== 200) reject(new Error(`unknown server response while pinning File to IPFS: ${result}`))
      else resolve(result.data)
    }).catch(error => {
      reject(error)
    })
  })
}

export const getFileUrl = cid => {
  return `https://ipfs.debio.network/ipfs/${cid}`
}

export const downloadFile = async (ipfsLink, withMetaData = false) => {
  console.log("Downloading...")

  const cid = ipfsLink.split("/").pop()
  const response = await fetch(ipfsLink)
  const data = await response.json()
  let metadata

  if (withMetaData) {
    const { rows } = await getIpfsMetaData(cid)

    metadata = {
      name: rows[0].metadata.name,
      type: rows[0].metadata.keyvalues.type
    }
  }

  console.log("Success Downloaded!")

  return { ...(withMetaData ? metadata : null), data }
}

export const getIpfsMetaData = async (cid) => {
  const listResponse = await fetch(`https://api.pinata.cloud/data/pinList?status=pinned&hashContains=${cid}`, {
    headers: {
      "pinata_api_key": pinataKey,
      "pinata_secret_api_key": pinataSecretKey
    }
  })

  return await listResponse.json()
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
    const blob = new Blob([data], { type })
    const a = document.createElement("a")
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = [type, a.download, a.href].join(":")
    a.click()
  } catch (error) {
    console.error(error)
  }
}
