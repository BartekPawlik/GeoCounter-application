import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ConfirmationDialog from "../UI/ConfirmationDialog";
import TabForm from "./TabForm";
import TabList from "./TabList";
import TabPanel from "./TabPanel";
import UserPanel from "./UserPanel";
import Archive from "./Archive";

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
  const [userData, setUserData] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [userActive, setUserActive] = useState(false);
  const [measureData, setMeasureData] = useState([]);
  const [archive, setArchive] = useState([]);
  const [archiveVisible, setArchiveVisible] = useState(false);

  function updateTabData(tabId, data) {
    setMeasureData((prev) => ({
      ...prev,
      [tabId]: {
        ...prev[tabId],
        ...data,
      },
    }));
  }
// Load users on mount

useEffect(() => {
  const fetchUsers = async () => {
    const users = await window.electron.getUsers();
    setUserData(users);
  };
  fetchUsers();
}, []);

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
        archived: false,
      },
    ];
    setTabContents(updatedTabs);
    localStorage.setItem("tabs", JSON.stringify(updatedTabs));
  }
  function addNewUser() {
    setUserActive((prev) => !prev);
    setIsAddingTab(false);
    setIsConfirmDelete(false);
  }

  const deleteUsers = async (id) => {
    await window.electron.deleteUser(id);
    const updated = await window.electron.getUsers();
    setUserData(updated);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && newUser.trim() !== "") {
      const newUserData = { id: uuidv4(), name: newUser.trim() };
      await window.electron.addUser(newUserData);
      const updated = await window.electron.getUsers();
      setUserData(updated);
      setNewUser(""); // Clear input
    }
  };

  function handleExport(data) {
    console.log(archive);
    const updatedTabContents = tabContents.filter(
      (item) => !data.includes(item.id)
    );
    setTabVisible(false);
    const exportedTabs = tabContents.filter((item) => data.includes(item.id));
    setArchive((prev) => [...prev, exportedTabs]);
    setTabContents(updatedTabContents);
    localStorage.setItem("tabs", JSON.stringify(updatedTabContents));
    localStorage.setItem(
      "archive",
      JSON.stringify([...archive, ...exportedTabs])
    );
  }

  return (
    <div className="tabs-container">
      {!tabvisible && !archiveVisible && (
        <UserPanel
          addNewUser={addNewUser}
          handleKeyDown={handleKeyDown}
          setNewUser={setNewUser}
          userActive={userActive}
          newUser={newUser}
          userData={userData}
          deleteUsers={deleteUsers}
        />
      )}

      {!tabvisible && !userActive && !archiveVisible && (
        <div className="button-container">
          <button
            onClick={() => {
              setArchiveVisible(true);
            }}
          >
            Archiwum
          </button>
          <button
            onClick={() => {
              setIsAddingTab(true);
              setIsConfirmDelete(false);
            }}
          >
            Nowy dokument
          </button>
        </div>
      )}

      {archiveVisible && (
        <Archive archiveVisible={setArchiveVisible} archive={archive}
        setTabVisible={setTabVisible}
        handleTabcard={handleTabcard}
        />
      )}

      {isAddingTab && !tabvisible && !userActive && !archiveVisible && (
        <TabForm
          userData={userData}
          setErrorName={setErrorName}
          tabContents={tabContents}
          addNewTab={addNewTab}
          setIsAddingTab={setIsAddingTab}
          errorName={errorName}
        />
      )}
      {!tabvisible && !userActive && !archiveVisible && (
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

      {isConfirmDelete && !tabvisible && !userActive && !archiveVisible && (
        <ConfirmationDialog
          onConfirm={confirmDelete}
          onCancel={cancleDelete}
          deleteTitle={`Czy na pewno chcesz usunąć dokument "${deleteTitle}"?`}
        />
      )}
      {tabvisible && !userActive && !archiveVisible && (
        <TabPanel
          handleExoprt={handleExport}
          setTabVisible={setTabVisible}
          handleTabcard={handleTabcard}
          measureTabData={(data) => updateTabData(handleTabcard.id, data)}
          measureState={measureData[handleTabcard?.id] || {}}
          id={handleTabcard.id}
          handleExport={handleExport}
          deleteTitle={deleteTitle}
        />
      )}
    </div>
  );
}

export default Tabs;
