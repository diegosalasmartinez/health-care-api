require('dotenv').config()
require('express-async-errors')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const AuthRoutes = require('./src/routes/AuthRoutes')
const userRoutes = require('./src/routes/UserRoutes')
const doctorRoutes = require('./src/routes/DoctorRoutes')
const patientRoutes = require('./src/routes/PatientRoutes')
const specialtyRoutes = require('./src/routes/SpecialtyRoutes')

const errorHandlerMiddleware = require('./src/middleware/errorHandlerMiddleware')
const notFoundMiddleware = require('./src/middleware/notFoundMiddleware')

const app = express();
app.use(express.json());
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

const baseUrl = "/api/v1"
app.get(baseUrl + '/', (req, res) => { res.send("Welcome to Heath Care Server by Diego Salas!") })
app.use(baseUrl + '/auth', AuthRoutes);
app.use(baseUrl + '/users', userRoutes);
app.use(baseUrl + '/doctors', doctorRoutes);
app.use(baseUrl + '/patients', patientRoutes);
app.use(baseUrl + '/specialties', specialtyRoutes);

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const CONNECTION_URL = process.env.CONNECTION_URL || "";
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    }))
    .catch((e) => console.log(e.message));
