import {useState} from 'react'
import warrior from "../data/warrior.js"
import warrior_deck from "../data/warrior_deck"
import Level0 from "./Level0"
import Level from "./Level"
import TopBar from "./TopBar"
import Modal from "../Modal"
import Card from "./Card"
import Inventory from "./Inventory"
import End from "./End"

import {copyState} from "./lib/helper_lib"
import {giveCharacterItem} from "./lib/items"

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
        speed: warrior.speed,
        attack: warrior.attack,
        defense: warrior.defend,
        max_hp: warrior.max_hp,
        hp: warrior.hp,
        armor: warrior.armor
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
    const starting_items = game_state_copy.character.inventory
    game_state_copy.character.inventory = []
    starting_items.forEach((it) => {
      const given = giveCharacterItem(game_state_copy, it)
      game_state_copy.character = given.character
    })
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

  const end_condition = game_state.level?.number === 11 ? true : false


  return (
    <>

      {!game_state.character &&
        <div className="m-16 p-8 h-vh-50">
          <h1 className="center_text m-8 p-4">Select a character</h1>
          <div className="grid three_col_equal w-60 m-8 p-4 gap-4">
            <div className="hov_pointer" onClick={(e) => setCharacter("warrior")}>
              <img src={warrior.idle} className="m-4 p-4 block" alt="Warrior"
                style={{width: "200px", height: "auto"}}
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
          <div className="grid eq_four_col overflow-y-scroll">
            {modal_deck.map((card) => <Card key={card.key} card={card} game_state={game_state} playable={false}/>)}
          </div>
        }
        {modal_mode === "items" &&
          <Inventory inventory={game_state.character?.inventory} />
        }
      </Modal>

      {game_state.character && game_state.level.number === 0 && !end_condition &&
        <Level0 game_state={game_state} setGameState={setGameState} setBackground={setBackground} />
      }
      {game_state.character && game_state.level.number >= 1 && !end_condition &&
        <Level game_state={game_state} setGameState={setGameState} toggleDeckModal={toggleDeckModal} setBackground={setBackground}/>
      }
      {end_condition &&
        <End game_state={game_state} setGameState={setGameState} setPage={setPage}/>
      }
    </>
  )
}

export default Game
