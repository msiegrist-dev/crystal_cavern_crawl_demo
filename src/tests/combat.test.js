import items from "../data/items"
import {giveCharacterItem} from "../Game/lib/items"
import {
  getAttackValue, getRemainingBlock, getBlockValue, processAction, getTurnOrder,
  getEnemyAction, drawCards, sendCardsToGraveYard, processEffect, initCombatantTurn,
  reduceBlockCombatStart, processAttack, playCard, addGemToCard, returnCardGemToCharacter,
  combatantHasCondition, mapEnemiesForCombat
} from "../Game/lib/combat"


import groblin_foot_state from "./game_states/groblin_foot"
import groblin_daddy from "../data/bosses/groblin_daddy"
import groblin from "../data/mobs/groblin"

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

const attack_action = {
  type: "attack",
  value: 1
}

const defend_action = {
  type: "defend",
  value: 1
}

const empty_card_state = {
  hand: [],
  graveyard: [],
  draw_pile: []
}

const getItem = name => items.find((i) => i.name === name)

test("attack stat value is added to attack action value", () => {
  expect(getAttackValue(default_entity, attack_action)).toBe(2)
})

test("base attack stat values can be increased by items in the inventory", () => {
  const given_dagger = giveCharacterItem({...default_entity}, getItem("Rusty Dagger"))
  expect(getAttackValue(given_dagger, attack_action)).toBe(3)
})

test("fervor buff action value and stat increases are immediately rounded - no impact on value of 1", () => {
  expect(
    getAttackValue(
      {
        ...default_entity,
        buffs: {
          fervor: 1
        }
      }, attack_action
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
      }, {...attack_action, value: 2}
    )
  ).toBe(4)
})

test("certain actions will not process attack modifiers whatsoever and will only use base value", () => {
  expect(
    getAttackValue(
      {
        ...default_entity,
        attack: 4,
        buffs: {
          fervor: 1
        }
      },
      {...attack_action, do_not_process_attack_modifiers: true}
    )
  ).toBe(1)
})

test("block_as_bonus_attack effect adds value to action value", () => {
  expect(
    getAttackValue(
      {
        ...default_entity,
        block: 10
      },
      {
        ...attack_action,
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
        ...attack_action,
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
        ...attack_action,
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
      }, attack_action
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
      }, attack_action
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
  expect(getBlockValue({...default_entity}, {...defend_action}, true)).toBe(2)
})

test("items add to character's base defense stat which is added to block action value", () => {
  const given = giveCharacterItem({...default_entity}, getItem("Poor Man's Shield"))
  expect(getBlockValue(given, {...defend_action}, true)).toBe(3)
})

test("stat increases add to base defense stat which is added to block action value", () => {
  const given = giveCharacterItem({...default_entity}, getItem("Poor Man's Shield"))
  given.flat_stat_increases = {
    defense: 2
  }
  expect(getBlockValue(given, {...defend_action}, true)).toBe(5)
})

test("fortify increaess final block value by 20% rounded", () => {
  const given = giveCharacterItem({...default_entity}, getItem("Poor Man's Shield"))
  given.flat_stat_increases = {defense: 1}
  given.buffs = {fortify: 1}
  expect(getBlockValue(given, {...defend_action}, true)).toBe(5)
})

test("fortify increaess final block value by 20% rounded 2", () => {
  const given = giveCharacterItem({...default_entity}, getItem("Poor Man's Shield"))
  given.flat_stat_increases = {defense: 4}
  given.buffs = {fortify: 1}
  expect(getBlockValue(given, {...defend_action}, true)).toBe(8)
})

test("defeating an enemy while you have Lucky Groblin's Foot will draw a card if you have one - empty hand", () => {

  const processed_action = processAction(
    groblin_foot_state, groblin_foot_state.character, [0],
    {type: "attack", value: 300, hits: 1}, [], () => true,
    {enemies_killed: 0}, () => true,
    {hand: [], graveyard: [], draw_pile: [{type: "attack", value: 12}]}
  )

  expect(processed_action.card_state.hand).toHaveLength(1)
  expect(processed_action.card_state.draw_pile).toHaveLength(0)
  expect(processed_action.card_state.hand.find((c) => c.type === "attack" && c.value === 12)).toBeDefined()
})

test("defeating an enemy while you have Lucky Groblin's Foot will draw a card if you have one - cards in hand", () => {

  const processed_action = processAction(
    groblin_foot_state, groblin_foot_state.character, [0],
    {type: "attack", value: 300, hits: 1}, [], () => true,
    {enemies_killed: 0}, () => true,
    {hand: [{type: "defend", value: 3}, {type: "defend", value: 4}], graveyard: [], draw_pile: [{type: "attack", value: 12}]}
  )

  expect(processed_action.card_state.hand).toHaveLength(3)
  expect(processed_action.card_state.draw_pile).toHaveLength(0)
  expect(processed_action.card_state.hand.filter((c) => c.type === "defend")).toHaveLength(2)
  expect(processed_action.card_state.hand.filter((c) => c.type === "attack")).toHaveLength(1)
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

test("getTurnOrder slowed buff will decrease speed by half", () => {
  const state = {
    character: {
      speed: 4,
      buffs: {slowed: 2}
    },
    level: {
      enemies: [
        {key: 6, speed: 4, hp: 2},
        {key: 4, speed: 3, hp: 4}
      ]
    }
  }
  expect(getTurnOrder(state)).toEqual([
    {key: 6, speed: 4},
    {key: 4, speed: 3},
    {key: "player", speed: 2},
  ])
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
    combat_log: [
      "undefined used give_doer_block on undefined",
      "undefined used give_doer_buff on undefined",
      "undefined used give_target_buff on undefined",
      "undefined used give_doer_stat on undefined",
      "undefined used remove_doer_hp on undefined",
    ]
  })
})

test("effect type actions can miss based on accuracy value like attacks", () => {
  const doer = {...default_entity}
  const target = {...default_entity}

  const action = {
    type: "effect",
    accuracy: 0,
    effects: [
      {
        name: "give_doer_block",
        value: 2
      }
    ]
  }

  expect(processEffect({...default_entity}, {...default_entity}, action, [], () => true))
  .toEqual({
    doer: {...default_entity},
    target: {...default_entity},
    combat_log: []
  })
})

test.each([
  [3, 3],
  [0, 0],
  [null, 0],
  [undefined, 0],
  [4, 2],
  [6, 3],
  [7, 4],
  [200, 100],
  [89, 45]
])('reduceBlockCombatStart(%d)', (value, expected) => {
  expect(reduceBlockCombatStart(value)).toBe(expected)
})

test("initial phase of combatant turn will remove stat effects, decrease buffs by 1 and reduce block", () => {
  const combatant = {
    name: "groblin",
    hp: 10,
    flat_stat_increases: {attack: 2},
    buffs: {
      flame_guard: 12,
      thorns: 0
    },
    block: 8
  }
  expect(initCombatantTurn(combatant, 1)).toEqual({
    ...combatant,
    flat_stat_increases:{},
    buffs: {
      flame_guard: 11,
      thorns: 0
    },
    block: 4
  })
})

test("initial phase of combatant on turn 1 will trigger starting_buffs item effects", () => {
  const combatant = {
    name: "groblin",
    hp: 10,
    inventory: [
      {
        name: "Armor of Annoyance",
        starting_buffs: [
          {name: "thorns", value: 2}
        ],
        rarity: "uncommon",
        image: "armor_of_annoyance.png"
      },
    ]
  }
  expect(initCombatantTurn(combatant, 1)).toEqual({
    ...combatant,
    block: 0,
    buffs: {
      thorns: 2
    },
    flat_stat_increases: {}
  })
})

test("attacking an enemy with thorns will return damage to the attack if the hit lands", () => {
  const doer = {...default_entity}
  const target = {
    ...default_entity,
    buffs: {
      thorns: 2
    }
  }
  const action = {
    type: "attack",
    value: 2,
    accuracy: 100,
    hits: 1
  }

  const processed = processAttack(
    doer, target, action, [], () => true, false, false
  )
  expect(processed.doer).toEqual({...default_entity, hp: 95})
  expect(processed.target).toEqual({...target, hp: 97})
  expect(processed.damage_dealt).toBe(3)
})

test("attacking an enemy with thorns will return damage to the attack per hit if the hit lands", () => {
  const doer = {...default_entity}
  const target = {
    ...default_entity,
    buffs: {
      thorns: 2
    }
  }
  const action = {
    type: "attack",
    value: 2,
    accuracy: 100,
    hits: 2
  }

  const processed = processAttack(
    doer, target, action, [], () => true, false, false
  )
  expect(processed.doer).toEqual({...default_entity, hp: 90})
  expect(processed.target).toEqual({...target, hp: 94})
  expect(processed.damage_dealt).toBe(6)
})

test("processAction with a defend type action with action effects", () => {
  const test_card = {
    type: "defend",
    target_required: false,
    value: 2,
    effects: [
      {name: "give_doer_buff", buff_name: "thorns", value: 1}
    ]
  }

  const doer = {...default_entity, key: "player"}
  const game_state = {
    character: doer,
    level: {
      enemies: [
        {...default_entity}
      ]
    }
  }
  const processed = processAction(
    game_state, doer, ["player"], test_card, [], () => true, [], () => true,
    {...empty_card_state}
  )
  expect(processed.game_state.character).toEqual(
    {...default_entity, key: "player", block: 3, buffs: {thorns: 1}}
  )
  expect(processed.card_state.hand).toHaveLength(0)
  expect(processed.card_state.draw_pile).toHaveLength(0)
  expect(processed.card_state.graveyard).toHaveLength(0)
})

test("processAttack will trigger on hit effects when a hit lands ", () => {
  const test_action = {
    type: "attack",
    value: 4,
    hits: 1,
    target_required: true,
    effects: [
      {
        name: "give_doer_block",
        value: 2,
        trigger: "on_hit"
      }
    ],
    accuracy: 100
  }

  const doer = {...default_entity, key: "player"}
  const target = {...default_entity, key: 1}
  const processed = processAttack(doer, target, test_action, [], () => true, false, false)

  expect(processed.doer).toEqual({...doer, block: 2})
  expect(processed.target).toEqual({...target, hp: 95})
  expect(processed.total_damage).toBe(5)
})

test("processAttack - landing a hit on a target with flame guard applies burn to the attacker", () => {
  const test_action = {
    type: "attack",
    value: 4,
    hits: 2,
    target_required: true,
    accuracy: 100
  }

  const doer = {...default_entity, key: "player"}
  const target = {...default_entity, key: 1, buffs: {flame_guard: 1}, block: 3}
  const processed = processAttack(doer, target, test_action, [], () => true, false, false)
  expect(processed.doer).toEqual({...doer, buffs: {burned: 2}})
  expect(processed.target).toEqual({...target, hp: 94, block: 0})
})

test("processAttack will trigger on_attack effects should one hit of the attack land", () => {
  const action = {
    type: "attack",
    accuracy: 100,
    hits: 1,
    value: 5,
    effects: [
      {name: "give_doer_block", value: 10, trigger: "on_attack"},
      {name: "give_doer_buff", value: 2, buff_name: "thorns", trigger: "on_attack"}
    ]
  }
  const doer = {...default_entity, key: "player", buffs: {}}
  const target = {...default_entity, key: 1, block: 30}
  const processed = processAttack(doer, target, action, [], () => true, false, false)
  expect(processed.doer).toEqual({...doer, block: 10, buffs: {thorns: 2}})
  expect(processed.target).toEqual({...target, block: 25})
})

test("processAttack - missing an attack will not trigger any effects", () => {
  const action = {
    type: "attack",
    accuracy: -1,
    hits: 1,
    value: 5,
    effects: [
      {name: "give_doer_block", value: 10, trigger: "on_attack"},
      {name: "give_doer_buff", value: 2, buff_name: "thorns", trigger: "on_attack"}
    ]
  }
  const doer = {...default_entity, key: "player", buffs: {}}
  const target = {...default_entity, key: 1, block: 30}
  const processed = processAttack(doer, target, action, [], () => true, false, false)
  expect(processed.doer).toEqual(doer)
  expect(processed.target).toEqual(target)
})

test("playCard processes card action accordingly and sends card to the graveyard, basic attack card", () => {
  const test_card = {
    type: "attack",
    value: 4,
    hits: 1,
    target_required: true,
    accuracy: 100
  }
  const state = {
    character: {...default_entity, key: "player"},
    level: {
      enemies: [
        {...default_entity, key: 1}
      ]
    }
  }

  const processed = playCard(
    test_card, state, [1], [test_card], [], [], () => true, [], () => true, () => true, [], () => true
  )
  const {game_state, card_state} = processed
  expect(card_state.hand).toHaveLength(0)
  expect(card_state.graveyard).toHaveLength(1)
  expect(card_state.draw_pile).toHaveLength(0)
  expect(game_state.level.enemies[0].hp).toBe(95)
})

test("playCard cannot play a card which requires gems without any gem inventory", () => {
  const test_card = {
    type: "attack",
    value: 4,
    hits: 1,
    target_required: true,
    accuracy: 100,
    gem_augments: {
      red: {
        number: 1,
        required: true,
        effect: false
      }
    }
  }
  const state = {
    character: {...default_entity, key: "player"},
    level: {
      enemies: [
        {...default_entity, key: 1}
      ]
    }
  }

  const processed = playCard(
    test_card, state, [1], [test_card], [], [], () => true, [], () => true, () => true, [], () => true
  )
  const {game_state, card_state} = processed
  expect(game_state).toBeUndefined()
  expect(card_state).toBeUndefined()
  expect(processed.error).toBeDefined()
  expect(processed.error).toBe("Card requires a gem to play.")
})

test("playCard cannot play a card which requires gems without meeting the required amount", () => {
  const test_card = {
    type: "attack",
    value: 4,
    hits: 1,
    target_required: true,
    accuracy: 100,
    gem_augments: {
      red: {
        number: 3,
        required: true,
        effect: false
      }
    },
    gem_inventory: {
      red: 2
    }
  }
  const state = {
    character: {...default_entity, key: "player"},
    level: {
      enemies: [
        {...default_entity, key: 1}
      ]
    }
  }

  const processed = playCard(
    test_card, state, [1], [test_card], [], [], () => true, [], () => true, () => true, [], () => true
  )
  const {game_state, card_state} = processed
  expect(game_state).toBeUndefined()
  expect(card_state).toBeUndefined()
  expect(processed.error).toBeDefined()
  expect(processed.error).toBe("Card requires a gem to play.")
})

test("playCard will add augment effects to the played card but the card sent to the graveyard is the original", () => {
  const test_card = {
    type: "attack",
    value: 4,
    hits: 1,
    target_required: true,
    accuracy: 100,
    gem_augments: {
      red: {
        number: 1,
        effect: true,
        effect_name: "increase_card_value",
        value: 3,
        effect_description: `Increase base damage by 3`
      }
    },
    gem_inventory: {
      red: 1
    }
  }
  const state = {
    character: {...default_entity, key: "player"},
    level: {
      enemies: [
        {...default_entity, key: 1}
      ]
    }
  }

  const processed = playCard(
    test_card, state, [1], [test_card], [], [], () => true, [], () => true, () => true, [], () => true
  )
  const {game_state, card_state} = processed
  expect(game_state.level.enemies[0].hp).toBe(93)
  expect(card_state.hand).toHaveLength(0)
  expect(card_state.draw_pile).toHaveLength(0)
  expect(card_state.graveyard[0]).toEqual({
    ...test_card,
    gem_inventory: {
      red: 0
    }
  })
})

test("addGemToCard finds card correctly by key and gives it a gem", () => {
  const card = {key: 2}
  const game_state = {
    character: {
      gems: {
        red: 2,
        blue: 3
      }
    }
  }
  const hand = [
    card,
    {...card, key: 3}
  ]
  const processed = addGemToCard("red", card, game_state, hand)
  expect(processed.hand).toHaveLength(2)
  expect(processed.game_state.character.gems.red).toBe(1)
  expect(processed.game_state.character.gems.blue).toBe(3)
  expect(processed.hand).toEqual([
    {...card, gem_inventory: {red: 1, blue: 0}},
    {...card, key: 3}
  ])
})

test("addGemToCard returns state as passed if character does not have gems", () => {
  const card = {
    gem_inventory: {red: 0},
    key: 2
  }
  const game_state = {
    character: {
      gems: {
        red: 0,
        blue: 0
      }
    }
  }
  const hand = [
    card,
    {...card, key: 3}
  ]
  const processed = addGemToCard("red", card, game_state, hand)
  expect(processed.hand).toHaveLength(2)
  expect(processed.game_state.character.gems.red).toBe(0)
  expect(processed.game_state.character.gems.blue).toBe(0)
  expect(processed.hand).toEqual(hand)
  expect(processed.game_state).toEqual(game_state)
})

test("returnCardGemToCharacter decrements card gem inventory by 1 and gives that value to the character's gems", () => {
  const game_state = {
    character: {
      ...default_entity,
      gems: {
        red: 1,
        blue: 1
      }
    }
  }
  const card = {
    gem_inventory: {
      red: 1
    },
    key: 2
  }
  const hand = [
    {...card},
    {...card, key: 3}
  ]
  const processed = returnCardGemToCharacter("red", card, game_state, hand)
  expect(processed.game_state.character.gems.red).toBe(2)
  expect(processed.game_state.character.gems.blue).toBe(1)
  expect(processed.hand).toHaveLength(2)
  expect(processed.hand[0].gem_inventory.red).toBe(0)
})

test("returnCardGemToCharacter returns state as passed if card does not have any gems of type", () => {
  const game_state = {
    character: {
      ...default_entity,
      gems: {
        red: 1,
        blue: 1
      }
    }
  }
  const card = {key: 2}
  const hand = [
    {...card},
    {...card, key: 3}
  ]
  const processed = returnCardGemToCharacter("blue", card, game_state, hand)
  expect(processed.game_state.character.gems.red).toBe(1)
  expect(processed.game_state.character.gems.blue).toBe(1)
  expect(processed.hand).toHaveLength(2)
  expect(processed.hand[0].gem_inventory.red).toBe(0)
  expect(processed.game_state).toEqual(game_state)
  expect(processed.hand).toEqual([
    {...card, gem_inventory: {red: 0, blue: 0}},
    {...card, key: 3}
  ])
})

test("combatantHasCondition detects whether the entity has a buff or state increase or not", () => {
  const buff_entity = {
    ...default_entity,
    buffs: {
      thorns: 2
    }
  }
  const stats_entity = {
    ...default_entity,
    flat_stat_increases: {
      attack: 2,
      speed: 1,
      defense: 0
    }
  }

  expect(combatantHasCondition("buff", buff_entity, "thorns")).toBe(true)
  expect(combatantHasCondition("buff", buff_entity, "burned")).toBe(false)
  expect(combatantHasCondition("stat", buff_entity, "speed")).toBe(false)

  expect(combatantHasCondition("buff", stats_entity, "thorns")).toBe(false)
  expect(combatantHasCondition("stat", stats_entity, "attack")).toBe(true)
  expect(combatantHasCondition("stat", stats_entity, "defense")).toBe(false)
})

const testKeys = keys => {
  for(let i = 0; i < keys.length; i++){
    expect(keys.indexOf(keys[i])).toBe(i)
  }
}

const testUniquePositions = positions => {
  for(let i = 0; i < positions.length; i++){
    expect(positions[i]).toBeGreaterThan(-1)
    expect(positions[i]).toBeLessThan(4)
    expect(positions.indexOf(positions[i])).toBe(i)
  }
}

test("mapEnemiesForCombat assigns enemies a unique key and a position 0-3", () => {
  const enemies = [groblin, groblin, groblin]
  const game_state = {
    level: {
      enemies: []
    }
  }

  const mapped = mapEnemiesForCombat(enemies, game_state)
  const new_enemies = game_state.level.enemies.concat(mapped)
  const keys = new_enemies.map((e) => e.key)
  const positions = new_enemies.map((e) => e.position)
  expect(new_enemies).toHaveLength(3)
  testKeys(keys)
  testUniquePositions(positions)

})

test("mapEnemiesForCombat assigns enemies a unique key and a position 0-3 with existing enemies", () => {
  const enemies = [groblin, groblin]
  const game_state = {
    level: {
      enemies: [
        {
          ...groblin,
          position: 0,
          key: 0,
          hp: 10
        },
        {
          ...groblin,
          position: 1,
          key: 1,
          hp: 10
        }
      ]
    }
  }

  const mapped = mapEnemiesForCombat(enemies, game_state)
  const new_enemies = game_state.level.enemies.concat(mapped)
  const keys = new_enemies.map((e) => e.key)
  const positions = new_enemies.map((e) => e.position)
  expect(new_enemies).toHaveLength(4)
  testKeys(keys)
  testUniquePositions(positions)

})

test("mapEnemies for combat assigns enemies a unique key and living enemies to positions 0-3, works with dead and alive enemies in game state", () => {
  const enemies = [groblin, groblin]
  const game_state = {
    level: {
      enemies: [
        {
          ...groblin,
          position: 0,
          key: 0,
          hp: 10
        },
        {
          ...groblin,
          position: 1,
          key: 1,
          hp: 10
        },
        {
          ...groblin,
          position: 2,
          key: 2,
          hp: 0
        },
        {
          ...groblin,
          position: 3,
          key: 3,
          hp: 0
        }
      ]
    }
  }

  const mapped = mapEnemiesForCombat(enemies, game_state)
  const new_enemies = game_state.level.enemies.concat(mapped)
  const keys = new_enemies.map((e) => e.key)
  expect(new_enemies).toHaveLength(6)
  testKeys(keys)
  const alive_positions = new_enemies.filter((e) => e.hp > 0).map((e) => e.position)
  const dead_positions = new_enemies.filter((e) => e.hp < 1).map((e) => e.position)
  expect(alive_positions).toHaveLength(4)
  expect(dead_positions).toHaveLength(2)
  testUniquePositions(alive_positions)
  testUniquePositions(dead_positions)
  expect(new_enemies.filter((e) => e.hp === 10)).toHaveLength(4)
})

test("processAction - summon effect action adds its value as new enemies to level ", () => {
  const card = {...empty_card_state}
  const summon_effect = {
    type: "effect",
    effect_name: "summon",
    value: [{...groblin}, {...groblin}]
  }
  const state = {
    character: {...default_entity, key: "player"},
    level: {
      enemies: [
        {...groblin_daddy, key: 0, position: 3}
      ]
    }
  }
  const processed = processAction(
    state, [state.level.enemies[0]], [3], summon_effect,
    [], () => true, [], () => true, card
  )
  const {game_state, card_state} = processed
  expect(card_state).toEqual(card)
  expect(game_state.character).toEqual(state.character)
  const enemies = game_state.level.enemies
  expect(enemies).toHaveLength(3)
  testKeys(enemies.map((e) => e.key))
  testUniquePositions(enemies.map((e) => e.position))
})

test("processAction - enemies can block", () => {
  const state = {
    character: {...default_entity, key: "player"},
    level: {
      enemies: [
        {...groblin, key: 0, position: 0},
        {...groblin, key: 1, position: 1},
        {...groblin, key: 2, position: 2}
      ]
    }
  }

  const processed = processAction(
    state, {...groblin, key: 0}, [0], {...defend_action},
    [], () => true, [], () => true, {...empty_card_state}
  )

  const enemies = processed.game_state.level.enemies
  expect(enemies).toHaveLength(3)
  expect(enemies.filter((e) => e.block > 0)).toHaveLength(1)
  const blocked = enemies.find((e) => e.key === 0)
  expect(blocked.block).toBe(2)
})
