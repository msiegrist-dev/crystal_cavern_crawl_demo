import {getRandomGemName, giveCharacterGems, getRandomStatName, getRandomStatValue, giveCharacterStats, goNextLevel} from "./lib"
import {copyState} from "./helper_lib"

export default ({game_state, setGameState}) => {


  const randomGem = () => {
    let game_state_copy = copyState(game_state)
    giveCharacterGems(game_state_copy, getRandomGemName(), 1)
    goNextLevel(game_state_copy)
    setGameState(game_state_copy)
  }

  const randomStat = () => {
    let game_state_copy = copyState(game_state)
    const stat_name = getRandomStatName()
    giveCharacterStats(game_state_copy, stat_name, getRandomStatValue(stat_name))
    setGameState(goNextLevel(game_state_copy))
  }

  return (
    <>
    <h3>Welcome ! Please select an option</h3>
    <button onClick={randomGem}>Random Gem</button>
    <button onClick={randomStat}>Random Stat</button>
    </>
  )
}
