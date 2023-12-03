import {useState} from 'react'
import Combat from "./Combat"
import Modal from "../Modal"
import Card from "./Card"
import {displayArmorAsPct} from "./helper_lib"

export default ({game_state, setGameState, setMessage}) => {

  const [show_modal, setShowModal] = useState("")
  const [modal_mode, setModalMode] = useState("")
  const [modal_deck, setModalDeck] = useState([])

  const {character, level} = game_state

  const toggleDeckModal = deck => {
    if(show_modal){
      setShowModal(false)
      return
    }
    setModalMode("deck")
    setModalDeck(deck)
    setShowModal(true)
  }

  const toggleItemModal = () => {
    if(show_modal){
      setShowModal(false)
      return
    }
    setModalMode("items")
    setShowModal(true)
  }

  return (
    <div>
      <Modal show_modal={show_modal} setShowModal={setShowModal}>
        {modal_mode === "deck" &&
          <div className="grid eq_four_col">
            {modal_deck.map((card) => <Card key={card.key} card={card} />)}
          </div>
        }
        {modal_mode === "items" &&
          <div className="grid eq_four_col">
            {character.inventory.map((item) => {
              return (
                <div className="grid center_all_items">
                  <h3>{item.name} - {item.rarity}</h3>
                  <h4>{item.effect}</h4>
                  <p>{item.stat_name} - {item.value}</p>
                </div>
              )
            })}
          </div>
        }
      </Modal>
      <div className="gap-4 m-4 p-4" style={{display: "flex", borderBottom: "1px solid blue", height: "35px"}}>
        <h3>{character.name}</h3>
        <p>{character.sub_name}</p>
        <table>
          <tbody>
            <tr>
              <td><b>Attack</b></td>
              <td>{character.attack}</td>
            </tr>
            <tr>
              <td><b>Defense</b></td>
              <td>{character.defense}</td>
            </tr>
          </tbody>
        </table>
        <table>
          <tbody>
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
        <div className="grid two_col_60_40">
          <img src="gem_red.png" style={{width: "35px", height: "35px"}} className="m-4 block" />
          <p>x{character.gems.red}</p>
        </div>
        <div className="grid two_col_60_40">
          <img src="gem_blue.png" style={{width: "35px", height: "35px"}} className="m-4 block" />
          <p>x{character.gems.blue}</p>
        </div>
        <button onClick={(e) => toggleDeckModal(character.deck)}>Open Deck</button>
        <button onClick={(e) => toggleItemModal()}>Open Items</button>
      </div>
      <h3 className="center_text m-0">level {level.number}</h3>

      {level.type === "combat" &&
        <Combat game_state={game_state} setGameState={setGameState} toggleDeckModal={toggleDeckModal} setMessage={setMessage}/>
      }
    </div>
  )
}
