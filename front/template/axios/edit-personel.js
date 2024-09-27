$(document).ready(function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');

    console.log('Personel ID:', id);

    if (!id) {
        console.error('Personel ID bulunamadı.');
        return;
    }

    async function getPersonel() {
        try {
            const response = await axios.post('http://localhost:3001/api/v1/emlakze/admin/getpersonel', {}, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status !== 200) throw new Error('Network response was not ok');
            return response.data.data;
        } catch (error) {
            console.error('Personel verileri alınırken bir hata oluştu:', error);
            return [];
        }
    }

    async function populateForm(id) {
        try {
            const personelData = await getPersonel();
            const personel = personelData.find(p => p._id === id);
            console.log('Personel Verisi:', personel);

            if (personel) {
                document.querySelector('#personel-name').value = personel.name || '';
                document.querySelector('#personel-surname').value = personel.surname || '';
                document.querySelector('#personel-email').value = personel.email || '';
                document.querySelector('#personel-phonenumber').value = personel.phoneNumber || '';
            } else {
                console.error('Kişi bulunamadı.');
            }
        } catch (error) {
            console.error('Form verilerini doldururken bir hata oluştu:', error);
        }
    }

   
    populateForm(id);

    
    $('#edit-personel').on('submit', async function(event) {
        event.preventDefault(); 

        const formData = {
            updatedId: id,
            name: $('#personel-name').val(),
            surname: $('#personel-surname').val(),
            phoneNumber: $('#personel-phonenumber').val(), 
            email: $('#personel-email').val(),
            isActive:true
        };

        try {
            const response = await axios.post('http://localhost:3001/api/v1/emlakze/admin/updatepersonel', formData, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Güncelleme Yanıtı:', response.data);
            Swal.fire('Başarı', 'Personel başarıyla güncellendi!', 'success');
        } catch (error) {
            console.error('Güncelleme Hatası:', error.response ? error.response.data : error.message);
            Swal.fire('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
        }
    });
});
