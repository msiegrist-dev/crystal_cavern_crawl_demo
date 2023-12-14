const Healthbar = ({max_hp, current_hp}) => {

  const style = {
    backgroundColor: "red",
    width: ((current_hp / max_hp) * 100).toFixed(2) + "%"
  }

  return (
    <div style={{display: "inline-block", width: "90%", border: "2px solid black"}}>
      <div style={style}><p style={{color: "red"}}> &nbsp;</p></div>
      <p className="center_text"><b>{current_hp}</b> / {max_hp}</p>
    </div>
  )
}

export default Healthbar
