$(document).ready(function() {
    // DataTables'ı başlat
    const table = $('#personelTable').DataTable({
        language: {
            "decimal": "",
            "emptyTable": "Tabloda veri yok",
            "info": "Gösterilen _START_ ile _END_ arasındaki _TOTAL_ kayıt",
            "infoEmpty": "Gösterilecek kayıt yok",
            "infoFiltered": "(toplam _MAX_ kayıttan filtrelendi)",
            "lengthMenu": "_MENU_ ",
            "loadingRecords": "Yükleniyor...",
            "processing": "İşleniyor...",
            "search": "Ara:",
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

    async function getPersonel() {
        const loadingElement = $('#loading');
        
        // Yükleniyor mesajını göster
        loadingElement.show();
        try {
            const response = await axios.post(
                "https://emlak.dveb.com.tr/api/v1/emlakze/admin/getpersonel",
                {},
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.status !== 200) throw new Error("Network response was not ok");

            const personelData = response.data.data;

            // Tabloyu temizle
            table.clear().draw();

            // Personel verilerini tabloya ekle
            personelData.forEach(person => {
                table.row.add([
                    person.name,
                    person.surname,
                    person.email || 'Email mevcut değil',
                    person.phoneNumber,
                    person.isActive ? 'Aktif' : 'Pasif',
                    `<button class="btn btn-success btn-sm edit-btn" title="Düzenle" data-id="${person._id}"><i class="fas fa-edit"></i></button>
                     <button class="btn btn-danger btn-sm delete-btn" title="Sil" data-id="${person._id}"><i class="fas fa-trash"></i></button>`
                ]).draw();
            });
        } catch (error) {
            console.error("Personel verileri alınırken bir hata oluştu:", error);
        } finally {
            // Yükleniyor mesajını gizle
            loadingElement.hide();
        }
    }

    // İlk verileri yükle
    getPersonel();
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
                        "https://emlak.dveb.com.tr/api/v1/emlakze/admin/deletepersonel",
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

    // Silme ve düzenleme butonlarına tıklama olayları
    $('#personelTable').on('click', '.delete-btn', function() {
        const id = $(this).data('id');
        handleDeletePerson(id);
    });

    $('#personelTable').on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        editPerson(id);
    });


    function editPerson(id) {
        window.location.href = `edit-personel.html?id=${id}`;
    }

});
