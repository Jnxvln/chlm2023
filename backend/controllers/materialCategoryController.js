const asyncHandler = require('express-async-handler')
const MaterialCategory = require('../models/materialCategoryModel')

// @desc    Get material categories
// @route   GET /api/material-categories
// @access  Private
const getMaterialCategories = asyncHandler(async (req, res) => {
    const materialCategories = await MaterialCategory.find()

    res.status(200).send(materialCategories)
})

// @desc    Create material category
// @route   POST /api/material-categories
// @access  Private
const createMaterialCategory = asyncHandler(async (req, res) => {
    if (!req.body.name) {
        res.status(400)
        throw new Error('A category name is required')
    }

    const categoryExists = await MaterialCategory.findOne({
        name: { $regex: req.body.name, $options: 'i' },
    })

    if (categoryExists) {
        res.status(400)
        throw new Error('Category `name` already exists')
    }

    const materialCategory = await MaterialCategory.create({
        name: req.body.name,
        createdBy: req.user.id,
        updatedBy: req.user.id,
        isPublic: req.body.isPublic,
        isActive: req.body.isActive,
    })

    res.status(200).json(materialCategory)
})

// @desc    Update material category
// @route   PUT /api/material-categories/:id
// @access  Private
const updateMaterialCategory = asyncHandler(async (req, res) => {
    const materialCategory = await MaterialCategory.findById(req.params.id)

    if (!materialCategory) {
        res.status(400)
        throw new Error('Material category not found')
    }

    const updates = { ...req.body, updatedBy: req.user.id }

    const updatedMaterialCategory = await MaterialCategory.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true }
    )

    res.status(200).json(updatedMaterialCategory)
})

// @desc    Delete material category
// @route   DELETE /api/material-categories/:id
// @access  Private
const deleteMaterialCategory = asyncHandler(async (req, res) => {
    const materialCategory = await MaterialCategory.findById(req.params.id)

    if (!materialCategory) {
        res.status(400)
        throw new Error('Material category not found')
    }

    materialCategory.remove()

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getMaterialCategories,
    createMaterialCategory,
    updateMaterialCategory,
    deleteMaterialCategory,
}
