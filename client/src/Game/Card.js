import {playCard, addGemToCard, returnCardGemToCharacter} from "./lib/game"
import {capitalizeFirst, formatKeyword} from "./lib/helper_lib"
import buff_descriptions from "../data/buff_descriptions"
const Card = (
  {card, playable, game_state, setTargetting, setGameState, setSelectedCard, hand, graveyard, setHand, setGraveyard, setMessage, setCard}
) => {
  const type = capitalizeFirst(card.type)
  const card_base_value = card.type === "effect" ? card.effect_value : card.value
  return (
    <div style={{
        width: "90%",
        border: "2px solid black",
        borderRadius: "12px"
      }} className="m-4 p-4 grid center_all_items">
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
            return <p key={fect.name}><b>{fect.name}</b> : {fect.value}</p>
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
              <p className="m-0-all">{buff_descriptions[card.buff_name]}</p>
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
            </div>
            {gem_data.effect &&
              <p style={{margin: "0"}}>{gem_data.effect_description}</p>
            }
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
            const new_game_state = playCard(card, game_state, targets, hand, graveyard)
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
