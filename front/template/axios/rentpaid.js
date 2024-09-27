$(document).ready(function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const rentId = urlParams.get('id');
    const fileURL = "http://localhost:3001";

    // DataTables'ı başlat
    const table = $('#rentpaidTable').DataTable({
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
        dom: '<"top"f>rt<"bottom"lp><"clear">',
        buttons: [
            {
                text: 'Ödeme Ekle',
                className: 'btn btn-primary',
                action: function (e, dt, node, config) {
                    console.log('DataTables butonuna tıklandı. Modal açılacak.');
                    $('#addPaymentModal').modal('show');
                    populatePaymentForm(); // Modal açıldığında formu doldur
                }
            }
        ]
        ,
        initComplete: function () {
            $(this.api().table().container()).find('.dataTables_filter').css({
                'text-align': 'right'
            });

            $(this.api().table().container()).find('.top').append('<button type="button" class="btn btn-primary addPaymentModal" data-bs-toggle="modal" data-bs-target="#addPaymentModal" style="margin-left: 10px;">Ödeme Ekle</button>');
        }
    });

    $('addPaymentModal').click(function () {
        console.log('1');
        setTimeout(() => {
        populatePaymentForm(); // Modal açıldığında formu doldur
            
        }, 200);

    });

    async function getRent() {
        try {
            const response = await axios.post(
                "http://localhost:3001/api/v1/emlakze/admin/getpaidrents",
                { rentId: rentId },
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status !== 200) {
                throw new Error("Network response was not ok");
            }
            const rentData = response.data.paidPayments;

            table.clear().draw();

            rentData.forEach(payment => {
                table.row.add([
                    payment.paymentDate,
                    payment.rentAmount,
                    payment.isPaid ? 'Ödendi' : 'Ödenmedi',
                    payment.receipt ? `<a href="${fileURL}/public/${payment.receipt}" target="_blank" class="btn btn-info btn-sm">
                        <i class="fas fa-eye"></i> 
                    </a>` : 'Belge Yok'
                ]).draw();
            });

        } catch (error) {
            console.error("Müşteri verileri alınırken bir hata oluştu:", error);
        }
    }


    async function populatePaymentForm() {
        try {
            const response = await axios.post(
                "http://localhost:3001/api/v1/emlakze/admin/getrentbyid",
                { rentId: rentId },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("vmdfkmvfkdvfd",rentId)
    
            if (response.status !== 200) {
                throw new Error("Network response was not ok");
            }
    
            const rent = response.data.rent;
            console.log(rent); // Gelen verileri kontrol edin
            const unpaidPayment = rent.payments.find(payment => !payment.isPaid);
    
            if (unpaidPayment) {
                // Ödenmemiş ödeme tarihini ve kira bedelini modalda göster
                document.getElementById('paymentDate').value = unpaidPayment.paymentDate;
                document.getElementById('rentAmount').value = unpaidPayment.rentAmount; 
            } else {
                // Eğer ödenmemiş ödeme yoksa boş bırak
                document.getElementById('paymentDate').value = ''; 
                document.getElementById('rentAmount').value = ''; 
            }
    
        } catch (error) {
            console.error("Ödeme tarihini güncellerken bir hata oluştu:", error);
        }
    }
    

    $('#addPaymentForm').on('submit', async function(e) {
        e.preventDefault(); 

        const fileFormData = new FormData();
        fileFormData.append("rentId", rentId); 

        const paymentDate = document.getElementById("paymentDate").value; 
        fileFormData.append("paymentDate", paymentDate);

        const rentAmount = document.getElementById("rentAmount").value;
        fileFormData.append("rentAmount", rentAmount);

        const fileInput = document.getElementById('receipt').files[0];
        if (fileInput) {
            fileFormData.append("file", fileInput);
        }

        try {
            const response = await axios.post('http://localhost:3001/api/v1/emlakze/admin/setfiles', fileFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status !== 200) {
                throw new Error("Network response was not ok");
            }

            console.log(response.data.message);

            // Modalı kapat
            $('#addPaymentModal').modal('hide');
            
            // Tabloyu yenile
            getRent();

        } catch (error) {
            console.error("Dosya yükleme ve ödeme güncelleme işlemi sırasında bir hata oluştu:", error);
        }
    });

    function editRent(id) {
        window.location.href = `edit-rent.html?id=${id}`;
    }

    // Sayfa yüklendiğinde ödenmiş kiraları çekin
    getRent();
});
