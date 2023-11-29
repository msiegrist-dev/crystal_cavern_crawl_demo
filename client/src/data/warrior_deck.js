export default [
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
    attack_effect: "aoe",
    value: 4,
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
    target_required: true,
    attack_effect: "give_block",
    value: 2,
    effect_value: 3,
    gem_augments: {
      blue: {
        number: 1,
        effect: true,
        effect_name: "increase_effect_value",
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
        effect_name: "increase_effect_value",
        value: 1,
        effect_description: `Grants an additional fortify buff`
      }
    },
    accuracy: 100
  }
]
