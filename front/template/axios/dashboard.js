// function getJWTFromCookie() {
//   const name = 'token='
//   const cookieArray = document.cookie.split(';')
//   for (let i = 0; i < cookieArray.length; i++) {
//     let cookie = cookieArray[i].trim()
//     if (cookie.indexOf(name) === 0) {
//       return decodeURIComponent(cookie.substring(name.length, cookie.length))
//     }
//   }
//   return null
// }

// const jwt = getJWTFromCookie()

// document.addEventListener('DOMContentLoaded', async function () {
//   let payload = null

//   if (jwt && jwt.split('.').length === 3) {
//     try {
//       const parts = jwt.split('.')
//       payload = JSON.parse(decodeURIComponent(escape(window.atob(parts[1]))))
//     } catch (error) {
//       console.error('Geçersiz JWT formatı:', error)
//       return
//     }
//   } else {
//     console.log('JWT cookie bulunamadı veya geçersiz formatta.')
//     return
//   }

//   if (payload && payload.name && payload.surname) {
//     document.getElementById('user-name').textContent =
//       `${payload.name} ${payload.surname}`
//   }

//   const personelId = payload?.id

//   async function fetchPropertyCount() {
//     try {
//       const response = await axios.post(
//         'http://localhost:3001/api/v1/emlakze/admin/getpropertycount',
//         { personelId },
//         { headers: { 'Content-Type': 'application/json' } },
//       )

//       const totalProperties = response.data.propertyCount
//       document.getElementById('total-property-count').innerText =
//         totalProperties
//     } catch (error) {
//       console.error('Error fetching property count:', error)
//     }
//   }

//   async function fetchRentCount() {
//     try {
//       const response = await axios.post(
//         'http://localhost:3001/api/v1/emlakze/admin/getrentcount',
//         { personelId },
//         { headers: { 'Content-Type': 'application/json' } },
//       )

//       const totalRents = response.data.propertyCount
//       document.getElementById('total-rent-count').innerText = totalRents
//     } catch (error) {
//       console.error('Error fetching rent count:', error)
//     }
//   }

//   async function fetchPersonelCount() {
//     try {
//       const response = await axios.post(
//         'http://localhost:3001/api/v1/emlakze/admin/getpersonelcount',
//         {},
//         { headers: { 'Content-Type': 'application/json' } },
//       )

//       const totalPersonnel = response.data.data.totalPersonnel
//       document.getElementById('total-personel-count').innerText = totalPersonnel
//     } catch (error) {
//       console.error('Error fetching personnel count:', error)
//     }
//   }

//   async function fetchAverageRentIncome() {
//     try {
//       const response = await axios.post(
//         'http://localhost:3001/api/v1/emlakze/admin/calculateAverageRentIncome',
//         { personelId },
//         { headers: { 'Content-Type': 'application/json' } },
//       )

//       // API'den dönen veri
//       const averageIncome = response.data?.data?.averageIncome || 0 // Doğru path ile averageIncome alınır

//       console.log(`Tahmini Kira Geliri: ${averageIncome}`)

//       // DOM elementini bul ve değeri güncelle
//       const incomeElement = document.getElementById('estimated-rent-income')
//       if (incomeElement) {
//         incomeElement.innerText = `${averageIncome} TL` // Gelen değeri ekrana yazdır
//       } else {
//         console.error("Element 'estimated-rent-income' bulunamadı.")
//       }
//     } catch (error) {
//       console.error('Error fetching rent income:', error)

//       // Hata durumunda HTML elemanını güncelle
//       const incomeElement = document.getElementById('estimated-rent-income')
//       if (incomeElement) {
//         incomeElement.innerText = 'Hata'
//       }
//     }
//   }

//   await fetchPropertyCount()
//   await fetchRentCount()
//   await fetchPersonelCount()
//   await fetchAverageRentIncome() // Doğru personelId ile çağırılıyor
// })

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

document.addEventListener('DOMContentLoaded', async function () {
  const jwt = getJWTFromCookie()
  let payload = null

  if (jwt && jwt.split('.').length === 3) {
    try {
      const parts = jwt.split('.')
      payload = JSON.parse(decodeURIComponent(escape(window.atob(parts[1]))))
    } catch (error) {
      console.error('Geçersiz JWT formatı:', error)
      return
    }
  } else {
    console.log('JWT cookie bulunamadı veya geçersiz formatta.')
    return
  }

  if (payload?.name && payload?.surname) {
    const userNameElement = document.getElementById('user-name')
    if (userNameElement) {
      userNameElement.textContent = `${payload.name} ${payload.surname}`
    }
  }

  const personelId = payload?.id
  if (!personelId) {
    console.error('personelId JWT içinden alınamadı.')
    return
  }

  async function fetchPropertyCount() {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/v1/emlakze/admin/getpropertycount',
        { personelId },
        { headers: { 'Content-Type': 'application/json' } },
      )
      const totalProperties = response.data.propertyCount
      document.getElementById('total-property-count').innerText =
        totalProperties
    } catch (error) {
      console.error('Error fetching property count:', error)
    }
  }

  async function fetchRentCount() {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/v1/emlakze/admin/getrentcount',
        { personelId },
        { headers: { 'Content-Type': 'application/json' } },
      )
      const totalRents = response.data.propertyCount
      document.getElementById('total-rent-count').innerText = totalRents
    } catch (error) {
      console.error('Error fetching rent count:', error)
    }
  }

  async function fetchPersonelCount() {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/v1/emlakze/admin/getpersonelcount',
        {},
        { headers: { 'Content-Type': 'application/json' } },
      )
      const totalPersonnel = response.data.data.totalPersonnel
      document.getElementById('total-personel-count').innerText = totalPersonnel
    } catch (error) {
      console.error('Error fetching personnel count:', error)
    }
  }

  async function fetchAverageRentIncome() {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/v1/emlakze/admin/calculateAverageRentIncome',
        { personelId },
        { headers: { 'Content-Type': 'application/json' } },
      )
      const averageIncome = response.data?.data?.totalExpectedIncome || 0

      console.log(`Tahmini Kira Geliri: ${averageIncome}`)

      const incomeElement = document.getElementById('estimated-rent-income')
      if (incomeElement) {
        incomeElement.innerText = `${averageIncome} TL`
      } else {
        console.error("Element 'estimated-rent-income' bulunamadı.")
      }
    } catch (error) {
      console.error('Error fetching rent income:', error)
      const incomeElement = document.getElementById('estimated-rent-income')
      if (incomeElement) {
        incomeElement.innerText = 'Hata'
      }
    }
  }

  // Verileri sırayla çek
  await fetchPropertyCount()
  await fetchRentCount()
  await fetchPersonelCount()
  await fetchAverageRentIncome()
})
