import mongoose from 'mongoose'
import Person from "../models/PersonModel.js"
import Doctor from "../models/DoctorModel.js"
import User from "../models/UserModel.js"

export const getUsers = async (req, res) => {
    try {
        const users = await User.aggregate(
            [
                {
                    $project: { username: 0, password: 0}
                },
                {
                    $match: { active: { $eq: true } }
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
    const newPerson = new Person({
        DNI: user.DNI,
        name: user.name, 
        lastName: user.lastName, 
        email: user.email, 
        phone: user.phone, 
        sex: user.sex
    })
    try {
        const personCreated = await newPerson.save();
        const newUser = new User({
            personId: personCreated._id,
            doctorId: null,
            username: user.username,
            password: user.password,
            role: user.role
        })
        const userCreated = await newUser.save();
        res.status(201).json(userCreated);
    } catch(e) {
        res.status(409).json({message: e.message});
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const user = req.body;
    const { personId, doctorId, role } = user;
    const { DNI, name, lastName, email, phone, sex } = user.personInfo;
    const { code, CMP, specialty } = user.doctorInfo;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${id}`);
    
    try {
        const updatedPerson = { DNI, name, lastName, email, phone, sex }; 
        if (!mongoose.Types.ObjectId.isValid(personId)) return res.status(404).send(`No person with id: ${personId}`);
        await Person.findOneAndUpdate({_id: personId}, updatedPerson, { new: true });
        
        if (role === "DOCTOR") {
            const updatedDoctor = { code, CMP, specialty };
            if (!mongoose.Types.ObjectId.isValid(doctorId)) return res.status(404).send(`No doctor with id: ${doctorId}`);
            await Doctor.findOneAndUpdate({_id: doctorId}, updatedDoctor, { new: true });
        }
        res.status(201).json("User updated successfully");
    } catch(e) {
        res.status(409).json({message: e.message});
    }
}
