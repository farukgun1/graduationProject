const express = require('express')
const router = express.Router()

const { inputControllerMiddleware } = require('../../middleware/inputController')
const { setPersonelInput,updatePersonelInput,getPersonelInput,deletePersonelInput,setCustomerInput,getCustomerInput,updateCustomerInput,deleteCustomerInput,setTenantInput,getTenantInput,updateTenantInput,deleteTenantInput,setPropertyInput,getPropertyInput,updatePropertyInput,deletePropertyInput,updateStatusPersonelInput,updateStatusTenantInput, getLocationInput,updateStatusCustomerInput,adminLoginInput, setRentInput,getRentInput,setExpenseInput,getExpenseInput,deleteRentInput,deleteExpenseInput,updateRentInput,getRentByIdInput,getExpenseByIdInput,updateExpenseInput, testPhotoInput,updateStatusPropertyInput,testFileInput, getFileInput,getTitleDeedInput,deletePhotoInput,markPaymentAsPaidInput,loginUserInput,getPropertyCountInput, setPortfolioInput} = require('../../controllers/Admin/types')

const { setPersonel,updatePersonel,getPersonel,deletePersonel,calculateAverageRentIncome,setCustomer,getCustomer,updateCustomer,setPersonel2,deleteCustomer,settenant,getTenant,updateTenant,deleteTenant, setProperty,getProperty,updateProperty,deleteProperty,updateStatusPersonel,updateStatusTenant, getLocation,updateStatusCustomer, userLogin,setRent,getRent,setExpense,getExpense,deleteRent,deleteExpense,updateRent, getRentById,getExpenseById,updateExpense,setPhoto, updateStatusProperty,setFile,getFile, getTitleDeed,deletePhoto,getAllRents,markPaymentAsPaid,getPaidRents, loginUser,getPropertyCount,getRentCount,getPersonelCount,setPortfolio, getPortfolio} = require('../../controllers/Admin/admin')
const { upload } = require('../../helpers/multer')


// const { setCategoryToSystem, updateCategoryToSystem, deleteCategoryToSystem, getCategoryToSystem  } = require('../../controllers/Admin/admin')
// const { setSystemCategoryInput, updateSystemCategoryInput, deleteSystemCategoryInput, getSystemCategoryInput  } = require('../../controllers/Admin/types')

// router.route('/setsystemcategory').post(inputControllerMiddleware(setSystemCategoryInput, setCategoryToSystem, 'post', true))
// router.route('/updatesystemcategory').post(inputControllerMiddleware(updateSystemCategoryInput, updateCategoryToSystem, 'post', true))
// router.route('/deletesystemcategory').post(inputControllerMiddleware(deleteSystemCategoryInput, deleteCategoryToSystem, 'post', true))
// router.route('/getsystemcategory/:userId/:categoryId?').get(inputControllerMiddleware(getSystemCategoryInput, getCategoryToSystem, 'get', true))

//personel
router.route('/setpersonel').post(inputControllerMiddleware(setPersonelInput, setPersonel, 'post', true))
router.route('/setpersonel2').post(inputControllerMiddleware(setPersonelInput, setPersonel2, 'post', true))
router.route('/loginuser').post(inputControllerMiddleware(loginUserInput, loginUser, 'post', true))
router.route('/updatepersonel').post(inputControllerMiddleware(updatePersonelInput, updatePersonel, 'post', true))
router.route('/updatestatuspersonel').post(inputControllerMiddleware(updateStatusPersonelInput, updateStatusPersonel, 'post', true))
router.route('/getpersonel').post(inputControllerMiddleware(getPersonelInput, getPersonel, 'post', true))
router.route('/deletepersonel').post(inputControllerMiddleware(deletePersonelInput, deletePersonel, 'post', true))
//customer
router.route('/setcustomer').post(inputControllerMiddleware(setCustomerInput, setCustomer, 'post', true))
router.route('/getcustomer').post(inputControllerMiddleware(getCustomerInput, getCustomer, 'post', true))
router.route('/updatecustomer').post(inputControllerMiddleware(updateCustomerInput, updateCustomer, 'post', true))
router.route('/deletecustomer').post(inputControllerMiddleware(deleteCustomerInput, deleteCustomer, 'post', true))
router.route('/updatestatuscustomer').post(inputControllerMiddleware(updateStatusCustomerInput, updateStatusCustomer, 'post', true))
//tenant
router.route('/settenant').post(inputControllerMiddleware(setTenantInput, settenant, 'post', true))
router.route('/gettenant').post(inputControllerMiddleware(getTenantInput, getTenant, 'post', true))
router.route('/updatetenant').post(inputControllerMiddleware(updateTenantInput, updateTenant, 'post', true))
router.route('/deletetenant').post(inputControllerMiddleware(deleteTenantInput, deleteTenant, 'post', true))
router.route('/updatestatustenant').post(inputControllerMiddleware(updateStatusTenantInput, updateStatusTenant, 'post', true))
//property
router.route('/setproperty').post(upload.array('files'),inputControllerMiddleware(setPropertyInput, setProperty, 'post', true))
router.route('/getproperty').post(inputControllerMiddleware(getPropertyInput, getProperty, 'post', true))
router.route('/updateproperty').post(inputControllerMiddleware(updatePropertyInput, updateProperty, 'post', true))
router.route('/deleteproperty').post(inputControllerMiddleware(deletePropertyInput, deleteProperty, 'post', true))
router.route('/updatestatusproperty').post(inputControllerMiddleware(updateStatusPropertyInput, updateStatusProperty, 'post', true))
router.route('/gettitledeed').post(inputControllerMiddleware(getTitleDeedInput, getTitleDeed, 'post', true))

router.route('/login').post(inputControllerMiddleware(adminLoginInput,userLogin,'post', true))
router.route('/getLocation').post(inputControllerMiddleware(getLocationInput, getLocation, 'post', true))

router.route('/setrent').post(inputControllerMiddleware(setRentInput, setRent, 'post', true))
router.route('/getrent').post(inputControllerMiddleware(getRentInput, getRent, 'post', true))
router.route('/getallrent').post(inputControllerMiddleware(getRentInput, getAllRents, 'post', true))
router.route('/deleterent').post(inputControllerMiddleware(deleteRentInput, deleteRent, 'post', true))
router.route('/updaterent').post(inputControllerMiddleware(updateRentInput, updateRent, 'post', true))
router.route('/getrentbyid').post(inputControllerMiddleware(getRentByIdInput, getRentById, 'post', true))
router.route('/getpaidrents').post(inputControllerMiddleware(getRentByIdInput, getPaidRents, 'post', true))
router.route('/markPaymentAsPaid').post(inputControllerMiddleware(markPaymentAsPaidInput, markPaymentAsPaid, 'post', true))



router.route('/setexpense').post(inputControllerMiddleware(setExpenseInput, setExpense, 'post', true))
router.route('/getexpense').post(inputControllerMiddleware(getExpenseInput, getExpense, 'post', true))
router.route('/deleteexpense').post(inputControllerMiddleware(deleteExpenseInput, deleteExpense, 'post', true))
router.route('/getexpensebyid').post(inputControllerMiddleware(getExpenseByIdInput, getExpenseById, 'post', true))
router.route('/updateexpense').post(inputControllerMiddleware(updateExpenseInput, updateExpense, 'post', true))


router.route('/setphotos').post(upload.any(),inputControllerMiddleware(testPhotoInput,setPhoto,'post',true)),
router.route('/deletephoto').post(inputControllerMiddleware(deletePhotoInput, deletePhoto, 'post', true))
router.route('/setfiles').post(upload.single('file'),inputControllerMiddleware(testFileInput,setFile,'post',true))
router.route('/getfiles').post(inputControllerMiddleware(getFileInput, getFile, 'post', true))



router.route('/getpropertycount').post(inputControllerMiddleware(getPropertyCountInput, getPropertyCount, 'post', true))
router.route('/getrentcount').post(inputControllerMiddleware(getPropertyCountInput, getRentCount, 'post', true))
router.route('/getpersonelcount').post(inputControllerMiddleware(getPropertyCountInput, getPersonelCount, 'post', true))

router.route('/setportfolio').post(inputControllerMiddleware(setPortfolioInput, setPortfolio, 'post', true))
router.route('/getportfolio').post(inputControllerMiddleware(getPersonelInput, getPortfolio, 'post', true))

router.route('/calculateAverageRentIncome').post(inputControllerMiddleware(getPersonelInput, calculateAverageRentIncome, 'post', true))



module.exports = router
