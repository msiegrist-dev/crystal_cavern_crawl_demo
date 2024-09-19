const Buffs = ({combatant}) => {

  const getBuffs = combatant => {
    if(!combatant.buffs){
      return []
    }
    if(!Object.keys(combatant.buffs).length){
      return []
    }
    const keys = Object.keys(combatant.buffs)
    return keys.filter((k) => combatant.buffs[k] > 0)
  }

  const buff_image_map = {
    thorns: "barbed.png",
    slowed: "ball_chain.png",
    fortify: "fortify.png",
    burned: "burn.png",
    fervor: "fervor.png"
  }

  const buff_descriptions = {
    thorns: "Returns 8 damage on attack if target is an enemy and 3 damage if you are the target.",
    slowed: "Speed is halved when calculating the turn order.",
    fortify: "Block values which can be increased have their final values increased by 33%.",
    burned: "Final attack value is reduced by 25%.",
    fervor: "Increases card attack value and base attack stat value by 25%.",
    flame_guard: "Attacker is given a turn of the 'burned' debuff.",
  }

  const buff_names = {
    thorns: "Thorns",
    slowed: "Slowed",
    fortify: "Fortify",
    burned: "Burned",
    fervor: "Fervor",
    flame_guard: "Flame Guard"
  }

  let left = "0px"
  let top = "0px"
  if(combatant.key === "player"){
    left = "75px"
    top = "74%"
  }
  if(combatant.key !== "player"){
    left = "75px"
    top = "100%"
  }

  return <div className="flex m-0-auto gap-2" style={{height: "35px", width: "300px"}}>
    {getBuffs(combatant).map((buff_name) => {
      return (
        <>
        <div className="flex center_all_items popover_message hov_pointer gap-2" key={buff_name}>
          <img src={buff_image_map[buff_name]} className="m-0 p-0 buff_image" />
          <p className="m-0 p-0"> <b>{combatant.buffs[buff_name]}</b></p>
        </div>
        <div className="popover_content dark_opaque_bg" style={{left, top}}>
          <p><b>{buff_names[buff_name]}</b>: {buff_descriptions[buff_name]}</p>
        </div>
        </>
      )
    })}
  </div>
}

export default Buffs
