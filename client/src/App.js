import {useState} from 'react'
import default_game_state from "./data/default_game_state"
import Game from "./Game"

import grublin_king_state from "./test_states/grublin_king"

const App = () => {

  const [page, setPage] = useState("main_menu")
  const [game_state, setGameState] = useState(default_game_state)
  console.log('game_state', game_state)

  return (
    <div className="grid w-100 center_all_items" style={{height: "100%"}}>
      {page === "main_menu" &&
        <div className="grid center_all_items gap-8">
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
