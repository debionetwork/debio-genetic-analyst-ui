export async function queryGetHealthProfessionalAccount(api, accountId) {
  const res = await api.query.healthProfessional.healthProfessionals(accountId)
  return res.toHuman()
}

export async function queryGetHealthProfessionalQualification(api, accountId) {
  const res = await api.query.healthProfessionalQualification.healthProfessionalQualifications(accountId)
  return res.toHuman()
}

export async function queryProfessionalHealthMinimumStakeAmount(api) {
  const res = await api.query.healthProfessional.minimumStakeAmount()
  return res.toHuman()
}
