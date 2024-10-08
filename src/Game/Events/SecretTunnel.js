import {useState, useEffect} from 'react'
import {giveCharacterGems} from "../lib/gems"
import {copyState} from "../lib/helper_lib"
import {healCharacter} from "../lib/stats"
const SecretTunnel = ({REQUIRED_EVENT_PROPS}) => {

  const {setSatisfied, game_state, setGameState, setRewards, setShowReward} = REQUIRED_EVENT_PROPS

  const [entered, setEntered] = useState(false)

  useEffect(() => {
    setEntered(false)
  }, [game_state.level.number])

  const enterTunnel = () => {
    if(entered) return
    setEntered(true)
    let copy = copyState(game_state)
    copy = giveCharacterGems(copy, "red", 1)
    copy = giveCharacterGems(copy, "blue", 1)
    copy = healCharacter(copy, 10)
    setGameState(copy)
    setSatisfied(true)
    setRewards([
      {type: "gem", entity: {color: "red", number: 1}},
      {type: "gem", entity: {color: "blue", number: 1}},
      {type: "stat", entity: {direction: "increase", name: "hp", value: 10}}
    ])
    setShowReward(true)
  }

  return (
    <div>
      <h3 className="center_text p-4 m-4">Secret Tunnel</h3>
      <p className="p-4 m-4 center_text">
        You find a secret tunnel and immediately enter it, hoping for hidden loot.
        The tunnel seems to parallel the pathway from where you came.
      </p>
      {!entered &&
        <h2 className="m-4 p-4 action_text center_text" onClick={(e) => enterTunnel()}>Enter</h2>
      }
      {entered &&
        <p className="p-4 m-4 center_text">
          You find an abandoned alchemy lab to rest in.
          Some gems and a health potion are yours for the taking.
        </p>
      }
    </div>
  )
}

export default SecretTunnel
