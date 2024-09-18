import {healCharacter, getRandomStatValue, getRandomStatName, giveCharacterStats} from "../Game/lib/stats"
import environment from "../data/environment"

const test_char = {
  attack: 0,
  defend: 0,
  speed: 0,
  hp: 10,
  max_hp: 10
}

const test_state = {
  character : {...test_char}
}

test("healCharacter will not heal beyond max hp value", () => {
  expect(healCharacter(test_state, 10)).toEqual(test_state)
  expect(healCharacter({character: {...test_char, hp: 8}}, 12)).toEqual(test_state)
})

test("healCharacter heals for amount", () => {
  expect(healCharacter({character: {...test_char, hp: 2}}, 5)).toEqual({character: {...test_char, hp: 7}})
})

test("getRandomStatName always returns a value from environment", () => {
  for(let i = 0; i < 50; i++){
    const random = getRandomStatName()
    expect(random).toBeDefined()
    expect(environment.ALL_STATS.includes(random)).toBe(true)
  }
})

test("getRandomStatValue returns a positive value for every environment stat", () => {
  for(let stat of environment.ALL_STATS){
    for(let i = 0; i < 50; i++){
      expect(getRandomStatValue(stat)).toBeDefined()
      expect(getRandomStatValue(stat)).toBeGreaterThan(0)
    }
  }
})

test("getRandomStatValue is in range for the given stat", () => {
  const testRange = (min, max, value) => value >= min && value <= max
  for(let stat of environment.ALL_STATS){
    for(let i = 0; i < 50; i++){
      const value = getRandomStatValue(stat)
      if(stat === "max_hp"){
        expect(testRange(1, 7, value)).toBe(true)
      }
      if(stat === "armor"){
        expect(testRange(.01, .04, value)).toBe(true)
      }
      if(["defense", "speed", "attack"].includes(stat)){
        expect(testRange(1, 4, value)).toBe(true)
      }
    }
  }
})

test("giveCharacterStats increases stats and if max_hp will also increase hp", () => {
  for(let stat of environment.ALL_STATS){
    const copy = JSON.parse(JSON.stringify(test_char))
    const given = giveCharacterStats(copy, stat, 5)
    if(stat === "max_hp"){
      expect(given).toEqual({...test_char, hp: 15, max_hp: 15})
    } else {
      const expected = JSON.parse(JSON.stringify(test_char))
      expected[stat] += 5
      expect(given).toEqual(expected)
    }
  }
})
