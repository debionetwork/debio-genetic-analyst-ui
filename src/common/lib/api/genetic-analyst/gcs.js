import apiClientRequest from "@/common/lib/api"

export async function getSignedUrl(fileName, action = "read") {
  const { data: { signedUrl } } = await apiClientRequest.get("/gcs/signed-url", {
    params: {
      filename: fileName,
      action: action
    }
  })

  return signedUrl
}
