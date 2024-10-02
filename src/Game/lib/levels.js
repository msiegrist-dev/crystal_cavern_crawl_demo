import environment from "../../data/environment"
import first_stage from "../../data/stage_encounters/first_stage"

import {getRandomValueFromList, copyState, handleOdds} from "./helper_lib"
import {mapEnemiesForCombat} from "./combat"

const generateCombatLevelEnemies = (level, game_state) => {
  if(level >= 11){
    return mapEnemiesForCombat(first_stage.mob_sets[0], game_state)
  }
  if(level % 5 === 0){
    const boss_pool = first_stage.bosses.filter((arr) => !game_state.bosses_faced.includes(arr[0].name))
    return mapEnemiesForCombat(getRandomValueFromList(boss_pool), game_state)
  }
  if(level >= 1 && level <= 10){
    return mapEnemiesForCombat(getRandomValueFromList(first_stage.mob_sets), game_state)
  }
}

const generateEvent = game_state => {
  if(environment.BASE_EVENTS.length === game_state.events_faced.length){
    return getRandomValueFromList(environment.BASE_EVENTS)
  }
  let random_event = getRandomValueFromList(environment.BASE_EVENTS)
  while(game_state.events_faced.includes(random_event)){
    random_event = getRandomValueFromList(environment.BASE_EVENTS)
  }
  return random_event
}

const getRandomLevel = (number, game_state, force_event) => {
  if(force_event){
    return {
      number,
      type: "event",
      event_name: generateEvent(game_state)
    }
  }
  const level_type_odds = [
    {name: "combat", value: 80},
    {name: "event", value: 20}
  ]
  if(number % 5 === 0){
    return {
      number,
      type: "combat",
      enemies: generateCombatLevelEnemies(number, game_state),
      enemy_type: "boss"
    }
  }
  const level_type = handleOdds(level_type_odds)
  if(level_type === "combat"){
    return {
      number,
      type: level_type,
      enemies: generateCombatLevelEnemies(number, game_state)
    }
  }
  if(level_type === "event"){
    return {
      number,
      type: level_type,
      event_name: generateEvent(game_state)
    }
  }
}

const goNextLevel = (game_state, force_event) => {
  const game_state_copy = copyState(game_state)
  const next_level = game_state.level.number + 1
  if(next_level > 1){
    game_state_copy.score += 50
  }
  const new_level = getRandomLevel(next_level, game_state_copy, force_event)
  game_state_copy.level = new_level
  if(new_level.enemy_type === "boss"){
    game_state_copy.bosses_faced.push(new_level.enemies[0].name)
  }
  if(new_level.type === "event"){
    game_state_copy.events_faced.push(new_level.event_name)
  }
  return game_state_copy
}

export {
  goNextLevel,
  getRandomLevel,
  generateCombatLevelEnemies,
  generateEvent
}
