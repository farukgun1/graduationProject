const mongoose = require('mongoose');


const OtherDetailSchema=new mongoose.Schema({
    facade: {
        type: [String],
        enum: [
          'West', 'East', 'North', 'South'
        ],
        required: true
      },
      general: {
        type: [String],
        enum: [
          'Subdivided', 'Parcelled', 'Project', 'CornerParcel'
        ],
        required: true
      },
      environment: {
        type: [String],
        enum: [
          'ShoppingCenter', 'Municipality', 'Mosque', 'Cemetery',
          'Seafront', 'Pharmacy', 'EntertainmentCenter', 'Fair',
          'Hospital', 'Church', 'Market', 'Park', 'Police Station',
          'Health Center', 'NeighborhoodMarket', 'Gym', 'University',
          'Primary/Secondary School', 'CityCenter'
        ],
        required: true
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
        required: true
      },
      external: {
        type: [String],
        enum: [
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
            'Sports Area',
            'WaterTank',
            'TennisCourt',
            'Satellite',
            'FireEscape',
            'SwimmingPool(Outdoor)'
        ],
        required: true
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
        required: true
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
          "Highway",
          "TrainStation",
          "Pier"
        ],
        required: true
      },
      view: {
        type: [String],
        enum: [
          'Bosphorus', 'Sea', 'Lake', 'City', 'Nature', 'Mountain', 'Park'
        ],
        required: true
      },
      residentialType: {
        type: [String],
        enum: [
          'IntermediateFloor', 'IntermediateFloorDuplex', 'GardenDuplex', 'Penthouse',
          'Duplex', 'FloorDuplex', 'Detached', 'Triplex', 'GroundFloor', 'Studio', 'Elevator'
        ],
        required: true
      },
      infrastructure: {
        type: [String],
        enum: [
        "Electricity",       // Elektrik
      "IndustrialElectricity", // Sanayi Elektriği
      "Water",             // Su
      "Telephone",         // Telefon
      "NaturalGas",        // Doğalgaz
      "Sewage",            // Kanalizasyon
      "WaterTreatment",    // Arıtma
      "WellAndBorehole",   // Sondaj & Kuyu
      "SoilStudy",         // Zemin Etüdü
      "RoadCleared",       // Yolu Açılmış
      "RoadNotCleared",    // Yolu Açılmamış
      "NoRoad"             // Yolu Yok
        ],
        required: true
      },
      location: {
        type: [String],
        enum: [
          "CloseToMainRoad",     // Ana Yola Yakın
          "Seafront",            // Denize Sıfır
          "CloseToSea",          // Denize Yakın
          "CloseToAirport",      // Havaalanına Yakın
          "CloseToPublicTransport" // Toplu Ulaşıma Yakın
        ],
        required: false
      }



});



const portfolio = new mongoose.Schema({
  
    portfoliotype: {
        type: String,
        enum: ['Site', 'Ticari', 'Endüstriyel', 'Müstakil', 'Arsa', 'Bina', 'Mix'],
        required: false
    },
    
    duesM2Price:{
        type:String,
        required:false
    },
    rentM2Price:{
        type:String,
        required:false
    },
    country: { 
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
    
      latitude: { 
        type: String,
        required: false
      },
      longitude: { 
        type: String,
        required: false
      },


      photos:{ 
        type: String, 
        required: false
      },
    
      otherDetails:[OtherDetailSchema],

    
    isActive: {
        type: Boolean,
        required: false,
        default: true
    },
    createdAt: {
        type: Number,
        required: false
    },
    updatedAt: {
        type: Number,
        required: false
    },
    actions: {
        type: Array,
        default: []
    },
});



const portfolioSchema = mongoose.model('portfolios', portfolio)

module.exports = { portfolioSchema }

