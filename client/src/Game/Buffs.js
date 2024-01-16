const Buffs = ({combatant}) => {

  return <div className="flex">
    {Object.keys(combatant.buffs).map((buff_name) => {
      return <p key={buff_name}><b>{buff_name}</b> : {combatant.buffs[buff_name]}</p>
    })}
  </div>
}

export default Buffs
