import { useEffect } from "react";

export function TabInputs({
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
    if (!id || !selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      console.log("read");
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
          setFileMeasurements((prevMeasurements) => {
            if (
              !prevMeasurements.some((item) => item.date === newMeasurment.date)
            ) {
              return [...prevMeasurements, newMeasurment];
            }
            return prevMeasurements;
          });
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
