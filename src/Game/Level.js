import Combat from "./Combat"
import Event from "./Event"

const Level = ({game_state, setGameState, setMessage, toggleDeckModal, setBackground, setPage}) => {

  return (
    <>
      {game_state.level.type === "combat" &&
        <Combat game_state={game_state} setGameState={setGameState} toggleDeckModal={toggleDeckModal} setMessage={setMessage} setBackground={setBackground}
          setPage={setPage}
        />
      }
      {game_state.level.type === "event" &&
        <Event game_state={game_state} setGameState={setGameState} toggleDeckModal={toggleDeckModal} setMessage={setMessage} />
      }
    </>
  )
}

export default Level
