from app.persistence.repository import SQLAlchemyRepository


class UserRepository(SQLAlchemyRepository):
    def __init__(self):
        from app.models.user import User
        super().__init__(User)

    def get_user_by_email(self, email):
        return self.model.query.filter_by(email=email).first()


class AmenityRepository(SQLAlchemyRepository):
    def __init__(self):
        from app.models.amenity import Amenity
        super().__init__(Amenity)


class PlaceRepository(SQLAlchemyRepository):
    def __init__(self):
        from app.models.place import Place
        super().__init__(Place)


class ReviewRepository(SQLAlchemyRepository):
    def __init__(self):
        from app.models.review import Review
        super().__init__(Review)

    def get_by_user_and_place(self, user_id, place_id):
        return self.model.query.filter_by(
            user_id=str(user_id), place_id=str(place_id)
        ).first()

    def get_by_place(self, place_id):
        return self.model.query.filter_by(place_id=str(place_id)).all()


class HBnBFacade:
    """
    Facade pattern: single entry point for all business logic.
    Uses SQLAlchemy repositories for persistent storage.
    """

    def __init__(self):
        self.user_repo = UserRepository()
        self.amenity_repo = AmenityRepository()
        self.place_repo = PlaceRepository()
        self.review_repo = ReviewRepository()

    # ------------------------------------------------------------------ #
    #  User                                                               #
    # ------------------------------------------------------------------ #

    def create_user(self, user_data):
        from app.models.user import User
        import re

        email = user_data.get('email', '')
        if not re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', email):
            raise ValueError("Invalid email format")

        if self.user_repo.get_user_by_email(email):
            raise ValueError("Email already registered")

        user = User(
            first_name=user_data.get('first_name', ''),
            last_name=user_data.get('last_name', ''),
            email=email,
            password=user_data.get('password', ''),
            is_admin=user_data.get('is_admin', False)
        )
        self.user_repo.add(user)
        return user

    def get_user(self, user_id):
        return self.user_repo.get(user_id)

    def get_user_by_email(self, email):
        return self.user_repo.get_user_by_email(email)

    def get_all_users(self):
        return self.user_repo.get_all()

    def update_user(self, user_id, user_data):
        import re
        user = self.user_repo.get(user_id)
        if not user:
            return None
        if 'email' in user_data:
            if not re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$',
                            user_data['email']):
                raise ValueError("Invalid email format")
        user.update(user_data)
        self.user_repo.db.session.commit()
        return user

    def user_is_admin(self, user_id):
        user = self.user_repo.get(user_id)
        return bool(user and getattr(user, 'is_admin', False))

    # ------------------------------------------------------------------ #
    #  Amenity                                                            #
    # ------------------------------------------------------------------ #

    def create_amenity(self, amenity_data, created_by=None):
        from app.models.amenity import Amenity
        name = amenity_data.get('name', '').strip()
        if not name:
            raise ValueError("Amenity name is required")
        amenity = Amenity(name=name)
        self.amenity_repo.add(amenity)
        return amenity

    def get_amenity(self, amenity_id):
        return self.amenity_repo.get(amenity_id)

    def get_all_amenities(self):
        return self.amenity_repo.get_all()

    def update_amenity(self, amenity_id, amenity_data, updated_by=None):
        amenity = self.amenity_repo.get(amenity_id)
        if not amenity:
            return None
        amenity.update(amenity_data)
        self.amenity_repo.db.session.commit()
        return amenity

    def user_owns_amenity(self, user_id, amenity_id):
        # Amenities are global; only admins manage them
        return False

    # ------------------------------------------------------------------ #
    #  Place                                                              #
    # ------------------------------------------------------------------ #

    def create_place(self, place_data):
        from app.models.place import Place
        owner_id = place_data.get('owner_id', '')
        if not self.user_repo.get(owner_id):
            raise ValueError("Owner not found")

        price = place_data.get('price', 0)
        latitude = place_data.get('latitude', 0.0)
        longitude = place_data.get('longitude', 0.0)

        if float(price) < 0:
            raise ValueError("Price must be non-negative")
        if not (-90.0 <= float(latitude) <= 90.0):
            raise ValueError("Latitude must be between -90 and 90")
        if not (-180.0 <= float(longitude) <= 180.0):
            raise ValueError("Longitude must be between -180 and 180")

        place = Place(
            title=place_data.get('title', '').strip(),
            description=place_data.get('description', ''),
            price=price,
            latitude=latitude,
            longitude=longitude,
            owner_id=owner_id
        )

        for aid in place_data.get('amenities', []):
            amenity = self.amenity_repo.get(aid)
            if not amenity:
                raise ValueError(f"Amenity '{aid}' not found")
            if amenity not in place.amenities:
                place.amenities.append(amenity)

        self.place_repo.add(place)
        return place

    def get_place(self, place_id):
        return self.place_repo.get(place_id)

    def get_all_places(self):
        return self.place_repo.get_all()

    def update_place(self, place_id, place_data):
        place = self.place_repo.get(place_id)
        if not place:
            return None

        if 'price' in place_data and float(place_data['price']) < 0:
            raise ValueError("Price must be non-negative")
        if 'latitude' in place_data and not (-90.0 <= float(place_data['latitude']) <= 90.0):
            raise ValueError("Latitude must be between -90 and 90")
        if 'longitude' in place_data and not (-180.0 <= float(place_data['longitude']) <= 180.0):
            raise ValueError("Longitude must be between -180 and 180")

        if 'amenities' in place_data:
            amenity_ids = place_data.pop('amenities')
            place.amenities = []
            for aid in amenity_ids:
                amenity = self.amenity_repo.get(aid)
                if not amenity:
                    raise ValueError(f"Amenity '{aid}' not found")
                place.amenities.append(amenity)

        place.update(place_data)
        self.place_repo.db.session.commit()
        return place

    # ------------------------------------------------------------------ #
    #  Review                                                             #
    # ------------------------------------------------------------------ #

    def create_review(self, review_data):
        from app.models.review import Review
        user_id = review_data.get('user_id', '')
        place_id = review_data.get('place_id', '')
        text = review_data.get('text', '').strip()
        rating = review_data.get('rating')

        if not self.user_repo.get(user_id):
            raise ValueError("User not found")
        if not self.place_repo.get(place_id):
            raise ValueError("Place not found")
        if not text:
            raise ValueError("Review text is required")
        if not isinstance(rating, int) or not (1 <= rating <= 5):
            raise ValueError("Rating must be an integer between 1 and 5")

        review = Review(text=text, rating=rating, place_id=place_id, user_id=user_id)
        self.review_repo.add(review)
        return review

    def get_review(self, review_id):
        return self.review_repo.get(review_id)

    def get_all_reviews(self):
        return self.review_repo.get_all()

    def get_reviews_by_place(self, place_id):
        return self.review_repo.get_by_place(place_id)

    def get_review_by_user_and_place(self, user_id, place_id):
        return self.review_repo.get_by_user_and_place(user_id, place_id)

    def update_review(self, review_id, review_data):
        review = self.review_repo.get(review_id)
        if not review:
            return None

        if 'text' in review_data and not str(review_data['text']).strip():
            raise ValueError("text is required")
        if 'rating' in review_data:
            rating = review_data['rating']
            if not isinstance(rating, int) or not (1 <= rating <= 5):
                raise ValueError("Rating must be an integer between 1 and 5")

        allowed = {k: v for k, v in review_data.items() if k in ('text', 'rating')}
        review.update(allowed)
        self.review_repo.db.session.commit()
        return review

    def delete_review(self, review_id):
        review = self.review_repo.get(review_id)
        if not review:
            return False
        self.review_repo.delete(review_id)
        return True
