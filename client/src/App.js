import {useState} from 'react'
import default_game_state from "./data/default_game_state"
import Game from "./Game"

import state from "./test_states/grublin_king"

const App = () => {

  const [page, setPage] = useState("main_menu")
  const [game_state, setGameState] = useState(state)
  console.log('game_state', game_state)

  return (
    <div>
      {page === "main_menu" &&
        <div>
          <h2>Welcome</h2>
          <button onClick={(e) => setPage("game")}>Start Game</button>
        </div>
      }
      {page === "game" &&
        <Game setPage={setPage} game_state={game_state}
          setGameState={setGameState}
        />
      }
    </div>
  )
}

export default App
