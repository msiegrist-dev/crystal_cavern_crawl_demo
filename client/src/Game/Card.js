import {playCard, addGemToCard, returnCardGemToCharacter} from "./lib/combat"
import {capitalizeFirst, formatKeyword, roundToNearestInt} from "./lib/helper_lib"
import buff_debuff_descriptions from "../data/buff_debuff_descriptions"
const Card = ({
  card, playable, game_state, setTargetting, setGameState, setSelectedCard,
  hand, graveyard, setHand, setGraveyard, setMessage, setCard, combat_log, setCombatLog,
  big_card, combat_stats, setCombatStats, in_combat_hand, index
}) => {

  const isInt = num => num % 1 === 0
  let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const type = capitalizeFirst(card.type)
  const card_base_value = card.type === "effect" ? card.effect_value : card.value
  const width = big_card ? "400px" : "250px"
  const backgroundColor = game_state.character.name.toLowerCase() === "warrior" ? "#C42430" : "white"

  let in_hand_style = {}
  if(in_combat_hand){

    const cards_in_hand = hand.length
    const midway = vw * .42
    const left_starting_point = midway - (roundToNearestInt(cards_in_hand / 2) * 100)
    const left = left_starting_point + (index * 150)
    const min_rotate = hand.length === 2 ? -10 : -20
    const max_rotate = hand.length === 2 ? 10 : 20
    const increment = ((min_rotate * -1) + max_rotate) / (cards_in_hand - 1)
    const middle = cards_in_hand / 2
    const rounded_middle = roundToNearestInt(middle)
    const hand_is_even = isInt(middle)
    const middle_index = !hand_is_even ? rounded_middle - 1 : null

    const top_base = 550
    const tier_1 = 600
    const tier_2 = 650
    const tier_3 = 700
    const top_tier_map = {
      0: top_base,
      1: tier_1,
      2: tier_2,
      3: tier_3
    }

    let top
    if(hand_is_even){
      const first_stop = rounded_middle - 1
      if(index <= first_stop){
        const distance_away = first_stop - index
        top = [top_tier_map[distance_away + 1]]
      }
      const second_start = rounded_middle
      if(index >= second_start){
        const distance_away = index - second_start
        top = top_tier_map[distance_away + 1]
      }
    }

    if(!hand_is_even){
      let distance_away = index - middle_index
      if(distance_away < 0){
        distance_away = distance_away * -1
      }
      top = top_tier_map[distance_away]
    }
    if(!hand_is_even && index === middle_index){
      top = top_base
    }

    let rotate = min_rotate + (increment * index)
    if(index === hand.length - 1){
      rotate = max_rotate
    }
    if(index === rounded_middle - 1 && !hand_is_even){
      rotate = 0
    }
    if(index === 0){
      rotate = min_rotate
    }
    if(hand.length === 1){
      rotate = 0
    }
    const transform = `rotate(${rotate}deg)`
    in_hand_style = {
      position: "absolute",
      left: left + "px",
      transform,
      margin: "0px",
      top: top + "px"
    }
  }


  const style = {
    width,
    backgroundColor,
    height: "185px"
  }

  return (
    <div className="m-4 p-4 game_card grid center_all_items" style={{...style, ...in_hand_style}}>
      <h4 className="m-0-all">{card.name}</h4>
      <p className="m-0-all"><b>Type</b> : {formatKeyword(card.type)}</p>
      <p className="m-0-all">{type} Value : {card_base_value}</p>
      {card.hits &&
        <p className="m-0-all">{type} Hits : {card.hits}</p>
      }
      {card.accuracy &&
        <p className="m-0-all">{type} Accuracy: {card.accuracy}%</p>
      }
      {card.attack_effects && card.attack_effects.length > 0 &&
        <>
          {card.attack_effects.map((fect) => {
            let value = fect.value
            if(value < 1){
              value = (value * 100) + "%"
            }
            return <p key={fect.name}><b>{fect.name}</b> : {value || "true"}</p>
          })}
        </>
      }
      {card.effect_value &&
        <p className="m-0-all">Attack Effect Value : {card.effect_value}</p>
      }
      {card.type === "effect" &&
        <>
          {card.buff_name &&
            <>
              <p className="m-0-all">Buff : <b>{card.buff_name}</b></p>
              <p className="m-0-all">Can Target : {card.can_target.map((targ) => targ)}</p>
              <p className="m-0-all">{buff_debuff_descriptions[card.buff_name]}</p>
            </>
          }
        </>
      }
      {card.gem_augments &&
        <>
        {Object.keys(card.gem_augments).map((gem_name) => {
          const gem_data = card.gem_augments[gem_name]
          const img = `gem_${gem_name}.png`
          const color = gem => {
            if(gem === "blue"){
              return `rgba(39, 67, 245, 0.4)`
            }
            if(gem === "red"){
              return `rgba(245, 58, 39, 0.4)`
            }
          }
          const alt = `${gem_name} gem`
          return <div className="w-100" style={{backgroundColor: color(gem_name)}}>
            <div className="flex center_all_items gap-4 hov_pointer" style={{alignItems: "start", height: "35px"}}
              key={gem_name}
              onClick={(e) => {
                if(!playable){
                  return
                }
                addGemToCard(gem_name, card, game_state, hand, setGameState, setHand)
              }}
            >
              <img alt={alt} key={gem_name} src={img} style={{height: "25px", width: "25px"}} className="block" />
              {gem_data.number && <h4>x{gem_data.number}</h4>}
              {gem_data.required && <h4>Required.</h4>}
              {gem_data.effect &&
                <p style={{margin: "0"}}>{gem_data.effect_description}</p>
              }
            </div>
          </div>
        })}
        </>
      }
      {playable && card.gem_inventory &&
        <div>
          {Object.keys(card.gem_inventory).filter((gem_name) => card.gem_inventory[gem_name] > 0).map((gem_name) => {
            const gem_number = card.gem_inventory[gem_name]
            const img = `gem_${gem_name}.png`
            const list = []
            const alt = `one ${gem_name} gem`
            for(let i = 0; i < gem_number; i++){
              list.push(<img alt={alt} key={i} src={img} style={{height: "25px", width: "25px"}} onClick={(e) => returnCardGemToCharacter(gem_name, card, game_state, hand, setGameState, setHand)}/>)
            }
            return list
          })}
        </div>
      }
      {playable &&
        <button onClick={(e) => {
            const requiresTargetting = card => {
              if(!card.target_required && !card.can_target){
                return false
              }
              if(card.target_required){
                if(card.can_target){
                  if(card.can_target.length === 1 && card.can_target[0] === "player"){
                    return false
                  }
                }
                return true
              }
            }
            if(requiresTargetting(card)){
              setSelectedCard(card)
              setTargetting(true)
              return
            }

            const targets = card.type === "defend" || card.type === "effect" ? ["player"] : game_state.level.enemies.map((en) => en.key)
            const new_game_state = playCard(card, game_state, targets, hand, graveyard, combat_log, setCombatLog, combat_stats, setCombatStats, setMessage)
            if(new_game_state.error){
              return setMessage(new_game_state.error)
            }
            setGameState(new_game_state.game_state)
            setHand(new_game_state.hand)
            setGraveyard(new_game_state.graveyard)
          }}>Play</button>
      }
    </div>
  )
}

export default Card
