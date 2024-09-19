import environment from "../../data/environment"
import {getRandomValueFromList, getRandomNumber, getRandomNumber100} from "./helper_lib"
import {getRandomGemName} from "./gems"
import {getRandomItems} from "./items"
import {getRandomCards} from "./cards"
import {getRandomStatName, getRandomStatValue} from "./stats"

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

const getTradeSelections = (quantity, trade_for, character) => {

  const available_character_entities = getPossibleCharEntities(character)
  const selections = []

  for(let i = 0; i < quantity; i++){
    if(trade_for === "random"){
      trade_for = getRandomValueFromList(environment.TRADABLE_ENTITIES)
    }
    let trade_for_entity

    const trade_in = getRandomValueFromList(available_character_entities)
    const trade_in_entity = getRandomCharacterEntity(character, trade_in)
    if(trade_for === "card"){
      trade_for_entity = getRandomCards(1)[0]
    }
    if(trade_for === "gem"){
      let gem_name = getRandomGemName()
      if(trade_in === "gem"){
        while(gem_name === trade_in_entity.name){
          gem_name = getRandomGemName()
        }
      }
      trade_for_entity = {name: gem_name, value: getRandomNumber(3) || 1}
    }
    if(trade_for === "item"){
      trade_for_entity = getRandomItems(1)[0]
    }
    selections.push({
      type: "trade",
      trade_for,
      trade_for_entity,
      trade_in,
      trade_in_entity
    })
  }
  return selections
}

const determineVictoryReward = () => {
  const value = getRandomNumber100()
  if(value <= 65){
    return getRandomValueFromList(environment.CARD_REWARDS)
  }
  return getRandomValueFromList(environment.ALL_REWARDS)
}

const getRewardChoices = (type, entity, game_state) => {
  if(type === "remove" && entity === "card"){
    return game_state.character.deck
  }
  if(type === "choice"){
    if(entity === "card"){
      return getRandomCards(3)
    }
    if(entity === "item"){
      return getRandomItems(3)
    }
    if(entity === "gem"){
      return [
        {name: "red", value: getRandomNumber(3) || 1},
        {name: "blue", value: getRandomNumber(3) || 1}
      ]
    }
    if(entity === "stat"){
      const stat_choices = []
      for(let i = 0; i < 4; i++){
        const stat_name = getRandomStatName()
        const stat_value = getRandomStatValue(stat_name)
        stat_choices.push({
          name: stat_name,
          value: stat_value
        })
      }
      return stat_choices
    }
  }
  if(type === "random"){
    if(entity === "card"){
      return getRandomCards(1)
    }
    if(entity === "item"){
      return getRandomItems(1)
    }
    if(entity === "gem"){
      const gem_color = getRandomGemName()
      const gem_amount = getRandomNumber(3) || 1
      return [{name: gem_color, value: gem_amount}]
    }
    if(entity === "stat"){
      const stat_choices = []
      for(let i = 0; i < 1; i++){
        const stat_name = getRandomStatName()
        const stat_value = getRandomStatValue(stat_name)
        stat_choices.push({
          name: stat_name,
          value: stat_value
        })
      }
      return stat_choices
    }
  }
  if(type === "trade"){
    return getTradeSelections(2, entity, game_state.character)
  }
}

export {
  determineVictoryReward,
  getTradeSelections,
  getRandomCharacterEntity,
  getPossibleCharEntities,
  getRewardChoices
}
