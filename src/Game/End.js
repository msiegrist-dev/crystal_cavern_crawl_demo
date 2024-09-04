import default_game_state from "../data/default_game_state"

import Modal from "../Modal"
const End = ({game_state, setGameState, setPage}) => {

  return <div>
      <Modal show_modal={true} permanent={true}>
        <h2 className="center_text">Game Over</h2>
        <h4 className="center_text">Level Reached : {game_state.level.number}</h4>
        <h4 className="center_text">Score : {game_state.score}</h4>
        <p className="center_text">
          This demo ends at level 10.
        </p>
        <button className="w-100px yellow_action_button m-12 block"
          onClick={(e) => {
            setGameState(default_game_state)
            setPage("main_menu")
          }}
        >
          Return
        </button>
      </Modal>
    </div>
}

export default End
