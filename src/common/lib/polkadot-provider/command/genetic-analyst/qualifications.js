export async function updateQualification(api, pair, qualificationId, qualificationInfo) {
  const result = await api.tx.geneticAnalystQualifications
    .updateQualification(qualificationId, qualificationInfo)
    .signAndSend(pair, { nonce: -1 })
  
  return result.toHuman()
}
