import {useState, lazy, Suspense} from 'react'
import {goNextLevel} from "./lib/levels"
import {copyState} from "./lib/helper_lib"

const HarmfulHealer = lazy(() => import("./Events/HarmfulHealer"))
const DamageForCard = lazy(() => import("./Events/DamageForCard"))
const ItemStash = lazy(() => import("./Events/ItemStash"))
const SeersSacrifice = lazy(() => import("./Events/SeersSacrifice"))

const Event = ({game_state, setGameState, toggleDeckModal}) => {

  const event_name = game_state.level.event_name

  const [message, setMessage] = useState("")
  const [satisfied, setSatisfied] = useState(false)
  const goNext = game_state => {
    setSatisfied(false)
    setGameState(goNextLevel(copyState(game_state)))
    setMessage("")
  }

  return (
    <div className="m-12 p-8 h-top-bar-minus-remainder">
      <Suspense fallback={<h2>Loading...</h2>}>
        {!event_name || event_name === "" &&
          <p></p>
        }
        {event_name === "harmful_healer" &&
          <HarmfulHealer satisfied={satisfied} setSatisfied={setSatisfied}
            game_state={game_state} setGameState={setGameState} setMessage={setMessage}
          />
        }
        {event_name === "damage_for_card" &&
          <DamageForCard satisfied={satisfied} setSatisfied={setSatisfied}
            game_state={game_state} setGameState={setGameState} setMessage={setMessage}
          />
        }
        {event_name === "item_stash" &&
          <ItemStash satisfied={satisfied} setSatisfied={setSatisfied}
            game_state={game_state} setGameState={setGameState} setMessage={setMessage}
          />
        }
        {event_name === "seers_sacrifice" &&
          <SeersSacrifice satisfied={satisfied} setSatisfied={setSatisfied}
            game_state={game_state} setGameState={setGameState} setMessage={setMessage}
          />
        }
      </Suspense>
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
