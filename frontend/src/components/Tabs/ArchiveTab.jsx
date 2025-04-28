import React from "react";

export function ArchiveTab({ folderData }) {
  console.log(folderData)

  function hideTabsContainer(){
 console.log("hey")
  }
  return (
    <div className="archive-txt-container">
    <div className="tab-container-archive">
      {folderData.map((tab, index) => {
        // console.log(tab)
        return (
          <div id-data={tab.id} onClick={() => {hideTabsContainer()}} className="tab-item" key={index}>
            <p className="name">Nazwa:</p>
            <p>{tab.foldername}</p>
            <p className="date">Data:</p>
            <p>{tab.date}</p>
          </div>
        );
      })}
    </div>
    {folderData.map((tab, index) => {
 return ( <div className="txt-container">
  <textarea name="" id="">{tab.content}</textarea>
 </div>)

    })}

    </div>
  );
}
