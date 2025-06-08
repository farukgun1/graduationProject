function getJWTFromCookie() {
  const name = 'token='
  const cookieArray = document.cookie.split(';')
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim()
    if (cookie.indexOf(name) === 0) {
      return decodeURIComponent(cookie.substring(name.length, cookie.length))
    }
  }
  return null
}
const jwt = getJWTFromCookie()

console.log('jwt', jwt)

document.addEventListener('DOMContentLoaded', async function () {
  document.querySelectorAll('a[data-bs-toggle="tab"]').forEach((tabLink) => {
    tabLink.addEventListener('show.bs.tab', function (event) {
      debugger
      console.log('asdaa')
      const currentTab = document.querySelector('.tab-pane.active')
      const form = currentTab.querySelector('form')

      if (form && !form.checkValidity()) {
        event.preventDefault()
        form.reportValidity()
      }
    })
  })

  // İl verilerini getirir
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

  // İlçe dropdown doldurur
  async function populateDistricts(stateCode) {
    try {
      const data = await populateStates(stateCode)
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

  // Mahalle dropdown doldurur
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

  // Müşteri dropdown doldurur
  async function populateCustomer(personelId) {
    try {
      const url = 'http://localhost:3001/api/v1/emlakze/admin/getcustomer'
      const response = await axios.post(url, {})
      const selectElement = document.getElementById('propertyOwnerName')

      // Önceki seçenekleri temizle
      selectElement.innerHTML = ''

      // personelId’ye göre filtrele ve seçenekleri ekle
      response.data.data
        .filter((customer) => customer.personelId === personelId)
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

  // Portföy dropdown doldurur
  async function populatePortfolio(personelId) {
    try {
      const url = 'http://localhost:3001/api/v1/emlakze/admin/getportfolio'
      const response = await axios.post(url, { personelId })
      const portfolioselectElement = document.getElementById('portfolioId')

      // Önceki seçenekleri temizle
      portfolioselectElement.innerHTML = '<option value="">Seçiniz</option>'

      response.data.data.forEach((portfolio) => {
        const option = document.createElement('option')
        option.value = portfolio._id
        option.textContent = portfolio.portfolioName || 'Bilinmiyor'
        portfolioselectElement.appendChild(option)
      })
    } catch (error) {
      console.error('Portfolio data retrieval error:', error)
    }
  }

  // JWT’den payload çıkarma helper
  function base64UrlDecode(str) {
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

  // Kullanıcı adını göster
  if (payload && payload.name && payload.surname) {
    document.getElementById('user-name').textContent =
      `${payload.name} ${payload.surname}`
  }

  // Rol yoksa personel menüsünü gizle
  if (!payload || !payload.role || payload.role.trim() === '') {
    console.log('Role boş veya tanımlanmamış, personel menüsü gizlenmeli.')
    const personelMenu = document.getElementById('personel')
    if (personelMenu) {
      personelMenu.classList.add('d-none')
      console.log('Personel menüsü gizlendi.')
    } else {
      console.log('Personel menüsü bulunamadı.')
    }
  }

  // Demirbaş form satır ekleme/kaldırma
  const demirbasForm = document.getElementById('demirbas-form')

  if (demirbasForm) {
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
                  <i class="fa-solid fa-x"></i>
                </button>
              </div>
            </div>
          </div>
          <hr />
        </div>
      `
        assetContainer.insertAdjacentHTML('beforeend', newAssetRow)
      })

    demirbasForm.addEventListener('click', function (e) {
      if (e.target.matches('[data-repeater-delete]')) {
        const itemToRemove = e.target.closest('[data-repeater-item]')
        if (itemToRemove) itemToRemove.remove()
      }
    })
  } else {
    console.error('Demirbaş formu bulunamadı!')
  }

  // Dropdownlara ilk il verilerini doldur
  const dataa = await populateStates()

  const selectElement = document.getElementById('province')
  const districtSelectElement = document.getElementById('district')
  const neighborhoodSelectElement = document.getElementById('neighborhood')

  dataa.forEach((province) => {
    const option = document.createElement('option')
    option.value = province.code
    option.textContent = province.name
    selectElement.appendChild(option)
  })

  selectElement.addEventListener('change', async function (event) {
    districtSelectElement.innerHTML = ''
    neighborhoodSelectElement.innerHTML = ''
    const selectedValue = event.target.value
    await populateDistricts(selectedValue)
  })

  districtSelectElement.addEventListener('change', async function () {
    await populateNeighborhoods(this.value)
  })

  // Müşteri ve portföyü doldur
  const personelId = payload.id
  await populateCustomer(personelId)
  await populatePortfolio(personelId)

  // Form gönderme işlemi
  document
    .querySelector('.btn-submit-all')
    .addEventListener('click', async function () {
      const tabContentContainers = document.querySelectorAll(
        '.bs-stepper-content .content',
      )
      const allFormData = {}

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

      const propertyOwnerSelect = document.getElementById('propertyOwnerName')
      const propertyOwnerId = propertyOwnerSelect.value
      const personelId = payload.id
      const portfolioSelect = document.getElementById('portfolioId')
      const portfolioId = portfolioSelect.value

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
        propertyOwnerId,
        personelId,
        portfolioId,
      }

      const assetRows = document.querySelectorAll('[data-repeater-item]')
      assetRows.forEach((row) => {
        const assetName = row.querySelector('input[name="assetName"]').value
        const quantity = row.querySelector('input[name="quantity"]').value
        const price = row.querySelector('input[name="price"]').value

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

      try {
        // 1. Mülk bilgilerini backend'e gönder
        const formResponse = await axios.post(
          'http://localhost:3001/api/v1/emlakze/admin/setproperty',
          organizedData,
          { headers: { 'Content-Type': 'application/json' } },
        )

        // 2. Fotoğrafları backend'e gönder
        const propertyId = formResponse.data.savedProperty._id
        const photoFormData = new FormData()
        photoFormData.append('propertyId', propertyId)
        for (let i = 0; i < files.length; i++) {
          photoFormData.append('photos', files[i])
        }

        const photoResponse = await axios.post(
          'http://localhost:3001/api/v1/emlakze/admin/setphotos',
          photoFormData,
          { headers: { 'Content-Type': 'multipart/form-data' } },
        )

        console.log('Photo Response:', photoResponse.data)

        Swal.fire({
          icon: 'success',
          title: 'Mülk Başarıyla Eklendi!',
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
          title: 'Mülk Eklenemedi!',
          text: 'Lütfen tekrar deneyin.',
          showConfirmButton: true,
        })
      }
    })
})
