export async function queryGetAssetBalance(api, assetId, accountId) {
  const res = await api.query.octopusAssets.account(assetId, accountId)
  return res.toHuman()
}

export async function queryOctopusAssetMetadata(api, assetId) {
  const res = await api.query.octopusAssets.metadata(assetId)
  return res.toHuman()
}

export async function queryGetAllOctopusAssets(api) {
  const res = await api.query.octopusAppchain.assetIdByTokenId.entries()
  return res
}
