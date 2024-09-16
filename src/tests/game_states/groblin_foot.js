const state = {
	"level": {
		"number": 1,
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
				"override_odds": [
					{
						"name": "attack",
						"value": 90
					},
					{
						"name": "defend",
						"value": 10
					}
				],
				"position": 0,
				"key": 0,
				"hp": 12
			},
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
				"position": 1,
				"key": 1,
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
		"hp": 112,
		"armor": 0.15,
		"starting_draw": 0,
		"card_draw": 0,
		"block": 0,
		"inventory": [
			{
				"name": "Lucky Groblin's Foot",
				"rarity": "rare",
				"custom_effect": "Draw one card when defeating an enemy.",
				"image": "groblin_foot.png",
				"description": "It worked for Davey Crockett."
			}
		],
		"gems": {
			"red": 3,
			"blue": 3
		},
		"buffs": {},
		"flat_stat_increases": {},
		"starting_deck": [
			"Attack",
			"Attack",
			"Defend",
			"Defend",
			"Steel Yourself",
			"Sturdy Style",
			"Attack",
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
				"name": "Steel Yourself",
				"type": "effect",
				"target_required": false,
				"effects": [
					{
						"name": "give_doer_buff",
						"buff_name": "fortify",
						"value": 1
					}
				],
				"gem_augments": {
					"blue": {
						"number": 1,
						"effect": true,
						"effect_name": "give_doer_buff",
						"buff_name": "fortify",
						"value": 2,
						"effect_description": "Give two additional fortify buffs"
					}
				},
				"accuracy": 100,
				"key": 4
			},
			{
				"name": "Sturdy Style",
				"type": "defend",
				"target_required": false,
				"value": 10,
				"gem_augments": {
					"blue": {
						"number": 1,
						"effect": false,
						"required": true
					},
					"red": {
						"number": 1,
						"effect": true,
						"effect_name": "give_doer_stat",
						"value": 4,
						"stat_name": "attack",
						"effect_description": "Grant 4 attack stat for the turn"
					}
				},
				"key": 5
			},
			{
				"name": "Attack",
				"type": "attack",
				"value": 3,
				"hits": 1,
				"accuracy": 98,
				"target_required": true,
				"key": 6
			},
			{
				"name": "Defend",
				"type": "defend",
				"value": 2,
				"key": 7
			},
			{
				"name": "Sturdy Style",
				"type": "defend",
				"target_required": false,
				"value": 10,
				"gem_augments": {
					"blue": {
						"number": 1,
						"effect": false,
						"required": true
					},
					"red": {
						"number": 1,
						"effect": true,
						"effect_name": "give_doer_stat",
						"value": 4,
						"stat_name": "attack",
						"effect_description": "Grant 4 attack stat for the turn"
					}
				},
				"key": 84
			}
		],
		"key": "player",
		"base_stats": {
			"speed": 2,
			"attack": 1,
			"max_hp": 120,
			"hp": 120,
			"armor": 0.15
		}
	},
	"difficulty": 0,
	"score": 0,
	"bosses_faced": []
}

export default state
