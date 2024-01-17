const warrior = {
  name: "Warrior",
  sub_name: "Il'Manesh the Unsatiated",
  speed: 2,
  attack: 1,
  defense: 3,
  max_hp: 120,
  hp: 120,
  armor: .15,
  starting_draw: 4,
  card_draw: 4,
  block: 0,
  inventory: [{
    name: "Armor of Annoyance",
    starting_buffs: [
      {name: "thorns", value: 3}
    ],
    rarity: "uncommon"
  }],
  gems: {
    red: 3,
    blue: 3
  },
  buffs: {},
  starting_deck: [
    "Attack",
    "Attack",
    "Defend",
    "Defend"
  ],
  idle: "warrior_idle.gif",
  icon: "warrior_icon.png"
}

export default warrior
