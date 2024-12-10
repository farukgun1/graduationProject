
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
    if (payload && payload.name && payload.surname) {
        document.getElementById("user-name").textContent = `${payload.name} ${payload.surname}`;
    }
    // DataTables'ı başlat
    // DataTables'ı başlat
    const table = $('#tenantTable').DataTable({
        language: {
            "decimal": "",
            "emptyTable": "Tabloda veri yok",
            "info": "Gösterilen _START_ ile _END_ arasındaki _TOTAL_ kayıt",
            "infoEmpty": "Gösterilecek kayıt yok",
            "infoFiltered": "(toplam _MAX_ kayıttan filtrelendi)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "_MENU_  Kayıtları Göster",
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

    async function getTenant() {
        try {
            const response = await axios.post(
                "http://localhost:3001/api/v1/emlakze/admin/gettenant",
                {},
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.status !== 200)
                throw new Error("Network response was not ok");

            const tenantData = response.data.data;
            const filteredData = tenantData.filter(item => item.personelId === payload.id);

            console.log(filteredData)

            table.clear().draw();

            filteredData.forEach(tenant => {
                table.row.add([
                    tenant.name,
                    tenant.surname,
                    tenant.email || 'Email mevcut değil',
                    tenant.phone,
                    tenant.isActive ? 'Aktif' : 'Pasif',
                    `<button class="btn btn-success btn-sm edit-btn" title="Düzenle" data-id="${tenant._id}"><i class="fas fa-edit"></i></button>
                     <button class="btn btn-danger btn-sm delete-btn" title="Sil" data-id="${tenant._id}"><i class="fas fa-trash"></i></button>`
                ]).draw();
            });
        } catch (error) {
            console.error("Personel verileri alınırken bir hata oluştu:", error);
        }
    }

    function handleDeleteTenant(id) {
        Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu kiracıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, sil!',
            cancelButtonText: 'İptal',
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.post(
                        "http://localhost:3001/api/v1/emlakze/admin/deletetenant",
                        { deletedId: id },
                        { headers: { "Content-Type": "application/json" } }
                    );

                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Kiracı başarıyla silindi!',
                            showConfirmButton: true,
                            timer: 1500
                        }).then((result) => {
                            if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                                getTenant(); 
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

    function editPerson(id) {
        window.location.href = `edit-tenant.html?id=${id}`;
    }
    

    getTenant();


    $('#tenantTable').on('click', '.delete-btn', function() {
        const id = $(this).data('id');
        handleDeleteTenant(id);
    });

    $('#tenantTable').on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        editPerson(id);
    });
    
});
