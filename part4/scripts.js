document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie('token');
    
    const placesList = document.getElementById('places-list');
    const placeDetailsContainer = document.getElementById('place-details');

    
    if (placesList) {
        checkAuthentication();
    }

    
    if (placeDetailsContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const placeId = urlParams.get('id');
        
        if (placeId) {
            fetchPlaceDetails(token, placeId);
            
            const addReviewSection = document.getElementById('add-review');
            if (addReviewSection) {
                
                addReviewSection.style.display = token ? 'block' : 'none';
                
                
                const addReviewLink = addReviewSection.querySelector('a');
                if (addReviewLink) {
                    addReviewLink.href = `add_review.html?id=${placeId}`;
                }
            }
        }
    }

    
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
        loginLink.style.display = token ? 'none' : 'block';
    }

    
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        if (!token) {
            window.location.href = 'index.html'; // طرد غير المسجلين
            return;
        }

        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const urlParams = new URLSearchParams(window.location.search);
            const placeId = urlParams.get('id');
            
            const comment = document.getElementById('review-text').value;
            const rating = document.getElementById('review-rating').value;
            const messageDiv = document.getElementById('message');

            try {
                const response = await fetch('http://127.0.0.1:5000/api/v1/reviews', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        place_id: placeId,
                        rating: parseInt(rating),
                        comment: comment
                    })
                });

                if (response.ok) {
                    messageDiv.innerHTML = '<p style="color: green;">Review submitted successfully!</p>';
                    setTimeout(() => {
                        window.location.href = `place.html?id=${placeId}`;
                    }, 2000);
                } else {
                    messageDiv.innerHTML = '<p style="color: red;">Failed to submit review. Try again.</p>';
                }
            } catch (error) {
                messageDiv.innerHTML = '<p style="color: red;">Connection error.</p>';
            }
        });
    }
});



function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

async function fetchPlaces(token) {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/v1/places', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const places = await response.json();
            displayPlaces(places);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayPlaces(places) {
    const container = document.getElementById('places-list');
    if (!container) return;
    container.innerHTML = ''; 
    places.forEach(place => {
        const card = document.createElement('div');
        card.className = 'place-card';
        card.setAttribute('data-price', place.price_per_night);
        card.innerHTML = `
            <h3>${place.name}</h3>
            <p>${place.description}</p>
            <p>Price per night: <strong>$${place.price_per_night}</strong></p>
            <button class="details-button" onclick="window.location.href='place.html?id=${place.id}'">View Details</button>
        `;
        container.appendChild(card);
    });
}

async function fetchPlaceDetails(token, placeId) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/v1/places/${placeId}`, {
            headers: { 'Authorization': token ? `Bearer ${token}` : '' }
        });
        if (response.ok) {
            const place = await response.json();
            displayPlaceDetails(place);
        }
    } catch (error) {
        console.error('Error fetching details:', error);
    }
}

function displayPlaceDetails(place) {
    const container = document.getElementById('place-details');
    if (!container) return;

    container.innerHTML = `
        <div class="place-info">
            <h1>${place.name}</h1>
            <p><strong>Price:</strong> $${place.price_per_night} per night</p>
            <p><strong>Description:</strong> ${place.description}</p>
            <p><strong>Amenities:</strong> ${place.amenities.map(a => a.name).join(', ')}</p>
        </div>
    `;

    const reviewsList = document.getElementById('reviews-list');
    if (reviewsList && place.reviews) {
        reviewsList.innerHTML = place.reviews.map(rev => `
            <div class="review-card">
                <p><strong>${rev.user_name}:</strong> ${rev.comment}</p>
                <p>Rating: ${rev.rating}/5</p>
            </div>
        `).join('');
    }
}

function checkAuthentication() {
    const token = getCookie('token');
    if (token) {
        fetchPlaces(token); 
    } else {
        window.location.href = 'login.html';
    }
}

