const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Festival = require('../DB/Festival');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'festival-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});


router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, slug, badge, description, features, price } = req.body;

        // Get image path or use default
        let imageUrl = 'https://placeholder.com/diwali.jpg';
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        // Parse features array
        let featuresArray = [];
        if (typeof features === 'string') {
            featuresArray = [features];
        } else if (Array.isArray(features)) {
            featuresArray = features;
        }

        // Map the flat React form data to your nested Mongoose schema
        const festivalData = new Festival({
            title,
            slug,
            imageUrl,
            badge,
            description,
            features: featuresArray,
            price: {
                amount: price,
                currency: 'INR'
            }
        });

        const savedFestival = await festivalData.save();
        res.status(201).json(savedFestival);
        
    } catch (err) {
        // Delete file if there was an error
        if (req.file) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting file:', unlinkErr);
            });
        }
        res.status(400).json({ 
            message: err.code === 11000 ? 'Slug must be unique' : err.message 
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const festivals = await Festival.find().sort({ createdAt: -1 });
        res.status(200).json(festivals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. GET SINGLE - Fetch one festival by ID or Slug
router.get('/:id', async (req, res) => {
    try {
        const festival = await Festival.findById(req.params.id);
        if (!festival) return res.status(404).json({ message: 'Festival not found' });
        res.status(200).json(festival);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. PUT - Update an existing festival
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, slug, badge, description, features, price } = req.body;

        // Get existing festival to check for old image
        const existingFestival = await Festival.findById(req.params.id);
        if (!existingFestival) return res.status(404).json({ message: 'Festival not found' });

        let imageUrl = existingFestival.imageUrl;
        
        // If new image is uploaded, use it and delete old one
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
            
            // Delete old image if it's not a placeholder
            if (existingFestival.imageUrl && existingFestival.imageUrl.startsWith('/uploads/')) {
                const oldImagePath = path.join(__dirname, '..', existingFestival.imageUrl);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error('Error deleting old image:', err);
                });
            }
        }

        // Parse features array
        let featuresArray = [];
        if (typeof features === 'string') {
            featuresArray = [features];
        } else if (Array.isArray(features)) {
            featuresArray = features;
        }

        // We map the incoming flat body to our nested structure again
        const updatedData = {
            title,
            slug,
            imageUrl,
            badge,
            description,
            features: featuresArray, 
            price: {
                amount: price,
                currency: 'INR'
            }
        };

        const updatedFestival = await Festival.findByIdAndUpdate(
            req.params.id, 
            updatedData, 
            { new: true, runValidators: true } // 'new' returns the updated document
        );

        res.status(200).json(updatedFestival);
    } catch (err) {
        // Delete file if there was an error
        if (req.file) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting file:', unlinkErr);
            });
        }
        res.status(400).json({ message: err.message });
    }
});

// 4. DELETE - Remove a festival
router.delete('/:id', async (req, res) => {
    try {
        const deletedFestival = await Festival.findByIdAndDelete(req.params.id);
        if (!deletedFestival) return res.status(404).json({ message: 'Festival not found' });
        
        // Delete uploaded image if it exists
        if (deletedFestival.imageUrl && deletedFestival.imageUrl.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, '..', deletedFestival.imageUrl);
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Error deleting image:', err);
            });
        }
        
        res.status(200).json({ message: 'Festival deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;