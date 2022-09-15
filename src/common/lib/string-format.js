export function fmtSpecimenNumber(specimenNumber) {
  const first = specimenNumber.substring(0, 4)
  const second = specimenNumber.substring(4, 8)
  const third = specimenNumber.substring(8)
  
  return `${first}-${second}-${third}`
}

export function fmtReferenceFromHex(hex) {
  return `${hex.slice(0, 4)}...${hex.slice(-4)}`
}
