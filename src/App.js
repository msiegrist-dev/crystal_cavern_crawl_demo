import {useState} from 'react'
import default_game_state from "./data/default_game_state"
import Game from "./Game"

import grublin_king_state from "./test_states/grublin_king"
import seers_state from "./test_states/seers_sacrifice"

const App = () => {

  const [page, setPage] = useState("main_menu")
  const [game_state, setGameState] = useState(default_game_state)
  console.log('game_state', game_state)

  return (
    <div className="game_parent_container grid h-vh-100 w-vw-100 m-0">
      {page === "main_menu" &&
        <div className="grid center_all_items gap-8 w-80 h-vh-50 m-12">
          <h1>Game Name</h1>
          <h2 className="action_text" onClick={(e) => setPage("game")}>Start Game</h2>
          <h2 className="action_text" onClick={(e) => setPage("guide")}>About</h2>
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
