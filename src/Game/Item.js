const Item = ({item}) => {

  const item_style = {
    height: "42px",
    width: "auto"
  }

  return (
    <div className="grid center_all_items">
      <img className="m-4 block" src={item.image || "sword_icon.png"}
        style={item_style} alt={item.name}
      />
      <h3 className="mt-0 mb-0">{item.name}</h3>
      <h4 className="mt-0 mb-0">{item.rarity}</h4>
      {item.increase_stats &&
        <>
        {item.increase_stats.map((stat) => {
          let display_value = stat.value
          if(stat.name === "armor") display_value = (display_value * 100) + "%"
          return <p key={stat.name} className="mt-0 mb-0">{stat.name} +{display_value}</p>
        })}
        </>
      }
      {item.decrease_stats &&
        <>
        {item.decrease_stats.map((stat) => {
          return <p key={stat.name} className="mt-0 mb-0">{stat.name} -{stat.value}</p>
        })}
        </>
      }
    </div>
  )
}

export default Item
