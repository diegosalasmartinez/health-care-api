const Person = require('../models/PersonModel')
const Doctor = require('../models/DoctorModel')
const User = require('../models/UserModel')
const Specialty = require('../models/SpecialtyModel')
const { rolesObjects } = require('../utils/index')
const { BadRequestError, NotFoundError } = require('../errors')

const getUsers = async (req, res) => {
    const { offset, limit, dni, name, role } = req.query;
    const matchOptions = {
        active: { $eq: true },
        role: { $ne: rolesObjects.DOCTOR }
    }
    if (role) {
        matchOptions.role = {...matchOptions.role, $eq: role }
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

    const usersResponse = await User.aggregate([
        {
            $project: { username: 0, password: 0}
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

    const users = usersResponse[0].data;
    const numUsers = usersResponse[0].dataPrev.length > 0 ? usersResponse[0].dataPrev[0].count : 0;
    res.status(200).json({users, length: numUsers});
}

const createUser = async (req, res) => {
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

    const personCreated = await newPerson.save();

    let specialtyReferenced = null;
    let doctorCreated = null;
    if (user.role === rolesObjects.DOCTOR) {
        const newDoctor = new Doctor({
            code: doctorInfo.code,
            CMP: doctorInfo.CMP,
            specialtyId: doctorInfo.specialtyId
        })
        specialtyReferenced = await Specialty.findOne({_id: doctorInfo.specialtyId});
        if (!specialtyReferenced) throw new NotFoundError(`No specialty with id: ${doctorInfo.specialtyId}`);
        await Specialty.findByIdAndUpdate(doctorInfo.specialtyId, { $inc: { numDoctors: 1 }});
        
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
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const user = req.body;
    const { personId, doctorId, role } = user;
    const { DNI, name, lastName, email, phone, sex } = user.personInfo;

    const updatedPerson = { DNI, name, lastName, email, phone, sex }; 
    await Person.findOneAndUpdate({_id: personId}, updatedPerson, { new: true });

    if (role === rolesObjects.DOCTOR) {
        const { code, CMP, specialtyId } = user.doctorInfo;
        const updatedDoctor = { code, CMP, specialtyId };
        const specialty = await Specialty.findOne({_id: specialtyId});
        if (!specialty) throw new NotFoundError(`No specialty with id: ${specialtyId}`);

        const prevDoctor = await Doctor.findById(doctorId);
        if (specialtyId !== prevDoctor.specialtyId) {
            await Specialty.findByIdAndUpdate(prevDoctor.specialtyId, { $inc: { numDoctors: -1 }});
            await Specialty.findByIdAndUpdate(specialtyId, { $inc: { numDoctors: 1 }});
        }
        await Doctor.findOneAndUpdate({_id: doctorId}, updatedDoctor, { new: true });
    }
    res.status(201).json({message: "User updated successfully"});
}

const changePassword = async (req, res) => {
    const { user } = req;
    const { password } = req.body;

    const actualUser = await User.findById(user._id);
    const passwordsMatch = await actualUser.comparePassword(password);
    if (passwordsMatch) {
        throw new BadRequestError("The new password you entered is the same as your old password. Enter a different password.")
    } else {
        const encryptedPassword = await actualUser.encryptPassword(password);
        await User.findOneAndUpdate({_id: user._id}, { password: encryptedPassword }, { new: true });
        res.status(201).json({message: "Password changed successfully"});
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const updatedUser = { active: true }; 
    const user = await User.findOneAndUpdate({_id: id}, updatedUser, { new: true });
    if (user.role === rolesObjects.DOCTOR) {
        const doctor = await Doctor.findById(user.doctorId);
        await Specialty.findByIdAndUpdate(doctor.specialtyId, { $inc: { numDoctors: -1 }});
    }
    res.status(200).json({message: "User deleted successfully"});
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    changePassword,
    deleteUser
}