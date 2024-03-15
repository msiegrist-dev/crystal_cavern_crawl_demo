import groblin from "../mobs/groblin"

export default {
  name: "Groblin Daddy",
  splash_text: "It is not above the K'Nesh to eat an unrly servant.",
  combat_detail: "His groblin servants will flock to aid their king. They must all be eliminated.",
  image_url: "groblin_daddy.png",
  speed: 7,
  attack: 10,
  defense: 7,
  max_hp: 80,
  armor: .10,
  block: 0,
  options: {
    attack: [
      {
        type: "attack",
        value: 8,
        hits: 1
      }
    ],
    defend: [{
      type: "defend",
      value: 8
    }],
    effect: [
      {
        type: "effect",
        effect_name: "summon",
        value: [groblin, groblin]
      }
    ]
  }
}
