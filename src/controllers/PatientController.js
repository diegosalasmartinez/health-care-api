import mongoose from 'mongoose'
import Person from "../models/PersonModel.js"
import Patient from "../models/PatientModel.js"

export const getPatients = async (req, res) => {
    try {
        const patients = await Patient.aggregate(
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
        res.status(200).json(patients);
    } catch(e) {
        res.status(404).json({message: e.message});
    }
}

export const createPatient = async (req, res) => {
    const patient = req.body;
    const { personInfo, clinicHistory } = patient;
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
        const newPatient = new Patient({
            personId: personCreated._id,
            clinicHistory: {
                reason: clinicHistory.reason,
                currentIllness: clinicHistory.currentIllness,
                historyDesease: clinicHistory.historyDesease,
                alcohol: clinicHistory.alcohol,
                smoke: clinicHistory.smoke,
                drugs: clinicHistory.drugs,
                sexuality: clinicHistory.sexuality,
                others: clinicHistory.others
            },
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

export const updatePatient = async (req, res) => {
    const { id } = req.params;
    const patient = req.body;
    const { personId, clinicHistory, code, allergies, address, birthday, occupation, civilStatus, nationality } = patient;
    const { DNI, name, lastName, email, phone, sex } = patient.personInfo;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No patient with id: ${id}`);
    
    try {
        const updatedPerson = { DNI, name, lastName, email, phone, sex }; 
        if (!mongoose.Types.ObjectId.isValid(personId)) return res.status(404).send(`No person with id: ${personId}`);
        await Person.findOneAndUpdate({_id: personId}, updatedPerson, { new: true });
        
        const updatedPatient = { code, allergies, address, birthday, occupation, civilStatus, nationality };
        await Patient.findOneAndUpdate({_id: id}, updatedPatient, { new: true });

        res.status(201).json("Patient updated successfully");
    } catch(e) {
        res.status(409).json({message: e.message});
    }
}

export const deletePatient = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No patient with id: ${id}`);
    
    try {
        const updatedPatient = { active: false }; 
        await Patient.findOneAndUpdate({_id: id}, updatedPatient, { new: true });
        
        res.status(200).json("Patient deleted successfully");
    } catch(e) {
        res.status(409).json({message: e.message});
    }
}
