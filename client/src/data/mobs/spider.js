export default {
  name: "Spider",
  splash_text: "The ritzy bitzy spider.",
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
        type: "basic",
        value: 5
      }
    ],
    defend: [{
      type: "basic",
      value: 8
    }]
  }
}
