import {useState} from 'react'
import Combat from "./Combat"
import Modal from "../Modal"
import Card from "./Card"
import {displayArmorAsPct} from "./lib"

export default ({game_state, setGameState}) => {

  const [show_modal, setShowModal] = useState("")
  const [modal_mode, setModalMode] = useState("")
  const [modal_deck, setModalDeck] = useState([])

  const {character, floor} = game_state

  const toggleDeckModal = deck => {
    if(show_modal){
      setShowModal(false)
      return
    }
    setModalMode("deck")
    setModalDeck(deck)
    setShowModal(true)
  }
  return (
    <div>
      <Modal show_modal={show_modal} setShowModal={setShowModal}>
        {modal_mode === "deck" &&
          <div className="grid eq_four_col">
            {modal_deck.map((card) => <Card card={card} />)}
          </div>
        }
      </Modal>
      <h3 className="center_text m-4">Floor {floor.number}</h3>
      <div className="grid m-4 p-4 three_col_equal">
        <div className="w-40 p-4" style={{margin: "0 auto 0 0"}}>
          <h3 className="m-0">{character.name}</h3>
          <h4 className="m-0">{character.sub_name}</h4>
          <table>
            <tbody>
              <tr>
                <td><b>HP</b></td>
                <td>{character.hp}</td>
              </tr>
              {floor.type ==="combat" &&
                <>
                <td><b>Block</b></td>
                <td>{character.block}</td>
                </>
              }
              <tr>
                <td><b>Attack</b></td>
                <td>{character.attack}</td>
              </tr>
              <tr>
                <td><b>Defense</b></td>
                <td>{character.defense}</td>
              </tr>
              <tr>
                <td><b>Armor</b></td>
                <td>{displayArmorAsPct(character)}</td>
              </tr>
              <tr>
                <td><b>Speed</b></td>
                <td>{character.speed}</td>
              </tr>
            </tbody>
          </table>
          <h4 className="m-0">Gems</h4>
          <div className="grid two_col_equal m-0 p-4">
            <div className="grid two_col_60_40">
              <img src="gem_red.png" style={{width: "35px", height: "35px"}} className="m-4 block" />
              <p>x{character.gems.red}</p>
            </div>
            <div className="grid two_col_60_40">
              <img src="gem_blue.png" style={{width: "35px", height: "35px"}} className="m-4 block" />
              <p>x{character.gems.blue}</p>
            </div>
          </div>
          <h4>Deck</h4>
          <button onClick={(e) => toggleDeckModal(character.deck)}>Open</button>
          </div>
          {floor.type === "combat" &&
            <Combat game_state={game_state} setGameState={setGameState} toggleDeckModal={toggleDeckModal}/>
          }

      </div>
    </div>
  )
}
