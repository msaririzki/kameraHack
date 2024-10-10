document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded. Requesting location...");
    requestLocation();
    loadPersonInfo();
});

function requestLocation() {
    console.log("Meminta lokasi...");
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                console.log("Location obtained successfully");
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                console.log("Latitude: " + latitude + ", Longitude: " + longitude);
                sendLocationToServer(latitude, longitude);
            },
            function(error) {
                console.error("Kesalahan mendapatkan lokasi: ", error.message);
                // Tambahkan penanganan kesalahan yang lebih baik di sini
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
                secure: true  // Tambahkan opsi ini untuk HTTPS
            }
        );
    } else {
        console.error("Geolokasi tidak didukung oleh browser ini.");
    }
}

function sendLocationToServer(latitude, longitude) {
    console.log("Sending location to server...");
    var formData = new FormData();
    formData.append('action', 'location');
    formData.append('lat', latitude);
    formData.append('lon', longitude);

    fetch('handler.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Location sent successfully:', data);
    })
    .catch((error) => {
        console.error('Error sending location to server:', error);
    });
}

function loadPersonInfo() {
    // Simulasi data orang yang dicari
    // Dalam implementasi nyata, Anda akan mengambil data ini dari server
    const person = {
        name: "Budi Santoso",
        age: 35,
        job: "Guru Sekolah Dasar",
        photo: "https://example.com/photo-budi.jpg",
        contactNumber: "+62123456789"
    };

    displayPersonInfo(person);
}

function displayPersonInfo(person) {
    const personInfoDiv = document.getElementById('personInfo');
    personInfoDiv.innerHTML = `
        <img src="${person.photo}" alt="${person.name}" class="person-photo">
        <div class="person-details">
            <div class="person-name">${person.name}</div>
            <div class="person-age">Usia: ${person.age} tahun</div>
            <div class="person-job">Pekerjaan: ${person.job}</div>
            <div class="contact-number">
                <a href="tel:${person.contactNumber}" class="contact-button">Hubungi: ${person.contactNumber}</a>
            </div>
        </div>
    `;
}

function searchMissingPerson() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value;
    
    fetch('handler.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=search&searchTerm=' + encodeURIComponent(searchTerm)
    })
    .then(response => response.json())
    .then(data => {
        displayMissingPersons(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function loadMissingPersons() {
    fetch('handler.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=getAll'
    })
    .then(response => response.json())
    .then(data => {
        displayMissingPersons(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function displayMissingPersons(persons) {
    const grid = document.getElementById('missingPersonGrid');
    grid.innerHTML = '';
    
    persons.forEach(person => {
        const card = document.createElement('div');
        card.className = 'missing-person-card';
        card.innerHTML = `
            <img src="${person.photo}" alt="${person.name}">
            <div class="missing-person-info">
                <div class="missing-person-name">${person.name}</div>
                <div class="missing-person-details">
                    Usia: ${person.age} tahun<br>
                    Hilang sejak: ${person.missingDate}<br>
                    Alamat terakhir: ${person.lastAddress}<br>
                </div>
                <div class="missing-person-contact">
                    <a href="tel:${person.contactNumber}">Hubungi: ${person.contactNumber}</a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}