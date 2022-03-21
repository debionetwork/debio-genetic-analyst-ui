export async function createGeneticAnalystService(api, pair, geneticAnalystServicesInfo) {
  const result = await api.tx.geneticAnalystServices
    .createGeneticAnalystService(geneticAnalystServicesInfo)
    .signAndSend(pair, { nonce: -1 })

  return result.toHuman()
}

export async function updateGeneticAnalystService(api, pair, id, geneticAnalystServicesInfo) {
  const result = await api.tx.geneticAnalystServices
    .updateGeneticAnalystService(id, geneticAnalystServicesInfo)
    .signAndSend(pair, { nonce: -1})
  
  return result.toHuman()
}

export async function deleteGeneticAnalystService(api, pair, id) {
  const result = await api.tx.geneticAnalystServices
    .deleteGeneticAnalystService(id)
    .signAndSend(pair, { nocne: -1 })
  return result.toHuman()
}

export async function createGeneticAnalystServiceFee(api, pair, geneticAnalystServicesInfo) {
  return api.tx.geneticAnalystServices
    .createGeneticAnalystService(geneticAnalystServicesInfo)
    .paymentInfo(pair)
}

export async function updateGeneticAnalystServiceFee(api, pair, id, geneticAnalystServicesInfo) {
  return api.tx.geneticAnalystServices
    .updateGeneticAnalystService(id, geneticAnalystServicesInfo)
    .paymentInfo(pair)
}

export async function deleteGeneticAnalystServiceFee(api, pair, id) {
  return api.tx.geneticAnalystServices
    .deleteGeneticAnalystService(id)
    .paymentInfo(pair)
}
