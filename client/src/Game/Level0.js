import {goNextLevel} from "./lib/game"
import {getRandomGemName, giveCharacterGems} from "./lib/gems"
import {getRandomStatName, getRandomStatValue, giveCharacterStats} from "./lib/stats"
import {getRandomItems, giveCharacterItem} from "./lib/items"
import {getRandomCards, addCardToDeck} from "./lib/cards"

import {copyState} from "./lib/helper_lib"

const Level0 = ({game_state, setGameState}) => {


  const randomGem = () => {
    const game_state_copy = copyState(game_state)
    setGameState(
      goNextLevel(
        giveCharacterGems(game_state_copy, getRandomGemName(), 1)
      )
    )
  }

  const randomStat = () => {
    const game_state_copy = copyState(game_state)
    const stat_name = getRandomStatName()
    game_state_copy.character = giveCharacterStats(game_state_copy.character, stat_name, getRandomStatValue(stat_name))
    setGameState(
      goNextLevel(game_state_copy)
    )
  }

  const randomItem = () => {
    const game_state_copy = copyState(game_state)
    const random_item = getRandomItems(1)[0]
    setGameState(
      goNextLevel(
        giveCharacterItem(game_state_copy, random_item)
      )
    )
  }

  const randomCard = () => {
    const game_state_copy = copyState(game_state)
    const random_card = getRandomCards(1, "warrior")[0]
    setGameState(
      goNextLevel(
        addCardToDeck(game_state_copy, random_card)
      )
    )
  }

  return (
    <>
    <h3>Welcome ! Please select an option</h3>
    <button onClick={randomGem}>Random Gem</button>
    <button onClick={randomStat}>Random Stat</button>
    <button onClick={randomItem}>Random Item</button>
    <button onClick={randomCard}>Random Card</button>
    </>
  )
}

export default Level0
