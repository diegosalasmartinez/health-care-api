import Doctor from "../models/DoctorModel.js";
import Person from "../models/PersonModel.js";
import User from "../models/UserModel.js"

export const getDoctors = async (req, res) => {
    try {
        const users = await User.aggregate(
            [
                {
                    $project: { username: 0, password: 0 }
                },
                {
                    $match: { doctorId: { $ne: null}, role: { $eq: "DOCTOR"} }
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
    const newPerson = new Person({
        DNI: user.DNI,
        name: user.name, 
        lastName: user.lastName, 
        email: user.email, 
        phone: user.phone, 
        sex: user.sex
    })
    const newDoctor = new Doctor({
        code: user.code,
        CMP: user.CMP,
        specialty: user.specialty
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
        res.status(201).json(userCreated);
    } catch(e) {
        res.status(409).json({message: e.message});
    }
}