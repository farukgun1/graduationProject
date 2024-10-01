



async function populateStates(citycode) {
    try {
        let url = "http://localhost:3001/api/v1/emlakze/admin/getLocation";
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

    // Swiper Initialization
    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 1, // Her sayfada 1 fotoğraf göster
        spaceBetween: 10, // Slaytlar arasındaki boşluk
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2, // Ekran genişliği 768px'in üstünde 2 fotoğraf göster
            },
            1024: {
                slidesPerView: 3, // Ekran genişliği 1024px'in üstünde 3 fotoğraf göster
            },
        },
    });

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

    if (!id) {
        console.error('Mülk ID bulunamadı.');
        return;
    }
    const demirbasForm = document.getElementById('demirbas-form')

    if (demirbasForm) {
      // "Demirbaş Ekle" butonuna tıklandığında yeni satır ekle
      document
        .getElementById('data-repeater-create')
        .addEventListener('click', function () {
          const assetContainer = demirbasForm.querySelector(
            '[data-repeater-list="assets"]',
          )
          const newAssetRow = `
                  <div data-repeater-item>
                      <div class="row d-flex align-items-end">
                          <div class="col-md-4 col-12">
                              <div class="mb-1">
                                  <label class="form-label" for="assetName">Demirbaş Adı</label>
                                  <input type="text" name="assetName" class="form-control" placeholder="Demirbaş adı" />
                              </div>
                          </div>
                          <div class="col-md-2 col-12">
                              <div class="mb-1">
                                  <label class="form-label" for="quantity">Miktar</label>
                                  <input type="number" name="quantity" class="form-control" placeholder="1" />
                              </div>
                          </div>
                          <div class="col-md-2 col-12">
                              <div class="mb-1">
                                  <label class="form-label" for="price">Fiyat</label>
                                  <input type="text" name="price" class="form-control" placeholder="Fiyat" />
                              </div>
                          </div>
                          <div class="col-md-2 col-12 mb-50">
                              <div class="mb-1">
                                  <button class="btn btn-outline-danger text-nowrap px-1" data-repeater-delete type="button">
                                      <i data-feather="x" class="me-25"></i>
                                   
                                  </button>
                              </div>
                          </div>
                      </div>
                      <hr />
                  </div>
              `
          assetContainer.insertAdjacentHTML('beforeend', newAssetRow)
        })
  
      // Kaldırma işlemi için olay dinleyici
      demirbasForm.addEventListener('click', function (e) {
        if (e.target.matches('[data-repeater-delete]')) {
          const itemToRemove = e.target.closest('[data-repeater-item]')
          if (itemToRemove) {
            itemToRemove.remove() // Satırı kaldır
          }
        }
      })
      
    } else {
      console.error('Demirbaş formu bulunamadı!')
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


    async function getProperty() {
        try {
            const response = await axios.post('http://localhost:3001/api/v1/emlakze/admin/getproperty', {}, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status !== 200) throw new Error('Network response was not ok');
            return response.data;
        } catch (error) {
            console.error('Veriler alınırken bir hata oluştu:', error);
            return [];
        }
    }
    async function deletePhoto(photoId, photoName) {
        try {
            const response = await axios.post('http://localhost:3001/api/v1/emlakze/admin/deletePhoto', 
            {
                propertyId: photoId,
                photoName: photoName
            }, 
            {
                headers: { 'Content-Type': 'application/json' }
            });
    
            if (response.status !== 200) throw new Error('Network response was not ok');
            return response.data;
        } catch (error) {
            console.error('Veriler alınırken bir hata oluştu:', error);
            throw error; // Hata durumunda hata fırlatmak önemli
        }
    }
    async function populateForm(id) {
        try {
            const propertyData = await getProperty();
            const property = propertyData.find(p => p._id === id);

            console.log(propertyData)
            debugger;

            let data_state;
            let dataa = await populateStates()
            if(property.details[0].province !== ""){
                data_state = await populateStates(property.details[0].province)
            }

            console.log(property.details)
            
            const selectElement = document.getElementById("province");
            const districtSelectElement = document.getElementById("district");
            const neighborhoodSelectElement = document.getElementById("neighborhood");

            dataa.forEach(function(province){
                const option = document.createElement("option");
                option.value = province.code;
                option.textContent = province.name;
            
                if (property.details[0].province === province.name) {
                    option.selected = true;
                }
            
                selectElement.appendChild(option);


            });



            neighborhoodSelectElement.innerHTML = "";
            neighborhoodSelectElement.innerHTML = '<option value="">Seç</option>';
            
            if (data_state && typeof data_state === "object") {
                Object.keys(data_state).forEach(function (district) {
                  const option = document.createElement("option");
                  option.value = district;
                  option.textContent = district;
      
                  if (property.details[0].district === district) {
                    option.selected = true;
                  }
      
                  districtSelectElement.appendChild(option);
                });

                console.log("eferdfdscvds",districtSelectElement)
              } 
      
              neighborhoodSelectElement.innerHTML = "";
              neighborhoodSelectElement.innerHTML = '<option value="">Seç</option>';
      
              data_state[property.details[0].district].forEach(function (neighborhood) {
                  const option = document.createElement("option");
                  option.value = neighborhood;
                  option.textContent = neighborhood;
      
                  if (property.details[0].neighborhood === neighborhood) {
                      option.selected = true;
                  }
      
                  neighborhoodSelectElement.appendChild(option);
              });
      









              let data_state2;
              let dataa2 = await populateStates()
              if(property.titledeed.titledeedprovince !== ""){
                  data_state2 = await populateStates(property.titledeed.titledeedprovince)
              }


                     
            const selectElement2 = document.getElementById("titledeedprovince");
            const districtSelectElement2 = document.getElementById("titledeeddistrict");
            const neighborhoodSelectElement2 = document.getElementById("titledeedneighborhood");



            dataa2.forEach(function(province){
                const option = document.createElement("option");
                option.value = province.code;
                option.textContent = province.name;
            
                if (property.titledeed.titledeedprovince=== province.name) {
                    option.selected = true;
                }
            
                selectElement2.appendChild(option);


            });
            neighborhoodSelectElement2.innerHTML = "";
            neighborhoodSelectElement2.innerHTML = '<option value="">Seç</option>';
            if (data_state2 && typeof data_state2 === "object") {
                Object.keys(data_state2).forEach(function (district) {
                  const option = document.createElement("option");
                  option.value = district;
                  option.textContent = district;
      
                  if (property.titledeed.titledeeddistrict === district) {
                    option.selected = true;
                  }
      
                  districtSelectElement2.appendChild(option);
                });

                console.log("eferdfdscvds",districtSelectElement2)
              } 
      

              console.log(districtSelectElement2)
      
              neighborhoodSelectElement2.innerHTML = "";
              neighborhoodSelectElement2.innerHTML = '<option value="">Seç</option>';
      
              data_state2[property.titledeed.titledeeddistrict] && 
                data_state2[property.titledeed.titledeeddistrict].forEach(function (neighborhood) {
                  const option = document.createElement("option");
                  option.value = neighborhood;
                  option.textContent = neighborhood;
      
                  if (property.titledeed.titledeedneighborhood === neighborhood) {
                      option.selected = true;
                  }
      
                  neighborhoodSelectElement2.appendChild(option);
              });







    
            if (!property || !property.details || property.details.length === 0) {
                console.error('Mülk bulunamadı veya detaylar eksik.');
                return;
            }
    
            const otherDetails = property.otherDetails[0] || {};
            const details = property.details[0];
            const assets = property.asset;
            const titledeed = property.titledeed;
            const baseURL = 'http://localhost:3001/public/';
    
            // Fotoğrafları ekle
            const swiperWrapper = document.querySelector('.swiper-wrapper');
            swiperWrapper.innerHTML = '';
            if (property.photos && property.photos.length > 0) {
                property.photos.forEach(photo => {
                    const slide = document.createElement('div');
                    slide.classList.add('swiper-slide');
                    slide.style.position = 'relative'; // Silme butonunun doğru konumlanması için
    
                    const img = document.createElement('img');
                    img.classList.add('img-fluid');
                    img.src = baseURL + photo;
                    img.alt = 'Property photo';
    
                    // Silme butonunu oluştur
                    const deleteBtn = document.createElement('button');
                    deleteBtn.classList.add('foto-delete-btn');
             
    
                    // Silme butonuna tıklama olayını ekle
                    deleteBtn.addEventListener('click', async function () {
                        try {
                            await deletePhoto(property._id, photo);
                            slide.remove(); // Slaytı kaldır
                            swiper.update(); // Swiper'ı güncelle
                            $(this).parent('.swiper-slide').remove()
                        } catch (error) {
                            console.error('Fotoğraf silinirken bir hata oluştu:', error);
                        }
                    });
    
                    // Butonu ve resmi slayta ekle
                    slide.appendChild(img);
                    slide.appendChild(deleteBtn);
    
                    // Slaytı Swiper'a ekle
                    swiperWrapper.appendChild(slide);
                });
    
                swiper.update();
            } else {
                console.error('Fotoğraf bulunamadı.');
            }
    
            // Formu doldur
            function setInputValue(selector, value) {
                const input = document.querySelector(selector);
                if (input) input.value = value || '';
            }
      
            setInputValue('#propertyName', details.propertyName);
            setInputValue('#portfolioId', details.portfolioId);
            setInputValue('#block', details.block);
            setInputValue('#bbNo', details.bbNo);
           
            var selectedValueAttribute = details.attribute; 
            var selectElementAttribute = document.getElementById('attribute');
            selectElementAttribute.value = selectedValueAttribute;

            if ($('.select2').length) {
                $('.select2').select2();
            }
            var selectedValueType = details.type; 
            var selectElementType = document.getElementById('type');
            selectElementType.value = selectedValueType;
            if ($('.select2').length) {
                $('.select2').select2();
            }

            var selectedValueUsageType = details.usageType; 
            var selectElementUsageType = document.getElementById('usageType');
            selectElementUsageType.value = selectedValueUsageType;
            if ($('.select2').length) {
                $('.select2').select2();
            }



         
            setInputValue('#netM2', details.netM2);
            setInputValue('#grossM2', details.grossM2);
            setInputValue('#island', details.island);
            setInputValue('#parcel', details.parcel);
            setInputValue('#onShelf', details.onShelf);
            setInputValue('#propertyNumber', details.propertyNumber);
            setInputValue('#numberOfFloors', details.numberOfFloors);
            setInputValue('#floor', details.floor);
            setInputValue('#buildingPermitDate', details.buildingPermitDate);
            setInputValue('#purchaseDate', details.purchaseDate);
            setInputValue('#purchasePrice', details.purchasePrice);
            setInputValue('#facades', details.facades);
            setInputValue('#referenceCode', details.referenceCode);


            var selectedValueZoningStatus = details.zoningStatus; 
            var selectElementZoningStatus= document.getElementById('zoningStatus');
            selectElementZoningStatus.value = selectedValueZoningStatus;
            if ($('.select2').length) {
                $('.select2').select2();
            }





            setInputValue('#benchmark', details.benchmark);
            setInputValue('#integrationCode', details.integrationCode);
            setInputValue('#listingPrice', details.listingPrice);
            setInputValue('#costPrice', details.costPrice);
            setInputValue('#grossM2', details.grossM2);
            setInputValue('#netM2', details.netM2);
            setInputValue('#latitude ', details.latitude );
            setInputValue('#longitude ', details.longitude );
            setInputValue('#bookValue', details.bookValue);
            setInputValue('#marketValue', details.marketValue);
            setInputValue('#specialPrice', details.specialPrice);
            setInputValue('#downPaymentPrice', details.downPaymentPrice);




            setInputValue('#country2', details.country2);
             setInputValue('#province', details.province);
            setInputValue('#district', details.district);
            setInputValue('#neighborhood', details.neighborhood);
            setInputValue('#address1', details.address1);
            setInputValue('#address2', details.address2);
            setInputValue('#latitude', details.latitude);
            setInputValue('#longitude', details.longitude);
            setInputValue('#daskStartDate', details.daskStartDate);
            setInputValue('#daskEndDate', details.daskEndDate);
            setInputValue('#daskPolicyNumber', details.daskPolicyNumber);
            setInputValue('#propertyOwnerName', details.propertyOwnerName);
            setInputValue('#forownerpurchaseDate', details.forownerpurchaseDate);
      

            assets.forEach(function (item) {
                const assetContainer = demirbasForm.querySelector('[data-repeater-list="assets"]');
                
                const newAssetRow = `
                    <div data-repeater-item>
                        <div class="row d-flex align-items-end">
                            <div class="col-md-4 col-12">
                                <div class="mb-1">
                                    <label class="form-label" for="assetName">Demirbaş Adı</label>
                                    <input type="text" name="assetName" class="form-control" value="${item.assetName}" placeholder="Demirbaş adı" />
                                </div>
                            </div>
                            <div class="col-md-2 col-12">
                                <div class="mb-1">
                                    <label class="form-label" for="quantity">Miktar</label>
                                    <input type="number" name="quantity" class="form-control" value="${item.quantity}" placeholder="1" />
                                </div>
                            </div>
                            <div class="col-md-2 col-12">
                                <div class="mb-1">
                                    <label class="form-label" for="price">Fiyat</label>
                                    <input type="text" name="price" class="form-control" value="${item.price}" placeholder="Fiyat" />
                                </div>
                            </div>
                            <div class="col-md-2 col-12 mb-50">
                                <div class="mb-1">
                                    <button class="btn btn-outline-danger text-nowrap px-1" data-repeater-delete type="button">
                                        <i data-feather="x" class="me-25"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <hr />
                    </div>
                `;
                
                assetContainer.insertAdjacentHTML('beforeend', newAssetRow);
            });
            debugger;
            setInputValue('#nonRentStatus', details.nonRentStatus);
            setInputValue('#mortgageStatus', details.mortgageStatus);
            setInputValue('#propertyTransactionStatus', details.propertyTransactionStatus);


            setInputValue('#realEstateInvestmentsPortfolio', details.realEstateInvestmentsPortfolio);
            setInputValue('#propertyId', details.propertyId);
            setInputValue('#reportNumber', details.reportNumber);
            setInputValue('#portfolioValue', details.portfolioValue);
            setInputValue('#fundShareRatio', details.fundShareRatio);
            setInputValue('#fundArea', details.fundArea);
            setInputValue('#grossM2Cost', details.grossM2Cost);
            setInputValue('#valuationPricePerM2', details.valuationPricePerM2);
            setInputValue('#costIncludingVAT', details.costIncludingVAT);
            setInputValue('#valuationReportDate', details.valuationReportDate);
            setInputValue('#valueInValuationReport', details.valueInValuationReport);
            setInputValue('#portfolioValue', details.portfolioValue);




    
            // Dropdown menüleri (select elementleri) ayarla
            function selectOptionByValue(selector, value) {
                const selectElement = document.querySelector(selector);
                if (selectElement) {
                    selectElement.value = value || '';
                }
            }
    
            selectOptionByValue('#usageType', details.usageType);
            selectOptionByValue('#province', details.province);
            selectOptionByValue('#district', details.district);
            selectOptionByValue('#neighborhood', details.neighborhood);
    
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










            setInputValue('#location', titledeed.location);
             setInputValue('#area', titledeed.area);
            setInputValue('#parcelShare', titledeed.parcelShare);
            setInputValue('#parcelShareholder', titledeed.parcelShareholder);
            setInputValue('#independentSectionDescription', titledeed.independentSectionDescription);
            setInputValue('#volumeNumber', titledeed.volumeNumber);
            setInputValue('#journalNumber', titledeed.journalNumber);
            setInputValue('#page', titledeed.page);
            setInputValue('#titleDeedDate', titledeed.titleDeedDate);
            setInputValue('#titleDeedType', titledeed.titleDeedType);
            setInputValue('#titleDeedTransferMethod', titledeed.titleDeedTransferMethod);
            setInputValue('#titleDeedTransferDate', titledeed.titleDeedTransferDate);
            setInputValue('#titledeedcountry', titledeed.titledeedcountry);
            setInputValue('#titledeedprovince', titledeed.titledeedprovince);
            setInputValue('#titledeeddistrict', titledeed.titledeeddistrict);
            setInputValue('#titledeedneighborhood', titledeed.titledeedneighborhood);
            setInputValue('#ownership', titledeed.ownership);
            setInputValue('#mainPropertyDescription', titledeed.mainPropertyDescription);
            setInputValue('#restrictionStatus', titledeed.restrictionStatus);
            setInputValue('#shareType', titledeed.shareType);
            setInputValue('#bbShareRatio', titledeed.bbShareRatio);



    
        } catch (error) {
            console.error('Form verilerini doldururken bir hata oluştu:', error);
        }
    }
    
    async function updateProperty() {
        const propertyData = {
            updatedId:id,
            isActive:true,
            details: {
                propertyName: document.querySelector('#propertyName').value,
                portfolioId: document.querySelector('#portfolioId').value,
                block: document.querySelector('#block').value,
                bbNo: document.querySelector('#bbNo').value,
                attribute: document.querySelector('#attribute').value,
                type: document.querySelector('#type').value,
                usageType: document.querySelector('#usageType').value,
                netM2: document.querySelector('#netM2').value,
                grossM2: document.querySelector('#grossM2').value,
                island: document.querySelector('#island').value,
                parcel: document.querySelector('#parcel').value,
                onShelf: document.querySelector('#onShelf').value,
                propertyNumber: document.querySelector('#propertyNumber').value,
                numberOfFloors: document.querySelector('#numberOfFloors').value,
                floor: document.querySelector('#floor').value,
                buildingPermitDate: document.querySelector('#buildingPermitDate').value,
                purchaseDate: document.querySelector('#purchaseDate').value,
                purchasePrice: document.querySelector('#purchasePrice').value,
                facades: document.querySelector('#facades').value,
                referenceCode: document.querySelector('#referenceCode').value,
                zoningStatus: document.querySelector('#zoningStatus').value,
                benchmark: document.querySelector('#benchmark').value,
                integrationCode: document.querySelector('#integrationCode').value,
                listingPrice: document.querySelector('#listingPrice').value,
                costPrice: document.querySelector('#costPrice').value,
                bookValue: document.querySelector('#bookValue').value,


                country2: document.querySelector('#country2').value,
                province: document.querySelector('#province').value,
                district: document.querySelector('#district').value,
                neighborhood: document.querySelector('#neighborhood').value,
                address1: document.querySelector('#address1').value,
                address2: document.querySelector('#address2').value,
                latitude: document.querySelector('#latitude').value,
                longitude: document.querySelector('#longitude').value,
                daskStartDate: document.querySelector('#daskStartDate').value,
                daskEndDate: document.querySelector('#daskEndDate').value,
                daskPolicyNumber: document.querySelector('#daskPolicyNumber').value,
                propertyOwnerName: document.querySelector('#propertyOwnerName').value,
                forownerpurchaseDate: document.querySelector('#forownerpurchaseDate').value,
               
                nonRentStatus: document.querySelector('#nonRentStatus').value,
                mortgageStatus: document.querySelector('#mortgageStatus').value,
                propertyTransactionStatus: document.querySelector('#propertyTransactionStatus').value,
                
    



                realEstateInvestmentsPortfolio: document.querySelector('#realEstateInvestmentsPortfolio').value,
                propertyId: document.querySelector('#propertyId').value,
                reportNumber: document.querySelector('#reportNumber').value,
                portfolioValue: document.querySelector('#portfolioValue').value,
                fundShareRatio: document.querySelector('#fundShareRatio').value,
                fundArea: document.querySelector('#fundArea').value,
                grossM2Cost: document.querySelector('#grossM2Cost').value,
                costIncludingVAT: document.querySelector('#costIncludingVAT').value,
                valuationReportDate: document.querySelector('#valuationReportDate').value,
                valueInValuationReport: document.querySelector('#valueInValuationReport').value,
                portfolioValue: document.querySelector('#portfolioValue').value,
           

            },
            asset: [],
            otherDetails: {
                facade: Array.from(document.querySelectorAll('input[name="facade"]:checked')).map(cb => cb.value),
                general: Array.from(document.querySelectorAll('input[name="general"]:checked')).map(cb => cb.value),
                environment: Array.from(document.querySelectorAll('input[name="environment"]:checked')).map(cb => cb.value),
                disabledFriendly: Array.from(document.querySelectorAll('input[name="disabledFriendly"]:checked')).map(cb => cb.value),
                external: Array.from(document.querySelectorAll('input[name="external"]:checked')).map(cb => cb.value),
                internal: Array.from(document.querySelectorAll('input[name="internal"]:checked')).map(cb => cb.value),
                transportation: Array.from(document.querySelectorAll('input[name="transportation"]:checked')).map(cb => cb.value),
                view: Array.from(document.querySelectorAll('input[name="view"]:checked')).map(cb => cb.value),
                residentialType: Array.from(document.querySelectorAll('input[name="residentialType"]:checked')).map(cb => cb.value),
                infrastructure: Array.from(document.querySelectorAll('input[name="infrastructure"]:checked')).map(cb => cb.value),
                location: Array.from(document.querySelectorAll('input[name="location"]:checked')).map(cb => cb.value),
            },
            titledeed: {
                // titleDeedNumber: document.querySelector('#titleDeedNumber').value,
                location: document.querySelector('#location').value,
                area: document.querySelector('#area').value,
                parcelShare: document.querySelector('#parcelShare').value,
                parcelShareholder: document.querySelector('#parcelShareholder').value,
                independentSectionDescription: document.querySelector('#independentSectionDescription').value,
                volumeNumber: document.querySelector('#volumeNumber').value,
                journalNumber: document.querySelector('#journalNumber').value,
                page: document.querySelector('#page').value,
                titleDeedDate: document.querySelector('#titleDeedDate').value,
                titleDeedType: document.querySelector('#titleDeedType').value,
                titleDeedTransferMethod: document.querySelector('#titleDeedTransferMethod').value,
                titleDeedTransferDate: document.querySelector('#titleDeedTransferDate').value,
                titledeedcountry: document.querySelector('#titledeedcountry').value,
                titledeedprovince: document.querySelector('#titledeedprovince').value,
                titledeeddistrict: document.querySelector('#titledeeddistrict').value,
                titledeedneighborhood: document.querySelector('#titledeedneighborhood').value,
                ownership: document.querySelector('#ownership').value,
                
                restrictionStatus: document.querySelector('#restrictionStatus').value,
                shareType: document.querySelector('#shareType').value,
                bbShareRatio: document.querySelector('#bbShareRatio').value
            }


            
        };

        const assetRows = document.querySelectorAll('[data-repeater-item]')
        assetRows.forEach((row) => {
          const assetName = row.querySelector('input[name="assetName"]').value
          const quantity = row.querySelector('input[name="quantity"]').value
          const price = row.querySelector('input[name="price"]').value
  
          console.log(
            `Asset Name: ${assetName}, Quantity: ${quantity}, Price: ${price}`,
          ) // Debugging için
  
          // Sadece değerler boş değilse ekle
          if (assetName && quantity && price) {
            propertyData.asset.push({
              assetName,
              quantity,
              price,
            })
          }
        })
  
        console.log(propertyData)
        try {
            const response = await axios.post(`http://localhost:3001/api/v1/emlakze/admin/updateproperty`, propertyData, {
                headers: { 'Content-Type': 'application/json' }
            });
               // Yanıt verilerini işleme
       const propertyId = response.data.updatedProperty._id; // Yanıttan propertyId alın
    
       // Fotoğrafları içeren form verilerini oluştur
       const photoFormData = new FormData();
       debugger;
       photoFormData.append("propertyId", propertyId);
 
       const files = document.getElementById("formFileMultiple").files;
       for (let i = 0; i < files.length; i++) {
         photoFormData.append("photos", files[i]);
       }
 
       // Fotoğrafları gönder
       photoResponse=   await axios.post(
         "http://localhost:3001/api/v1/emlakze/admin/setphotos",
         photoFormData,
         {
           headers: { "Content-Type": "multipart/form-data" }
         }
       );

        console.log("Photo Response:", photoResponse.data);

            if (response.status === 200) {

                Swal.fire({
                    icon: 'success',
                    title: 'Mülk başarıyla güncellendi!',
                    showConfirmButton: true,
                    timer: 1500
                }).then(() => {
                    window.location.href = 'list-property.html';
                });
            } else {
                console.error('Güncelleme başarısız:', response.statusText);
                Swal.fire({
                    icon: 'error',
                    title: 'Güncelleme başarısız!',
                    text: 'Lütfen tekrar deneyin.',
                    showConfirmButton: true
                });
            }
        } catch (error) {
            console.error('Güncelleme sırasında bir hata oluştu:', error);
            Swal.fire({
                icon: 'error',
                title: 'Bir hata oluştu!',
                text: 'Lütfen tekrar deneyin.',
                showConfirmButton: true
            });
        }
    }

    // Formu doldur ve güncelleme işlemi
    populateForm(id);
    
    // Güncelle butonuna tıklama olayı
    document.querySelector('.btn-update-all').addEventListener('click', function() {
        updateProperty();
    });
});



