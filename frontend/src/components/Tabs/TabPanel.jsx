import React, { useState, useEffect } from "react";
import ConfirmationDialog from "../UI/ConfirmationDialog";

function TabPanel({
  setTabVisible,
  handleTabcard,
  measureTabData,
  measureState,
  handleExoprt,
  id,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileMeasurments, setFileMeasurements] = useState([]);
  const measurmentBase = measureState?.measurmentBase || null;
  const comparisons = measureState?.comparisons || null;
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      window.electron.invoke("getMeasurementsFromFile", id).then((response) => {
        console.log(id);
        if (response.success) {
          console.log(response);
          setFileMeasurements(response.data);
          console.log(response.data);
        } else {
          console.warn(response.message);
        }
      });
    }
  }, [id]);

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
        <button onClick={() => setShowArchiveConfirm(true)}>Archiwizuj</button>
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
        {fileMeasurments.length > 0 && (
          <div className="comparisons">
            {fileMeasurments.slice(1).map((item, index) => (
              <div className="item" key={index}>
                <h4>{`Pomiar ${index + 1}`}:</h4>
                <p>
                  A = ({item.x1}, {item.y1})
                </p>
                <p>
                  B = ({item.x2}, {item.y2})
                </p>
                {/* <p>Odległość od bazy: {item.id}</p> */}
                <p>Data: {item.date}</p>
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
          setFileMeasurements={setFileMeasurements}
          selectedFile={selectedFile}
          measurmentBase={measurmentBase}
          comparisons={comparisons}
          measureTabData={measureTabData}
          id={id}
        />

        {showArchiveConfirm && (
          <ConfirmationDialog
            onConfirm={() => {
              handleExoprt(id); // <-- Wywołujemy tylko, jeśli user potwierdzi
              setShowArchiveConfirm(false);
            }}
            onCancel={() => setShowArchiveConfirm(false)}
            deleteTitle={`Czy na pewno chcesz zarchiwizować dokument?`}
          />
        )}
      </div>
    </div>
  );
}

function TabInputs({
  selectedFile,
  measurmentBase,
  comparisons,
  measureTabData,
  id,
  setFileMeasurements,
}) {
  useEffect(() => {
    if (!id) {
      console.log("ID is missing");
    }
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
          measureTabData({ measurmentBase: newMeasurment, comparisons: [] });
        } else {
          const distance = Math.sqrt(
            Math.pow(newMeasurment.x2 - measurmentBase.x1, 2) +
              Math.pow(newMeasurment.y2 - measurmentBase.y1, 2)
          );
          measureTabData({
            comparisons: [...comparisons, { ...newMeasurment, distance }],
          });
        }

        setFileMeasurements((prevMeasurements) => {
          if (
            !prevMeasurements.some((item) => item.date === newMeasurment.date)
          ) {
            return [...prevMeasurements, newMeasurment];
          }
          return prevMeasurements;
        });
      } else {
        console.log("Brak pomiarów");
      }
    };

    reader.readAsText(selectedFile);
  }, [selectedFile]);

  return null;
}

export default TabPanel;
