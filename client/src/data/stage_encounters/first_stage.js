import grublin from "../mobs/grublin"
import spider from "../mobs/spider"
import living_spike from "../mobs/living_spike"

import grublin_king from "../bosses/grublin_king"

export default {
  mob_sets: [
    // [grublin, grublin],
    // [spider],
    // [grublin, spider],
    // [living_spike, grublin],
    [living_spike, living_spike]
  ],
  bosses: [
    [grublin_king]
  ]
}
