import {useState} from 'react'
import {copyState, removeItemFromArrayByKey} from "./lib/helper_lib"
import {addCardToDeck, removeCardFromDeck} from "./lib/cards"
import {giveCharacterItem} from "./lib/items"
import {giveCharacterStats} from "./lib/stats"
import {giveCharacterGems, doesCharacterHaveGems} from "./lib/gems"
import Card from "./Card"
import CombatStatsTable from "./CombatStatsTable"
import Item from "./Item"

const Victory = ({
  game_state, setGameState, reward, resetCombat, selections, setSelections, combat_stats
}) => {

  const [message, setMessage] = useState("")
  const [selection_made, setSelectionMade] = useState(false)
  const [type, entity] = reward.split("_")
  const is_trade = type === "trade"

  const markSelection = index => {
    let selections_copy = copyState(selections)
    selections_copy[index].selected = true
    setSelections(selections_copy)
    setSelectionMade(true)
  }

  const reward_message = `Select a ${entity}`
  const remove_card_message = `Select a card to remove from your deck`
  const use_message = type === "remove" && entity === "card" ? remove_card_message : reward_message
  const selected_color = "rgba(121, 163, 242, 0.88)"
  const inactive_color = "rgba(86, 82, 120, 0.95)"
  const trade_message = entity === "random" ? "Would you like to trade?" : `Trade your ${entity}`

  const grid_styles = `grid gap-4 ${selections.length === 3 ? "three_col_equal" : "two_col_equal"}`
  const span_styles = `m-0 p-2 center_text ${selections.length === 3 ? "span_three_col" : "span_two_col"}`

  const GemSelect = ({alt, gem_img, select_entity}) => {
    return (
      <div className="flex center_all_content">
        <img alt={alt} src={gem_img} style={{width: "60px", height: "60px"}} className="p-8" />
        <h2 className="p-4">x{select_entity.value}</h2>
      </div>
    )
  }

  const ItemSelect = ({item}) => {
    return (
      <div className="flex center_all_content">
        <Item item={item} setDisplayItem={(e) => null}/>
      </div>
    )
  }

  return (

    <>
      <div className="grid two_col_equal m-0 p-2 center_all_items">
        <h2 className="center_text m-0 p-4">Combat Victory</h2>
        <div className="grid center_all_items">
          <CombatStatsTable combat_stats={combat_stats} />
        </div>
      </div>

    <div className={grid_styles}>

    {!is_trade && selections && selections.length > 0 &&
      <>
      <h2 className={span_styles}>{use_message}</h2>

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

          const style = {
            padding: "10px",
            borderRadius: "20px"
          }
          if(selection_made){
            style.backgroundColor = select_entity.selected ? selected_color : inactive_color
          }

          const onClickFunc = type === "remove" ? removeCharacterEntity : giveCharacterEntity
          return (
            <div key={i} className="hov_pointer" onClick={(e) => onClickFunc(select_entity)} style={style}>
              {entity === "card" &&
                <Card card={select_entity} playable={false} game_state={game_state} big_card={true}/>
              }
              {entity === "item" &&
                <ItemSelect item={select_entity} />
              }
              {entity === "gem" &&
                <GemSelect alt={alt} gem_img={gem_img} select_entity={select_entity} />
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
      <h2 className={span_styles}>{trade_message}</h2>
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
              if(!doesCharacterHaveGems(game_state.character, trade_in_entity.name, trade_in_entity.value)){
                return setMessage("You do not have enough gems to complete this trade")
              }
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
          if(selection_made){
            const color = trade.selected ? selected_color : inactive_color
            style.backgroundColor = color
          }
          const {trade_for, trade_for_entity, trade_in, trade_in_entity} = trade
          const trade_in_gem_img = `gem_${trade_in_entity.name}.png`
          const trade_in_gem_img_alt = `${trade_in_entity.name} gem`
          const trade_for_gem_img = `gem_${trade_for_entity.name}.png`
          const trade_for_gem_img_alt = `${trade_for_entity.name} gem`
          return (
            <div style={style} className="hov_pointer" onClick={(e) => {
              if(selection_made){
                return
              }
              markSelection(i)
              const new_state = commitTrade(trade)
              setGameState(new_state)
            }}>
              <h3 className="center_text m-0 p-4" style={{color: "#C42430"}}>Lose</h3>
              {trade_in === "card" &&
                <Card card={trade_in_entity} playable={false} game_state={game_state} />
              }
              {trade_in === "gem" &&
                <GemSelect alt={trade_in_gem_img_alt} gem_img={trade_in_gem_img} select_entity={trade_in_entity} />
              }
              {trade_in === "item" &&
                <ItemSelect item={trade_in_entity} />
              }

              <h3 className="center_text p-4" style={{color: "#658CC6"}}>Receive</h3>
              {trade_for === "card" &&
                <Card card={trade_for_entity} playable={false} game_state={game_state} />
              }
              {trade_for === "gem" &&
                <GemSelect alt={trade_for_gem_img_alt} gem_img={trade_for_gem_img} select_entity={trade_for_entity} />
              }
              {trade_for === "item" &&
                <ItemSelect item={trade_for_entity} />
              }
            </div>
          )
        })}
      </>
    }
    </div>
    <h3 className="center_text">{message}</h3>
    <h2  className="m-0 p-2 center_text action_text"
      onClick={(e) => {
        setSelections([])
        setSelectionMade(false)
        resetCombat(game_state)
      }}>
      Continue
    </h2>
    </>
  )
}

export default Victory
