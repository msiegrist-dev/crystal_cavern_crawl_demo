const state = {
    "level": {
        "number": 1,
        "type": "event",
        "event_name": "seers_sacrifice"
    },
    "character": {
        "name": "Warrior",
        "sub_name": "Il'Manesh the Unsatiated",
        "speed": 2,
        "attack": 1,
        "defense": 3,
        "max_hp": 120,
        "hp": 120,
        "armor": 0.15,
        "starting_draw": 4,
        "card_draw": 4,
        "block": 0,
        "inventory": [],
        "gems": {
            "red": 3,
            "blue": 3
        },
        "buffs": {},
        "starting_deck": [
            "Attack",
            "Attack",
            "Defend",
            "Defend"
        ],
        "idle": "warrior_idle.gif",
        "icon": "warrior_icon.png",
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
            },
            {
                "name": "Shield Crash",
                "type": "attack",
                "hits": 1,
                "value": 0,
                "target_required": true,
                "attack_effects": [
                    {
                        "name": "give_doer_block",
                        "value": 2
                    },
                    {
                        "name": "block_as_attack",
                        "value": 0.5
                    }
                ],
                "key": 8
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
            "attack": 0,
            "defense": 0,
            "max_hp": 0,
            "hp": 0,
            "armor": 0
        }
    },
    "difficulty": 0,
    "score": 0
}

export default state
