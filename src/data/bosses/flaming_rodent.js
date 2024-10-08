const flaming_rodent = {
  name: "Flaming Rodent",
  splash_text: "The experiment of a twisted wizard.",
  image_url: "rat_animate.gif",
  speed: 10,
  attack: 10,
  defense: 5,
  max_hp: 55,
  armor: .05,
  block: 0,
  options: {
    attack: [
      {
        type: "attack",
        value: 6,
        hits: 1
      },
      {
        type: "attack",
        value: 1,
        hits: 2
      }
    ],
    defend: [{
      type: "defend",
      value: 10
    }]
  },
  buffs: {
    flame_guard: 12
  }
}

export default flaming_rodent
