const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs-extra");
const { readUsers, writeUsers } = require("./fsUserHandler.js");
const { isNull } = require("util");

function getTabs() {
  try {
    const tabsDir = path.join(__dirname, "tabs");
    const folderNames = fs.readdirSync(tabsDir);

    const tabs = [];

    for (const folder of folderNames) {
      const folderPath = path.join(tabsDir, folder);
      const stats = fs.statSync(folderPath);

      if (stats.isDirectory()) {
        const files = fs.readdirSync(folderPath);

        for (const file of files) {
          const filePath = path.join(folderPath, file);
          const fileStats = fs.statSync(filePath);

          if (fileStats.isFile() && file.endsWith(".txt")) {
            const fileContent = fs.readFileSync(filePath, "utf-8");

            const [tab, date, user, id] = fileContent.split("\n");

            tabs.push({
              id: id.split(": ")[1],
              title: tab.split(": ")[1],
              value: user.split(": ")[1],
              date: date.split(": ")[1],
              archived: false,
            });
          }
        }
      }
    }

    return tabs;
  } catch (error) {
    console.error("Error reading tabs:", error);
    return [];
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false, // Ensures security by disabling nodeIntegration
      contextIsolation: true,
    },
  });

  ipcMain.handle("get-tabs", () => {
    return getTabs();
  });

  win.loadURL("http://localhost:5173");

  ipcMain.handle("get-users", () => {
    return readUsers();
  });

  // Handle adding a new user
  ipcMain.handle("add-user", (event, newUser) => {
    const users = readUsers();
    users.push(newUser); // Add the new user
    writeUsers(users); // Write back to userData.json
  });

  // Handle deleting a user
  ipcMain.handle("delete-user", (event, userId) => {
    let users = readUsers();
    users = users.filter((user) => user.id !== userId); // Remove the user
    writeUsers(users); // Write back to userData.json
  });

  // Handle read Tabs

  // Handle create Tabs

  ipcMain.handle("create-folder-and-file", async (event, tabData) => {
    try {
      const folderPath = path.join(__dirname, "tabs", tabData.title);
      const filePath = path.join(folderPath, `${tabData.title}.txt`);

      // Create the folder if it doesn't exist
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // Create a file with the data
      const fileContent = `Tab: ${tabData.title}\nDate: ${tabData.date}\nUser: ${tabData.value}\nId: ${tabData.id}`;
      fs.writeFileSync(filePath, fileContent, "utf-8");

      // After creating the folder and file, return the updated tabs
      const updatedTabs = await getTabs();
      return {
        success: true,
        message: "Folder and file created successfully",
        tabs: updatedTabs,
      };
    } catch (error) {
      console.error("Error creating folder or file:", error);
      return { success: false, message: "Error creating folder or file" };
    }
  });

  // delete folder

  ipcMain.handle("delete-tabs", async (event, tabId) => {
    try {
      const tabsDir = path.join(__dirname, "tabs");
      const folderNames = fs.readdirSync(tabsDir);

      for (const folder of folderNames) {
        const folderPath = path.join(tabsDir, folder);
        const stats = fs.statSync(folderPath);

        if (stats.isDirectory()) {
          const files = fs.readdirSync(folderPath);

          for (const file of files) {
            const filePath = path.join(folderPath, file);
            const fileStats = fs.statSync(filePath);

            if (fileStats.isFile() && file.endsWith(".txt")) {
              const fileContent = fs.readFileSync(filePath, "utf-8");
              const lines = fileContent.split("\n");
              const idLine = lines.find((line) =>
                line.trim().startsWith("Id: ")
              );

              if (idLine) {
                const idValue = idLine.split(":")[1].trim();
                const tabclear = tabId.trim();

                if (tabclear === idValue) {
                  fs.unlinkSync(filePath); // Delete file

                  const remaining = fs.readdirSync(folderPath);
                  if (remaining.length === 0) {
                    fs.rmdirSync(folderPath); // Delete folder if empty
                  }

                  break; // Exit loop once tab is deleted
                } else {
                  console.log("no id in file", filePath);
                }
              } else {
                console.log(`No ID line found in file: ${filePath}`);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error deleting tab:", error);
    }
  });

  ipcMain.handle("addMeasure", async (event, measureData) => {
    try {
      const basePath = path.join(__dirname, "tabs");
      const folders = fs.readdirSync(basePath, { withFileTypes: true });

      for (const folder of folders) {
        if (!folder.isDirectory()) continue;

        const folderPath = path.join(basePath, folder.name);
        const files = fs.readdirSync(folderPath);

        for (const file of files) {
          const filePath = path.join(folderPath, file);

          if (file.endsWith(".txt")) {
            const content = fs.readFileSync(filePath, "utf-8");

            if (content.includes(`Id: ${measureData.id}`)) {
              console.log(measureData);

              // Sprawdzenie, czy w pliku już istnieje pomiar z tą samą datą
              const regex = /data: (\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}:\d{2})/g;
              const existingDates = [];
              let match;
              while ((match = regex.exec(content)) !== null) {
                existingDates.push(match[1]); // Dodajemy wszystkie istniejące daty pomiarów
              }

              // Tworzymy datę nowego pomiaru
              const newDate = new Date().toLocaleString("pl-PL", {
                hour12: false,
              });

              // Sprawdzamy, czy nowa data już istnieje w pliku
              if (existingDates.includes(newDate)) {
                console.log(
                  "Pomiar z tą samą datą już istnieje. Pomiar nie zostanie dodany."
                );
                return {
                  success: false,
                  message: "Measurement with the same date already exists.",
                };
              }

              // Tworzymy nowy wpis pomiaru
              const measurementEntry = [
                "\n--- New Measurement ---",
                `Idm: ${measureData.id_measure}`,
                `Id: ${measureData.id}`,
                `x1: ${measureData.x1}`,
                `x2: ${measureData.x2}`,
                `y1: ${measureData.y1}`,
                `y2: ${measureData.y2}`,
                `data: ${newDate}`,
              ].join("\n");

              // Dopisujemy pomiar do pliku
              fs.appendFileSync(filePath, measurementEntry);
              console.log(`Measurement added to ${filePath}`);

              return {
                success: true,
                message: `Measurement added to file: ${file}`,
              };
            }
          }
        }
      }

      return { success: false, message: "ID not found in any folder." };
    } catch (err) {
      console.error("Error in addMeasure:", err);
      return { success: false, message: err.message };
    }
  });

  ipcMain.handle("getMeasurementsFromFile", async (event, id) => {
    console.log(id);
    try {
      const basePath = path.join(__dirname, "tabs");
      const folders = fs.readdirSync(basePath, { withFileTypes: true });

      for (const folder of folders) {
        if (!folder.isDirectory()) continue;

        const folderPath = path.join(basePath, folder.name);
        const files = fs.readdirSync(folderPath);

        for (const file of files) {
          const filePath = path.join(folderPath, file);

          if (file.endsWith(".txt")) {
            const content = fs.readFileSync(filePath, "utf-8");

            if (content.includes("Id:")) {
              console.log("Znaleziono Id w pliku", filePath);
              console.log(content);
            }

            if (content.includes(`Id: ${id}`)) {
              const blocks = content
                .split("--- New Measurement ---")
                .filter(Boolean);

              const measurements = blocks
                .map((block) => {
                  const idmMatch = block.match(/Idm:\s*(.*)/);
                  if (!idmMatch) return null;
                  const idm = idmMatch[1]?.trim();
                  const measurementId = block.match(/Id:\s*(.*)/)?.[1]?.trim();
                  const date = block.match(/data:\s*(.*)/)?.[1]?.trim();
                  const x1 = parseFloat(
                    block.match(/x1:\s*(-?\d+\.?\d*)/)?.[1]
                  );
                  const y1 = parseFloat(
                    block.match(/y1:\s*(-?\d+\.?\d*)/)?.[1]
                  );
                  const x2 = parseFloat(
                    block.match(/x2:\s*(-?\d+\.?\d*)/)?.[1]
                  );
                  const y2 = parseFloat(
                    block.match(/y2:\s*(-?\d+\.?\d*)/)?.[1]
                  );
                  return { idm, id: measurementId, date, x1, y1, x2, y2 };
                })
                .filter(Boolean);

              return { success: true, data: measurements };
            }
          }
        }
      }
      return {
        success: false,
        message: "No data found for the given ID.",
        data: [],
      };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message, data: [] };
    }
  });

  // delete measurment from file

  ipcMain.handle("deleteMeasure", async (event, id) => {
    console.log(id);
    try {
      const basePath = path.join(__dirname, "tabs");
      const folders = fs.readdirSync(basePath, { withFileTypes: true });

      let delated = false;
      let updateData = [];

      for (const folder of folders) {
        if (!folder.isDirectory()) continue;

        const folderPath = path.join(basePath, folder.name);
        const files = fs.readdirSync(folderPath);

        for (const file of files) {
          const filePath = path.join(folderPath, file);

          if (file.endsWith(".txt")) {
            const content = fs.readFileSync(filePath, "utf-8");

            if (content.includes("Idm:")) {
              console.log("find Idm");
              const blocks = content
                .split("--- New Measurement ---")
                .filter(Boolean);

              const updateBlocks = blocks.filter((block) => {
                const match = block.match(/Idm:\s*(.*)/);
                const measurementId = match ? match[1].trim() : null;
                console.log(measurementId, "id z pliku");

                if (!measurementId) return true;
                return measurementId !== id;
              });

              if (updateBlocks.length !== blocks.length) {
                delated = true;
                updateData = updateBlocks;
                const newContent = updateBlocks
                  .map((b) => b.trim())
                  .join("\n--- New Measurement ---\n");
                fs.writeFileSync(filePath, newContent, "utf-8");
              }
            }
          }
        }
      }

      if (delated) {
        return { success: false, data: updateData };
      } else {
        return { success: false, message: "Measurment not found" };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message };
    }
  });

  //  move folder to archive

  ipcMain.handle("move-folder-to-archive", async (event, data) => {
    const { name, folderDate } = data;
    console.log(name, "folder name");
    console.log(folderDate, "folder date");
    try {
      const tabsDir = path.join(__dirname, "tabs");
      console.log(tabsDir);
      const folderPath = path.join(tabsDir, name);
      console.log(folderPath);
      const archiveRoot = path.join(__dirname, "archive");

      if (!fs.existsSync(folderPath)) {
        return { success: false, message: "Folder not found" };
      }

      const dateObj = new Date(folderDate);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const archiveMonthFolder = `${year}-${month}`;

      const archivePath = path.join(archiveRoot, archiveMonthFolder);

      await fs.ensureDir(archivePath);

      const archiveFolder = path.join(archivePath, name);

      await fs.move(folderPath, archiveFolder);

      return {
        success: true,
        message: `Folder przeniesiony do ${archiveFolder}`,
      };
    } catch (err) {
      console.error("Error moving folder:", err);
      return { success: false, message: err.message };
    }
  });

  //  display archive tabs

  ipcMain.handle("archivefolders", async (event) => {
    try {
      const basePath = path.join(__dirname, "archive");
      const folders = fs.readdirSync(basePath, { withFileTypes: true });

      const folderNames = [];

      for (const folder of folders) {
        if (!folder.isDirectory()) continue;
        folderNames.push(folder.name);
      }
      return {
        success: true,
        message: "folders in UI",
        data: folderNames,
      };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message, data: [] };
    }
  });

  ipcMain.handle("archivePlaceData", async (event, folderName) => {
    try {
      const basePath = path.join(__dirname, "archive", folderName);
      const folders = fs.readdirSync(basePath, { withFileTypes: true });
      const subFolders = folders
        .filter((item) => item.isDirectory())
        .map((item) => item.name);

      return {
        success: true,
        message: "folders in UI",
        data: subFolders,
      };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message, data: [] };
    }
  });

  // Uncomment this line if you want to open DevTools automatically
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
