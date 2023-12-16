import warrior from "../data/warrior.js"
import warrior_deck from "../data/warrior_deck"
import Level0 from "./Level0"
import Level from "./Level"
import {copyState} from "./lib/helper_lib"
const Game = ({setPage, setGameState, game_state}) => {

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
      key: "player",
      base_stats: {
        speed: 4,
        attack: 2,
        defense: 2,
        max_hp: 120,
        hp: 120,
        armor: .15
      },
      flat_stat_increases: {
        speed: 0,
        attack: 0,
        defense: 0,
        max_hp: 0,
        hp: 0,
        armor: 0
      }
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
      {game_state.character && game_state.level.number === 0 &&
        <Level0 game_state={game_state} setGameState={setGameState} />
      }
      {game_state.character && game_state.level.number >= 1 &&
        <Level game_state={game_state} setGameState={setGameState}/>
      }
    </>
  )
}

export default Game
