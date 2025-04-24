import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ConfirmationDialog from "../UI/ConfirmationDialog";
import TabForm from "./TabForm";
import TabList from "./TabList";
import TabPanel from "./TabPanel";
import UserPanel from "./UserPanel";
import Archive from "./Archive";

function Tabs() {
  const [tabContents, setTabContents] = useState([]);
  useEffect(() => {
    async function fetchTabs() {
      const tabs = await window.electron.getTabs();
      setTabContents(tabs);
    }

    fetchTabs();
  }, []);
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
  const [adduser, setAddUser] = useState(false)
  const name = handleTabcard?.title || ""
  const folderDate = handleTabcard?.date || ""



  function updateTabData(tabId, data) {
    console.log("własnie powstał nowy pomiar");
    setAddUser(true)
    setMeasureData((prev) => {
      const updatedTab = {
        ...prev[tabId],
        ...data,
      };

      // Extracting latest measurement data
      const measurementBase = updatedTab.measurmentBase;
      const comparisons = updatedTab.comparisons || [];

      // Send to Electron backend only if there is a new measurement
      if (comparisons.length > 0) {
        const lastComparison = comparisons[comparisons.length - 1];


        window.electron.invoke("addMeasure", {
          id: handleTabcard.id,
          id_measure: uuidv4(),
          x1: measurementBase.x1,
          y1: measurementBase.y1,
          x2: lastComparison.x2,
          y2: lastComparison.y2,
          date: lastComparison.date,
        });
      }else{
        window.electron.invoke("addMeasure", {
          id: handleTabcard.id,
          id_measure: uuidv4(),
          x1: measurementBase.x1,
          y1: measurementBase.y1,
          x2: measurementBase.x2,
          y2: measurementBase.y2,
          date: measurementBase.date,
        });
      }

      return {
        ...prev,
        [tabId]: updatedTab,
      };
    });
  }





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


    const confirmDelete = async () => {
      if (deleteid) {
      console.log(deleteid)
        await window.electron.deleteTab(deleteid);
        const updated = await window.electron.getTabs();
        setTabContents(updated);
        setIsConfirmDelete(false);
      }
    };

    function confirmCancel(){
      setIsConfirmDelete(false);
    }



  function addNewTab(newTab) {
    const updatedTabs = [
      ...tabContents,
      {
        id: newTab.id,
        title: newTab.title,
        value: newTab.value,
        date: newTab.date,
        archived: false,
      },
    ];
    setTabContents(updatedTabs);


    window.electron.createFolderAndFile({
      id: newTab.id,
      title: newTab.title,
      value: newTab.value,
      date: newTab.date,
    }).then(response => {
      if (response.success) {
        setTabContents(response.tabs);
      } else {
        console.error('Failed to create folder and file');
      }
    });
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
      setNewUser("");
    }
  };

 async function handleExport(data) {
  console.log(name, "name");
  console.log(folderDate, "date");

  const response = await window.electron.invoke("move-folder-to-archive", {name, folderDate} );

  if (response.success) {
    console.log(response.message);
  } else {
    console.warn(response.message);
    return;
  }


  setTabVisible(false);


  const updatedTabContents = tabContents.filter(
    (item) => !data.includes(item.id)
  );
  const exportedTabs = tabContents.filter((item) => data.includes(item.id));

  setArchive((prev) => [...prev, ...exportedTabs]);
  setTabContents(updatedTabContents);


  const updated = await window.electron.getTabs();
  setTabContents(updated);
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
          onCancel={confirmCancel}
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
          name={name}
          date={folderDate}
          handleExport={handleExport}
          deleteTitle={deleteTitle}
          adduser={adduser}
          setAddUser={setAddUser}

        />
      )}
    </div>
  );
}

export default Tabs;
