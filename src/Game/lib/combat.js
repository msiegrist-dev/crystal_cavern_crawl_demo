import environment from "../../data/environment"

import {
  getRandomValueFromList, getRandomNumber100, copyState, shuffleKeyedArray,
  getIndexOfArrayItemByKey, roundToNearestInt, handleOdds, increaseByPercent
} from "./helper_lib"
import {hasItem} from "./items"
import {doesCardRequireGem, isCardUsingGems, processGemAugment, doesCardHaveRequiredGems} from "./cards"

const getConditionFieldName = type => type === "buff" ? "buffs" : "stat_increases"

const giveCombatantCondition = (type, combatant, name, value) => {
  const field_name = getConditionFieldName(type)
  let copy = copyState(combatant)
  if(!copy[field_name]){
    copy[field_name] = {}
  }
  if(!copy[field_name][name]){
    copy[field_name][name] = 0
  }
  copy[field_name][name] += value
  return copy
}

const combatantHasCondition = (type, combatant, name) => {
  const field_name = getConditionFieldName(type)
  if(!combatant[field_name]){
    return false
  }
  if(!combatant[field_name][name]){
    return false
  }
  if(combatant[field_name][name] <= 0){
    return false
  }
  return true
}

const getCombatStatIncreases = (combatant, stat_name) => {
  let value = 0
  if(combatantHasCondition("stat", combatant, stat_name)){
    value += combatant.stat_increases[stat_name]
  }
  return value
}

const processActionEffect = (effect, doer, target) => {
  const {name, value, buff_name, stat_name} = effect
  let doer_copy = copyState(doer)
  let target_copy = copyState(target)
  if(name === "give_doer_block"){
    doer_copy.block += getBlockValue(doer_copy, {value}, false)
  }
  if(name === "give_doer_buff"){
    doer_copy = giveCombatantCondition("buff", doer_copy, buff_name, value)
  }
  if(name === "give_target_buff"){
    target_copy = giveCombatantCondition("buff", target_copy, buff_name, value)
  }
  if(name === "give_doer_stat"){
    doer_copy = giveCombatantCondition("stat", doer_copy, stat_name, value)
  }
  if(name === "remove_doer_hp"){
    doer_copy.hp -= value
  }
  return {
    doer: doer_copy, target: target_copy
  }
}

const getActionEffectsWithTrigger = (action, trigger) => {
  if(!action.effects){
    return []
  }
  if(action.effects.length === 0){
    return []
  }
  return action.effects.filter((fect) => fect.trigger === trigger)
}

const actionHasAttackEffect = (card, name) => {
  if(!card.effects || !card.effects.length){
    return false
  }
  return card.effects.find((fect) => fect.name === name)
}

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

const getTurnOrder = game_state => {
  let player_speed = game_state.character.speed
  if(combatantHasCondition("buff", game_state.character, "slowed")){
    player_speed = roundToNearestInt(player_speed / 2)
  }
  const speed_keys = [
    {key: "player", speed: player_speed}
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

  if(enemy.name === "Groblin Daddy"){
    const groblins = game_state.level.enemies.filter((en) => en.name === "Groblin" && en.hp > 0)
    if(groblins.length < 2){
      return enemy.options.effect.find((fect) => fect.effect_name === "summon")
    }
  }
  const base_odds = [
    {name: "attack", value: 50}, {name: "defend", value: 50}
  ]
  const has_block_odds = [
    {name: "attack", value: 80}, {name: "defend", value: 20}
  ]
  const use_odds = enemy.block >= 5 ? has_block_odds : base_odds
  const list = handleOdds(use_odds)
  return getRandomValueFromList(enemy.options[list])
}

const getAttackValue = (doer, action, is_thorns_attack) => {
  if(is_thorns_attack){
    return action.value
  }
  const has_fervor = combatantHasCondition("buff", doer, "fervor")
  let value = has_fervor ? roundToNearestInt(increaseByPercent(action.value, 25)) : action.value
  if(action.do_not_process_attack_modifiers){
    return value
  }
  const block_as_bonus_attack = actionHasAttackEffect(action, "block_as_bonus_attack")
  if(block_as_bonus_attack){
    value += roundToNearestInt(doer.block * block_as_bonus_attack.value)
  }
  const block_as_attack = actionHasAttackEffect(action, "block_as_attack")
  if(block_as_attack){
    value = roundToNearestInt(doer.block * block_as_attack.value)
  }
  const attack_stat = has_fervor ? roundToNearestInt(increaseByPercent(doer.attack, 25)) : doer.attack
  const combat_increases = getCombatStatIncreases(doer, "attack")
  let final = value + attack_stat + combat_increases
  if(combatantHasCondition("buff", doer, "burned")){
    final = roundToNearestInt(final * .75)
  }
  return final
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

const processAttack = (doer, target, action, combat_log, setCombatLog, do_not_refire_thorns, is_thorns_attack) => {
  let doer_copy = copyState(doer)
  let target_copy = copyState(target)
  const target_has_buffs = target_copy.buffs && Object.keys(target_copy.buffs).length > 0
  let combat_log_copy = copyState(combat_log)
  let total_damage_value = 0
  let damage_dealt = 0

  let one_hit_landed = false
  for(let i = 0; i < action.hits; i++){
    if(actionMissed(action)){
      combat_log_copy = combat_log_copy.concat([`${doer.name} missed their attack on ${target.name}.`])
      continue
    }
    one_hit_landed = true
    const damage_value = getAttackValue(doer_copy, action, is_thorns_attack)
    total_damage_value += damage_value
    const armor_piercing_effect = actionHasAttackEffect(action, "armor_piercing")
    const remaining_block = getRemainingBlock(target_copy, damage_value, armor_piercing_effect)

    if(target_has_buffs && !do_not_refire_thorns){

      if(combatantHasCondition("buff", target_copy, "thorns")){
        console.log("DOING THORNS OUCH")
        const thorns_action = target.key === "character" ? environment.THORNS_ATTACK_PLAYER : environment.THORNS_ATTACK_ENEMY
        const state_processed_thorns = processAttack(target, doer, thorns_action, combat_log, setCombatLog, true, true)
        target_copy = state_processed_thorns.doer
        doer_copy = state_processed_thorns.target
        combat_log_copy = combat_log_copy.concat([`${target_copy.name} did thorns damage back to ${doer_copy.name}`])
      }

      if(combatantHasCondition("buff", target_copy, "flame_guard")){
        console.log("DOING FLAME GUARD HOT")
        doer_copy = giveCombatantCondition("buff", doer_copy, "burned", 1)
      }
    }

    const on_hit_effects = getActionEffectsWithTrigger(action, "on_hit")
    if(on_hit_effects.length){
      for(let effect of on_hit_effects){
        const processed = processActionEffect(effect, doer_copy, target_copy)
        doer_copy = processed.doer
        target_copy = processed.target
      }
    }

    if(remaining_block <= 0){
      target_copy.block = 0
      target_copy.hp -= (remaining_block * -1)
      damage_dealt = target.block + (remaining_block * -1)
      continue
    }

    damage_dealt = target_copy.block - remaining_block
    target_copy.block = remaining_block

  }

  if(one_hit_landed){
    const on_attack_effects = getActionEffectsWithTrigger(action, "on_attack")
    if(on_attack_effects.length){
      for(let effect of on_attack_effects){
        const processed = processActionEffect(effect, doer_copy, target_copy)
        doer_copy = processed.doer
        target_copy = processed.target
      }
    }
  }

  return {
    doer: doer_copy,
    target: target_copy,
    total_damage: total_damage_value,
    damage_dealt,
    hits: action.hits,
    base_damage_value: action.value,
    combat_log: combat_log_copy
  }
}

const processEffect = (doer, target, action, combat_log, setCombatLog) => {
  let combat_log_copy = copyState(combat_log)
  if(actionMissed(action)){
    return {doer, target}
  }
  let doer_copy = copyState(doer)
  let target_copy = copyState(target)
  if(action.effects){
    for(let effect of action.effects){
      const processed = processActionEffect(effect, doer_copy, target_copy)
      doer_copy = processed.doer
      target_copy = processed.target
    }
  }
  return {doer: doer_copy, target: target_copy, combat_log: combat_log_copy}
}

const getBlockValue = (doer, action, can_be_increased) => {
  let block_value = action.value
  if(!can_be_increased){
    return block_value
  }
  const item_increases = getCombatStatIncreases(doer, "defense")
  block_value += doer.defense + item_increases
  if(doer.buffs && doer.buffs["fortify"] > 0){
    return roundToNearestInt(block_value + (block_value * .33))
  }
  return block_value
}

const processAction = (game_state, doer, target_keys, action, combat_log, setCombatLog, combat_stats, setCombatStats, card_state) => {
  let game_state_copy = copyState(game_state)
  let card_state_copy = copyState(card_state)
  const player_action = doer.key === "player"
  let combat_log_copy = copyState(combat_log)

  if(action.type === "effect" && action.effect_name === "summon"){
    game_state_copy.level.enemies = game_state_copy.level.enemies.concat(mapEnemiesForCombat(action.value, game_state_copy))
    combat_log_copy = combat_log_copy.concat([`${doer.name} summoned new enemies to combat.`])
    return {
      game_state: game_state_copy,
      card_state: card_state_copy
    }
  }

  for(let target_key of target_keys){

    const combat_stats_copy = copyState(combat_stats)
    const doer_key = player_action ? "player" : doer.key
    const target_enemy_index = target_key !== "player" ? getIndexOfArrayItemByKey(game_state.level.enemies, target_key) : null
    const doer_enemy_index = doer_key !== "player" ? getIndexOfArrayItemByKey(game_state.level.enemies, doer_key) : null
    const target = target_key === "player" ? game_state_copy.character : game_state_copy.level.enemies[target_enemy_index]

    if(action.type === "defend"){
      if(player_action){
        if(action.effects){
          for(let effect of action.effects){
            const processed = processActionEffect(effect, game_state_copy.character, target)
            game_state_copy.character = processed.doer
            game_state_copy.level.enemies[target_enemy_index] = processed.target
          }
        }
        const block_value = getBlockValue(game_state_copy.character, action, true)
        game_state_copy.character.block += block_value
        combat_log_copy = combat_log_copy.concat([`${game_state.character.name} blocked for ${block_value}`])
      }
      if(!player_action){
        const block_value = getBlockValue(game_state_copy.level.enemies[doer_enemy_index], action, true)
        game_state_copy.level.enemies[doer_enemy_index].block += block_value
        combat_log_copy = combat_log_copy.concat([`${game_state_copy.level.enemies[doer_enemy_index].name} blocked for ${block_value}`])
      }
    }

    if(action.type === "attack" || action.type === "effect"){
      const processor = action.type === "attack" ? processAttack : processEffect
      const processed = processor(doer, target, action, combat_log_copy, setCombatLog, false, false)
      combat_log_copy = processed.combat_log
      game_state_copy.character = player_action ? processed.doer : processed.target

      if(action.type === "attack"){
        const combat_stats_key = processed.doer.key === "player" ? "damage_dealt" : "damage_taken"
        combat_stats_copy[combat_stats_key] += processed.damage_dealt

        combat_log_copy = combat_log_copy.concat(`${processed.doer.name} attacks ${processed.target.name} for ${processed.total_damage}.`)
      }
      if(action.type === "effect"){
        combat_log_copy = combat_log_copy.concat(`${processed.doer.name} used ${action.name}`)
      }

      if(target_enemy_index >= 0){
        game_state_copy.level.enemies[target_enemy_index] = processed.target
        if(processed.target.hp <= 0){
          combat_log_copy = combat_log_copy.concat(`${processed.doer.name} has defeated ${processed.target.name}`)
          combat_stats_copy.enemies_killed += 1
          if(hasItem(game_state_copy.character, "Lucky Grublin's Foot")){
            const processed_cards = drawCards(card_state.draw_pile, card_state.graveyard, card_state.hand, 1)
            card_state_copy.draw_pile = processed_cards.draw_pile
            card_state_copy.hand = processed_cards.hand
            card_state_copy.graveyard = processed_cards.graveyard
          }
        }
      }
      if(doer_enemy_index >= 0){
        game_state_copy.level.enemies[doer_enemy_index] = processed.doer
      }
    }
    setCombatLog(combat_log_copy)
    setCombatStats(combat_stats_copy)
  }
  return {
    game_state: game_state_copy,
    card_state: card_state_copy
  }
}


const drawCards = (draw_pile, graveyard, hand, number_to_draw) => {
  let draw = copyState(draw_pile)
  let grave = copyState(graveyard)
  let hand_copy = []

  const available_cards = draw.length + grave.length
  const to_draw = available_cards >= number_to_draw ? number_to_draw : available_cards
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



const playCard = (card, game_state, target_keys, hand, graveyard, combat_log, setCombatLog, combat_stats, setCombatStats, setMessage, draw_pile, showPlayerAttackAnimation) => {
  let card_copy = copyState(card)
  const requires_gems = doesCardRequireGem(card_copy)
  const using_gems = isCardUsingGems(card_copy)
  if(requires_gems && !using_gems){
    return {error: "Card requires a gem to play."}
  }
  if(requires_gems){
    if(!doesCardHaveRequiredGems(card_copy)){
      return {error: "Card requires a gem to play."}
    }
  }
  let augmented_copy = card_copy
  if(using_gems){
    augmented_copy = processGemAugment(card_copy)
  }
  const card_sources = sendCardsToGraveYard(hand,
    [{
      ...card_copy,
      gem_augments: augmented_copy.gem_augments,
      gem_inventory: augmented_copy.gem_inventory
    }],
    graveyard, game_state
  )
  if(card_copy.type === "attack"){
    showPlayerAttackAnimation()
  }
  const processed = processAction(
    card_sources.game_state, card_sources.game_state.character, target_keys,
    {...augmented_copy}, combat_log, setCombatLog,
    combat_stats, setCombatStats,
    {hand: card_sources.hand, graveyard: card_sources.graveyard, draw_pile: draw_pile}
  )
  return {
    game_state: processed.game_state,
    card_state: processed.card_state
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

const reduceBlockCombatStart = block => block > 4 ? roundToNearestInt(block / 2) : block

export {
  mapEnemiesForCombat,
  getTurnOrder,
  getEnemyAction,
  processAction,
  drawCards,
  playCard,
  sendCardsToGraveYard,
  addGemToCard,
  returnCardGemToCharacter,
  giveCombatantCondition,
  combatantHasCondition,
  reduceBlockCombatStart
}
