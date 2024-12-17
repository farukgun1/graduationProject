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

async function populateStates(citycode) {
    try {
        let url = "https://emlak.dveb.com.tr/api/v1/emlakze/admin/getLocation";
        let requestData = {};

        if (citycode) {
            requestData.citycode = citycode;
        }

        const response = await axios.post(url, requestData);
        return response.data;
    } catch (error) {
        console.error("İl verileri alınırken hata oluştu:", error);
    }
}
// P
// Populate customer dropdown
async function populateCustomer(personelId) {
    try {
      const url = 'https://emlak.dveb.com.tr/api/v1/emlakze/admin/getcustomer';
      const response = await axios.post(url, {});
      const selectElement = document.getElementById('propertyOwnerName');
  
      // Clear previous options
      selectElement.innerHTML = '';
  
      // Filter customers by personelId
      response.data.data
        .filter(customer => customer.personelId === personelId) // Filter logic
        .forEach((customer) => {
          const option = document.createElement('option');
          option.value = customer._id;
          option.textContent = `${customer.name} ${customer.surname}`;
          selectElement.appendChild(option);
        });
    } catch (error) {
      console.error('Customer data retrieval error:', error);
    }
  }
  
// İlçeleri doldur
async function populateDistricts(stateCode) {
    try {
        const data = await populateStates(stateCode);
        const stateData = data[stateCode]; 
        console.log(data)
        console.log(stateCode)
        const districtSelectElement = document.getElementById("district");

        districtSelectElement.innerHTML = '<option value="">Seç</option>';
        Object.keys(data).forEach(district => {
            const option = document.createElement("option");
            option.value = district;
            option.textContent = district;
            districtSelectElement.appendChild(option);
        });
    } catch (error) {
        console.error("İlçeler verileri alınırken hata oluştu:", error);
    }
}

async function populateNeighborhoods(district) {
    const data = await populateStates(document.getElementById("province").value);
    const neighborhoodSelectElement = document.getElementById("neighborhood");
    
    neighborhoodSelectElement.innerHTML = '<option value="">Seç</option>';
    if (data[district]) {
        data[district].forEach(neighborhood => {
            const option = document.createElement("option");
            option.value = neighborhood;
            option.textContent = neighborhood;
            neighborhoodSelectElement.appendChild(option);
        });
    }
}
async function populateDistrictsTwo(stateCode) {
    try {
      const data = await populateStates(stateCode)
      const stateData = data[stateCode]
      console.log(data)
      console.log(stateCode)
      const districtSelectElement = document.getElementById('titledeeddistrict')
  
      districtSelectElement.innerHTML = '<option value="">Seç</option>'
      Object.keys(data).forEach((district) => {
        const option = document.createElement('option')
        option.value = district
        option.textContent = district
        districtSelectElement.appendChild(option)
      })
    } catch (error) {
      console.error('İlçeler verileri alınırken hata oluştu:', error)
    }
  }

async function populateNeighborhoodsTwo(district) {
    const data = await populateStates(
      document.getElementById('titledeedprovince').value,
    )
    const neighborhoodSelectElement = document.getElementById(
      'titledeedneighborhood',
    )
  
    neighborhoodSelectElement.innerHTML = '<option value="">Seç</option>'
    if (data[district]) {
      data[district].forEach((neighborhood) => {
        const option = document.createElement('option')
        option.value = neighborhood
        option.textContent = neighborhood
        neighborhoodSelectElement.appendChild(option)
      })
    }
  }


document.addEventListener('DOMContentLoaded', async function () {
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
 
    // "Next" butonuna tıklama olayı
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
                        var scrollPosition = (stepWidth + stepMargin + document.querySelector('.line').offsetWidth) * index;

                        container.scrollTo({
                            left: scrollPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            }, 100);
        });
    });

    // URL'den ID'yi alma
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    const personelId=payload.id
await populateCustomer(personelId)
    if (!id) {
        console.error('Mülk ID bulunamadı.');
        return;
    }

      

    const dataa = await populateStates();

    const selectElement = document.getElementById("province");
    console.log(selectElement)
    const districtSelectElement = document.getElementById("district");
    const neighborhoodSelectElement = document.getElementById("neighborhood");

    dataa.forEach(province => {
        const option = document.createElement("option");
        option.value = province.code;
        option.textContent = province.name;
        
        selectElement.appendChild(option);
    });

    selectElement.addEventListener("change", async function (event) {
        districtSelectElement.innerHTML = "";
        neighborhoodSelectElement.innerHTML = "";
        const selectedValue = event.target.value;
        await populateDistricts(selectedValue);
    });

    districtSelectElement.addEventListener("change", async function () {
        await populateNeighborhoods(this.value);
    });
    


    async function getPortfolio() {
        try {
            const response = await axios.post('http://localhost:3001/api/v1/emlakze/admin/getportfolioo', {}, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log("response",response.data)
            if (response.status !== 200) throw new Error('Network response was not ok');
            return response.data;
        } catch (error) {
            console.error('Veriler alınırken bir hata oluştu:', error);
            return [];
        }
    }
   
    async function populateForm(id) {
        try {
            // Mülk verilerini getir
            const property = await getPortfolio();
    
            if (!property || !Array.isArray(property)) {
                console.error('API yanıtı geçersiz veya boş:', property);
                return;
            }
    
            const propertyData = property.find(p => p._id === id);
    
            if (!propertyData) {
                console.error('Belirtilen ID ile eşleşen mülk bulunamadı.');
                return;
            }
    
            const titleDeeds = propertyData.titleDeeds?.[0] || {}; 
            const otherDetails = propertyData.otherDetails?.[0] || {};
    
            // Eyalet ve ilçe verilerini getir
            const states = await populateStates();
            let districts = {};
    
            if (titleDeeds.titledeedprovince) {
                districts = await populateStates(titleDeeds.titledeedprovince);
            }
    
            // DOM elemanlarını tanımla
            const selectElement2 = document.getElementById("titledeedprovince");
            const districtSelectElement2 = document.getElementById("titledeeddistrict");
            const neighborhoodSelectElement2 = document.getElementById("titledeedneighborhood");
    
            // Seçim kutularını temizle
            selectElement2.innerHTML = '<option value="">Seç</option>';
            districtSelectElement2.innerHTML = '<option value="">Seç</option>';
            neighborhoodSelectElement2.innerHTML = '<option value="">Seç</option>';
    
            // Eyalet listesini doldur
            states.forEach(province => {
                const option = document.createElement("option");
                option.value = province.code;
                option.textContent = province.name;
    
                if (titleDeeds.titledeedprovince === province.name) {
                    option.selected = true;
                }
                selectElement2.appendChild(option);
            });
    
            // İlçe listesini doldur
            if (districts && typeof districts === "object") {
                Object.keys(districts).forEach(district => {
                    const option = document.createElement("option");
                    option.value = district;
                    option.textContent = district;
    
                    if (titleDeeds.titledeeddistrict === district) {
                        option.selected = true;
                    }
                    districtSelectElement2.appendChild(option);
                });
            }
    
            // Mahalle listesini doldur
            const neighborhoods = districts?.[titleDeeds.titledeeddistrict] || [];
            neighborhoods.forEach(neighborhood => {
                const option = document.createElement("option");
                option.value = neighborhood;
                option.textContent = neighborhood;
    
                if (titleDeeds.titledeedneighborhood === neighborhood) {
                    option.selected = true;
                }
                neighborhoodSelectElement2.appendChild(option);
            });
    
            // Form verilerini doldur
            setInputValue('#portfolioName', propertyData.portfolioName || '');
            setInputValue('#duesM2Price', propertyData.duesM2Price || '');
            setInputValue('#latitude', propertyData.latitude || '');
            setInputValue('#longitude', propertyData.longitude || '');
    
            if (titleDeeds) {
                setInputValue('#location', titleDeeds.location || '');
                setInputValue('#area', titleDeeds.area || '');
                setInputValue('#parcelShare', titleDeeds.parcelShare || '');
                setInputValue('#parcelShareholder', titleDeeds.parcelShareholder || '');
                setInputValue('#description', titleDeeds.description || '');
                setInputValue('#independentSectionDescription', titleDeeds.independentSectionDescription || '');
                setInputValue('#volumeNumber', titleDeeds.volumeNumber || '');
                setInputValue('#journalNumber', titleDeeds.journalNumber || '');
                setInputValue('#page', titleDeeds.page || '');
                setInputValue('#titleDeedDate', titleDeeds.titleDeedDate || '');
                setInputValue('#titleDeedType', titleDeeds.titleDeedType || '');
                setInputValue('#titleDeedTransferMethod', titleDeeds.titleDeedTransferMethod || '');
                setInputValue('#titleDeedTransferDate', titleDeeds.titleDeedTransferDate || '');
                setInputValue('#ownership', titleDeeds.ownership || '');
                setInputValue('#bbShareRatio', titleDeeds.bbShareRatio || '');
            }
    
            // Checkbox'ları işaretle
            function checkValues(name, values) {
                values.forEach(value => {
                    const checkbox = document.querySelector(`input[name="${name}"][value="${value}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
    
            checkValues('facade', otherDetails.facade || []);
            checkValues('general', otherDetails.general || []);
            checkValues('environment', otherDetails.environment || []);
            checkValues('disabledFriendly', otherDetails.disabledFriendly || []);
            checkValues('external', otherDetails.external || []);
            checkValues('internal', otherDetails.internal || []);
            checkValues('transportation', otherDetails.transportation || []);
            checkValues('view', otherDetails.view || []);
            checkValues('residentialType', otherDetails.residentialType || []);
            checkValues('infrastructure', otherDetails.infrastructure || []);
            checkValues('location', otherDetails.location || []);
    
        } catch (error) {
            console.error('Form doldurulurken hata oluştu:', error);
        }
    }
    
    
    function setInputValue(selector, value) {
        const input = document.querySelector(selector);
        if (input) input.value = value || '';
    }
    
    
    async function updateProperty() {
        const propertyData = {
            details: {
                propertyName: document.querySelector('#propertyName').value,
                portfolioId: document.querySelector('#portfolioId').value,
                province: document.querySelector('#province').value,
                district: document.querySelector('#district').value,
                neighborhood: document.querySelector('#neighborhood').value,
                grossM2: document.querySelector('#grossM2').value,
                netM2: document.querySelector('#netM2').value
            },
            titledeed: {
                titledeedprovince: document.querySelector('#titledeedprovince').value,
                titledeeddistrict: document.querySelector('#titledeeddistrict').value,
                titledeedneighborhood: document.querySelector('#titledeedneighborhood').value
            },
            otherDetails: {
                facade: Array.from(document.querySelectorAll('input[name="facade"]:checked')).map(cb => cb.value),
                general: Array.from(document.querySelectorAll('input[name="general"]:checked')).map(cb => cb.value),
                environment: Array.from(document.querySelectorAll('input[name="environment"]:checked')).map(cb => cb.value)
            }
        };

        try {
            const response = await axios.post('https://emlak.dveb.com.tr/api/v1/emlakze/admin/updateproperty', propertyData, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Mülk başarıyla güncellendi!',
                    timer: 1500
                }).then(() => {
                    window.location.href = 'list-property.html';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Güncelleme başarısız!',
                    text: response.statusText
                });
            }
        } catch (error) {
            console.error('Güncelleme sırasında bir hata oluştu:', error);
            Swal.fire({
                icon: 'error',
                title: 'Bir hata oluştu!',
                text: error.message
            });
        }
    }


    // Formu doldur ve güncelleme işlemi
    populateForm(id);
    
    // Güncelle butonuna tıklama olayı
    
});



