function getJWTFromCookie() {
  const name = 'token='
  const cookieArray = document.cookie.split(';')
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim() // trim ile baştaki ve sondaki boşlukları temizleyin
    if (cookie.indexOf(name) === 0) {
      return decodeURIComponent(cookie.substring(name.length, cookie.length)) // Değerini decode edin
    }
  }
  return null
}
const jwt = getJWTFromCookie()

console.log('jwt', jwt)

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[data-bs-toggle="tab"]').forEach((tabLink) => {
    tabLink.addEventListener('show.bs.tab', function (event) {
      debugger
      console.log('asdaa')
      const currentTab = document.querySelector('.tab-pane.active')
      const form = currentTab.querySelector('form')

      if (form && !form.checkValidity()) {
        event.preventDefault() // Tab geçişini engelle
        form.reportValidity() // Hataları göster
      }
    })
  })
})

async function populateStates(citycode) {
  try {
    let url = 'http://localhost:3001/api/v1/emlakze/admin/getlocation'
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

// İlçeleri doldur
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
    const url = 'http://localhost:3001/api/v1/emlakze/admin/getcustomer'
    const response = await axios.post(url, {})
    const selectElement = document.getElementById('propertyOwnerName')

    // Clear previous options
    selectElement.innerHTML = ''

    // Filter customers by personelId
    response.data.data
      .filter((customer) => customer.personelId === personelId) // Filter logic
      .forEach((customer) => {
        const option = document.createElement('option')
        option.value = customer._id
        option.textContent = `${customer.name} ${customer.surname}`
        selectElement.appendChild(option)
      })
  } catch (error) {
    console.error('Customer data retrieval error:', error)
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  function base64UrlDecode(str) {
    // Base64url formatındaki token'ı base64 formatına çeviriyoruz
    return atob(str.replace(/-/g, '+').replace(/_/g, '/'))
  }

  let payload

  if (jwt && jwt.split('.').length === 3) {
    console.log('Cookie içindeki JWT:', jwt)
    try {
      const parts = jwt.split('.')
      const header = JSON.parse(base64UrlDecode(parts[0]))
      payload = JSON.parse(
        decodeURIComponent(escape(base64UrlDecode(parts[1]))),
      )

      console.log('Header:', header)
      console.log('Payload:', payload)
    } catch (error) {
      console.error('Geçersiz JWT formatı:', error)
    }
  } else {
    console.log('JWT cookie bulunamadı veya geçersiz formatta.')
  }
  if (payload && payload.name && payload.surname) {
    document.getElementById('user-name').textContent =
      `${payload.name} ${payload.surname}`
  }
  if (!payload || !payload.role || payload.role.trim() === '') {
    console.log('Role boş veya tanımlanmamış, personel menüsü gizlenmeli.')

    const personelMenu = document.getElementById('personel')
    if (personelMenu) {
      personelMenu.classList.add('d-none')

      console.log('Personel menüsü gizlendi.')
    } else {
      console.log('Personel menüsü bulunamadı.')
    }
    console.log('fff', personelMenu)
  }
  const personelId = payload.id
  await populateCustomer(personelId)

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

          debugger
          console.log(formData)
          const formObject = {}
          formData.forEach((value, key) => {
            console.log('22')
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

      const personelId = payload.id
      const propertyOwnerSelect = document.getElementById('propertyOwnerName') // Ensure this ID matches your select element
      const propertyOwnerId = propertyOwnerSelect.value // Get the selected value

      const organizedData = {
        ...(allFormData['genel-form'] || {}),
        ...(allFormData['adres-form'] || {}),

        personelId: personelId,
        propertyOwnerId: propertyOwnerId,
      }
      console.log(personelId)

      organizedData.otherDetails = allFormData['imkan-form'] || {}
      organizedData.titleDeeds = allFormData['tapu-form'] || {}

      try {
        // 1. Send form data
        const formResponse = await axios.post(
          'http://localhost:3001/api/v1/emlakze/admin/setportfolio',
          organizedData,
          { headers: { 'Content-Type': 'application/json' } },
        )

        console.log('Form Response:', formResponse.data.data._id)

        const portfolioId =
          formResponse.data.data._id ||
          formResponse.data.data.savedProperty?._id

        if (!portfolioId) {
          throw new Error('Portföy ID alınamadı. Kayıt başarısız.')
        }

        if (!portfolioId) {
          throw new Error('Portföy ID alınamadı. Kayıt başarısız.')
        }

        const filesInput = document.getElementById('formFileMultiple')
        const files = filesInput.files

        if (files.length > 0) {
          const photoFormData = new FormData()
          photoFormData.append('portfolioId', portfolioId) // Backend bu değeri arıyor

          for (let i = 0; i < files.length; i++) {
            photoFormData.append('files', files[i]) // Dosyaları ekle
          }

          // Dosya yükleme isteğini gönder
          const photoResponse = await axios.post(
            'http://localhost:3001/api/v1/emlakze/admin/setfilesportfolio',
            photoFormData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
          )

          console.log('Photo Response:', photoResponse.data)
        }

        // Başarı mesajı
        Swal.fire({
          icon: 'success',
          title: 'Portföy Başarıyla Eklendi!',
          text: 'Dosyalar yüklendiyse kontrol ediniz.',
          showConfirmButton: true,
          timer: 1500,
        }).then((result) => {
          if (
            result.isConfirmed ||
            result.dismiss === Swal.DismissReason.timer
          ) {
            // Formları temizle
            document
              .querySelectorAll('.bs-stepper-content .content form')
              .forEach((form) => form.reset())
          }
        })
      } catch (error) {
        console.error(
          'Hata:',
          error.response ? error.response.data : error.message,
        )
        Swal.fire({
          icon: 'error',
          title: 'Portföy Eklenemedi!',
          text: 'Lütfen tekrar deneyiniz.',
          showConfirmButton: true,
        })
      }
    })
})
