import environment from "../data/environment"
import basic_mob from "../data/basic_mob"


const getRandomNumber100 = () => {
  return Math.floor(Math.random() * 100) + 1
}

const getRandomNumber = limit => Math.floor(Math.random() * limit)

const copyState = state => JSON.parse(JSON.stringify(state))

const getRandomValueFromList = list => {
  const number_of_gems = list.length
  const random = getRandomNumber100()
  //50
  const rand_width = Math.ceil(100 / number_of_gems)
  for(let i = 0; i < list.length; i++){
    const getBottom = () => {
      return i === 0 ? 0 : i * rand_width
    }
    const getTop = () => {
      return i === 0 ? rand_width : (i + 1) * rand_width
    }
    if(random > getBottom() && random <= getTop()){
      return list[i]
    }
  }
}

const getRandomGemName = () => getRandomValueFromList(environment.ALL_GEMS)
const giveCharacterGems = (state, gem_name, amount) => {
  state.character.gems[gem_name] += amount
}

const getRandomStatName = () => getRandomValueFromList(environment.ALL_STATS)
const getRandomStatValue = stat_name => {
  if(stat_name === "hp"){
    return Math.floor(getRandomNumber100() / 10)
  }
  if(stat_name === "attack" || stat_name === "defense" || stat_name === "speed"){
    return Math.floor(getRandomNumber100() / 20)
  }
  if(stat_name === "armor"){
    return Number(Math.floor(getRandomNumber100() / 25) / 100)
  }
}

const giveCharacterStats = (state, stat_name, amount) => {
  state.character[stat_name] += amount
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

const shuffleKeyedArray = array => {
  let shuffled = []
  while(shuffled.length < array.length){
    const pushed_keys = shuffled.map((item) => item.key)
    const random = array[getRandomNumber(array.length)]
    if(!pushed_keys.includes(random.key)){
      shuffled.push(random)
      pushed_keys.push(random.key)
    }
  }
  return shuffled
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

const getAttackValue = (doer, action) => {
  return doer.attack + action.value
}

const getDamageBlocked = (target, damage) => {
  const flat = target.block - damage
  const armor_reduced = flat * target.armor
  const total = flat - armor_reduced
  return Math.ceil(total)
}

const processAttack = (doer, target, action) => {
  if(action.accuracy){
    if(Number(action.accuracy) < getRandomNumber100()){
      console.log("MISS")
      return target
    }
  }
  const damage_value = getAttackValue(doer, action)
  const damage_blocked = getDamageBlocked(target, damage_value)
  if(damage_blocked <= 0){
    target.block = 0
    target.hp -= (damage_blocked * -1)
    return target
  }
  target.block -= damage_blocked
  return target
}

const getBlockValue = (doer, action) => {
  return doer.defense + action.value
}

const getIndexOfArrayItemByKey = (array, key) => {
  for(let i = 0; i < array.length; i++){
    if(array[i].key === key){
      return i
    }
  }
  return null
}

const processAction = (game_state, doer, target_keys, action, consume_gems) => {

  const game_state_copy = copyState(game_state)
  const player_action = doer.key === "player"
  if(consume_gems){
    for(let gem_name of Object.keys(consume_gems)){
      game_state_copy.character.gems[gem_name] -= consume_gems[gem_name].number
    }
  }
  console.log("TARG KEYS", target_keys)
  for(let target_key of target_keys){
    console.log("TARG KEY ", target_key)
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

    if(action.type === "attack"){
      if(player_action){
        game_state_copy.level.enemies[target_enemy_index] = processAttack(doer, target, action)
      }
      if(!player_action){
        console.log('doer target action', doer, target, action)
        game_state_copy.character = processAttack(doer, target, action)
      }
    }

  }

  return game_state_copy
}

const displayArmorAsPct = entity => Number(entity.armor * 100) + "%"

const startTurnDraw = (draw_pile, graveyard, hand) => {
  let draw = copyState(draw_pile)
  let grave = copyState(graveyard)
  const hand_copy = copyState(hand)

  const available_cards = draw.length + grave.length
  const to_draw = available_cards >= 4 ? 4 : available_cards
  let drawn = 0
  while(drawn < to_draw){
    if(draw.length){
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

const sendCardsToGraveYard = (hand, cards, graveyard) => {
  let graveyard_copy = copyState(graveyard)
  let hand_copy = copyState(hand)
  for(let card of cards){
    const card_index = getIndexOfArrayItemByKey(hand_copy, card.key)
    hand_copy = hand_copy.slice(0, card_index).concat(hand_copy.slice(card_index + 1, hand_copy.length))
    graveyard_copy.push(card)
  }
  return {
    hand: hand_copy,
    graveyard: graveyard_copy
  }
}

const doesCardRequireGem = card => {
  if(!card.gems){
    return false
  }
  for(let gem_name of Object.keys(card.gems)){
    if(card.gems[gem_name].required){
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
  for(let gem_name of Object.keys(card.gems)){
    const gem_obj = card.gems[gem_name]
    if(!gem_obj.required){
      continue
    }
    if(gem_obj.number > character_gems[gem_name]){
      return false
    }
  }
  return true
}

const playCard = (card, game_state, [target_keys], hand, graveyard) => {
  const has_gems = doesCardRequireGem(card) ? doesCharacterHaveGems(game_state, card) : true
  if(!has_gems){
    return {error: "You do not have enough gems to complete this action."}
  }
  const card_sources = sendCardsToGraveYard(hand, [card], graveyard)
  return {
    game_state:
      processAction(game_state, game_state.character, [target_keys],
        {
          type: card.type,
          value: card.value,
          hits: card.hits,
          accuracy: card.accuracy
        },
        card.gems
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
  if(!hand_copy[card_index]["has_gems"]){
    hand_copy[card_index]["has_gems"] = {}
  }
  if(!hand_copy[card_index]["has_gems"][gem]){
    hand_copy[card_index]["has_gems"][gem] = 0
  }
  hand_copy[card_index]["has_gems"][gem] += 1
  game_state_copy["character"]["gems"][gem] -= 1
  setHand(hand_copy)
  setGameState(game_state_copy)
}

const returnCardGemToCharacter = (gem, card, game_state, hand, setGameState, setHand) => {
  let game_state_copy = copyState(game_state)
  let hand_copy = copyState(hand)
  const card_index = getIndexOfArrayItemByKey(hand, card.key)
  if(!hand_copy[card_index]["has_gems"]){
    hand_copy[card_index]["has_gems"] = {}
  }
  if(!hand_copy[card_index]["has_gems"][gem]){
    hand_copy[card_index]["has_gems"][gem] = 0
  }
  hand_copy[card_index]["has_gems"][gem] -= 1
  game_state_copy["character"]["gems"][gem] += 1
  setHand(hand_copy)
  setGameState(game_state_copy)
}

export {
  getRandomNumber100,
  copyState,
  getRandomGemName,
  giveCharacterGems,
  giveCharacterStats,
  getRandomStatValue,
  getRandomStatName,
  goNextLevel,
  getTurnOrder,
  getEnemyAction,
  processAction,
  displayArmorAsPct,
  shuffleKeyedArray,
  startTurnDraw,
  playCard,
  doesCardRequireGem,
  sendCardsToGraveYard,
  addGemToCard,
  returnCardGemToCharacter
}
