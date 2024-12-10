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

async function fillDropDown(data, element, textContent, selectedValue) {
    try {
        element.innerHTML = ''; 

        let defaultOptionElement = document.createElement("option");
        defaultOptionElement.value = ""; 
        defaultOptionElement.textContent = "Seçiniz";
        element.appendChild(defaultOptionElement);

        data.forEach(function (item) {
            let optionElement = document.createElement("option");
            optionElement.value = item._id;
            optionElement.textContent = item[textContent];
            if (item._id === selectedValue) {
                optionElement.selected = true;
            }
            element.appendChild(optionElement);
        });
    } catch (error) {
        console.error('Seçenekleri doldurma hatası:', error);
        throw error;
    }
}

async function getCustomer() {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/emlakze/admin/getcustomer",
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status !== 200)
        throw new Error("Network response was not ok");
      const tenantData = response.data.data;

      return tenantData;
    } catch (error) {
      console.error("Müşteri verileri alınırken bir hata oluştu:", error);
    }
}

async function populatePersonel(personelId) {
    try {
      let url = "http://localhost:3001/api/v1/emlakze/admin/getPersonel";
      let requestData = {};
      const response = await axios.post(url, requestData);
      const customerPersonel = document.getElementById("customer-personel");
  

      response.data.data.forEach(personel => {
  
        const option = document.createElement("option");
        option.value = personel._id; 
        option.textContent = `${personel.name} ${personel.surname}`; 

        if (personelId === personel._id) {
            option.selected = true;
        }

        customerPersonel.appendChild(option);
      });
  
    } catch (error) {
      console.error("Personel verileri alınırken hata oluştu:", error);
    }
}

async function fillFormWithData(id) {
    try {
      const customerData = await getCustomer();
        
      const customer = customerData.find(p => p._id === id);
      await populatePersonel(customer.personelId);
      let data_state;
      let dataa = await populateStates();

      if (customer.state !== '') {
          data_state = await populateStates(customer.state);
      }

      const selectElement = document.getElementById("customer-state");
      const districtSelectElement = document.getElementById("customer-district");
      const neighborhoodSelectElement = document.getElementById("customer-neighborhood");

      dataa.forEach(function (province) {
          const option = document.createElement("option");
          option.value = province.code;
          option.textContent = province.name;
      
          if (customer.state === province.code) {
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

            if (customer.district === district) {
              option.selected = true;
            }

            districtSelectElement.appendChild(option);
          });
        } 

        neighborhoodSelectElement.innerHTML = "";
        neighborhoodSelectElement.innerHTML = '<option value="">Seç</option>';

        data_state[customer.district].forEach(function (neighborhood) {
            const option = document.createElement("option");
            option.value = neighborhood;
            option.textContent = neighborhood;

            if (customer.neighborhood === neighborhood) {
                option.selected = true;
            }

            neighborhoodSelectElement.appendChild(option);
        });

        if (customer) {


          var selectedValueCountry = customer.country; 
          var countryDropdown = document.getElementById('customer-country');  
          
          
          countryDropdown.value = selectedValueCountry;
            document.querySelector('#customer-name').value = customer.name || '';
            document.querySelector('#customer-surname').value = customer.surname || '';
            document.querySelector('#customer-email').value = customer.email || '';
            document.querySelector('#customer-phonenumber').value = customer.phone || '';
            document.querySelector('#customer-birthdate').value = customer.birthDate || ''; 
            document.querySelector('#customer-address').value = customer.address || '';
      
        } else {
            console.error('Müşteri bulunamadı.');
        }
    } catch (error) {
        console.error('Form verilerini doldururken bir hata oluştu:', error);
    }
}

if (id) {
    fillFormWithData(id);
}

var form = document.getElementById("edit-customer");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!form.checkValidity()) {
    return;
  }
  
  const formData = {
    updatedId:id,
    name: document.getElementById("customer-name").value.trim(),
    surname: document.getElementById("customer-surname").value.trim(),
    email: document.getElementById("customer-email").value.trim(),
    phone: document.getElementById("customer-phonenumber").value.trim(),
    birthDate: document.getElementById("customer-birthdate").value.trim(),

    country: document.getElementById("customer-country").value.trim(),
    state: document.getElementById("customer-state").value.trim(),
    district: document.getElementById("customer-district").value.trim(),
    neighborhood: document.getElementById("customer-neighborhood").value.trim(),
    address: document.getElementById("customer-address").value.trim(),
    personelId: document.getElementById("customer-personel").value.trim(), 
    isActive:true,
  };

  try {
      const response = await axios.post(`http://localhost:3001/api/v1/emlakze/admin/updatecustomer`, formData, {
          headers: { 'Content-Type': 'application/json' }
      });

      Swal.fire({
          icon: 'success',
          title: 'Kişi başarıyla güncellendi!',
          showConfirmButton: true,
          timer: 1500
      }).then((result) => {
        window.location.href = 'mulk_sahibi.html'
      });
  } catch (error) {
      Swal.fire({
          icon: 'error',
          title: 'Bir hata oluştu!',
          text: 'Lütfen tekrar deneyin.',
          showConfirmButton: true
      });
  }
});


async function populateStates(citycode) {
    try {
      let url = "http://localhost:3001/api/v1/emlakze/admin/getLocation";
      let requestData = {};
  
    
      if (citycode) {
        requestData.citycode = citycode;
      }
      const response = await axios.post(url, requestData);
      const states = response.data;
  
      return states;
    } catch (error) {
      console.error("İl verileri alınırken hata oluştu:", error);
    }
}


document.getElementById('customer-state').addEventListener('change', function () {
    const districtSelectElement = document.getElementById("customer-district");
    const neighborhoodSelectElement = document.getElementById("customer-neighborhood");

  
    districtSelectElement.innerHTML = '<option value="">Seçiniz</option>';
    neighborhoodSelectElement.innerHTML = '<option value="">Seçiniz</option>';
    

    const selectedState = this.value;
    if (selectedState) {
        populateDistricts(selectedState);
    }
});





async function populateDistricts(stateCode) {
    try {
        const data_state = await populateStates(stateCode); 
        const districtSelectElement = document.getElementById("customer-district");

       
        if (data_state && typeof data_state === "object") {
            Object.keys(data_state).forEach(function (district) {
                const option = document.createElement("option");
                option.value = district;
                option.textContent = district;

                districtSelectElement.appendChild(option);
            });
        }

      
        districtSelectElement.addEventListener('change', function () {
            const selectedDistrict = this.value;
            const neighborhoodSelectElement = document.getElementById("customer-neighborhood");

        
            neighborhoodSelectElement.innerHTML = '<option value="">Seçiniz</option>';

            if (selectedDistrict && data_state[selectedDistrict]) {
                data_state[selectedDistrict].forEach(function (neighborhood) {
                    const option = document.createElement("option");
                    option.value = neighborhood;
                    option.textContent = neighborhood;

                    neighborhoodSelectElement.appendChild(option);
                });
            }
        });
    } catch (error) {
        console.error("İlçe ve mahalle seçenekleri doldurulurken hata oluştu:", error);
    }
}
