import React from "react";

function Tab({
  tab,
  isActive,
  onClick,
  handleDeleteItem,
  isAddingTab,
  setTabVisible,
  handleTabcard,
}) {
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
          <button
            onClick={() => {
              setTabVisible(true);
              handleTabcard({
                id: tab.id,
                title: tab.title,
                date: tab.date,
                value: tab.value,
              });
            }}
            className="bul-button"
          >
            dokument
          </button>
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

export default Tab;
