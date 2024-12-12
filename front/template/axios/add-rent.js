

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




async function populatePortfolio(personelId) {
    try {
        const url = 'https://emlak.dveb.com.tr/api/v1/emlakze/admin/getportfolio';
        const response = await axios.post(url, { personelId });

        const selectElement = document.getElementById('portfolioId');
        selectElement.innerHTML = '<option value="">Seçiniz</option>';

        if (response.data && Array.isArray(response.data.data)) {
            response.data.data.forEach((portfolio) => {
                const option = document.createElement('option');
                option.value = portfolio._id;
                option.textContent = portfolio.portfolioName || "Bilinmiyor";
                selectElement.appendChild(option);
            });
        }

        $('#portfolioId').select2();

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

async function populateProperty(personelId, portfolioId) {
    try {
        const url = "https://emlak.dveb.com.tr/api/v1/emlakze/admin/getproperty2";
        const response = await axios.post(url, { personelId, portfolioId });

        const selectElement = document.getElementById("propertyId");
        selectElement.innerHTML = '<option value="">Seç</option>';

        if (response.data && Array.isArray(response.data)) {
            response.data
                .filter(property => property.isActive) // Yalnızca isActive true olanları filtrele
                .forEach((property) => {
                    if (property.details && property.details.length > 0) {
                        const detail = property.details[0];
                        const option = document.createElement("option");
                        option.value = property._id;
                        option.textContent = detail.propertyName || "Bilinmiyor";
                        selectElement.appendChild(option);
                    }
                });
        }

        $('#propertyId').select2();

    } catch (error) {
        console.error("Property verileri alınırken hata oluştu:", error.message);
    }
}



async function populateTenant(personelId) {
    try {
        const url = "https://emlak.dveb.com.tr/api/v1/emlakze/admin/gettenant";
        const response = await axios.post(url, {});
        const selectElement = document.getElementById("tenantId");

        response.data.data
        .filter(tenant => tenant.personelId === personelId) // Filter logic
        
        .forEach(tenant => {
            const option = document.createElement("option");
            option.value = tenant._id;
            option.textContent = `${tenant.name} ${tenant.surname}`;
            selectElement.appendChild(option);
        });

        // Select2'yi başlat
        $('#tenantId').select2();

    } catch (error) {
        console.error("Tenant verileri alınırken hata oluştu:", error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
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
    // Payload’ı kontrol et
    if (!payload || !payload.role || payload.role.trim() === "") {
        console.log('Role boş veya tanımlanmamış, personel menüsü gizlenmeli.');

        const personelMenu = document.getElementById("personel");
        if (personelMenu) {
            personelMenu.add("d-none");
                
            console.log("Personel menüsü gizlendi.");
        } else {
            console.log("Personel menüsü bulunamadı.");
        }
        console.log("fff", personelMenu)
    }

    console.log("payloadpayload",payload)
    // DataTables'ı başlat
    document.querySelectorAll('.btn-next').forEach(function (button) {
        button.addEventListener('click', function () {
            setTimeout(() => {
                var container = document.querySelector('.bs-stepper-header');
                if (container) {
                    var activeStep = container.querySelector('.step.active');
                    if (activeStep) {
                        var index = Array.prototype.indexOf.call(
                            container.querySelectorAll('.step'),
                            activeStep
                        );

                        var stepWidth = activeStep.offsetWidth;
                        var stepMargin = parseInt(window.getComputedStyle(activeStep).marginRight, 10);
                        var scrollPosition = (stepWidth + stepMargin + $('.line').width()) * index;

                        container.scrollTo({
                            left: scrollPosition,
                            behavior: 'smooth'
                            // behavior: 'smooth'
                        });
                    }
                }
            }, 100);
        });
    });
    const personelId=payload.id;

    populateTenant(personelId);
  populatePortfolio(personelId)
    document.querySelector('.btn-submit-all').addEventListener('click', async function () {
        const tabContentContainers = document.querySelectorAll('.bs-stepper-content .content');
        const allFormData = {};

        // Collect form data
        tabContentContainers.forEach((container) => {
            const form = container.querySelector('form');
            if (form) {
                const formId = form.id;
                const formData = new FormData(form);

                const formObject = {};
                formData.forEach((value, key) => {
                    formObject[key] = value;
                });

                allFormData[formId] = formObject;
            }
        });

        console.log(allFormData['kiracı-form']);
        const personelId=payload.id;

        // Form verilerini organize et
        const organizedData = {
            propertyId: allFormData['portfoy-form']?.propertyId || '',
            portfolioId: allFormData['portfoy-form']?.portfolioId || '',
            tenantId: allFormData['kiracı-form']?.tenantId || '',
            contractType: allFormData['kiracı-form']?.contractType || '',
            currentCode: allFormData['kiracı-form']?.currentCode || '',
            contractStartDate: allFormData['sozlesme-form']?.contractStartDate || '',
            contractEndDate: allFormData['sozlesme-form']?.contractEndDate || '',
            startingRentAmount: allFormData['sozlesme-form']?.startingRentAmount || '',
            rentalfee: allFormData['kira-form']?.rentalfee || '',
            paymentDay: allFormData['kira-form']?.paymentDay || '',
            rentType: allFormData['kira-form']?.rentType || '',
            rentIncreaseType: allFormData['kira-form']?.rentIncreaseType || '',
            depositAmount: allFormData['kira-form']?.depositAmount || '',
            maintenanceFee: allFormData['aidat-form']?.maintenanceFee || '',
            maintenanceStartDate: allFormData['aidat-form']?.maintenanceStartDate || '',
            maintenanceFeeAmount: allFormData['aidat-form']?.maintenanceFeeAmount || '',
            personelId:personelId
       
        };

        console.log(organizedData);

        try {
            // Form verilerini API'ye gönderin
            const formResponse = await axios.post(
                'https://emlak.dveb.com.tr/api/v1/emlakze/admin/setrent',
                organizedData,
                { headers: { 'Content-Type': 'application/json' } } // JSON formatında veri gönderiyoruz
            );

            Swal.fire({
                icon: 'success',
                title: 'Veriler başarıyla kaydedildi!',
                showConfirmButton: true,
                timer: 1500
            }).then((result) => {
                if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                    tabContentContainers.forEach(container => {
                        const form = container.querySelector('form');
                        if (form) {
                            form.reset();
                        }
                    });
                    document.getElementById("formFileMultiple").value = ""; // Fotoğrafları sıfırlar
                }
            });

        } catch (error) {
            console.error('Hata:', error.response ? error.response.data : error.message);
            Swal.fire({
                icon: 'error',
                title: 'Hata oluştu!',
                text: 'Lütfen tekrar deneyin.',
                showConfirmButton: true
            });
        }
    });
});
