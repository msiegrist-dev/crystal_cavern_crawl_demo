const living_spike =  {
  name: "Living Spike",
  splash_text: "What's lacking in brains is made up for in knives.",
  combat_detail: "Spike's pointy exterior deals damage back to attackers.",
  image_url: "living_spike.png",
  speed: 3,
  attack: 2,
  defense: 3,
  max_hp: 12,
  armor: .10,
  block: 0,
  options: {
    attack: [
      {
        type: "attack",
        value: 2,
        hits: 2
      }
    ],
    defend: [
      {
        type: "defend",
        value: 3
      }
    ]
  },
  buffs: {
    thorns: 6
  }
}

export default living_spike
