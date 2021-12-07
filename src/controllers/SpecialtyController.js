import mongoose from 'mongoose'
import Specialty from "../models/SpecialtyModel.js"

export const getSpecialties = async (req, res) => {
    try {
        const specialties = await Specialty.find({
            active: { $eq: true }
        })
        res.status(200).json(specialties);
    } catch(e) {
        res.status(404).json({message: e.message});
    }
}

export const createSpecialty = async (req, res) => {
    const specialty = req.body;
    const newSpecialty = new Specialty({
        code: specialty.code,
        name: specialty.name, 
    })
    try {
        const specialtyCreated = await newSpecialty.save();
        res.status(201).json(specialtyCreated);
    } catch(e) {
        res.status(409).json({message: e.message});
    }
}

export const updateSpecialty = async (req, res) => {
    const { id } = req.params;
    const specialty = req.body;
    const { code, name } = specialty;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No specialty with id: ${id}`);
    
    try {
        const updatedSpecialty = { code, name };
        await Specialty.findOneAndUpdate({_id: id}, updatedSpecialty, { new: true });
        
        res.status(201).json("Specialty updated successfully");
    } catch(e) {
        res.status(409).json({message: e.message});
    }
}

export const deleteSpecialty = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No specialty with id: ${id}`);
    
    try {
        const updatedSpecialty = { active: false }; 
        await Specialty.findOneAndUpdate({_id: id}, updatedSpecialty, { new: true });
        
        res.status(200).json("Specialty deleted successfully");
    } catch(e) {
        res.status(409).json({message: e.message});
    }
}
