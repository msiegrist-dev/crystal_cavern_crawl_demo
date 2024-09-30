//late game event where you give the Seer 5 cards and receive the Seer's Crystal Ball item
//can only be given in levels 15+ and is very rare
import {useState} from 'react'
import {getIndexOfArrayItemByKey, removeItemFromArrayByKey, copyState} from "../lib/helper_lib"
import {giveCharacterItem} from "../lib/items"
import {removeCardFromDeck} from "../lib/cards"
import items from "../../data/items"
import Modal from "../../Modal"
import Card from "../Card"
import GemCounter from "../GemCounter"
import environment from "../../data/environment"


const SeersSacrifice = ({REQUIRED_EVENT_PROPS}) => {

  const {satisfied, setSatisfied, game_state, setGameState, setMessage} = REQUIRED_EVENT_PROPS

  const [selected_cards, setSelectedCards] = useState([])
  const [selected_gems, setSelectedGems] = useState({red: 0, blue: 0})

  const [modal_open, setModalOpen] = useState(false)
  const [modal_mode, setModalMode] = useState("")
  const openSelectModal = mode => {
    setModalMode(mode)
    setModalOpen(true)
  }

  const toggleEntitySelected = (entity, type) => {
    const array = type === "card" ? selected_cards : selected_gems
    const setter = type === "card" ? setSelectedCards : setSelectedGems

    const index = getIndexOfArrayItemByKey(array, entity.key)
    if(index < 0){
      return setter(array.concat([entity]))
    }
    setter(removeItemFromArrayByKey(array, entity.key))
  }

  const processTrade = () => {
    if(satisfied){
      return setMessage("Event has already been satisfied.")
    }
    if(selected_cards.length !== 4){
      return setMessage("Please select 4 cards.")
    }
    const gem_total = selected_gems.red + selected_gems.blue
    if(gem_total !== 4){
      return setMessage("Please select 4 gems.")
    }
    let copy = copyState(game_state)
    for(let card of selected_cards){
      copy = removeCardFromDeck(copy, card)
    }
    copy.character = giveCharacterItem(copy.character, items.find((it) => it.name === "Seer's Crystal Ball"))
    setGameState(copy)
    setSatisfied(true)
    setMessage("May this gift guide your path " + game_state.character.name)
  }

  return <div>
    <h3 className="center_text">Seer's Sacrifice</h3>
    <p>
      "I am surprised you've made it thus far. Share your knowledge with me, and mine will be returned."
    </p>
    <p>
      The mysterious seer is asking for four cards and four gems in exchange for a powerful item.
      Will you help him light your path?
    </p>
    {!satisfied &&
      <>
      <h2 className="center_text action_text" onClick={(e) => openSelectModal("card")}>Select Cards</h2>
      {selected_cards.length > 0 &&
        <div>
          <h2 className="center_text m-2 p-2">Chosen Cards</h2>
          <div className="grid w-80 four_col_equal gap-4 p-2 m-2">
            {selected_cards.map((card) => <h4 className="center_text">{card.name}</h4>)}
          </div>
        </div>
      }
      <div className="grid two_col_equal m-4 p-4">
        <GemCounter game_state={game_state} setGameState={setGameState}
          color="red" gem_state={selected_gems} setGemState={setSelectedGems}
          maximum={4}
          />
        <GemCounter game_state={game_state} setGameState={setGameState}
          color="blue" gem_state={selected_gems} setGemState={setSelectedGems}
          maximum={4}
          />
      </div>
      <h3 className="center_text action_text" onClick={(e) => processTrade()}>Accept</h3>
        <h3 className="center_text action_text" onClick={(e) => {
            setSatisfied(true)
            const copy = copyState(game_state)
            copy.character.gems.red += selected_gems.red
            copy.character.gems.blue += selected_gems.blue
            setGameState(copy)
          }}>Reject</h3>
      </>
    }
    <Modal show_modal={modal_open} setShowModal={setModalOpen}>
      <div className="grid four_col_equal gap-4 p-4 m-4">
        {modal_mode === "card" &&
          <>
          {game_state.character.deck.map((card) => {
            const selected = getIndexOfArrayItemByKey(selected_cards, card.key)
            const bg_color = selected >= 0 ? environment.SELECTED_COLOR : environment.INACTIVE_COLOR
            return <div className="hov_pointer" style={{backgroundColor: bg_color}}
              onClick={(e) => toggleEntitySelected(card, "card")}
              >
              <Card card={card} playable={false} big_card={false}
                game_state={game_state}
              />
            </div>
          })}
          </>
        }
      </div>
    </Modal>
  </div>
}

export default SeersSacrifice
