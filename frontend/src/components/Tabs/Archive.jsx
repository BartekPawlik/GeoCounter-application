import React from "react";

function Archive({ archiveVisible, archive, handleTabcard, setTabVisible  }) {
  return (
    <div className="archive-container">
      <div className="return-container">
        <button onClick={() => archiveVisible(false)}>Powrót</button>
        <div className="tab-list">
          {archive.flat().map((tab) => (
      <div className="tab-container" key={tab.id}>
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
          ))}
        </div>
      </div>
    </div>
  );
}

export default Archive;
