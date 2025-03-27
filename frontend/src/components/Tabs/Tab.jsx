import React from "react";
function Tab({ tab, isActive, onClick, handleDeleteItem, isAddingTab }) {
    return (
      <div className={`tab ${isActive ? "active" : ""}`} onClick={onClick}>
        <div className="tab-container">
          <h3>
            <span>Nazwa: </span>
            {tab.title}
          </h3>
          <p>
            <strong>Użytkownik: </strong>
            {tab.value}
          </p>
          <p>
            <strong>Data:</strong> {tab.date}
          </p>
          <div>
            <button className="bul-button">dokument</button>
          </div>
        </div>
        {!isAddingTab ? (
          <button
            className="deleteTab"
            onClick={() => handleDeleteItem(tab.id, tab.title)}
          >
            X
          </button>
        ) : (
          ""
        )}
      </div>
    );
  }

  export default Tab