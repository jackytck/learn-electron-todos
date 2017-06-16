const electron = require('electron')

const {
  app,
  BrowserWindow,
  ipcMain,
  Menu
} = electron

let mainWindow
let addWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({})
  mainWindow.loadURL(`file://${__dirname}/main.html`)
  mainWindow.on('closed', () => app.quit())

  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)
})

function createAddWindow () {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add New Todo'
  })
  addWindow.loadURL(`file://${__dirname}/add.html`)
  addWindow.on('closed', () => addWindow = null)
}

function clearTodo () {
  mainWindow.webContents.send('todo:clear')
}

ipcMain.on('todo:add', (event, todo) => {
  mainWindow.webContents.send('todo:add', todo)
  addWindow.close()
})

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Todo',
        accelerator: 'CommandOrControl+N',
        click () {
          createAddWindow()
        }
      },
      {
        label: 'Clear Todos',
        click () {
          clearTodo()
        }
      },
      {
        label: 'Quit',
        accelerator: 'CommandOrControl+Q',
        click () {
          app.quit()
        }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  menuTemplate.unshift({})
}

if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'View',
    submenu: [
      { role: 'reload' },
      {
        label: 'Toggle Devleoper Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      }
    ]
  })
}
