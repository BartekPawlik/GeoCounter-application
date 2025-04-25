import React from "react";

export function ArchiveTab({ folderData, folderName }) {

  function hideTabsContainer(){
 console.log("hey")
  }
  return (
    <div className="tab-container-archive">
      {folderData.map((tab, index) => {
        return (
          <div onClick={() => {hideTabsContainer}} className="tab-item" key={index}>
            <p className="name">Nazwa:</p>
            <p>{tab}</p>
            <p className="date">Data:</p>
            <p>{folderName}</p>
          </div>
        );
      })}
    </div>
  );
}
