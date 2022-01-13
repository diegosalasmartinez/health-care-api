const mongoose = require('mongoose')
const Appointment = require('../models/AppointmentModel');
const { appointmentStatusObjects, rolesObjects } = require('../utils');

const getAppointments = async (req, res) => {
    await fetchAppointments(req, res, appointmentStatusObjects.CREATED)
}

const getAppointmentsCompleted = async (req, res) => {
    await fetchAppointments(req, res, appointmentStatusObjects.FINISHED)
}

const fetchAppointments = async (req, res, status) => {
    const { offset, limit, patient, doctor } = req.query;
    const matchOptions = {
        active: { $eq: true },
        status: { $eq: status }
    }
    if (patient) {
        matchOptions["$expr"] = {
            "$regexMatch": {
                "input": "$patientInfo.fullName",
                "regex": '.*' + patient + '.*',
                "options": "i"
            }
        }
    }
    if (req.user.role === rolesObjects.DOCTOR) {
        matchOptions.doctorId = { $eq: mongoose.Types.ObjectId(req.user._id) }
    } else if (doctor) {
        matchOptions["$expr"] = {
            "$regexMatch": {
                "input": "$doctorInfo.fullName",
                "regex": '.*' + doctor + '.*',
                "options": "i"
            }
        }
    }
    const appointmentsResponse = await Appointment.aggregate([
        {
            $lookup: {
                from: "patients",
                localField: "patientId",
                foreignField: "_id",
                as: "patientInfo"
            }
        },
        {
            $unwind: "$patientInfo"
        },
        {
            $lookup: {
                from: "people",
                localField: "patientInfo.personId",
                foreignField: "_id",
                as: "patientInfo.personInfo"
            }
        },
        {
            $unwind: "$patientInfo.personInfo"
        },
        {
            $lookup: {
                from: "users",
                localField: "doctorId",
                foreignField: "_id",
                as: "doctorInfo"
            }
        },
        {
            $unwind: "$doctorInfo"
        },
        {
            $lookup: {
                from: "people",
                localField: "doctorInfo.personId",
                foreignField: "_id",
                as: "doctorInfo.personInfo"
            }
        },
        {
            $unwind: "$doctorInfo.personInfo"
        },
        {
            $lookup: {
                from: "users",
                localField: "secretaryId",
                foreignField: "_id",
                as: "secretaryInfo"
            }
        },
        {
            $unwind: "$secretaryInfo"
        },
        {
            $lookup: {
                from: "people",
                localField: "secretaryInfo.personId",
                foreignField: "_id",
                as: "secretaryInfo.personInfo"
            }
        },
        {
            $unwind: "$secretaryInfo.personInfo"
        },
        {
            $addFields: {
                "patientInfo.fullName": { $concat: ["$patientInfo.personInfo.name", " ", "$patientInfo.personInfo.lastName"] },
                "doctorInfo.fullName": { $concat: ["$doctorInfo.personInfo.name", " ", "$doctorInfo.personInfo.lastName"] }
            }
        },
        {
            $match: matchOptions
        },
        {
            $facet: {
                dataPrev: [ { $count: "count" } ],
                data: [
                    { $skip: parseInt(offset) },
                    { $limit: parseInt(limit) }
                ]
            }
        }
    ])

    const appointments = appointmentsResponse[0].data;
    const numAppointments = appointmentsResponse[0].dataPrev.length > 0 ? appointmentsResponse[0].dataPrev[0].count : 0;
    res.status(200).json({appointments, length: numAppointments});
}

const createAppointment = async (req, res) => {
    const appointment = req.body;
    const newAppointment = new Appointment({
        doctorId: appointment.doctorInfo._id,
        secretaryId: req.user._id,
        patientId: appointment.patientInfo._id,
        floor: appointment.floor,
        room: appointment.room,
        date: appointment.date,
        time: appointment.time,
        status: appointmentStatusObjects.CREATED, 
    })
    const appointmentCreated = await newAppointment.save();
    res.status(201).json(appointmentCreated);
}

const updateAppointment = async (req, res) => {
    const { id } = req.params;
    const appointment = req.body;
    const { doctorInfo, patientInfo, floor, room, date, time } = appointment;
    const updatedAppointment = { doctorId: doctorInfo._id, patientId: patientInfo._id, floor, room, date, time };

    await Appointment.findOneAndUpdate({_id: id}, updatedAppointment, { new: true });
    res.status(201).json({message: "Appointment updated successfully"});
}

const completeAppointment = async (req, res) => {
    const { id } = req.params;
    const appointment = req.body;
    const updatedAppointment = { details: appointment.details, status: appointmentStatusObjects.FINISHED };

    await Appointment.findOneAndUpdate({_id: id}, updatedAppointment, { new: true });
    res.status(201).json({message: "Appointment completed successfully"});
}

const deleteAppointment = async (req, res) => {
    const { id } = req.params;
    const updatedAppointment = { status: appointmentStatusObjects.CANCELLED }; 

    await Appointment.findOneAndUpdate({_id: id}, updatedAppointment, { new: true });
    res.status(200).json({message: "Specialty deleted successfully"});
}

module.exports = {
    getAppointments,
    getAppointmentsCompleted,
    createAppointment,
    updateAppointment,
    completeAppointment,
    deleteAppointment
}