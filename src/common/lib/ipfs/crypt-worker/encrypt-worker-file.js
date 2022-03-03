import Kilt from "@kiltprotocol/sdk-js"

onmessage = function (e) {
  console.log("Encrypting...");

  (async () => {
    const fileBlob = new Blob([e.data.text], { type: e.data.typeFr })
    console.log(fileBlob)
    const chunkSize = 30 * 1000 * 1024 // 5mb chunk size
    const chunksAmount = Math.ceil(fileBlob.size / chunkSize)
    postMessage({ chunksAmount })

    for (let i = 0; i < chunksAmount; i += 1) {
      const start = chunkSize * i
      const end = chunkSize * (i + 1)
      const chunk = fileBlob.slice(start, end, fileBlob.type)
      const chunkBuf = await chunk.arrayBuffer()
      const data = await Kilt.Utils.Crypto.encryptAsymmetric(new Uint8Array(chunkBuf), e.data.pair.publicKey, e.data.pair.secretKey)
      console.log("data -> ", data)
      postMessage({ seed: i, data })
      console.log({ seed: i, data })
    }
  })()
    .then(() => {
      console.log("Encrypted")
    })
    .catch(console.log)

}
