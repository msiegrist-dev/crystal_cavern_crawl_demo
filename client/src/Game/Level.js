import {useState} from 'react'
import Combat from "./Combat"
import Modal from "../Modal"
import Card from "./Card"
import {displayArmorAsPct} from "./lib/helper_lib"

const Level = ({game_state, setGameState, setMessage}) => {

  const [show_modal, setShowModal] = useState("")
  const [modal_mode, setModalMode] = useState("")
  const [modal_deck, setModalDeck] = useState([])

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
    <>
      <Modal show_modal={show_modal} setShowModal={setShowModal}>
        {modal_mode === "deck" &&
          <div className="grid eq_four_col">
            {modal_deck.map((card) => <Card key={card.key} card={card} />)}
          </div>
        }
        {modal_mode === "items" &&
          <div className="grid eq_four_col">
            {game_state.character.inventory.map((item) => {
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
      <div className="gap-4 m-4 p-4 flex center_all_items w-98 mb-0" style={{borderBottom: "1px solid blue", height: "35px"}}>
        <img src="warrior_icon.png"  className="mb-0 mt-0 block" style={{height: "35px"}}/>
        <h3 className="mb-0 mt-0">{game_state.character.name}</h3>
        <p className="mb-0 mt-0">{game_state.character.sub_name}</p>
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
      </div>

      {game_state.level.type === "combat" &&
        <Combat game_state={game_state} setGameState={setGameState} toggleDeckModal={toggleDeckModal} setMessage={setMessage}/>
      }
    </>
  )
}

export default Level
