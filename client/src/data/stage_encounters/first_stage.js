import grublin from "../mobs/grublin"
import spider from "../mobs/spider"

import grublin_king from "../bosses/grublin_king"

export default {
  mob_sets: [
    [grublin, grublin],
    [spider],
    [grublin, spider]
  ],
  bosses: [
    [grublin_king]
  ]
}
