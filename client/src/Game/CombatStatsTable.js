const CombatStatsTable = ({combat_stats}) => {
  return (
    <div className="m-4 p-4">
      <table>
        <thead>
          <tr className="center_text">
            <th className="p-4 m-4"><b>Damage Taken</b></th>
            <th className="p-4 m-4"><b>Damage Done</b></th>
            <th className="p-4 m-4"><b>Enemies Slain</b></th>
          </tr>
        </thead>
        <tbody>
          <tr className='center_text'>
            <td className="p-4 m-4">{combat_stats.damage_taken}</td>
            <td className="p-4 m-4">{combat_stats.damage_dealt}</td>
            <td className="p-4 m-4">{combat_stats.enemies_killed}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default CombatStatsTable
