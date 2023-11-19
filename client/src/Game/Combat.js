import {useState, useEffect} from 'react'
import Card from "./Card"
import {getTurnOrder, getEnemyAction, processAction, displayArmorAsPct, shuffleKeyedArray, startTurnDraw, playCard, copyState, goNextFloor} from "./lib"
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
  const [combat_ended, setCombatEnded] = useState(false)

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

  const defeat = () => {

  }

  const combatVictory = () => {
    const game_state_copy = copyState(game_state)
    game_state_copy.floor.combat_victory = true
    setGameState(game_state_copy)
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
    const all_dead = game_state.floor.enemies.filter((ene) => ene.hp <= 0).length === game_state.floor.enemies.length
    if(all_dead){
      setCombatEnded(true)
      return combatVictory()
    }
  }, [game_state])

  return (
    <div>
      {game_state.floor.combat_victory &&
        <div className="m-4 p-4" style={{zIndex: "30", position: "absolute", height: "90%", width: "90%", backgroundColor: "yellow"}}>
          <h2 className="center_text">Combat Victory</h2>
          <table>
            <tbody>
              <tr>
                <td><b>Damage Taken</b></td>
              </tr>
              <tr>
                <td><b>Damage Done</b></td>
              </tr>
              <tr>
                <td><b>Enemies Slain</b></td>
              </tr>
            </tbody>
          </table>
          <h3 className='center_text'>Select a Reward</h3>
          <button onClick={(e) => {
              const game_state_copy = copyState(game_state)
              goNextFloor(game_state_copy)
              setGameState(game_state_copy)
            }}>Continue</button>
        </div>
      }
      <div>
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
          {enemies.filter((en) => en.hp > 0).map((enemy) => {
            return (
              <div className="grid" style={{alignItems: "end", gridAutoRows: "min-content", marginTop: "auto"}} key={enemy.key}>
                <img src="goblin_idle_left.gif" style={{height: "120px", width: "auto"}}
                  onClick={(e) => {
                    if(!selected_card || !targetting || !selected_card){
                      return
                    }
                    const new_game_state = playCard(selected_card, game_state, enemy.key, hand, graveyard)
                    setGameState(new_game_state.game_state)
                    setHand(new_game_state.hand)
                    setGraveyard(new_game_state.graveyard)
                    setTargetting(false)
                    setSelectedCard(null)
                  }}
                />
                <table className="w-60">
                  <tbody>
                    <tr>
                      <td><b>HP</b></td>
                      <td>{enemy.hp}</td>
                    </tr>
                    <tr>
                      <td><b>Block</b></td>
                      <td>{enemy.block}</td>
                    </tr>
                  </tbody>
                </table>
                <h3 style={{margin: "0"}}>{enemy.name}</h3>
                <p style={{margin: "0"}}>{enemy.splash_text}</p>
                <p style={{margin: "0"}}>POSITION KEY : {enemy.key}</p>
                <div className="grid two_col_equal">
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
                    </tbody>
                  </table>
                  <table>
                    <tbody>
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
              </div>
            )
          })}
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
          {hand.map((card) => <Card card={card}
          playable={true} key={card.key} game_state={game_state} setGameState={setGameState}
          setTargetting={setTargetting} setSelectedCard={setSelectedCard} hand={hand}
          graveyard={graveyard} setHand={setHand} setGraveyard={setGraveyard}
          />)}
        </div>

      </div>
    </div>
  )
}
