import React, { useState, useEffect } from "react";
import { ArchiveTab } from "./ArchiveTab";

function Archive({ archiveVisible }) {
  const [folders, setFolders] = useState([]);
  const [monthDisplay, setMonthDisplay] = useState(false);
  const [folderName, setFolderName] = useState();
  const [folderData, setFolderData] = useState([]);
  const [updateFolder, setUpdateFolder] = useState(false);

  const getArchived = async () => {
    const result = await window.electron.archivefolders();
    if (result.success) {
      console.log("Folders:", result.data);
      // Możesz teraz wyświetlić np. w stanie Reacta
      setFolders(result.data);
    } else {
      console.error("Error:", result.message);
    }
  };

  useEffect(() => {
    getArchived();
  }, [archiveVisible]);

  const getArchivedFolder = async () => {
    if(!folderName){
      console.error("foldername is empty")
      return;
    }
    const result = await window.electron.archivePlaceData(folderName);
    setUpdateFolder(false)
    console.log(result, "results")
    if (result.success) {
      // console.log("Folders:", result.data);
      // Możesz teraz wyświetlić np. w stanie Reacta
      setFolderData(result.data);
    } else {
      console.error("Error:", result.message);
    }
  };

  useEffect(() => {
    getArchivedFolder();
  }, [updateFolder]);

  const months = [
    { name: "Styczeń", number: 1, color: "rgb(56, 122, 223)" },
    { name: "Luty", number: 2, color: "rgb(96, 147, 224)" },
    { name: "marzec", number: 3, color: "rgb(89, 154, 207)" },
    { name: "kwiecien", number: 4, color: "rgb(84, 181, 194) " },
    { name: "maj", number: 5, color: "rgb(84, 194, 121)" },
    { name: "czerwiec", number: 6, color: "rgb(124, 194, 84) " },
    { name: "lipiec", number: 7, color: "rgb(145, 175, 73)" },
    { name: "sierpień", number: 8, color: "rgb(187, 189, 69) " },
    { name: "Wrzesień", number: 9, color: "rgb(192, 151, 62) " },
    { name: "październik", number: 10, color: "rgb(211, 103, 40)" },
    { name: "listopad", number: 11, color: "rgb(120, 70, 212) " },
    { name: "grudzień", number: 12, color: "rgb(72, 70, 212)" },
  ];

  function handleArchiveTab(name) {
    setFolderName(name);
    console.log("hey");
    console.log(name);
    setMonthDisplay(true);
    setUpdateFolder(true)

  }

  return (
    <>
      <div className="archive-container">
        <div className="return-container">
          {monthDisplay && (
            <button onClick={() => setMonthDisplay(false)}>Powrót</button>
          )}
          <button onClick={() => archiveVisible(false)}>
            {monthDisplay ? "Panel główny" : "Powrót"}
          </button>
        </div>

        {!monthDisplay && (
          <div className="tab-list-archive">
            {folders.map((folder, index) => {
              const monthNumber = parseInt(folder.split("-")[1]);
              const month = months.find((m) => m.number === monthNumber);


              return (
                <div
                  onClick={() => {
                    handleArchiveTab(folder);
                  }}
                  className="archive-container-card"
                  key={index}
                  style={{ backgroundColor: month?.color || "transparent" }}
                >
                  <h3>
                    <span className="color-month">Miesiąc</span>
                    <span> {month ? month.name : folder}</span>
                  </h3>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {monthDisplay && (
        <ArchiveTab folderData={folderData} folderName={folderName} />
      )}
    </>
  );
}

export default Archive;
