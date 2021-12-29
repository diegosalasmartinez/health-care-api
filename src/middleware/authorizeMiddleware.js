const { UnauthenticatedError } = require('../errors')
const { rolesObjects } = require('../utils/index')

function authorize(rolesAuthorized = []) {
    return async function(req, res, next) {
        try {
            if (rolesAuthorized.filter(role => role === rolesObjects.ALL).length > 0) {
                next();
            } else {
                if (rolesAuthorized.filter(role => role === req.user.role).length > 0) {
                    next();
                } else {
                    throw new UnauthenticatedError('Authentication invalid');
                }
            }
        } catch (error) {
            throw new UnauthenticatedError('Authentication invalid');
        }
    }
}

module.exports = authorize