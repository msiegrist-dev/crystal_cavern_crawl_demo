const CombatBar = ({openCombatModal, turn_order, game_state, turn, combat_log, turn_number, message}) => {

  const filterDeadEnemyTurns = turn_order => {
    return turn_order.filter((turn) => {
      if(turn.key === "player"){
        return true
      }
      const enemy = game_state.level.enemies.find((en) => en.key === turn.key)
      if(enemy.hp <= 0){
        return false
      }
      return true
    })
  }

  return <div className="flex center_all_items gap-8 w-98 m-2 p-12 dark_opaque_bg">
    <button className="yellow_action_button w-100px"
      onClick={(e) => openCombatModal("combat_log")}
    >
      Combat Log
    </button>
    <div className="m-4 flex gap-4 center_all_items">
      <h3 className="m-4">Turn {turn_number} : </h3>
      {filterDeadEnemyTurns(turn_order).map((list_turn, index) => {
        const style = {border: "none"}
        if(turn.key === list_turn.key){
          style.border = "2px solid #85B5E5"
        }
        if(list_turn.key === "player"){
          return <p className="m-2 p-2" style={style}>{index + 1} : Player</p>
        }
        const enemy = game_state.level.enemies.find((en) => en.key === list_turn.key)
        return <p className="p-2 m-2" style={style}>{index + 1} : {enemy.name}</p>
      })}
    </div>
    <h3 className="center_text m-0">It is {turn.key === "player" ? "Your Turn" : "Enemy Turn"}. {message}</h3>
    <h3 id="combat_log_display" className="center_text m-4 p-2">
      {combat_log[combat_log.length - 1]}</h3>
  </div>
}

export default CombatBar
