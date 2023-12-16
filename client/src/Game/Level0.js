import {goNextLevel} from "./lib/game"
import {getRandomGemName, giveCharacterGems} from "./lib/gems"
import {getRandomStatName, getRandomStatValue, giveCharacterStats} from "./lib/stats"
import {getRandomItems, giveCharacterItem} from "./lib/items"

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

  return (
    <>
    <h3>Welcome ! Please select an option</h3>
    <button onClick={randomGem}>Random Gem</button>
    <button onClick={randomStat}>Random Stat</button>
    <button onClick={randomItem}>Random Item</button>
    </>
  )
}

export default Level0
