import {getRandomValueFromList, copyState} from "./helper_lib"
import environment from "../../data/environment"

const getRandomGemName = () => getRandomValueFromList(environment.ALL_GEMS)

const giveCharacterGems = (state, gem_name, amount) => {
  const state_copy = copyState(state)
  state_copy.character.gems[gem_name] += amount
  return state_copy
}

const doesCharacterHaveGems = (character, gem_name, number) => {
  return character.gems[gem_name] >= number
}

const doesCharacterHaveCardAugmentGems = (game_state, card) => {
  if(!game_state.character.gems){
    return false
  }

  for(let gem_name of Object.keys(card.gem_augments)){
    const gem_obj = card.gem_augments[gem_name]
    if(!gem_obj.required){
      continue
    }
    if(!doesCharacterHaveGems(game_state.character, gem_name, gem_obj.number)){
      return false
    }
  }
  return true
}


export {
  getRandomGemName,
  giveCharacterGems,
  doesCharacterHaveCardAugmentGems,
  doesCharacterHaveGems
}
