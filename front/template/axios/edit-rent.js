
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
    if (payload && payload.name && payload.surname) {
        document.getElementById("user-name").textContent = `${payload.name} ${payload.surname}`;
          }

    console.log("payloadpayload",payload)
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');

    console.log('Kira ID:', id);

    if (!id) {
        console.error('Kira ID bulunamadı.');
        return;
    }
    async function getPortfolio(personelId, selectedPortfolioId = null) {
        try {
            const url = 'http://localhost:3001/api/v1/emlakze/admin/getportfolio';
            const response = await axios.post(url, { personelId });
    
            const portfolioselectElement = $('#portfolioId');
            portfolioselectElement.empty(); // Önceki seçenekleri temizle
    
            if (response.data && Array.isArray(response.data.data)) {
                // Seçili olanı başa eklemek için seçenekleri ayarla
                if (selectedPortfolioId) {
                    const selectedPortfolio = response.data.data.find(
                        (portfolio) => portfolio._id === selectedPortfolioId
                    );
                    if (selectedPortfolio) {
                        portfolioselectElement.append(
                            `<option value="${selectedPortfolio._id}" selected>${selectedPortfolio.portfolioName || "Bilinmiyor"}</option>`
                        );
                    }
                }
    
                // Diğer seçenekleri ekle
                response.data.data.forEach((portfolio) => {
                    if (portfolio._id !== selectedPortfolioId) {
                        portfolioselectElement.append(
                            `<option value="${portfolio._id}">${portfolio.portfolioName || "Bilinmiyor"}</option>`
                        );
                    }
                });
            }
    
            // Select2 ile yeniden başlat
            portfolioselectElement.select2();
              // Change olayında propertyId temizle ve yeni listeyi getir
        $('#portfolioId').on('change', function () {
            const selectedPortfolioId = $(this).val();

            // propertyId listesini temizle
            const propertySelect = document.getElementById("propertyId");
            propertySelect.innerHTML = '<option value="">Seç</option>';

            console.log("Selected Portfolio ID:", selectedPortfolioId);
            if (selectedPortfolioId) {
                populateProperty(personelId, selectedPortfolioId);
            }
        });
    
        } catch (error) {
            console.error('Portfolio verileri alınırken hata oluştu:', error.message);
        }
    }
    
    async function populateProperty(personelId, portfolioId, selectedPropertyId = null) {
        try {
            const url = "http://localhost:3001/api/v1/emlakze/admin/getproperty2";
            const response = await axios.post(url, { personelId, portfolioId });
    
            const selectElement = $('#propertyId');
            selectElement.empty(); // Önceki seçenekleri temizle
    
            if (response.data && Array.isArray(response.data)) {
                // Seçili olan mülkü başa ekle
                if (selectedPropertyId) {
                    const selectedProperty = response.data.find(
                        (property) => property._id === selectedPropertyId
                    );
                    if (selectedProperty && selectedProperty.details.length > 0) {
                        selectElement.append(
                            `<option value="${selectedProperty._id}" selected>${selectedProperty.details[0].propertyName || "Bilinmiyor"}</option>`
                        );
                    }
                }
    
                // Diğer mülkleri ekle
                response.data
                    .filter((property) => property._id !== selectedPropertyId && property.isActive)
                    .forEach((property) => {
                        if (property.details.length > 0) {
                            selectElement.append(
                                `<option value="${property._id}">${property.details[0].propertyName || "Bilinmiyor"}</option>`
                            );
                        }
                    });
            }
    
            // Select2 ile yeniden başlat
            selectElement.select2();
    
        } catch (error) {
            console.error("Property verileri alınırken hata oluştu:", error.message);
        }
    }
    

    // Kira verilerini almak için API çağrısı
    async function getRent() {
        try {
            const response = await axios.post('http://localhost:3001/api/v1/emlakze/admin/getrentbyid', {
                rentId: id
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status !== 200) throw new Error('Network response was not ok');
            return response.data;
        } catch (error) {
            console.error('Kira verileri alınırken bir hata oluştu:', error);
            return null;
        }
    }



    async function getTenant(tenantId) {
        try {
            const url = "http://localhost:3001/api/v1/emlakze/admin/gettenant";
            const response = await axios.post(url, {});
    
            // Eğer response içinde data yoksa hata fırlatıyoruz
            if (!response.data || !response.data.data || response.data.data.length === 0) {
                throw new Error("Tenant verisi boş geldi");
            }
    
            const rentTenant = document.getElementById("tenantId");
    
            // Mevcut seçenekleri temizliyoruz
            rentTenant.innerHTML = "";
    
            response.data.data.forEach(tenant => {
                const option = document.createElement("option");
                option.value = tenant._id;
                option.textContent = tenant.name ? tenant.name : "Belirtilmemiş";
    
                // Eğer seçilen tenantId ile eşleşiyorsa seçili yapıyoruz
                if (tenantId === tenant._id) {
                    option.selected = true;
                }
    
                rentTenant.appendChild(option);
            });
    
        } catch (error) {
            console.error("Tenant verileri alınırken bir hata oluştu:", error);
        }
    }
    





    // Formu doldurmak için verileri yerleştirin
    async  function populateForm(data) {
        const personelId = payload.id;

        await getPortfolio(personelId, data.rent.portfolioId);

        // Seçili portföy ve mülkleri doldur
        document.getElementById('portfolioId').value = data.rent.portfolioId || '';
        if (data.rent.portfolioId) {
            await populateProperty(personelId, data.rent.portfolioId);
        }
        document.getElementById('propertyId').value = data.rent.propertyId || '';
        await getTenant(data.rent.tenantId);
        const rent = data.rent;
      
 


        document.getElementById('contractType').value = rent.contractType || '';
        document.getElementById('currentCode').value = rent.currentCode || '';
        document.getElementById('contractStartDate').value = rent.contractStartDate || '';
        document.getElementById('contractEndDate').value = rent.contractEndDate || '';
        document.getElementById('startingRentAmount').value = rent.startingRentAmount || '';
        document.getElementById('rentalfee').value = rent.rentalfee || '';
        document.getElementById('paymentDay').value = rent.paymentDay || '';
        document.getElementById('rentType').value = rent.rentType || '';
        document.getElementById('rentIncreaseType').value = rent.rentIncreaseType || '';
        document.getElementById('depositAmount').value = rent.depositAmount || '';
        document.getElementById('maintenanceFee').value = rent.maintenanceFee || '';
        document.getElementById('maintenanceStartDate').value = rent.maintenanceStartDate || '';
        document.getElementById('maintenanceFeeAmount').value = rent.maintenanceFeeAmount || '';
       



// if (unpaidPayment) {
//   document.getElementById('paymentDate').value = unpaidPayment.paymentDate;
// } else {
//   document.getElementById('paymentDate').value = '';  // Eğer böyle bir ödeme yoksa alanı boş bırak
// }


// console.log(unpaidPayment.paymentDate)

        // document.getElementById('rentAmount').value = rent.rentalfee || '';
   
      

    }

    // Form verilerini göndermek için API çağrısı
    async function submitFormData() {
       
            // 1. Dosyayı yükle
            const fileFormData = new FormData();
            fileFormData.append("rentId", id);
            const paymentDate = document.getElementById("paymentDate").value; 
            fileFormData.append("paymentDate", paymentDate);

            const rentAmount = document.getElementById("rentAmount").value; 
            fileFormData.append("rentAmount",rentAmount)
    
            const fileInput = document.getElementById('receipt').files[0];
            if (fileInput) {
                fileFormData.append("file", fileInput);
            }
    
            console.log('Dosya yükleniyor:', fileFormData);
    
            await axios.post('http://localhost:3001/api/v1/emlakze/admin/setfiles', fileFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
    
            // 2. Rent verilerini güncelle
            const rentData = {
                updatedId: id,
                portfolioId: document.getElementById('portfolioId').value,
                propertyId: document.getElementById('propertyId').value,
                tenantId: document.getElementById('tenantId').value,
                contractType: document.getElementById('contractType').value,
                currentCode: document.getElementById('currentCode').value,
                contractStartDate: document.getElementById('contractStartDate').value,
                contractEndDate: document.getElementById('contractEndDate').value,
                startingRentAmount: document.getElementById('startingRentAmount').value,
                rentalfee: document.getElementById('rentalfee').value,
                paymentDay: document.getElementById('paymentDay').value,
                rentType: document.getElementById('rentType').value,
                rentIncreaseType: document.getElementById('rentIncreaseType').value,
                depositAmount: document.getElementById('depositAmount').value,
                maintenanceFee: document.getElementById('maintenanceFee').value,
                maintenanceStartDate: document.getElementById('maintenanceStartDate').value,
                maintenanceFeeAmount: document.getElementById('maintenanceFeeAmount').value,
                // payments: [{
                //     paymentDate: document.getElementById('paymentDate').value,
                //     rentAmount: document.getElementById('rentAmount').value,
                //     isPaid: "false",
                //     paidDate: "null",
                //     receipt: "null", // Başlangıçta null
                // }],
                isActive: true,
            };
    
            console.log('Kira verileri güncelleniyor:', rentData);
    
            const response = await axios.post(`http://localhost:3001/api/v1/emlakze/admin/updaterent`, rentData, {
                headers: { 'Content-Type': 'application/json' }
            });
    
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Kira başarıyla güncellendi ve dosya yüklendi!',
                    showConfirmButton: true,
                    timer: 1500,
                }).then(() => {
                    window.location.href = 'list-rent.html';
                });
            }
    }

    document.querySelector('.btn-submit').addEventListener('click', async function() {
        console.log('Submit butonuna tıklandı.');
        await submitFormData();
    });

    // Sayfa yüklendiğinde formu doldur
    getRent().then(populateForm);
});
