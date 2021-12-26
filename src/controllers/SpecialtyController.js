const mongoose = require('mongoose')
const Specialty = require('../models/SpecialtyModel')

const getSpecialties = async (req, res) => {
    const specialties = await Specialty.find({
        active: { $eq: true }
    })
    res.status(200).json(specialties);
}

const createSpecialty = async (req, res) => {
    const specialty = req.body;
    const newSpecialty = new Specialty({
        code: specialty.code,
        name: specialty.name, 
    })

    const specialtyCreated = await newSpecialty.save();
    res.status(201).json(specialtyCreated);
}

const updateSpecialty = async (req, res) => {
    const { id } = req.params;
    const specialty = req.body;
    const { code, name } = specialty;
    const updatedSpecialty = { code, name };

    await Specialty.findOneAndUpdate({_id: id}, updatedSpecialty, { new: true });
    res.status(201).json("Specialty updated successfully");
}

const deleteSpecialty = async (req, res) => {
    const { id } = req.params;
    const updatedSpecialty = { active: false }; 

    await Specialty.findOneAndUpdate({_id: id}, updatedSpecialty, { new: true });
    res.status(200).json("Specialty deleted successfully");
}

module.exports = {
    getSpecialties,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty
}