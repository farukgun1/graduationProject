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

$(document).ready(function () {
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

  console.log('payloadpayload', payload)
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const id = urlParams.get('id')

  console.log('Tenant ID:', id)

  if (!id) {
    console.error('Tenant ID bulunamadı.')
    return
  }

  async function getTenant() {
    try {
      const response = await axios.post(
        'https://emlak.dveb.com.tr/api/v1/emlakze/admin/gettenant',
        {},
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )

      if (response.status !== 200)
        throw new Error('Network response was not ok')
      return response.data.data
    } catch (error) {
      console.error('Personel verileri alınırken bir hata oluştu:', error)
      return []
    }
  }

  async function populateForm(id) {
    try {
      const tenantData = await getTenant()
      const tenant = tenantData.find((p) => p._id === id)
      console.log('Kiracı Verisi:', tenant)

      if (tenant) {
        document.querySelector('#tenant-name').value = tenant.name || ''
        document.querySelector('#tenant-surname').value = tenant.surname || ''
        document.querySelector('#tenant-email').value = tenant.email || ''
        document.querySelector('#tenant-phone').value = tenant.phone || ''
        document.querySelector('#tenant-tc').value = tenant.taxId || ''
        document.querySelector('#tenant-secondPersonFirstName').value =
          tenant.secondPersonFirstName || ''
        document.querySelector('#tenant-secondPersonLastName').value =
          tenant.secondPersonLastName || ''
        document.querySelector('#tenant-secondPersonPhone').value =
          tenant.secondPersonPhone || ''
        document.querySelector('#tenant-rating').value = tenant.rating || ''
      } else {
        console.error('Kiracı bulunamadı.')
      }
    } catch (error) {
      console.error('Form verilerini doldururken bir hata oluştu:', error)
    }
  }

  // Sayfa yüklendiğinde formu doldur
  populateForm(id)

  // Formu gönder
  $('#edit-tenant').on('submit', async function (event) {
    event.preventDefault() // Sayfanın yeniden yüklenmesini engelle

    const formData = {
      updatedId: id,
      name: $('#tenant-name').val(),
      surname: $('#tenant-surname').val(),
      email: $('#tenant-email').val(),
      phone: $('#tenant-phone').val(),
      taxId: $('#tenant-tc').val(),
      secondPersonFirstName: $('#tenant-secondPersonFirstName').val(),
      secondPersonLastName: $('#tenant-secondPersonLastName').val(),
      secondPersonPhone: $('#tenant-secondPersonPhone').val(),
      rating: $('#tenant-rating').val(),
      isActive: true,
    }

    try {
      const response = await axios.post(
        'https://emlak.dveb.com.tr/api/v1/emlakze/admin/updatetenant',
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
      console.log('Güncelleme Yanıtı:', response.data)
      Swal.fire('Başarı', 'Kiracı başarıyla güncellendi!', 'success')
    } catch (error) {
      console.error(
        'Güncelleme Hatası:',
        error.response ? error.response.data : error.message,
      )
      Swal.fire('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.', 'error')
    }
  })
})
