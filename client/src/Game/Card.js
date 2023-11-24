import {playCard, doesCardRequireGem, addGemToCard, returnCardGemToCharacter} from "./lib"

export default (
  {card, playable, game_state, setTargetting, setGameState, setSelectedCard, hand, graveyard, setHand, setGraveyard, setMessage, setCard}
) => {
  return (
    <div style={{
        width: "90%",
        border: "2px solid black",
        borderRadius: "12px"
      }} className="m-4 p-4 grid center_all_items">
      <h4 style={{margin: "0"}}>{card.name}</h4>
      <p style={{margin: "0"}}>{card.type} - {card.attack_effect}</p>
      <p style={{margin: "0"}}>Value : {card.value}</p>
      {card.hits &&
        <p style={{margin: "0"}}>Hits : {card.hits}</p>
      }
      {card.accuracy &&
        <p style={{margin: "0"}}>Accuracy: {card.accuracy}</p>
      }
      {card.gems &&
        <>
        {Object.keys(card.gems).map((gem_name) => {
          const gem_data = card.gems[gem_name]
          const img = `gem_${gem_name}.png`
          const color = gem => {
            if(gem === "blue"){
              return `rgba(39, 67, 245, 0.4)`
            }
            if(gem === "red"){
              return `rgba(245, 58, 39, 0.4)`
            }
          }
          return <div className="w-100" style={{backgroundColor: color(gem_name)}}>
            <div className="flex center_all_items gap-4" style={{alignItems: "start", height: "35px"}}
              onClick={(e) => addGemToCard(gem_name, card, game_state, hand, setGameState, setHand)}
            >
              <img key={gem_name} src={img} style={{height: "25px", width: "25px"}} className="block" />
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
      {playable && card.has_gems &&
        <div>
          {Object.keys(card.has_gems).filter((gem_name) => card.has_gems[gem_name] > 0).map((gem_name) => {
            const gem_number = card.has_gems[gem_name]
            const img = `gem_${gem_name}.png`
            const list = []
            for(let i = 0; i < gem_number; i++){
              list.push(<img src={img} style={{height: "25px", width: "25px"}} onClick={(e) => returnCardGemToCharacter(gem_name, card, game_state, hand, setGameState, setHand)}/>)
            }
            return list
          })}
        </div>
      }
      {playable &&
        <button onClick={(e) => {
            if(card.target_required){
              setSelectedCard(card)
              setTargetting(true)
              return
            }
            const targets = card.type === "defend" ? "player" : game_state.level.enemies.map((en) => en.key)
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
