const Document = require('../models/documentModel');
const Loan = require('../models/loanModel');
const { uploadFile } = require('../services/fileUploadService'); // For handling file uploads

const uploadDocument = async (req, res) => {
    try {
      const { loan_id, document_type } = req.body;
  
      // Validate required fields
      if (!req.file || !loan_id || !document_type) {
        return res.status(400).json({ error: 'All fields are required.' });
      }
  
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ error: 'Invalid file type. Only PDF, JPEG, and PNG are allowed.' });
      }
      if (req.file.size > 5 * 1024 * 1024) { // 5MB size limit
        return res.status(400).json({ error: 'File size exceeds 5MB.' });
      }
  
      // Validate loan ID existence
      const loan = await Loan.findById(loan_id);
      if (!loan) {
        return res.status(404).json({ error: 'Associated loan not found.' });
      }
  
      // Save the document as binary data in the database
      const document = new Document({
        user_id: req.user.id,  // Assuming user is authenticated
        loan_id,
        document_type,
        document_data: req.file.buffer,  // Store file as binary data
        file_name: req.file.originalname,
        file_size: req.file.size,
        file_type: req.file.mimetype
      });
  
      // Save to the database
      await document.save();
  
      res.status(201).json({
        message: 'Document uploaded successfully',
        document
      });
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
      const document = await Document.findById(req.params.docId);
      if (!document) {
        return res.status(404).json({ error: 'Document not found.' });
      }
  
      // Set headers and send the file content (binary data)
      res.setHeader('Content-Type', document.file_type);
      res.setHeader('Content-Disposition', `attachment; filename="${document.file_name}"`);
      res.send(document.document_data);  // Send the binary data as file
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error retrieving document' });
    }
  };

  const updateDocument = async (req, res) => {
    try {
        const { docId } = req.params;
        const { verified } = req.body;

        // Find the document by ID
        const document = await Document.findById(docId);
        if (!document) {
            return res.status(404).json({ error: 'Document not found.' });
        }

        // Ensure the user is authorized to update the document
        if (document.user_id.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to update this document.' });
        }

        // Update the verification status if provided
        document.verified = verified === undefined ? document.verified : verified;

        // Save the updated document
        await document.save();

        // Return success message with updated document details
        res.status(200).json({
            message: 'Document updated successfully.',
            document
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating document.' });
    }
};


const deleteDocument = async (req, res) => {
    try {
        const { docId } = req.params;

        // Find the document by its ID
        const document = await Document.findById(docId);
        if (!document) {
            return res.status(404).json({ error: 'Document not found.' });
        }

        // Ensure the user is authorized to delete the document
        if (document.user_id.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to delete this document.' });
        }

        // Delete the document
        await document.deleteOne(); // This should be deleteOne() instead of remove()

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
