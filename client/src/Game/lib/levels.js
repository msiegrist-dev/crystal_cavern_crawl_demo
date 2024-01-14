import environment from "../../data/environment"
import first_stage from "../../data/stage_encounters/first_stage"

import {getRandomValueFromList, copyState, handleOdds} from "./helper_lib"
import {mapEnemiesForCombat} from "./combat"

const generateCombatLevel = number => {
  //bosses can be faced every 5 levels
  if(number % 5 === 0){
      return mapEnemiesForCombat(getRandomValueFromList(first_stage.bosses))
  }
  if(number >= 1 && number <= 10){
    return mapEnemiesForCombat(getRandomValueFromList(first_stage.mob_sets))
  }
}

const generateEvent = number => {
  if(number < 15){
    return getRandomValueFromList(environment.BASE_EVENTS)
  }
  const odds = [
    {name: "all", value: 85},
    {name: "late", value: 15}
  ]
  const result = handleOdds(odds)
  if(result === "all"){
    return getRandomValueFromList(environment.BASE_EVENTS.concat(environment.LATE_EVENTS))
  }
  return getRandomValueFromList(environment.LATE_EVENTS)
}

const getRandomLevel = number => {
  const level_type_odds = [
    {name: "combat", value: 75},
    {name: "event", value: 25}
  ]
  const level_type = handleOdds(level_type_odds)
  if(level_type === "combat"){
    return {
      number,
      type: level_type,
      enemies: generateCombatLevel(number)
    }
  }
  if(level_type === "event"){
    return {
      number,
      type: level_type,
      event_name: generateEvent(number)
    }
  }
}

const goNextLevel = game_state => {
  const game_state_copy = copyState(game_state)
  const next_level = game_state.level.number + 1
  if(next_level > 1){
    game_state_copy.score += 50
  }
  game_state_copy.level = getRandomLevel(next_level)
  return game_state_copy
}

export {
  goNextLevel,
  getRandomLevel,
  generateCombatLevel
}
