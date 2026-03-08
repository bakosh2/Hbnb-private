from app.models.user import User
from app.models.place import Place
from app.models.amenity import Amenity
from app.persistence.repository import InMemoryRepository

class HBnBFacade:
    def __init__(self):
        self.user_repo = InMemoryRepository()
        self.place_repo = InMemoryRepository()
        self.amenity_repo = InMemoryRepository()
        self.review_repo = InMemoryRepository()
    

    # --- User Methods ---
    def create_user(self, user_data):
        existing_user = self.user_repo.get_by_attribute('email', user_data.get('email'))
        if existing_user:
            raise ValueError("Email already registered")

        if not user_data.get('first_name') or not user_data.get('last_name'):
            raise ValueError("First name and last name are required")
        
        if '@' not in user_data.get('email', ''):
            raise ValueError("Invalid email format")

        user = User(**user_data)
        self.user_repo.add(user)
        return user

    def get_user(self, user_id):
        user = self.user_repo.get(user_id)
        if not user:
            return None
        return user

    def get_all_users(self):
        return self.user_repo.get_all()

    def update_user(self, user_id, user_data):
        user = self.user_repo.get(user_id)
        if not user:
            return None
        
        # Check if email is being updated and if it's already taken
        if 'email' in user_data:
            new_email = user_data['email']
            existing_user = self.user_repo.get_by_attribute('email', new_email)
            if existing_user and existing_user.id != user_id:
                raise ValueError("Email already in use by another user")

        # Update the user object internally
        user.update(user_data)
        
        # We don't need to call user_repo.update(user_id, user) 
        # because the object in memory is already updated and 
        # stored in the repository's dictionary.
        
        return user

    # --- Amenity Methods ---
    def create_amenity(self, amenity_data):
        amenity = Amenity(**amenity_data)
        self.amenity_repo.add(amenity)
        return amenity

    def get_amenity(self, amenity_id):
        return self.amenity_repo.get(amenity_id)

    def get_all_amenities(self):
        return self.amenity_repo.get_all()
    
    def update_amenity(self, amenity_id, amenity_data):
        return self.amenity_repo.update(amenity_id, amenity_data)
    def create_place(self, place_data):
        owner = self.get_user(place_data.get('owner_id'))
        if not owner:
            raise ValueError("Owner not found")

        title = place_data.get('title')
        price = place_data.get('price')
        latitude = place_data.get('latitude')
        longitude = place_data.get('longitude')

        if None in [title, price, latitude, longitude]:
            raise ValueError("Missing required fields: title, price, latitude, or longitude")

        try:
            place = Place(
                title=title,
                description=place_data.get('description', ''),
                price=float(price),
                latitude=float(latitude),
                longitude=float(longitude),
                owner=owner
            )
        except (TypeError, ValueError):
            raise ValueError("Invalid format for price, latitude, or longitude")

        amenities = place_data.get('amenities', [])
        for amenity_id in amenities:
            amenity = self.get_amenity(amenity_id)
            if amenity:
                place.add_amenity(amenity)

        return self.place_repo.add(place)

    def get_place(self, place_id):
        return self.place_repo.get(place_id)

    def get_all_places(self):
        return self.place_repo.get_all()

    def update_place(self, place_id, place_data):
        place = self.get_place(place_id)
        if not place:
            raise ValueError("Place not found")

        try:
            if 'price' in place_data:
                place_data['price'] = float(place_data['price'])
            if 'latitude' in place_data:
                place_data['latitude'] = float(place_data['latitude'])
            if 'longitude' in place_data:
                place_data['longitude'] = float(place_data['longitude'])
        except (TypeError, ValueError):
            raise ValueError("Invalid format for price, latitude, or longitude")

        if 'owner_id' in place_data:
            owner = self.get_user(place_data.pop('owner_id'))
            if not owner:
                raise ValueError("Owner not found")
            place.owner = owner

        return self.place_repo.update(place_id, place_data)

    def create_review(self, data):
        user = self.get_user(data.get('user_id'))
        place = self.get_place(data.get('place_id'))
        if not user:
            raise ValueError("User not found")
        if not place:
            raise ValueError("Place not found")

        # Validation logic for rating
        rating = data.get('rating')
        if not (1 <= rating <= 5):
            raise ValueError("Rating must be between 1 and 5")

        if not data.get('text'):
            raise ValueError("Review text is required")

        from app.models.review import Review
        new_review = Review(
            text=data['text'],
            rating=rating,
            place=place,
            user=user
        )
        return self.review_repo.add(new_review)

    def get_review(self, review_id):
        return self.review_repo.get(review_id)

    def get_all_reviews(self):
        return self.review_repo.get_all()

    def update_review(self, review_id, data):
        review = self.get_review(review_id)
        if not review:
            raise ValueError("Review not found")

        # We don't allow changing user_id or place_id in a review update
        data.pop('user_id', None)
        data.pop('place_id', None)

        if 'rating' in data and not (1 <= data['rating'] <= 5):
            raise ValueError("Rating must be between 1 and 5")

        return self.review_repo.update(review_id, data)

    def delete_review(self, review_id):
        review = self.get_review(review_id)
        if not review:
            raise ValueError("Review not found")
        return self.review_repo.delete(review_id)

    def get_reviews_by_place(self, place_id):
        all_reviews = self.review_repo.get_all()
        return [r for r in all_reviews if r.place.id == place_id]
