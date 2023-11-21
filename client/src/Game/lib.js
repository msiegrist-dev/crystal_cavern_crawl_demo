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

const generateCombatFloor = number => {
  if(number >= 1 && number <= 10){
    return [
      {...basic_mob, key: 1},
      {...basic_mob, key: 2},
    ]
  }
}

const getRandomFloor = number => {
  const floor_type = getRandomValueFromList(environment.FLOOR_TYPES)
  if(floor_type === "combat"){
    return {
      number: number,
      type: floor_type,
      enemies: generateCombatFloor(number)
    }
  }
}

const goNextFloor = game_state => {
  const next_floor = game_state.floor.number + 1
  game_state.floor = getRandomFloor(next_floor)
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
    game_state.floor.enemies.map((enemy) => {
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

const processAction = (game_state, doer, target_key, action) => {

  const game_state_copy = copyState(game_state)
  const player_action = doer.key === "player"

  const doer_key = player_action ? "player" : doer.key
  const target_enemy_index = target_key !== "player" ? getIndexOfArrayItemByKey(game_state.floor.enemies, target_key) : null
  const doer_enemy_index = doer_key !== "player" ? getIndexOfArrayItemByKey(game_state.floor.enemies, doer_key) : null
  const target = target_key === "player" ? game_state_copy.character : game_state_copy.floor.enemies[target_enemy_index]

  if(action.type === "defend"){
    if(player_action){
      game_state_copy.character.block += getBlockValue(game_state_copy.character, action)
    }
    if(!player_action){
      game_state_copy.floor.enemies[doer_enemy_index].block += getBlockValue(game_state_copy.floor.enemies[doer_enemy_index], action)
    }
  }

  if(action.type === "attack"){
    if(player_action){
      game_state_copy.floor.enemies[target_enemy_index] = processAttack(doer, target, action)
    } else {
      game_state_copy.floor.character = processAttack(doer, target, action)
    }
  }
  return game_state_copy
}

const displayArmorAsPct = entity => Number(entity.armor * 100) + "%"

const startTurnDraw = (draw_pile, graveyard, hand) => {
  let draw = copyState(draw_pile)
  let grave = copyState(graveyard)
  const hand_copy = copyState(hand)

  let drawn = 0
  while(drawn < 4){
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

const sendCardToGraveYard = (hand, card, graveyard) => {
  let graveyard_copy = copyState(graveyard)

  const card_index = getIndexOfArrayItemByKey(hand, card.key)
  const new_hand = hand.slice(0, card_index).concat(hand.slice(card_index + 1, hand.length))
  graveyard_copy.push(card)
  return {
    hand: new_hand,
    graveyard: graveyard_copy
  }
}

const playCard = (card, game_state, target_key, hand, graveyard) => {
  console.log('gs', game_state)
  const card_sources = sendCardToGraveYard(hand, card, graveyard)
  return {
    game_state: processAction(game_state, game_state.character, target_key, {
      type: card.type,
      value: card.value,
      hits: card.hits,
      accuracy: card.accuracy
    }),
    hand: card_sources.hand,
    graveyard: card_sources.graveyard
  }
}

export {
  getRandomNumber100,
  copyState,
  getRandomGemName,
  giveCharacterGems,
  giveCharacterStats,
  getRandomStatValue,
  getRandomStatName,
  goNextFloor,
  getTurnOrder,
  getEnemyAction,
  processAction,
  displayArmorAsPct,
  shuffleKeyedArray,
  startTurnDraw,
  playCard
}
