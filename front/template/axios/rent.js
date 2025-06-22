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
  // DataTables'ı başlat
  const table = $('#rentTable').DataTable({
    language: {
      decimal: '',
      emptyTable: 'Tabloda veri yok',
      info: 'Gösterilen _START_ ile _END_ arasındaki _TOTAL_ kayıt',
      infoEmpty: 'Gösterilecek kayıt yok',
      infoFiltered: '(toplam _MAX_ kayıttan filtrelendi)',
      infoPostFix: '',
      thousands: ',',
      lengthMenu: '_MENU_  Kayıtları Göster',
      loadingRecords: 'Yükleniyor...',
      processing: 'İşleniyor...',
      search: 'Ara:',
      searchPlaceholder: 'Arama yapın...',
      zeroRecords: 'Eşleşen kayıt bulunamadı',
      paginate: {
        first: 'İlk',
        last: 'Son',
        next: 'Sonraki',
        previous: 'Önceki',
      },
      aria: {
        sortAscending: ': artan sütun sıralamasını etkinleştir',
        sortDescending: ': azalan sütun sıralamasını etkinleştir',
      },
    },
  })
  async function getRent() {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/v1/emlakze/admin/getallrent',
        {},
        { headers: { 'Content-Type': 'application/json' } },
      )

      if (response.status !== 200) {
        throw new Error('Network response was not ok')
      }
      const rentData = response.data.rents

      const filteredData = rentData.filter(
        (item) => item.personelId === payload.id,
      )

      console.log(rentData)
      // Tabloyu temizle
      table.clear().draw()

      // Kiralama verilerini tabloya ekle
      filteredData.forEach((rent) => {
        console.log('tenantName:', rent.tenantName)
        console.log('propertyName:', rent.propertyName)
        table.row
          .add([
            rent.tenantName,
            rent.propertyName,
            rent.rentalfee,
            rent.contractStartDate,
            rent.contractEndDate,
            // `<button class="btn btn-success btn-sm edit-btn" title="Düzenle" data-id="${rent._id}">
            //     <i class="fas fa-edit"></i>
            // </button>`,
            // `<button class="btn btn-info btn-sm info-btn" title="Detay" data-id="${rent._id}">
            //     <i class="fas fa-info-circle"></i>
            // </button>`
            `<button class="btn btn-success btn-sm edit-btn" title="Düzenle" data-id="${rent._id}"><i class="fas fa-edit"></i></button>
                     <button class="btn btn-info btn-sm info-btn" title="Detay" data-id="${rent._id}"><i class="fas fa-info"></i></button>`,
          ])
          .draw()
      })
    } catch (error) {
      console.error('Kiralama verileri alınırken bir hata oluştu:', error)
    }
  }

  function editRent(id) {
    window.location.href = `edit-rent.html?id=${id}`
  }

  function infoRent(id) {
    window.location.href = `list-rentspaid.html?id=${id}`
  }

  // Sayfa yüklendiğinde kiralama verilerini çekin
  getRent()

  // DataTables olayları
  $('#rentTable').on('click', '.edit-btn', function () {
    const id = $(this).data('id')
    editRent(id)
  })

  $('#rentTable').on('click', '.info-btn', function () {
    const id = $(this).data('id')
    infoRent(id)
  })
})
