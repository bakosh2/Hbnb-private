from app.models import BaseModel
from app.models.user import User
from app.models.amenity import Amenity


class Place(BaseModel):
    def __init__(self, title, description, price, latitude, longitude, owner: User):
        super().__init__()
        self.title = title
        self.description = description
        self.price = price
        self.latitude = latitude
        self.longitude = longitude

        if not isinstance(owner, User):
            raise ValueError("owner must be a User instance")
        self.owner = owner

        self.reviews = []      # list of Review instances
        self.amenities = []    # list of Amenity instances

    @property
    def title(self):
        return self._title

    @title.setter
    def title(self, value):
        if not value or len(value) > 100:
            raise ValueError("title is required and must be <= 100 characters")
        self._title = value

    @property
    def description(self):
        return self._description

    @description.setter
    def description(self, value):
        self._description = value

    @property
    def price(self):
        return self._price

    @price.setter
    def price(self, value):
        if value is None or value < 0:
            raise ValueError("price must be a positive value")
        self._price = float(value)

    @property
    def latitude(self):
        return self._latitude

    @latitude.setter
    def latitude(self, value):
        if value is None or value < -90.0 or value > 90.0:
            raise ValueError("latitude must be between -90.0 and 90.0")
        self._latitude = float(value)

    @property
    def longitude(self):
        return self._longitude

    @longitude.setter
    def longitude(self, value):
        if value is None or value < -180.0 or value > 180.0:
            raise ValueError("longitude must be between -180.0 and 180.0")
        self._longitude = float(value)

    def add_review(self, review):
        from app.models.review import Review
        if not isinstance(review, Review):
            raise ValueError("review must be a Review instance")
        self.reviews.append(review)

    def add_amenity(self, amenity: Amenity):
        if not isinstance(amenity, Amenity):
            raise ValueError("amenity must be an Amenity instance")
        self.amenities.append(amenity)
