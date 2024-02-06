import goblin from "../mobs/goblin"
import spider from "../mobs/spider"
import living_spike from "../mobs/living_spike"

import grublin_king from "../bosses/grublin_king"
import flaming_rodent from "../bosses/flaming_rodent"

export default {
  mob_sets: [
    [goblin, goblin],
    [spider],
    [goblin, spider],
    [living_spike, goblin],
    [living_spike, living_spike]
  ],
  bosses: [
    [grublin_king],
    [flaming_rodent]
  ]
}
