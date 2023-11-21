const Modal = ({show_modal, setShowModal, children, permanent}) => {

  const modal_class = show_modal ? "show_modal p-16 overflow-y-scroll" : "hide_modal p-16 overflow-y-scroll"

  return (
    <div className={modal_class}
      style={{
        width: "90%",
        left: "5%",
        height: "90vh",
        top: "5vh",
        zIndex: "12",
        position: "fixed",
        overflowY: "scroll",
        background: "rgba(255, 255, 255, .8)"
      }}
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
