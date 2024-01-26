import {useState} from 'react'
import {giveCharacterGems} from "../lib/gems"
import {copyState} from "../lib/helper_lib"
import {healCharacter} from "../lib/stats"
const SecretTunnel = ({REQUIRED_EVENT_PROPS}) => {

  const {satisfied, setSatisfied, game_state, setGameState, setMessage} = REQUIRED_EVENT_PROPS

  const [entered, setEntered] = useState(false)

  const enterTunnel = () => {
    if(entered) return
    setEntered(true)
    let copy = copyState(game_state)
    copy = giveCharacterGems(copy, "red", 1)
    copy = giveCharacterGems(copy, "blue", 1)
    copy = healCharacter(copy, 10)
    setGameState(copy)
    setSatisfied(true)
  }

  return <div>
    <h3 className="center_text">Secret Tunnel</h3>
    <p>
      You find a secret tunnel and immediately enter it, hoping for hidden loot.
      The tunnel seems to parallel the pathway from where you came.
    </p>
    <button onClick={(e) => enterTunnel()}>Continue</button>
    {entered &&
      <p>
        You find an abandoned alchemy lab to rests in.
        Some gems and a health potion are yours for the taking.
      </p>
    }
  </div>
}

export default SecretTunnel
