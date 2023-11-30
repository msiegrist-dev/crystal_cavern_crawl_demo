import {copyState} from "./helper_lib"
import {goNextLevel} from "./lib"
const Victory = ({game_state, setGameState, reward}) => {
  console.log("REWARD", reward)
  return (
    <>
    <h2 className="center_text">Combat Victory</h2>
    <table>
      <tbody>
        <tr>
          <td><b>Damage Taken</b></td>
          <td><b>Damage Done</b></td>
          <td><b>Enemies Slain</b></td>
        </tr>
      </tbody>
    </table>
    <h2 className='center_text'>Select a Reward</h2>
    <div className="grid three_col_equal">
      <div>
        <h3 className="center_text">Gem</h3>
        <p>randomly generate random gem or +x of gem y</p>
      </div>
      <div>
        <h3 className="center_text">Card</h3>
        <p>select from [2, 3, 4]</p>
        <p>get random card</p>
        <p>remove card, trade cards</p>
      </div>
      <div>
        <h3 className="center_text">Stat</h3>
        <p>get random stat, choose from [2, 3, 4] random stats, </p>
        <p>stat for card/gem</p>
      </div>
    </div>
    <button onClick={(e) => setGameState(goNextLevel(copyState(game_state)))}>
      Continue
    </button>
    </>
  )
}

export default Victory
