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
  inventory: [],
  gems: {
    red: 3,
    blue: 3
  },
  buffs: {},
  flat_stat_increases: {},
  starting_deck: [
    "Attack",
    "Attack",
    "Defend",
    "Defend"
  ],
  idle: "warrior.png",
  icon: "warrior_head.png"
}

export default warrior
