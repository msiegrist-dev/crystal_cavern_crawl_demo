const Healthbar = ({max_hp, current_hp, block}) => {
  const style = {
    backgroundColor: "red",
    width: ((current_hp / max_hp) * 100).toFixed(2) + "%"
  }

  return (
    <div style={{display: "inline-block", width: "90%"}}>
      <div style={style}><p style={{color: "red", marginTop: "2px"}}>&nbsp;</p></div>
      <div className="grid two_col_60_40" style={{height: "60px"}}>
        <p className="center_text"><b>{current_hp}</b> / {max_hp}</p>
        <div style={{display: "flex"}}>
          {block > 0 &&
            <>
            <img src="block_icon.jpg" style={{display: "block", margin: "0 auto", width: "45px"}}/>
            <p className="center_text">{block}</p>
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default Healthbar
