import environment from "../../data/environment"
import {getRandomValueFromList, getRandomNumber, getRandomNumber100} from "./helper_lib"
import {getRandomGemName} from "./gems"
import {getRandomItems} from "./items"
import {getRandomCards} from "./cards"

const getRandomCharacterEntity = (character, entity_name) => {
  if(entity_name === "card"){
    return getRandomValueFromList(character.deck)
  }
  if(entity_name === "item"){
    return getRandomValueFromList(character.inventory)
  }
  if(entity_name === "gem"){
    const gem_name = getRandomGemName()
    return {name: gem_name, value: getRandomNumber(3) || 1}
  }
}

const getTradeSelections = (quantity, trade_for, trade_in, character) => {

  const getPossibleCharEntities = char => {
    let list = []
    if(char.inventory.length > 0){
      list.push("item")
    }
    if(char.deck.length > 0){
      list.push("card")
    }
    if(char.gems){
      if(char.gems.red > 0 || char.gems.blue > 0){
        list.push("gem")
      }
    }
    return list
  }

  const available_character_entities = getPossibleCharEntities(character)
  const selections = []
  for(let i = 0; i < quantity; i++){
    const trade_for_entity_name = trade_for === "random" ?
      getRandomValueFromList(available_character_entities) : trade_for
    let trade_for_entity
    const trade_in_entity = getRandomCharacterEntity(character, trade_in)
    console.log("TRADE IN ENTITY", trade_in_entity)
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
  if(value <= 65){
    return getRandomValueFromList(environment.CARD_REWARDS)
  }
  return getRandomValueFromList(environment.ALL_REWARDS)
}

export {
  determineVictoryReward,
  getTradeSelections,
  getRandomCharacterEntity
}
