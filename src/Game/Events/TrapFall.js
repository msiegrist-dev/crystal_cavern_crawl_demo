import {useState} from 'react'
import {copyState} from "../lib/helper_lib"
import {giveCombatantCondition} from "../lib/combat"

const TrapFall = ({REQUIRED_EVENT_PROPS}) => {

  const {setSatisfied, game_state, setGameState, setRewards, setShowReward} = REQUIRED_EVENT_PROPS
  const [escaped, setEscaped] = useState(false)

  const escape = () => {
    if(escaped) return
    setEscaped(true)
    let copy = copyState(game_state)
    copy.character = giveCombatantCondition("buff", copy.character, "slowed", 3)
    copy.character.hp -= 10
    setGameState(copy)
    setSatisfied(true)
    setRewards([
      {type: "stat", entity: {direction: "decrease", name: "hp", value: 10}},
      {type: "buff", entity: {name: "slowed", value: 3}}
    ])
    setShowReward(true)
  }

  return <div>
    <h3 className="center_text m-4 p-4">Trap Fall</h3>
    <p className="m-4 p-4">
      While navigating the narrow passageways, you stumble into a trap.
      You must lift yourself from the pit if you wish to continue.
    </p>
    <button className="w-200px m-4 p-4 block yellow_action_button" onClick={(e) => escape()}>Escape</button>
    {escaped &&
      <p className="m-4 p-4">
        You escape the trap, but not without injuries.
        You've sustained some damage and will be slowed in your next combat.
      </p>
    }
  </div>
}

export default TrapFall
