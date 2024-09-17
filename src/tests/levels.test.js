import environment from "../data/environment"
import {getRandomNumber} from "../Game/lib/helper_lib"
import {generateCombatLevelEnemies, generateEvent, getRandomLevel, goNextLevel} from "../Game/lib/levels"

const game_state = {
  difficulty: 0,
  bosses_faced: [],
  score: 0
}
test("generateCombatLevelEnemies always returns enemies", () => {
  const results = []
  for(let i = 0; i < 100; i++){
    results.push(generateCombatLevelEnemies(getRandomNumber(10) + 1, game_state))
  }

  const hasValueAndName = value => {
    if(!value) return false
    if(!value.name) return false
    return true
  }

  let has_enemies = true
  let enemy_has_name = true
  let enemy_has_position = true
  for(let set of results){
    if(!set.length || !set){
      has_enemies = false
      break
    }
    for(let enemy of set){
      if(!enemy || !enemy.name){
        enemy_has_name = false
        break
      }
      if(enemy.position === undefined || enemy.position === null){
        enemy_has_position = false
        break
      }
    }
  }
  expect(has_enemies).toBe(true)
  expect(enemy_has_name).toBe(true)
  expect(enemy_has_position).toBe(true)
})

test("the level 10 boss fight will always be the boss not faced", () => {
  const state = {
    ...game_state,
    bosses_faced: ["Groblin Daddy"]
  }

  const results = []
  for(let i = 0; i < 100; i ++){
    results.push(generateCombatLevelEnemies(10, state))
  }

  let is_rat = true
  for(let set of results){
    for(let enemy of set){
      if(!enemy.name === "Flaming Rodent"){
        is_rat = false
        break
      }
    }
  }
  expect(is_rat).toBe(true)
})

test("generateEvent always returns a random base event", () => {
  const results = []
  for(var i = 0; i < 100; i++){
    results.push(generateEvent())
  }

  const unknown = results.filter((r) => !environment.BASE_EVENTS.includes(r))
  expect(unknown).toEqual([])
})

test("getRandomLevel always returns a combat or event level", () => {
  const results = []
  for(let i = 0; i < 100; i++){
    results.push(
      getRandomLevel(getRandomNumber(10) + 1, game_state)
    )
  }

  let has_valid_type = true
  for(let level of results){
    if(level.type !== "event" && level.type !== "combat"){
      has_valid_type = false
    }
  }
  expect(has_valid_type).toBe(true)
})

test("goNextLevel increments level, gives 50 points and stores boss encountered when generating boss" , () => {
  const gs = {
    ...game_state,
    level: {
      number: 4
    }
  }

  const next_level = goNextLevel(gs)
  expect(next_level.bosses_faced.length).toBe(1)
  expect(next_level.score).toBe(50)
  expect(next_level.level.number).toBe(5)
  expect(["Flaming Rodent", "Groblin Daddy"].includes(next_level.level.enemies[0].name)).toBe(true)

})
