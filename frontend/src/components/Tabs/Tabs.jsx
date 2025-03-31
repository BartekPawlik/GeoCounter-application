import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ConfirmationDialog from "../UI/ConfirmationDialog";
import TabForm from "./TabForm";
import TabList from "./TabList";
import TabPanel from "./TabPanel";

function Tabs() {
  const [tabContents, setTabContents] = useState(() => {
    const storedTabs = localStorage.getItem("tabs");

    return storedTabs ? JSON.parse(storedTabs) : [];
  });
  const [activeTab, setActiveTab] = useState(null);
  const [isAddingTab, setIsAddingTab] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [deleteid, setDeleteId] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [errorName, setErrorName] = useState(false);
  const [tabvisible, setTabVisible] = useState(false);
  const [handleTabcard, setHandleTabCard] = useState(null);

  function handleDeleteItem(id, title) {
    setDeleteId(id);
    setIsConfirmDelete(true);
    setDeleteTitle(title);
  }

  const confirmDelete = () => {
    const updatedTabs = tabContents.filter((tab) => tab.id !== deleteid);
    setTabContents(updatedTabs);
    localStorage.setItem("tabs", JSON.stringify(updatedTabs));
    setIsConfirmDelete(false);
  };

  const cancleDelete = () => {
    setIsConfirmDelete(false);
  };

  function addNewTab(newTab) {
    const updatedTabs = [
      ...tabContents,
      {
        id: uuidv4(),
        title: newTab.title,
        value: newTab.value,
        date: newTab.date,
      },
    ];
    setTabContents(updatedTabs);
    localStorage.setItem("tabs", JSON.stringify(updatedTabs));
  }

  return (
    <div className="tabs-container">
      {!tabvisible && (
        <button
          onClick={() => {
            setIsAddingTab(true);
            setIsConfirmDelete(false);
          }}
        >
          Nowy dokument
        </button>
      )}

      {isAddingTab && !tabvisible && (
        <TabForm
          setErrorName={setErrorName}
          tabContents={tabContents}
          addNewTab={addNewTab}
          setIsAddingTab={setIsAddingTab}
          errorName={errorName}
        />
      )}
      {!tabvisible && (
        <TabList
          tabContents={tabContents}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          handleDeleteItem={handleDeleteItem}
          isAddingTab={isAddingTab}
          tabvisible={tabvisible}
          setTabVisible={setTabVisible}
          handleTabcard={setHandleTabCard}
        />
      )}

      {isConfirmDelete && !tabvisible && (
        <ConfirmationDialog
          onConfirm={confirmDelete}
          onCancel={cancleDelete}
          deleteTitle={deleteTitle}
        />
      )}
      {tabvisible && (
        <TabPanel setTabVisible={setTabVisible} handleTabcard={handleTabcard} />
      )}
    </div>
  );
}



export default Tabs;
