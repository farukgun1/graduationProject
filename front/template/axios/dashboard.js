document.addEventListener('DOMContentLoaded', function () {

    async function fetchPropertyCount() {
        try {
            const response = await axios.post('http://localhost:3001/api/v1/emlakze/admin/getpropertycount', {}, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log("response", response.data);

            // Toplam mülk sayısını al
            const totalProperties = response.data.propertyCount;
            console.log(totalProperties);

            // Toplam mülk sayısını HTML'e yerleştirin
            document.getElementById('total-property-count').innerText = totalProperties;
        } catch (error) {
            console.error('Error fetching property count:', error);
        }
    }


    // Sayfa yüklendiğinde veriyi al
    window.onload = fetchPropertyCount;

    async function fetchRentCount() {
        try {
            const response = await axios.post('http://localhost:3001/api/v1/emlakze/admin/getrentcount', {}, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log("response", response.data);

            // Toplam mülk sayısını al
            const totalRents = response.data.propertyCount;
            console.log(totalRents);

            // Toplam mülk sayısını HTML'e yerleştirin
            document.getElementById('total-rent-count').innerText = totalRents;
        } catch (error) {
            console.error('Error fetching rent count:', error);
        }
    }




    async function fetchPersonelCount() {
        try {
            const response = await axios.post('http://localhost:3001/api/v1/emlakze/admin/getpersonelcount', {}, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log("response", response.data.data);

            // Toplam mülk sayısını al
            const totalpersonel = response.data.data.totalPersonnel;
            console.log(totalpersonel );


            // Toplam mülk sayısını HTML'e yerleştirin
            document.getElementById('total-personel-count').innerText = totalpersonel;
        } catch (error) {
            console.error('Error fetching rent count:', error);
        }
    }
    fetchPersonelCount()

    fetchRentCount()
    // Sayfa yüklendiğinde veriyi al
    window.onload = fetchPropertyCount;

   









});
