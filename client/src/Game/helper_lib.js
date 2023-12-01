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

const roundToNearestInt = (number, reverse) => {
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

const getIndexOfArrayItemByKey = (array, key) => {
  for(let i = 0; i < array.length; i++){
    if(array[i].key === key){
      return i
    }
  }
  return null
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
  displayArmorAsPct
}
