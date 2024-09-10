import warrior_deck from "../data/warrior_deck"

import {doesCardRequireGem, doesCardHaveRequiredGems, processGemAugment} from "../Game/lib/cards"

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

test("Immovable Force cannot be played with only one gem", () => {
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
