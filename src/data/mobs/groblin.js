const groblin =  {
  name: "Groblin",
  splash_text: "Tweedley Doofus. Grubby Grublus.",
  combat_detail: "They're fast and they like to smash things. You make as fine a target as any.",
  image_url: "groblin.png",
  speed: 5,
  attack: 5,
  defense: 1,
  max_hp: 10,
  armor: .05,
  block: 0,
  options: {
    attack: [
      {
        type: "attack",
        value: 3,
        hits: 1
      }
    ],
    defend: [
      {
        type: "defend",
        value: 3
      }
    ]
  },
  override_odds: [
    {
      name: "attack",
      value: 90
    },
    {
      name: "defend",
      value: 10
    }
  ]
}

export default groblin
