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
    burned: "burn.png"
  }

  const buff_descriptions = {
    thorns: "Returns 8 damage on attack if target is an enemy and 3 damage if you are the target.",
    slowed: "Speed is halved when calculating the turn order.",
    fortify: "Block values which can be increased have their final values increased by 33%.",
    burned: "Final attack value is reduced by 25%.",
    fervor: "Increases base card attack and base attack stat values.",
    flame_guard: "Attacker is given a turn of the 'burned' debuff.",
  }


  return <div className="flex m-0-auto" style={{height: "35px", width: "300px"}}>
    {getBuffs(combatant).map((buff_name) => {
      return <div className="flex center_all_items" key={buff_name}>
        <img src={buff_image_map[buff_name]} className="p-2 buff_image popover_message" />
        <p className="mt-0 p-2 popover_message"> <b>{combatant.buffs[buff_name]}</b></p>
        <div className="popover_content dark_opaque_bg">
          <p><b>{buff_name}</b>: {buff_descriptions[buff_name]}</p>
        </div>
      </div>
    })}
  </div>
}

export default Buffs
