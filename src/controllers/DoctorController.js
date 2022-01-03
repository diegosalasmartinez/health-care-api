const mongoose = require('mongoose')
const User = require('../models/UserModel');
const { rolesObjects } = require('../utils');

const getDoctors = async (req, res) => {
    const { offset, limit, code, name, specialtyId } = req.query;
    const matchOptions = {
        active: { $eq: true },
        doctorId: { $ne: null},
        role: { $eq: rolesObjects.DOCTOR }
    }
    if (code) {
        matchOptions["doctorInfo.code"] = { $regex: '.*' + code + '.*', $options: 'i' }
    }
    if (specialtyId) {
        matchOptions["doctorInfo.specialtyId"] = { $eq: mongoose.Types.ObjectId(specialtyId) }
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
    const doctorsResponse = await User.aggregate(
        [
            {
                $project: { username: 0, password: 0 }
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
            },
            {
                $lookup: {
                    from: "specialties",
                    localField: "doctorInfo.specialtyId",
                    foreignField: "_id",
                    as: "doctorInfo.specialtyInfo",
                }
            },
            {
                $unwind: "$doctorInfo.specialtyInfo"
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
    const doctors = doctorsResponse[0].data;
    const numDoctors = doctorsResponse[0].dataPrev.length > 0 ? doctorsResponse[0].dataPrev[0].count : 0;
    res.status(200).json({doctors, length: numDoctors});
}

module.exports = {
    getDoctors
}