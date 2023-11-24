import {useState, useEffect} from 'react'
import default_game_state from "../data/default_game_state"
import Card from "./Card"
import Enemy from "./Enemy"
import Modal from "../Modal"
import {getTurnOrder, getEnemyAction, processAction, displayArmorAsPct, shuffleKeyedArray, startTurnDraw, playCard, copyState, goNextLevel, sendCardsToGraveYard} from "./lib"
export default ({game_state, setGameState, toggleDeckModal}) => {

  const {enemies} = game_state.level
  const {character} = game_state
  const [message, setMessage] = useState("")

  const [turn_order, setTurnOrder] = useState(getTurnOrder(game_state))
  const [turn, setTurn] = useState(turn_order[0])
  const [draw_pile, setDrawPile] = useState(shuffleKeyedArray(character.deck))
  const [hand, setHand] = useState([])
  const [graveyard, setGraveyard] = useState([])
  const [targetting, setTargetting] = useState(false)
  const [selected_card, setSelectedCard] = useState(null)
  const [combat_ended, setCombatEnded] = useState(false)

  const player_turn = turn.key === "player"

  const goNextTurn = () => {
    if(combat_ended){
      return
    }
    if(player_turn){
      let game_state_copy = copyState(game_state)
      const new_hands = sendCardsToGraveYard(hand, hand, graveyard)
      setHand(new_hands.hand)
      setGraveyard(new_hands.graveyard)
    }
    const current_index = turn_order.indexOf(turn)
    if(current_index + 1 >= turn_order.length){
      return setTurn(turn_order[0])
    }
    return setTurn(turn_order[current_index + 1])
  }

  const playerTurn = () => {
    if(combat_ended){
      return
    }
    console.log("IT IS PLAYER TURN")
    const draw = startTurnDraw(draw_pile, graveyard, hand)
    setGraveyard(draw.graveyard)
    setDrawPile(draw.draw_pile)
    setHand(draw.hand)
  }

  const enemyTurn = () => {
    if(combat_ended){
      return
    }
    console.log("IT IS ENEMIES TURN")
    const enemy = enemies.find((ene) => ene.key === turn.key)
    const action = getEnemyAction(enemy)
    setGameState(
      processAction(game_state, enemy, ["player"], action)
    )
    goNextTurn()
  }

  const defeat = () => {
    const game_state_copy = copyState(game_state)
    game_state_copy.defeat = true
    setGameState(game_state_copy)
    console.log("state set to defeat")
  }

  const combatVictory = () => {
    const game_state_copy = copyState(game_state)
    game_state_copy.level.combat_victory = true
    setGameState(game_state_copy)
  }

  const targettingHandler = target_key => {
    if(!selected_card || !targetting || combat_ended){
      return
    }
    const new_game_state = playCard(selected_card, game_state, [target_key], hand, graveyard, selected_card.gems)
    if(new_game_state.error){
      return setMessage(new_game_state.error)
    }
    setGameState(new_game_state.game_state)
    setHand(new_game_state.hand)
    setGraveyard(new_game_state.graveyard)
    setTargetting(false)
    setSelectedCard(null)
  }

  useEffect(() => {
    if(combat_ended){
      return
    }
    if(turn.key === "player"){
      playerTurn(turn)
    }
    if(turn.key !== "player"){
      enemyTurn(turn)
    }
  }, [turn])

  useEffect(() => {
    if(combat_ended){
      return
    }
    if(game_state.character.hp <= 0){
      setCombatEnded(true)
      return defeat()
    }
    const all_dead = game_state.level.enemies.filter((ene) => ene.hp <= 0).length === game_state.level.enemies.length
    if(all_dead){
      setCombatEnded(true)
      return combatVictory()
    }
  }, [game_state])

  return (
    <div>
      {game_state.level.combat_victory &&
        <Modal show_modal={game_state.level.combat_victory} permanent={true}>
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
          <h2 className='center_text'>Select a Reward</h2>
          <div className="grid three_col_equal">
            <div>
              <h3 className="center_text">Gem</h3>
              <p>randomly generate random gem or +x of gem y</p>
            </div>
            <div>
              <h3 className="center_text">Card</h3>
              <p>select from [2, 3, 4]</p>
              <p>get random card</p>
              <p>remove card, trade cards</p>
            </div>
            <div>
              <h3 className="center_text">Stat</h3>
              <p>get random stat, choose from [2, 3, 4] random stats, </p>
              <p>stat for card/gem</p>
            </div>
          </div>
          <button onClick={(e) => setGameState(goNextLevel(copyState(game_state)))}>
            Continue
          </button>
        </Modal>
      }
      {game_state.defeat &&
        <Modal show_modal={game_state.defeat} permanent={true}>
          <h2 className="center_text">You are defeated.</h2>
          <table>
            <tbody>
              <tr>
                <td><b>Damage Taken</b></td>
                <td><b>Damage Done</b></td>
                <td><b>Enemies Slain</b></td>
              </tr>
            </tbody>
          </table>
          <button onClick={(e) => setGameState(default_game_state)}>
            Return to Menu
          </button>
        </Modal>
      }
      <div>
        <h2 className="center_text m-0">{message}</h2>
        <h3 className="center_text m-0">{turn.key === "player" ? "Player Turn" : "Enemy Turn"}</h3>
        {targetting && selected_card &&
          <h3 className="center_text">Please select a target for {selected_card.name}</h3>
        }
      </div>
      <div className="grid" style={{gridTemplateColumns: "35% 65%", height: "450px", alignItems: "end"}}>
        <div>
          <img src="warrior-idle.gif" style={{height: "350px"}}/>
          <table className="w-60 m-4 p-4">
            <tbody>
              <tr>
                <td><b>HP</b></td>
                <td>{character.hp}</td>
              </tr>
              <tr>
                <td><b>Block</b></td>
                <td>{character.block}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{display: "flex", justifyContent: "end"}}>
          {enemies.filter((en) => en.hp > 0).map((enemy) => <Enemy key={enemy.key} enemy={enemy} targettingHandler={targettingHandler} />)}
        </div>
      </div>
      <div className="grid" style={{gridTemplateColumns: "200px 1fr"}}>
        <div className="grid three_col_equal w-200px" style={{marginRight: "auto", height: "80px"}}>
          <h3>Draw Pile ({draw_pile.length})</h3>
          <h3>Graveyard ({graveyard.length})</h3>
          <div></div>
          <button onClick={(e) => toggleDeckModal(draw_pile)}>Open</button>
          <button onClick={(e) => toggleDeckModal(graveyard)}>Open</button>
          {player_turn &&
            <button onClick={goNextTurn}>End Turn</button>
          }
        </div>
        <div className="grid eq_four_col">
          {hand.map((card) => <Card key={card.key} card={card}
            playable={!game_state.defeat} key={card.key} game_state={game_state} setGameState={setGameState}
            setTargetting={setTargetting} setSelectedCard={setSelectedCard} hand={hand}
            graveyard={graveyard} setHand={setHand} setGraveyard={setGraveyard} setMessage={setMessage}
          />)}
        </div>

      </div>
    </div>
  )
}
