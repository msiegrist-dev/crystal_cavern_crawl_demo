import {playCard, doesCardRequireGem} from "./lib"

export default (
  {card, playable, game_state, setTargetting, setGameState, setSelectedCard, hand, graveyard, setHand, setGraveyard, setMessage}
) => {
  return (
    <div style={{
        width: "90%",
        border: "2px solid black",
        borderRadius: "12px"
      }} className="m-4 p-4 grid center_all_items">
      <h4 style={{margin: "0"}}>{card.name}</h4>
      <p style={{margin: "0"}}>{card.type}</p>
      <p style={{margin: "0"}}>Value : {card.value}</p>
      {card.hits &&
        <p style={{margin: "0"}}>Hits : {card.hits}</p>
      }
      {card.accuracy &&
        <p style={{margin: "0"}}>Accuracy: {card.accuracy}</p>
      }
      <p style={{margin: "0"}}>Gem REQUIRED : {doesCardRequireGem(card).toString()}</p>
      {card.gems &&
        <>
        {Object.keys(card.gems).map((gem) => {
          const img = `gem_${gem}.png`
          return <img key={gem} src={img} style={{height: "25px", width: "25px"}} className="block m-4 p-4" />
        })}
        </>
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
