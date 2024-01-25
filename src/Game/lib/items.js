import {getRandomValueFromList, copyState, handleOdds} from "./helper_lib"
import {giveCharacterStats} from "./stats"
import items from "../../data/items"

const getRandomItems = quantity => {
  const rarity_odds = [
    {name: "common", value: 80},
    {name: "uncommon", value: 15},
    {name: "rare", value: 5}
  ]
  const rarity = handleOdds(rarity_odds)
  const item_set = items.filter((it) => it.rarity === rarity)
  const random_items = []
  for(let i = 0; i < quantity; i++){
    random_items.push(getRandomValueFromList(item_set))
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

const hasItem = (character, item_name) => character.inventory.find((it) => it.name === item_name)

export {
  getRandomItems,
  processItemEffect,
  giveCharacterItem,
  hasItem
}
