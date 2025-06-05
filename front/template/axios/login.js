async function postLogin() {
  try {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const requestData = {
      email,
      password,
    }

    console.log(requestData)

    const response = await axios.post(
      'https://emlak.dveb.com.tr//api/v1/emlakze/admin/loginuser',
      requestData,
    )

    console.log('Response:', response)

    if (response.status === 200) {
      document.cookie = `token=${response.data}`
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Giriş başarılı.',
      }).then(() => {
        window.location.href = 'dashboard.html'
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: response.data.msg,
      })
    }
  } catch (error) {
    console.error('Login request error:', error)
    Swal.fire({
      icon: 'error',
      title: 'Hata!',
      text: 'Email veya şifre hatalı.',
    })
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('login-personel')

  form.addEventListener('submit', async function (event) {
    event.preventDefault()

    const personelEmailInput = document.getElementById('personel-email')
    const personelPasswordInput = document.getElementById('personel-password')

    const formData = {
      email: personelEmailInput.value.trim(),
      password: personelPasswordInput.value.trim(),
    }
    console.log('fğeğdçsdfv', formData)

    try {
      const response = await axios.post(
        'http://localhost:3001/api/v1/emlakze/admin/loginuser',
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )

      console.log('response', response.data.data)
      if (response.status === 200) {
        document.cookie = `token=${response.data.data}`
        Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Giriş başarılı.',
        }).then(() => {
          window.location.href = 'dashboard.html'
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Hata!',
          text: response.data.data.msg,
        })
      }
    } catch (error) {
      console.error(
        'Hata:',
        error.response ? error.response.data : error.message,
      )

      // Hata mesajı
      Swal.fire({
        icon: 'error',
        title: 'Bir hata oluştu!',
        text: 'Lütfen tekrar deneyin.',
        showConfirmButton: true,
      })
    }
  })
})
