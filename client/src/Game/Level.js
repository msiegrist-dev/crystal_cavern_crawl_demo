import Combat from "./Combat"
import Modal from "../Modal"
import Card from "./Card"
import Item from "./Item"
import Event from "./Event"
import TopBar from "./TopBar"
import {displayArmorAsPct} from "./lib/helper_lib"

const Level = ({game_state, setGameState, setMessage, toggleDeckModal}) => {

  return (
    <>
      {game_state.level.type === "combat" &&
        <Combat game_state={game_state} setGameState={setGameState} toggleDeckModal={toggleDeckModal} setMessage={setMessage} />
      }
      {game_state.level.type === "event" &&
        <Event game_state={game_state} setGameState={setGameState} toggleDeckModal={toggleDeckModal} setMessage={setMessage} />
      }
    </>
  )
}

export default Level
