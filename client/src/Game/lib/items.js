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

  const processItemStatEffects = (character, stats, negative) => {
    if(!stats || stats.length === 0){
      return character
    }
    for(let stat of stats){
      const {type, name, value} = stat
      if(type === "flat"){
        character = giveCharacterStats(character, name, negative ? value * -1 : value)
      }
    }
    return character
  }

  let character_copy = copyState(character)
  character_copy = processItemStatEffects(character_copy, item.increase_stats, false)
  character_copy = processItemStatEffects(character_copy, item.decrease_stats, true)

  return character_copy
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
