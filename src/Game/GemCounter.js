import {copyState} from "./lib/helper_lib"
const GemCounter = ({game_state, setGameState, color, gem_state, setGemState, maximum, display_only}) => {

  const getGemsTotal = () => Number(gem_state["red"]) + Number(gem_state["blue"])

  const remove = () => {
    if(gem_state[color] <= 0) return

    const gem_copy = copyState(gem_state)
    gem_copy[color] = gem_copy[color] - 1
    setGemState(gem_copy)
    const copy = copyState(game_state)
    copy.character.gems[color] = copy.character.gems[color] + 1
    setGameState(copy)
  }

  const add = () => {
    if(game_state.character.gems[color] <= 0) return
    if((getGemsTotal() + 1) > maximum) return

    const gem_copy = copyState(gem_state)
    gem_copy[color] = gem_copy[color] + 1
    setGemState(gem_copy)
    const copy = copyState(game_state)
    copy.character.gems[color] = copy.character.gems[color] - 1
    setGameState(copy)
  }


  return (
    <div className='grid center_all_items center_all_content'>
      <img src={`${color}_gem.png`} style={{height: "50px", width: "auto"}}/>
      {!display_only &&
        <div className="grid three_col_equal center_all_items">>
          <img src="minus_icon.png" onClick={(e) => remove()} alt="Remove" />
          {gem_state[color]}
          <img src="plus_icon.png" onClick={(e) => add()} alt="Add" />
        </div>
      }
      {display_only &&
        <h3 className="center_text">{gem_state[color]}</h3>
      }
    </div>
  )
}

export default GemCounter
