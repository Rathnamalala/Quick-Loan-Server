const Document = require('../models/documentModel');
const Loan = require('../models/loanModel');
const { uploadFile } = require('../services/fileUploadService'); // For handling file uploads

// Create a Document
const uploadDocument = async (req, res) => {
    try {
        const { loan_id, document_type } = req.body;

        // Validate required fields
        if (!req.file || !loan_id || !document_type) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Validate file type and size
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, and PDF are allowed.' });
        }
        if (req.file.size > 5 * 1024 * 1024) { // 5MB size limit
            return res.status(400).json({ error: 'File size exceeds 5MB.' });
        }

        // Validate Loan ID existence
        const loan = await Loan.findById(loan_id);
        if (!loan) {
            return res.status(404).json({ error: 'Associated loan not found.' });
        }

        // Save the file and create the document entry
        const documentUrl = await uploadFile(req.file);

        const document = await Document.create({
            user_id: req.user.id,
            loan_id,
            document_type,
            document_url: documentUrl,
        });

        res.status(201).json({ message: 'Document uploaded successfully', document });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error uploading document' });
    }
};

// Get All Documents for a User
const getUserDocuments = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Pagination
        const documents = await Document.find({ user_id: req.user.id })
            .populate('loan_id', 'personal_details')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching user documents' });
    }
};

// Get Specific Document by ID
const getDocumentById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.docId).populate('loan_id', 'personal_details');
        if (!document) return res.status(404).json({ error: 'Document not found.' });

        // Ensure the user is authorized to access the document
        if (document.user_id.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized access to this document.' });
        }

        res.status(200).json(document);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching document details' });
    }
};

// Update Document Verification Status
const updateDocument = async (req, res) => {
    try {
        const { docId } = req.params;
        const { verified } = req.body;

        const document = await Document.findById(docId);
        if (!document) return res.status(404).json({ error: 'Document not found.' });

        // Ensure the user is authorized to update the document
        if (document.user_id.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to update this document.' });
        }

        // Update the verification status
        document.verified = verified !== undefined ? verified : document.verified;
        await document.save();

        res.status(200).json({ message: 'Document updated successfully', document });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating document' });
    }
};

// Delete a Document
const deleteDocument = async (req, res) => {
    try {
        const { docId } = req.params;

        const document = await Document.findById(docId);
        if (!document) return res.status(404).json({ error: 'Document not found.' });

        // Ensure the user is authorized to delete the document
        if (document.user_id.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to delete this document.' });
        }

        await document.remove();
        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting document' });
    }
};

module.exports = {
    uploadDocument,
    getUserDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
};
