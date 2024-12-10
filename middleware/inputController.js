const { Entrance } = require('../controllers/Admin/admin')

const { identityValidation, generateIdentityErrorMessage } = require('../helpers/identityValidation')
const {
    createCustomError,
    errorRoute,
    databaseActionType,
} = require('../errors/custom-error')



const inputControllerMiddleware = (inputModel, updateFunction, type, pass, schema, existControl, filterValue) => {
    return async (req, res, next) => {

        console.log("here")
        try {
            let input = type === 'post' ? req.body : req.params

            const validatedData = await inputModel.safeParse(input);

            console.log("aaaaaa",validatedData.error)

            if (!validatedData.success) {
                const missingInputPath = validatedData.error.errors[0].path[0];
                return next(
                    createCustomError(1000, errorRoute.enum.general, missingInputPath)
                )
            }

            let results
            if (!pass) {
                const { userId } = req.body
                const identityObject = {
                    userId
                }

                results = await identityValidation(identityObject, next);

                if (results.returnedError) {
                    if (results.returnedError.authority) return next(createCustomError(2000, errorRoute.Enum.admin))
                }
            }

            let controlObject = {}

            for (const key in existControl) {
                if (input.hasOwnProperty(key)) {
                    controlObject[key] = validatedData.data[key]
                }
            }


            await updateFunction(validatedData.data, res, next, results, req, schema, controlObject, filterValue);
        } catch (error) {
            console.error('Hata:', error);
            return next(createCustomError(9000, errorRoute.enum.general));
        }
    };
};
module.exports = {
    inputControllerMiddleware
}
