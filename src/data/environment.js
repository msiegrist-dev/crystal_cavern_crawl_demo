const environment = {
  ALL_GEMS: ["red", "blue"],
  ALL_STATS: [
    "max_hp", "attack", "defense", "speed", "armor"
  ],
  LEVEL_TYPES: ["combat", "event"],
  TRADABLE_ENTITIES: ["gem", "item", "card"],
  ALL_REWARDS: [
    "random_gem",
    "random_item",
    "random_card",
    "random_stat",
    "choice_gem",
    "choice_item",
    "choice_stat",
    "choice_card",
    "trade_gem",
    "trade_card",
    "trade_item",
    "trade_random",
    "remove_card",
  ],
  CARD_REWARDS: [
    "random_card", "choice_card"
  ],
  BASE_EVENTS: [
    "harmful_healer",
    "damage_for_card",
    "item_stash",
    "secret_tunnel",
    "trap_fall",
    "seers_sacrifice"
  ],
  ITEM_RARITIES: ["common", "uncommon", "rare"],
  THORNS_ATTACK_ENEMY: {
    type: "attack", value: 8, hits: 1, accuracy: 100, do_not_process_attack_modifiers: true, is_thorns: true
  },
  THORNS_ATTACK_PLAYER: {
    type: "attack", value: 3, hits: 1, accuracy: 100, do_not_process_attack_modifiers: true, is_thorns: true
  },
  DEFAULT_DRAW: 4,
  ALL_BUFFS: [
    "thorns",
    "slowed",
    "fortify",
    "burned",
    "fervor",
    "flame_guard"
  ]
}

export default environment
