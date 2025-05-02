import React, { useState, useEffect } from "react";

export function ArchiveTab({ folderData, folderName }) {
  const [load, setLoad] = useState(false);
  const [idOpen, setIdOpen] = useState();
  const [txtfile, setTxtFile] = useState();
  const [updateTxt, setUpdateTxt] = useState(false)

  function hideTabsContainer(id) {
    setLoad(true);
    setIdOpen(id);
    console.log(id);
  }


  function handleUpdate(){
     setUpdateTxt(true)
  }


  const getUpdatedTxt = async () => {
    const result = await window.electron.updateTxt(idOpen, folderName, txtfile[0]);
    setUpdateTxt(false);
    if (result.success) {
      setTxtFile(result.data);
    } else {
      console.error("Error:", result.message);
    }
  };

  useEffect(() => {
    getUpdatedTxt();
  }, [updateTxt]);


  const getArchivedTxt = async () => {
    const result = await window.electron.archiveTxt(idOpen, folderName);
    setLoad(false);
    console.log(result, "results");
    if (result.success) {
      setTxtFile(result.data);
    } else {
      console.error("Error:", result.message);
    }
  };

  useEffect(() => {
    getArchivedTxt();
  }, [load]);

  return (
    <div className="archive-txt-container">
      <div className="tab-container-archive">
        {folderData.map((tab, index) => {
          // console.log(tab)
          return (
            <div
              id-data={tab.id}
              onClick={() => {
                hideTabsContainer(tab.id);
              }}
              className="tab-item"
              key={index}
            >
              <p className="name">Nazwa:</p>
              <p>{tab.foldername}</p>
              <p className="date">Data:</p>
              <p>{tab.date}</p>
            </div>
          );
        })}
      </div>
      <div className="txt-container">
        <textarea
          onChange={(e) => {
            const updated = [...txtfile];
            updated[0].content = e.target.value;
            setTxtFile(updated);
          }}
          name=""
          id=""
          value={txtfile && txtfile[0] ? txtfile?.[0].content : ""}
        ></textarea>
        <button onClick={() => handleUpdate()} className="update-button">Aktualizuj plik</button>
      </div>
    </div>
  );
}
