const state = {
    "level": {
        "number": 5,
        "type": "combat",
        "enemies": [
            {
                "name": "groblin daddy",
                "splash_text": "It is not above the K'Nesh to eat an unrly servant.",
                "image_url": "groblin_daddy.png",
                "speed": 7,
                "attack": 10,
                "defense": 7,
                "max_hp": 80,
                "armor": 0.1,
                "block": 0,
                "options": {
                    "attack": [
                        {
                            "type": "attack",
                            "value": 8,
                            "hits": 1
                        }
                    ],
                    "defend": [
                        {
                            "type": "defend",
                            "value": 8
                        }
                    ],
                    "effect": [
                        {
                            "type": "effect",
                            "effect_name": "summon",
                            "value": [
                                {
                                    "name": "groblin",
                                    "splash_text": "Tweedley Doofus. Grubby Grublus.",
                                    "image_url": "groblin_idle_left.gif",
                                    "speed": 5,
                                    "attack": 5,
                                    "defense": 1,
                                    "max_hp": 10,
                                    "armor": 0.05,
                                    "block": 0,
                                    "options": {
                                        "attack": [
                                            {
                                                "type": "attack",
                                                "value": 4,
                                                "hits": 1
                                            }
                                        ],
                                        "defend": [
                                            {
                                                "type": "defend",
                                                "value": 4
                                            }
                                        ]
                                    }
                                },
                                {
                                    "name": "groblin",
                                    "splash_text": "Tweedley Doofus. Grubby Grublus.",
                                    "image_url": "groblin_idle_left.gif",
                                    "speed": 5,
                                    "attack": 5,
                                    "defense": 1,
                                    "max_hp": 10,
                                    "armor": 0.05,
                                    "block": 0,
                                    "options": {
                                        "attack": [
                                            {
                                                "type": "attack",
                                                "value": 4,
                                                "hits": 1
                                            }
                                        ],
                                        "defend": [
                                            {
                                                "type": "defend",
                                                "value": 4
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                },
                "key": 0,
                "hp": 80
            }
        ]
    },
    "character": {
        "name": "Warrior",
        "sub_name": "Il'Manesh the Unsatiated",
        "speed": 6,
        "attack": 2,
        "defense": 2,
        "max_hp": 123,
        "hp": 107,
        "armor": 0.15,
        "block": 0,
        "inventory": [
            {
                "name": "Spinach",
                "effect": "increase_stat_flat",
                "stat_name": "max_hp",
                "value": 3,
                "rarity": "common"
            },
            {
                "name": "Joggers",
                "effect": "increase_stat_flat",
                "stat_name": "speed",
                "value": 1,
                "rarity": "common"
            },
            {
                "name": "Joggers",
                "effect": "increase_stat_flat",
                "stat_name": "speed",
                "value": 1,
                "rarity": "common"
            }
        ],
        "gems": {
            "red": 0,
            "blue": 2
        },
        "buffs": {},
        "starting_deck": [
            "Attack",
            "Attack",
            "Defend",
            "Defend"
        ],
        "deck": [
            {
                "name": "Attack",
                "type": "attack",
                "value": 5,
                "hits": 1,
                "accuracy": 98,
                "target_required": true,
                "key": 0
            },
            {
                "name": "Attack",
                "type": "attack",
                "value": 5,
                "hits": 1,
                "accuracy": 98,
                "target_required": true,
                "key": 1
            },
            {
                "name": "Defend",
                "type": "defend",
                "value": 5,
                "key": 2
            },
            {
                "name": "Defend",
                "type": "defend",
                "value": 5,
                "key": 3
            },
            {
                "name": "Overhead Slice",
                "type": "attack",
                "value": 10,
                "hits": 1,
                "gem_augments": {
                    "red": {
                        "number": 1,
                        "effect": false,
                        "required": true
                    }
                },
                "accuracy": 98,
                "target_required": true,
                "key": 47
            }
        ],
        "key": "player",
        "base_stats": {
            "speed": 4,
            "attack": 2,
            "defense": 2,
            "max_hp": 120,
            "hp": 120,
            "armor": 0.15
        },
        "flat_stat_increases": {
            "speed": 2,
            "attack": 0,
            "defense": 0,
            "max_hp": 3,
            "hp": 0,
            "armor": 0
        }
    },
    "difficulty": 0
}

export default state
