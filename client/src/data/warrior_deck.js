const warrior_deck = [
  {
    name: "Attack",
    type: "attack",
    value: 5,
    hits: 1,
    accuracy: 98,
    target_required: true
  },
  {
    name: "Defend",
    type: "defend",
    value: 5
  },
  {
    name: "Overhead Slice",
    type: "attack",
    value: 10,
    hits: 1,
    gem_augments: {
      red: {number: 1, effect: false, required: true}
    },
    accuracy: 98,
    target_required: true
  },
  {
    name: "Shield Brace",
    type: "defend",
    value: 10,
    gem_augments: {
      blue: {number: 1, effect: false, required: true}
    }
  },
  {
    name: "Sweeping Blade",
    type: "attack",
    attack_effects: [
      {name: "aoe"}
    ],
    value: 4,
    hits: 1,
    gem_augments: {
      red: {
        number: 1,
        effect: true,
        effect_name: "increase_card_value",
        value: 3,
        effect_description: `Increase base damage by 3`
      }
    },
    accuracy: 95
  },
  {
    name: "Warrior's Resolve",
    type: "attack",
    value: 4,
    target_required: true,
    attack_effects: [
      {
        name: "give_block",
        value: 3
      }
    ],
    gem_augments: {
      blue: {
        number: 1,
        effect: true,
        effect_name: "increase_attack_effect_value",
        attack_effect_name: "give_block",
        value: 3,
        effect_description: `Increase give block value by 3`
      }
    },
    accuracy: 95
  },
  {
    name: "Steel Yourself",
    type: "effect",
    effect_name: "buff",
    effect_value: 2,
    target_required: true,
    can_target: ["player"],
    buff_name: "fortify",
    gem_augments: {
      blue: {
        number: 1,
        effect: true,
        effect_name: "increase_card_effect_value",
        value: 2,
        effect_description: `Grants two additional fortify buffs`
      }
    },
    accuracy: 100
  },
  {
    name: "Combo Slice",
    type: "attack",
    target_required: true,
    value: 4,
    hits: 2,
    accuracy: 98
  },
  {
    name: "Piercing Thrust",
    type: "attack",
    target_required: true,
    value: 6,
    hits: 1,
    accuracy: 98,
    attack_effects: [
      {name: "armor_piercing"}
    ]
  },
  {
    name: "Forearm Smash",
    type: "attack",
    target_required: true,
    value: 5,
    hits: 1,
    accuracy: 98,
    attack_effects: [
      {
        name: "block_as_bonus_attack",
        value: .2
      }
    ]
  },
  {
    name: "Shield Crash",
    type: "attack",
    hits: 1,
    value: 0,
    target_required: true,
    attack_effects: [
      {
        name: "give_block",
        value: 3
      },
      {
        name: "block_as_attack",
        value: .75
      }
    ]
  }
]

export default warrior_deck
