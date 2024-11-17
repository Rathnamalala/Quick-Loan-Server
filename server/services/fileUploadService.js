const path = require('path');
const fs = require('fs');

const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
        // Check if file is present and validate its type and size
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
            return reject(new Error('Invalid file type'));
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            return reject(new Error('File size exceeds 5MB'));
        }

        // Ensure the uploads directory exists
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate a unique file name to prevent overwriting
        const timestamp = Date.now();
        const fileName = `${timestamp}-${path.basename(file.originalname)}`;
        const uploadPath = path.join(uploadDir, fileName);

        // Write the file to the disk
        fs.writeFile(uploadPath, file.buffer, (err) => {
            if (err) return reject(err);
            resolve(`/uploads/${fileName}`);
        });
    });
};

module.exports = { uploadFile };
