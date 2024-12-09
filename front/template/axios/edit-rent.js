const { getPortfolio } = require("../../../controllers/Admin/admin");

$(document).ready(function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');

    console.log('Kira ID:', id);

    if (!id) {
        console.error('Kira ID bulunamadı.');
        return;
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


    async function getProperty(propertyId) {
        try {
            const url = "http://localhost:3001/api/v1/emlakze/admin/getproperty";
            const response = await axios.post(url, {});
    
            // Eğer response içinde data yoksa hata fırlatıyoruz
            if (!response.data || response.data.length === 0) {
                throw new Error("Property verisi boş geldi");
            }
    
            const rentProperty = document.getElementById("propertyId");
    
            // Mevcut seçenekleri temizliyoruz
            rentProperty.innerHTML = "";
    
            response.data.forEach(property => {
                const option = document.createElement("option");
                option.value = property._id;
    
                // Property name var mı yok mu kontrol edip ekliyoruz
                if (property.details.length > 0 && property.details[0].propertyName) {
                    option.textContent = property.details[0].propertyName;
                } else {
                    option.textContent = "Belirtilmemiş";
                }
    
                // Eğer seçilen propertyId ile eşleşiyorsa seçili yapıyoruz
                if (propertyId === property._id) {
                    option.selected = true;
                }
    
                rentProperty.appendChild(option);
            });
    
        } catch (error) {
            console.error("Property verileri alınırken bir hata oluştu:", error);
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
        if (!data || !data.rent) return;
        await getProperty(data.rent.propertyId);
        const personelId=payload.id
await getPortfolio(personelId)
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
