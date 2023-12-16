import {getRandomValueFromList, copyState} from "./helper_lib"
import environment from "../../data/environment"

const getRandomGemName = () => getRandomValueFromList(environment.ALL_GEMS)

const giveCharacterGems = (state, gem_name, amount) => {
  const state_copy = copyState(state)
  state_copy.character.gems[gem_name] += amount
  return state_copy
}

const doesCharacterHaveGems = (game_state, card) => {
  const character_gems = game_state.character.gems
  if(!character_gems){
    return false
  }
  for(let gem_name of Object.keys(card.gem_augments)){
    const gem_obj = card.gem_augments[gem_name]
    if(!gem_obj.required){
      continue
    }
    if(gem_obj.number > character_gems[gem_name]){
      return false
    }
  }
  return true
}

export {
  getRandomGemName,
  giveCharacterGems,
  doesCharacterHaveGems
}
