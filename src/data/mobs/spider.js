const spider = {
  name: "Spider",
  splash_text: "The ritzy bitzy spider.",
  combat_detail: "This creeper has a high blocking defense and her attacks will tangle you in her web.",
  image_url: "spider.png",
  speed: 2,
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
        effects: [
          {name: "give_target_buff", value: 2, buff_name: "slowed", trigger: "on_hit"}
        ]
      }
    ],
    defend: [
      {
        type: "defend",
        value: 5
      }
    ]
  }
}

export default spider
