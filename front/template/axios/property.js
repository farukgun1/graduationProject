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
    const table = $('#propertyTable').DataTable({
        language: {
            "decimal": "",
            "emptyTable": "Tabloda veri yok",
            "info": "Gösterilen _START_ ile _END_ arasındaki _TOTAL_ kayıt",
            "infoEmpty": "Gösterilecek kayıt yok",
            "infoFiltered": "(toplam _MAX_ kayıttan filtrelendi)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "_MENU_ kayıt göster",
            "loadingRecords": "Yükleniyor...",
            "processing": "İşleniyor...",
            "search": "Ara:",
            "searchPlaceholder": "Arama yapın...",
            "zeroRecords": "Eşleşen kayıt bulunamadı",
            "paginate": {
                "first": "İlk",
                "last": "Son",
                "next": "Sonraki",
                "previous": "Önceki"
            },
            "aria": {
                "sortAscending": ": artan sütun sıralamasını etkinleştir",
                "sortDescending": ": azalan sütun sıralamasını etkinleştir"
            }
        },
    
    });
    

    async function getProperty() {
        try {
            const response = await axios.post(
                "http://localhost:3001/api/v1/emlakze/admin/getproperty",
                {},
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.status !== 200)
                throw new Error("Network response was not ok");

            const propertyData = response.data;
console.log(propertyData)


const filteredData = propertyData.filter(item => item.personelId === payload.id);

console.log("filteredData",filteredData)

            // Tabloyu temizle
            table.clear().draw();

            // Personel verilerini tabloya ekle
            filteredData.forEach(property => {
                const rentStatus = property.rents && property.rents.length > 0
                ? `<span class="text-success">Kira Var</span>`
                : `<span class="text-danger">Kira Yok</span>`;
            
            
                table.row.add([
                    property.details[0].propertyName,
                    property.propertyOwnerName,
                    property.details[0].bbNo,
                    property.details[0].type,
                    property.details[0].attribute,
                    property.details[0].usageType,
                    property.details[0].netM2,
                    property.details[0].grossM2,
                    property.details[0].listingPrice,
                    property.isActive ? 'Aktif' : 'Pasif',
                    rentStatus,
                    `<div class="btn-group">
                    <button class="btn btn-success btn-sm edit-btn" title="Düzenle" data-id="${property._id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm delete-btn" title="Sil" data-id="${property._id}"><i class="fas fa-trash"></i></button>
                </div>`
                ]).draw();
            });
        } catch (error) {
            console.error("Personel verileri alınırken bir hata oluştu:", error);
        }
    }

    function handleDeletePerson(id) {
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
                        "http://localhost:3001/api/v1/emlakze/admin/deletepersonel",
                        { deletedId: id },
                        { headers: { "Content-Type": "application/json" } }
                    );

                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Kişi başarıyla silindi!',
                            showConfirmButton: true,
                            timer: 1500
                        }).then((result) => {
                            if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                                getPersonel(); // Güncel personel listesini almak için tabloyu güncelle
                            }
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

    function editProperty(id) {
        window.location.href = `edit-property.html?id=${id}`;
    }
    

    // Sayfa yüklendiğinde personel verilerini çekin
    getProperty();

    // DataTables olayları
    $('#propertyTable').on('click', '.delete-btn', function() {
        const id = $(this).data('id');
        handleDeletePerson(id);
    });

    $('#propertyTable').on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        editProperty(id);
    });

    $('#propertyTable').on('click', '.add-rent-btn', function() {
        const propertyId = $(this).data('id');
        window.location.href = `add-rent.html?id=${propertyId}`;
    });

    
    $('#propertyTable').on('click', '.details-rent-btn', function() {
        const propertyId = $(this).data('id');
        window.location.href = `edit-rent.html?id=${propertyId}`;
    });
    
});
