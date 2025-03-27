import React, { useState, useEffect } from "react";



function ConfirmationDialog({ onConfirm, onCancel, deleteTitle }) {

    useEffect(() => {
        const handleKeyPress  = (event) => {
            if (event.key === "Enter") {
                onConfirm()
            }
        }
    window.addEventListener("keydown", handleKeyPress)

    return () => {
        window.removeEventListener("keydown", handleKeyPress)
    }

    })
    return (
      <div className="confirmation-dialog">
        <div className="dialog-box">
          <p>
            Czy na penwo chcesz usunąć <span>{deleteTitle}</span> ?
          </p>
          <div className="dialog-buttons">
            <button onClick={onConfirm}>Tak</button>
            <button onClick={onCancel}>Anuluj</button>
          </div>
        </div>
      </div>
    );
  }

  export default ConfirmationDialog