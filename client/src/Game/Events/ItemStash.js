import {giveCharacterItem, getRandomItems} from "../lib/items"
const ItemStash = ({satisfied, setSatisfied, game_state, setGameState, setMessage}) => {

  const event = () => {
    setSatisfied(true)
    giveCharacterItem(game_state, getRandomItems(1)[0])
  }

  return <div>
    <p>While searching for the next passage, you stumble across a secret stash of trinkets.
      Why don't you take something to bolster your kit?
    </p>
    {!satisfied &&
      <h2 className="center_text action_text" onClick={(e) => event()}>Accept</h2>
    }
  </div>
}

export default ItemStash
