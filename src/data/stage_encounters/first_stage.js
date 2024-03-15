import groblin from "../mobs/groblin"
import spider from "../mobs/spider"
import living_spike from "../mobs/living_spike"

import groblin_daddy from "../bosses/groblin_daddy"
import flaming_rodent from "../bosses/flaming_rodent"

export default {
  mob_sets: [
    [groblin, living_spike, spider],
    // [spider],
    // [groblin, spider],
    // [living_spike, groblin],
    // [living_spike, living_spike]
  ],
  bosses: [
    [groblin_daddy],
    [flaming_rodent]
  ]
}
