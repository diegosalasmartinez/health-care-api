const mongoose = require('mongoose')
const Appointment = require('../models/AppointmentModel');
const User = require('../models/UserModel');

const getBestDoctors = async (req, res) => {
    const doctorsResponse = await Appointment.aggregate([
        {
            $match: { date: { $lte: new Date() } }
        },
        {
            $lookup: {
                from: "users",
                localField: "doctorId",
                foreignField: "_id",
                as: "doctor",
            }
        },
        {
            $unwind: "$doctor"
        },
        {
            $lookup: {
                from: "people",
                localField: "doctor.personId",
                foreignField: "_id",
                as: "doctor.personInfo",
            }
        },
        {
            $unwind: "$doctor.personInfo"
        },
        {
            $lookup: {
                from: "doctors",
                localField: "doctor.doctorId",
                foreignField: "_id",
                as: "doctor.doctorInfo",
            }
        },
        {
            $unwind: "$doctor.doctorInfo"
        },
        {
            $lookup: {
                from: "specialties",
                localField: "doctor.doctorInfo.specialtyId",
                foreignField: "_id",
                as: "doctor.doctorInfo.specialtyInfo",
            }
        },
        {
            $unwind: "$doctor.doctorInfo.specialtyInfo"
        },
        {
            $project: { 
                "doctorId": 1, 
                "doctor.personInfo.DNI": 1, 
                "doctor.personInfo.name": 1, 
                "doctor.personInfo.lastName": 1, 
                "doctor.doctorInfo.code": 1, 
                "doctor.doctorInfo.CMP": 1, 
                "doctor.doctorInfo.specialtyInfo.code": 1, 
                "doctor.doctorInfo.specialtyInfo.name": 1, 
            }
        },
        {
            $group: {
                _id: "$doctorId",
                doctor: { $first: "$doctor" },
                count: { $sum: 1 }
            }
        },
        {
            $limit: 10
        }
    ])
    res.status(200).json(doctorsResponse);
}

module.exports = {
    getBestDoctors,
}