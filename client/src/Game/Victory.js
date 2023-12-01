import {useState, useEffect} from 'react'
import {copyState} from "./helper_lib"
import {goNextLevel, getRandomCards, addCardToDeck} from "./lib"
import Card from "./Card"
const Victory = ({game_state, setGameState, reward
}) => {


  const [selection_made, setSelectionMade] = useState(false)
  const [selections, setSelections] = useState([])
  console.log("REWARD", reward)
  const [type, entity] = reward.split("_")
  console.log(type, entity)
  console.log('sels', selections)

  useEffect(() => {
    const getRewardChoices = (type, entity) => {
      if(type === "random" && entity === "card"){
        return getRandomCards(3, game_state.character.name.toLowerCase())
      }
    }
    setSelections(getRewardChoices(type, entity))
  }, [reward, type, entity])


  return (
    <>
    <h2 className="center_text">Combat Victory</h2>
    <table>
      <tbody>
        <tr>
          <td><b>Damage Taken</b></td>
          <td><b>Damage Done</b></td>
          <td><b>Enemies Slain</b></td>
        </tr>
      </tbody>
    </table>
    {!selection_made &&
      <>
      <h2 className='center_text'>Select a Reward</h2>
      <div className="grid three_col_equal">
        {selections.map((select_entity) => {
          const giveCharacterEntity = new_entity => {
            setSelectionMade(true)
            if(entity === "card"){
              console.log("add card", new_entity)
              return setGameState(addCardToDeck(new_entity, game_state))
            }
          }
          return (
            <div onClick={(e) => giveCharacterEntity(select_entity)}>
              {entity === "card" &&
                <Card card={select_entity} playable={false} game_state={game_state} />
              }
            </div>
          )
        })}
      </div>
      </>
    }
    <button onClick={(e) => setGameState(goNextLevel(copyState(game_state)))}>
      Continue
    </button>
    </>
  )
}

export default Victory
