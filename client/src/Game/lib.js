import environment from "../data/environment"
import basic_mob from "../data/basic_mob"
import warrior_deck from "../data/warrior_deck"
import items from "../data/items"
import {getRandomValueFromList, getRandomNumber100, getRandomNumber, copyState, shuffleKeyedArray, getIndexOfArrayItemByKey, roundToNearestInt} from "./helper_lib"

const getRandomGemName = () => getRandomValueFromList(environment.ALL_GEMS)
const giveCharacterGems = (state, gem_name, amount) => {
  const state_copy = copyState(state)
  state_copy.character.gems[gem_name] += amount
  return state_copy
}

const giveCharacterStats = (character, stat_name, amount) => {
  const state_copy = copyState(character)
  state_copy[stat_name] += amount
  if(stat_name === "max_hp"){
    state_copy.hp += amount
  }
  if(!state_copy["flat_stat_increases"][stat_name]){
    state_copy["flat_stat_increases"][stat_name] = 0
  }
  state_copy["flat_stat_increases"][stat_name] += amount
  return state_copy
}

const getRandomStatName = () => getRandomValueFromList(environment.ALL_STATS)
const getRandomStatValue = stat_name => {
  if(stat_name === "max_hp"){
    return Math.ceil(getRandomNumber100() / 10)
  }
  if(stat_name === "attack" || stat_name === "defense" || stat_name === "speed"){
    return Math.ceil(getRandomNumber100() / 20)
  }
  if(stat_name === "armor"){
    return Number(Math.ceil(getRandomNumber100() / 25) / 100)
  }
}

const getRandomItems = quantity => {
  const random_items = []
  for(let i = 0; i < quantity; i++){
    random_items.push(getRandomValueFromList(items))
  }
  return random_items
}

const processItemEffect = (character, item) => {
  const character_copy = copyState(character)
  const {effect, stat_name, value} = item
  let updated_character
  if(effect === "increase_stat_flat"){
    updated_character = giveCharacterStats(character_copy, stat_name, value)
  }
  return updated_character
}

const giveCharacterItem = (game_state, item) => {
  const state_copy = copyState(game_state)
  state_copy.character = processItemEffect(game_state.character, item)
  state_copy.character.inventory.push(item)
  return state_copy
}

const generateCombatLevel = number => {
  if(number >= 1 && number <= 10){
    return [
      {...basic_mob, key: 1},
      {...basic_mob, key: 2},
    ]
  }
}

const getRandomLevel = number => {
  const level_type = getRandomValueFromList(environment.LEVEL_TYPES)
  if(level_type === "combat"){
    return {
      number: number,
      type: level_type,
      enemies: generateCombatLevel(number)
    }
  }
}

const goNextLevel = game_state => {
  const next_level = game_state.level.number + 1
  game_state.level = getRandomLevel(next_level)
  return game_state
}

const getTurnOrder = game_state => {
  const speed_keys = [
    {key: "player", speed: game_state.character.speed}
  ].concat(
    game_state.level.enemies.map((enemy) => {
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

const getEnemyAction = enemy => {
  const rand = getRandomNumber(2)
  const {options} = enemy
  const type = rand === 0 ? "attack" : "defend"
  const list = rand === 0 ? options.attack : options.defend
  const move = getRandomValueFromList(list)
  return {
    type,
    sub_type: move.type,
    value: move.value
  }
}

const getAttackValue = (doer, action) => doer.attack + action.value

const getRemainingBlock = (target, damage) => {
  const armor_multiplier = 1 - target.armor
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
  if(actionMissed(action)){
    return {doer, target}
  }
  if(action.attack_effect){
    if(action.attack_effect === "give_block"){
      doer.block += getBlockValue(doer, {value: action.effect_value})
    }
  }
  const damage_value = getAttackValue(doer, action)
  const remaining_block = getRemainingBlock(target, damage_value)
  if(remaining_block <= 0){
    target.block = 0
    target.hp -= (remaining_block * -1)
    return {doer, target}
  }
  target.block -= remaining_block
  return {doer, target}
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

const processAction = (game_state, doer, target_keys, action, consume_gems) => {
  const game_state_copy = copyState(game_state)
  const player_action = doer.key === "player"

  if(consume_gems){
    for(let gem_name of Object.keys(consume_gems)){
      game_state_copy.character.gems[gem_name] -= consume_gems[gem_name].number
    }
  }

  for(let target_key of target_keys){
    const doer_key = player_action ? "player" : doer.key
    const target_enemy_index = target_key !== "player" ? getIndexOfArrayItemByKey(game_state.level.enemies, target_key) : null
    const doer_enemy_index = doer_key !== "player" ? getIndexOfArrayItemByKey(game_state.level.enemies, doer_key) : null
    const target = target_key === "player" ? game_state_copy.character : game_state_copy.level.enemies[target_enemy_index]

    if(action.type === "defend"){
      if(player_action){
        game_state_copy.character.block += getBlockValue(game_state_copy.character, action)
      }
      if(!player_action){
        game_state_copy.level.enemies[doer_enemy_index].block += getBlockValue(game_state_copy.level.enemies[doer_enemy_index], action)
      }
    }

    if(action.type === "attack" || action.type === "effect"){
      const processor = action.type === "attack" ? processAttack : processEffect
      const parties = processor(doer, target, action)
      game_state_copy.character = player_action ? parties.doer : parties.target
      if(target_enemy_index){
        game_state_copy.level.enemies[target_enemy_index] = parties.target
      }
      if(doer_enemy_index){
        game_state_copy.level.enemies[doer_enemy_index] = parties.doer
      }
    }
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

const doesCardRequireGem = card => {
  if(!card.gem_augments){
    return false
  }
  for(let gem_name of Object.keys(card.gem_augments)){
    if(card.gem_augments[gem_name].required){
      return true
    }
  }
  return false
}

const doesCharacterHaveGems = (game_state, card) => {
  const character_gems = game_state.character.gems
  if(!character_gems){
    return false
  }
  for(let gem_name of Object.keys(card.gem_augments)){
    const gem_obj = card.gem_augments[gem_name]
    if(!gem_obj.required){
      continue
    }
    if(gem_obj.number > character_gems[gem_name]){
      return false
    }
  }
  return true
}

const isCardUsingAugmentGem = card => {
  if(!card.gem_augments || !card.gem_inventory){
    return false
  }
  for(let gem_name of Object.keys(card.gem_augments)){
    const gem = card.gem_augments[gem_name]
    if(!gem.required && card.gem_inventory[gem_name] === gem.number){
      return true
    }
  }
  return false
}

const processGemAugment = card => {
  let card_copy = copyState(card)

  for(let gem_name of Object.keys(card.gem_augments)){
    const augment = card.gem_augments[gem_name]
    if(!augment.number === card_copy.gem_inventory[gem_name]){
      continue
    }
    if(!augment.effect){
      continue
    }
    if(augment.effect_name === "increase_card_value"){
      card_copy.value += augment.value
    }
    if(augment.effect_name === "increase_effect_value"){
      card_copy.effect_value += augment.value
    }
    card_copy.gem_inventory[gem_name] = 0
  }

  return card_copy
}

const playCard = (card, game_state, target_keys, hand, graveyard) => {
  let card_copy = copyState(card)
  const has_required_gems = doesCardRequireGem(card_copy) ? doesCharacterHaveGems(game_state, card_copy) : true
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
      {...card_copy}, card_copy.gem_inventory
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

const getRandomCards = (number, character_name) => {
  let source
  if(character_name === "warrior"){
    source = warrior_deck
  }
  let cards = []
  for(let i = 0; i < number; i++){
    cards.push(getRandomValueFromList(source))
  }
  return cards
}

const assignRandomKey = (entity, inventory) => {
  let entity_copy = copyState(entity)
  const keys = inventory.map((ent) => ent.key)
  let random_value = getRandomNumber100()
  while(keys.includes(random_value)){
    random_value = getRandomNumber100()
  }
  entity_copy.key = random_value
  return entity_copy
}

const addCardToDeck = (game_state, card) => {
  const game_state_copy = copyState(game_state)
  game_state_copy.character.deck.push(assignRandomKey(card, game_state_copy.character.deck))
  return game_state_copy
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
      trade_for_entity = {name: getRandomGemName(), value: getRandomNumber(3) || 1}
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

export {
  getRandomGemName,
  giveCharacterGems,
  giveCharacterStats,
  getRandomStatValue,
  getRandomStatName,
  goNextLevel,
  getTurnOrder,
  getEnemyAction,
  processAction,
  startTurnDraw,
  playCard,
  doesCardRequireGem,
  sendCardsToGraveYard,
  addGemToCard,
  returnCardGemToCharacter,
  addCardToDeck,
  getRandomCards,
  getRandomItems,
  giveCharacterItem,
  getTradeSelections
}
