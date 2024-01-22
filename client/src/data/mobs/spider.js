export default {
  name: "Spider",
  splash_text: "The ritzy bitzy spider.",
  combat_detail: "This creeper has a high blocking defense and her attacks will tangle you in her web.",
  image_url: "spider.gif",
  speed: 1,
  attack: 2,
  defense: 5,
  max_hp: 15,
  armor: .1,
  block: 0,
  options: {
    attack: [
      {
        type: "attack",
        value: 7,
        hits: 1,
        target_buff_on_hit: {
          name: "slowed", value: 2
        }
      }
    ],
    defend: [
      {
        type: "defend",
        value: 8
      }
    ]
  }
}
