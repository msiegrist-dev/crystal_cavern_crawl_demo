//returns a random number 1 - 100
const getRandomNumber100 = () => Math.floor(Math.random() * 100) + 1

const getRandomNumber = limit => Math.floor(Math.random() * limit)

const copyState = state => JSON.parse(JSON.stringify(state))

const getRandomValueFromList = list => list[getRandomNumber(list.length)]

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

const roundToNearestInt = number => {
  if(Number.isInteger(Number(number))){
    return number
  }
  const round_number = Number(number.toFixed(2))
  let hundredths = Number(round_number.toString().split(".")[1])
  if(hundredths.toString().length === 1){
    hundredths = Number(hundredths.toString() + "0")
  }
  if(hundredths >= 50){
    return Math.ceil(number)
  }
  return Math.floor(number)
}

const increaseByPercent = (number, percent) => number + (number * (percent / 100))

const getIndexOfArrayItemByKey = (array, key) => {
  for(let i = 0; i < array.length; i++){
    if(array[i].key === key){
      return i
    }
  }
  return -1
}

const getIndexOfArrayItemByName = (array, name) => {
  for(let i = 0; i < array.length; i++){
    if(array[i].name === name){
      return i
    }
  }
  return -1
}

const capitalizeFirst = str => str[0].toUpperCase() + str.substr(1, str.length)
const formatKeyword = str => {
  let res = ``
  for(let word of str.split("_")){
    res += `${capitalizeFirst(word)} `
  }
  return res
}

const displayArmorAsPct = entity => Number(entity.armor * 100) + "%"

const removeItemFromArrayByKey = (array, key) => {
  let index
  for(let i = 0; i < array.length; i++){
    if(array[i].key === key){
      index = i
    }
  }
  if(index === undefined){
    return array
  }
  return array.slice(0, index).concat(array.slice(index + 1, array.length))
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

const handleOdds = outcomes => {
  const random = getRandomNumber100()
  let current = 0
  for(let i = 0; i < outcomes.length; i++){
    const {name, value} = outcomes[i]

    if(i === 0){
      if(random <= value){
        return name
      }
    }

    if(i === (outcomes.length - 1)){
      if(random > current){
        return name
      }
    }

    if(random > current && random <= current + value){
      return name
    }
    current += value
  }
  return null
}

const getRarityTextColor = rarity => {
  let rarity_text_color = "white"
  if(rarity === "uncommon") rarity_text_color = "#96BD59"
  if(rarity === "rare") rarity_text_color = "#C42430"
  return rarity_text_color
}

const formatStatName = stat_name => {
  if(stat_name === "max_hp") return "Max HP"
  if(stat_name === "card_draw") return "Card Draw"
  if(stat_name === "starting_draw") return "Starting Card Draw"
  return capitalizeFirst(stat_name)
}

const formatBuffName = name => {
  if(name === "flame_guard") return "Flame Guard"
  return capitalizeFirst(name)
}

export {
  getRandomNumber100,
  getRandomNumber,
  getRandomValueFromList,
  shuffleKeyedArray,
  roundToNearestInt,
  getIndexOfArrayItemByKey,
  capitalizeFirst,
  formatKeyword,
  copyState,
  displayArmorAsPct,
  removeItemFromArrayByKey,
  assignRandomKey,
  handleOdds,
  increaseByPercent,
  getIndexOfArrayItemByName,
  getRarityTextColor,
  formatStatName,
  formatBuffName
}
