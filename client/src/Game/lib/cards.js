import {copyState, assignRandomKey, removeItemFromArrayByKey, getRandomValueFromList} from "./helper_lib"
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
  isCardUsingAugmentGem,
  doesCardRequireGem,
  getRandomCards
}
