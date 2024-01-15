import {getRandomNumber100, getRandomValueFromList, copyState, roundToNearestInt} from "./helper_lib"
import environment from "../../data/environment"

const giveCharacterStats = (character, stat_name, amount) => {
  const state_copy = copyState(character)
  state_copy[stat_name] += amount
  if(stat_name === "max_hp"){
    state_copy.hp = roundToNearestInt(state_copy.hp + amount)
  }
  const ignore_flat_stat_stats = ["starting_draw", "card_draw"]
  if(!ignore_flat_stat_stats.includes(stat_name)){
    state_copy["flat_stat_increases"][stat_name] = roundToNearestInt(state_copy["flat_stat_increases"][stat_name] + amount)
  }
  return state_copy
}

const getRandomStatName = () => getRandomValueFromList(environment.ALL_STATS)
const getRandomStatValue = stat_name => {
  if(stat_name === "max_hp"){
    return Math.ceil(getRandomNumber100() / 15)
  }
  if(stat_name === "attack" || stat_name === "defense" || stat_name === "speed"){
    return Math.ceil(getRandomNumber100() / 25)
  }
  if(stat_name === "armor"){
    return Number(Math.ceil(getRandomNumber100() / 25) / 100)
  }
}

const healCharacter = (game_state, value) => {
  game_state.character.hp += value
  if(game_state.character.hp > game_state.character.max_hp){
    game_state.character.hp = game_state.character.max_hp
  }
  return game_state
}

export {
  giveCharacterStats,
  getRandomStatName,
  getRandomStatValue,
  healCharacter
}
