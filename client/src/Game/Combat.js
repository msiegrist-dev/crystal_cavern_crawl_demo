import {useState, useEffect} from 'react'
import {getIndexOfArrayItemByKey, copyState, shuffleKeyedArray, getRandomNumber, getRandomValueFromList} from "./helper_lib"
import {
  getTurnOrder, getEnemyAction, processAction, startTurnDraw, playCard, goNextLevel,
  sendCardsToGraveYard, getRandomCards, getRandomItems, getRandomStatName,
  getRandomStatValue, getTradeSelections
} from "./lib"
import default_game_state from "../data/default_game_state"
import victory_reward_options from "../data/victory_reward_options"
import environment from "../data/environment"
import Card from "./Card"
import Enemy from "./Enemy"
import Modal from "../Modal"
import Victory from "./Victory"
const Combat = ({game_state, setGameState, toggleDeckModal}) => {

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
  const [victory_reward, setVictoryReward] = useState("")
  const [victory_selections, setVictorySelections] = useState([])

  const player_turn = turn.key === "player"

  const resetCombat = game_state => {
    setHand([])
    setDrawPile(shuffleKeyedArray(character.deck))
    setGraveyard([])
    const next_level = goNextLevel(copyState(game_state))
    const turn_order = getTurnOrder(next_level)
    setTurnOrder(turn_order)
    setTurn(turn_order[0])
    setGameState(next_level)
    setCombatEnded(false)
  }

  const goNextTurn = () => {
    if(combat_ended){
      return
    }
    if(player_turn){
      const state = sendCardsToGraveYard(hand, hand, graveyard, game_state)
      setHand(state.hand)
      setGraveyard(state.graveyard)
      setGameState(state.game_state)
    }
    const current_index = getIndexOfArrayItemByKey(turn_order, turn.key)
    if(current_index + 1 >= turn_order.length){
      return setTurn(turn_order[0])
    }
    return setTurn(turn_order[current_index + 1])
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

  //handles enemy turn and inits player turn when turn is changed
  useEffect(() => {

    const initPlayerTurn = () => {
      if(combat_ended){
        return
      }
      console.log("IT IS PLAYER TURN")
      let game_state_copy = copyState(game_state)
      if(game_state_copy.character.buffs){
        for(let buff_name of Object.keys(game_state_copy.character.buffs)){
          if(game_state_copy.character.buffs[buff_name] < 1){
            continue
          }
          game_state_copy.character.buffs[buff_name] -= 1
        }
      }
      setGameState(game_state_copy)
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

    if(combat_ended){
      return
    }
    if(turn.key === "player"){
      return initPlayerTurn(turn)
    }
    if(turn.key !== "player"){
      return enemyTurn(turn)
    }
  }, [turn, combat_ended, turn_order])

  //observes game state for death of player or all enemies and handles defeat or victory
  useEffect(() => {

    const combatVictory = () => {

      const getRewardChoices = (type, entity) => {
        if(type === "remove" && entity === "card"){
          return character.deck
        }
        if(type === "choice"){
          if(entity === "card"){
            return getRandomCards(3, character.name.toLowerCase())
          }
          if(entity === "item"){
            return getRandomItems(3)
          }
          if(entity === "gem"){
            return [
              {name: "red", value: getRandomNumber(3)},
              {name: "blue", value: getRandomNumber(3)}
            ]
          }
          if(entity === "stat"){
            const stat_choices = []
            for(let i = 0; i < 4; i++){
              const stat_name = getRandomStatName()
              const stat_value = getRandomStatValue(stat_name)
              stat_choices.push({
                name: stat_name,
                value: stat_value
              })
            }
            return stat_choices
          }
        }
        if(type === "random"){
          if(entity === "card"){
            return getRandomCards(1, character.name.toLowerCase())
          }
          if(entity === "item"){
            return getRandomItems(1)
          }
          if(entity === "gem"){
            const gem_color = environment.ALL_GEMS[getRandomNumber(2)]
            const gem_amount = getRandomNumber(3)
            return [{name: gem_color, value: gem_amount}]
          }
          if(entity === "stat"){
            const stat_choices = []
            for(let i = 0; i < 1; i++){
              const stat_name = getRandomStatName()
              const stat_value = getRandomStatValue(stat_name)
              stat_choices.push({
                name: stat_name,
                value: stat_value
              })
            }
            return stat_choices
          }
        }
        if(type === "trade"){
          return getTradeSelections(2, "random", entity, character)
        }
      }

      const game_state_copy = copyState(game_state)
      game_state_copy.level.combat_victory = true
      //const reward_text = getRandomValueFromList(victory_reward_options)
      const reward_text = "random_stat"
      const [type, entity] = reward_text.split("_")
      setVictoryReward(reward_text)
      setVictorySelections(getRewardChoices(type, entity))
      setGameState(game_state_copy)
      setHand([])
      setGraveyard([])
      setDrawPile(shuffleKeyedArray(character.deck))
    }

    const defeat = () => {
      const game_state_copy = copyState(game_state)
      game_state_copy.defeat = true
      setGameState(game_state_copy)
    }

    if(combat_ended || game_state.defeat){
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
  }, [game_state, combat_ended, setGameState])


  return (
    <div onClick={(e) => {
        if(!targetting){
          return
        }
        if(targetting){
          if(!e.target.className.includes("enemy_img")){
            setTargetting(false)
            return
          }
        }
      }}>
      {game_state.level.combat_victory &&
        <Modal show_modal={game_state.level.combat_victory} permanent={true}>
          <Victory game_state={game_state} setGameState={setGameState} reward={victory_reward}
            resetCombat={resetCombat} selections={victory_selections} setSelections={setVictorySelections}
          />
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
          <img alt="player character" src="warrior-idle.gif" style={{height: "350px"}}/>
          <table className="w-60 m-4 p-4">
            <tbody>
              <tr>
                <td><b>HP</b></td>
                <td>{character.hp} / {character.max_hp}</td>
              </tr>
              <tr>
                <td><b>Block</b></td>
                <td>{character.block}</td>
              </tr>
              {Object.keys(character.buffs).length > 0 &&
                <>
                <tr colSpan="2"><td className="center_text"><b>Buffs</b></td></tr>
                {Object.keys(character.buffs).map((buff_name) => {
                  return (
                    <tr key={buff_name}>
                      <td><b>{buff_name}</b></td>
                      <td>{character.buffs[buff_name]}</td>
                    </tr>
                  )
                })}
                </>
              }
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
            playable={!game_state.defeat} game_state={game_state} setGameState={setGameState}
            setTargetting={setTargetting} setSelectedCard={setSelectedCard} hand={hand}
            graveyard={graveyard} setHand={setHand} setGraveyard={setGraveyard} setMessage={setMessage}
          />)}
        </div>

      </div>
    </div>
  )
}

export default Combat
