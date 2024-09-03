const state ={
	"level": {
		"number": 5,
		"type": "combat",
		"enemies": [
			{
				"name": "Groblin Daddy",
				"splash_text": "It is not above the K'Nesh to eat an unrly servant.",
				"combat_detail": "His groblin servants will flock to aid their king. They must all be eliminated.",
				"image_url": "groblin_daddy.png",
				"speed": 7,
				"attack": 10,
				"defense": 7,
				"max_hp": 80,
				"armor": 0.1,
				"block": 8,
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
									"combat_detail": "They're fast and they like to smash things. You make as fine a target as any.",
									"image_url": "groblin.png",
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
									"combat_detail": "They're fast and they like to smash things. You make as fine a target as any.",
									"image_url": "groblin.png",
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
			},
			{
				"name": "groblin",
				"splash_text": "Tweedley Doofus. Grubby Grublus.",
				"combat_detail": "They're fast and they like to smash things. You make as fine a target as any.",
				"image_url": "groblin.png",
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
				},
				"key": 1,
				"hp": 10
			},
			{
				"name": "groblin",
				"splash_text": "Tweedley Doofus. Grubby Grublus.",
				"combat_detail": "They're fast and they like to smash things. You make as fine a target as any.",
				"image_url": "groblin.png",
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
				},
				"key": 2,
				"hp": 10
			}
		]
	},
	"character": {
		"name": "Warrior",
		"sub_name": "Il'Manesh the Unsatiated",
		"speed": 2,
		"attack": 1,
		"defense": 4,
		"max_hp": 120,
		"hp": 77,
		"armor": 0.15,
		"starting_draw": 4,
		"card_draw": 4,
		"block": 0,
		"inventory": [
			{
				"name": "Poor Man's Shield",
				"increase_stats": [
					{
						"name": "defense",
						"value": 1,
						"type": "flat"
					}
				],
				"rarity": "common",
				"image": "stout_shield.png",
				"description": "Reeks of wine. Better than nothing."
			},
			{
				"name": "Armor of Annoyance",
				"starting_buffs": [
					{
						"name": "thorns",
						"value": 2
					}
				],
				"rarity": "uncommon",
				"image": "armor_of_annoyance.png"
			}
		],
		"gems": {
			"red": 1,
			"blue": 3
		},
		"buffs": {
			"thorns": 3
		},
		"stat_increases": {},
		"starting_deck": [
			"Attack",
			"Attack",
			"Defend",
			"Defend",
			"Sweeping Blade"
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
				"name": "Sweeping Blade",
				"type": "attack",
				"effects": [
					{
						"name": "aoe"
					}
				],
				"value": 4,
				"hits": 1,
				"gem_augments": {
					"red": {
						"number": 1,
						"effect": true,
						"effect_name": "increase_card_value",
						"value": 3,
						"effect_description": "Increase base damage by 3"
					}
				},
				"accuracy": 95,
				"key": 4
			},
			{
				"name": "Warrior's Resolve",
				"type": "attack",
				"value": 4,
				"hits": 1,
				"target_required": true,
				"effects": [
					{
						"name": "give_doer_block",
						"value": 2,
						"trigger": "on_hit"
					}
				],
				"gem_augments": {
					"blue": {
						"number": 1,
						"effect": true,
						"effect_name": "give_doer_block",
						"value": 3,
						"effect_description": "Give 3 block on attack"
					}
				},
				"accuracy": 95,
				"key": 50
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
			"defense": 1,
			"max_hp": 0,
			"hp": 0,
			"armor": 0
		}
	},
	"difficulty": 0,
	"score": 820
}

export default state
