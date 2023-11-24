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
    gems: {
      red: {number: 1, effect: false, required: true}
    },
    accuracy: 98,
    target_required: true
  },
  {
    name: "Shield Brace",
    type: "defend",
    value: 10,
    gems: {
      blue: {number: 1, effect: false, required: true}
    }
  },
  {
    name: "Sweeping Blade",
    type: "attack",
    attack_effect: "aoe",
    value: 4,
    gems: {
      red: {
        number: 1,
        effect: true,
        effect_name: "increase_base",
        value: 3,
        effect_description: `Increase base damage by 3`
      }
    },
    accuracy: 95
  }
]
