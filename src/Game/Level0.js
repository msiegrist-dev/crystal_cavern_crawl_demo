import {useEffect} from 'react'
import {goNextLevel} from "./lib/levels"
import {getRandomGemName, giveCharacterGems} from "./lib/gems"
import {getRandomStatName, getRandomStatValue, giveCharacterStats} from "./lib/stats"
import {getRandomItems, giveCharacterItem} from "./lib/items"
import {getRandomCards, addCardToDeck} from "./lib/cards"

import {copyState} from "./lib/helper_lib"

const Level0 = ({game_state, setGameState, setBackground}) => {

  useEffect(() => {
    setBackground("newbg.png")
  }, [setBackground])


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
    game_state_copy.character = giveCharacterItem(game_state_copy.character, random_item)
    setGameState(goNextLevel(game_state_copy))
  }

  const randomCard = () => {
    const game_state_copy = copyState(game_state)
    const random_card = getRandomCards(1)[0]
    setGameState(
      goNextLevel(
        addCardToDeck(game_state_copy, random_card)
      )
    )
  }

  return (
    <div className="m-16 p-8 h-top-bar-minus-remainder">
      <h1 className="m-12 center_text">Select your new run gift.</h1>
      <div className="grid two_col_equal w-60 m-12 p-4 gap- 8">
        <h2 className="action_text center_text" onClick={randomGem}>Random Gem</h2>
        <h2 className="action_text center_text" onClick={randomStat}>Random Stat</h2>
        <h2 className="action_text center_text" onClick={randomItem}>Random Item</h2>
        <h2 className="action_text center_text" onClick={randomCard}>Random Card</h2>
      </div>
    </div>
  )
}

export default Level0
