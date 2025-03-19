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
      <h1>Geo<span>Counter 🧭</span></h1>
    </div>
  );
}

function Tabs() {
  const [tabContents, setTabContents] = useState([
    {
      id: uuidv4(),
      title: 'Zakładki 1',
      value: 'Bartek',
      date: '2025-03-17',
    },
    {
      id: uuidv4(),
      title: 'Zakładki 2',
      value: 'Piotr',
      date: '2025-03-18',
    },
    {
      id: uuidv4(),
      title: 'Zakładki 3',
      value: 'Krzysztof',
      date: '2025-03-19',
    },
  ]);

  const [activeTab, setActiveTab] = useState(null);
  const [isAddingTab, setIsAddingTab] = useState(false);
  const [newTab, setNewTab] = useState({
    title: '',
    value: '',
    date: ''
  });

  const handleAddTab = () => {
    setTabContents([
      ...tabContents,
      {
        id: uuidv4(),
        title: newTab.title,
        value: newTab.value,
        date: newTab.date,
      }
    ]);
    setNewTab({ title: '', value: '', date: '' });
    setIsAddingTab(false); // Ukrycie formularza po dodaniu zakładki
  };

  return (
    <div className="tabs-container">
      <button onClick={() => setIsAddingTab(true)}>Dodaj budowę</button>

      {isAddingTab && (
        <div className="add-tab-form">
          <input
            type="text"
            placeholder="Tytuł Zakładki"
            value={newTab.title}
            onChange={(e) => setNewTab({ ...newTab, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Użytkownik"
            value={newTab.value}
            onChange={(e) => setNewTab({ ...newTab, value: e.target.value })}
          />
          <input
            type="date"
            value={newTab.date}
            onChange={(e) => setNewTab({ ...newTab, date: e.target.value })}
          />
          <button onClick={handleAddTab}>Dodaj Zakładkę</button>
          <button onClick={() => setIsAddingTab(false)}>Anuluj</button>
        </div>
      )}

      {tabContents.map((tab) => (
        <Tab
          key={tab.id}
          tab={tab}
          isActive={activeTab === tab.title}
          onClick={() => setActiveTab(tab.title)}
        />
      ))}
    </div>
  );
}

function Tab({ tab, isActive, onClick }) {
  return (
    <div
      className={`tab ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <h3><span>Nazwa: </span>{tab.title}</h3>
      <p><strong>Użytkownik: </strong>{tab.value}</p>
      <p><strong>Data:</strong> {tab.date}</p>
    </div>
  );
}

export default App;
{/* <div className="tabs-container">
<button onClick={() => setIsAddingTab(true)}>Dodaj budowę</button>

{isAddingTab && (
  <div className="add-tab-form">
    <input
      type="text"
      placeholder="Tytuł Zakładki"
      value={newTab.title}
      onChange={(e) => setNewTab({ ...newTab, title: e.target.value })}
    />
    <input
      type="text"
      placeholder="Użytkownik"
      value={newTab.value}
      onChange={(e) => setNewTab({ ...newTab, value: e.target.value })}
    />
    <input
      type="date"
      value={newTab.date}
      onChange={(e) => setNewTab({ ...newTab, date: e.target.value })}
    />
    <button onClick={handleAddTab}>Dodaj Zakładkę</button>
    <button onClick={() => setIsAddingTab(false)}>Anuluj</button>
  </div>
)}

{tabContents.map((tab) => (
  <Tab
    key={tab.id}
    tab={tab}
    isActive={activeTab === tab.title}
    onClick={() => setActiveTab(tab.title)}
  />
))}
</div> */}