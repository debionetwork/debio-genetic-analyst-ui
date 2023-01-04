import generateRandomAnimalName from "random-animal-name-generator"

export function generateUsername() {
  const username = generateRandomAnimalName()
  return username.split(" ").join("").toLowerCase()
}
