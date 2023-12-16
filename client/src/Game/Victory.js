import {useState} from 'react'
import {copyState, removeItemFromArrayByKey} from "./lib/helper_lib"
import {addCardToDeck, removeCardFromDeck} from "./lib/cards"
import {giveCharacterItem} from "./lib/items"
import {giveCharacterStats} from "./lib/stats"
import {giveCharacterGems} from "./lib/gems"
import Card from "./Card"
const Victory = ({game_state, setGameState, reward, resetCombat, selections, setSelections
}) => {

  const [selection_made, setSelectionMade] = useState(false)
  const [type, entity] = reward.split("_")
  const is_trade = type === "trade"

  const markSelection = index => {
    let selections_copy = copyState(selections)
    selections_copy[index].selected = true
    setSelections(selections_copy)
    setSelectionMade(true)
  }

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
    <div className="grid three_col_equal">


    {!is_trade && selections.length > 0 &&
      <>
      <h2 className='center_text span_three_col'>Select a {type} {entity} {type === "remove" && " from your deck"}</h2>

        {selections.map((select_entity, i) => {

          const gem_img = `gem_${select_entity.name}.png`
          const alt = `${select_entity.name} gem`
          const giveCharacterEntity = new_entity => {
            if(selection_made){
              return
            }
            markSelection(i)
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

          const removeCharacterEntity = select_entity => {
            if(selection_made){
              return
            }
            markSelection(i)
            if(entity === "card"){
              setGameState(removeCardFromDeck(game_state, select_entity))
            }
          }

          const style = {}
          if(selection_made){
            style.backgroundColor = select_entity.selected ? "yellow" : "gray"
          }

          const onClickFunc = type === "remove" ? removeCharacterEntity : giveCharacterEntity
          return (
            <div key={i} className="hov_pointer" onClick={(e) => onClickFunc(select_entity)} style={style}>
              {entity === "card" &&
                <Card card={select_entity} playable={false} game_state={game_state} />
              }
              {entity === "item" &&
                <div>
                  <h3>{select_entity.name}</h3>
                  <h4>{select_entity.rarity}</h4>
                  <p>{select_entity.effect} - {select_entity.stat_name} - {select_entity.value}</p>
                </div>
              }
              {entity === "gem" &&
                <div>
                  <img alt={alt} src={gem_img} style={{width: "35px", height: "35px"}} className="m-4 block" />
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
      </>
    }

    {is_trade &&
      <>
      <h2 className="span_three_col">Trade in a {entity} for a reward</h2>
        {selections.map((trade, i) => {
          const commitTrade = trade => {
            const {trade_in, trade_for, trade_in_entity, trade_for_entity} = trade
            const game_copy = copyState(game_state)
            if(trade_in === "card"){
              game_copy.character.deck = removeItemFromArrayByKey(game_copy.character.deck, trade_in_entity.key)
            }
            if(trade_in === "item"){
              game_copy.character.inventory = removeItemFromArrayByKey(game_copy.character.inventory, trade_in_entity.key)
            }
            if(trade_in === "gem"){
              game_copy.character.gems[trade_in_entity.name] -= trade_in_entity.value
            }
            if(trade_for === "card"){
              return addCardToDeck(game_copy, trade_for_entity)
            }
            if(trade_for === "item"){
              return giveCharacterItem(game_copy, trade_for_entity)
            }
            if(trade_for === "gem"){
              game_copy.character.gems[trade_for_entity.name] += trade_for_entity.value
              return game_copy
            }
          }
          const style = {}
          if(selection_made && !trade.selected){
            style.backgroundColor = "gray"
          }
          const {trade_for, trade_for_entity, trade_in, trade_in_entity} = trade
          const trade_in_gem_img = `gem_${trade_in_entity.name}.png`
          const trade_in_gem_img_alt = `${trade_in_entity.name} gem`
          const trade_for_gem_img = `gem_${trade_for_entity.name}.png`
          const trade_for_gem_img_alt = `${trade_for_entity.name} gem`
          return (
            <div style={style} className="hov pointer" onClick={(e) => {
              if(selection_made){
                return
              }
              markSelection(i)
              const new_state = commitTrade(trade)
              setGameState(new_state)
            }}>
              <h3>Trade In {trade_in}</h3>
              {trade_in === "card" &&
                <Card card={trade_in_entity} playable={false} game_state={game_state} />
              }
              {trade_in === "gem" &&
                <div>
                  <img alt={trade_in_gem_img_alt} src={trade_in_gem_img} style={{width: "35px", height: "35px"}} className="m-4 block" />
                  <h4>Gems to receive : x{trade_in_entity.value}</h4>
                </div>
              }
              {trade_in === "item" &&
                <div>
                  <h3>{trade_in_entity.name}</h3>
                  <h4>{trade_in_entity.rarity}</h4>
                  <p>{trade_in_entity.effect} - {trade_in_entity.stat_name} - {trade_in_entity.value}</p>
                </div>
              }
              <h3>Trade For {trade_for}</h3>
              {trade_for === "card" &&
                <Card card={trade_for_entity} playable={false} game_state={game_state} />
              }
              {trade_for === "gem" &&
                <div>
                  <img alt={trade_for_gem_img_alt} src={trade_for_gem_img} style={{width: "35px", height: "35px"}} className="m-4 block" />
                  <h4>Gems to receive : x{trade_for_entity.value}</h4>
                </div>
              }
              {trade_for === "item" &&
                <div>
                  <h3>{trade_for_entity.name}</h3>
                  <h4>{trade_for_entity.rarity}</h4>
                  <p>{trade_for_entity.effect} - {trade_for_entity.stat_name} - {trade_for_entity.value}</p>
                </div>
              }
            </div>
          )
        })}
      </>
    }
    </div>
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
