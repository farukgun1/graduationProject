const { property } = require('lodash')
const { z, optional } = require('zod')

//personel
const setPersonelInput = z.object({
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  password: z.string(),
  type: z.string().optional(),
})

const updatePersonelInput = z.object({
  updatedId: z.string(),
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  isActive: z.boolean(),
})
const updateStatusPersonelInput = z.object({
  updatedId: z.string(),
  isActive: z.boolean(),
})
const getPersonelInput = z.object({
  personelId: z.string().optional(),
})

const deletePersonelInput = z.object({
  deletedId: z.string(),
})

//

//customer

const setCustomerInput = z.object({
  name: z.string(),
  surname: z.string(),
  phone: z.string(),
  email: z.string(),
  birthDate: z.string(),
  country: z.string(),
  state: z.string(),
  stateName: z.string(),
  district: z.string(),
  neighborhood: z.string(),
  address: z.string(),
  personelId: z.string(),
  password: z.string().optional(),
})
const getCustomerInput = z.object({
  customerId: z.string().optional(),
})
const updateCustomerInput = z.object({
  updatedId: z.string(),
  name: z.string(),
  surname: z.string(),
  phone: z.string(),
  email: z.string(),
  birthDate: z.string(),
  country: z.string(),
  state: z.string(),
  district: z.string(),
  neighborhood: z.string(),
  address: z.string(),
  personelId: z.string(),
  isActive: z.boolean(),
})
const deleteCustomerInput = z.object({
  deletedId: z.string(),
})
const updateStatusCustomerInput = z.object({
  updatedId: z.string(),
  isActive: z.boolean(),
})

//

//tenant

const setTenantInput = z.object({
  personelId: z.string().optional(),
  name: z.string(),
  surname: z.string(),
  phone: z.string(),
  email: z.string(),
  taxId: z.string(),
  secondPersonFirstName: z.string().optional(),
  secondPersonLastName: z.string().optional(),
  secondPersonPhone: z.string().optional(),
  rating: z.string().optional(),
  isActive: z.boolean().default(true),
})
const getTenantInput = z.object({
  tenantId: z.string().optional(),
})
const updateTenantInput = z.object({
  updatedId: z.string(),
  name: z.string(),
  surname: z.string(),
  phone: z.string(),
  email: z.string(),
  taxId: z.string(),
  secondPersonFirstName: z.string().optional(),
  secondPersonLastName: z.string().optional(),
  secondPersonPhone: z.string().optional(),
  rating: z.string().optional(),
  isActive: z.boolean(),
})
const deleteTenantInput = z.object({
  deletedId: z.string(),
})
//

// tenantType: z.string().optional(), // Kiracı Türü
// rentIncreaseRate: z.string().optional(), // Kira Artış Oranı
// evictionCommitment: z.string().optional(), // Tahliye Taahhütnamesi
// terminationNotice: z.string().optional(), // Fesih Bildirimi

//property

const setPropertyInput = z.object({
  details: z
    .object({
      fundShareRatio: z.string().optional(), // Fon Hisse Oranı
      fundArea: z.string().optional(), // Fon m²
      grossM2Cost: z.string().optional(), // Brüt m² Maliyet
      valuationPricePerM2: z.string().optional(), // Değerleme m² Fiyatı
      costIncludingVAT: z.string().optional(), // KDV Dahil Maliyet
      valuationReportDate: z.string().optional(), // Değerleme Rapor Tarihi
      valueInValuationReport: z.string().optional(), // Değerleme Raporunda Yer Alan Değer
      portfolioValue: z.string().optional(), // Portföy Değeri//
      reportNumber: z.string().optional(), // Rapor No//

      propertyId: z.string().optional(), // Gayrimenkul ID'si//
      realEstateInvestmentsPortfolio: z.string().optional(), // Gayrimenkul Yatırımları Portföyü//
      propertyName: z.string().optional(),
      portfolioId: z.string().optional(),
      block: z.string().optional(),
      bbNo: z.string().optional(),
      attribute: z
        .enum(['', 'konut', 'isyeri', 'ofis', 'dukkan', 'arsa'])
        .optional(),
      type: z
        .enum([
          '',
          '1+0',
          '1+1',
          '2+1',
          '3+1',
          '4+1',
          '3+1Dblx',
          '2+1Dblx',
          '1+1Loft',
          '2+1Loft',
          'StudyoLoft',
        ])
        .optional(),
      usageType: z.enum(['', 'Bekliyor', 'Satilik', 'Kiralık']).optional(),
      netM2: z.string().optional(),
      grossM2: z.string().optional(),
      island: z.string().optional(),
      parcel: z.string().optional(),
      onShelf: z.string().optional(),
      propertyNumber: z.string().optional(),
      numberOfFloors: z.string().optional(),
      floor: z.string().optional(),
      buildingPermitDate: z.string().optional(),
      purchaseDate: z.string().optional(),
      purchasePrice: z.string().optional(),
      facades: z.enum(['', 'Kuzey', 'Guney', 'Yol', 'Cephe']).optional(),
      referenceCode: z.string().optional(),
      zoningStatus: z
        .enum([
          '',
          'NazımImarPlani',
          'MekansalImarPlani',
          'CevreDuzeniPlani',
          'UygulamaImarPlani',
          'ParselasyonPlani',
          'IlaveImarPlani',
          'KorumaAmacliImarPlanı',
          'MevziImarPlanı',
        ])
        .optional(),
      benchmark: z.string().optional(),
      integrationCode: z.string().optional(),
      listingPrice: z.string().optional(),
      costPrice: z.string().optional(),
      bookValue: z.string().optional(),
      marketValue: z.string().optional(),
      specialPrice: z.string().optional(),
      downPaymentPrice: z.string().optional(),
      exchangeRate: z.string().optional(),
      maintenanceFee: z.string().optional(),
      country2: z.string().optional(),
      province: z.string().optional(),
      district: z.string().optional(),
      neighborhood: z.string().optional(),
      address1: z.string().optional(),
      address2: z.string().optional(),
      latitude: z.string().optional(),
      longitude: z.string().optional(),
      daskStartDate: z.string().optional(),
      daskEndDate: z.string().optional(),
      daskPolicyNumber: z.string().optional(),
      propertyOwnerName: z.string().optional(),

      forownerpurchaseDate: z.string().optional(),

      nonRentStatus: z.string().optional(),
      mortgageStatus: z.string().optional(),
      propertyTransactionStatus: z.string().optional(),
    })
    .optional(),
  otherDetails: z
    .object({
      facade: z
        .array(z.enum(['', 'West', 'East', 'North', 'South']))
        .optional(),
      general: z
        .array(
          z.enum(['', 'Subdivided', 'Parcelled', 'Project', 'CornerParcel']),
        )
        .optional(),
      environment: z
        .array(
          z.enum([
            '',
            'ShoppingCenter',
            'Municipality',
            'Mosque',
            'Cemetery',
            'Seafront',
            'Pharmacy',
            'EntertainmentCenter',
            'Fair',
            'Hospital',
            'Church',
            'Market',
            'Park',
            'PoliceStation',
            'HealthCenter',
            'NeighborhoodMarket',
            'Gym',
            'University',
            'Primary/SecondarySchool',
            'CityCenter',
          ]),
        )
        .optional(),
      disabledFriendly: z
        .array(
          z.enum([
            '',
            'ParkingSpace',
            'Elevator',
            'Bathroom',
            'WideCorridor',
            'Entrance/Ramp',
            'Stairs',
            'Kitchen',
            'RoomDoor',
            'ParkingSocket/ElectricSwitch',
            'HandrailRailing',
            'Toilet',
            'SwimmingPool',
          ]),
        )
        .optional(),
      external: z
        .array(
          z.enum([
            '',
            'Elevator',
            'Balcony',
            'Garden',
            'Penthouse',
            'SeaBus',
            'CoveredGarage',
            'Nursery',
            'PrivatePool',
            'ParkingLot',
            'SwimmingPool',
            'SteamRoom',
            'Security',
            'TurkishBath',
            'Hydrophore',
            'ThermalInsulation',
            'Generator',
            'CableTV',
            'DaycareCenter',
            'Playground',
            'Sauna',
            'SoundInsulation',
            'Siding',
            'SportsArea',
            'WaterTank',
            'TennisCourt',
            'Satellite',
            'FireEscape',
            'SwimmingPool(Outdoor)',
          ]),
        )
        .optional(),
      internal: z
        .array(
          z.enum([
            '',
            'ADSL',
            'WoodenJoinery',
            'SmartHome',
            'BurglarAlarm',
            'FireAlarm',
            'SquatToilet',
            'AluminumJoinery',
            'AmericanKitchen',
            'Built-inOven',
            'Elevator',
            'Balcony',
            'Barbecue',
            'WhiteGoods',
            'Painted',
            'Dishwasher',
            'Refrigerator',
            'Wallpaper',
            'ShowerCabin',
            'MasterBathroom',
            'FiberInternet',
            'Oven',
            'DressingRoom',
            'Built-inWardrobe',
            'VideoIntercom',
            'HiltonBathroom',
            'IntercomSystem',
            'DoubleGlazing',
            'CentralHeating',
            'Carpet',
            'LaundryRoom',
            'Built-inKitchen',
            'Sauna',
            'FloorHeating',
            'CentralVacuum', // Yeni değer eklendi
          ]),
        )
        .optional(),

      transportation: z
        .array(
          z.enum([
            '',
            'MainRoad',
            'EurasiaTunnel',
            'BosphorusBridges',
            'Street',
            'SeaBus',
            'Minibus',
            'E5',
            'Airport',
            'Marmaray',
            'Metro',
            'Metrobus',
            'BusStop',
            'CableCar',
            'Tram',
            'Siding',
            'TrainStation',
            'Pier',
          ]),
        )
        .optional(),
      view: z
        .array(
          z.enum([
            '',
            'Bosphorus',
            'Sea',
            'Lake',
            'City',
            'Nature',
            'Mountain',
            'Park',
          ]),
        )
        .optional(),
      residentialType: z
        .array(
          z.enum([
            '',
            'IntermediateFloor',
            'IntermediateFloorDuplex',
            'GardenDuplex',
            'Penthouse',
            'Duplex',
            'FloorDuplex',
            'Detached',
            'Triplex',
            'GroundFloor',
            'Studio',
          ]),
        )
        .optional(),
      infrastructure: z
        .array(
          z.enum([
            '',
            'Electricity',
            'IndustrialElectricity',
            'Water',
            'Telephone',
            'NaturalGas',
            'Sewage',
            'WaterTreatment',
            'WellAndBorehole',
            'SoilStudy',
            'RoadCleared',
            'RoadNotCleared',
            'NoRoad',
          ]),
        )
        .optional(),
      location: z
        .array(
          z.enum([
            '',
            'CloseToMainRoad',
            'Seafront',
            'CloseToSea',
            'CloseToAirport',
            'CloseToPublicTransport',
            'NearSea',
          ]),
        )
        .optional(),
    })
    .optional(),
  titledeed: z
    .object({
      location: z.string().optional(),
      area: z.string().optional(),
      parcelShare: z.string().optional(),
      parcelShareholder: z.string().optional(),
      description: z.string().optional(),
      independentSectionDescription: z.string().optional(),
      volumeNumber: z.string().optional(),
      journalNumber: z.string().optional(),
      page: z.string().optional(),
      titleDeedDate: z.string().optional(),
      titleDeedType: z.string().optional(),
      titleDeedTransferMethod: z.string().optional(),
      titleDeedTransferDate: z.string().optional(),
      titledeedcountry: z.string().optional(),
      titledeedprovince: z.string().optional(),
      titledeeddistrict: z.string().optional(),
      titledeedneighborhood: z.string().optional(),
      ownership: z.string().optional(),
      mainPropertyDescription: z
        .enum(['', 'Arsa', 'BetonermeBinaveArsası'])
        .optional(),
      restrictionStatus: z.enum(['', 'Kisitli', 'KisitliDegil']).optional(),
      shareType: z
        .enum(['', 'Payli', 'Paylasilmis', 'Tam', 'Bagimsiz'])
        .optional(),
      bbShareRatio: z.string().optional(),
    })
    .optional(),
  asset: z
    .array(
      z.object({
        assetName: z.string().optional(),
        quantity: z.string().optional(),
        price: z.string().optional(),
      }),
    )
    .optional(),
  propertyOwnerId: z.string().optional(),
  personelId: z.string().optional(),
  portfolioId: z.string().optional(),
  photos: z.array(z.string()).optional(),
  files: z.array(z.string()).optional(),
})

const updatePropertyInput = z.object({
  updatedId: z.string(),
  isActive: z.boolean(),
  details: z
    .object({
      fundShareRatio: z.string().optional(), // Fon Hisse Oranı
      fundArea: z.string().optional(), // Fon m²
      grossM2Cost: z.string().optional(), // Brüt m² Maliyet
      valuationPricePerM2: z.string().optional(), // Değerleme m² Fiyatı
      costIncludingVAT: z.string().optional(), // KDV Dahil Maliyet
      valuationReportDate: z.string().optional(), // Değerleme Rapor Tarihi
      valueInValuationReport: z.string().optional(), // Değerleme Raporunda Yer Alan Değer
      portfolioValue: z.string().optional(), // Portföy Değeri//
      reportNumber: z.string().optional(), // Rapor No//
      propertyName: z.string().optional(),
      portfolioId: z.string(),
      block: z.string().optional(),
      bbNo: z.string().optional(),
      attribute: z
        .enum(['', 'konut', 'isyeri', 'ofis', 'dukkan', 'arsa'])
        .optional(),
      type: z.enum(['', '1+0', '1+1', '2+1']),
      usageType: z.enum(['', 'Bekliyor', 'Satilik', 'Kiralık']).optional(),
      netM2: z.string().optional(),
      grossM2: z.string().optional(),
      island: z.string().optional(),
      parcel: z.string().optional(),
      onShelf: z.string().optional(),
      propertyNumber: z.string().optional(),
      numberOfFloors: z.string().optional(),
      floor: z.string().optional(),
      buildingPermitDate: z.string().optional(),
      purchaseDate: z.string().optional(),
      purchasePrice: z.string().optional(),
      facades: z.enum(['Kuzey', 'Guney', 'Yol', 'Cephe']).optional(),
      referenceCode: z.string().optional(),
      zoningStatus: z
        .enum([
          'NazımImarPlani',
          'MekansalImarPlani',
          'CevreDuzeniPlani',
          'UygulamaImarPlani',
          'ParselasyonPlani',
          'IlaveImarPlani',
          'KorumaAmacliImarPlanı',
          'MevziImarPlanı',
        ])
        .optional(),
      benchmark: z.string().optional(),
      integrationCode: z.string().optional(),
      listingPrice: z.string().optional(),
      costPrice: z.string().optional(),
      bookValue: z.string().optional(),
      marketValue: z.string().optional(),
      specialPrice: z.string().optional(),
      downPaymentPrice: z.string().optional(),
      exchangeRate: z.string().optional(),
      maintenanceFee: z.string().optional(),
      country2: z.string().optional(),
      province: z.string().optional(),
      district: z.string().optional(),
      neighborhood: z.string().optional(),
      address1: z.string().optional(),
      address2: z.string().optional(),
      latitude: z.string().optional(),
      longitude: z.string().optional(),
      daskStartDate: z.string().optional(),
      daskEndDate: z.string().optional(),
      daskPolicyNumber: z.string().optional(),
      propertyOwnerName: z.string().optional(),
      forownerpurchaseDate: z.string().optional(),
      nonRentStatus: z.string().optional(),
      mortgageStatus: z.string().optional(),
      propertyTransactionStatus: z.string().optional(),

      propertyId: z.string().optional(), // Gayrimenkul ID'si//
      realEstateInvestmentsPortfolio: z.string().optional(), // Gayrimenkul Yatırımları Portföyü//
    })
    .optional(),
  otherDetails: z
    .object({
      facade: z
        .array(z.enum(['', 'West', 'East', 'North', 'South']))
        .optional(),
      general: z
        .array(
          z.enum(['', 'Subdivided', 'Parcelled', 'Project', 'CornerParcel']),
        )
        .optional(),
      environment: z
        .array(
          z.enum([
            '',
            'ShoppingCenter',
            'Municipality',
            'Mosque',
            'Cemetery',
            'Seafront',
            'Pharmacy',
            'EntertainmentCenter',
            'Fair',
            'Hospital',
            'Church',
            'Market',
            'Park',
            'PoliceStation',
            'HealthCenter',
            'NeighborhoodMarket',
            'Gym',
            'University',
            'Primary/SecondarySchool',
            'CityCenter',
          ]),
        )
        .optional(),
      disabledFriendly: z
        .array(
          z.enum([
            '',
            'ParkingSpace',
            'Elevator',
            'Bathroom',
            'WideCorridor',
            'Entrance/Ramp',
            'Stairs',
            'Kitchen',
            'RoomDoor',
            'ParkingSocket/ElectricSwitch',
            'HandrailRailing',
            'Toilet',
            'SwimmingPool',
          ]),
        )
        .optional(),
      external: z
        .array(
          z.enum([
            '',
            'Elevator',
            'Balcony',
            'Garden',
            'Penthouse',
            'SeaBus',
            'CoveredGarage',
            'Nursery',
            'PrivatePool',
            'ParkingLot',
            'SwimmingPool',
            'SteamRoom',
            'Security',
            'TurkishBath',
            'Hydrophore',
            'ThermalInsulation',
            'Generator',
            'CableTV',
            'DaycareCenter',
            'Playground',
            'Sauna',
            'SoundInsulation',
            'Siding',
            'SportsArea',
            'WaterTank',
            'TennisCourt',
            'Satellite',
            'FireEscape',
            'SwimmingPool(Outdoor)',
          ]),
        )
        .optional(),
      internal: z
        .array(
          z.enum([
            '',
            'ADSL',
            'WoodenJoinery',
            'SmartHome',
            'BurglarAlarm',
            'FireAlarm',
            'SquatToilet',
            'AluminumJoinery',
            'AmericanKitchen',
            'Built-inOven',
            'Elevator',
            'Balcony',
            'Barbecue',
            'WhiteGoods',
            'Painted',
            'Dishwasher',
            'Refrigerator',
            'Wallpaper',
            'ShowerCabin',
            'MasterBathroom',
            'FiberInternet',
            'Oven',
            'DressingRoom',
            'Built-inWardrobe',
            'VideoIntercom',
            'HiltonBathroom',
            'IntercomSystem',
            'DoubleGlazing',
            'CentralHeating',
            'Carpet',
            'LaundryRoom',
            'Built-inKitchen',
            'Sauna',
            'FloorHeating',
            'CentralVacuum', // Yeni değer eklendi
          ]),
        )
        .optional(),

      transportation: z
        .array(
          z.enum([
            '',
            'MainRoad',
            'EurasiaTunnel',
            'BosphorusBridges',
            'Street',
            'SeaBus',
            'Minibus',
            'E5',
            'Airport',
            'Marmaray',
            'Metro',
            'Metrobus',
            'BusStop',
            'CableCar',
            'Tram',
            'Siding',
            'TrainStation',
            'Pier',
          ]),
        )
        .optional(),
      view: z
        .array(
          z.enum([
            '',
            'Bosphorus',
            'Sea',
            'Lake',
            'City',
            'Nature',
            'Mountain',
            'Park',
          ]),
        )
        .optional(),
      residentialType: z
        .array(
          z.enum([
            '',
            'IntermediateFloor',
            'IntermediateFloorDuplex',
            'GardenDuplex',
            'Penthouse',
            'Duplex',
            'FloorDuplex',
            'Detached',
            'Triplex',
            'GroundFloor',
            'Studio',
          ]),
        )
        .optional(),
      infrastructure: z
        .array(
          z.enum([
            '',
            'Electricity',
            'IndustrialElectricity',
            'Water',
            'Telephone',
            'NaturalGas',
            'Sewage',
            'WaterTreatment',
            'WellAndBorehole',
            'SoilStudy',
            'RoadCleared',
            'RoadNotCleared',
            'NoRoad',
          ]),
        )
        .optional(),
      location: z
        .array(
          z.enum([
            '',
            'CloseToMainRoad',
            'Seafront',
            'CloseToSea',
            'CloseToAirport',
            'CloseToPublicTransport',
            'NearSea',
          ]),
        )
        .optional(),
    })
    .optional(),
  titledeed: z
    .object({
      location: z.string().optional(),
      area: z.string().optional(),
      parcelShare: z.string().optional(),
      parcelShareholder: z.string().optional(),
      description: z.string().optional(),
      independentSectionDescription: z.string().optional(),
      volumeNumber: z.string().optional(),
      journalNumber: z.string().optional(),
      page: z.string().optional(),
      titleDeedDate: z.string().optional(),
      titleDeedType: z.string().optional(),
      titleDeedTransferMethod: z.string().optional(),
      titleDeedTransferDate: z.string().optional(),
      titledeedcountry: z.string().optional(),
      titledeedprovince: z.string().optional(),
      titledeeddistrict: z.string().optional(),
      titledeedneighborhood: z.string().optional(),
      ownership: z.string().optional(),
      mainPropertyDescription: z
        .enum(['', 'Arsa', 'BetonermeBinaveArsası'])
        .optional(),
      restrictionStatus: z.enum(['', 'Kisitli', 'KisitliDegil']).optional(),
      shareType: z
        .enum(['', 'Payli', 'Paylasilmis', 'Tam', 'Bagimsiz'])
        .optional(),
      bbShareRatio: z.string().optional(),
    })
    .optional(),
  photos: z.array(z.string()).optional(),
})

//

const updatePortfolioInput = z.object({
  updatedId: z.string(),
  isActive: z.boolean(),
  portfoliotype: z
    .enum([
      '',
      'Site',
      'Tarla',
      'Ticari',
      'Endüstriyel',
      'Müstakil',
      'Arsa',
      'Bina',
      'Mix',
    ])
    .optional(),
  tasinmaztipi: z
    .enum(['', 'anatasinmaz', 'katmulkiyeti', 'katirtifakı'])
    .optional(),
  tasinmazno: z.string().optional(),
  duesM2Price: z.string().optional(),
  portfolioName: z.string().optional(),
  rentM2Price: z.string().optional(),
  country: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  neighborhood: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  personelId: z.string().optional(),
  propertyOwnerId: z.string().optional(),

  photos: z.string().optional(),

  otherDetails: z
    .object({
      facade: z
        .array(z.enum(['', 'West', 'East', 'North', 'South']))
        .optional(),
      general: z
        .array(
          z.enum(['', 'Subdivided', 'Parcelled', 'Project', 'CornerParcel']),
        )
        .optional(),
      environment: z
        .array(
          z.enum([
            '',
            'ShoppingCenter',
            'Municipality',
            'Mosque',
            'Cemetery',
            'Seafront',
            'Pharmacy',
            'EntertainmentCenter',
            'Fair',
            'Hospital',
            'Church',
            'Market',
            'Park',
            'PoliceStation',
            'HealthCenter',
            'NeighborhoodMarket',
            'Gym',
            'University',
            'Primary/SecondarySchool',
            'CityCenter',
          ]),
        )
        .optional(),
      disabledFriendly: z
        .array(
          z.enum([
            '',
            'ParkingSpace',
            'Elevator',
            'Bathroom',
            'WideCorridor',
            'Entrance/Ramp',
            'Stairs',
            'Kitchen',
            'RoomDoor',
            'ParkingSocket/ElectricSwitch',
            'HandrailRailing',
            'Toilet',
            'SwimmingPool',
          ]),
        )
        .optional(),
      external: z
        .array(
          z.enum([
            '',
            'Elevator',
            'Balcony',
            'Garden',
            'Penthouse',
            'SeaBus',
            'CoveredGarage',
            'Nursery',
            'PrivatePool',
            'ParkingLot',
            'SwimmingPool',
            'SteamRoom',
            'Security',
            'TurkishBath',
            'Hydrophore',
            'ThermalInsulation',
            'Generator',
            'CableTV',
            'DaycareCenter',
            'Playground',
            'Sauna',
            'SoundInsulation',
            'Siding',
            'SportsArea',
            'WaterTank',
            'TennisCourt',
            'Satellite',
            'FireEscape',
            'SwimmingPool(Outdoor)',
          ]),
        )
        .optional(),
      internal: z
        .array(
          z.enum([
            '',
            'ADSL',
            'WoodenJoinery',
            'SmartHome',
            'BurglarAlarm',
            'FireAlarm',
            'SquatToilet',
            'AluminumJoinery',
            'AmericanKitchen',
            'Built-inOven',
            'Elevator',
            'Balcony',
            'Barbecue',
            'WhiteGoods',
            'Painted',
            'Dishwasher',
            'Refrigerator',
            'Wallpaper',
            'ShowerCabin',
            'MasterBathroom',
            'FiberInternet',
            'Oven',
            'DressingRoom',
            'Built-inWardrobe',
            'VideoIntercom',
            'HiltonBathroom',
            'IntercomSystem',
            'DoubleGlazing',
            'CentralHeating',
            'Carpet',
            'LaundryRoom',
            'Built-inKitchen',
            'Sauna',
            'FloorHeating',
            'CentralVacuum', // Yeni değer eklendi
          ]),
        )
        .optional(),

      transportation: z
        .array(
          z.enum([
            '',
            'MainRoad',
            'EurasiaTunnel',
            'BosphorusBridges',
            'Street',
            'SeaBus',
            'Minibus',
            'E5',
            'Airport',
            'Marmaray',
            'Metro',
            'Metrobus',
            'BusStop',
            'CableCar',
            'Tram',
            'Siding',
            'TrainStation',
            'Pier',
          ]),
        )
        .optional(),
      view: z
        .array(
          z.enum([
            '',
            'Bosphorus',
            'Sea',
            'Lake',
            'City',
            'Nature',
            'Mountain',
            'Park',
          ]),
        )
        .optional(),
      residentialType: z
        .array(
          z.enum([
            '',
            'IntermediateFloor',
            'IntermediateFloorDuplex',
            'GardenDuplex',
            'Penthouse',
            'Duplex',
            'FloorDuplex',
            'Detached',
            'Triplex',
            'GroundFloor',
            'Studio',
          ]),
        )
        .optional(),
      infrastructure: z
        .array(
          z.enum([
            '',
            'Electricity',
            'IndustrialElectricity',
            'Water',
            'Telephone',
            'NaturalGas',
            'Sewage',
            'WaterTreatment',
            'WellAndBorehole',
            'SoilStudy',
            'RoadCleared',
            'RoadNotCleared',
            'NoRoad',
          ]),
        )
        .optional(),
      location: z
        .array(
          z.enum([
            '',
            'CloseToMainRoad',
            'Seafront',
            'CloseToSea',
            'CloseToAirport',
            'CloseToPublicTransport',
            'NearSea',
          ]),
        )
        .optional(),
    })
    .optional(),
  titleDeeds: z
    .object({
      location: z.string().optional(),
      area: z.string().optional(),
      parcelShare: z.string().optional(),
      parcelShareholder: z.string().optional(),
      description: z.string().optional(),
      independentSectionDescription: z.string().optional(),
      volumeNumber: z.string().optional(),
      journalNumber: z.string().optional(),
      page: z.string().optional(),
      titleDeedDate: z.string().optional(),
      titleDeedType: z.string().optional(),
      titleDeedTransferMethod: z.string().optional(),
      titleDeedTransferDate: z.string().optional(),
      titledeedcountry: z.string().optional(),
      titledeedprovince: z.string().optional(),
      titledeeddistrict: z.string().optional(),
      titledeedneighborhood: z.string().optional(),
      ownership: z.string().optional(),
      mainPropertyDescription: z
        .enum(['', 'Arsa', 'BetonermeBinaveArsası'])
        .optional(),
      restrictionStatus: z.enum(['', 'Kisitli', 'KisitliDegil']).optional(),
      shareType: z
        .enum(['', 'Payli', 'Paylasilmis', 'Tam', 'Bagimsiz'])
        .optional(),
      bbShareRatio: z.string().optional(),
    })
    .optional(),
})

const setPortfolioInput = z.object({
  portfoliotype: z
    .enum([
      '',
      'Site',
      'Tarla',
      'Ticari',
      'Endüstriyel',
      'Müstakil',
      'Arsa',
      'Bina',
      'Mix',
    ])
    .optional(),
  tasinmaztipi: z
    .enum(['', 'anatasinmaz', 'katmulkiyeti', 'katirtifakı'])
    .optional(),
  tasinmazno: z.string().optional(),
  ada: z.string().optional(),
  portfolioName: z.string().optional(),
  parcel: z.string().optional(),
  country: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  neighborhood: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  personelId: z.string().optional(),
  propertyOwnerId: z.string().optional(),

  photos: z.string().optional(),

  otherDetails: z
    .object({
      facade: z
        .array(z.enum(['', 'West', 'East', 'North', 'South']))
        .optional(),
      general: z
        .array(
          z.enum(['', 'Subdivided', 'Parcelled', 'Project', 'CornerParcel']),
        )
        .optional(),
      environment: z
        .array(
          z.enum([
            '',
            'ShoppingCenter',
            'Municipality',
            'Mosque',
            'Cemetery',
            'Seafront',
            'Pharmacy',
            'EntertainmentCenter',
            'Fair',
            'Hospital',
            'Church',
            'Market',
            'Park',
            'PoliceStation',
            'HealthCenter',
            'NeighborhoodMarket',
            'Gym',
            'University',
            'Primary/SecondarySchool',
            'CityCenter',
          ]),
        )
        .optional(),
      disabledFriendly: z
        .array(
          z.enum([
            '',
            'ParkingSpace',
            'Elevator',
            'Bathroom',
            'WideCorridor',
            'Entrance/Ramp',
            'Stairs',
            'Kitchen',
            'RoomDoor',
            'ParkingSocket/ElectricSwitch',
            'HandrailRailing',
            'Toilet',
            'SwimmingPool',
          ]),
        )
        .optional(),
      external: z
        .array(
          z.enum([
            '',
            'Elevator',
            'Balcony',
            'Garden',
            'Penthouse',
            'SeaBus',
            'CoveredGarage',
            'Nursery',
            'PrivatePool',
            'ParkingLot',
            'SwimmingPool',
            'SteamRoom',
            'Security',
            'TurkishBath',
            'Hydrophore',
            'ThermalInsulation',
            'Generator',
            'CableTV',
            'DaycareCenter',
            'Playground',
            'Sauna',
            'SoundInsulation',
            'Siding',
            'SportsArea',
            'WaterTank',
            'TennisCourt',
            'Satellite',
            'FireEscape',
            'SwimmingPool(Outdoor)',
          ]),
        )
        .optional(),
      internal: z
        .array(
          z.enum([
            '',
            'ADSL',
            'WoodenJoinery',
            'SmartHome',
            'BurglarAlarm',
            'FireAlarm',
            'SquatToilet',
            'AluminumJoinery',
            'AmericanKitchen',
            'Built-inOven',
            'Elevator',
            'Balcony',
            'Barbecue',
            'WhiteGoods',
            'Painted',
            'Dishwasher',
            'Refrigerator',
            'Wallpaper',
            'ShowerCabin',
            'MasterBathroom',
            'FiberInternet',
            'Oven',
            'DressingRoom',
            'Built-inWardrobe',
            'VideoIntercom',
            'HiltonBathroom',
            'IntercomSystem',
            'DoubleGlazing',
            'CentralHeating',
            'Carpet',
            'LaundryRoom',
            'Built-inKitchen',
            'Sauna',
            'FloorHeating',
            'CentralVacuum', // Yeni değer eklendi
          ]),
        )
        .optional(),

      transportation: z
        .array(
          z.enum([
            '',
            'MainRoad',
            'EurasiaTunnel',
            'BosphorusBridges',
            'Street',
            'SeaBus',
            'Minibus',
            'E5',
            'Airport',
            'Marmaray',
            'Metro',
            'Metrobus',
            'BusStop',
            'CableCar',
            'Tram',
            'Siding',
            'TrainStation',
            'Pier',
          ]),
        )
        .optional(),
      view: z
        .array(
          z.enum([
            '',
            'Bosphorus',
            'Sea',
            'Lake',
            'City',
            'Nature',
            'Mountain',
            'Park',
          ]),
        )
        .optional(),
      residentialType: z
        .array(
          z.enum([
            '',
            'IntermediateFloor',
            'IntermediateFloorDuplex',
            'GardenDuplex',
            'Penthouse',
            'Duplex',
            'FloorDuplex',
            'Detached',
            'Triplex',
            'GroundFloor',
            'Studio',
          ]),
        )
        .optional(),
      infrastructure: z
        .array(
          z.enum([
            '',
            'Electricity',
            'IndustrialElectricity',
            'Water',
            'Telephone',
            'NaturalGas',
            'Sewage',
            'WaterTreatment',
            'WellAndBorehole',
            'SoilStudy',
            'RoadCleared',
            'RoadNotCleared',
            'NoRoad',
          ]),
        )
        .optional(),
      location: z
        .array(
          z.enum([
            '',
            'CloseToMainRoad',
            'Seafront',
            'CloseToSea',
            'CloseToAirport',
            'CloseToPublicTransport',
            'NearSea',
          ]),
        )
        .optional(),
    })
    .optional(),
  titleDeeds: z
    .object({
      location: z.string().optional(),
      area: z.string().optional(),
      parcelShare: z.string().optional(),
      parcelShareholder: z.string().optional(),
      description: z.string().optional(),
      independentSectionDescription: z.string().optional(),
      volumeNumber: z.string().optional(),
      journalNumber: z.string().optional(),
      page: z.string().optional(),
      titleDeedDate: z.string().optional(),
      titleDeedType: z.string().optional(),
      titleDeedTransferMethod: z.string().optional(),
      titleDeedTransferDate: z.string().optional(),
      titledeedcountry: z.string().optional(),
      titledeedprovince: z.string().optional(),
      titledeeddistrict: z.string().optional(),
      titledeedneighborhood: z.string().optional(),
      ownership: z.string().optional(),
      mainPropertyDescription: z
        .enum(['', 'Arsa', 'BetonermeBinaveArsası'])
        .optional(),
      restrictionStatus: z.enum(['', 'Kisitli', 'KisitliDegil']).optional(),
      shareType: z
        .enum(['', 'Payli', 'Paylasilmis', 'Tam', 'Bagimsiz'])
        .optional(),
      bbShareRatio: z.string().optional(),
    })
    .optional(),
})

const testPhotoInput = z.object({
  userId: z.string().optional(),
  propertyId: z.string().optional(),
  portfolioId: z.string().optional(),
})

const testFileInput = z.object({
  userId: z.string().optional(),
  rentId: z.string(),
  paymentDate: z.string(),
  rentAmount: z.preprocess((val) => Number(val), z.number())
})

const getPropertyInput = z.object({
  propertyId: z.string().optional(),
  portfolioId: z.string().optional(),
  personelId: z.string().optional(),
})
const getPortfolioInput = z.object({
  portfolioId: z.string().optional(),
})
const deletePropertyInput = z.object({
  deleteId: z.string(),
})

const getLocationInput = z.object({
  citycode: z.string().optional(), // citycode isteğe bağlı bir string olarak tanımlanıyor
})
const adminLoginInput = z.object({
  email: z.string(),
  password: z.string(),
})

const setRentInput = z.object({
  propertyId: z.string().optional(),
  personelId: z.string().optional(),
  portfolioId: z.string().optional(),
  tenantId: z.string().optional(),
  contractType: z.string().optional(),
  currentCode: z.string().optional(),
  contractStartDate: z.string().optional(),
  contractEndDate: z.string().optional(),
  startingRentAmount: z.string().optional(),
  rentalfee: z.string().optional(),
  paymentDay: z.string().optional(),
  rentType: z.string().optional(),
  rentIncreaseType: z.string().optional(),
  depositAmount: z.string().optional(),
  maintenanceFee: z.string().optional(),
  maintenanceStartDate: z.string().optional(),
  maintenanceFeeAmount: z.string().optional(),
  propertyName: z.string().optional(), // propertyName isteğe bağlı
  tenantName: z.string().optional(), // tenantName isteğe bağlı
  tenanttype: z.enum(['isyeri', 'sahis']).optional(), // enum eklenmiş
  noticeoftermination: z.string().optional(),
  evacuationcommitment: z.enum(['var', 'yok']).optional(), // enum eklenmiş
  payments: z
    .array(
      z.object({
        paymentDate: z.string(), // Ödeme günü
        rentAmount: z.string(), // Kira bedeli
        isPaid: z.boolean(), // Ödenmiş olup olmadığı
        paidDate: z.string().nullable(), // Ödeme tarihi (ödenmemişse null)
        receipt: z.string().nullable(), // Dekont (ödenmemişse null)
      }),
    )
    .optional(), // Ödeme planını ekledik
})

const updateRentInput = z.object({
  updatedId: z.string(), // Güncellenmek istenen kira ID'si
  propertyId: z.string().optional(), // Mülk ID'si
  portfolioId: z.string().optional(), // Portföy ID'si
  tenantId: z.string().optional(), // Kiracı ID'si
  contractType: z.string().optional(), // Sözleşme tipi
  currentCode: z.string().optional(), // Mevcut kod
  contractStartDate: z.string().optional(), // Sözleşme başlangıç tarihi
  contractEndDate: z.string().optional(), // Sözleşme bitiş tarihi
  startingRentAmount: z.string().optional(), // Başlangıç kira bedeli
  rentAmount: z.string().optional(), // Kira bedeli
  paymentDay: z.string().optional(), // Ödeme günü
  rentType: z.string().optional(), // Kira tipi
  rentIncreaseType: z.string().optional(), // Kira artış tipi
  depositAmount: z.string().optional(), // Depozito miktarı
  maintenanceFee: z.string().optional(), // Bakım ücreti
  maintenanceStartDate: z.string().optional(), // Bakım başlangıç tarihi
  maintenanceFeeAmount: z.string().optional(), // Bakım ücreti miktarı
  isActive: z.boolean().optional(), // Aktiflik durumu

  tenanttype: z.enum(['isyeri', 'sahis']).optional(), // enum eklenmiş
  noticeoftermination: z.string().optional(),
  evacuationcommitment: z.enum(['var', 'yok']).optional(), // enum eklenmiş

  payments: z
    .array(
      z.object({
        paymentDate: z.string().optional(), // Ödeme tarihi
        rentAmount: z.string().optional(), // Kira bedeli
        isPaid: z.string().optional(), // Ödendi durumu
        paidDate: z.string().optional(), // Ödendiği tarih
        receipt: z.string().optional(), // Dekont
      }),
    )
    .optional(), // Ödeme bilgileri (opsiyonel)
})

const updateExpenseInput = z.object({
  updatedId: z.string(),
  isActive: z.boolean(),
  expenseDescription: z.string(),
  expenseName: z.string(),
  expenseAmount: z.string(),
  expensePaymentDate: z.string(),
  expenseStatus: z.enum(['odendi', 'odenmedi']),
})

const getRentInput = z.object({
  // propertyId:z.string()
})

const getRentByIdInput = z.object({
  rentId: z.string(),
})

const getExpenseByIdInput = z.object({
  expenseId: z.string(),
})

const setExpenseInput = z.object({
  propertyId: z.string(),
  expenseDescription: z.string(),
  expenseName: z.string(),
  expenseAmount: z.string(),
  expensePaymentDate: z.string(),
  expenseStatus: z.enum(['odendi', 'odenmedi']),
})

const getExpenseInput = z.object({
  propertyId: z.string(),
})

const photoSchema = z.object({
  // Bu, yüklenmiş dosyaların doğrulanması ile ilgili olabilir.
  // Örneğin, dosya türleri ve boyutları burada kontrol edilebilir.
  files: z.array(
    z.object({
      originalname: z.string(),
      mimetype: z.string(),
      size: z.number().min(1), // Dosya boyutu en az 1 byte olabilir.
    }),
  ),
})

const deleteRentInput = z.object({
  rentId: z.string(),
})

const deleteExpenseInput = z.object({
  expenseId: z.string(),
})

const setPhotoInput = z.object({
  propertyId: z.string(),
})
const getFileInput = z.object({
  propertyId: z.string(),
})

const getTitleDeedInput = z.object({
  propertyId: z.string(),
})

const deletePhotoInput = z.object({
  propertyId: z.string(),
  photoName: z.string(),
})

const markPaymentAsPaidInput = z.object({
  rentId: z.string(),
  paymentDate: z.string(),
  rentAmount: z.string(),
  isPaid: z.boolean(),
  paidDate: z.string(),
  receipt: z.string(),
})

const updateStatusTenantInput = z.object({
  updatedId: z.string(),
  isActive: z.boolean(),
})

const updateStatusPropertyInput = z.object({
  updatedId: z.string(),
  isActive: z.boolean(),
})

const loginUserInput = z.object({
  email: z.string(),
  password: z.string(),
})

const getPropertyCountInput = z.object({
  personelId: z.string().optional(),
})
const getListInput = z.object({})

module.exports = {
  getListInput,
  setPersonelInput,
  updatePersonelInput,
  getPersonelInput,
  deletePersonelInput,
  setCustomerInput,
  getCustomerInput,
  updateCustomerInput,
  deleteCustomerInput,
  setTenantInput,
  getTenantInput,
  updateTenantInput,
  deleteTenantInput,
  setPropertyInput,
  updatePropertyInput,
  getPropertyInput,
  deletePropertyInput,
  updateStatusPersonelInput,
  updateStatusTenantInput,
  getLocationInput,
  updateStatusCustomerInput,
  updateStatusPropertyInput,
  adminLoginInput,
  setRentInput,
  getRentInput,
  setExpenseInput,
  getExpenseInput,
  deleteRentInput,
  deleteExpenseInput,
  updateRentInput,
  getRentByIdInput,
  getExpenseByIdInput,
  setPhotoInput,
  photoSchema,
  testPhotoInput,
  updateExpenseInput,
  testFileInput,
  getFileInput,
  getTitleDeedInput,
  deletePhotoInput,
  setPortfolioInput,
  getPortfolioInput,
  loginUserInput,
  getPropertyCountInput,
  updatePortfolioInput,

  markPaymentAsPaidInput,
}
