/* eslint-disable no-unused-vars */
const {
  createCustomError,
  errorRoute,
  databaseActionType,
} = require('../../errors/custom-error')
const { makeActionHistory } = require('../../helpers/actionHistory')
// const {
//   sendLoginInfoToCompany,
//   generateRandomPassword,
//   sendEmail,
// } = require('../../helpers/mail')
const mongoose = require('mongoose')
const moment = require('moment');
const md5 = require('md5');
const fs = require('fs');
const path = require('path');

const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { createSuccessMessage } = require('../../success/custom-success')
const { getLocationInput } = require('./types')
const {
  getDistrictsAndNeighbourhoodsByCityCode,
  getCities,
  getDistrictsByCityCode,
  getNeighbourhoodsByCityCodeAndDistrict,
  CityCode,
} = require('turkey-neighbourhoods')

const { personelSchema } = require('../../models/personel')
const { customerSchema } = require('../../models/customer')
const { tenantSchema } = require('../../models/tenant')
const { propertySchema } = require('../../models/property')
const { RentSchema } = require('../../models/rent')
const { ExpenseSchema } = require('../../models/expense')
const { portfolioSchema } = require('../../models/portfolio')
const { property } = require('lodash');
const { start } = require('repl');

const nodemailer = require('nodemailer');



// const setHomeAdvisor = async (input, res, next, results, req) => {
//     try {
//         const newInterview = HomeAdvisorSchema({
//             ...defaultValues,
//             ...input,
//             file: req.file.filename
//         })
//         const saveInterview = await newInterview.save();
//         return next(createSuccessMessage(3003, saveInterview));
//     } catch (error) {
//         console.error("Error occurred:", error);
//         return next(createCustomError(9000, errorRoute.Enum.general));
//     }
// }

// const updateHomeAdvisor = async(input,res,next,results,req) => {
//     const {updatedId} = input
//     try {
//         const updateInterview = await HomeAdvisorSchema.findOneAndUpdate(
//             {
//             _id: updatedId
//             },{
//             ...defaultValues,
//             ...input,
//             file: req.file.filename
//         })
//         return next(createSuccessMessage(3003, updateInterview));
//     } catch (error) {
//         console.error("Error occurred:", error);
//         return next(createCustomError(9000, errorRoute.Enum.general));
//     }

// }

// const userLogin = async (input, res, next) => {
//   const { email, password } = input
//   console.log("tokeasdasdan")

//   try {
//     // Find user by email
//     const user = await personelSchema.findOne({ email })
//     if (!user) {
//       return next(createCustomError(3003, errorRoute.Enum.admin)) // User not found
//     }


//   const userPass = await personelSchema.findOne({ email, password })

//     // Generate a JWT token
//     const token = jwt.sign(
//       {
//         id: user._id,
//         name: user.name,
//         surname: user.surname,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' },
//     ) // Adjust the token expiry as needed

    

//     // Return success message with token
//     return next(createSuccessMessage(3001, token ))
//   } catch (error) {
//     console.error(error)
//     return next(createCustomError(9000, errorRoute.Enum.general)) // General error
//   }
// }


//personel
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'elifisikdeveloper@gmail.com', // E-posta adresiniz
      pass: 'ovgv fghl ghtq coxr' // Oluşturduğunuz uygulama şifresi
  }
});
// E-posta gönderme fonksiyonu
const sendEmail = async ({ to, subject, text }) => {
  const mailOptions = {
      from: 'elifisikdeveloper@gmail.com',
      to,
      subject,
      text
  };

  try {
      await transporter.sendMail(mailOptions);
      console.log('E-posta başarıyla gönderildi!');
  } catch (error) {
      console.error('E-posta gönderiminde hata:', error);
  }
};


const setPersonel2 = async (input, res, next, results) => {
  const { name, surname, email, phoneNumber } = input;

  try {
      // Aynı e-posta veya telefon numarasını kontrol etme
      const existingPersonel = await personelSchema.findOne({
          $or: [{ email }, { phoneNumber }]
      });

      if (existingPersonel) {
          return next(createCustomError(9000, errorRoute.Enum.general));
      }

      // Rastgele şifre oluşturma
      const randomPassword = crypto.randomBytes(4).toString('hex'); // 8 karakterli rastgele şifre

      // Yeni personel nesnesi oluşturma
      const newPersonel = new personelSchema({
          name,
          surname,
          email,
          phoneNumber,
          password: randomPassword // Şifreyi ekliyoruz
      });
      console.log(randomPassword)

      // Personeli veritabanına kaydetme
      const savedPersonel = await newPersonel.save();

      // E-posta gönderme
      await sendEmail({
          to: email,
          subject: 'Kayıt Olma Bilgileri',
          text: `Merhaba ${name} ${surname},\n\nKayıt olduğunuz için teşekkürler! Şifreniz: ${randomPassword}`
      });

      return next(createSuccessMessage(2000, savedPersonel));
  } catch (err) {
      console.error(err);
      return next(createCustomError(9000, errorRoute.Enum.general));
  }
};

const setPersonel = async (input, res, next) => {
  const { name, surname, email, phoneNumber } = input;

  try {
    // Yeni personel nesnesi oluşturma
    const newPersonel = new personelSchema({
      name,
      surname,
      email,
      phoneNumber
    });

    // Personeli veritabanına kaydetme
    const savedPersonel = await newPersonel.save();

    return next(createSuccessMessage(2000, savedPersonel));
  } catch (err) {
    console.error(err);
    return next(createCustomError(9000, errorRoute.Enum.general));
  }
};

// const loginUser = async (input, res) => {
//   const { email, password } = input;

//   try {
//     // Kullanıcıyı e-posta ve şifre ile bulma
//     const user = await personelSchema.findOne({ email, password });

//     if (!user) {
//       return res.status(401).json({ message: 'Kullanıcı bulunamadı veya şifre yanlış' }); // Yanlış e-posta veya şifre
//     }

//     // Token oluşturma
//     const token = jwt.sign(
//       {
//         id: user._id,
//         name: user.name,
//         surname: user.surname,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' } // Token süresi
//     );

//     // Başarı mesajı ile birlikte token'ı döndürme
//     return res.status(200).json({ token });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Genel hata' }); // Genel hata
//   }
// };


const loginUser = async (input, res, next) => {
  const { email, password } = input;
  try {
    // Burda eğer ki girilen mail adminall a aitse ve giriş başarılıysa ilgili admin in db sine token kaydedilir ve register için bundan sonra o token ile gelinir.
    let userType = ""

    const user = await personelSchema.findOne({ email, password });
    if(user)
      {
        userType="personel"
      }
      else{
        let customer = await customerSchema.findOne({ email, password });

      }
    

    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı veya şifre yanlış' }); // Yanlış e-posta veya şifre
    }

    // Token oluşturma
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        surname: user.surname,
        userType: userType
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token süresi
    );

    console.log("token",token)

    


    return next(createSuccessMessage(2008, token))
  } catch (error) {
    console.log(error)
    return next(createCustomError(9000, errorRoute.Enum.admin))
  }
}















const updatePersonel = async (input, res, next, results) => {
  const { updatedId, name, surname, email, phoneNumber } = input

  try {
    const updatedPersonel = await personelSchema.findByIdAndUpdate(
      updatedId,
      {
        ...input,
      },
      { new: true },
    )

    if (!updatedPersonel) {
      return next(createCustomError(1001, errorRoute.Enum.general))
    }

    return next(createSuccessMessage(2002, updatedPersonel));
  } catch (err) {
    console.error(err)
    return next(createCustomError(9000, errorRoute.Enum.general))
  }
}
const updateStatusPersonel = async (input, res, next, results) => {
  const { updatedId, isActive } = input

  try {
    const updatedPersonel = await personelSchema.findByIdAndUpdate(
      updatedId,
      {
        isActive: isActive,
      },
      { new: true },
    )

    if (!updatedPersonel) {
      return next(createCustomError(1001, errorRoute.Enum.general))
    }

    return next(createSuccessMessage(2002, updatedPersonel));
  } catch (err) {
    console.error(err)
    return next(createCustomError(9000, errorRoute.Enum.general))
  }
}

const getPersonel = async (input, res, next, results) => {
  const { personelId } = input

  try {
    let personel

    if (personelId) {
      
      personel = await personelSchema.findOne({ personelId })
    } else {
      personel = await personelSchema.find({})
    }

    return next(createSuccessMessage(2007, personel));
  } catch (err) {
    return next(createCustomError(9000, errorRoute.Enum.general))
  }
}

const deletePersonel = async (input, res, next) => {
  const deleteId = input.deletedId;
  try {
    const updatedPersonel = await personelSchema.findByIdAndUpdate(
      deleteId,
      { isActive: false },
      { new: true }
    );

    // Eğer güncelleme başarılı olmadıysa, yani kayıt bulunamadıysa
    if (!updatedPersonel) {
      return next(createCustomError(1001, errorRoute.Enum.notFound, 'Kişi bulunamadı.'));
    }

    // Başarıyla güncellenen kaydı döndür
    return next(createSuccessMessage(2004, updatedPersonel));

  } catch (err) {
    console.error(err); // Hata bilgisini konsola yazdır
    return next(createCustomError(9000, errorRoute.Enum.general, 'Bir hata oluştu.'));
  }
};


//

 //customer


const setCustomer = async (input, res, next, results) => {
  const {
    name,
    surname,
    phone,
    email,
    birthDate,
    country,
    state,
    stateName,
    district,
    neighborhood,
    address,
    personelId,
  } = input
  try {
    const newCustomer = new customerSchema({
      name,
      surname,
      phone,
      email,
      birthDate,
      country,
      state,
      stateName,
      district,
      neighborhood,
      address,
      personelId,
    })
    const savedCustomer = await newCustomer.save()
    return next(createSuccessMessage(2000, savedCustomer));
  } catch (err) {
    console.error(err)
    return next(createCustomError(9000, errorRoute.Enum.general))
  }
}


const getCustomer = async (input, res, next, results) => {
  try {
    const customers = await customerSchema.find({})

    const results = await Promise.all(
      customers.map(async (customer) => {
        let personel = null
        if (customer.personelId) {
          personel = await personelSchema.findOne(
            { _id: customer.personelId },
            'name surname',
          )
        }

        return {
          ...customer.toObject(),
          personelName: personel ? personel.name : null,
          personelSurname: personel ? personel.surname : null,
        }
      }),
    )

    return next(createSuccessMessage(2007, results));
  } catch (err) {
    console.error(err)
    return next(createCustomError(9000, errorRoute.Enum.general))
  }
}

const updateCustomer = async (input, res, next, results) => {
  const {
    updatedId,
    
  } = input

  try {
    const updatedCustomer = await customerSchema.findByIdAndUpdate(
      updatedId,
      {
        ...input,
      },
      { new: true },
    )

    if (!updatedCustomer) {
      return next(createCustomError(1001, errorRoute.Enum.general))
    }

    return next(createSuccessMessage(2002, updatedCustomer));
  } catch (err) {
    console.error(err)
    return next(createCustomError(9000, errorRoute.Enum.general))
  }
}

const deleteCustomer = async (input, res, next, results) => {
  const deleteId = input.deletedId
  try {
    const updatedCustomer = await customerSchema.findByIdAndUpdate(
      deleteId,
      { isActive: false },
      { new: true },
    )

    if (!updatedCustomer) {
      return next(createCustomError(1001, errorRoute.Enum.general))
    }

   
    return next(createSuccessMessage(2004, updatedCustomer));
  } catch (err) {
    return next(createCustomError(9000, errorRoute.Enum.general))
  }
}
const updateStatusCustomer = async (input, res, next, results) => {
  const { updatedId, isActive } = input

  try {
    const updatedCustomer = await customerSchema.findByIdAndUpdate(
      updatedId,
      {
        isActive: isActive,
      },
      { new: true },
    )

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Müşteri bulunamadı' })
    }

    res.status(200).json({ message: 'Müşteri güncellendi', updatedCustomer })
  } catch (err) {
    console.error(err)
    return next(createCustomError(9000, errorRoute.Enum.general))
  }
}

//

//tenant
const settenant = async (input, res, next, results) => {
  const {
    personelId,
    name,
    surname,
    phone,
    email,
    taxId,
    secondPersonFirstName,
    secondPersonLastName,
    secondPersonPhone,
    rating,

  } = input
  try {
    const newTenant = new tenantSchema({
      personelId,
      name,
      surname,
      phone,
      email,
      taxId,
      secondPersonFirstName,
      secondPersonLastName,
      secondPersonPhone,
      rating,
    })
    const savedTenant = await newTenant.save()
    return next(createSuccessMessage(2000, savedTenant));
  } catch (err) {
    console.error(err)
    return next(createCustomError(9000, errorRoute.Enum.general))
  }
}
const getTenant = async (input, res, next) => {
  const { tenantId } = input

  try {
    let tenant

    if (tenantId) {
      tenant = await tenantSchema.findOne({ tenantId })
    } else {
      tenant = await tenantSchema.find()
    }

    return next(createSuccessMessage(2007, tenant));
  } catch (err) {
    return next(createCustomError(9000, errorRoute.Enum.general))
  }
}

const updateTenant = async (input, res, next, results) => {
  const {
    updatedId,
  } = input

  try {
    const updatedTenant = await tenantSchema.findByIdAndUpdate(
      updatedId,
      {
        ...input,
      },
      { new: true },
    )

    if (!updatedTenant) {
      return next(createCustomError(1001, errorRoute.Enum.general))
    }

    return next(createSuccessMessage(2002, updatedTenant));
  } catch (err) {
    console.error(err)
    return next(createCustomError(9000, errorRoute.Enum.general))
  }
}

const deleteTenant = async (input, res, next, results) => {
  const deleteId = input.deletedId
  try {
    const updatedTenant = await tenantSchema.findByIdAndUpdate(
      deleteId,
      { isActive: false },
      { new: true },
    )

    if (!updatedTenant) {
      return next(createCustomError(1001, errorRoute.Enum.general))
    }

    return next(createSuccessMessage(2004, updatedCustomer));
  } catch (err) {
    return next(createCustomError(9000, errorRoute.Enum.general))
  }
}

const updateStatusTenant = async (input, res, next, results) => {
  const { updatedId, isActive } = input

  try {
    const updatedTenant = await tenantSchema.findByIdAndUpdate(
      updatedId,
      {
        isActive: isActive,
      },
      { new: true },
    )

    if (!updatedTenant) {
      return res.status(404).json({ message: 'Kiracı bulunamadı' })
    }

    res.status(200).json({ message: 'Kiracı güncellendi', updatedTenant })
  } catch (err) {
    console.error(err)
    return next(createCustomError(9000, errorRoute.Enum.general))
  }
}
//





//property
const setProperty = async (input, res, next, results) => {
  try {
  
    const newProperty = new propertySchema({
      ...input,
    })

    // Mülkü veritabanına kaydet
    const savedProperty = await newProperty.save()

    // Kaydedilen property'den ID'yi al
    const propertyId = savedProperty._id

    // Yanıt olarak başarı mesajı ve property ID'yi döndür
    res.status(200).json({
      message: 'Property added',
      propertyId: propertyId, // propertyId'yi burada döndürüyoruz
      savedProperty, // Opsiyonel: kaydedilen property detaylarını da döndürebilirsiniz
    })
  } catch (err) {
    console.error(err)
    return next(createCustomError(9000, errorRoute.Enum.general))
  }
}
const setPortfolio = async (input, res, next) => {
  try {
    const newPortfolio = new portfolioSchema({
      ...input,
    });

    const savedPortfolio = await newPortfolio.save();

    return next(createSuccessMessage(2000, savedPortfolio));
  } catch (err) {
    console.error(err);
    return next(createCustomError(9000, errorRoute.Enum.general));
  }
};

const updateProperty = async (input, res, next, results) => {
  const {
    updatedId,
    propertyOwner,
    propertyName,
    status,
    propertyStatus,
    realEstateCode,
    country,
    city,
    district,
    neighborhood,
    street,
    avenue,
    externalDoorNumber,
    internalDoorNumber,
    address,
    latitude,
    longitude,
    titleDeedCount,
    actualUsageType,
    actualUsagePurpose,
    photo,
    details,
    otherDetails,
    isActive,
  } = input

  try {
    const updatedProperty = await propertySchema.findByIdAndUpdate(
      updatedId,
      {
        ...input,
      },
      { new: true },
    )

    if (!updatedProperty) {
      return res.status(404).json({ message: 'Property not found' })
    }

    res
      .status(200)
      .json({ message: 'Property updated successfully', updatedProperty })
  } catch (err) {
    console.error(err)
    return next(createCustomError(9000, errorRoute.Enum.general))
  }
}
const updateStatusProperty = async (input, res, next, results) => {
  const { updatedId, status } = input

  try {
    const updatedProperty = await propertySchema.findByIdAndUpdate(
      updatedId,
      {
        status: status,
      },
      { new: true },
    )

    if (!updatedProperty) {
      return res.status(404).json({ message: 'Mülk bulunamadı' })
    }

    res.status(200).json({ message: 'Mülk güncellendi', updatedProperty })
  } catch (err) {
    console.error(err)
    return next(createCustomError(9000, errorRoute.Enum.general))
  }
}
const getProperty = async (req, res, next) => {
  try {
    
    const properties = await propertySchema.find({});

    

    // Mülkleri dönüştür ve müşteri bilgilerini ekle
    const results = await Promise.all(
      properties.map(async (property) => {
        let propertyOwnerName = null;
        console.log(property.details[0].propertyOwnerName)

        if (property.details[0].propertyOwnerName) {
          // Müşteri bilgilerini ID ile al
          const customer = await customerSchema.findOne(
            { _id: property.details[0].propertyOwnerName },
            'name surname'
          );
       

          if (customer) {
            // Müşteri adı ve soyadı varsa tam ad oluştur
            propertyOwnerName = `${customer.name} ${customer.surname}`;
          }
        }

        return {
          ...property.toObject(),
          propertyOwnerName,
        };
      })
    );

    // Sonuçları döndür
    res.status(200).json(results);
  } catch (err) {
    // Hata durumunda konsola yazdır ve hata işleyicisine ilet
    console.error(err);
    next(createCustomError(9000, errorRoute.Enum.general));
  }
};


const deleteProperty = async (input, res, next, results) => {
  const deleteId = input.deleteId
  try {
    const updatedProperty = await propertySchema.findByIdAndUpdate(
      deleteId,
      { isActive: false },
      { new: true },
    )

    if (!updatedProperty) {
      return res.status(404).json({ message: 'Mülk bulunamadı' })
    }

    res
      .status(200)
      .json({ message: 'Mülk devre dışı bırakıldı', updatedProperty })
  } catch (err) {
    return next(createCustomError(9000, 'Bir hata oluştu')) // Genel bir hata mesajı verildi
  }
}

//






















const getLocation = async (input, res, next) => {
  const { citycode } = input

  try {
    if (citycode) {
      // Citycode varsa, ilçe ve mahalleleri getir

      const data = await getDistrictsAndNeighbourhoodsByCityCode(
        citycode.toString(),
      )

      return res.status(200).json(data)
    } else {
      // Citycode yoksa, tüm şehirleri getir
      const cities = await getCities()
      return res.status(200).json(cities)
    }
  } catch (err) {
    console.error(err)
    return next(createCustomError(9000, errorRoute.Enum.general)) // Hata yönetimini düzenle
  }
}


function createFirstPayment(contractStartDate, rentAmount, paymentDay) {
  const start = moment(contractStartDate, 'YYYY-MM-DD');
  let firstPaymentDate = start.clone().startOf('month').add(paymentDay - 1, 'days');
  if (firstPaymentDate.isBefore(start)) {
    firstPaymentDate.add(1, 'month');
  }

  const daysInMonth = firstPaymentDate.clone().endOf('month').date();
  const daysRemaining = firstPaymentDate.diff(start, 'days') + 1;
  const proratedAmount = (rentAmount / daysInMonth) * daysRemaining;

  return {
    paymentDate: firstPaymentDate.format('YYYY-MM-DD'),
    rentAmount: proratedAmount.toFixed(2),
    isPaid: false,
    paidDate: null,
    receipt: null,
  };
}


const setRent = async (input, res, next) => {
  try {
    const { propertyId, startingRentAmount, paymentDay,rentalfee } = input;

    // İlk ödeme bilgilerini oluştur, ancak rentAmount'u hesaplama
    const firstPayment = {
      paymentDate: moment(startingRentAmount, 'YYYY-MM-DD').add(paymentDay - 1, 'days').format('YYYY-MM-DD'),
      rentAmount: rentalfee,  // Kira tutarını hesaplamıyoruz, null bırakıyoruz
      isPaid: false,
      paidDate: null,
      receipt: null,
    };

    const newRent = new RentSchema({
      ...input,
      payments: [firstPayment],  // İlk ödeme bilgisi kira tutarı olmadan eklendi
    });

    const savedRent = await newRent.save();

    // Property'ye kira bilgisini ekleyelim
    const updatedProperty = await propertySchema.findOneAndUpdate(
      { _id: propertyId },
      { $push: { rents: { rentId: savedRent._id.toString() } } },
      { new: true }
    );

    await updatedProperty.save();

    res.status(200).json({ message: 'Rent added successfully with payment details', savedRent, updatedProperty });
  } catch (err) {
    console.error(err);
    return next(createCustomError(9000, errorRoute.Enum.general, err.message));
  }
};


const markPaymentAsPaid = async (input, res, next) => {
  try {
    const { rentId, paymentDate, rentAmount, isPaid, paidDate, receipt } = input;
    
   
    const rent = await RentSchema.findById(rentId);
    
    if (!rent) {
      throw new Error('Rent record not found');
    }

    const paymentToUpdate = rent.payments.find(payment => payment.paymentDate === paymentDate);

    if (!paymentToUpdate) {
      throw new Error('Payment record not found');
    }

    paymentToUpdate.isPaid = isPaid;
    paymentToUpdate.paidDate = paidDate;
    paymentToUpdate.receipt = receipt;


    await rent.save();

  
    if (isPaid) {
      const moment = require('moment'); 
      const nextPaymentDate = moment(paymentDate).add(1, 'month').format('YYYY-MM-DD'); 

      
      const nextPayment = {
        paymentDate: nextPaymentDate,
        rentAmount: rentAmount,
        isPaid: false,
        paidDate: null, 
        receipt: null   
      };


      rent.payments.push(nextPayment);

      // Rent kaydını güncelleyelim
      await rent.save();

      return res.status(200).json({ message: 'Payment marked as paid and next payment scheduled', nextPayment });
    } else {
      return res.status(200).json({ message: 'Payment status updated but next payment not scheduled' });
    }

  } catch (err) {
    next(new Error('Failed to update payment status: ' + err.message));
  }
};



const getAllRents = async (req, res, next) => {
  try {
    // Tüm kira sözleşmelerini getir
    const rents = await RentSchema.find({});
    console.log('rents: ', rents);

    const results = await Promise.all(
      rents.map(async (rent) => {
        let property = null;
        let tenant = null;

        if (rent.propertyId) {
          property = await propertySchema.findOne(
            { _id: rent.propertyId }
          );
          
           propertyName = property && property.details.length > 0 ? property.details[0].propertyName : null;
          
          console.log(propertyName); 
        }

        if (rent.tenantId) {
          tenant = await tenantSchema.findOne(
            { _id: rent.tenantId },
            'name surname'
          );
        }

        return {
          ...rent.toObject(),
          propertyName: propertyName,
          tenantName: tenant ? tenant.name : null,
          tenantSurname: tenant ? tenant.surname : null
        };
      })
    );

    if (results.length === 0) {
      return res.status(404).json({ message: 'No rents found' });
    }

    res.status(200).json({ rents: results });
  } catch (err) {
    console.error(err);
    return next(createCustomError(9000, errorRoute.Enum.general, err.message));
  }
};






const getRent = async (input, res, next) => {
  try {
    const { propertyId } = input

    const property = await propertySchema.findById(propertyId).select('rents')
    console.log('property11111111: ', property)

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    const rentIds = property.rents.map((rent) => rent.rentId)
    console.log('rentIds22222222222: ', rentIds)

    if (rentIds.length === 0) {
      return res
        .status(404)
        .json({ message: 'No rents found for this property' })
    }

    const rents = await RentSchema.find({ _id: { $in: rentIds } })
    console.log('rents333333333: ', rents)
    res.status(200).json({ rents })
  } catch (err) {
    console.error(err)
    return next(createCustomError(9001, errorRoute.Enum.general, err.message))
  }
}

const getRentById = async (input, res, next) => {
  try {
    const { rentId } = input

    // RentSchema'dan belirli bir rentId'yi bul
    const rent = await RentSchema.findById(rentId)
    console.log('rent11111111: ', rent)

    if (!rent) {
      return res.status(404).json({ message: 'Rent not found' })
    }

    res.status(200).json({ rent })
  } catch (err) {
    console.error(err)
    return next(createCustomError(9001, errorRoute.Enum.general, err.message))
  }
}




const getPaidRents = async (input, res, next) => {
  try {
    const { rentId } = input;
    const rent = await RentSchema.findById(rentId);
    if (!rent) {
      return res.status(404).json({ message: 'Rent not found' });
    }

    const paidPayments = rent.payments.filter(payment => payment.isPaid === true);
    if (paidPayments.length === 0) {
      return res.status(404).json({ message: 'No paid rents found' });
    }
    res.status(200).json({ paidPayments });
  } catch (err) {
    console.error(err);
    return next(createCustomError(9001, errorRoute.Enum.general, err.message));
  }
};










const getExpenseById = async (input, res, next) => {
  try {
    const { expenseId } = input

    // RentSchema'dan belirli bir rentId'yi bul
    const expense = await ExpenseSchema.findById(expenseId)
    console.log('rent11111111: ', expense)

    if (!expense) {
      return res.status(404).json({ message: 'Rent not found' })
    }

    res.status(200).json({ expense })
  } catch (err) {
    console.error(err)
    return next(createCustomError(9001, errorRoute.Enum.general, err.message))
  }
}

const deleteRent = async (input, res, next) => {
  try {
    const { rentId } = input
    // 1. RentSchema içindeki isActive durumunu false yap
    const updatedRent = await RentSchema.findOneAndUpdate(
      { _id: rentId },
      { isActive: false },
      { new: true },
    )

    if (!updatedRent) {
      return next(
        createCustomError(9001, errorRoute.Enum.general, 'Rent not found'),
      )
    }

    const updatedProperty = await propertySchema.findOneAndUpdate(
      { 'rents.rentId': rentId },
      { $set: { 'rents.$.isActive': false } },
      { new: true },
    )

    if (!updatedProperty) {
      return next(
        createCustomError(9002, errorRoute.Enum.general, 'Property not found'),
      )
    }

    res.status(200).json({
      message: 'Rent deactivated successfully',
      updatedRent,
      updatedProperty,
    })
  } catch (err) {
    console.error(err)
    return next(createCustomError(9000, errorRoute.Enum.general, err.message))
  }
}


const updateRent = async (input, res, next, results) => {
  const {
    updatedId,
 
  } = input

  try {
    const updatedRent = await RentSchema.findByIdAndUpdate(
      updatedId,
      {
        ...input,
      },
      { new: true },
    )

    if (!updatedRent) {
      return res.status(404).json({ message: 'Rent not found' })
    }

    res
      .status(200)
      .json({ message: 'Property updated successfully', updatedRent })
  } catch (err) {
    console.error(err)
    return next(createCustomError(9000, errorRoute.Enum.general))
  }
}


const updateExpense = async (input, res, next, results) => {
  const { updatedId } = input

  try {
    const updatedExpense = await ExpenseSchema.findByIdAndUpdate(
      updatedId,
      {
        ...input,
      },
      { new: true },
    )

    if (!updatedExpense) {
      return res.status(404).json({ message: 'MAsraf bulunamadı' })
    }

    res.status(200).json({ message: 'Masraf güncellendi', updatedExpense })
  } catch (err) {
    console.error(err)
    return next(createCustomError(9000, errorRoute.Enum.general))
  }
}

const setExpense = async (input, res, next, results) => {
  try {
    const { propertyId } = input

    const newExpense = new ExpenseSchema({
      ...input,
    })
    console.log(input)
    const savedExpense = await newExpense.save()

    console.log('savedExpense._id', savedExpense._id)

    const property = await propertySchema.findOneAndUpdate(
      { _id: propertyId },
      { $push: { expenses: { expenseId: savedExpense._id.toString() } } },
      { new: true },
    )

    await property.save()

    res
      .status(200)
      .json({ message: 'Expense added successfully', savedExpense })
  } catch (err) {
    console.error(err)
    return next(createCustomError(9000, errorRoute.Enum.general, err.message))
  }
}
const getExpense = async (input, res, next) => {
  try {
    const { propertyId } = input

    const property = await propertySchema
      .findById(propertyId)
      .select('expenses')

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    const expenseId = property.expenses.map((expenses) => expenses.expenseId)

    if (expenseId.length === 0) {
      return res.status(404).json({ message: 'No  found for this property' })
    }

    const expenses = await ExpenseSchema.find({ _id: { $in: expenseId } })

    res.status(200).json({ expenses })
  } catch (err) {
    console.error(err)
    return next(createCustomError(9001, errorRoute.Enum.general, err.message))
  }
}

//property id mi rent id mi??
const deleteExpense = async (input, res, next) => {
  try {
    const { expenseId } = input
    // 1. RentSchema içindeki isActive durumunu false yap
    const updatedExpense = await ExpenseSchema.findOneAndUpdate(
      { _id: expenseId },
      { isActive: false },
      { new: true },
    )

    if (!updatedExpense) {
      return next(
        createCustomError(9001, errorRoute.Enum.general, 'Rent not found'),
      )
    }
    console.log(updatedExpense)

    const updatedProperty = await propertySchema.findOneAndUpdate(
      { 'expenses.expenseId': expenseId },
      { $set: { 'expense.$.isActive': false } },
      { new: true },
    )

    if (!updatedProperty) {
      return next(
        createCustomError(9002, errorRoute.Enum.general, 'Property not found'),
      )
    }

    res.status(200).json({
      message: 'Expense deactivated successfully',
      updatedExpense,
      updatedProperty,
    })
  } catch (err) {
    console.error(err)
    return next(createCustomError(9000, errorRoute.Enum.general, err.message))
  }
}

// const setPhoto = async (input, res, next, results, req) => {
//   try {
//     const propertyId = input.propertyId
//     if (!propertyId) {
//       return res.status(400).json({ error: 'Property ID is required' })
//     }
//     let photos = []
//     if (req.files) {
//       for (let key of req.files) {
//         photos.push(key.filename)
//       }
//     }



//     const property = await propertySchema.findById(propertyId)
//     if (!property) {
//       return res.status(404).json({ error: 'Property not found' })
//     }



//     // Fotoğrafları property'nin photos dizisine ekliyoruz
//     property.photos = [...property.photos, ...photos]

    
//     // Mülkü güncelliyoruz
//     const updatedProperty = await property.save();

//     console.log("updatedProperty",updatedProperty)
    
//     if (!updatedProperty) {
//       return res.status(500).json({ error: 'Property update failed' });
//     }

//     // Yanıt olarak güncellenmiş fotoğrafları döndürüyoruz
  
//     return next(createSuccessMessage(2007, property.photos));
//   } catch (error) {
//     // Hata durumunda next() ile hatayı ileriye taşıyoruz
//     next(error)
//   }
// }




    




// const setPhoto = async (input, res, next, results, req) => {
//   try {
//     const propertyId = input.propertyId;
//     if (!propertyId) {
//       return res.status(400).json({ error: 'Property ID is required' });
//     }


//     // Yeni fotoğrafları ekle
//     let newPhotos = [];
//     if (req.files) {
//       for (let file of req.files) {
//         newPhotos.push(file.filename);
//       }
//     }

//     console.log("asdasdasdsa", newPhotos)

//     // Property'yi güncelle
  
      
//       const updatedProperty = await propertySchema.findByIdAndUpdate(
//         propertyId,
//         { $set: { photos: newPhotos } },
//         { new: true } // Upsert: false, yeni belge oluşturma
//       );
  
   


//     if (!updatedProperty) {
//       return res.status(404).json({ error: 'Property not found' });
//     }

//     // Yanıt olarak güncellenmiş fotoğrafları döndürüyoruz
//     return next(createSuccessMessage(2007, updatedProperty));
//   } catch (error) {
//     // Hata durumunda next() ile hatayı ileriye taşıyoruz
//     next(error);
//   }
// }

const setPhoto = async (input, res, next, results, req) => {
  try {
    const propertyId = input.propertyId;
    if (!propertyId) {
      return res.status(400).json({ error: 'Property ID is required' });
    }

    let photos = [];
    if (req.files) {
      for (let key of req.files) {
        photos.push(key.filename);
      }
    }

    console.log("photos", photos);

    const property = await propertySchema.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    console.log("property", property);

    // Yeni fotoğrafları mevcut fotoğraflara ekleyerek güncelleyerek veritabanına gönderiyoruz
    const updatedProperty = await propertySchema.findByIdAndUpdate(
      propertyId,
      { $addToSet: { photos: { $each: photos } } }, // Var olan fotoğrafları koruyarak ekleme yapıyoruz
      { new: true, runValidators: true } // Yeni belgeyi döndür ve doğrulamaları çalıştır
    );

    if (!updatedProperty) {
      return res.status(500).json({ error: 'Property update failed' });
    }

    // Yanıt olarak güncellenmiş fotoğrafları döndürüyoruz
    return next(createSuccessMessage(2007, updatedProperty.photos));
  } catch (error) {
    console.error("Error occurred:", error);
    next(error);
  }
}






const setFile = async (input, res, next, results, req) => {
  try {
    const { rentId, paymentDate, rentAmount, paidDate } = input;

 
    const rent = await RentSchema.findById(rentId);
    if (!rent) {
      throw new Error('Rent record not found');
    }
console.log("cpsöödscd",rent)



  
    const paymentToUpdate = rent.payments.find(payment => payment.paymentDate === paymentDate);
    if (!paymentToUpdate) {
      throw new Error('Payment record not found');
    }

 console.log(paymentToUpdate)



    if (req.imageFileName) {
      paymentToUpdate.receipt = req.imageFileName; 
    }


    paymentToUpdate.isPaid = true;
    paymentToUpdate.paidDate = paidDate;


    await rent.save();

    console.log('Payment updated:', paymentToUpdate);

    if (paymentToUpdate.isPaid === true) {
      const moment = require('moment');
      const nextPaymentDate = moment(paymentDate).add(1, 'month').format('YYYY-MM-DD');

      const nextPayment = {
        paymentDate: nextPaymentDate,
        rentAmount: rentAmount, // Bu alanın null olmaması gerekebilir
        isPaid: false,
        paidDate: null,
        receipt: null
      };

      console.log('Next payment to be added:', nextPayment);

      // Yeni ödemeyi ekle
      const updatePayments = await RentSchema.findOneAndUpdate(
        { _id: rentId  , },
        { $push: { payments: nextPayment } },
        { new: true, useFindAndModify: false } // Yeni dönen belgeyi almak için
      );

      console.log('Rent payments after push:', updatePayments.payments);

      return res.status(200).json({ message: 'Payment marked as paid and next payment scheduled', nextPayment });
    } else {
      return res.status(200).json({ message: 'Payment status updated but next payment not scheduled' });
    }

  } catch (err) {
    next(new Error('Failed to update payment status: ' + err.message));
  }
};


const getFile = async (input, res, next) => {
  try {
    const { propertyId } = input

      if (!propertyId) {
        return res.status(400).json({ error: 'Property ID is required' });
      }
  
      const property = await propertySchema.findById(propertyId);
  
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
  
      // Dosya listesini döndür
      res.status(200).json({ files: property.files });
    } catch (error) {
      console.error("Error while retrieving property files:", error.message);
      next(error);
    }
}

const getTitleDeed = async (input, res, next) => {
  try {
    const { propertyId } = input

      if (!propertyId) {
        return res.status(400).json({ error: 'Property ID is required' });
      }
  
      const property = await propertySchema.findById(propertyId);
  
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
  
      // Dosya listesini döndür
      res.status(200).json({ titledeed: property.titledeed });
    } catch (error) {
      console.error("Error while retrieving property files:", error.message);
      next(error);
    }
}

const deletePhoto = async (input, res, next) => {
  try {
    const { propertyId, photoName } = input;

    if (!propertyId || !photoName) {
      return res.status(400).json({ error: 'Property ID and photo name are required' });
    }

    // 1. Veritabanında fotoğrafı sil
    const result = await propertySchema.updateOne(
      { _id: mongoose.Types.ObjectId(propertyId) },
      { $pull: { photos: photoName } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Photo not found in the database' });
    }

    // 2. Dosya sisteminden fotoğrafı sil
    const filePath = path.join(__dirname, 'public', photoName); // __dirname ile yolun doğru olduğundan emin olun

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Photo deleted successfully from file system.');
    } else {
      console.warn('Photo does not exist in file system.');
    }

    res.status(200).json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error while deleting photo:', error.message);
    res.status(500).json({ error: 'An error occurred while deleting the photo' });
  }
};




//dashboard

const getPropertyCount = async (input, res, next) => {
  try {
  
    const propertyCount = await propertySchema.countDocuments({});
    console.log(propertyCount)


    res.status(200).json({ propertyCount });
  } catch (err) {
   
    console.error(err);
    next(createCustomError(9000, errorRoute.Enum.general));
  }
};

const getRentCount = async (input, res, next) => {
  try {
    // isActive: true olan ve rents dizisi bulunan mülklerin sayısını al
    const propertyCount = await propertySchema.countDocuments({
      isActive: true,
      rents: { $exists: true, $ne: [] } // rents dizisi boş olmamalı
    });

    console.log(propertyCount);

    res.status(200).json({ propertyCount });
  } catch (err) {
    console.error(err);
    next(createCustomError(9000, errorRoute.Enum.general));
  }
};


//
const getPersonelCount = async (input, res, next) => {
  const { personelId } = input;

  try {
    let count;

    if (personelId) {
      count = await personelSchema.countDocuments({ personelId });
    } else {
      count = await personelSchema.countDocuments({});
    }

    return next(createSuccessMessage(2007, { totalPersonnel: count }));
  } catch (err) {
    return next(createCustomError(9000, errorRoute.Enum.general));
  }
}



module.exports = {
  setPersonel,
  updatePersonel,
  getPersonel,
  deletePersonel,
  setCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  settenant,
  getTenant,
  updateTenant,
  deleteTenant,
  setProperty,
  updateProperty,
  getProperty,
  deleteProperty,
  updateStatusPersonel,
  updateStatusTenant,
  getLocation,
  updateStatusProperty,
  updateStatusCustomer,
  // userLogin,
  setRent,
  getRent,
  setExpense,
  getExpense,
  deleteRent,
  deleteExpense,
  updateRent,
  getRentById,
  getExpenseById,
  updateExpense,
  setPhoto,
  setFile,
  getFile,
  getTitleDeed,
  deletePhoto,
  setPortfolio,
  getAllRents,
  markPaymentAsPaid,
  getPaidRents,
  loginUser,
  getPropertyCount,
  getRentCount,
  getPersonelCount,
  setPersonel2
}
