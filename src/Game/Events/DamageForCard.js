import {copyState} from "../lib/helper_lib"
import {getRandomCards, addCardToDeck} from "../lib/cards"

const DamageForCard = ({REQUIRED_EVENT_PROPS}) => {

  const {satisfied, setSatisfied, game_state, setGameState, setRewards, setShowReward} = REQUIRED_EVENT_PROPS

  const accept = () => {
    const game_state_copy = copyState(game_state)
    const random_card = getRandomCards(1)[0]
    game_state_copy.character.hp -= 10
    setGameState(addCardToDeck(game_state_copy, random_card))
    setSatisfied(true)
    setRewards([{type: "card", entity: random_card}])
    setShowReward(true)
  }

  return (
    <div>
      <h3 className='center_text'>Blood for Power</h3>
      <p>
        A scraggly blood wizard of the occult approaches you from the shadows.
        For a small donation, he can gift you with new powers.
        Will you provide him with sacrifice?
      </p>
      <p>Take 10 damage but receive a random card.</p>
      {!satisfied &&
        <>
        <h3 className="center_text action_text" onClick={(e) => accept()}>Accept</h3>
        <h3 className="center_text action_text" onClick={(e) => setSatisfied(true)}>Reject</h3>
        </>
      }
    </div>
  )
}

export default DamageForCard
