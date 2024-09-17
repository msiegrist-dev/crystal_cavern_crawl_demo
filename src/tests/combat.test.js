import items from "../data/items"

import {
  getAttackValue, getRemainingBlock, getBlockValue, processAction, getTurnOrder,
  getEnemyAction, drawCards, sendCardsToGraveYard, processEffect
} from "../Game/lib/combat"
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

const summoned_daddy_state = {
  level: {
    enemies: [
      {...groblin_daddy, key: 3},
      {name: "Groblin", hp: 2},
      {name: "Groblin", hp: 1}
    ]
  }
}
test("getEnemyAction does not return a summon effect if daddy and 2 groblins", () => {
  const action = getEnemyAction(summoned_daddy_state, groblin_daddy)
  const effect = action.type === "effect"
  expect(effect).toBe(false)
})

test("getEnemyAction always returns an action", () => {
  const actions = []
  for(let i = 0; i < 500; i++){
    actions.push(getEnemyAction(summoned_daddy_state, groblin_daddy))
  }
  const not_an_action = actions.filter((a) => {
    if(!a) return true
    if(!a.type) true
    if(a.type !== "attack" && a.type !== "defend" && a.type !== "effect") return true
    return false
  })

  expect(not_an_action).toEqual([])
})

const attack_card = {type: "attack", value: 1}
test("drawCards returns 4 cards from draw pile", () => {
  const hand = []
  const draw_pile = [
    {...attack_card, key: 1},
    {...attack_card, key: 2},
    {...attack_card, key: 3},
    {...attack_card, key: 4},
  ]
  const graveyard = []

  const card_state = drawCards(draw_pile, graveyard, hand, 3)
  expect(card_state.draw_pile.length).toBe(1)
  expect(card_state.hand.length).toBe(3)

  const keys = [
    ...card_state.hand.map((c) => c.key),
    card_state.draw_pile[0].key
  ]
  let unique = true
  for(let i = 0; i < keys.length; i++){
    if(keys.indexOf(keys[i]) !== i){
      unique = false
      break
    }
  }
  expect(unique).toBe(true)
})

test("drawCards can shuffle graveyard into draw_pile to obtain more cards", () => {
  const hand = []
  const draw_pile = [
    {...attack_card, key: 1},
  ]
  const graveyard = [
    {...attack_card, key: 2},
    {...attack_card, key: 3},
    {...attack_card, key: 4},
  ]

  const card_state = drawCards(draw_pile, graveyard, hand, 4)
  expect(card_state.draw_pile.length).toBe(0)
  expect(card_state.hand.length).toBe(4)

  const keys = card_state.hand.map((c) => c.key)
  let unique = true
  for(let i = 0; i < keys.length; i++){
    if(keys.indexOf(keys[i]) !== i){
      unique = false
      break
    }
  }
  expect(unique).toBe(true)
})

const send_cards_hand = [
  {...attack_card, key: 1, gem_inventory: {red: 0, blue: 0}},
  {...attack_card, key: 7, gem_inventory: {red: 2, blue: 3}}
]
const send_cards_graveyard = [
  {...attack_card, key: 2},
  {...attack_card, key: 3},
  {...attack_card, key: 4},
]

test("sendCardsToGraveYard removes card from hand and adds it to the graveyard", () => {
  const game_state = {foo: "bar"}

  const sent = sendCardsToGraveYard(
    [...send_cards_hand], [send_cards_hand[0]],
    [...send_cards_graveyard], game_state
  )

  expect(sent.game_state).toEqual(game_state)
  expect(sent.graveyard.length).toBe(4)
  expect(sent.hand.length).toBe(1)

  const in_hand = sent.hand.find((c) => c.key === 1)
  expect(in_hand).toBe(undefined)

  const in_grave = sent.graveyard.findIndex((c) => c.key === 1)
  expect(in_grave).toBeGreaterThan(-1)
})

test("sendCardsToGraveyard returns any gems in card inventory to player", () => {
  const game_state = {
    character: {
      name: "warrior",
      gems: {
        red: 0,
        blue: 0
      }
    }
  }

  const sent = sendCardsToGraveYard(
    [...send_cards_hand], [send_cards_hand[1]],
    [...send_cards_graveyard], game_state
  )

  expect(sent.game_state).toEqual({
    character: {
      name: "warrior",
      gems: {
        red: 2,
        blue: 3
      }
    }
  })
  expect(sent.graveyard.length).toBe(4)
  expect(sent.hand.length).toBe(1)

  const in_hand = sent.hand.find((c) => c.key === 7)
  expect(in_hand).toBe(undefined)

  const in_grave = sent.graveyard.findIndex((c) => c.key === 7)
  expect(in_grave).toBeGreaterThan(-1)
})

test("effect type actions will trigger all their effects", () => {
  const doer = {...default_entity}
  const target = {...default_entity}

  const action = {
    type: "effect",
    effects: [
      {
        name: "give_doer_block",
        value: 2
      },
      {
        name: "give_doer_buff",
        value: 2,
        buff_name: "fervor"
      },
      {
        name: "give_target_buff",
        value: 2,
        buff_name: "slowed"
      },
      {
        name: "give_doer_stat",
        value: 5,
        stat_name: "attack"
      },
      {
        name: "remove_doer_hp",
        value: 5
      }
    ]
  }

  expect(processEffect(doer, target, action, [], () => true))
  .toEqual({
    doer: {
      ...default_entity,
      block: 2,
      attack: 1,
      buffs: {
        fervor: 2
      },
      hp: 95,
      flat_stat_increases: {
        attack: 5
      }
    },
    target: {
      ...default_entity,
      buffs: {
        slowed: 2
      }
    },
    combat_log: []
  })
})
