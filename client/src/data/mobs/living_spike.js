export default {
  name: "Living Spike",
  splash_text: "What's lacking in brains is made up for in knives.",
  image_url: "living_spike.png",
  speed: 3,
  attack: 2,
  defense: 3,
  max_hp: 15,
  armor: .15,
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
        value: 6
      }
    ]
  },
  buffs: {
    thorns: 10
  }
}
