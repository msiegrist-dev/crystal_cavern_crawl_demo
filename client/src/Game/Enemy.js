import Healthbar from "./Healthbar"
import {displayArmorAsPct} from "./lib/helper_lib"

export default ({enemy, targettingHandler}) => {

  return (
    <div className="grid" style={{alignItems: "end", gridAutoRows: "min-content", marginTop: "auto"}} key={enemy.key}>
      <img src={enemy.image_url} className="hov_pointer enemy_img m-4 block" style={{height: "120px", width: "auto"}}
        onClick={(e) => targettingHandler(enemy.key)}
      />
      <Healthbar max_hp={enemy.max_hp} current_hp={enemy.hp} block={enemy.block}/>
      <h3 style={{margin: "0"}}>{enemy.name}</h3>
      <p style={{margin: "0"}}>{enemy.splash_text}</p>
      <p style={{margin: "0"}}>POSITION KEY : {enemy.key}</p>
      <div className="grid two_col_equal">
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
