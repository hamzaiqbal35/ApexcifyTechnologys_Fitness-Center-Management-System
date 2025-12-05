const Class = require('../models/Class');
const Booking = require('../models/Booking');

// @desc    Get all classes
// @route   GET /api/classes
// @access  Public
const getClasses = async (req, res) => {
    const classes = await Class.find({}).populate('trainer', 'name specialization');
    res.json(classes);
};

// @desc    Get single class
// @route   GET /api/classes/:id
// @access  Public
const getClassById = async (req, res) => {
    const singleClass = await Class.findById(req.params.id).populate('trainer', 'name specialization');
    if (singleClass) {
        res.json(singleClass);
    } else {
        res.status(404).json({ message: 'Class not found' });
    }
};

// @desc    Create a class
// @route   POST /api/classes
// @access  Private/Admin/Trainer
const createClass = async (req, res) => {
    const { name, description, startTime, duration, capacity } = req.body;

    const newClass = new Class({
        name,
        description,
        startTime,
        duration,
        capacity,
        trainer: req.user._id // Assuming the creator is the trainer, or Admin assigning
    });

    const createdClass = await newClass.save();
    res.status(201).json(createdClass);
};

// @desc    Update a class
// @route   PUT /api/classes/:id
// @access  Private/Admin/Trainer (Owner)
const updateClass = async (req, res) => {
    const { name, description, startTime, duration, capacity } = req.body;
    const classItem = await Class.findById(req.params.id);

    if (classItem) {
        // Check if user is admin or the trainer who created it
        if (req.user.role !== 'admin' && classItem.trainer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this class' });
        }

        classItem.name = name || classItem.name;
        classItem.description = description || classItem.description;
        classItem.startTime = startTime || classItem.startTime;
        classItem.duration = duration || classItem.duration;
        classItem.capacity = capacity || classItem.capacity;

        const updatedClass = await classItem.save();
        res.json(updatedClass);
    } else {
        res.status(404).json({ message: 'Class not found' });
    }
};

// @desc    Delete a class
// @route   DELETE /api/classes/:id
// @access  Private/Admin/Trainer (Owner)
const deleteClass = async (req, res) => {
    const classItem = await Class.findById(req.params.id);

    if (classItem) {
        if (req.user.role !== 'admin' && classItem.trainer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this class' });
        }

        await classItem.deleteOne();
        res.json({ message: 'Class removed' });
    } else {
        res.status(404).json({ message: 'Class not found' });
    }
};

module.exports = { getClasses, getClassById, createClass, updateClass, deleteClass };
