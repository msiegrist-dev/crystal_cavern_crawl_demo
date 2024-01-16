const Buffs = ({combatant}) => {

  const getBuffs = combatant => {
    if(!combatant.buffs){
      return []
    }
    if(!Object.keys(combatant.buffs).length){
      return []
    }
    return Object.keys(combatant.buffs)
  }

  const buffs = getBuffs(combatant)

  return <div className="flex">
    {getBuffs(combatant).map((buff_name) => {
      return <p key={buff_name}><b>{buff_name}</b> : {combatant.buffs[buff_name]}</p>
    })}
  </div>
}

export default Buffs
