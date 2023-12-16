import {getRandomValueFromList, copyState} from "./helper_lib"
import {giveCharacterStats} from "./stats"
import items from "../../data/items"

const getRandomItems = quantity => {
  const random_items = []
  for(let i = 0; i < quantity; i++){
    random_items.push(getRandomValueFromList(items))
  }
  return random_items
}

const processItemEffect = (character, item) => {
  const character_copy = copyState(character)
  const {effect, stat_name, value} = item
  let updated_character
  if(effect === "increase_stat_flat"){
    updated_character = giveCharacterStats(character_copy, stat_name, value)
  }
  return updated_character
}

const giveCharacterItem = (game_state, item) => {
  const state_copy = copyState(game_state)
  state_copy.character = processItemEffect(game_state.character, item)
  state_copy.character.inventory.push(item)
  return state_copy
}

export {
  getRandomItems,
  processItemEffect,
  giveCharacterItem
}
