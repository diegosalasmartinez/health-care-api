import mongoose from 'mongoose'
import Person from "../models/PersonModel.js"
import Patient from "../models/PatientModel.js"

export const getPatients = async (req, res) => {
    try {
        const users = await Patient.aggregate(
            [
                {
                    $match: { active: { $eq: true } }
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
                }
            ])
        res.status(200).json(users);
    } catch(e) {
        res.status(404).json({message: e.message});
    }
}

export const createPatient = async (req, res) => {
    const patient = req.body;
    const { personInfo } = patient;
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
        const newPatient = new User({
            personId: personCreated._id,
            clinicHistoryId: null,
            code: patient.code,
            allergies: patient.allergies,
            address: patient.address,
            birthday: patient.birthday,
            occupation: patient.occupation,
            civilStatus: patient.civilStatus,
            nationality: patient.nationality
        })
        const patientCreated = await newPatient.save();
        res.status(201).json({
            patient: patientCreated, 
            personInfo: personCreated
        });
    } catch(e) {
        res.status(409).json({message: e.message});
    }
}