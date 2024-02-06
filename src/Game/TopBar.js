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
    if(game_state.character.stat_increases){
      if(game_state.character.stat_increases[stat_name]){
        stat_map[stat_name].increased = true
        stat_map[stat_name].increased_value += game_state.character.stat_increases[stat_name]
        stat_map[stat_name].value += game_state.character.stat_increases[stat_name]
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

  return <div className="gap-4 m-2 p-4 flex center_all_items w-98 mb-0 top_bar">
    {game_state.character &&
      <>
      <img src={game_state.character.icon}  className="mb-0 mt-0 block" style={{height: "35px"}}/>
      <h3 className="mb-0 mt-0">{game_state.character.name}</h3>
      <p className="mb-0 mt-0">{game_state.character.sub_name}</p>
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
      <button onClick={(e) => toggleDeckModal(game_state.character.deck)}>Open Deck</button>
      <button onClick={(e) => toggleItemModal()}>Open Items</button>
      <h3 className="center_text m-0">Level: {game_state.level.number}</h3>
      <h3 className="center_text m-0">Score: {game_state.score}</h3>
      </>
    }
  </div>
}

export default TopBar
