import mongoose from 'mongoose'
import Doctor from "../models/DoctorModel.js"
import Person from "../models/PersonModel.js"
import User from "../models/UserModel.js"

export const getDoctors = async (req, res) => {
    try {
        const users = await User.aggregate(
            [
                {
                    $project: { username: 0, password: 0 }
                },
                {
                    $match: { doctorId: { $ne: null}, role: { $eq: "DOCTOR"}, active: { $eq: true } }
                },
                {
                    $lookup: {
                        from: "people",
                        localField: "personId",
                        foreignField: "_id",
                        as: "personInfo",
                    }
                },
                {
                    $unwind: "$personInfo"
                },
                {
                    $lookup: {
                        from: "doctors",
                        localField: "doctorId",
                        foreignField: "_id",
                        as: "doctorInfo",
                    }
                },
                {
                    $unwind: "$doctorInfo"
                }
            ])
        res.status(200).json(users);
    } catch(e) {
        res.status(404).json({message: e.message});
    }
}

export const createDoctor = async (req, res) => {
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
    const newDoctor = new Doctor({
        code: doctorInfo.code,
        CMP: doctorInfo.CMP,
        specialty: doctorInfo.specialty
    })
    try {
        const personCreated = await newPerson.save();
        const doctorCreated = await newDoctor.save();
        const newUser = new User({
            personId: personCreated._id,
            doctorId: doctorCreated._id,
            username: user.username,
            password: user.password,
            role: user.role
        })
        const userCreated = await newUser.save();
        res.status(201).json({
            user: userCreated, 
            doctorInfo: doctorCreated, 
            personInfo: personCreated
        });
    } catch(e) {
        res.status(409).json({message: e.message});
    }
}
