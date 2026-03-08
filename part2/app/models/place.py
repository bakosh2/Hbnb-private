from app.models.base_model import BaseModel

class Place(BaseModel):
    def __init__(self, title, description, price, latitude, longitude, owner):
        super().__init__()
        self.title = title
        self.description = description
        self.price = price
        self.latitude = latitude
        self.longitude = longitude
        self.owner = owner
        self.reviews = []
        self.amenities = []

    def add_amenity(self, amenity):
        """Add an amenity to the place if it's not already there"""
        if amenity not in self.amenities:
            self.amenities.append(amenity)

    def to_dict(self):
        """Convert the Place object into a dictionary for JSON serialization"""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "price": self.price,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "owner_id": self.owner.id if hasattr(self.owner, 'id') else self.owner,
            "amenities": [a.id if hasattr(a, 'id') else a for a in self.amenities],
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
