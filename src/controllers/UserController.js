import Person from "../models/PersonModel.js";
import User from "../models/UserModel.js"

export const getUsers = async (req, res) => {
    try {
        const users = await User.aggregate(
            [
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
                }
            ])
        res.status(200).json(users);
    } catch(e) {
        res.status(404).json({message: e.message});
    }
}

export const createUser = async (req, res) => {
    const user = req.body;
    const newPerson = new Person({
        DNI: user.DNI,
        name: user.name, 
        lastName: user.lastName, 
        email: user.email, 
        phone: user.phone, 
        sex: user.sex
    })
    try {
        const personCreated = await newPerson.save();
        const newUser = new User({
            personId: personCreated._id,
            doctorId: null,
            username: user.username,
            password: user.password,
            role: user.role
        })
        const userCreated = await newUser.save();
        res.status(201).json(userCreated);
    } catch(e) {
        res.status(409).json({message: e.message});
    }
}