import React, {  useState } from "react";
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
  const [userData, setUserData] = useState([

  ]);
  const [newUser, setNewUser] = useState("");
  const [userActive, setUserActive] = useState(false);

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
  function addNewUser() {
    setUserActive((prev) => !prev);
    setIsAddingTab(false);
    setIsConfirmDelete(false);
  }

  function deleteUsers(id) {
    const updateUsers = userData.filter((user) => user.id !== id);
    setUserData(updateUsers);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && newUser.trim() !== "") {
      setUserData([...userData, { id: uuidv4(), name: newUser.trim()}]);
      setNewUser("");
    }
  }

  return (
    <div className="tabs-container">
      {!tabvisible && (
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

      {!tabvisible && !userActive && (
        <div className="button-container">
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

      {isAddingTab && !tabvisible && !userActive && (
        <TabForm
          userData={userData}
          setErrorName={setErrorName}
          tabContents={tabContents}
          addNewTab={addNewTab}
          setIsAddingTab={setIsAddingTab}
          errorName={errorName}
        />
      )}
      {!tabvisible && !userActive && (
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

      {isConfirmDelete && !tabvisible && !userActive && (
        <ConfirmationDialog
          onConfirm={confirmDelete}
          onCancel={cancleDelete}
          deleteTitle={deleteTitle}
        />
      )}
      {tabvisible && !userActive && (
        <TabPanel setTabVisible={setTabVisible} handleTabcard={handleTabcard} />
      )}
    </div>
  );
}

export default Tabs;

function UserPanel({
  addNewUser,
  handleKeyDown,
  setNewUser,
  userActive,
  newUser,
  userData,
  deleteUsers,
}) {
  return (
    <div className="users-container">
      <div className="button-container">
        <button onClick={addNewUser}>users</button>
      </div>
      {userActive && (
        <div className="user-container">
          <div className="add-user-container">
            <h4>Lista</h4>
            <input
              value={newUser}
              placeholder="Dodaj"
              onChange={(e) => setNewUser(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="user-list">
            {userData.map((item) => (
              <div key={item.id}  className="user-container">
                <p>{item.name}</p>
                <button onClick={() => deleteUsers(item.id)}>x</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
