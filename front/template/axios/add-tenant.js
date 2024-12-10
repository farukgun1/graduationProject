
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

    console.log("payloadpayload",payload)
    const form = document.getElementById('add-tenant');
 
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); 

        const tenantNameInput = document.getElementById("tenant-name");
        const tenantSurnameInput = document.getElementById("tenant-surname");
        const tenantPhoneInput = document.getElementById("tenant-phone");
        const tenantEmailInput = document.getElementById("tenant-email");
        const tenanTcInput = document.getElementById("tenant-tc");
        const tenantSecondPersonFirstNameInput = document.getElementById(
          "tenant-secondPersonFirstName"
        );
        const secondPersonLastNameInput = document.getElementById(
          "tenant-secondPersonLastName"
        );
        const tenantSecondPersonPhoneInput = document.getElementById(
          "tenant-secondPersonPhone"
        );
        const tenantRatingInput = document.getElementById("tenant-rating");

        const personelId=payload.id;
        const formData = {
            name: tenantNameInput.value.trim(),
            surname: tenantSurnameInput.value.trim(),
            phone: tenantPhoneInput.value.trim(),
            email: tenantEmailInput.value.trim(),
            taxId: tenanTcInput.value.trim(),
            secondPersonFirstName: tenantSecondPersonFirstNameInput.value.trim(),
            secondPersonLastName: secondPersonLastNameInput.value.trim(),
            secondPersonPhone: tenantSecondPersonPhoneInput.value.trim(),
            rating: tenantRatingInput.value.trim(),
            isActive: true,
            personelId:personelId
          };
          console.log(formData)

        try {
          
            const response = await axios.post('http://localhost:3001/api/v1/emlakze/admin/settenant', formData, {
                headers: { 'Content-Type': 'application/json' }
            });
            
            console.log("response", response.data);
            
       
            Swal.fire({
                icon: 'success',
                title: 'Kiracı başarıyla eklendi!',
                showConfirmButton: true,
                timer: 1500
            }).then((result) => {
                if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                    form.reset(); 
                    
                }
            });
        } catch (error) {
            console.error('Hata:', error.response ? error.response.data : error.message);

           
            Swal.fire({
                icon: 'error',
                title: 'Bir hata oluştu!',
                text: 'Lütfen tekrar deneyin.',
                showConfirmButton: true
            });
        }
    });
});