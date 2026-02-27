const express = require('express');
const router = express.Router();
const Booking = require('../DB/Booking'); 


router.post('/', async (req, res) => {
    try {
        // Destructure fields from request body for validation
        const { fullName, email, phoneNumber, checkIn, checkOut, experience, message } = req.body;

        // Basic server-side validation
        if (!fullName || !email || !phoneNumber) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide Name, Email, and Phone Number." 
            });
        }

        const newBooking = new Booking({
            fullName,
            email,
            phoneNumber,
            checkIn,
            checkOut,
            experience,
            message
        });

        const savedBooking = await newBooking.save();

        res.status(201).json({
            success: true,
            message: "Inquiry submitted successfully!",
            data: savedBooking
        });

    } catch (error) {
        console.error("POST Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
});


router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // returns the modified document and runs schema checks
        );

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.status(200).json({
            success: true,
            message: "Booking updated successfully",
            data: updatedBooking
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

        if (!deletedBooking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.status(200).json({
            success: true,
            message: "Booking deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;