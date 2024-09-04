const game_state = {
    "level": {
        "number": 10,
        "type": "combat",
        "enemies": [
            {
                "name": "Groblin",
                "splash_text": "Tweedley Doofus. Grubby Grublus.",
                "combat_detail": "They're fast and they like to smash things. You make as fine a target as any.",
                "image_url": "groblin.png",
                "speed": 5,
                "attack": 5,
                "defense": 1,
                "max_hp": 12,
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
                },
                "key": 0,
                "hp": 12
            }
        ]
    },
    "character": {
        "name": "Warrior",
        "sub_name": "Il'Manesh the Unsatiated",
        "speed": 2,
        "attack": 2,
        "defense": 3,
        "max_hp": 125,
        "hp": 84,
        "armor": 0.15,
        "starting_draw": 4,
        "card_draw": 4,
        "block": 0,
        "inventory": [
            {
                "name": "Apple",
                "increase_stats": [
                    {
                        "name": "max_hp",
                        "value": 5,
                        "type": "flat"
                    }
                ],
                "rarity": "common",
                "image": "apple.png"
            },
            {
                "name": "Rusty Dagger",
                "increase_stats": [
                    {
                        "name": "attack",
                        "value": 1,
                        "type": "flat"
                    }
                ],
                "rarity": "common",
                "image": "rusty_dagger.png",
                "description": "If the blade doesn't get you, the tetanus will."
            }
        ],
        "gems": {
            "red": 3,
            "blue": 3
        },
        "buffs": {},
        "stat_increases": {},
        "starting_deck": [
            "Attack",
            "Attack",
            "Defend",
            "Defend"
        ],
        "idle": "warrior.png",
        "icon": "warrior_head.png",
        "deck": [
            {
                "name": "Attack",
                "type": "attack",
                "value": 3,
                "hits": 1,
                "accuracy": 98,
                "target_required": true,
                "key": 0
            },
            {
                "name": "Attack",
                "type": "attack",
                "value": 3,
                "hits": 1,
                "accuracy": 98,
                "target_required": true,
                "key": 1
            },
            {
                "name": "Defend",
                "type": "defend",
                "value": 2,
                "key": 2
            },
            {
                "name": "Defend",
                "type": "defend",
                "value": 2,
                "key": 3
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
            "speed": 0,
            "attack": 1,
            "defense": 0,
            "max_hp": 5,
            "hp": 0,
            "armor": 0
        }
    },
    "difficulty": 0,
    "score": 183,
    "bosses_faced": []
}

export default game_state
