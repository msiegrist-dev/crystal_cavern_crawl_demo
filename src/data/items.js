const items = [
  {
    name: "Poor Man's Shield",
    increase_stats: [
      {name: "defense", value: 1, type: "flat"}
    ],
    rarity: "common",
    image: "stout_shield.png",
    description: "Reeks of wine. Better than nothing."
  },
  {
    name: "Rusty Dagger",
    increase_stats: [
      {name: "attack", value: 1, type: "flat"}
    ],
    rarity: "common",
    image: "rusty_dagger.png",
    description: "If the blade doesn't get you, the tetanus will."
  },
  {
    name: "Flip Flops",
    increase_stats: [
      {name: "speed", value: 1, type: "flat"}
    ],
    rarity: "common",
    image: "flips.png"
  },
  {
    name: "Apple",
    increase_stats: [
      {name: "max_hp", value: 5, type: "flat"}
    ],
    rarity: "common",
    image: "apple.png"
  },
  {
    name: "Heavy Tunic",
    increase_stats: [
      {name: "armor", value: .02, type: "flat"}
    ],
    rarity: "common",
    image: "tunic.png"
  },
  {
    name: "Lightweight Plate",
    increase_stats: [
      {name: "speed", value: 2, type: "flat"}
    ],
    decrease_stats: [
      {name: "armor", value: .05, type: "flat"}
    ],
    rarity: "common",
    image: "lightweight_plate.png"
  },
  {
    name: "Buckler",
    increase_stats: [
      {name: "defense", value: 2, type: "flat"}
    ],
    rarity: "uncommon",
    image: "buckler.png"
  },
  {
    name: "Iron Sword",
    increase_stats: [
      {name: "attack", value: 2, type: "flat"}
    ],
    rarity: "uncommon",
    image: "iron_sword.png"
  },
  {
    name: "Running Shoes",
    increase_stats: [
      {name: "speed", value: 2, type: "flat"}
    ],
    rarity: "uncommon",
    image: "shoes.png"
  },
  {
    name: "Milk",
    increase_stats: [
      {name: "max_hp", value: 10, type: "flat"}
    ],
    rarity: "uncommon",
    image: "milk.png"
  },
  {
    name: "Chainmail",
    increase_stats: [
      {name: "armor", value: .05, type: "flat"}
    ],
    rarity: "uncommon",
    image: "chainmail.png"
  },
  {
    name: "Starting Pistol",
    increase_stats: [
      {name: "starting_draw", value: 1, type: "flat"}
    ],
    rarity: "uncommon",
    image: "pistol.png"
  },
  {
    name: "Armor of Annoyance",
    starting_buffs: [
      {name: "thorns", value: 2}
    ],
    rarity: "uncommon",
    image: "armor_of_annoyance.png"
  },
  {
    name: "Blood-Colored Glasses",
    starting_buffs: [
      {name: "fervor", value: 2}
    ],
    rarity: "uncommon",
    image: "blood_colored_glasses.png"
  },
  {
    name: "Flaming Rodent Hide",
    starting_buffs: [
      {name: "flame_guard", value: 2}
    ],
    rarity: "uncommon",
    image: "hide.png"
  },
  {
    name: "Basketball",
    increase_stats: [
      {name: "max_hp", value: 8, type: "flat"},
      {name: "attack", value: 2, type: "flat"},
      {name: "defense", value: 2, type: "flat"},
      {name: "speed", value: 1, type: "flat"},
      {name: "armor", value: .05, type: "flat"},
    ],
    rarity: "rare",
    image: "basketball.png",
    description: "...and I took that personally."
  },
  {
    name: "Seer's Crystal Ball",
    increase_stats: [
      {name: "card_draw", value: 1, type: "flat"}
    ],
    rarity: "rare",
    image: "crystal_ball.png",
    description: "Rain clouds trapped within a snowglobe."
  },
  {
    name: "Lucky groblin's Foot",
    rarity: "rare",
    custom_effect: "Draw one card when defeating an enemy.",
    image: "groblin_foot.png",
    description: "It worked for Davey Crockett."
  }
]

export default items
