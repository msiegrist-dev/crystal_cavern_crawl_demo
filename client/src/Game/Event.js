import {useState} from 'react'
import HarmfulHealer from "./Events/HarmfulHealer"
import {goNextLevel} from "./lib/game"
import {copyState} from "./lib/helper_lib"

const Event = ({game_state, setGameState, toggleDeckModal}) => {

  const [message, setMessage] = useState("")
  const [satisfied, setSatisfied] = useState(false)
  const goNext = game_state => {
    setGameState(goNextLevel(copyState(game_state)))
    setSatisfied(false)
    setMessage("")
  }

  const component_map = {
    "": <p></p>,
    "harmful_healer": <HarmfulHealer satisfied={satisfied} setSatisfied={setSatisfied}
      game_state={game_state} setGameState={setGameState} setMessage={setMessage}
    />
  }

  return (
    <div>
      {component_map[game_state.level.event_name]}
      <h3 className="center_text">{message}</h3>
      {satisfied &&
        <h2 className="action_text center_text" onClick={(e) => goNext(game_state)}>
          Continue
        </h2>
      }
    </div>
  )
}

export default Event
