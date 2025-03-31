import React, { useState, useEffect } from "react";
import Tabs from "./Tabs";

function TabPanel({ setTabVisible, handleTabcard }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [measurmentBase, setMeasurmentBase] = useState(null);
  const [comparisons, setComparisons] = useState([]);

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  }

  return (
    <div className="tab-panel-container">
      <div className="return-container">
        <button onClick={() => setTabVisible(false)}>Powrót</button>
      </div>

      <div className="measuring-container">
        <div className="add-mesure">
          <input
            type="file"
            accept=".txt,.csv,.json"
            onChange={(e) => handleFileUpload(e)}
            id="fileUpload"
            style={{ display: "none" }}
          />
          <label htmlFor="fileUpload" className="custom-file-upload">
            Dodaj Pomiar
          </label>
        </div>
        {comparisons && (
          <div className="comparisons">
            {comparisons.map((item, index) => (
              <div className="item" key={index}>
                <h4>
                  {index === 0 ? "Pomiar bazowy" : `Pomiar ${index + 1}`}:
                </h4>
                <p>
                  B = ({item.x2}, {item.y2})
                </p>
                <p>Odległość od bazy: {item.distance.toFixed(2)}</p>
                <p>Data: {item.date.split(",")[0]}</p>
                <p>Godzina: {item.date.split(",")[1]}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tab-item">
        <div className="tab-item-info">
          <h4>Nazwa:</h4>
          <p>{handleTabcard.title}</p>

          <h4>Użytkownik:</h4>
          <p>{handleTabcard.value}</p>

          <h4>Data:</h4>
          <p>{handleTabcard.date}</p>

          <h4>Pomiar bazowy:</h4>
          {measurmentBase ? (
            <p>
              A = ({measurmentBase.x1}, {measurmentBase.y1})
            </p>
          ) : (
            <p>brak danych</p>
          )}
        </div>

        <TabInputs
          selectedFile={selectedFile}
          setComparisons={setComparisons}
          setMeasurmentBase={setMeasurmentBase}
          measurmentBase={measurmentBase}
        />
      </div>
    </div>
  );
}

function TabInputs({
  selectedFile,
  setComparisons,
  setMeasurmentBase,
  measurmentBase,
}) {
  useEffect(() => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const regex =
        /A=\((-?\d+\.?\d*),(-?\d+\.?\d*)\).*B=\((-?\d+\.?\d*),(-?\d+\.?\d*)\)/;
      const match = text.match(regex);

      if (match) {
        const newMeasurment = {
          x1: parseFloat(match[1]),
          y1: parseFloat(match[2]),
          x2: parseFloat(match[3]),
          y2: parseFloat(match[4]),
          date: new Date().toLocaleString("pl-PL", { hour12: false }),
        };

        if (!measurmentBase) {
          setMeasurmentBase(newMeasurment);
        } else {
          const distance = Math.sqrt(
            Math.pow(newMeasurment.x2 - measurmentBase.x1, 2) +
              Math.pow(newMeasurment.y2 - measurmentBase.y1, 2)
          );

          setComparisons((prev) => [...prev, { ...newMeasurment, distance }]);
        }
      } else {
        console.log("Brak pomiarów");
      }
    };

    reader.readAsText(selectedFile);
  }, [selectedFile, setComparisons, setMeasurmentBase, measurmentBase]);

  return null;
}

export default TabPanel;
