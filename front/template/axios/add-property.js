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

document.addEventListener('DOMContentLoaded', async function () {
  // ========== JWT Parslama ==========
  function base64UrlDecode(str) {
    return atob(str.replace(/-/g, '+').replace(/_/g, '/'))
  }
  let payload
  if (jwt && jwt.split('.').length === 3) {
    try {
      const parts = jwt.split('.')
      payload = JSON.parse(
        decodeURIComponent(escape(base64UrlDecode(parts[1]))),
      )
    } catch (error) {
      console.error('Geçersiz JWT formatı:', error)
    }
  }

  if (payload && payload.name && payload.surname) {
    const userElem = document.getElementById('user-name')
    if (userElem) userElem.textContent = `${payload.name} ${payload.surname}`
  }
  if (!payload || !payload.role || payload.role.trim() === '') {
    const personelMenu = document.getElementById('personel')
    if (personelMenu) personelMenu.classList.add('d-none')
  }

  // ========== Dropdown Helper Fonksiyonlar ==========
  async function populateStates(citycode) {
    try {
      let url = 'http://localhost:3001/api/v1/emlakze/admin/getlocation'
      let requestData = {}
      if (citycode) requestData.citycode = citycode
      const response = await axios.post(url, requestData)
      return response.data
    } catch (error) {
      console.error('İl verileri alınırken hata oluştu:', error)
      return []
    }
  }
  async function fillProvinceDropdown(selectId) {
    const provinces = await populateStates()
    const select = document.getElementById(selectId)
    if (!select) return
    select.innerHTML = '<option value="">Seç</option>'
    provinces.forEach((province) => {
      const option = document.createElement('option')
      option.value = province.code
      option.textContent = province.name
      select.appendChild(option)
    })
  }
  async function fillDistrictDropdown(stateCode, selectId) {
    const data = await populateStates(stateCode)
    const districtSelectElement = document.getElementById(selectId)
    if (!districtSelectElement) return
    districtSelectElement.innerHTML = '<option value="">Seç</option>'
    Object.keys(data).forEach((district) => {
      const option = document.createElement('option')
      option.value = district
      option.textContent = district
      districtSelectElement.appendChild(option)
    })
  }
  async function fillNeighborhoodDropdown(stateCode, district, selectId) {
    const data = await populateStates(stateCode)
    const neighborhoodSelectElement = document.getElementById(selectId)
    if (!neighborhoodSelectElement) return
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

  // Dropdown grupları
  const provinceSet = [
    {
      province: 'province',
      district: 'district',
      neighborhood: 'neighborhood',
    },
    {
      province: 'titledeedprovince',
      district: 'titledeeddistrict',
      neighborhood: 'titledeedneighborhood',
    },
  ]
  // İlleri doldur
  for (const group of provinceSet) {
    await fillProvinceDropdown(group.province)
  }
  // Event ekle
  provinceSet.forEach((group) => {
    const provinceSelect = document.getElementById(group.province)
    const districtSelect = document.getElementById(group.district)
    const neighborhoodSelect = document.getElementById(group.neighborhood)
    if (provinceSelect) {
      provinceSelect.addEventListener('change', async function () {
        districtSelect.innerHTML = '<option value="">Seç</option>'
        neighborhoodSelect.innerHTML = '<option value="">Seç</option>'
        if (this.value) await fillDistrictDropdown(this.value, group.district)
      })
    }
    if (districtSelect) {
      districtSelect.addEventListener('change', async function () {
        neighborhoodSelect.innerHTML = '<option value="">Seç</option>'
        if (provinceSelect.value && this.value) {
          await fillNeighborhoodDropdown(
            provinceSelect.value,
            this.value,
            group.neighborhood,
          )
        }
      })
    }
  })

  // ========== Müşteri, Portföy ==========
  async function populateCustomer(personelId) {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/v1/emlakze/admin/getcustomer',
        {},
      )
      const selectElement = document.getElementById('propertyOwnerName')
      if (!selectElement) return
      selectElement.innerHTML = ''
      response.data.data
        .filter((c) => c.personelId === personelId)
        .forEach((c) => {
          const option = document.createElement('option')
          option.value = c._id
          option.textContent = `${c.name} ${c.surname}`
          selectElement.appendChild(option)
        })
    } catch (err) {
      console.error('Customer error:', err)
    }
  }
  async function populatePortfolio(personelId) {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/v1/emlakze/admin/getportfolio',
        { personelId },
      )
      const selectElement = document.getElementById('portfolioId')
      if (!selectElement) return
      selectElement.innerHTML = '<option value="">Seçiniz</option>'
      response.data.data.forEach((p) => {
        const option = document.createElement('option')
        option.value = p._id
        option.textContent = p.portfolioName || 'Bilinmiyor'
        selectElement.appendChild(option)
      })
    } catch (err) {
      console.error('Portfolio error:', err)
    }
  }
  if (payload?.id) {
    await populateCustomer(payload.id)
    await populatePortfolio(payload.id)
  }

  // ========== Demirbaş ==========
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
  }

  // ========== Form Gönderme ==========
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
