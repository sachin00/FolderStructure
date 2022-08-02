const express = require('express')
require('./controllers/actionsController')
const multer = require('multer')
const request = require('request')

const app = express()
app.use(express.json())

const upload = multer();

app.get('/', async (req, res) => {
    try {
        const rows = await SelectAllElements(req);
        res.send(rows)
    }
    catch(err) {
        res.status(404).send(err.message)
    }
})

app.post('/savefileorfolder', upload.single('File'), async (req, res) => {
    try {
        const reqData = JSON.parse(JSON.stringify(req.body));

        if (req.file === undefined) {
            await InsertFolder(reqData.Folder, reqData.ParentFolderId)
        }
        else {
            await InsertFile(req, reqData.ParentFolderId)
        }

        res.send(true)
    }
    catch (err) {
        res.status(404).send(err.message)
    }
})

app.get('/getAllFiles', async (req, res) => {
    try {
        const rows = await SelectAllFiles();
        res.send(rows)
    }
    catch(err) {
        res.status(404).send(err.message)
    }
})

app.get('/foldersize', async (req, res) => {
    try {
        const rows = await FolderSize(req.query.FolderId);
        res.send(rows[0])
    }
    catch(err) {
        res.status(404).send(err.message)
    }
})

app.delete('/deleteFolder', async (req, res) => {
    try {
        await DeleteFolder(req.query.FolderId);
        res.send(true)
    }
    catch(err) {
        res.status(404).send(err.message)
    }
})

app.put('/renameFolder', async (req, res) => {
    try {
        await RenameFolder(req.body.FolderId, req.body.NewFolderName);
        res.send(true)
    }
    catch(err) {
        res.status(404).send(err.message)
    }
})

app.get('/storeDataInJsonFiles', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/mralexgray/repos`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        }

        request(options, (error, response, body) => {
            if (error)
                console.error(error);

            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No Data' })
            }

            const jsonData = JSON.parse(JSON.stringify(body));

            SaveFileData(jsonData);
            
            res.send(true)
        })
    }
    catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

app.listen(9999, () => console.log(`Server started on http://localhost:9999`))

