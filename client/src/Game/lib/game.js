import environment from "../../data/environment"
import first_stage from "../../data/stage_encounters/first_stage"
import {
  getRandomValueFromList, getRandomNumber100, getRandomNumber, copyState, shuffleKeyedArray,
  getIndexOfArrayItemByKey, roundToNearestInt, handleOdds
} from "./helper_lib"
import {doesCharacterHaveCardAugmentGems, getRandomGemName} from "./gems"
import {getRandomItems} from "./items"
import {getRandomCards, doesCardRequireGem, isCardUsingAugmentGem, processGemAugment, cardHasAttackEffect} from "./cards"

const mapEnemiesForCombat = (new_enemies, game_state) => {
  let start = 0
  if(game_state){
    const keys = game_state.level.enemies.map((en => Number(en.key))).sort()
    start = keys[keys.length - 1] + 1
  }
  return new_enemies.map((en, i) => {
    return {
      ...en,
      key: i + start,
      hp: en.max_hp
    }
  })
}

const generateCombatLevel = number => {
  //bosses can be faced every 5 levels
  if(number % 5 === 0){
      return mapEnemiesForCombat(getRandomValueFromList(first_stage.bosses))
  }
  if(number >= 1 && number <= 10){
    return mapEnemiesForCombat(getRandomValueFromList(first_stage.mob_sets))
  }
}

const getRandomLevel = number => {
  const level_type = getRandomValueFromList(environment.LEVEL_TYPES)
  if(level_type === "combat"){
    return {
      number,
      type: level_type,
      enemies: generateCombatLevel(number)
    }
  }
  if(level_type === "event"){
    return {
      number,
      type: level_type,
      event_name: getRandomValueFromList(environment.EVENTS)
    }
  }
}

const goNextLevel = game_state => {
  const game_state_copy = copyState(game_state)
  const next_level = game_state.level.number + 1
  if(next_level > 1){
    game_state_copy.score += 50
  }
  game_state_copy.level = getRandomLevel(next_level)
  return game_state_copy
}

const getTurnOrder = game_state => {
  const speed_keys = [
    {key: "player", speed: game_state.character.speed}
  ].concat(
    game_state.level.enemies.filter((ene) => ene.hp > 0)
    .map((enemy) => {
      return {key: enemy.key, speed: enemy.speed}
    })
  )
  const sorted = speed_keys.sort((a, b) => {
    if(a.speed > b.speed){
      return -1
    }
    if(a.speed < b.speed){
      return 1
    }
    return 0
  })
  let shuffled = []
  let unique_speeds = []
  for(let key of sorted){
    if(!unique_speeds.includes(key.speed)){
      unique_speeds.push(key.speed)
    }
  }
  for(let speed of unique_speeds){
    shuffled = shuffled.concat(
      shuffleKeyedArray(
        sorted.filter((key) => key.speed === speed)
      )
    )
  }
  return shuffled
}

const getEnemyAction = (game_state, enemy) => {

  if(enemy.name === "Grublin King"){
    const grublins = game_state.level.enemies.filter((en) => en.name === "Grublin" && en.hp > 0)
    if(grublins.length < 2){
      return enemy.options.effect.find((fect) => fect.effect_name === "summon")
    }
  }
  const base_odds = [
    {name: "attack", value: 50}, {name: "defend", value: 50}
  ]
  const has_block_odds = [
    {name: "attack", value: "80"}, {name: "defend", value: 20}
  ]
  const use_odds = enemy.block >= 5 ? has_block_odds : base_odds
  const list = handleOdds(use_odds)
  console.log("list", list)
  return getRandomValueFromList(enemy.options[list])
}

const getAttackValue = (doer, action) => {
  let value = action.value

  const block_as_bonus_attack = cardHasAttackEffect(action, "block_as_bonus_attack")
  if(block_as_bonus_attack){
    value += roundToNearestInt(doer.block * block_as_bonus_attack.value)
  }
  const block_as_attack = cardHasAttackEffect(action, "block_as_attack")
  if(block_as_attack){
    value = roundToNearestInt(doer.block * block_as_attack.value)
  }
  return doer.attack + value
}

const getRemainingBlock = (target, damage, pierce_armor) => {
  const armor_multiplier = pierce_armor ? 1 : 1 - target.armor
  const armor_reduced_damage = roundToNearestInt(damage * armor_multiplier)
  return target.block - armor_reduced_damage
}

const actionMissed = action => {
  if(!action.accuracy){
    return false
  }
  return Number(action.accuracy) < getRandomNumber100()
}

const processAttack = (doer, target, action) => {
  const doer_copy = copyState(doer)
  const target_copy = copyState(target)
  let total_damage_value = 0
  let damage_dealt = 0
  for(let i = 0; i < action.hits; i++){
    if(actionMissed(action)){
      console.log("YER MISSED")
      continue
    }
    const give_block_effect = cardHasAttackEffect(action, "give_block")
    if(give_block_effect){
      doer_copy.block += getBlockValue(doer_copy, {value: give_block_effect.value})
    }
    const damage_value = getAttackValue(doer_copy, action)
    total_damage_value += damage_value
    const armor_piercing_effect = cardHasAttackEffect(action, "armor_piercing")
    const remaining_block = getRemainingBlock(target_copy, damage_value, armor_piercing_effect)
    if(remaining_block <= 0){
      target_copy.block = 0
      target_copy.hp -= (remaining_block * -1)
      damage_dealt = target.block + (remaining_block * -1)
      continue
    }
    damage_dealt = target.block - remaining_block
    target_copy.block = remaining_block
  }
  return {
    doer: doer_copy,
    target: target_copy,
    total_damage: total_damage_value,
    damage_dealt
  }
}

const applyBuff = (target, buff_name, buff_value) => {
  if(!target.buffs){
    target.buffs = {}
  }
  if(!target.buffs[buff_name]){
    target.buffs[buff_name] = 0
  }
  target.buffs[buff_name] += buff_value
  return target
}

const processEffect = (doer, target, action) => {
  if(actionMissed(action)){
    return {doer, target}
  }
  const {effect_name, effect_value, buff_name} = action
  if(effect_name === "buff"){
    target = applyBuff(target, buff_name, effect_value)
    if(doer.key === target.key){
      doer = applyBuff(doer, buff_name, effect_value)
    }
    return {doer, target}
  }
}

const getBlockValue = (doer, action) => {
  const block_value = doer.defense + action.value
  if(doer.buffs && doer.buffs["fortify"] > 0){
    return roundToNearestInt(block_value + (block_value * .33))
  }
  return block_value
}

const processAction = (game_state, doer, target_keys, action, consume_gems, combat_log, setCombatLog, combat_stats, setCombatStats) => {
  const game_state_copy = copyState(game_state)
  const player_action = doer.key === "player"

  if(consume_gems){
    for(let gem_name of Object.keys(consume_gems)){
      game_state_copy.character.gems[gem_name] -= consume_gems[gem_name].number
    }
  }

  if(action.type === "effect" && action.effect_name === "summon"){
    game_state_copy.level.enemies = game_state_copy.level.enemies.concat(mapEnemiesForCombat(action.value, game_state_copy))
    setCombatLog(combat_log.concat([`${doer.name} summoned new enemies to combat.`]))
    return game_state_copy
  }

  for(let target_key of target_keys){
    const combat_stats_copy = copyState(combat_stats)
    const doer_key = player_action ? "player" : doer.key
    const target_enemy_index = target_key !== "player" ? getIndexOfArrayItemByKey(game_state.level.enemies, target_key) : null
    const doer_enemy_index = doer_key !== "player" ? getIndexOfArrayItemByKey(game_state.level.enemies, doer_key) : null
    const target = target_key === "player" ? game_state_copy.character : game_state_copy.level.enemies[target_enemy_index]

    if(action.type === "defend"){
      if(player_action){
        const block_value = getBlockValue(game_state_copy.character, action)
        game_state_copy.character.block += block_value
        setCombatLog(combat_log.concat([`Character blocked for ${block_value}`]))
      }
      if(!player_action){
        const block_value = getBlockValue(game_state_copy.level.enemies[doer_enemy_index], action)
        game_state_copy.level.enemies[doer_enemy_index].block += block_value
        setCombatLog(combat_log.concat([`${game_state_copy.level.enemies[doer_enemy_index].name} blocked for ${block_value}`]))
      }
    }

    if(action.type === "attack" || action.type === "effect"){
      const processor = action.type === "attack" ? processAttack : processEffect
      const parties = processor(doer, target, action)
      game_state_copy.character = player_action ? parties.doer : parties.target
      if(target_enemy_index >= 0){
        game_state_copy.level.enemies[target_enemy_index] = parties.target
        if(parties.target.hp <= 0){
          combat_stats_copy.enemies_killed += 1
        }
      }
      if(doer_enemy_index >= 0){
        game_state_copy.level.enemies[doer_enemy_index] = parties.doer
      }
      if(action.type === "attack"){
        const combat_stats_key = parties.doer.key === "player" ? "damage_dealt" : "damage_taken"
        combat_stats_copy[combat_stats_key] += parties.damage_dealt

        setCombatLog(combat_log.concat(`${parties.doer.name} attacks ${parties.target.name} for ${parties.total_damage}.`))
      }
      if(action.type === "effect"){
        setCombatLog(combat_log.concat(`${parties.doer_name} used ${action.name} for ${action.value}`))
      }
    }
    setCombatStats(combat_stats_copy)
  }
  return game_state_copy
}


const startTurnDraw = (draw_pile, graveyard, hand) => {
  let draw = copyState(draw_pile)
  let grave = copyState(graveyard)
  let hand_copy = []

  const available_cards = draw.length + grave.length
  const to_draw = available_cards >= 4 ? 4 : available_cards
  let drawn = 0
  while(drawn < to_draw){
    if(draw.length > 0){
      hand_copy.push(draw.shift())
      drawn += 1
    } else {
      draw = shuffleKeyedArray(grave)
      grave = []
    }
  }
  return {
    hand: hand_copy,
    draw_pile: draw,
    graveyard: grave
  }
}

const sendCardsToGraveYard = (hand, cards, graveyard, game_state) => {
  let graveyard_copy = copyState(graveyard)
  let hand_copy = copyState(hand)
  let game_state_copy = copyState(game_state)
  for(let card of cards){
    if(card.gem_inventory){
      for(let gem_name of Object.keys(card.gem_inventory)){
        if(card.gem_inventory[gem_name] && card.gem_inventory[gem_name] > 0){
          game_state_copy.character.gems[gem_name] += card.gem_inventory[gem_name]
          card.gem_inventory[gem_name] = 0
        }
      }
    }
    const card_index = getIndexOfArrayItemByKey(hand_copy, card.key)
    hand_copy = hand_copy.slice(0, card_index).concat(hand_copy.slice(card_index + 1, hand_copy.length))
    graveyard_copy.push(card)
  }
  return {
    hand: hand_copy,
    graveyard: graveyard_copy,
    game_state: game_state_copy
  }
}



const playCard = (card, game_state, target_keys, hand, graveyard, combat_log, setCombatLog, combat_stats, setCombatStats) => {
  let card_copy = copyState(card)
  const has_required_gems = doesCardRequireGem(card_copy) ? doesCharacterHaveCardAugmentGems(game_state, card_copy) : true
  if(!has_required_gems){
    return {error: "You do not have enough gems to complete this action."}
  }
  if(isCardUsingAugmentGem(card_copy)){
    card_copy = processGemAugment(card_copy)
  }
  const card_sources = sendCardsToGraveYard(hand, [card], graveyard, game_state)
  return {
    game_state: processAction(
      card_sources.game_state, game_state.character, target_keys,
      {...card_copy}, card_copy.gem_inventory, combat_log, setCombatLog,
      combat_stats, setCombatStats
    ),
    hand: card_sources.hand,
    graveyard: card_sources.graveyard
  }
}

const addGemToCard = (gem, card, game_state, hand, setGameState, setHand) => {
  if(!game_state.character.gems[gem] || game_state.character.gems[gem] < 1){
    return
  }
  let game_state_copy = copyState(game_state)
  let hand_copy = copyState(hand)
  const card_index = getIndexOfArrayItemByKey(hand, card.key)
  if(!hand_copy[card_index]["gem_inventory"]){
    hand_copy[card_index]["gem_inventory"] = {}
  }
  if(!hand_copy[card_index]["gem_inventory"][gem]){
    hand_copy[card_index]["gem_inventory"][gem] = 0
  }
  hand_copy[card_index]["gem_inventory"][gem] += 1
  game_state_copy["character"]["gems"][gem] -= 1
  setHand(hand_copy)
  setGameState(game_state_copy)
}

const returnCardGemToCharacter = (gem, card, game_state, hand, setGameState, setHand) => {
  let game_state_copy = copyState(game_state)
  let hand_copy = copyState(hand)
  const card_index = getIndexOfArrayItemByKey(hand, card.key)
  if(!hand_copy[card_index]["gem_inventory"]){
    hand_copy[card_index]["gem_inventory"] = {}
  }
  if(!hand_copy[card_index]["gem_inventory"][gem]){
    hand_copy[card_index]["gem_inventory"][gem] = 0
  }
  hand_copy[card_index]["gem_inventory"][gem] -= 1
  game_state_copy["character"]["gems"][gem] += 1
  setHand(hand_copy)
  setGameState(game_state_copy)
}


const getRandomCharacterEntity = (character, entity_name) => {
  if(entity_name === "card"){
    return getRandomValueFromList(character.deck)
  }
  if(entity_name === "item"){
    return getRandomValueFromList(character.items)
  }
  if(entity_name === "gem"){
    const gem_name = getRandomGemName()
    return {name: gem_name, value: getRandomNumber(3) || 1}
  }
}

const getTradeSelections = (quantity, trade_for, trade_in, character) => {
  const selections = []
  for(let i = 0; i < quantity; i++){
    const trade_for_entity_name = trade_for === "random" ?
      getRandomValueFromList(environment.TRADABLE_ENTITIES) : trade_for

    let trade_for_entity
    const trade_in_entity = getRandomCharacterEntity(character, trade_in)
    if(trade_for_entity_name === "card"){
      trade_for_entity = getRandomCards(1, "warrior")[0]
    }
    if(trade_for_entity_name === "gem"){
      let gem_name = getRandomGemName()
      if(trade_in === "gem"){
        while(gem_name === trade_in_entity.name){
          gem_name = getRandomGemName()
        }
      }
      trade_for_entity = {name: gem_name, value: getRandomNumber(3) || 1}
    }
    if(trade_for_entity_name === "item"){
      trade_for_entity = getRandomItems(1)[0]
    }
    selections.push({
      type: "trade",
      trade_for: trade_for_entity_name,
      trade_for_entity,
      trade_in,
      trade_in_entity
    })
  }
  return selections
}

const determineVictoryReward = game_state => {
  const value = getRandomNumber100()
  if(value <= 60){
    return getRandomValueFromList(environment.CARD_REWARDS)
  }
  return getRandomValueFromList(environment.ALL_REWARDS)
}

export {
  goNextLevel,
  getTurnOrder,
  getEnemyAction,
  processAction,
  startTurnDraw,
  playCard,
  sendCardsToGraveYard,
  addGemToCard,
  returnCardGemToCharacter,
  getTradeSelections,
  determineVictoryReward
}
