import {
  getRandomNumber100, getRandomNumber, roundToNearestInt,
  getRandomValueFromList, shuffleKeyedArray, handleOdds
} from "../Game/lib/helper_lib"

test("getRandomNumber100 never returns 0 or 101", () => {

  const results = []
  for(let i = 0; i < 1000; i++){
    results.push(getRandomNumber100())
  }
  const has_less = results.find((v) => v <= 0) || false
  const has_more = results.find((v) => v >= 101) || false
  expect(has_less || has_more).toBe(false)
})

test("getRandomNumber never returns less than 0 or greater than or equal to the limit", () => {

  const results = []
  for(let i = 0; i < 1000; i++){
    results.push(getRandomNumber(5))
  }
  const has_less = results.find((v) => v < 0) || false
  const has_more = results.find((v) => v >= 5) || false
  expect(has_less || has_more).toBe(false)
})

test.each([
  [4.49, 4],
  [4.4, 4],
  [4, 4],
  [4.5, 5],
  [4.50, 5],
  [4.51, 5],
  [4.500000000, 5],
  [4.5412381237, 5]
])('round(%d)', (value, expected) => {
  expect(roundToNearestInt(value)).toBe(expected)
})

test("getRandomValueFromList always returns a value", () => {
  const test_data = []
  for(let i = 0; i < 10; i++){
    test_data.push(getRandomNumber100())
  }
  const results = []
  for(let i = 0; i < 1000; i++){
    results.push(getRandomValueFromList(test_data))
  }
  const lacking_value = results.find((v) => !v) || false
  expect(lacking_value).toBe(false)
})

const shuffle_test_array = [
  {value: 1, key: 1},
  {value: 2, key: 2},
  {value: 3, key: 3},
  {value: 4, key: 4},
  {value: 5, key: 5}
]
test("shuffleKeyedArray returns the same length of array", () => {
  const results = []
  for(let i = 0; i < 1000; i++){
    results.push(shuffleKeyedArray(shuffle_test_array).length)
  }
  const has_offender = results.find((v) => v !== 5) || false
  expect(has_offender).toBe(false)
})

test("shuffleKeyedArray does not duplicate values", () => {
  const results = []
  for(let i = 0; i < 1000; i++){
    results.push(shuffleKeyedArray(shuffle_test_array))
  }

  let duplicated = false
  const keys = shuffle_test_array.map((k) => k.key)
  for(let key of keys){
    for(let shuffled of results){
      const keys_in_array = shuffled.filter((k) => k.key === key)
      if(keys_in_array.length > 1){
        duplicated = true
        break
      }
    }
    if(duplicated){
      break
    }
  }

  expect(duplicated).toBe(false)
})

test("shuffleKeyedArray does not exclude values", () => {
  const results = []
  for(let i = 0; i < 1000; i++){
    results.push(shuffleKeyedArray(shuffle_test_array))
  }

  let excluded = false
  const keys = shuffle_test_array.map((k) => k.key)
  for(let key of keys){
    for(let shuffled of results){
      const keys_in_array = shuffled.filter((k) => k.key === key)
      if(keys_in_array.length < 1){
        excluded = true
        break
      }
    }
    if(excluded){
      break
    }
  }

  expect(excluded).toBe(false)
})

const basic_outcomes = [
  {name: "foo", value: 60},
  {name: "bar", value: 40}
]
test("handleOdds - basic outcomes will always return a value", () => {
  const results = []
  for(let i = 0; i < 1000; i++){
    results.push(handleOdds(basic_outcomes))
  }

  const has_null = results.find((r) => r === null) || false
  expect(has_null).toBe(false)
})

test("handleOdds - basic outcomes has a reasonably accurate distribution", () => {
  const results = []
  for(let i = 0; i < 1000; i++){
    results.push(handleOdds(basic_outcomes))
  }

  const foos = results.filter((n) => n === "foo").length
  const within_bounds = foos >= 575 && foos <= 625
  expect(within_bounds).toBe(true)
})

const complex_outcomes = [
  {name: "foo", value : 6},
  {name: "bar", value : 4},
  {name: "snake", value: 10},
  {name: "cat", value: 8},
  {name: "dog", value: 2},
  {name: "bear", value: 10},
  {name: "fish", value: 15},
  {name: "mouse", value: 5},
  {name: "bird", value: 7},
  {name: "pig", value: 3},
  {name: "cow", value: 14},
  {name: "insect", value: 6},
  {name: "deer", value: 10}
]
const complex_results = []
for(let i = 0; i < 1000; i++){
  complex_results.push(handleOdds(complex_outcomes))
}
test("handleOdds - complex outcomes will always return a value", () => {
  const results = []
  for(let i = 0; i < 1000; i++){
    results.push(handleOdds(complex_outcomes))
  }

  const has_null = results.find((r) => r === null) || false
  expect(has_null).toBe(false)
})

const to_test = complex_outcomes.map((o) => [o.name, o.value, complex_results])
test.each(to_test)('complex outcome %s is reasonably distributed as %i%', (name, value, results) => {
  const occurrences = results.filter((o) => o === name).length
  const goal = 1000 * (value / 100)
  const reasonable = occurrences >= (goal - 25) && occurrences <= (goal + 25)
  expect(reasonable).toBe(true)
})
