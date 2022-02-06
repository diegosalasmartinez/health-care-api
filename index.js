require('dotenv').config()
require('express-async-errors')

const express = require('express')
const mongoose = require('mongoose')

const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./src/routes/AuthRoutes')
const userRoutes = require('./src/routes/UserRoutes')
const doctorRoutes = require('./src/routes/DoctorRoutes')
const patientRoutes = require('./src/routes/PatientRoutes')
const specialtyRoutes = require('./src/routes/SpecialtyRoutes')
const appointmentRoutes = require('./src/routes/AppointmentRoutes')
const dashboardRoutes = require('./src/routes/DashboardRoutes')

const authenticationMiddleware = require('./src/middleware/authenticationMiddleware')
const errorHandlerMiddleware = require('./src/middleware/errorHandlerMiddleware')
const notFoundMiddleware = require('./src/middleware/notFoundMiddleware')

const app = express();
app.set('trust proxy', 1);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
app.use(express.json());
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());
app.use(cors());
app.use(xss());

app.get('/', (req, res) => { res.send("<h1>Welcome to Heath Care Server</h1><p>Developed by Diego Salas</p>") })

const baseUrl = "/api/v1"
app.use(baseUrl + '/auth', authRoutes);

//Protected routes
app.use(authenticationMiddleware)
app.use(baseUrl + '/users', userRoutes);
app.use(baseUrl + '/doctors', doctorRoutes);
app.use(baseUrl + '/patients', patientRoutes);
app.use(baseUrl + '/specialties', specialtyRoutes);
app.use(baseUrl + '/appointments', appointmentRoutes);
app.use(baseUrl + '/dashboard', dashboardRoutes);

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const CONNECTION_URL = process.env.CONNECTION_URL || "";
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    }))
    .catch((e) => console.log(e.message));
