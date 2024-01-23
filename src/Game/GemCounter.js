import {copyState} from "./lib/helper_lib"
const GemCounter = ({game_state, setGameState, color, gem_state, setGemState}) => {

  const remove = () => {
    if(gem_state[color] <= 0){
      return
    }
    const gem_copy = copyState(gem_state)
    gem_copy[color] = gem_copy[color] - 1
    setGemState(gem_copy)
    const copy = copyState(game_state)
    copy.character.gems[color] = copy.character.gems[color] + 1
    setGameState(copy)
  }

  const add = () => {
    if(game_state.character.gems[color] <= 0){
      return
    }
    const gem_copy = copyState(gem_state)
    gem_copy[color] = gem_copy[color] + 1
    setGemState(gem_copy)
    const copy = copyState(game_state)
    copy.character.gems[color] = copy.character.gems[color] - 1
    setGameState(copy)
  }

  return (
    <div>
      <h4 className="center_text">{color}</h4>
      <div className="grid three_col_equal center_all_items">
        <img src="minus_icon.png" onClick={(e) => remove()} />
        {gem_state[color]}
        <img src="plus_icon.png" onClick={(e) => add()} />
      </div>
    </div>
  )
}

export default GemCounter
