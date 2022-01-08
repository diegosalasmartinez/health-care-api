const roles = ["ADMIN", "DOCTOR", "SECRETARY"];
const rolesObjects = {
    ADMIN: "ADMIN",
    DOCTOR: "DOCTOR",
    SECRETARY: "SECRETARY",
    ALL: "ALL"
}

const appointmentStatus = ["CREATED", "FINISHED", "CANCELLED"];
const appointmentStatusObjects = {
    CREATED: "CREATED",
    FINISHED: "FINISHED",
    CANCELLED: "CANCELLED"
}

module.exports = {
    roles,
    rolesObjects, 
    appointmentStatus,
    appointmentStatusObjects
}