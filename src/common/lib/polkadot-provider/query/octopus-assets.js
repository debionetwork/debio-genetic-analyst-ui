export async function queryGetAssetBalance(api, assetId, accountId) {
  const res = await api.query.octopusAssets.account(assetId, accountId)
  return res.toHuman()
}
