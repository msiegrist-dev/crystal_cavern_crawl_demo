export default [
  {
    name: "Attack",
    type: "attack",
    value: 5,
    hits: 1,
    gem_required: false,
    accuracy: 98,
    target_required: true
  },
  {
    name: "Defend",
    type: "defend",
    value: 5,
    gem_required: false
  },
  {
    name: "Overhead Slice",
    type: "attack",
    value: 10,
    hits: 1,
    gem_required: true,
    gems: {
      red: {effect: false}
    },
    accuracy: 98,
    target_required: true
  },
  {
    name: "Shield Brace",
    type: "defend",
    value: 10,
    gem_required: true,
    gems: {
      blue: {effect: false}
    }
  },
  {
    name: "Sweeping Blade",
    type: "attack",
    attack_effect: "aoe",
    value: 4,
    gems: {
      red: {
        effect: true,
        effect_name: "increase_base",
        value: 3
      }
    },
    accuracy: 95
  }
]
