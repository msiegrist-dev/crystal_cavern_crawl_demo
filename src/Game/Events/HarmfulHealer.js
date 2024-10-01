import {handleOdds, copyState, roundToNearestInt} from "../lib/helper_lib"
import {healCharacter} from "../lib/stats"
const HarmfulHealer = ({REQUIRED_EVENT_PROPS}) => {

  const {satisfied, setSatisfied, game_state, setGameState, setMessage} = REQUIRED_EVENT_PROPS

  const healer = () => {
    const odds = [
      {name: "heal", value: 70}, {name: "harm", value: 30}
    ]
    const result = handleOdds(odds)
    let game_state_copy = copyState(game_state)
    const value = roundToNearestInt(game_state_copy.character.max_hp * .10)
    if(result === "heal"){
      game_state_copy = healCharacter(game_state_copy, value)
      setMessage(`Steady hands makes quick work. You are healed for ${value}.`)
    } else {
      game_state_copy.character.hp -= value
      setMessage(`The doctor flubs the procedure and harms you for ${value}`)
    }
    setSatisfied(true)
    return setGameState(game_state_copy)
  }

  return (
    <div>
      <h3 className="center_text">Harmful Healer</h3>
      <p>
        You are offered healing from a mysterious doctor.
        He appears menacing but the other patients look well enough.
        Will you undergo procedure?
      </p>
      {!satisfied &&
        <div className="grid two_col_equal w-80 m-4 p-4">
          <button className="w-200px m-4 p-4 yellow_action_button" onClick={(e) => healer()}>
            Accept
          </button>
          <button className="w-200px m-4 p-4 yellow_action_button" onClick={(e) => setSatisfied(true)}>
            Reject
          </button>
        </div>
      }
    </div>
  )
}

export default HarmfulHealer
