
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
    const table = $('#portfolioTable').DataTable({
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

    const personelId = payload.id;
    async function getPortfolio(personelId) {
        try {
            const response = await axios.post(
                "http://localhost:3001/api/v1/emlakze/admin/getlistportfolio",
                { personelId },
                { headers: { "Content-Type": "application/json" } }
            );
    
            if (response.status !== 200) {
                throw new Error("Network response was not ok");
            }
    
            const portfolioData = response.data.data; // API'den dönen veriyi al
            console.log("Portfolio Data:", portfolioData); // Yanıtı kontrol edin
    
            if (!portfolioData || portfolioData.length === 0) {
                console.log("Portföy verisi bulunamadı.");
            } else {
                // Tablonun içeriğini temizle
                const tableBody = document.querySelector("#portfolioTable tbody");
                tableBody.innerHTML = "";
    
                portfolioData.forEach(portfolio => {
                    // Yeni bir tablo satırı oluştur
                    const row = document.createElement("tr");
    
                    // Portföy bilgilerini içeren hücreleri ekle
                    row.innerHTML = `
                        <td>${portfolio.portfolioName || "Belirtilmemiş"}</td>
                        <td>${portfolio.propertyOwnerName || "Belirtilmemiş"}</td>
                        <td>${portfolio.isActive ? "Aktif" : "Pasif"}</td>
                        <td>
                            <button class="btn btn-danger btn-sm delete-btn" title="Sil" data-id="${portfolio._id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;
    
                    // Satırı tabloya ekle
                    tableBody.appendChild(row);
                });
    
                // Silme butonları için olay dinleyicisi ekle
                document.querySelectorAll(".delete-btn").forEach(button => {
                    button.addEventListener("click", async function () {
                        const portfolioId = this.getAttribute("data-id");
                        if (confirm("Bu portföyü silmek istediğinize emin misiniz?")) {
                            await deletePortfolio(portfolioId);
                            // Tablonun yeniden yüklenmesi
                            getPortfolio(personelId);
                        }
                    });
                });
            }
        } catch (error) {
            console.error("Portföy verileri alınırken bir hata oluştu:", error);
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
                        "http://localhost:3001/api/v1/emlakze/admin/deleteportfolio",
                        { deleteId: id },
                        { headers: { "Content-Type": "application/json" } }
                    );

                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Portfolyo  başarıyla silindi!',
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
    

    

    getPortfolio(personelId);


    $('#portfolioTable').on('click', '.delete-btn', function() {
        const id = $(this).data('id');
        handleDeletePerson(id);
    });

    $('#portfolioTable').on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        editPerson(id);
    });
    
});
