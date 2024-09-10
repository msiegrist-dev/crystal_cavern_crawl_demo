const game_state = {
	"level": {
		"number": 4,
		"type": "combat",
		"enemies": [
			{
				"name": "Spider",
				"splash_text": "The ritzy bitzy spider.",
				"combat_detail": "This creeper has a high blocking defense and her attacks will tangle you in her web.",
				"image_url": "spider.png",
				"speed": 2,
				"attack": 2,
				"defense": 5,
				"max_hp": 15,
				"armor": 0.1,
				"block": 0,
				"options": {
					"attack": [
						{
							"type": "attack",
							"value": 7,
							"hits": 1,
							"effects": [
								{
									"name": "give_target_buff",
									"value": 2,
									"buff_name": "slowed",
									"trigger": "on_hit"
								}
							]
						}
					],
					"defend": [
						{
							"type": "defend",
							"value": 3
						}
					]
				},
				"key": 0,
				"hp": 15
			}
		]
	},
	"character": {
		"name": "Warrior",
		"sub_name": "Il'Manesh the Unsatiated",
		"speed": 2,
		"attack": 1,
		"defense": 3,
		"max_hp": 120,
		"hp": 95,
		"armor": 0.2,
		"starting_draw": 4,
		"card_draw": 4,
		"block": 0,
		"inventory": [
			{
				"name": "Chainmail",
				"increase_stats": [
					{
						"name": "armor",
						"value": 0.05,
						"type": "flat"
					}
				],
				"rarity": "uncommon",
				"image": "chainmail.png"
			}
		],
		"gems": {
			"red": 3,
			"blue": 3
		},
		"buffs": {
			"slowed": 1
		},
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
			},
			{
				"name": "Piercing Thrust",
				"type": "attack",
				"target_required": true,
				"value": 6,
				"hits": 1,
				"accuracy": 98,
				"effects": [
					{
						"name": "armor_piercing"
					}
				],
				"key": 43
			},
			{
				"name": "Rage",
				"type": "effect",
				"target_required": false,
				"effects": [
					{
						"name": "remove_doer_hp",
						"value": 4
					},
					{
						"name": "give_doer_stat",
						"value": 2,
						"stat_name": "attack"
					},
					{
						"name": "give_doer_stat",
						"value": 2,
						"stat_name": "defense"
					}
				],
				"accuracy": 100,
				"key": 26
			},
			{
				"name": "Rage",
				"type": "effect",
				"target_required": false,
				"effects": [
					{
						"name": "remove_doer_hp",
						"value": 4
					},
					{
						"name": "give_doer_stat",
						"value": 2,
						"stat_name": "attack"
					},
					{
						"name": "give_doer_stat",
						"value": 2,
						"stat_name": "defense"
					}
				],
				"accuracy": 100,
				"key": 40
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
			"armor": 1
		}
	},
	"difficulty": 0,
	"score": 498,
	"bosses_faced": []
}

export default game_state
