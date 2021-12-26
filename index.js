require('dotenv').config()
require('express-async-errors')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

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

app.get('/', (req, res) => { res.send("Welcome to Heath Care Server by Diego Salas!") })
app.use('/users', userRoutes);
app.use('/doctors', doctorRoutes);
app.use('/patients', patientRoutes);
app.use('/specialties', specialtyRoutes);

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const CONNECTION_URL = process.env.CONNECTION_URL || "";
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    }))
    .catch((e) => console.log(e.message));
