import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ConfirmationDialog from "../UI/ConfirmationDialog";
import TabForm from "./TabForm";
import TabList from "./TabList";


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
      <button
        onClick={() => {
          setIsAddingTab(true);
          setIsConfirmDelete(false);
        }}
      >
        Nowy dokument
      </button>
      {isAddingTab && (
        <TabForm addNewTab={addNewTab} setIsAddingTab={setIsAddingTab} />
      )}
      <TabList
        tabContents={tabContents}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        handleDeleteItem={handleDeleteItem}
        isAddingTab={isAddingTab}
      />

      {isConfirmDelete && (
        <ConfirmationDialog
          onConfirm={confirmDelete}
          onCancel={cancleDelete}
          deleteTitle={deleteTitle}
        />
      )}
    </div>
  );
}
export default Tabs