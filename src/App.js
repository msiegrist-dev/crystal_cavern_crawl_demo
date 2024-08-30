import {useState} from 'react'
import default_game_state from "./data/default_game_state"
import Game from "./Game"

const App = () => {

  const [page, setPage] = useState("main_menu")
  const [game_state, setGameState] = useState(default_game_state)
  const [background, setBackground] = useState("background.png")

  console.log('game_state', game_state)

  return (
    <div className="game_parent_container grid h-vh-100 w-vw-100 m-0"
      style={{
        backgroundImage: `url("${background}")`
      }}
    >
      {page === "main_menu" &&
        <div className="grid center_all_items gap-8 w-80 h-vh-50" style={{margin: "15vh auto"}}>
          <h1>Crystal Cavern Crawl</h1>
          <h2 className="action_text" onClick={(e) => setPage("game")}>New Game</h2>
        </div>
      }
      {page === "game" &&
        <Game setPage={setPage} game_state={game_state}
          setGameState={setGameState} setBackground={setBackground}
        />
      }
    </div>
  )
}

export default App
