export async function updateGeneticAnalystInfo(api, pair, data) {
  const result = await api.tx.geneticAnalysts
    .updateGeneticAnalyst(data)
    .signAndSend(pair, { nonce: -1 })

  return result.toHuman()
}
