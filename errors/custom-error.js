const { z } = require('zod')
const { errorMessages } = require('./error-messages')
const { adminErrorMessages } = require('../controllers/Admin/error')

class CustomAPIError extends Error {
  constructor(message, statusCode, customErrorCode, detail) {
    super(message)
    this.statusCode = statusCode
    this.customErrorCode = customErrorCode
    this.detail = detail
  }
}

const databaseActionType = z.enum(['create', 'read', 'update', 'delete'])

const errorRoute = z.enum(['general', 'admin', 'company'])

const createCustomError = (errorCode, route, detail) => {
  let errorRouteType

  if (route === errorRoute.general) {
    errorRouteType = errorMessages(errorCode, detail)
  } else if (route === errorRoute.admin) {
    errorRouteType = adminErrorMessages(errorCode, detail)
  } else {
    // default hata mesajı
    errorRouteType = errorMessages(errorCode, detail)
  }

  if (!errorRouteType) {
    throw new Error(
      `Undefined errorRouteType for errorCode ${errorCode} and route ${route}`,
    )
  }

  const {
    message,
    statusCode,
    errorCode: customErrorCode,
    detail: messageDetail,
  } = errorRouteType

  return new CustomAPIError(message, statusCode, customErrorCode, messageDetail)
}

module.exports = {
  createCustomError,
  CustomAPIError,
  errorRoute,
  databaseActionType,
}
