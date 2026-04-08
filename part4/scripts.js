
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}


async function fetchPlaces() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');

    
    if (loginLink) {
        loginLink.style.display = token ? 'none' : 'block';
    }

    try {
        
        const response = await fetch('http://127.0.0.1:5000/api/v1/places');
        
        if (!response.ok) {
            throw new Error('فشل الاتصال بالسيرفر');
        }

        const places = await response.json();
        displayPlaces(places);
    } catch (error) {
        console.error('Error fetching places:', error);
        const container = document.getElementById('places-list');
        if (container) {
            container.innerHTML = '<p style="color: red; text-align: center;">Unable to load places. Make sure the Python server is running on port 5000.</p>';
        }
    }
}


function displayPlaces(places) {
    const container = document.getElementById('places-list');
    if (!container) return;

    container.innerHTML = ''; 

    if (places.length === 0) {
        container.innerHTML = '<p style="text-align: center;">No places available right now.</p>';
        return;
    }

    places.forEach(place => {
        const card = document.createElement('div');
        card.className = 'place-card';
        
        card.setAttribute('data-price', place.price_by_night || 0);

        card.innerHTML = `
            <div class="place-info">
                <h3>${place.name}</h3>
                <p class="price"><strong>$${place.price_by_night}</strong> / night</p>
                <p class="location">Location: ${place.city_name || 'Global'}</p>
                <button class="details-button" onclick="window.location.href='place.html?id=${place.id}'">
                    View Details
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}


document.addEventListener('DOMContentLoaded', fetchPlaces);


const priceFilter = document.getElementById('price-filter');
if (priceFilter) {
    priceFilter.addEventListener('change', (e) => {
        const maxPrice = e.target.value;
        const cards = document.querySelectorAll('.place-card');
        
        cards.forEach(card => {
            const price = parseInt(card.getAttribute('data-price'));
            
            if (maxPrice === 'All' || price <= parseInt(maxPrice)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none'; 
            }
        });
    });
}