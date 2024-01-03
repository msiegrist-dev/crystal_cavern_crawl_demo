import {displayArmorAsPct} from "./lib/helper_lib"
const TopBar = ({game_state, toggleDeckModal, toggleItemModal}) => {

  return <div className="gap-4 m-4 p-4 flex center_all_items w-98 mb-0" style={{borderBottom: "1px solid blue", height: "35px"}}>
    {game_state.character &&
      <>
      <img src={game_state.character.icon}  className="mb-0 mt-0 block" style={{height: "35px"}}/>
      <h3 className="mb-0 mt-0">{game_state.character.name}</h3>
      <p className="mb-0 mt-0">{game_state.character.sub_name}</p>
      <p className="mt-0 mb-0"><b>HP</b> : {game_state.character.hp} / {game_state.character.max_hp}</p>
      <table>
        <tbody>
          <tr>
            <td><b>Attack</b></td>
            <td>{game_state.character.attack}</td>
          </tr>
          <tr>
            <td><b>Defense</b></td>
            <td>{game_state.character.defense}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <td><b>Armor</b></td>
            <td>{displayArmorAsPct(game_state.character)}</td>
          </tr>
          <tr>
            <td><b>Speed</b></td>
            <td>{game_state.character.speed}</td>
          </tr>
        </tbody>
      </table>
      <div className="grid two_col_60_40">
        <img alt="red gems" src="gem_red.png" style={{width: "35px", height: "35px"}} className="m-4 block" />
        <p>x{game_state.character.gems.red}</p>
      </div>
      <div className="grid two_col_60_40">
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
