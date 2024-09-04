import environment from "../../data/environment"
import first_stage from "../../data/stage_encounters/first_stage"

import {getRandomValueFromList, copyState, handleOdds} from "./helper_lib"
import {mapEnemiesForCombat} from "./combat"

const generateCombatLevel = (level, game_state) => {
  if(level % 5 === 0){
    const boss_pool = first_stage.bosses.filter((arr) => !game_state.bosses_faced.includes(arr[0].name))
    return mapEnemiesForCombat(getRandomValueFromList(boss_pool))
  }
  if(level >= 1 && level <= 10){
    return mapEnemiesForCombat(getRandomValueFromList(first_stage.mob_sets))
  }
}

const generateEvent = level => {
  if(level < 15){
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

const getRandomLevel = (number, game_state) => {
  const level_type_odds = [
    {name: "combat", value: 75},
    {name: "event", value: 25}
  ]
  if(number % 5 === 0){
    return {
      number,
      type: "combat",
      enemies: generateCombatLevel(number, game_state),
      enemy_type: "boss"
    }
  }
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
  const new_level = getRandomLevel(next_level, game_state_copy)
  game_state_copy.level = new_level
  if(new_level.enemy_type === "boss"){
    game_state_copy.bosses_faced.push(new_level.enemies[0].name)
  }
  return game_state_copy
}

export {
  goNextLevel,
  getRandomLevel,
  generateCombatLevel
}
