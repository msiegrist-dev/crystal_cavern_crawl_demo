import {getRandomNumber100, getRandomValueFromList, copyState, roundToNearestInt} from "./helper_lib"
import environment from "../../data/environment"

const giveCharacterStats = (character, stat_name, amount) => {
  const state_copy = copyState(character)
  state_copy[stat_name] += amount
  if(stat_name === "max_hp"){
    state_copy.hp = roundToNearestInt(state_copy.hp + amount)
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
  const copy = JSON.parse(JSON.stringify(game_state))
  copy.character.hp += value
  if(copy.character.hp > copy.character.max_hp){
    copy.character.hp = copy.character.max_hp
  }
  return copy
}

export {
  giveCharacterStats,
  getRandomStatName,
  getRandomStatValue,
  healCharacter,
}
