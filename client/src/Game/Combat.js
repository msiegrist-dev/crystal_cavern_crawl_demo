import {useState, useEffect} from 'react'
import Card from "./Card"
import {getTurnOrder, getEnemyAction, processAction, displayArmorAsPct, shuffleKeyedArray, startTurnDraw, playCard} from "./lib"
export default ({game_state, setGameState, toggleDeckModal}) => {

  const {enemies} = game_state.floor
  const {character} = game_state

  const [turn_order, setTurnOrder] = useState(getTurnOrder(game_state))
  const [turn, setTurn] = useState(turn_order[0])
  const [draw_pile, setDrawPile] = useState(shuffleKeyedArray(character.deck))
  console.log('draw pile', draw_pile)
  const [hand, setHand] = useState([])
  const [graveyard, setGraveyard] = useState([])
  const [targetting, setTargetting] = useState(false)
  const [selected_card, setSelectedCard] = useState(null)

  const player_turn = turn.key === "player"

  const goNextTurn = () => {
    const current_index = turn_order.indexOf(turn)
    if(current_index + 1 >= turn_order.length){
      return setTurn(turn_order[0])
    }
    return setTurn(turn_order[current_index + 1])
  }

  const playerTurn = () => {
    console.log("IT IS PLAYER TURN")
    const draw = startTurnDraw(draw_pile, graveyard, hand)
    setGraveyard(draw.graveyard)
    setDrawPile(draw.draw_pile)
    setHand(draw.hand)
  }

  const enemyTurn = () => {
    console.log("IT IS ENEMIES TURN")
    const enemy = enemies.find((ene) => ene.key === turn.key)
    const action = getEnemyAction(enemy)
    setGameState(
      processAction(game_state, enemy, "player", action)
    )
    goNextTurn()
  }

  useEffect(() => {
    if(turn.key === "player"){
      playerTurn(turn)
    }
    if(turn.key !== "player"){
      enemyTurn(turn)
    }
  }, [turn])

  return (
    <>
      <div>
        <h2 className="center_text m-0">{turn.key === "player" ? "Player Turn" : "Enemy Turn"}</h2>
        {targetting && selected_card &&
          <h3 className="center_text">Please select a target for {selected_card.name}</h3>
        }
        {player_turn &&
          <button onClick={goNextTurn}>End Turn</button>
        }
      </div>
      <div style={{margin: "0 0 0 auto"}} className="p-4">
        {enemies.filter((en) => en.hp > 0).map((enemy) => {
          return (
            <div>
              <h4>HP : {enemy.hp}</h4>
              <h4>Block : {enemy.block}</h4>
              <button onClick={(e) => {
                  if(!selected_card || !targetting || !selected_card){
                    return
                  }
                  const new_game_state = playCard(selected_card, game_state, enemy.key, hand, graveyard)
                  setGameState(new_game_state.game_state)
                  setHand(new_game_state.hand)
                  setGraveyard(new_game_state.graveyard)
                  setTargetting(false)
                  setSelectedCard(null)
                }
                }>POSITION KEY : {enemy.key}
              </button>
              <h5>{enemy.name}</h5>
              <p>{enemy.splash_text}</p>
              <table>
                <tbody>
                  <tr>
                    <td><b>Attack</b></td>
                    <td>{enemy.attack}</td>
                  </tr>
                  <tr>
                    <td><b>Defense</b></td>
                    <td>{enemy.defense}</td>
                  </tr>
                  <tr>
                    <td><b>Armor</b></td>
                    <td>{displayArmorAsPct(enemy)}</td>
                  </tr>
                  <tr>
                    <td><b>Speed</b></td>
                    <td>{enemy.speed}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
      <div>
        <h3>Draw Pile ({draw_pile.length})</h3>
        <button onClick={(e) => toggleDeckModal(draw_pile)}>Open</button>
      </div>
      <div>
        <h3>Hand</h3>
        <div className="grid eq_four_col">
          {hand.map((card) => <Card card={card}
            playable={true} key={card.key} game_state={game_state} setGameState={setGameState}
            setTargetting={setTargetting} setSelectedCard={setSelectedCard} hand={hand}
            graveyard={graveyard} setHand={setHand} setGraveyard={setGraveyard}
          />)}
        </div>
      </div>
      <div>
        <h3>Graveyard ({graveyard.length})</h3>
        <button onClick={(e) => toggleDeckModal(graveyard)}>Open</button>
      </div>
    </>
  )
}
