import {getRarityTextColor} from "./lib/helper_lib"

const Item = ({item, setDisplayItem}) => {
  const item_style = {
    height: "64px",
    width: "auto"
  }

  return (
    <div className="grid center_all_items hov_pointer"
      style={{maxWidth: "150px", height: "140px"}}
      onMouseOver={(e) => setDisplayItem(item)}
      onMouseOut={(e) => setDisplayItem(null)}
    >
      <img className="m-4 block" src={item.image || "sword_icon.png"}
        style={item_style} alt={item.name}
      />
    <h3 className="p-4 mt-0 mb-0 center_text" style={{color: getRarityTextColor(item.rarity)}}>{item.name}</h3>

    </div>
  )
}

export default Item
