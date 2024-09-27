$(document).ready(function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');

    console.log('Tenant ID:', id);

    if (!id) {
        console.error('Tenant ID bulunamadı.');
        return;
    }

    async function getTenant() {
        try {
            const response = await axios.post('http://localhost:3001/api/v1/emlakze/admin/gettenant', {}, {
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
            const tenantData = await getTenant();
            const tenant = tenantData.find(p => p._id === id);
            console.log('Kiracı Verisi:', tenant);

            if (tenant) {
                document.querySelector('#tenant-name').value = tenant.name || '';
                document.querySelector('#tenant-surname').value = tenant.surname || '';
                document.querySelector('#tenant-email').value = tenant.email || '';
                document.querySelector('#tenant-phone').value = tenant.phone || ''; 
                document.querySelector('#tenant-tc').value = tenant.taxId || ''; 
                document.querySelector('#tenant-secondPersonFirstName').value = tenant.secondPersonFirstName || ''; 
                document.querySelector('#tenant-secondPersonLastName').value = tenant.secondPersonLastName || ''; 
                document.querySelector('#tenant-secondPersonPhone').value = tenant.secondPersonPhone || ''; 
                document.querySelector('#tenant-rating').value = tenant.rating || ''; 
            } else {
                console.error('Kiracı bulunamadı.');
            }
        } catch (error) {
            console.error('Form verilerini doldururken bir hata oluştu:', error);
        }
    }

    // Sayfa yüklendiğinde formu doldur
    populateForm(id);

    // Formu gönder
    $('#edit-tenant').on('submit', async function(event) {
        event.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

        const formData = {
            updatedId: id,
            name: $('#tenant-name').val(),
            surname: $('#tenant-surname').val(),
            email: $('#tenant-email').val(), 
            phone: $('#tenant-phone').val(),
            taxId: $('#tenant-tc').val(),
            secondPersonFirstName: $('#tenant-secondPersonFirstName').val(),
            secondPersonLastName: $('#tenant-secondPersonLastName').val(),
            secondPersonPhone: $('#tenant-secondPersonPhone').val(),
            rating: $('#tenant-rating').val(),
            isActive:true
        };

        try {
            const response = await axios.post('http://localhost:3001/api/v1/emlakze/admin/updatetenant', formData, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Güncelleme Yanıtı:', response.data);
            Swal.fire('Başarı', 'Kiracı başarıyla güncellendi!', 'success');
        } catch (error) {
            console.error('Güncelleme Hatası:', error.response ? error.response.data : error.message);
            Swal.fire('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
        }
    });
});
