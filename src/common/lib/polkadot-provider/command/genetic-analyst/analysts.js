export async function updateGeneticAnalystInfo(api, pair, data) {
  const result = await api.tx.geneticAnalysts
    .updateGeneticAnalyst(data)
    .signAndSend(pair, { nonce: -1 })

  return result.toHuman()
}

export async function updateGAAvailabilityStatus(api, pair, status) {
  console.log(status)
  const result = await api.tx.geneticAnalysts
    .updateGeneticAnalystAvailabilityStatus(status)
    .signAndSend(pair, { nonce: -1 })

  return result.toHuman()
}

export async function unstakeGeneticAnalyst(api, pair) {
  const result = await api.tx.geneticAnalysts
    .unstakeGeneticAnalyst()
    .signAndSend(pair, { nonce: -1 })

  return result.toHuman()
}
