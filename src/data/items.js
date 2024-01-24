const items = [
  {
    name: "Poor Man's Shield",
    increase_stats: [
      {name: "defense", value: 1, type: "flat"}
    ],
    rarity: "common"
  },
  {
    name: "Rusty Dagger",
    increase_stats: [
      {name: "attack", value: 1, type: "flat"}
    ],
    rarity: "common"
  },
  {
    name: "Rope Sandals",
    increase_stats: [
      {name: "speed", value: 1, type: "flat"}
    ],
    rarity: "common"
  },
  {
    name: "Spinach",
    increase_stats: [
      {name: "max_hp", value: 5, type: "flat"}
    ],
    rarity: "common"
  },
  {
    name: "Leather Tunic",
    increase_stats: [
      {name: "armor", value: .02, type: "flat"}
    ],
    rarity: "common"
  },
  {
    name: "Lightweight Plate",
    increase_stats: [
      {name: "speed", value: 2, type: "flat"}
    ],
    decrease_stats: [
      {name: "armor", value: .05, type: "flat"}
    ],
    rarity: "common"
  },
  {
    name: "Buckler",
    increase_stats: [
      {name: "defense", value: 2, type: "flat"}
    ],
    rarity: "uncommon"
  },
  {
    name: "Iron Sword",
    increase_stats: [
      {name: "attack", value: 2, type: "flat"}
    ],
    rarity: "uncommon"
  },
  {
    name: "Running Shoes",
    increase_stats: [
      {name: "speed", value: 2, type: "flat"}
    ],
    rarity: "uncommon"
  },
  {
    name: "Gallon of Milk",
    increase_stats: [
      {name: "max_hp", value: 10, type: "flat"}
    ],
    rarity: "uncommon"
  },
  {
    name: "Chainmail",
    increase_stats: [
      {name: "armor", value: .05, type: "flat"}
    ],
    rarity: "uncommon"
  },
  {
    name: "Starting Pistol",
    increase_stats: [
      {name: "starting_draw", value: 1, type: "flat"}
    ],
    rarity: "uncommon"
  },
  {
    name: "Armor of Annoyance",
    starting_buffs: [
      {name: "thorns", value: 2}
    ],
    rarity: "uncommon"
  },
  {
    name: "Blood-Colored Glasses",
    starting_buffs: [
      {name: "fervor", value: 2}
    ],
    rarity: "uncommon"
  },
  {
    name: "Flaming Rodent Hide",
    starting_buffs: [
      {name: "flame_guard", value: 2}
    ],
    rarity: "uncommon"
  },
  {
    name: "Jade Rose",
    increase_stats: [
      {name: "max_hp", value: 8, type: "flat"},
      {name: "attack", value: 2, type: "flat"},
      {name: "defense", value: 2, type: "flat"},
      {name: "speed", value: .05, type: "flat"},
      {name: "armor", value: .05, type: "flat"},
    ],
    rarity: "rare"
  },
  {
    name: "Seer's Crystal Ball",
    increase_stats: [
      {name: "card_draw", value: 1, type: "flat"}
    ],
    rarity: "rare"
  }
]

export default items
