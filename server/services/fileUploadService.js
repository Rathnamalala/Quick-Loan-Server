const path = require('path');
const fs = require('fs');

const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
        const uploadPath = path.join(__dirname, '../uploads', file.originalname);

        fs.writeFile(uploadPath, file.buffer, (err) => {
            if (err) return reject(err);
            resolve(`/uploads/${file.originalname}`);
        });
    });
};

module.exports = { uploadFile };
