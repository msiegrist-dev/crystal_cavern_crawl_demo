const Item = ({item}) => {

  return (
    <div className="grid center_all_items">
      <img className="w-125px m-4 block" src="sword_icon.jpg" />
      <h3 className="mt-0 mb-0">{item.name}</h3>
      <h4 className="mt-0 mb-0">{item.rarity}</h4>
      {item.increase_stats.map((stat) => {
        return <p className="mt-0 mb-0">{stat.name} +{stat.value}</p>
      })}
    </div>
  )
}

export default Item
