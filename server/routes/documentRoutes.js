const express = require('express');
const {
    uploadDocument,
    getUserDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument
} = require('../controllers/documentController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const multer = require('multer');

// Multer configuration for file uploads (storing in memory)
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Create a document (Upload)
router.post('/upload', authenticateUser, upload.single('document'), uploadDocument);

// Read: Get all documents for a user
router.get('/', authenticateUser, getUserDocuments);

// Read: Get a specific document by ID
router.get('/:docId', authenticateUser, getDocumentById);

// Update a document (Verification status)
router.put('/:docId', authenticateUser, updateDocument);

// Delete a document
router.delete('/:docId', authenticateUser, deleteDocument);

module.exports = router;
