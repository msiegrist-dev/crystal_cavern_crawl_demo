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

const roundToNearestInt = (number) => {
  if(Number.isInteger(number)){
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

const handleOdds = odds => {
  const random = getRandomNumber100()
  console.log("RANDOM NUM FOR ODDS", random)
  let current = 0
  for(let i = 0; i < odds.length; i++){
    const {name, value} = odds[i]
    console.log("[name, value, current]", [name, value, current])

    if(i === 0){
      if(random <= value){
        return name
      }
    }

    if(i === (odds.length - 1)){
      if(random > current){
        return name
      }
    }

    if(random > current && random <= current + value){
      return name
    }
    current += value
  }
  throw new Error("HANDLE ODDS DIDNT RETURN SHIT")
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
  increaseByPercent
}
