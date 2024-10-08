import environment from "../data/environment"
import {displayArmorAsPct, capitalizeFirst} from "./lib/helper_lib"

const TopBar = ({game_state, toggleDeckModal, toggleItemModal}) => {

  const stat_map = {}
  for(let stat_name of environment.ALL_STATS){
    stat_map[stat_name] = {
      value: game_state.character[stat_name],
      increased: false,
      increased_value: 0
    }
    if(game_state.character.flat_stat_increases){
      if(game_state.character.flat_stat_increases[stat_name]){
        stat_map[stat_name].increased = true
        stat_map[stat_name].increased_value += game_state.character.flat_stat_increases[stat_name]
        stat_map[stat_name].value += game_state.character.flat_stat_increases[stat_name]
      }
    }
  }

  const base_stat_style = {color: "#FFFFFF"}
  const enhanced_stat_style = {color: "#9ED2EA"}

  const StatRow = ({stat_name}) => {
    const style = stat_map[stat_name].increased ? enhanced_stat_style : base_stat_style
    const value = stat_name === "armor" ? displayArmorAsPct({armor: stat_map[stat_name].value}) : stat_map[stat_name].value
    return <tr>
      <td style={style}><b>{capitalizeFirst(stat_name)}</b></td>
      <td style={style}>{value}</td>
    </tr>
  }

  return (
    <div className="gap-8 m-2 p-4 flex center_all_items w-98 mb-0 h-35px dark_opaque_bg">
      {game_state.character &&
        <>
        <img src={game_state.character.icon}  className="mb-0 mt-0 block" style={{height: "35px"}} alt="Warrior"/>
        <h3 className="mb-0 mt-0">{game_state.character.name}</h3>
        <p className="mt-0 mb-0"><b>HP</b> : {game_state.character.hp} / {game_state.character.max_hp}</p>
        <table>
          <tbody>
            <tr>
              <StatRow stat_name="attack" />
            </tr>
            <tr>
              <StatRow stat_name="defense" />
            </tr>
          </tbody>
        </table>
        <table>
          <tbody>
            <tr>
              <StatRow stat_name="armor" />
            </tr>
            <tr>
              <StatRow stat_name="speed" />
            </tr>
          </tbody>
        </table>
        <div className="grid two_col_60_40 gap-2">
          <img alt="red gems" src="gem_red.png" style={{width: "35px", height: "35px"}} className="m-4 block" />
          <p>x{game_state.character.gems.red}</p>
        </div>
        <div className="grid two_col_60_40 gap-2">
          <img alt="blue gems" src="gem_blue.png" style={{width: "35px", height: "35px"}} className="m-4 block" />
          <p>x{game_state.character.gems.blue}</p>
        </div>
        <button className="yellow_action_button w-100px" onClick={(e) => toggleDeckModal(game_state.character.deck)}>Deck</button>
        <button className="yellow_action_button w-100px" onClick={(e) => toggleItemModal()}>Items</button>
        <h3 className="center_text m-0">Level: {game_state.level.number}</h3>
        <h3 className="center_text m-0">Score: {game_state.score}</h3>
        </>
      }
    </div>
  )
}

export default TopBar
