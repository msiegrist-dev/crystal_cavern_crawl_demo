import {giveCharacterItem, getRandomItems} from "../lib/items"
const ItemStash = ({REQUIRED_EVENT_PROPS}) => {

  const {satisfied, setSatisfied, game_state, setGameState, setMessage} = REQUIRED_EVENT_PROPS

  const event = () => {
    setSatisfied(true)
    giveCharacterItem(game_state, getRandomItems(1)[0])
  }

  return <div>
    <h3 className="center_text">Item Stash</h3>
    <p>While searching for the next passage, you stumble across a secret stash of trinkets.
      Why don't you take something to bolster your kit?
    </p>
    {!satisfied &&
      <h2 className="center_text action_text" onClick={(e) => event()}>Accept</h2>
    }
  </div>
}

export default ItemStash
