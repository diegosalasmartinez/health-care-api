import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import userRoutes from './src/routes/UserRoutes.js'
import doctorRoutes from './src/routes/DoctorRoutes.js'
import patientRoutes from './src/routes/PatientRoutes.js'
import specialtyRoutes from './src/routes/SpecialtyRoutes.js'

const app = express();
dotenv.config();

app.use(express.json());
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.use('/users', userRoutes);
app.use('/doctors', doctorRoutes);
app.use('/patients', patientRoutes);
app.use('/specialties', specialtyRoutes);
app.get('/', (req, res) => {
    res.send("Welcome to Heath Care Server by Diego Salas!");
})

const CONNECTION_URL = process.env.CONNECTION_URL || "";
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    }))
    .catch((e) => console.log(e.message));
