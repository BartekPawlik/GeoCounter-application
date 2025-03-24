import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  return (
    <div className="app">
      <Title />
      <div className="panel-tab">
        <Tabs />
      </div>
    </div>
  );
}

function Title() {
  return (
    <div className="title-container">
      <h1>
        Geo<span>Counter 🧭</span>
      </h1>
    </div>
  );
}

function Tabs() {
  const [tabContents, setTabContents] = useState(() => {
    const storedTabs = localStorage.getItem("tabs");
    if (storedTabs) {
      return JSON.parse(storedTabs);
    }
  });
  const [activeTab, setActiveTab] = useState(null);
  const [isAddingTab, setIsAddingTab] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false)
  const [deleteid, setDeleteId]= useState(null);
  const [newTab, setNewTab] = useState({
    title: "",
    value: "",
    date: "",
  });
  const [errors, setErrors] = useState({
    title: false,
    value: false,
    date: false,
  });

  function handleDeleteItem(id) {
   setDeleteId(id)
   setIsConfirmDelete(true)
  }


  const confirmDelete = () => {
    const updatedTabs = tabContents.filter((tab) => tab.id !== deleteid);
    setTabContents(updatedTabs);
    localStorage.setItem("tabs", JSON.stringify(updatedTabs));
    setIsConfirmDelete(false); // Close the confirmation dialog
  };



  const cancleDelete = ()=>{
    setIsConfirmDelete(false)
  }

  const handleAddTab = () => {
    const newErrors = {
      title: !newTab.title.trim(),
      value: !newTab.value.trim(),
      date: !newTab.date.trim(),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);
    if (hasErrors) {
      return;
    }

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
    setNewTab({ title: "", value: "", date: "" });
    setIsAddingTab(false);
    setErrors({ title: false, value: false, date: false });
  };

  return (
    <div className="tabs-container">
      <button onClick={() => setIsAddingTab(true)}>Nowy dokument</button>
      {isAddingTab && (
        <div className="add-tab-form">
          <div className="input-container">
            <input
              className={errors.title ? "input-error" : ""}
              type="text"
              placeholder="Miejsce"
              value={newTab.title}
              onChange={(e) => setNewTab({ ...newTab, title: e.target.value })}
            />
            {errors.title && <small>Nazwa jest wymagana</small>}
          </div>

          <div className="input-container">
            <input
              type="text"
              className={errors.value ? "input-error" : ""}
              value={newTab.value}
              placeholder="Użytkownik"
              onChange={(e) => setNewTab({ ...newTab, value: e.target.value })}
            />
            {errors.value && <small>Użytkownik jest wymagana</small>}
          </div>
          <div className="input-container">
            <input
              className={errors.date ? "input-error" : ""}
              type="date"
              value={newTab.date}
              onChange={(e) => setNewTab({ ...newTab, date: e.target.value })}
            />
            {errors.value && <small>Data jest wymagana</small>}
          </div>
          <button onClick={handleAddTab}>Dodaj</button>
          <button
            onClick={() => {
              setIsAddingTab(false);
              setErrors({ title: false, value: false, date: false });
              setNewTab({ title: "", value: "", date: "" });
            }}
          >
            Anuluj
          </button>
        </div>
      )}


{isConfirmDelete && (
  <ConfirmationDialog onConfirm={confirmDelete} onCancel={cancleDelete}/>
)}


      {tabContents.map((tab) => (
        <Tab
          key={tab.id}
          tab={tab}
          isActive={activeTab === tab.title}
          handleDeleteItem={handleDeleteItem}
          onClick={() => setActiveTab(tab.title)}
        />
      ))}
    </div>
  );
}

function Tab({ tab, isActive, onClick, handleDeleteItem }) {
  return (
    <div className={`tab ${isActive ? "active" : ""}`} onClick={onClick}>
      <div className="tab-container">
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
          <button className="bul-button">dokument</button>
        </div>
      </div>
      <button className="deleteTab" onClick={() => handleDeleteItem(tab.id)}>
        X
      </button>
    </div>
  );
}

function ConfirmationDialog({onConfirm, onCancel}){
  return(
    <div className="confirmation-dialog">
      <div className="dialog-box">
        <p>Czy na penwo chcesz usunąć ten dokument?</p>
        <div className="dialog-buttons">
          <button onClick={onConfirm}>Tak</button>
          <button onClick={onCancel}>Anuluj</button>
        </div>
      </div>
    </div>
  )
}

export default App;
