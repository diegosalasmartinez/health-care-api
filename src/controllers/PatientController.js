const Person = require('../models/PersonModel')
const Patient = require('../models/PatientModel')

const getPatients = async (req, res) => {
    const { offset, limit, code, dni, name } = req.query;
    const matchOptions = {
        active: { $eq: true }
    }
    if (code) {
        matchOptions.code = { $regex: '.*' + code + '.*', $options: 'i' }
    }
    if (dni) {
        matchOptions["personInfo.DNI"] = { $regex: '.*' + dni + '.*', $options: 'i' }
    }
    if (name) {
        matchOptions["$expr"] = {
            "$regexMatch": {
                "input": "$fullName",
                "regex": '.*' + name + '.*',
                "options": "i"
            }
        }
    }
    const patientsResponse = await Patient.aggregate(
        [
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
                $addFields: {
                    fullName: { $concat: ["$personInfo.name", " ", "$personInfo.lastName"] }
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
    const patients = patientsResponse[0].data;
    const numPatients = patientsResponse[0].dataPrev.length > 0 ? patientsResponse[0].dataPrev[0].count : 0;
    res.status(200).json({patients, length: numPatients});
}

const createPatient = async (req, res) => {
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

    res.status(201).json({ patient: patientCreated, personInfo: personCreated });
}

const updatePatient = async (req, res) => {
    const { id } = req.params;
    const patient = req.body;
    const { personId, clinicHistory, code, allergies, address, birthday, occupation, civilStatus, nationality } = patient;
    const { DNI, name, lastName, email, phone, sex } = patient.personInfo;

    const updatedPerson = { DNI, name, lastName, email, phone, sex }; 
    await Person.findOneAndUpdate({_id: personId}, updatedPerson, { new: true });
    
    const updatedPatient = { code, allergies, address, birthday, occupation, civilStatus, nationality };
    await Patient.findOneAndUpdate({_id: id}, updatedPatient, { new: true });

    res.status(201).json({message: "Patient updated successfully"});
}

const deletePatient = async (req, res) => {
    const { id } = req.params;
    const updatedPatient = { active: false }; 
    await Patient.findOneAndUpdate({_id: id}, updatedPatient, { new: true });
    
    res.status(200).json({message: "Patient deleted successfully"});
}

module.exports = {
    getPatients,
    createPatient,
    updatePatient,
    deletePatient
}