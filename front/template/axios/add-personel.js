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

document.addEventListener('DOMContentLoaded', function () {
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

  if (payload && payload.name) {
    document.getElementById('user-name').textContent = payload.name
  }

  const form = document.getElementById('add-personel')

  form.addEventListener('submit', async function (event) {
    event.preventDefault()

    const personelNameInput = document.getElementById('personel-name')
    const personelSurnameInput = document.getElementById('personel-surname')
    const personelPhoneInput = document.getElementById('personel-phonenumber')
    const personelEmailInput = document.getElementById('personel-email')
    const personelPasswordInput = document.getElementById('personel-password')

    const formData = {
      name: personelNameInput.value.trim(),
      surname: personelSurnameInput.value.trim(),
      phoneNumber: personelPhoneInput.value.trim(),
      email: personelEmailInput.value.trim(),
      password: personelPasswordInput.value.trim(),
      type: 'personel',
    }

    try {
      const response = await axios.post(
        'http://localhost:3001/api/v1/emlakze/admin/setpersonel2', // 🔁 endpoint düzeltildi
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(jwt && { Authorization: `Bearer ${jwt}` }), // 🔐 JWT eklemesi varsa
          },
        },
      )
      console.log('Gönderilen formData:', formData) // Burada

      console.log('Kullanılan JWT:', jwt) // Burada
      console.log('✅ response', response.data)

      Swal.fire({
        icon: 'success',
        title: 'Personel başarıyla eklendi!',
        showConfirmButton: true,
        timer: 1500,
      }).then((result) => {
        if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
          form.reset()
        }
      })
    } catch (error) {
      console.error(
        '❌ Hata:',
        error.response ? error.response.data : error.message,
      )

      Swal.fire({
        icon: 'error',
        title: 'Bir hata oluştu!',
        text: 'Lütfen tekrar deneyin.',
        showConfirmButton: true,
      })
    }
  })
})
