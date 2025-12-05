const Plan = require('../models/Plan');

// @desc    Get all plans (Public/Assigned)
// @route   GET /api/plans
// @access  Private
const getPlans = async (req, res) => {
    let query = { isPublic: true };

    // If Member, also show assigned plans
    if (req.user.role === 'member') {
        query = {
            $or: [
                { isPublic: true },
                { assignedTo: req.user._id }
            ]
        };
    } else {
        // Admin/Trainer can see all plans OR filter by what they created
        // For now, let's return all plans to admin/trainer
        query = {};
    }

    const plans = await Plan.find(query).populate('creator', 'name').populate('assignedTo', 'name');
    res.json(plans);
};

// @desc    Create a plan (Workout/Diet)
// @route   POST /api/plans
// @access  Private/Admin/Trainer
const createPlan = async (req, res) => {
    const { title, type, description, content, assignedTo, isPublic } = req.body;

    const plan = await Plan.create({
        title,
        type,
        description,
        content,
        creator: req.user._id,
        assignedTo: assignedTo || null,
        isPublic: isPublic !== undefined ? isPublic : true
    });

    if (plan) {
        res.status(201).json(plan);
    } else {
        res.status(400).json({ message: 'Invalid plan data' });
    }
};

// @desc    Update a plan
// @route   PUT /api/plans/:id
// @access  Private/Admin/Trainer
const updatePlan = async (req, res) => {
    const plan = await Plan.findById(req.params.id);

    if (plan) {
        if (req.user.role !== 'admin' && plan.creator.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        plan.title = req.body.title || plan.title;
        plan.type = req.body.type || plan.type;
        plan.description = req.body.description || plan.description;
        plan.content = req.body.content || plan.content;
        plan.assignedTo = req.body.assignedTo || plan.assignedTo;
        plan.isPublic = req.body.isPublic !== undefined ? req.body.isPublic : plan.isPublic;

        const updatedPlan = await plan.save();
        res.json(updatedPlan);
    } else {
        res.status(404).json({ message: 'Plan not found' });
    }
};

// @desc    Delete a plan
// @route   DELETE /api/plans/:id
// @access  Private/Admin/Trainer
const deletePlan = async (req, res) => {
    const plan = await Plan.findById(req.params.id);

    if (plan) {
        if (req.user.role !== 'admin' && plan.creator.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await plan.deleteOne();
        res.json({ message: 'Plan removed' });
    } else {
        res.status(404).json({ message: 'Plan not found' });
    }
};

module.exports = { getPlans, createPlan, updatePlan, deletePlan };
