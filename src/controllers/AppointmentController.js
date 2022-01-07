const Appointment = require('../models/AppointmentModel');
const { appointmentStatusObjects } = require('../utils');

const getAppointments = async (req, res) => {
    const appointments = await Appointment.find({
        active: { $eq: true }
    })
    res.status(200).json(appointments);
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

// const updateSpecialty = async (req, res) => {
//     const { id } = req.params;
//     const specialty = req.body;
//     const { code, name } = specialty;
//     const updatedSpecialty = { code, name };

//     await Specialty.findOneAndUpdate({_id: id}, updatedSpecialty, { new: true });
//     res.status(201).json({message: "Specialty updated successfully"});
// }

// const deleteSpecialty = async (req, res) => {
//     const { id } = req.params;
//     const updatedSpecialty = { active: false }; 

//     await Specialty.findOneAndUpdate({_id: id}, updatedSpecialty, { new: true });
//     res.status(200).json({message: "Specialty deleted successfully"});
// }

module.exports = {
    getAppointments,
    createAppointment,
    // updateSpecialty,
    // deleteSpecialty
}