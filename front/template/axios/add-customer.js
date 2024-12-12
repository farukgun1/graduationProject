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

async function populateDistricts(stateCode) {
    try {
        const data = await populateStates(stateCode);
        const stateData = data[stateCode]; 
        console.log(data)
        console.log(stateCode)
        const districtSelectElement = document.getElementById("customer-district");

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
    const data = await populateStates(document.getElementById("customer-state").value);
    const neighborhoodSelectElement = document.getElementById("customer-neighborhood");
    
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


async function populatePersonel() {
    try {
        let url = "http://localhost:3001/api/v1/emlakze/admin/getPersonel";
        const response = await axios.post(url, {});
        const selectElement = document.getElementById("customer-personel");

        response.data.data.forEach(personel => {
            const option = document.createElement("option");
            option.value = personel._id;
            option.textContent = `${personel.name} ${personel.surname}`;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error("Personel verileri alınırken hata oluştu:", error);
    }
}


async function submitForm(formData) {
    try {
        const response = await axios.post(
            "http://localhost:3001/api/v1/emlakze/admin/setcustomer",
            JSON.stringify(formData),
            { headers: { "Content-Type": "application/json" } }
        );
        
        Swal.fire({
            icon: "success",
            title: "Müşteri başarıyla eklendi!",
            showConfirmButton: true,
            timer: 1500,
        }).then(result => {
            if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                form.reset();
                window.location.reload();
            }
        });
    } catch (error) {
        console.error("Hata:", error.response ? error.response.data : error.message);
        Swal.fire({
            icon: "error",
            title: "Bir hata oluştu!",
            text: "Lütfen tekrar deneyin.",
            showConfirmButton: true,
        });
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    let payload;

    if (jwt && jwt.split('.').length === 3) {
        console.log('Cookie içindeki JWT:', jwt);
        try {
            const parts = jwt.split('.');
            const header = JSON.parse(atob(parts[0]));
            payload = JSON.parse(decodeURIComponent(escape(window.atob(parts[1]))));
    
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
     // Payload'dan gelen name'i span içine yazıyoruz
     if (payload && payload.name && payload.surname) {
        document.getElementById("user-name").textContent = `${payload.name} ${payload.surname}`;
    }


    console.log("payloadpayload",payload)
    await populatePersonel();
  
    const dataa = await populateStates();

    const selectElement = document.getElementById("customer-state");
    console.log(selectElement)
    const districtSelectElement = document.getElementById("customer-district");
    const neighborhoodSelectElement = document.getElementById("customer-neighborhood");

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
    const selectElementCity = document.getElementById("customer-state");
    const form = document.getElementById("add-customer");
    const personelId =payload.id;
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            return;
        }
                
        const formData = {
            name: document.getElementById("customer-name").value.trim(),
            surname: document.getElementById("customer-surname").value.trim(),
            email: document.getElementById("customer-email").value.trim(),
            phone: document.getElementById("customer-phonenumber").value.trim(),
            birthDate: document.getElementById("customer-birthdate").value.trim(),
            country: document.getElementById("customer-country").value.trim(),
            state: document.getElementById("customer-state").value.trim(),
            stateName: selectElement.options[selectElement.selectedIndex].textContent.trim(),
            district: document.getElementById("customer-district").value.trim(),
            neighborhood: document.getElementById("customer-neighborhood").value.trim(),
            address: document.getElementById("customer-address").value.trim(),
            personelId: personelId
        };

        await submitForm(formData);
    });
});
