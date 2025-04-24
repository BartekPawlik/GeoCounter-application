import React, { useState, useEffect } from "react";

function Archive({ archiveVisible }) {
  const [folders, setFolders] = useState([]);

  const getArchived = async () => {
    const result = await window.electron.archivefolders();

    if (result.success) {
      console.log("Folders:", result.data);
      // Możesz teraz wyświetlić np. w stanie Reacta
      setFolders(result.data);
    } else {
      console.error("Error:", result.message);
    }
  };

  useEffect(() => {
    getArchived();
  }, [archiveVisible]);

  console.log(folders);

  //  const month = [
  //   {name: "Styczeń",number: 1,color:rgb(56, 122, 223)},
  //   {name: "Luty",number: 2,color:rgb(96, 147, 224)},
  //   {name: "marzec",number: 3,color:rgb(89, 154, 207)},
  //   {name: "kwiecie",number: 4,color:rgb(84, 181, 194)},
  //   {name: "maj",number: 5,color:rgb(84, 194, 121)},
  //   {name: "czerwiec",number: 6,color:rgb(124, 194, 84)},
  //   {name: "lipiec",number: 7,color:rgb(145, 175, 73)},
  //   {name: "sierpień",number: 8,color:rgb(187, 189, 69)},
  //   {name: "Wrzesień",number: 9,color:rgb(192, 151, 62)},
  //   {name: "październik",number: 10,color:rgb(211, 103, 40)},
  //   {name: "listopad",number: 11,color:rgb(120, 70, 212)},
  //   {name: "grudzień",number: 12,color:rgb(72, 70, 212)},
  //  ]

  return (
    <div className="archive-container">
      <div className="return-container">
        <button onClick={() => archiveVisible(false)}>Powrót</button>
      </div>
      <div className="tab-list-archive">
        {folders.map((folder, index) => (
          <div className="archive-container-card" key={index}>
            <h3>
              <span>Nazwa: </span>
              {folder}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Archive;
