import {useEffect, useState} from 'react'
import {animated, useSpring} from '@react-spring/web'

const Healthbar = ({max_hp, current_hp, block}) => {

  const full_hp_pos = 100
  const zero_hp_pos = 280
  const increment = (zero_hp_pos - full_hp_pos) / 100
  const getHealthBarPosition = () => {
    return zero_hp_pos - (((current_hp / max_hp) * 100) * increment) + "%"
  }
  const [healthbar_position, setHealthBarPosition] = useState(getHealthBarPosition())
  const [block_show, setBlockShow] = useState(false)

  const [health_springs, health_springs_api] = useSpring(() => ({
    from: {backgroundPositionX: healthbar_position},
  }))
  const [block_springs, block_springs_api] = useSpring(() => ({
    from: {opacity: 0},
    config: {
      mass: 10,
      tension: 200,
      friction: 100,
    }
  }))

  useEffect(() => {
    const new_position = getHealthBarPosition()
    health_springs_api.start({
      from: {
        backgroundPositionX: healthbar_position
      },
      to: {
        backgroundPositionX: new_position
      }
    })
    setHealthBarPosition(new_position)
  }, [max_hp, current_hp])

  useEffect(() => {
    const from_val = block_show ? 100 : 0
    const to_val = block > 0 ? 100 : 0
    if(from_val === to_val){
      return
    }
    block_springs_api.start({
      from: {opacity: from_val},
      to: {opacity: to_val}
    })
    setBlockShow(to_val === 100)
  }, [block])

  let health_bar_style = {
    backgroundImage: "url('just_red.png')",
    backgroundColor: "grey",
    backgroundRepeat: "no-repeat",
    height: "20px",
    width: "250px",
    ...health_springs
  }

  let block_style = {
    backgroundImage: "url('shield_icon.png')",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    color: "cyan",
    backgroundPositionX: "center",
    ...block_springs
  }

  return (
    <div className="grid m-2" style={{gridTemplateColumns: "85% 1fr", height: "35px", width: "300px"}}>
      <animated.div className="center_text p-2" style={health_bar_style}><b>{current_hp} / {max_hp}</b></animated.div>
      <animated.div style={block_style}>
        <p className="m-4 center_text"><b>{block}</b></p>
      </animated.div>
    </div>
  )
}

export default Healthbar
