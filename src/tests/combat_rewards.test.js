import {
  getRandomCharacterEntity, getTradeSelections, determineVictoryReward,
  getPossibleCharEntities, getRewardChoices
  } from "../Game/lib/combat_rewards"
import environment from "../data/environment"

const test_char = {
  name: "Warrior",
  deck: [
    {name: "Attack", type: "attack", value: 2, key: 0},
    {name: "Attack", type: "attack", value: 2, key: 1},
  ],
  gems : {
    red: 1,
  },
  inventory: [
    {
      name: "Rusty Dagger",
      increase_stats: [
        {name: "attack", value: 1, type: "flat"}
      ],
      rarity: "common",
      image: "rusty_dagger.png",
      description: "If the blade doesn't get you, the tetanus will."
    },
    {
      name: "Flip Flops",
      increase_stats: [
        {name: "speed", value: 1, type: "flat"}
      ],
      rarity: "common",
      image: "flips.png"
    },
  ]
}

test("getRandomCharacterEntity returns item from corresponding entity", () => {
  const card = getRandomCharacterEntity(test_char, "card")
  const gem = getRandomCharacterEntity(test_char, "gem")
  const item = getRandomCharacterEntity(test_char, "item")

  expect(card.type).toBe("attack")
  expect(card.name).toBe("Attack")
  expect(card.key === 0 || card.key === 1).toBe(true)

  expect(gem.name).toBeDefined()
  expect(gem.value).toBeGreaterThan(0)

  expect(item.name).toBeDefined()
  expect(item.rarity).toBe("common")
})

test("getPossibleCharEntities only returns available entities", () => {
  const none = getPossibleCharEntities({
    ...test_char, deck: [], gems: {}, inventory: []
  })
  const one_deck = getPossibleCharEntities({
    ...test_char, deck: [{type: "attack"}], gems: {}, inventory: []
  })
  const one_gem = getPossibleCharEntities({
    ...test_char, deck: [], gems: {red: 1}, inventory: []
  })
  const one_item = getPossibleCharEntities({
    ...test_char, deck: [], gems: {}, inventory: [{name: "item"}]
  })
  const two = getPossibleCharEntities({
    ...test_char, deck: [], gems: {red: 1}, inventory: [{name: "item"}]
  })
  const all = getPossibleCharEntities({
    ...test_char, deck: [{type: "attack"}], gems: {red: 1}, inventory: [{name: "item"}]
  })

  expect(none.length).toBe(0)
  expect(one_deck).toEqual(["card"])
  expect(one_gem).toEqual(["gem"])
  expect(one_item).toEqual(["item"])
  expect(two).toEqual(["item", "gem"])
  expect(all).toEqual(["item", "card", "gem"])
})

test("determineVictoryReward returns a value from environment lists", () => {
  const results = []
  for(let i = 0; i < 100; i++){
    results.push(determineVictoryReward())
  }

  results.forEach((r) => {
    expect(r).toBeDefined()
    expect(environment.ALL_REWARDS.includes(r)).toBe(true)
  })
})

test("getTradeSelections will not return a trade in entity that the character does not possess", () => {
  let selections = getTradeSelections(50, "random", {...test_char, gems: {red: 0, blue: 0}})
  for(let selection of selections){
    expect(selection.trade_in !== "gem").toBe(true)
    expect(selection.trade_in_entity).toBeDefined()
    expect(selection.trade_for_entity).toBeDefined()
  }

  selections = getTradeSelections(50, "random", {...test_char, gems: {red: 0, blue: 0}, inventory: []})
  for(let selection of selections){
    expect(["gem", "item"].includes(selections.trade_in)).toBe(false)
    expect(selection.trade_in_entity).toBeDefined()
    expect(selection.trade_for_entity).toBeDefined()
  }
})

test("getRewardChoices has a return value for every possible reward", () => {
  for(let reward of environment.ALL_REWARDS){
    const [type, entity] = reward.split("_")
    const choices = getRewardChoices(type, entity, {character: test_char})
    expect(choices.length).toBeGreaterThan(0)
    for(let choice of choices){
      if(choice.type === "trade") continue
      expect(choice).toBeDefined()
      if(entity === "stat" || entity === "gem"){
        expect(choice.name).toBeDefined()
        expect(choice.value).toBeDefined()
      }
      if(entity === "item"){
        expect(choice.rarity).toBeDefined()
        expect(choice.name).toBeDefined()
        expect(choice.image).toBeDefined()
      }
      if(entity === "card"){
        expect(choice.type).toBeDefined()
        expect(choice.name).toBeDefined()
      }
    }
  }
})
