import React, { useState, useEffect } from "react";
import ConfirmationDialog from "../UI/ConfirmationDialog";
import { TabInputs } from "./TabInputs";
import { ChartWindown } from "./ChartWindown";

function TabPanel({
  setTabVisible,
  handleTabcard,
  measureTabData,
  measureState,
  handleExoprt,
  id,
  adduser,
  setAddUser,
  name,
  date,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const measurmentBase = measureState?.measurmentBase || null;
  const comparisons = measureState?.comparisons || null;
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [fileMeasurments, setFileMeasurements] = useState([]);
  const [deleteFlag, setdeleteFlag] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [chartItem, setChartItem] = useState()

  useEffect(() => {
    if (adduser || id || deleteFlag) {
      window.electron.invoke("getMeasurementsFromFile", id).then((response) => {
        if (response.success) {
          setFileMeasurements(response.data);
          console.log("file measurment", fileMeasurments);
        } else {
          console.warn(response.message);
        }

        // Po załadowaniu danych resetuj adduser
        setAddUser(false);
        setdeleteFlag(false);
      });
    }
  }, [adduser, id, deleteFlag]);

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  }

  function handleDelete() {
    if (deleteId) {
      console.log(deleteId);
      window.electron
        .invoke("deleteMeasure", deleteId)
        .then((response) => {
          setdeleteFlag(true);
        })
        .catch((err) => {
          console.error("Error during deletion:", err); // Catch any unexpected errors
        });
    }
  }



  function handleChart(item) {
    setChartItem(item)
  }



  return (
    <div className="tab-panel-container">
      <div className="return-container">
        <button onClick={() => setTabVisible(false)}>Powrót</button>
        <button
          onClick={() => {
            setShowArchiveConfirm(true);
          }}
        >
          Archiwizuj
        </button>
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
        {fileMeasurments?.length > 0 && (
          <div className="comparisons">
            {fileMeasurments.map((item, index) => (
              <div className="item" key={index} date-id={item.idm}>
                <div
                  onClick={() => {
                    handleChart(item);
                    setChartOpen(true);
                  }}
                >
                  <h4>
                    {index != 0 ? `Pomiar ${index + 1}` : `Pomiar bazowy`}:
                  </h4>
                  <p>
                    A = ({item.x1}, {item.y1})
                  </p>
                  <p>
                    B = ({item.x2}, {item.y2})
                  </p>
                  {/* <p>Odległość od bazy: {item.id}</p> */}
                  <p>Data: {item.date}</p>
                </div>

                <button
                  onClick={() => {
                    setDeleteId(item.idm);
                    setShowDeleteConfirm(true);
                  }}
                >
                  x
                </button>
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
          {fileMeasurments.length > 0 && fileMeasurments[0] ? (
            <p>
              A = ({fileMeasurments[0].x1}, {fileMeasurments[0].y1})
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

        {showDeleteConfirm && (
          <ConfirmationDialog
            onConfirm={() => {
              handleDelete();
              setShowDeleteConfirm(false);
            }}
            onCancel={() => setShowDeleteConfirm(false)}
            deleteTitle={`Czy na pewno chcesz usunąć pomiar`}
          />
        )}

        {showArchiveConfirm && (
          <ConfirmationDialog
            onConfirm={() => {
              console.log(name, "name of folder");
              handleExoprt(name, date);
              setShowArchiveConfirm(false);
            }}
            onCancel={() => setShowArchiveConfirm(false)}
            deleteTitle={`Czy na pewno chcesz zarchiwizować dokument?`}
          />
        )}

        {chartOpen && (
         <ChartWindown chartItem={chartItem} />
        )}
      </div>
    </div>
  );
}

export default TabPanel;

