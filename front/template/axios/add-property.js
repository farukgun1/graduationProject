function getJWTFromCookie() {
  const name = "token=";
  const cookieArray = document.cookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim(); // trim ile baştaki ve sondaki boşlukları temizleyin
      if (cookie.indexOf(name) === 0) {
          return decodeURIComponent(cookie.substring(name.length, cookie.length)); // Değerini decode edin
      }
  }
  return null;
}
const jwt = getJWTFromCookie();

console.log("jwt",jwt)


document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[data-bs-toggle="tab"]').forEach(tabLink => {
    tabLink.addEventListener('show.bs.tab', function(event) {
      debugger;
      console.log('asdaa');
        const currentTab = document.querySelector('.tab-pane.active');
        const form = currentTab.querySelector('form');
  
        if (form && !form.checkValidity()) {
            event.preventDefault(); // Tab geçişini engelle
            form.reportValidity(); // Hataları göster
        }
    });
  });
})


async function populateStates(citycode) {
  try {
    let url = 'http://localhost:3001/api/v1/emlakze/admin/getLocation'
    let requestData = {}

    if (citycode) {
      requestData.citycode = citycode
    }

    const response = await axios.post(url, requestData)
    return response.data
  } catch (error) {
    console.error('İl verileri alınırken hata oluştu:', error)
  }
}


async function populateDistricts(stateCode) {
  try {
    const data = await populateStates(stateCode)
    const stateData = data[stateCode]
    console.log(data)
    console.log(stateCode)
    const districtSelectElement = document.getElementById('district')

    districtSelectElement.innerHTML = '<option value="">Seç</option>'
    Object.keys(data).forEach((district) => {
      const option = document.createElement('option')
      option.value = district
      option.textContent = district
      districtSelectElement.appendChild(option)
    })
  } catch (error) {
    console.error('İlçeler verileri alınırken hata oluştu:', error)
  }
}

// İlçeleri doldur
async function populateDistrictsTwo(stateCode) {
  try {
    const data = await populateStates(stateCode)
    const stateData = data[stateCode]
    console.log(data)
    console.log(stateCode)
    const districtSelectElement = document.getElementById('titledeeddistrict')

    districtSelectElement.innerHTML = '<option value="">Seç</option>'
    Object.keys(data).forEach((district) => {
      const option = document.createElement('option')
      option.value = district
      option.textContent = district
      districtSelectElement.appendChild(option)
    })
  } catch (error) {
    console.error('İlçeler verileri alınırken hata oluştu:', error)
  }
}

async function populateNeighborhoods(district) {
  const data = await populateStates(document.getElementById('province').value)
  const neighborhoodSelectElement = document.getElementById('neighborhood')

  neighborhoodSelectElement.innerHTML = '<option value="">Seç</option>'
  if (data[district]) {
    data[district].forEach((neighborhood) => {
      const option = document.createElement('option')
      option.value = neighborhood
      option.textContent = neighborhood
      neighborhoodSelectElement.appendChild(option)
    })
  }
}

async function populateNeighborhoodsTwo(district) {
  const data = await populateStates(
    document.getElementById('titledeedprovince').value,
  )
  const neighborhoodSelectElement = document.getElementById(
    'titledeedneighborhood',
  )

  neighborhoodSelectElement.innerHTML = '<option value="">Seç</option>'
  if (data[district]) {
    data[district].forEach((neighborhood) => {
      const option = document.createElement('option')
      option.value = neighborhood
      option.textContent = neighborhood
      neighborhoodSelectElement.appendChild(option)
    })
  }
}

// Populate customer dropdown
async function populateCustomer(personelId) {
  try {
    const url = 'http://localhost:3001/api/v1/emlakze/admin/getcustomer';
    const response = await axios.post(url, {});
    const selectElement = document.getElementById('propertyOwnerName');

    // Clear previous options
    selectElement.innerHTML = '';

    // Filter customers by personelId
    response.data.data
      .filter(customer => customer.personelId === personelId) // Filter logic
      .forEach((customer) => {
        const option = document.createElement('option');
        option.value = customer._id;
        option.textContent = `${customer.name} ${customer.surname}`;
        selectElement.appendChild(option);
      });
  } catch (error) {
    console.error('Customer data retrieval error:', error);
  }
}


async function populatePortfolio(personelId) {
  try {
    const url = 'http://localhost:3001/api/v1/emlakze/admin/getportfolio';
    
    // API'den verileri alın
    const response = await axios.post(url, { personelId });
    const selectElement = document.getElementById('portfolioId');

    // Önceki seçenekleri temizle
    selectElement.innerHTML = '<option value="">Seçiniz</option>';

    // Gelen verileri işle ve seçim kutusuna ekle
    response.data.data.forEach((portfolio) => {
      const option = document.createElement('option');
      option.value = portfolio._id; // ID değerini value olarak ayarla
      option.textContent = portfolio.portfolioname; // Görünen metni portfolioname olarak ayarla
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error('Portfolio data retrieval error:', error);
  }
}


document.addEventListener('DOMContentLoaded', async function () {
  function base64UrlDecode(str) {
    // Base64url formatındaki token'ı base64 formatına çeviriyoruz
    return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
}

let payload;

if (jwt && jwt.split('.').length === 3) {
    console.log('Cookie içindeki JWT:', jwt);
    try {
        const parts = jwt.split('.');
        const header = JSON.parse(base64UrlDecode(parts[0]));
        payload = JSON.parse(decodeURIComponent(escape(base64UrlDecode(parts[1]))));

        console.log('Header:', header);
        console.log('Payload:', payload);
    } catch (error) {
        console.error('Geçersiz JWT formatı:', error);
        //window.location.href = '/giris';
    }
} else {
    //window.location.href = '/giris';
    console.log('JWT cookie bulunamadı veya geçersiz formatta.');
}

console.log("payloadpayload",payload)
  const demirbasForm = document.getElementById('demirbas-form')

  if (demirbasForm) {
    // "Demirbaş Ekle" butonuna tıklandığında yeni satır ekle
    document
      .getElementById('data-repeater-create')
      .addEventListener('click', function () {
        const assetContainer = demirbasForm.querySelector(
          '[data-repeater-list="assets"]',
        )
        const newAssetRow = `
                <div data-repeater-item>
                    <div class="row d-flex align-items-end">
                        <div class="col-md-4 col-12">
                            <div class="mb-1">
                                <label class="form-label" for="assetName">Demirbaş Adı</label>
                                <input type="text" name="assetName" class="form-control" placeholder="Demirbaş adı" />
                            </div>
                        </div>
                        <div class="col-md-2 col-12">
                            <div class="mb-1">
                                <label class="form-label" for="quantity">Miktar</label>
                                <input type="number" name="quantity" class="form-control" placeholder="1" />
                            </div>
                        </div>
                        <div class="col-md-2 col-12">
                            <div class="mb-1">
                                <label class="form-label" for="price">Fiyat</label>
                                <input type="text" name="price" class="form-control" placeholder="Fiyat" />
                            </div>
                        </div>
                        <div class="col-md-2 col-12 mb-50">
                            <div class="mb-1">
                                <button class="btn btn-outline-danger text-nowrap px-1" data-repeater-delete type="button">
                                    <i data-feather="x" class="me-25"></i>
                                 
                                </button>
                            </div>
                        </div>
                    </div>
                    <hr />
                </div>
            `
        assetContainer.insertAdjacentHTML('beforeend', newAssetRow)
      })

    // Kaldırma işlemi için olay dinleyici
    demirbasForm.addEventListener('click', function (e) {
      if (e.target.matches('[data-repeater-delete]')) {
        const itemToRemove = e.target.closest('[data-repeater-item]')
        if (itemToRemove) {
          itemToRemove.remove() // Satırı kaldır
        }
      }
    })
  } else {
    console.error('Demirbaş formu bulunamadı!')
  }

  const dataa = await populateStates()

  const selectElement = document.getElementById('province')
  const districtSelectElement = document.getElementById('district')
  const neighborhoodSelectElement = document.getElementById('neighborhood')

  const selectElementtitledeed = document.getElementById('titledeedprovince')
  console.log(selectElementtitledeed)
  const titledeeddistrictSelectElement =
    document.getElementById('titledeeddistrict')
  const titledeedneighborhoodSelectElement = document.getElementById(
    'titledeedneighborhood',
  )

  dataa.forEach((province) => {
    const option = document.createElement('option')
    option.value = province.code
    option.textContent = province.name
    selectElement.appendChild(option)
  })

  dataa.forEach((province) => {
    const option = document.createElement('option')
    option.value = province.code
    option.textContent = province.name
    selectElementtitledeed.appendChild(option)
  })

  selectElement.addEventListener('change', async function (event) {
    districtSelectElement.innerHTML = ''
    neighborhoodSelectElement.innerHTML = ''
    const selectedValue = event.target.value
    await populateDistricts(selectedValue)
  })

  selectElementtitledeed.addEventListener('change', async function (event) {
    titledeeddistrictSelectElement.innerHTML = ''
    titledeedneighborhoodSelectElement.innerHTML = ''
    const selectedValue = event.target.value
    await populateDistrictsTwo(selectedValue)
  })

  titledeeddistrictSelectElement.addEventListener('change', async function () {
    await populateNeighborhoodsTwo(this.value)
  })

  districtSelectElement.addEventListener('change', async function () {
    await populateNeighborhoods(this.value)
  })

  // Populate customer dropdown
  const personelId=payload.id;
  await populateCustomer(personelId)
  await populatePortfolio(personelId)

  // Handle form submission
  document
    .querySelector('.btn-submit-all')
    .addEventListener('click', async function () {
      const tabContentContainers = document.querySelectorAll(
        '.bs-stepper-content .content',
      )
      const allFormData = {}

      // Collect form data
      tabContentContainers.forEach((container) => {
        const form = container.querySelector('form')
        if (form) {
          const formId = form.id
          const formData = new FormData(form)

          const formObject = {}
          formData.forEach((value, key) => {
            if (formId === 'imkan-form') {
              if (formObject[key]) {
                if (Array.isArray(formObject[key])) {
                  formObject[key].push(value)
                } else {
                  formObject[key] = [formObject[key], value]
                }
              } else {
                formObject[key] = [value]
              }
            } else {
              formObject[key] = value
            }
          })

          allFormData[formId] = formObject
        }
      })
 const propertyOwnerSelect = document.getElementById('propertyOwnerName'); // Ensure this ID matches your select element
  const propertyOwnerId = propertyOwnerSelect.value; // Get the selected value
  const personelId=payload.id;



      // Handle files
      const files = document.getElementById('formFileMultiple').files

      const organizedData = {
        details: {
          ...(allFormData['genel-form'] || {}),
          ...(allFormData['mulkbilgileri-form'] || {}),
          ...(allFormData['adres-form'] || {}),
          ...(allFormData['fiyat-form'] || {}),

          ...(allFormData['mulksahibi-form'] || {}),
          ...(allFormData['digerbilgiler-form'] || {}),
          ...(allFormData['durumbilgiler-form'] || {}),
        },
        asset: [],
        propertyOwnerId:propertyOwnerId,
        personelId:personelId,
        
      }
      console.log(personelId)
      console.log(propertyOwnerSelect)
      const assetRows = document.querySelectorAll('[data-repeater-item]')
      assetRows.forEach((row) => {
        const assetName = row.querySelector('input[name="assetName"]').value
        const quantity = row.querySelector('input[name="quantity"]').value
        const price = row.querySelector('input[name="price"]').value

        console.log(
          `Asset Name: ${assetName}, Quantity: ${quantity}, Price: ${price}`,
        ) // Debugging için

        // Sadece değerler boş değilse ekle
        if (assetName && quantity && price) {
          organizedData.asset.push({
            assetName,
            quantity,
            price,
          })
        }
      })




      organizedData.otherDetails = allFormData['imkan-form'] || {}
      organizedData.titledeed = allFormData['tapu-form'] || {}
      console.log(organizedData.titledeed)
      console.log(organizedData)

      try {
        // 1. Send form data
        const formResponse = await axios.post(
          'http://localhost:3001/api/v1/emlakze/admin/setproperty',
          organizedData,
          { headers: { 'Content-Type': 'application/json' } },
        )

        console.log(organizedData)
        // Handle response and prepare for photo upload
        const propertyId = formResponse.data.savedProperty._id

        const photoFormData = new FormData()
        photoFormData.append('propertyId', propertyId)
        for (let i = 0; i < files.length; i++) {
          photoFormData.append('photos', files[i])
        }

        // 2. Send photos
        const photoResponse = await axios.post(
          'http://localhost:3001/api/v1/emlakze/admin/setphotos',
          photoFormData,
          { headers: { 'Content-Type': 'multipart/form-data' } },
        )

        console.log('Photo Response:', photoResponse.data)

        Swal.fire({
          icon: 'success',
          title: 'Data saved successfully!',
          showConfirmButton: true,
          timer: 1500,
        }).then((result) => {
          if (
            result.isConfirmed ||
            result.dismiss === Swal.DismissReason.timer
          ) {
            tabContentContainers.forEach((container) => {
              const form = container.querySelector('form')
              if (form) {
                form.reset()
              }
            })
          }
        })
      } catch (error) {
        console.error(
          'Error:',
          error.response ? error.response.data : error.message,
        )
        Swal.fire({
          icon: 'error',
          title: 'An error occurred!',
          text: 'Please try again.',
          showConfirmButton: true,
        })
      }
    })
})
