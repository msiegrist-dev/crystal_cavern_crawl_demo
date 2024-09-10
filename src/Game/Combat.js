import {useState, useEffect} from 'react'

import default_game_state from "../data/default_game_state"
import environment from "../data/environment"

import {getIndexOfArrayItemByKey, copyState, shuffleKeyedArray, getRandomNumber} from "./lib/helper_lib"
import {
  getTurnOrder, getEnemyAction, processAction, drawCards, playCard,
  sendCardsToGraveYard, giveCombatantCondition, reduceBlockCombatStart
} from "./lib/combat"
import {getTradeSelections, determineVictoryReward} from "./lib/combat_rewards"
import {goNextLevel} from "./lib/levels"
import {getRandomCards} from "./lib/cards"
import {getRandomItems} from "./lib/items"
import {getRandomStatName, getRandomStatValue} from "./lib/stats"


import Card from "./Card"
import Enemy from "./Enemy"
import Modal from "../Modal"
import Victory from "./Victory"
import Healthbar from "./Healthbar"
import CombatStatsTable from "./CombatStatsTable"
import Buffs from "./Buffs"
import CombatBar from "./CombatBar"

const Combat = ({game_state, setGameState, toggleDeckModal, setBackground}) => {

  const [message, setMessage] = useState("")
  const [turn_order, setTurnOrder] = useState(getTurnOrder(game_state))
  const [turn, setTurn] = useState(turn_order[0])
  const [turn_number, setTurnNumber] = useState(1)
  const [draw_pile, setDrawPile] = useState(shuffleKeyedArray(game_state.character.deck))
  const [hand, setHand] = useState([])
  const [graveyard, setGraveyard] = useState([])
  const [targetting, setTargetting] = useState(false)
  const [selected_card, setSelectedCard] = useState(null)
  const [combat_ended, setCombatEnded] = useState(false)
  const [victory_reward, setVictoryReward] = useState("")
  const [victory_selections, setVictorySelections] = useState([])
  const [combat_log, setCombatLog] = useState([])
  const [combat_modal_open, setCombatModalOpen] = useState(false)
  const [combat_modal_mode, setCombatModalMode] = useState("")
  const [combat_stats, setCombatStats] = useState({
    enemies_killed: 0,
    damage_taken: 0,
    damage_dealt: 0
  })

  const [show_player_attack_animation, setShowPlayerAttackAnimation] = useState(false)
  const showPlayerAttackAnimation = () => {
    setShowPlayerAttackAnimation(true)
    setTimeout(() => setShowPlayerAttackAnimation(false), 1000)
  }

  const openCombatModal = mode => {
    setCombatModalMode(mode)
    setCombatModalOpen(true)
  }

  const player_turn = turn.key === "player"

  const calculateCombatScore = stats_copy => {
    return (stats_copy.enemies_killed * 50) + combat_stats.damage_dealt - combat_stats.damage_taken
  }

  const resetCombat = game_state => {
    setHand([])
    setDrawPile(shuffleKeyedArray(game_state.character.deck))
    setGraveyard([])
    setCombatLog([])
    let copy = copyState(game_state)
    copy.character.buffs = {}
    copy.character.stat_increases = {}
    const next_level = goNextLevel(copy)
    const is_combat = next_level.level.type === "combat"
    setTurnOrder(is_combat ? getTurnOrder(next_level) : [])
    setTurnNumber(1)
    setTurn(is_combat ? getTurnOrder(next_level)[0] : {})
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
      setTurnOrder(getTurnOrder(game_state))
      setTurnNumber(turn_number + 1)
      return setTurn(turn_order[0])
    }
    return setTurn(turn_order[current_index + 1])
  }

  const targettingHandler = target_key => {
    if(!selected_card || !targetting || combat_ended){
      return
    }
    const processed = playCard(
      selected_card, game_state, [target_key], hand, graveyard, combat_log, setCombatLog,
      combat_stats, setCombatStats, setMessage, draw_pile, showPlayerAttackAnimation
    )
    if(processed.error){
      return setMessage(processed.error)
    }
    setGameState(processed.game_state)
    setHand(processed.card_state.hand)
    setDrawPile(processed.card_state.draw_pile)
    setGraveyard(processed.card_state.graveyard)
    setTargetting(false)
    setSelectedCard(null)
  }

  const handleCombatSpaceOnClick = e => {
    if(!targetting){
      return
    }
    if(targetting){
      if(!e.target.className.includes("enemy_img")){
        setTargetting(false)
        return
      }
    }
  }

  //handles enemy turn and inits player turn when turn is changed
  useEffect(() => {

    const initPlayerTurn = () => {
      if(combat_ended){
        return
      }
      console.log("IT IS PLAYER TURN")
      let game_state_copy = copyState(game_state)
      game_state_copy.character.stat_increases = {}
      if(game_state_copy.character.buffs){
        for(let buff_name of Object.keys(game_state_copy.character.buffs)){
          if(game_state_copy.character.buffs[buff_name] < 1){
            continue
          }
          game_state_copy.character.buffs[buff_name] -= 1
        }
      }
      game_state_copy.character.block = reduceBlockCombatStart(game_state_copy.character.block)
      if(turn_number === 1){
        for(let item of game_state_copy.character.inventory){
          if(Object.keys(item).includes("starting_buffs")){
            for(let buff of item.starting_buffs){
              game_state_copy.character = giveCombatantCondition("buff", game_state_copy.character, buff.name, buff.value)
            }
          }
        }
      }
      setGameState(game_state_copy)
      const {card_draw, starting_draw} = game_state_copy.character
      const use_draw = turn_number === 1 ? starting_draw : card_draw
      const draw = drawCards(draw_pile, graveyard, hand, use_draw)
      setGraveyard(draw.graveyard)
      setDrawPile(draw.draw_pile)
      setHand(draw.hand)
    }

    const enemyTurn = () => {
      if(combat_ended){
        return
      }
      console.log("IT IS ENEMIES TURN")
      let enemy = game_state.level.enemies.find((ene) => ene.key === turn.key)
      if(enemy.hp <= 0){
        return goNextTurn()
      }
      const enemy_index = game_state.level.enemies.findIndex((ene) => ene.key === turn.key)
      let copy = JSON.parse(JSON.stringify(game_state))
      copy.level.enemies[enemy_index].block = reduceBlockCombatStart(copy.level.enemies[enemy_index].block)
      enemy = copy.level.enemies.find((ene) => ene.key === turn.key)
      const action = getEnemyAction(copy, enemy)
      const processed = processAction(copy, enemy, ["player"], action, combat_log, setCombatLog, combat_stats, setCombatStats, {draw_pile, hand, graveyard})
      setGameState(processed.game_state)
      if(processed.card_state){
        setHand(processed.card_state.hand)
        setDrawPile(processed.card_state.draw_pile)
        setGraveyard(processed.card_state.graveyard)
      }
      setTimeout(() => goNextTurn(), 3000)
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
          return game_state.character.deck
        }
        if(type === "choice"){
          if(entity === "card"){
            return getRandomCards(3, game_state.character.name.toLowerCase())
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
            return getRandomCards(1, game_state.character.name.toLowerCase())
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
          return getTradeSelections(2, "random", entity, game_state.character)
        }
      }

      const game_state_copy = copyState(game_state)
      game_state_copy.level.combat_victory = true
      game_state_copy.character.block = 0
      game_state_copy.score += calculateCombatScore(combat_stats)
      const reward_text = determineVictoryReward(game_state_copy)
      const [type, entity] = reward_text.split("_")
      setVictoryReward(reward_text)
      setVictorySelections(getRewardChoices(type, entity))
      setGameState(game_state_copy)
      setHand([])
      setGraveyard([])
      setDrawPile(shuffleKeyedArray(game_state.character.deck))
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
      setCombatLog(combat_log.concat(`${game_state.character.name} has been defeated.`))
      setCombatEnded(true)
      return defeat()
    }
    const all_dead = game_state.level.enemies.filter((ene) => ene.hp <= 0).length === game_state.level.enemies.length
    if(all_dead){
      setCombatEnded(true)
      return combatVictory()
    }
  }, [game_state, combat_ended, setGameState])

  useEffect(() => {
    if(!document){
      return
    }
    const display = document.getElementById("combat_log_display")
    if(!display){
      return
    }
    display.classList.add("orange_bottom_border")
    display.classList.add("flipX")
    const removeAll = display => {
      display.classList.remove("flipX")
      display.classList.remove("orange_bottom_border")
    }
    setTimeout(() => removeAll(display), 1500)
  }, [combat_log])

  useEffect(() => {
    setBackground("combat_background.png")
  }, [setBackground])

  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const player_attack_effect_left = .24 * vw

  const getEnemiesToRender = enemies => {
    const getEnemyForPosition = position => {
      const pool = enemies.filter((e) => e.position == position)
      if(pool.length === 1) return pool[0]
      const alive = pool.find((e) => e.hp > 0)
      if(alive) return alive
      return pool[0]
    }

    let positions_to_fill = enemies.map((e) => e.position)
    positions_to_fill = positions_to_fill.filter((num, i) => positions_to_fill.indexOf(num) === i).sort()
    return positions_to_fill.map((position) => getEnemyForPosition(position))
  }

  return (
    <div className="w-98 m-4 p-4 pt-0 mt-0 h-top-bar-minus-remainder grid combat_parent_div"
      onClick={(e) => handleCombatSpaceOnClick(e)}
    >

      {combat_modal_open &&
        <Modal show_modal={combat_modal_open} setShowModal={setCombatModalOpen}>
          {combat_modal_mode === "combat_log" &&
            <div className="grid two_col_equal center_all_items">
              <div>
                <h4>Combat Log</h4>
                {combat_log.map((msg) => <p>{msg}</p>)}
              </div>
              <CombatStatsTable combat_stats={combat_stats} />
            </div>
          }
        </Modal>
      }
      {game_state.level.combat_victory &&
        <Modal show_modal={game_state.level.combat_victory} permanent={true}>
          <Victory game_state={game_state} setGameState={setGameState} reward={victory_reward}
            resetCombat={resetCombat} selections={victory_selections} setSelections={setVictorySelections}
            combat_stats={combat_stats}
          />
        </Modal>
      }
      {game_state.defeat &&
        <Modal show_modal={game_state.defeat} permanent={true}>
          <div className="grid w-80 m-4 center_all_items">
            <h2 className="center_text">You are defeated.</h2>
            <CombatStatsTable combat_stats={combat_stats} />
            <button onClick={(e) => setGameState(default_game_state)}>
              Return to Menu
            </button>
          </div>
        </Modal>
      }

      <CombatBar openCombatModal={openCombatModal} turn_order={turn_order} game_state={game_state}
        turn={turn} combat_log={combat_log} turn_number={turn_number} message={message}
      />


      {targetting && selected_card &&
        <h3 style={{color: "F0F2F2", position: "absolute", top: "90px", left: "42vw"}}>Please select a target for {selected_card.name}</h3>
      }


      <div className="grid w-vw-100 h-100" style={{gridTemplateColumns: "30% 1fr", alignItems: "end"}}>

        <div className="grid center_all_items">
          <img alt="player character" src={game_state.character.idle} style={{height: "250px"}} />
          <div className="grid two_col_equal w-80 m-4 p-4">
            <div className="span_two_col">
              <Healthbar max_hp={game_state.character.max_hp} current_hp={game_state.character.hp} block={game_state.character.block}/>
              <Buffs combatant={game_state.character} />
            </div>
          </div>
          {show_player_attack_animation &&
            <img src="slash_effect.gif" className="m-2" alt="Slash Effect"
              style={{
                position: "absolute",
                left: player_attack_effect_left,
                height: "200px"
              }}
            />
          }
        </div>

        <div className="flex gap-4" style={{justifyContent: "end"}}>
          {getEnemiesToRender(game_state.level.enemies).map((enemy) => <Enemy key={enemy.key} enemy={enemy} targettingHandler={targettingHandler} />)}
        </div>
      </div>



      <div className="grid w-vw-98 p-2" style={{gridTemplateColumns: "125px 1fr 125px"}}>
        <button className="yellow_action_button w-100px h-35px"
          onClick={(e) => toggleDeckModal(draw_pile)}
        >
          Draw Pile ({draw_pile.length})
        </button>

        <div className="w-100 m-0" style={{position: "relative"}}>
          {hand.map((card, i) => <Card key={card.key} card={card}
            playable={!game_state.defeat} game_state={game_state} setGameState={setGameState}
            setTargetting={setTargetting} setSelectedCard={setSelectedCard} hand={hand}
            graveyard={graveyard} setHand={setHand} setGraveyard={setGraveyard} setMessage={setMessage}
            combat_log={combat_log} setCombatLog={setCombatLog} combat_stats={combat_stats}
            setCombatStats={setCombatStats} in_combat_hand={true} index={i}
            draw_pile={draw_pile} setDrawPile={setDrawPile} showPlayerAttackAnimation={showPlayerAttackAnimation}
          />)}
        </div>

        <div className="grid gap-2" style={{height: "80px"}}>
          <button className="yellow_action_button w-100px h-35px"
            onClick={(e) => toggleDeckModal(graveyard)}
          >
            Graveyard ({graveyard.length})
          </button>
          {player_turn &&
            <button className="red_button w-100px h-35px" onClick={goNextTurn}>End Turn</button>
          }
        </div>

      </div>
    </div>
  )
}

export default Combat
