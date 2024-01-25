import {useState} from 'react'
import {copyState} from "../lib/helper_lib"
import {giveCombatantCondition} from "../lib/combat"

const TrapFall = ({REQUIRED_EVENT_PROPS}) => {

  const {satisfied, setSatisfied, game_state, setGameState, setMessage} = REQUIRED_EVENT_PROPS
  const [escaped, setEscaped] = useState(false)

  const escape = () => {
    setEscaped(true)
    let copy = copyState(game_state)
    copy.character = giveCombatantCondition("buff", copy.character, "slowed", 3)
    copy.character.hp -= 10
    setGameState(copy)
  }

  return <div>
    <h3 className="center_text">Trap Fall</h3>
    <p>
      While navigating the narrow passageways, you stumble into a trap.
      You must lift yourself from the pit if you wish to continue.
    </p>
    <button onClick={(e) => escape()}>Escape</button>
    {escaped &&
      <p>
        You escape the trap, but not without injuries.
        You've sustained some damage and will be slowed in your next combat.
      </p>
    }
    {!satisfied && escaped &&
      <h2 className="center_text action_text" onClick={(e) => setSatisfied(true)}>Continue</h2>
    }
  </div>
}

export default TrapFall
