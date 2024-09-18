import {getRandomValueFromList, copyState} from "./helper_lib"
import environment from "../../data/environment"

const getRandomGemName = () => getRandomValueFromList(environment.ALL_GEMS)

const giveCharacterGems = (state, gem_name, amount) => {
  const state_copy = copyState(state)
  state_copy.character.gems[gem_name] += amount
  return state_copy
}

const doesCharacterHaveGems = (character, gem_name, number) => character.gems[gem_name] >= number

export {
  getRandomGemName,
  giveCharacterGems,
  doesCharacterHaveGems
}
