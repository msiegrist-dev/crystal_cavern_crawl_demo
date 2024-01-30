import {useState} from 'react'
import warrior from "../data/warrior.js"
import warrior_deck from "../data/warrior_deck"
import Level0 from "./Level0"
import Level from "./Level"
import TopBar from "./TopBar"
import Modal from "../Modal"
import Card from "./Card"
import Item from "./Item"

import {copyState} from "./lib/helper_lib"

const Game = ({setPage, setGameState, game_state, setBackground}) => {


  const [show_modal, setShowModal] = useState("")
  const [modal_mode, setModalMode] = useState("")
  const [modal_deck, setModalDeck] = useState([])

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

      {!game_state.character &&
        <div className="m-16 p-8 h-vh-50">
          <h1 className="center_text m-4 p-4">Select a character</h1>
          <div className="grid three_col_equal w-60 m-4 p-4 gap-4">
            <div className="hov_pointer" onClick={(e) => setCharacter("warrior")}>
              <img src={warrior.idle} className="m-4 p-4 block"
                style={{width: "300px", height: "auto"}}
              />
              <h2 className="action_text center_text">Warrior</h2>
              <p>
                A stout melee fighter capable of enhancing his defenses.
              </p>
            </div>
          </div>
        </div>
      }

      {game_state.character &&
        <TopBar game_state={game_state} toggleDeckModal={toggleDeckModal} toggleItemModal={toggleItemModal}/>
      }

      <Modal show_modal={show_modal} setShowModal={setShowModal}>
        {modal_mode === "deck" &&
          <div className="grid eq_four_col">
            {modal_deck.map((card) => <Card key={card.key} card={card} game_state={game_state} playable={false}/>)}
          </div>
        }
        {modal_mode === "items" &&
          <div className="grid eq_four_col">
            {game_state.character.inventory.map((item, i) => {
              return <Item key={i} item={item} />
            })}
          </div>
        }
      </Modal>

      {game_state.character && game_state.level.number === 0 &&
        <Level0 game_state={game_state} setGameState={setGameState} setBackground={setBackground} />
      }
      {game_state.character && game_state.level.number >= 1 &&
        <Level game_state={game_state} setGameState={setGameState} toggleDeckModal={toggleDeckModal} setBackground={setBackground}/>
      }
    </>
  )
}

export default Game
