const Modal = ({show_modal, setShowModal, children, permanent}) => {

  const modal_class = show_modal ? "show_modal p-16 w-90" : "w-90 hide_modal p-16"
  const style = {
    left: "5%",
    height: "85vh",
    top: "5vh",
    zIndex: "12",
    position: "fixed",
    background: "rgba(90, 91, 84, .95)",
    overflowY: "hidden"
  }

  return (
    <div className={modal_class}
      style={style}
      >
      {!permanent &&
        <button onClick={(e) => setShowModal(false)}>
          Close
        </button>
      }
      {children}
      {!permanent &&
        <button onClick={(e) => setShowModal(false)}>
          Close
        </button>
      }
    </div>
  )
}

export default Modal
