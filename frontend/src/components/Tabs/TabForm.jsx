import React, { useState } from "react";
function TabForm({ addNewTab, setIsAddingTab }) {
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

    function handleAddTab() {
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
      addNewTab(newTab);
      setNewTab({ title: "", value: "", date: "" });
      setIsAddingTab(false);
      setErrors({ title: false, value: false, date: false });
    }

    return (
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
          {errors.value && <small>Użytkownik jest wymagany</small>}
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
    );
  }

  export default TabForm
