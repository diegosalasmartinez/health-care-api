const User = require('../models/UserModel')

const getDoctors = async (req, res) => {
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
            }
        ])
    res.status(200).json(users);
}

module.exports = {
    getDoctors
}