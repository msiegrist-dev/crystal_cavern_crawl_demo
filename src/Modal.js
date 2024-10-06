const Modal = ({show_modal, setShowModal, children, permanent}) => {

  const modal_class = show_modal ? "show_modal p-16 w-90" : "w-90 hide_modal p-16"
  const style = {
    left: "5%",
    height: "85vh",
    top: "5vh",
    zIndex: "12",
    position: "fixed",
    backgroundColor: "rgba(90, 91, 84, .95)",
    overflowY: "hidden"
  }

  const CloseButton = () => <button className="yellow_action_button" onClick={(e) => setShowModal(false)}>Close</button>

  return (
    <div className={modal_class}
      style={style}
      >
      {!permanent && <CloseButton />}
      {children}
      {!permanent && <CloseButton />}
    </div>
  )
}

export default Modal
