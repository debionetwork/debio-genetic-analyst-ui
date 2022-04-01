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
