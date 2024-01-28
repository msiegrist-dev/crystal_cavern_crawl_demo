import {
  copyState, assignRandomKey, removeItemFromArrayByKey,
  getIndexOfArrayItemByName, getRandomValueFromList
} from "./helper_lib"
import warrior_deck from "../../data/warrior_deck"

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

const isCardUsingGems = card => {
  if(!card.gem_augments || !card.gem_inventory){
    return false
  }
  for(let gem_name of Object.keys(card.gem_augments)){
    const gem = card.gem_augments[gem_name]
    if(card.gem_inventory[gem_name] === gem.number){
      return true
    }
  }
  return false
}

const processGemAugment = card => {

  const augmentToEffect = aug => {
    return {
      name: aug.effect_name,
      value: aug.value,
      trigger: "on_attack",
      buff_name: aug.buff_name,
      stat_name: aug.stat_name
    }
  }
  const push_to_effect_augments = [
    "give_doer_block", "give_doer_buff", "give_doer_stat"
  ]

  if(!card.gem_augments || !Object.keys(card.gem_augments).length){
    return card
  }
  let card_copy = copyState(card)

  for(let gem_name of Object.keys(card.gem_augments)){
    const augment = card.gem_augments[gem_name]
    if(!augment){
      continue
    }
    const inventory = card.gem_inventory[gem_name]
    if(!inventory){
      continue
    }
    if(augment.number > card_copy.gem_inventory[gem_name]){
      continue
    }
    const {effect_name, value} = augment
    if(effect_name === "increase_card_value"){
      card_copy.value += value
    }
    if(push_to_effect_augments.includes(effect_name)){
      if(!card_copy.effects){
        card_copy.effects = []
      }
      card_copy.effects.push(augmentToEffect(augment))
    }
    card_copy.gem_inventory[gem_name] = 0
  }

  return card_copy
}

const doesCardHaveRequiredGems = card => {
  for(let gem_name of Object.keys(card.gem_augments)){
    const augment = card.gem_augments[gem_name]
    if(!augment.required){
      continue
    }
    const inventory = card.gem_inventory[gem_name]
    if(inventory < augment.required){
      return false
    }
  }
  return true
}

const addCardToDeck = (game_state, card) => {
  const game_state_copy = copyState(game_state)
  game_state_copy.character.deck.push(assignRandomKey(card, game_state_copy.character.deck))
  return game_state_copy
}

const removeCardFromDeck = (game_state, card) => {
  const game_state_copy = copyState(game_state)
  game_state_copy.character.deck = removeItemFromArrayByKey(game_state_copy.character.deck, card.key)
  return game_state_copy
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

export {
  addCardToDeck,
  removeCardFromDeck,
  processGemAugment,
  isCardUsingGems,
  doesCardRequireGem,
  getRandomCards,
  doesCardHaveRequiredGems
}
