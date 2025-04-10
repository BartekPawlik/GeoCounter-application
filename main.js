const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { readUsers, writeUsers } = require('./fsUserHandler.js');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,  // Ensures security by disabling nodeIntegration
      contextIsolation: true,
    }
  });

  win.loadURL('http://localhost:5173');

  ipcMain.handle('get-users', () => {
    return readUsers();
  });

  // Handle adding a new user
  ipcMain.handle('add-user', (event, newUser) => {
    const users = readUsers();
    users.push(newUser);  // Add the new user
    writeUsers(users);  // Write back to userData.json
  });

  // Handle deleting a user
  ipcMain.handle('delete-user', (event, userId) => {
    let users = readUsers();
    users = users.filter(user => user.id !== userId);  // Remove the user
    writeUsers(users);  // Write back to userData.json
  });


// Handle read Tabs

  ipcMain.handle('get-tabs', async () => {
    try {
      const tabsDir = path.join(__dirname, 'tabs');
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


            if (fileStats.isFile() && file.endsWith('.txt')) {
              const fileContent = fs.readFileSync(filePath, 'utf-8');

              const [tab, date, user] = fileContent.split('\n');


              const id = path.basename(file, '.txt');

              tabs.push({
                id: id,
                title: tab.split(': ')[1],
                value: user.split(': ')[1],
                date: date.split(': ')[1],
                archived: false,
              });
            }
          }
        }
      }

      return tabs;
    } catch (error) {
      console.error('Error reading tabs:', error);
      return [];
    }
  });


// Handle create Tabs

  ipcMain.handle('create-folder-and-file', async (event, tabData) => {
  try {
    const folderPath = path.join(__dirname, 'tabs', tabData.title);
    const filePath = path.join(folderPath, `${tabData.title}.txt`);

    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Create a file with the data
    const fileContent = `Tab: ${tabData.title}\nDate: ${tabData.date}\nUser: ${tabData.value}\nId: ${tabData.id}`;
    fs.writeFileSync(filePath, fileContent, 'utf-8');

    // After creating the folder and file, return the updated tabs
    const updatedTabs = await getTabs();  // Retrieve the tabs again to refresh
    return { success: true, message: 'Folder and file created successfully', tabs: updatedTabs };
  } catch (error) {
    console.error('Error creating folder or file:', error);
    return { success: false, message: 'Error creating folder or file' };
  }
});


// ipcMain.handle('delete-tabs', (event, 'tabs') => {

// })

  // Uncomment this line if you want to open DevTools automatically
  win.webContents.openDevTools();
}



app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});



