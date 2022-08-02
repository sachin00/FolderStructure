const conn = require('../config/db')
const fs = require('fs');
const mime = require('mime')

conn.connect((err) => {
    if (err) 
        console.log(err)

    console.log("Connection successful...")
})


module.exports = SelectAllElements = (req) =>{
    return new Promise((resolve, reject)=>{
        conn.query(`SELECT * FROM FolderTable`,  (err, data)=>{
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};

module.exports = InsertFile = (req, parentFolderId) => {
    return new Promise((resolve, reject) => {
        let filename = req.file.originalname;
        let size = req.file.size;
        let format = req.file.mimetype;
        let d = new Date();
        let createdDate = d.toJSON().slice(0,19).replace('T',':');

        let sqlQuery = `INSERT INTO FileTable(Name, Format, Size, CreatedDate, FolderId) VALUES(
            '${filename}', '${format}', ${size}, '${createdDate}', ${parentFolderId}
        )`

        conn.query(sqlQuery,  (err, data)=>{
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    })
}

module.exports = InsertFolder = (foldername, parentFolderId) => {
    return new Promise((resolve, reject) => {
        let sqlQuery = `INSERT INTO FolderTable(Name, ParentFolderId) VALUES('${foldername}', ${parentFolderId})`

        conn.query(sqlQuery,  (err, data)=>{
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    })
}

module.exports = SelectAllFiles = () => {
    return new Promise((resolve, reject) => {
        let sqlQuery = `SELECT * FROM FileTable ORDER BY CreatedDate DESC`

        conn.query(sqlQuery,  (err, data)=>{
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    })
}

module.exports = FolderSize = (folderId) => {
    return new Promise((resolve, reject) => {
        let sqlQuery = `SELECT SUM(Size) AS Size FROM FileTable WHERE FolderId = ${folderId}`

        conn.query(sqlQuery,  (err, data)=>{
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    })
}

module.exports = DeleteFolder = (folderId) => {
    return new Promise((resolve, reject) => {
        let sqlQuery = `CALL DeleteFolder(${folderId})`;

        conn.query(sqlQuery,  (err, data)=>{
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    })
}

module.exports = RenameFolder = (folderId, newFolderName) => {
    return new Promise((resolve, reject) => {
        let sqlQuery = `UPDATE FolderTable SET Name = '${newFolderName}' WHERE Id = ${folderId} ;`

        conn.query(sqlQuery,  (err, data)=>{
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    })
}

module.exports = SaveFileData = (jsonData) => {
    fs.writeFileSync('jsonfile.json', jsonData)
    
    let stats = fs.statSync('jsonfile.json')
    let size = stats.size;
    let format = mime.getType('jsonfile.json')
    let filename = 'jsonfile'+Date.now().toString()+'.json'
    let d = new Date();
    let createdDate = d.toJSON().slice(0,19).replace('T',':');
    let parentFolderId = 1;
    
    fs.unlinkSync('jsonfile.json')

    return new Promise((resolve, reject) => {
        let sqlQuery = `INSERT INTO FileTable(Name, Format, Size, CreatedDate, FolderId) VALUES(
            '${filename}', '${format}', ${size}, '${createdDate}', ${parentFolderId}
        )`

        conn.query(sqlQuery,  (err, data)=>{
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    })
}
