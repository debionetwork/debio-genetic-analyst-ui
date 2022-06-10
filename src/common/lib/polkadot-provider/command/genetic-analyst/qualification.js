export async function createQualificationFee(api, pair, info) {
  return api.tx.geneticAnalystQualifications
    .createQualification(info)
    .paymentInfo(pair)
}
