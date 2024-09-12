import {useState} from 'react'
import {getRarityTextColor, formatStatName, formatBuffName, capitalizeFirst} from "./lib/helper_lib"
import Item from "./Item"

const Inventory = ({inventory}) => {

  const [display_item, setDisplayItem] = useState()

  const render = inventory && inventory.length > 0

  return <div className="w-95 m-4 p-4 grid two_col_60_40" style={{height: "85%"}}>
    <div className="w-100 m-4 p-4 grid gap-4 overflow-y-scroll four_col_equal">
      {render && inventory.map((item, i) => {
        return <Item key={i} item={item} setDisplayItem={setDisplayItem}/>
      })}
    </div>
    <div className="w-100 m-4 p-4 grid center_all">
      {display_item &&
        <div className="center_text" style={{height: "80%"}}>
          <img src={display_item.image} className="m-4 block"
            style={{height: "100px", width: "auto"}}
          />
        <h2 className=" mb-0">{display_item.name}</h2>
          <h3 className=" mb-0 mt-0" style={{color: getRarityTextColor(display_item.rarity)}}>
            {capitalizeFirst(display_item.rarity)}
          </h3>
          <p className="p-4 mt-0 mb-0"><i>{display_item.description}</i></p>
          {display_item.increase_stats &&
            <>
            {display_item.increase_stats.map((stat) => {
              let display_value = stat.value
              if(stat.name === "armor") display_value = (display_value * 100) + "%"
              return <p key={stat.name} className="mt-0 mb-0">Increases {formatStatName(stat.name)} by {display_value}.</p>
            })}
            </>
          }
          {display_item.decrease_stats &&
            <>
            {display_item.decrease_stats.map((stat) => {
              let value = stat.value
              if(stat.name === "armor") value = (value * 100) + "%"
              return <p key={stat.name} className="mt-0 mb-0">Decreases {formatStatName(stat.name)} by {value}.</p>
            })}
            </>
          }
          {display_item.starting_buffs &&
            <>
            {display_item.starting_buffs.map((buff) => {
              return <p key={buff.name} className="mt-0 mb-0">Grants {buff.value} {formatBuffName(buff.name)} at the start of your first turn.</p>
            })}
            </>
          }
          {display_item.custom_effect &&
            <p className="mt-0 mb-0">{display_item.custom_effect}</p>
          }
        </div>
      }
    </div>
  </div>
}

export default Inventory
