import warrior from "../data/warrior.js"
import warrior_deck from "../data/warrior_deck"
import Floor0 from "./Floor0"
import Floor from "./Floor"
import {copyState} from "./lib"
export default ({setPage, setGameState, game_state}) => {

  console.log('in game game_state', game_state)

  const starting_char_map = {
    "warrior": {
      ...warrior,
      deck: warrior.starting_deck.map((name, i) => {
        const this_card = warrior_deck.find((card) => card.name === name)
        return {
          ...this_card,
          key: i
        }
      }),
      key: "player"
    }
  }

  const setCharacter = character => {
    let game_state_copy = copyState(game_state)
    game_state_copy.character = starting_char_map[character]
    setGameState(game_state_copy)
  }

  return (
    <>

      {!game_state.character &&
        <>
          <h3>Select a character</h3>
          <button onClick={(e) => setCharacter("warrior")}>Warrior</button>
        </>
      }
      {game_state.character && game_state.floor.number === 0 &&
        <Floor0 game_state={game_state} setGameState={setGameState} />
      }
      {game_state.character && game_state.floor.number >= 1 &&
        <Floor game_state={game_state} setGameState={setGameState}/>
      }
    </>
  )
}
