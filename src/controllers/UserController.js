import mongoose from 'mongoose'
import Person from "../models/PersonModel.js"
import Doctor from "../models/DoctorModel.js"
import User from "../models/UserModel.js"
import Specialty from '../models/SpecialtyModel.js'

export const getUsers = async (req, res) => {
    try {
        const users = await User.aggregate(
            [
                {
                    $project: { username: 0, password: 0}
                },
                {
                    $match: { active: { $eq: true }, role: { $ne: "DOCTOR"} }
                },
                {
                    $lookup: {
                        from: "people",
                        localField: "personId",
                        foreignField: "_id",
                        as: "personInfo"
                    }
                },
                {
                    $unwind: "$personInfo"
                }
            ])
        res.status(200).json(users);
    } catch(e) {
        res.status(404).json({message: e.message});
    }
}

export const createUser = async (req, res) => {
    const user = req.body;
    const { personInfo, doctorInfo } = user;
    const newPerson = new Person({
        DNI: personInfo.DNI,
        name: personInfo.name, 
        lastName: personInfo.lastName, 
        email: personInfo.email, 
        phone: personInfo.phone, 
        sex: personInfo.sex
    })
    
    try {
        const personCreated = await newPerson.save();
        let specialtyReferenced = null;

        let doctorCreated = null;
        if (user.role === "DOCTOR") {
            const newDoctor = new Doctor({
                code: doctorInfo.code,
                CMP: doctorInfo.CMP,
                specialtyId: doctorInfo.specialtyId
            })
            specialtyReferenced = await Specialty.findOne({_id: doctorInfo.specialtyId});
            if (!specialtyReferenced) return res.status(404).send(`No specialty with id: ${doctorInfo.specialtyId}`);
            doctorCreated = await newDoctor.save();
        }

        const newUser = new User({
            personId: personCreated._id,
            doctorId: doctorCreated ? doctorCreated._id : null,
            username: user.username,
            password: user.password,
            role: user.role
        })
        const userCreated = await newUser.save();
        res.status(201).json({
            user: userCreated, 
            doctorInfo: doctorCreated, 
            personInfo: personCreated,
            specialtyInfo: specialtyReferenced
        });
    } catch(e) {
        res.status(409).json({message: e.message});
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const user = req.body;
    const { personId, doctorId, role } = user;
    const { DNI, name, lastName, email, phone, sex } = user.personInfo;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${id}`);
    
    try {
        const updatedPerson = { DNI, name, lastName, email, phone, sex }; 
        if (!mongoose.Types.ObjectId.isValid(personId)) return res.status(404).send(`No person with id: ${personId}`);
        await Person.findOneAndUpdate({_id: personId}, updatedPerson, { new: true });

        if (role === "DOCTOR") {
            const { code, CMP, specialtyId } = user.doctorInfo;
            const updatedDoctor = { code, CMP, specialtyId };
            if (!mongoose.Types.ObjectId.isValid(doctorId)) return res.status(404).send(`No doctor with id: ${doctorId}`);
            const specialty = await Specialty.findOne({_id: specialtyId});
            if (!specialty) return res.status(404).send(`No specialty with id: ${specialtyId}`);

            await Doctor.findOneAndUpdate({_id: doctorId}, updatedDoctor, { new: true });
        }
        res.status(201).json("User updated successfully");
    } catch(e) {
        res.status(409).json({message: e.message});
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${id}`);
    
    try {
        const updatedUser = { active: false }; 
        await User.findOneAndUpdate({_id: id}, updatedUser, { new: true });
        
        res.status(200).json("User deleted successfully");
    } catch(e) {
        res.status(409).json({message: e.message});
    }
}
