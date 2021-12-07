import User from "../models/UserModel.js"

export const getDoctors = async (req, res) => {
    try {
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
                }
            ])
        res.status(200).json(users);
    } catch(e) {
        res.status(404).json({message: e.message});
    }
}
