const Healthbar = ({max_hp, current_hp, block}) => {
  const full_hp_pos = 100
  const zero_hp_pos = 280
  const increment = (zero_hp_pos - full_hp_pos) / 100

  const healthbar_position = zero_hp_pos - (((current_hp / max_hp) * 100) * increment)

  const health_bar_style = {
    backgroundImage: "url('just_red.png')",
    backgroundColor: "grey",
    backgroundRepeat: "no-repeat",
    backgroundPositionX: `${healthbar_position}%`,
    height: "20px",
    width: "250px"
  }

  const block_style = {
    backgroundImage: "url('block_icon.jpg')",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    color: "cyan",
    backgroundPositionX: "center",

  }

  return (
    <div className="grid m-2" style={{gridTemplateColumns: "85% 1fr", height: "35px", width: "300px"}}>
      <div className="center_text p-2" style={health_bar_style}><b>{current_hp} / {max_hp}</b></div>
      {block > 0 &&
        <div className="center_text" style={block_style}><p className="m-4"><b>{block}</b></p>
        </div>
      }
    </div>
  )
}

export default Healthbar
