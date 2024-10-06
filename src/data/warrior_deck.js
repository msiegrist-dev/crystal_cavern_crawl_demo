const warrior_deck = [
  {
    name: "Attack",
    type: "attack",
    value: 3,
    hits: 1,
    accuracy: 98,
    target_required: true
  },
  {
    name: "Defend",
    type: "defend",
    value: 2
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
    effects: [
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
    hits: 1,
    target_required: true,
    effects: [
      {
        name: "give_doer_block",
        value: 2,
        trigger: "on_hit"
      }
    ],
    gem_augments: {
      blue: {
        number: 1,
        effect: true,
        effect_name: "give_doer_block",
        value: 3,
        effect_description: `Give 3 block on attack`
      }
    },
    accuracy: 95
  },
  {
    name: "Steel Yourself",
    type: "effect",
    target_required: false,
    effects: [
      {name: "give_doer_buff", buff_name: "fortify", value: 1}
    ],
    gem_augments: {
      blue: {
        number: 1,
        effect: true,
        effect_name: "give_doer_buff",
        buff_name: "fortify",
        value: 2,
        effect_description: `Give two additional fortify buffs`
      }
    },
    accuracy: 100
  },
  {
    name: "Combo Slice",
    type: "attack",
    target_required: true,
    value: 3,
    hits: 2,
    accuracy: 98
  },
  {
    name: "Piercing Thrust",
    type: "attack",
    target_required: true,
    value: 5,
    hits: 1,
    accuracy: 98,
    effects: [
      {name: "armor_piercing"}
    ]
  },
  {
    name: "Forearm Smash",
    type: "attack",
    target_required: true,
    value: 3,
    hits: 1,
    accuracy: 98,
    effects: [
      {
        name: "block_as_bonus_attack",
        value: .2
      }
    ]
  },
  {
    name: "Shield Crash",
    type: "attack",
    accuracy: 90,
    hits: 1,
    value: 0,
    target_required: true,
    effects: [
      {
        name: "give_doer_block",
        value: 1,
        trigger: "on_hit"
      },
      {
        name: "block_as_attack",
        value: .5
      }
    ]
  },
  {
    name: "Immovable Force",
    type: "attack",
    accuracy: 95,
    hits: 1,
    value: 5,
    effects: [
      {name: "aoe"},
      {name: "give_doer_block", value: 10, trigger: "on_attack"},
    ],
    gem_augments: {
      blue: {
        number: 1,
        required: true
      },
      red: {
        number: 1,
        required: true
      }
    }
  },
  {
    name: "Pile Driver",
    type: "attack",
    accuracy: 90,
    hits: 1,
    value: 12,
    effects: [
      {name: "give_doer_buff", value: 2, buff_name: "slowed", trigger: "on_hit"}
    ],
    gem_augments: {
      red: {
        number: 1,
        required: true,
        effect: false
      }
    },
    target_required: true
  },
  {
    name: "Parry",
    type: "defend",
    target_required: false,
    value: 2,
    effects: [
      {name: "give_doer_buff", buff_name: "thorns", value: 1}
    ],
    gem_augments: {
      blue: {number: 1, effect: false, required: true}
    }
  },
  {
    name: "Rage",
    type: "effect",
    target_required: false,
    effects: [
      {name: "remove_doer_hp", value: 4},
      {name: "give_doer_stat", value: 2, stat_name: "attack"},
      {name: "give_doer_stat", value: 2, stat_name: "defense"}
    ],
    accuracy: 100
  },
  {
    name: "Sturdy Style",
    type: "defend",
    target_required: false,
    value: 10,
    gem_augments: {
      blue: {number: 1, effect: false, required: true},
      red: {
        number: 1,
        effect: true,
        effect_name: "give_doer_stat",
        value: 4,
        stat_name: "attack",
        effect_description: "Grant 4 attack stat for the turn"
      }
    }
  },
  {
    name: "Last Resort",
    type: "defend",
    target_required: false,
    value: 5,
    effects: [
      {name: "give_doer_buff", value: 2, buff_name: "slowed"}
    ]
  }
]

export default warrior_deck
