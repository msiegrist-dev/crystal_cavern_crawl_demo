import {
  getRandomGemName, giveCharacterGems, getRandomStatName, getRandomStatValue,
  giveCharacterStats, goNextLevel, getRandomItems, giveCharacterItem
} from "./lib"

import {copyState} from "./helper_lib"
import items from "../data/items"

export default ({game_state, setGameState}) => {


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
