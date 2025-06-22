document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('register-personel')

  form.addEventListener('submit', async function (event) {
    event.preventDefault()

    const personelNameInput = document.getElementById('personel-name')
    const personelSurnameInput = document.getElementById('personel-surname')
    const personelPhoneInput = document.getElementById('personel-phonenumber')
    const personelEmailInput = document.getElementById('personel-email')

    const formData = {
      name: personelNameInput.value.trim(),
      surname: personelSurnameInput.value.trim(),
      phoneNumber: personelPhoneInput.value.trim(),
      email: personelEmailInput.value.trim(),
    }

    try {
      const response = await axios.post(
        'http://localhost:3001/api/v1/emlakze/admin/setpersonel2',
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )

      console.log('response', response.data)

      Swal.fire({
        icon: 'success',
        title: 'Başarıyla kayıt oldunuz!',
        showConfirmButton: true,
        timer: 1500,
      }).then((result) => {
        if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
          form.reset()
        }
      })
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
