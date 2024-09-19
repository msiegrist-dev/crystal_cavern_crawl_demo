import warrior_deck from "../data/warrior_deck"

import {
  doesCardRequireGem, doesCardHaveRequiredGems, processGemAugment, isCardUsingGems,
  addCardToDeck, removeCardFromDeck, getRandomCards
} from "../Game/lib/cards"

const getCard = name => warrior_deck.find((c) => c.name === name)

test("Attack does not require a gem to play", () => {
  expect(doesCardRequireGem(getCard("Attack"))).toBe(false)
})

test("Steel Yourself does not require a gem to play", () => {
  expect(doesCardRequireGem(getCard("Steel Yourself"))).toBe(false)
})

test("Immovable Force does require a gem to play", () => {
  expect(doesCardRequireGem(getCard("Immovable Force"))).toBe(true)
})

test("Immovable Force cannot be played with only one blue gem", () => {
  const card = getCard("Immovable Force")
  card.gem_inventory = {
    blue: 1
  }
  expect(doesCardHaveRequiredGems(card)).toBe(false)
})

test("Immovable Force cannot be played with only one red gem", () => {
  const card = getCard("Immovable Force")
  card.gem_inventory = {
    blue: 1
  }
  expect(doesCardHaveRequiredGems(card)).toBe(false)
})

test("Immovable Force can be played with one gem of each color", () => {
  const card = getCard("Immovable Force")
  card.gem_inventory = {
    blue: 1,
    red: 1
  }
  expect(doesCardHaveRequiredGems(card)).toBe(true)
})

test("Steel Yourself does not require a gem, the effect is optional", () => {
  const card = getCard("Steel Yourself")
  card.gem_inventory = {
    red: 1
  }
  expect(doesCardHaveRequiredGems(card)).toBe(true)
})

test("Processing Basic Attac gem augment has no effect", () => {
  const card = getCard("Attack")
  expect(processGemAugment(card)).toEqual(card)
})

test("Processing Sweeping Blade gem augment without inventory has no effect", () => {
  const card = getCard("Sweeping Blade")
  expect(
    processGemAugment(
      {
        ...card,
        gem_inventory: {
          red: 0
        }
      }
    )
  )
  .toStrictEqual(
    {
      ...card,
      gem_inventory: {
        red: 0
      }
    }
  )
})

test("Processing Sweeping Blade gem augment without sufficient gems has no effect", () => {
  const card = getCard("Sweeping Blade")
  const modified = {
    ...card,
    gem_augments : {
      red: {...card.gem_augments.red, number: 3}
    }
  }
  expect(
    processGemAugment(
      {
        ...modified,
        gem_inventory: {
          red: 2
        }
      }
    )
  )
  .toStrictEqual({
    ...modified,
    gem_inventory: {
      red: 2
    }
  })
})

test("Processing Sweeping Blade gem augment increases card base damage", () => {
  const card = getCard("Sweeping Blade")
  expect(
    processGemAugment(
      {
        ...card,
        gem_inventory: {
          red: 1
        }
      }
    )
  )
  .toStrictEqual(
    {
      ...card,
      gem_inventory: {
        red: 0
      },
      value: 7
    }
  )
})

test("Processing Overhead Slice gem augment only consumes the gem", () => {
  const card = getCard("Overhead Slice")
  expect(
    processGemAugment(
      {
        ...card,
        gem_inventory: {
          red: 1
        }
      }
    )
  )
  .toStrictEqual(
    {
      ...card,
      gem_inventory: {
        red: 0
      }
    }
  )
})

test("Processing Warrior's Resolve gem augment adds a give block on attack effect to the card", () => {
  const card = getCard("Warrior's Resolve")
  expect(
    processGemAugment(
      {
        ...card,
        gem_inventory: {
          blue: 1
        }
      }
    )
  )
  .toStrictEqual(
    {
      ...card,
      effects: [
        ...card.effects,
        {
          name: "give_doer_block",
          value: 3,
          trigger: "on_attack",
          buff_name: undefined,
          stat_name: undefined
        }
      ],
      gem_inventory: {
        blue: 0
      }
    }
  )
})

test("Processing push_to_effect gem augments will grant the card effects should it have no base effects", () => {
  const card = getCard("Sturdy Style")
  expect(
    processGemAugment(
      {
        ...card,
        gem_inventory: {
          blue: 1,
          red: 1
        }
      }
    )
  )
  .toEqual(
    {
      ...card,
      effects: [
        {
          name: "give_doer_stat",
          value: 4,
          trigger: "on_attack",
          stat_name: "attack"
        }
      ],
      gem_inventory: {
        blue: 0,
        red: 0
      }
    }
  )
})

test("isCardUsingGems returns true if card has any gems in inventory", () => {
  const card = {
    type: "effect",
    gem_inventory: {
      red: 0,
      blue: 0
    },
    gem_augments: {
      red: {number: 2, effect: false, required: true},
      blue: {number: 1, effect: false, required: true},
    }
  }
  expect(isCardUsingGems(card)).toBe(false)
  card.gem_inventory = {red: 1, blue: 1}
  expect(isCardUsingGems(card)).toBe(true)
  card.gem_inventory = {red: 1, blue: 0}
  expect(isCardUsingGems(card)).toBe(true)
  card.gem_inventory = {red: 0, blue: 1}
  expect(isCardUsingGems(card)).toBe(true)
  card.gem_inventory = undefined
  expect(isCardUsingGems(card)).toBe(false)
  card.gem_inventory = {red: 0, blue: 0}
  expect(isCardUsingGems(card)).toBe(false)

})

test("addCardToDeck assigns a random key to a card and places it in the deck", () => {
  const gs = {
    character: {
      deck: [
        {key: 1},
        {key: 2},
        {key: 7}
      ]
    }
  }
  const add = addCardToDeck(gs, {type: "defend", value: 3})
  const deck = add.character.deck

  expect(deck).toHaveLength(4)
  expect(deck.find((c) => c.type === "defend")).toBeDefined()
  const keys = deck.map((c) => c.key)
  for(let i = 0; i < keys.length; i++){
    expect(keys.indexOf(keys[i])).toBe(i)
  }
})

test("removeCardFromDeck removes card by its key and returns state with updated deck", () => {
  const gs = {
    character: {
      deck: [
        {key: 1},
        {key: 2},
        {key: 7},
        {key: 30}
      ]
    }
  }
  const remove = removeCardFromDeck(gs, {key: 7})
  const deck = remove.character.deck

  expect(deck).toHaveLength(3)
  expect(deck.find((c) => c.key === 7)).toBeUndefined()
  const keys = deck.map((c) => c.key)
  for(let i = 0; i < keys.length; i++){
    expect(keys.indexOf(keys[i])).toBe(i)
  }
})

test("getRandomCards returns x cards from the character-type's entire possible deck", () => {
  const randoms = getRandomCards(10)
  expect(randoms).toHaveLength(10)
  for(let card of randoms){
    expect(warrior_deck.find((c) => c.name === card.name)).toBeDefined()
  }
})
