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

$(document).ready(function() {

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


    // DataTables'ı başlat
    const table = $('#customerTable').DataTable();

  
    async function getCustomer() {
        try {
            const response = await axios.post(
                "http://localhost:3001/api/v1/emlakze/admin/getCustomer",
                {},
                { headers: { "Content-Type": "application/json" } }
            );
    
            if (response.status !== 200) {
                throw new Error("Network response was not ok");
            }
    
            const customerData = response.data.data;


            console.log("customerData",customerData)

            console.log("payload.id",payload.id)
            console.log("customerData",customerData[0].personelId)


            const filteredData = customerData.filter(item => item.personelId === payload.id);

            console.log("filteredData",filteredData)

    
            // Tabloyu temizle
            table.clear().draw();
    
            // Müşteri verilerini tabloya ekle
            filteredData.forEach(customer => {
                table.row.add([
                    `${customer.name} ${customer.surname}`, // Müşteri adı
                    `${customer.personelName || 'Bilgi mevcut değil'} ${customer.personelSurname || ''}`, // Personel bilgisi
                    customer.phone || 'Telefon mevcut değil', // Telefon numarası
                    customer.email || 'Email mevcut değil', // Email
                    customer.isActive ? 'Aktif' : 'Pasif', // Durum
                    `<button class="btn btn-success btn-sm edit-btn" title="Düzenle" data-id="${customer._id}"><i class="fas fa-edit"></i></button>
                     <button class="btn btn-danger btn-sm delete-btn" title="Sil" data-id="${customer._id}"><i class="fas fa-trash"></i></button>`
                ]).draw();
            });
        } catch (error) {
            console.error("Müşteri verileri alınırken bir hata oluştu:", error);
        }
    }
    

    function handleDeleteCustomer(id) {
        Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu kişiyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, sil!',
            cancelButtonText: 'İptal',
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.post(
                        "http://localhost:3001/api/v1/emlakze/admin/deletecustomer",
                        { deletedId: id },
                        { headers: { "Content-Type": "application/json" } }
                    );

                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Kişi başarıyla silindi!',
                            showConfirmButton: true,
                            timer: 1500
                        }).then(() => {
                            getCustomer(); // Güncel müşteri listesini almak için tabloyu güncelle
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Bir hata oluştu!',
                        text: 'Lütfen tekrar deneyin.',
                        showConfirmButton: true
                    });
                    console.error("Hata:", error.response ? error.response.data : error.message);
                }
            }
        });
    }

    function editCustomer(id) {
        window.location.href = `edit-customer.html?id=${id}`;
    }

    // Sayfa yüklendiğinde personel ve müşteri verilerini çekin

    getCustomer();

    // DataTables olayları
    $('#customerTable').on('click', '.delete-btn', function() {
        const id = $(this).data('id');
        handleDeleteCustomer(id);
    });

    $('#customerTable').on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        editCustomer(id);
    });
});
