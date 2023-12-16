import {getRandomNumber100, getRandomValueFromList, copyState} from "./helper_lib"
import environment from "../../data/environment"

const giveCharacterStats = (character, stat_name, amount) => {
  const state_copy = copyState(character)
  state_copy[stat_name] += amount
  if(stat_name === "max_hp"){
    state_copy.hp += amount
  }
  if(!state_copy["flat_stat_increases"][stat_name]){
    state_copy["flat_stat_increases"][stat_name] = 0
  }
  state_copy["flat_stat_increases"][stat_name] += amount
  return state_copy
}

const getRandomStatName = () => getRandomValueFromList(environment.ALL_STATS)
const getRandomStatValue = stat_name => {
  if(stat_name === "max_hp"){
    return Math.ceil(getRandomNumber100() / 10)
  }
  if(stat_name === "attack" || stat_name === "defense" || stat_name === "speed"){
    return Math.ceil(getRandomNumber100() / 20)
  }
  if(stat_name === "armor"){
    return Number(Math.ceil(getRandomNumber100() / 25) / 100)
  }
}

export {
  giveCharacterStats,
  getRandomStatName,
  getRandomStatValue
}
