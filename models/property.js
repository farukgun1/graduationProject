const { Type } = require('@aws-sdk/client-s3');
const mongoose = require('mongoose')


//Özellik Şeması
const DetailSchema = new mongoose.Schema({



  // New fields
  fundShareRatio: { // Fon Hisse Oranı
    type: String,
    required: false
  },
  fundArea: { // Fon m2
    type: String,
    required: false
  },
  grossM2Cost: { // Brüt m2 Maliyet
    type: String,
    required: false
  },
  valuationPricePerM2: { // Değerleme m2 Fiyatı
    type: String,
    required: false
  },
  costIncludingVAT: { // KDV Dahil Maliyet
    type: String,
    required: false
  },
  valuationReportDate: { // Değerleme Rapor Tarihi
    type: String,
    required: false
  },
  valueInValuationReport: { // Değerleme Raporunda Yer Alan Değer
    type: String,
    required: false
  },
  portfolioValue: { // Portföy Değeri
    type: String,
    required: false
  },
  reportNumber: { // Rapor No
    type: String,
    required: false
  },
  realEstateCode: { // G. Menkul Kodu
    type: String,
    required: false
  },

  propertyId: { // Gayrimenkul ID'si
    type: String,
    required: false
  },
  realEstateInvestmentsPortfolio: { // Gayrimenkul Yatırımları Portföyü
    type: String,
    required: false
  },



















  propertyName: {
    type: String,
    required: false,
  },
  portfolioId: {
    type: String,
    required: true
  },
  block: {
    type: String,
    required: false
  },
  bbNo: {
    type: String,
    required: true 
  },
  attribute: {
    type: String,
    enum: ['konut', 'isyeri', 'ofis', 'dukkan', 'arsa'],
    required: true
  },
  type: {
    type: String,
    enum:['1+0', '1+1', '2+1','3+1','4+1','3+1Dblx','2+1Dblx','1+1Loft','2+1Loft' ,'StudyoLoft'],
    required: true
  },
  usageType: {
    type: String,
    enum: ['Bekliyor', 'Satılık', 'Kiralık'], 
    required: true 
  },
  netM2: {
    type: String,
    required: false 
  },
  grossM2: {
    type: String,
    required: false 
  },
  island: {
    type: String,
    required: false 
  },
  parcel: {
    type: String,
    required: false 
  },
  onShelf: {
    type: String,
    default: false
  },

  //Mülk Bilgileri
  propertyNumber: { 
    type: String,
    required: false
  },
  numberOfFloors: { 
    type: String,
    required: false
  },
  floor: { 
    type: String,
    required: false
  },
  buildingPermitDate: { 
    type: String,
    required: false
  },
  purchaseDate: { 
    type: String,
    required: false
  },
  purchasePrice: { 
    type: String,
    required: false
  },
 
  facades: { 
    type: String, 
    enum:['','Kuzey','Guney','Yol','Cephe'],

    required: false
  },
  referenceCode: { 
    type: String,

    required: false
  },
  zoningStatus: { 
    type: String,
    enum: [
     '', 'NazımImarPlani', 'MekansalImarPlani', 'CevreDuzeniPlani', 'UygulamaImarPlani',
      'ParselasyonPlani', 'IlaveImarPlani', 'KorumaAmacliImarPlani', 'MevziImarPlani'
    ],
   
    required: false
}
,
  benchmark: { 
    type: String,
    required: false
  },
  integrationCode: { 
    type: String,
    required: false
  },


  //Fiyat Bilgileri

  listingPrice: { 
    type: String,
    required: false
  },
  costPrice: { 
    type: String,
    required: false
  },
  bookValue: { 
    type: String,
    required: false
  },
  marketValue: { 
    type: String,
    required: false
  },
  specialPrice: { 
    type: String,
    required: false
  },
  downPaymentPrice: { 
    type: String,
    required: false
  },
  exchangeRate: { 
    type: String,
    required: false
  },
  maintenanceFee: { 
    type: String,
    required: false
  },



  //Konum Bilgileri
  country2: { 
    type: String,
    required: false
  },
  province: {
    type: String,
    required: false
  },
  district: { 
    type: String,
    required: false
  },
  neighborhood: { 
    type: String,
    required: false
  },
  address1: { 
    type: String,
    required: false
  },
  address2: {
    type: String,
    required: false
  },
  latitude: { 
    type: String,
    required: false
  },
  longitude: { 
    type: String,
    required: false
  },

  //Diğer
  daskStartDate: {
    type: String,
    required: false
  },
  daskEndDate: { 
    type: String,
    required: false
  },
  daskPolicyNumber: { 
    type: String,
    required: false
  },
  //Mülk Sahibi Bilgileri
  propertyOwnerName: { 
    type: String,
    required: false
  },


  forownerpurchaseDate: {
    type: String,
    required: false
  },


 
  //Durum Bilgileri
  nonRentStatus: { 
    type: String,
    enum:['Bos','Dolu'],
    required: false
  },
  mortgageStatus: { 
    type: String,
    enum:['Aktif','Pasif'],
    required: false
  },
  propertyTransactionStatus: { 
    type: String,
    enum:['Kiralanabilir','Satilabilir'],
    required: false
  }


});








//Diğer Özelliker Şeması
const OtherDetailSchema=new mongoose.Schema({
    facade: {
        type: [String],
        enum: [
          'West', 'East', 'North', 'South'
        ],
        required: false
      },
      general: {
        type: [String],
        enum: [
          'Subdivided', 'Parcelled', 'Project', 'CornerParcel'
        ],
        required: false
      },
      environment: {
        type: [String],
        enum: [
          'ShoppingCenter', 'Municipality', 'Mosque', 'Cemetery',
          'Seafront', 'Pharmacy', 'EntertainmentCenter', 'Fair',
          'Hospital', 'Church', 'Market', 'Park', 'PoliceStation',
          'HealthCenter', 'NeighborhoodMarket', 'Gym', 'University',
          'Primary/SecondarySchool', 'CityCenter'
        ],
        required: false
      },
      disabledFriendly: {
        type: [String],
        enum: [
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
            'SwimmingPool'
          ],
        required: false
      },
      external: {
        type: [String],
        enum: [
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
            'SwimmingPool(Outdoor)'
        ],
        required: false
      },
      internal: {
        type: [String],
        enum: [
          'ADSL', 'WoodenJoinery', 'SmartHome', 'BurglarAlarm', 'FireAlarm',
          'SquatToilet', 'AluminumJoinery', 'AmericanKitchen', 'Built-inOven',
          'Elevator', 'Balcony', 'Barbecue', 'WhiteGoods', 'Painted',
          'Dishwasher', 'Refrigerator', 'Wallpaper', 'ShowerCabin', 'MasterBathroom',
          'FiberInternet', 'Oven', 'DressingRoom', 'Built-inWardrobe',
          'VideoIntercom', 'HiltonBathroom', 'IntercomSystem', 'DoubleGlazing',
          'Jacuzzi', 'Cornice', 'Pantry', 'AirConditioning', 'Bathtub',
          'LaminateFlooring', 'Marley', 'Furniture', 'Built-inKitchen',
          'LaminateKitchen', 'NaturalGasKitchen', 'PVCJoinery', 'Shutters',
          'WoodenFlooring', 'CeramicFlooring', 'Stove', 'SpotLighting',
          'Terrace', 'WaterHeater', 'Vestibule', 'WiFi', 'FacialRecognition&Fingerprint',
          'ClothesDryer', 'WashingMachine', 'LaundryRoom', 'SteelDoor',
          'InstantWaterHeater', 'Fireplace'
        ],
        required: false
      },
      transportation: {
        type: [String],
        enum: [
          "MainRoad",
          "EurasiaTunnel",
          "BosphorusBridges",
          "Street",
          "SeaBus",
          "Minibus",
          "E5",
          "Airport",
          "Marmaray",
          "Metro",
          "Metrobus",
          "BusStop",
          "CableCar",
          "Tram",
          "Siding",
          "TrainStation",
          "Pier"
        ],
        required: false
      },
      view: {
        type: [String],
        enum: [
          'Bosphorus', 'Sea', 'Lake', 'City', 'Nature', 'Mountain', 'Park'
        ],
        required: false
      },
      residentialType: {
        type: [String],
        enum: [
          'IntermediateFloor', 'IntermediateFloorDuplex', 'GardenDuplex', 'Penthouse',
          'Duplex', 'FloorDuplex', 'Detached', 'Triplex', 'GroundFloor', 'Studio'
        ],
        required: false
      },
      infrastructure: {
        type: [String],
        enum: [
        "Electricity",      
      "IndustrialElectricity", 
      "Water",           
      "Telephone",         
      "NaturalGas",       
      "Sewage",            
      "WaterTreatment",   
      "WellAndBorehole",   
      "SoilStudy",         
      "RoadCleared",       
      "RoadNotCleared",    
      "NoRoad"             
        ],
        required: false
      },
      location: {
        type: [String],
        enum: [
          "CloseToMainRoad",
          "Seafront",
          "CloseToSea",
          "CloseToAirport",
          "CloseToPublicTransport",
          "NearSea"
        ],
        required: false
      }



});

const RentSchema = new mongoose.Schema({
  rentId: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    required: false,
    default: true,
  }
}, { _id: false });

const ExpenseSchema=new mongoose.Schema({
  expenseId: {
    type:String,
    required: false,
   
  },
  isActive: {
    type: Boolean,
    required: false,
    default:true,
  },


}, { _id: false })

//Tapu Şeması
const TitleDeed=new mongoose.Schema({

 

  location: { 
    type: String,
    required: false
  },
  area: {
    type: String,
    required: false
  },
  parcelShare: { 
    type: String,
    required: false
  },
  parcelShareholder: { 
    type: String,
    required: false
  },
  description: { 
    type: String,
    required: false
  },
  independentSectionDescription: { 
    type: String,
    required: false
  },
  volumeNumber: { 
    type: String,
    required: false
  },
  journalNumber: { 
    type: String,
    required: false
  },
  page: { 
    type: String,
    required: false
  },
  titleDeedDate: {
    type: String,
    required: false
  },
  titleDeedType: { 
    type: String,
    required: false
  },
  titleDeedTransferMethod: { 
    type: String,
    required: false
  },
  titleDeedTransferDate: { 
    type: String,
    required: false
  },
  titledeedcountry: { 
    type: String,
    required: false
  },
  titledeedprovince: { 
    type: String,
    required: false
  },
  titledeeddistrict: { 
    type: String,
    required: false
  },
  titledeedneighborhood: {
    type: String,
    required: false
  },
  ownership: { 
    type: String,
    required: false
  },
  mainPropertyDescription: { 
    type: String,
    enum:['Arsa','BetonermeBinaveArsası'],
    required: false
  },
  restrictionStatus: { 
    type: String,
    enum:['Kisitli','KisitliDegil'],
    required: false
  },
  shareType: { 
    type: String,
    enum:['Payli','ElBirligi'],
    required: false
  },
  bbShareRatio: { 
    type: String,
    required: false
  }


},{ _id: false });


const AssetSchema = new mongoose.Schema({
  assetName: { 
    type: String,
    required: false
  },
  quantity: {
    type: String, 
    required: false
  },
  price: { 
    type: String, 
    required: false
  },
}, { _id: false });











// Ana Konu Şeması

const property= new mongoose.Schema({

      details: [DetailSchema],
      otherDetails:[OtherDetailSchema],
      titledeed:TitleDeed,
      rents:[RentSchema],
      expenses:[ExpenseSchema],
      asset:[AssetSchema],
      photos: [{ 
        type: String, 
        required: false
      }],
      propertyOwnerId: { 
        type: String,
        required: false
      },
      personelId: { 
        type: String,
        required: false
      },
    
      
      isActive: {
        type: Boolean,
        required: false,
        default:true,
      },

      createdAt: {
        type: Number,
        required: false,
      },
      updatedAt: {
        type: Number,
        required: false,
      },
      actions: {
        type: Array,
        default: [],
      },

});

const propertySchema = mongoose.model('properties', property)

module.exports = { propertySchema }