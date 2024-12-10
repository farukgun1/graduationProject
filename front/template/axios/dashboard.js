function getJWTFromCookie() {
    const name = "token=";
    const cookieArray = document.cookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return decodeURIComponent(cookie.substring(name.length, cookie.length));
        }
    }
    return null;
}

const jwt = getJWTFromCookie();

document.addEventListener('DOMContentLoaded', async function () {
    let payload = null;

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
            window.location.href = '/giris';
            return;
        }
    } else {
        console.log('JWT cookie bulunamadı veya geçersiz formatta.');
        window.location.href = '/giris';
        return;
    }

    // Kullanıcı adını sayfaya yerleştir
    if (payload && payload.name) {
        document.getElementById("user-name").textContent = payload.name;
    }

    // `personelId` değerini al
    const personelId = payload?.id;

    // Mülk sayısını getir
    async function fetchPropertyCount() {
        try {
            const response = await axios.post('http://localhost:3001/api/v1/emlakze/admin/getpropertycount', { personelId }, {
                headers: { 'Content-Type': 'application/json' }
            });

            const totalProperties = response.data.propertyCount;
            console.log('Total Properties:', totalProperties);
            document.getElementById('total-property-count').innerText = totalProperties;
        } catch (error) {
            console.error('Error fetching property count:', error);
        }
    }

    // Kiralama sayısını getir
    async function fetchRentCount() {
        try {
            const response = await axios.post('http://localhost:3001/api/v1/emlakze/admin/getrentcount', {personelId}, {
                headers: { 'Content-Type': 'application/json' }
            });

            const totalRents = response.data.propertyCount;
            console.log('Total Rents:', totalRents);
            document.getElementById('total-rent-count').innerText = totalRents;
        } catch (error) {
            console.error('Error fetching rent count:', error);
        }
    }

    // Personel sayısını getir
    async function fetchPersonelCount() {
        try {
            const response = await axios.post('http://localhost:3001/api/v1/emlakze/admin/getpersonelcount', {}, {
                headers: { 'Content-Type': 'application/json' }
            });

            const totalPersonnel = response.data.data.totalPersonnel;
            console.log('Total Personnel:', totalPersonnel);
            document.getElementById('total-personel-count').innerText = totalPersonnel;
        } catch (error) {
            console.error('Error fetching personnel count:', error);
        }
    }

    async function fetchAverageRentIncome() {
        try {
            const response = await axios.post(
                'http://localhost:3001/api/v1/emlakze/admin/calculateAverageRentIncome',
                { personelId },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const averageIncome = response.data.averageIncome || 0; // API'den gelen gelir
            console.log(`Tahmini Kira Geliri: ${averageIncome}`);

            // Geliri HTML'e yazdır
            document.getElementById('estimated-rent-income').innerText = `${averageIncome} TL`;
        } catch (error) {
            console.error('Error fetching rent income:', error);
            document.getElementById('estimated-rent-income').innerText = "Hata";
        }
    }

    // API çağrısı yap ve tahmini kira gelirini doldur
    await fetchAverageRentIncome();








    // Sayfa yüklendiğinde verileri al
    await fetchPropertyCount();
    await fetchRentCount();
    await fetchPersonelCount();
});
