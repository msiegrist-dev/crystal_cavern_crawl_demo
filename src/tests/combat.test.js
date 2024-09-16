import items from "../data/items"

import {getAttackValue, getRemainingBlock, getBlockValue, processAction, getTurnOrder, getEnemyAction} from "../Game/lib/combat"
import {giveCharacterItem} from "../Game/lib/items"

import groblin_foot_state from "./game_states/groblin_foot"

import groblin_daddy from "../data/bosses/groblin_daddy"

const default_entity = {
  attack: 1,
  defense: 1,
  max_hp: 100,
  hp: 100,
  speed: 1,
  block: 0,
  inventory: [],
  buffs: {},
  armor: .1
}

const getItem = name => items.find((i) => i.name === name)

test("attack stat value is added to attack action value", () => {
  expect(
    getAttackValue(default_entity, {type: "attack", value: 1})
  ).toBe(2)
})

test("base attack stat values can be increased by items in the inventory", () => {

  const state = {
    character: {...default_entity}
  }
  const given_dagger = giveCharacterItem(state, getItem("Rusty Dagger"))

  expect(
    getAttackValue(given_dagger.character, {type: "attack", value: 1})
  ).toBe(3)
})

test("fervor buff action value and stat increases are immediately rounded - no impact on value of 1", () => {
  expect(
    getAttackValue(
      {
        ...default_entity,
        buffs: {
          fervor: 1
        }
      }, {type: "attack", value: 1}
    )
  ).toBe(2)
})

test("fervor buff increases attack value by 25%", () => {
  expect(
    getAttackValue(
      {
        ...default_entity,
        buffs: {
          fervor: 1
        }
      }, {type: "attack", value: 2}
    )
  ).toBe(4)
})

test("fervor buff increases stat value by 25%", () => {
  expect(
    getAttackValue(
      {
        ...default_entity,
        attack: 2,
        buffs: {
          fervor: 1
        }
      }, {type: "attack", value: 1}
    )
  ).toBe(4)
})

test("block_as_bonus_attack effect adds value to action value", () => {
  expect(
    getAttackValue(
      {
        ...default_entity,
        block: 10
      },
      {
        type: "attack",
        value: 1,
        effects: [
          {
            name: "block_as_bonus_attack",
            value: .25
          },
        ],
      }
    )
  ).toBe(5)
})

test("block_as_attack effect takes a percent of block to use as action value", () => {
  expect(
    getAttackValue(
      {
        ...default_entity,
        block: 10
      },
      {
        type: "attack",
        value: 1,
        effects: [
          {
            name: "block_as_attack",
            value: .5
          },
        ],
      }
    )
  ).toBe(6)
})

test("block_as_attack effect takes a percent of block to use as action value and is increased by fervor", () => {
  expect(
    getAttackValue(
      {
        ...default_entity,
        block: 10,
        buffs: {
          fervor: 1
        }
      },
      {
        type: "attack",
        value: 1,
        effects: [
          {
            name: "block_as_attack",
            value: .5
          },
        ],
      }
    )
  ).toBe(7)
})

test("flat_stat_increases from buffs and effects are added to attack stat", () => {
  expect(
    getAttackValue(
      {
        ...default_entity,
        flat_stat_increases: {
          attack: 1
        }
      },
      {
        type: "attack",
        value: 1,
      }
    )
  ).toBe(3)
})

test("flat_stat_increases from buffs and effects are added to attack stat and increased by fervor", () => {
  expect(
    getAttackValue(
      {
        ...default_entity,
        buffs: {
          fervor: 1
        },
        flat_stat_increases: {
          attack: 1
        }
      },
      {
        type: "attack",
        value: 1,
      }
    )
  ).toBe(4)
})

test("burned debuff decreases final damage value by 25%", () => {
  expect(
    getAttackValue(
      {
        ...default_entity,
        buffs: {
          burned: 1
        }
      },
      {
        type: "attack",
        value: 3,
      }
    )
  ).toBe(3)
})

test("armor damage reduction is rounded so low values have no impact", () => {
  expect(
    getRemainingBlock(
      {
        ...default_entity,
        block: 10
      },
      5,
      false
    )
  ).toBe(5)
})

test("armor damage reduction is rounded so values must be high enough to have impact", () => {
  expect(
    getRemainingBlock(
      {
        ...default_entity,
        block: 10
      },
      10,
      false
    )
  ).toBe(1)
})

test("armor piercing effect ignores armor reduction entirely", () => {
  expect(
    getRemainingBlock(
      {
        ...default_entity,
        block: 10
      },
      10,
      true
    )
  ).toBe(0)
})

test("when armor is consumed, a negative value is returned", () => {
  expect(
    getRemainingBlock(
      {
        ...default_entity,
        block: 0
      },
      10,
      false
    )
  ).toBe(-9)
})

test("defense stat is added to block action value", () => {
  expect(
    getBlockValue(
      default_entity,
      {name: "defend", value: 1},
      true
    )
  ).toBe(2)
})

test("items add to base defense stat which is added to block action value", () => {
  const gs = {character: default_entity}
  const given = giveCharacterItem(gs, getItem("Poor Man's Shield"))
  expect(
    getBlockValue(
      given.character,
      {name: "defend", value: 1},
      true
    )
  ).toBe(3)
})

test("defeating an enemy while you have Lucky Groblin's Foot will draw a card if you have one", () => {

  const processed_action = processAction(
    groblin_foot_state, groblin_foot_state.character, [0],
    {type: "attack", value: 300, hits: 1}, [], () => true,
    {enemies_killed: 0}, () => true,
    {hand: [], graveyard: [], draw_pile: [{type:" attack", value: 12}]}
  )

  expect(processed_action.card_state.hand.length).toBe(1)
})

test("getTurnOrders returns enemies ranked by speed 1", () => {
  const state = {
    character: {
      speed: 3
    },
    level: {
      enemies: [
        {key: 6, speed: 2, hp: 2},
        {key: 4, speed: 1, hp: 2}
      ]
    }
  }
  expect(getTurnOrder(state)).toEqual([
    {key: "player", speed: 3},
    {key: 6, speed: 2},
    {key: 4, speed: 1}
  ])
})

test("getTurnOrders returns enemies ranked by speed 2", () => {
  const state = {
    character: {
      speed: 1
    },
    level: {
      enemies: [
        {key: 6, speed: 4, hp: 2},
        {key: 4, speed: 8, hp: 4}
      ]
    }
  }
  expect(getTurnOrder(state)).toEqual([
    {key: 4, speed: 8},
    {key: 6, speed: 4},
    {key: "player", speed: 1},
  ])
})

test("getTurnOrders returns all enemies when shuffling like speed entities", () => {
  const state = {
    character: {
      speed: 2
    },
    level: {
      enemies: [
        {key: 6, speed: 2, hp: 2},
        {key: 4, speed: 2, hp: 4}
      ]
    }
  }
  const turn_order = getTurnOrder(state)
  const player = turn_order.find((t) => t.key === "player")
  const six = turn_order.find((t) => t.key === 6)
  const four = turn_order.find((t) => t.key === 4)
  const isPass = () => {
    if(turn_order.length !== 3) return false
    if(!player) return false
    if(!six) return false
    if(!four) return false
    return true
  }

  expect(isPass()).toBe(true)
})

test("getEnemyAction returns a summon effect if daddy and 0 groblins", () => {
  const state = {
    level: {
      enemies: [
        {...groblin_daddy, key: 3},
      ]
    }
  }
  expect(getEnemyAction(state, groblin_daddy)).toBe(groblin_daddy.options.effect[0])
})

test("getEnemyAction does not return a summon effect if daddy and 2 groblins", () => {
  const state = {
    level: {
      enemies: [
        {...groblin_daddy, key: 3},
        {name: "Groblin", hp: 2},
        {name: "Groblin", hp: 1}
      ]
    }
  }

  const action = getEnemyAction(state, groblin_daddy)
  const effect = action.type === "effect"

  expect(effect).toBe(false)
})

test("getEnemyAction always retursn an action", () => {
  const state = {
    level: {
      enemies: [
        {...groblin_daddy, key: 3},
        {name: "Groblin", hp: 2},
        {name: "Groblin", hp: 1}
      ]
    }
  }

  const actions = []
  for(let i = 0; i < 500; i++){
    actions.push(getEnemyAction(state, groblin_daddy))
  }
  const not_an_action = actions.filter((a) => {
    if(!a) return true
    if(!a.type) true
    if(a.type !== "attack" && a.type !== "defend" && a.type !== "effect") return true
    return false
  })

  expect(not_an_action).toEqual([])

})
