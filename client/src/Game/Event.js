import {useState, lazy, Suspense} from 'react'
import {goNextLevel} from "./lib/levels"
import {copyState} from "./lib/helper_lib"

const HarmfulHealer = lazy(() => import("./Events/HarmfulHealer"))
const DamageForCard = lazy(() => import("./Events/DamageForCard"))
const ItemStash = lazy(() => import("./Events/ItemStash"))
const SeersSacrifice = lazy(() => import("./Events/SeersSacrifice"))
const SecretTunnel = lazy(() => import("./Events/SecretTunnel"))
const TrapFall = lazy(() => import("./Events/TrapFall"))

const Event = ({game_state, setGameState, toggleDeckModal}) => {

  const event_name = game_state.level.event_name

  const [message, setMessage] = useState("")
  const [satisfied, setSatisfied] = useState(false)
  const goNext = game_state => {
    setSatisfied(false)
    setGameState(goNextLevel(copyState(game_state)))
    setMessage("")
  }

  const REQUIRED_EVENT_PROPS = {
    satisfied,
    setSatisfied,
    game_state,
    setGameState,
    setMessage
  }

  const no_event = !event_name || event_name === ""

  return (
    <div className="m-12 p-8 h-top-bar-minus-remainder">
      <Suspense fallback={<h2>Loading...</h2>}>
        {no_event &&
          <p></p>
        }
        {event_name === "harmful_healer" &&
          <HarmfulHealer REQUIRED_EVENT_PROPS={REQUIRED_EVENT_PROPS} />
        }
        {event_name === "damage_for_card" &&
          <DamageForCard REQUIRED_EVENT_PROPS={REQUIRED_EVENT_PROPS} />
        }
        {event_name === "item_stash" &&
          <ItemStash REQUIRED_EVENT_PROPS={REQUIRED_EVENT_PROPS} />
        }
        {event_name === "seers_sacrifice" &&
          <SeersSacrifice REQUIRED_EVENT_PROPS={REQUIRED_EVENT_PROPS} />
        }
        {event_name === "secret_tunnel" &&
          <SecretTunnel REQUIRED_EVENT_PROPS={REQUIRED_EVENT_PROPS} />
        }
        {event_name === "trap_fall" &&
          <TrapFall REQUIRED_EVENT_PROPS={REQUIRED_EVENT_PROPS} />
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
