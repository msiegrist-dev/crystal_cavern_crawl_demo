export default {
  name: "Grublin",
  splash_text: "Tweedley Doofus. Grubby Grublus.",
  combat_detail: "They're fast and they like to smash things. You make as fine a target as any.",
  image_url: "goblin_idle_left.gif",
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
        value: 4,
        hits: 1
      }
    ],
    defend: [
      {
        type: "defend",
        value: 4
      }
    ]
  }
}
