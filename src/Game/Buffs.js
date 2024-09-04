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


  return <div className="flex" style={{height: "50px"}}>
    {getBuffs(combatant).map((buff_name) => {
      return <p key={buff_name}><b>{buff_name}</b> : {combatant.buffs[buff_name]}</p>
    })}
  </div>
}

export default Buffs
