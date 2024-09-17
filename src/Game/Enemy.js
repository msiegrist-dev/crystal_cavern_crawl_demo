import Healthbar from "./Healthbar"
import Buffs from "./Buffs"
import {displayArmorAsPct} from "./lib/helper_lib"

const Enemy = ({enemy, targettingHandler}) => {

  const dead = enemy.hp <= 0
  const visibility = dead ? "hidden" : "visible"

  const left = "-75px"

  return (
    <div className="p-4" style={{position: "relative", alignItems: "end", gridAutoRows: "min-content", marginTop: "auto", visibility}} key={enemy.key}>
      <img src={enemy.image_url} className="hov_pointer enemy_img m-4 block" style={{height: "180px", width: "auto"}}
        onClick={(e) => targettingHandler(enemy.key)} alt={enemy.name}
      />
      <h3 style={{position: "relative"}} className="mt-0 mb-0 center_text popover_message hov_pointer">{enemy.name}</h3>
      <Healthbar max_hp={enemy.max_hp} current_hp={enemy.hp} block={enemy.block}/>
      <Buffs combatant={enemy} />
      <div className="grid two_col_equal popover_content dark_opaque_bg" style={{left}}>
        <p className="mt-0 mb-2 center_text span_two_col">{enemy.splash_text}</p>
        <p className="m-4 center_text span_two_col">{enemy.combat_detail}</p>
        <table>
          <tbody>
            <tr>
              <td><b>Attack</b></td>
              <td>{enemy.attack}</td>
            </tr>
            <tr>
              <td><b>Defense</b></td>
              <td>{enemy.defense}</td>
            </tr>
          </tbody>
        </table>
        <table>
          <tbody>
            <tr>
              <td><b>Armor</b></td>
              <td>{displayArmorAsPct(enemy)}</td>
            </tr>
            <tr>
              <td><b>Speed</b></td>
              <td>{enemy.speed}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Enemy
