import {useState} from 'react'
import {playCard, addGemToCard, returnCardGemToCharacter} from "./lib/combat"
import {capitalizeFirst, formatKeyword, roundToNearestInt} from "./lib/helper_lib"
import buff_debuff_descriptions from "../data/buff_debuff_descriptions"
const Card = ({
  card, playable, game_state, setTargetting, setGameState, setSelectedCard,
  hand, graveyard, setHand, setGraveyard, setMessage, setCard, combat_log, setCombatLog,
  big_card, combat_stats, setCombatStats, in_combat_hand, index, draw_pile,
  setDrawPile, showPlayerAttackAnimation
}) => {

  const [hover, setHover] = useState(false)

  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const width = big_card ? "400px" : "200px"
  const backgroundColor = game_state.character.name.toLowerCase() === "warrior" ? "#C42430" : "white"

  let in_hand_style = {}
  const hover_style = {}
  if(in_combat_hand){

    const cards_in_hand = hand.length
    const midway = vw * .5
    const left_starting_point = midway - (roundToNearestInt(cards_in_hand / 2) * 300)
    const left = left_starting_point + (index * 210)
    const min_rotate = hand.length === 2 ? -10 : -20
    const max_rotate = hand.length === 2 ? 10 : 20
    const increment = ((min_rotate * -1) + max_rotate) / (cards_in_hand - 1)
    const middle = cards_in_hand / 2
    const rounded_middle = roundToNearestInt(middle)
    const hand_is_even = Number.isInteger(middle)
    const middle_index = !hand_is_even ? rounded_middle - 1 : null

    const top_base = -20
    const tier_1 = 25
    const tier_2 = 65
    const tier_3 = 100
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
    if(hover){
      let top_copy = top - 55
      hover_style.zIndex = "15"
      hover_style.top = top_copy + "px"
    }
  }


  const style = {
    width,
    backgroundColor,
    height: "175px"
  }


  const getTypeIcon = card => {
    if(card.type === "attack"){
      return "sword_icon.png"
    }
    if(card.type === "defend"){
      return "shield_icon.png"
    }
    return "wand_icon.png"
  }

  const card_type_icon = <img src={getTypeIcon(card)} style={{height: "25px"}} className='mt-0 mb-0 p-2 block' />

  const Effect = ({effect}) => {
    const getEffectShort = () => {
      const {name, value, stat_name, buff_name, trigger} = effect
      let str = ``
      if(trigger) str += `${trigger}: `
      str += `${name} `
      if(buff_name) str += `${buff_name} `
      if(stat_name) str += `${stat_name} `
      str += `${value}`
      return str
    }
    return <p className="mt-0">{getEffectShort()}</p>
  }

  let class_string = "m-4 p-4 game_card grid center_all_items"
  if(in_combat_hand){
    class_string += ` hov_pointer`
  }
  return (
    <div className={class_string} style={{...style, ...in_hand_style, ...hover_style}}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    >
      <div className="flex p-2">
        <h3 className="mt-0 mb-0">{card.name}</h3>
        {card_type_icon}
      </div>
      {card.type === "attack" &&
        <>
          <div className="flex center_all_items">
            {card_type_icon}
            <p><b>({card.value} * {card.hits}) </b> <i>{card.accuracy}%</i></p>
            <img style={{height: "20px"}} className="block p-4" src="bullseye_icon.png" />
          </div>
        </>
      }
      {card.type === "defend" &&
        <div className="flex center_all_items">
          {card_type_icon}
          <p><b>{card.value}</b></p>
        </div>
      }
      {card.effects &&
        <>
        <h4 className="center_text mt-0 mb-0">Effects</h4>
        {card.effects.map((fect, i) => <Effect key={`${fect}-${i}`} effect={fect} />)}
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
              list.push(
                <img alt={alt} key={i} src={img} style={{height: "25px", width: "25px"}}
                  onClick={(e) => returnCardGemToCharacter(gem_name, card, game_state, hand, setGameState, setHand)}
                />
              )
            }
            return list
          })}
        </div>
      }
      {playable &&
        <button className="hov_pointer" onClick={(e) => {
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
            const processed = playCard(card, game_state, targets, hand, graveyard, combat_log, setCombatLog, combat_stats, setCombatStats, setMessage, draw_pile, showPlayerAttackAnimation)
            if(processed.error){
              return setMessage(processed.error)
            }
            setHand(processed.card_state.hand)
            setGraveyard(processed.card_state.graveyard)
            setDrawPile(processed.card_state.draw_pile)
            setGameState(processed.game_state)
          }}>Play</button>
      }
    </div>
  )
}

export default Card
