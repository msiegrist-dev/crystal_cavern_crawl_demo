const CombatStatsTable = ({combat_stats}) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th><b>Damage Taken</b></th>
            <th><b>Damage Done</b></th>
            <th><b>Enemies Slain</b></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{combat_stats.damage_taken}</td>
            <td>{combat_stats.damage_dealt}</td>
            <td>{combat_stats.enemies_killed}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default CombatStatsTable
