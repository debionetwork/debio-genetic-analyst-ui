export async function registerGeneticAnalystFee(api, pair, info) {
  return api.tx.geneticAnalysts
    .registerGeneticAnalyst(info)
    .paymentInfo(pair)
}

export async function stakeGeneticAnalystFee(api, pair) {
  return api.tx.geneticAnalysts
    .stakeGeneticAnalyst()
    .paymentInfo(pair)
}
