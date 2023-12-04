import {useState, useEffect} from 'react'
import {copyState} from "./helper_lib"
import {goNextLevel, getRandomCards, addCardToDeck, getTurnOrder, giveCharacterItem, giveCharacterGems, giveCharacterStats} from "./lib"
import {shuffleKeyedArray} from "./helper_lib"
import Card from "./Card"
const Victory = ({game_state, setGameState, reward, resetCombat, selections, setSelections
}) => {
  console.log('selections', selections)
  const [selection_made, setSelectionMade] = useState(false)
  const [type, entity] = reward.split("_")
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
    {selections.length > 0 &&
      <>
      <h2 className='center_text'>Select a {type} {entity}</h2>
      <div className="grid three_col_equal">
        {selections.map((select_entity, i) => {
          const giveCharacterEntity = new_entity => {
            if(selection_made){
              return
            }
            let selections_copy = copyState(selections)
            selections_copy[i].selected = true
            setSelections(selections_copy)
            setSelectionMade(true)
            if(entity === "card"){
              const new_state = addCardToDeck(game_state, new_entity)
              setGameState(new_state)
            }
            if(entity === "item"){
              const new_state = giveCharacterItem(game_state, new_entity)
              setGameState(new_state)
            }
            if(entity === "gem"){
              const new_state = giveCharacterGems(game_state, new_entity.name, new_entity.value)
              setGameState(new_state)
            }
            if(entity === "stat"){
              const state_copy = copyState(game_state)
              const new_char = giveCharacterStats(state_copy.character, new_entity.name, new_entity.value)
              state_copy.character = new_char
              setGameState(state_copy)
            }
          }
          const style = {}
          if(selection_made && !select_entity.selected){
            style.backgroundColor = "gray"
          }
          const gem_img = `gem_${select_entity.name}.png`
          return (
            <div key={i} className="hov_pointer" onClick={(e) => giveCharacterEntity(select_entity)} style={style}>
              {entity === "card" &&
                <Card card={select_entity} playable={false} game_state={game_state} />
              }
              {entity === "item" &&
                <div>
                  <p>hello</p>
                  <h3>{select_entity.name}</h3>
                  <h4>{select_entity.rarity}</h4>
                  <p>{select_entity.effect} - {select_entity.stat_name} - {select_entity.value}</p>
                </div>
              }
              {entity === "gem" &&
                <div>
                  <img src={gem_img} style={{width: "35px", height: "35px"}} className="m-4 block" />
                  <h4>Gems to receive : x{select_entity.value}</h4>
                </div>
              }
              {entity === "stat" &&
                <div>
                  <h4>{select_entity.name}</h4>
                  <h4>Stat bonus to receive : + {select_entity.value}</h4>
                </div>
              }
            </div>
          )
        })}
      </div>
      </>
    }
    <button onClick={(e) => {
        setSelections([])
        setSelectionMade(false)
        resetCombat(game_state)
      }}>
      Continue
    </button>
    </>
  )
}

export default Victory
