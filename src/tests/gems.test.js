import {getRandomGemName, giveCharacterGems, doesCharacterHaveGems} from "../Game/lib/gems"
import environment from "../data/environment"

test("getRandomGemName always returns a value from environment", () => {
  for(let i = 0; i < 50; i++){
    const gem_name = getRandomGemName()
    expect(gem_name).toBeDefined()
    expect(environment.ALL_GEMS.includes(gem_name)).toBe(true)
  }
})

const test_char = {
  gems: {
    red: 1,
    blue: 1
  }
}

test("giveCharacterGems gives gems to character", () => {
  const test_state = {
    character: {...test_char}
  }

  expect(giveCharacterGems(test_state, "red", 2)).toEqual({...test_state, character: {...test_char, gems: {red: 3, blue: 1}}})
  expect(giveCharacterGems(test_state, "blue", 1)).toEqual({...test_state, character: {...test_char, gems: {red: 1, blue: 2}}})
  expect(giveCharacterGems(test_state, "blue", 0)).toEqual({...test_state})
})

test("doesCharacterHaveGems returns true or false if character has x or more gems", () => {
  expect(doesCharacterHaveGems(test_char, "red", 1)).toBe(true)
  expect(doesCharacterHaveGems(test_char, "blue", 0)).toBe(true)
  expect(doesCharacterHaveGems(test_char, "red", 3)).toBe(false)
  expect(doesCharacterHaveGems(test_char, "blue", 4)).toBe(false)
})
