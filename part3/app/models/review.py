from app.models import BaseModel
from app.models.place import Place
from app.models.user import User


class Review(BaseModel):
    def __init__(self, text, rating, place: Place, user: User):
        super().__init__()
        self.text = text
        self.rating = rating

        if not isinstance(place, Place):
            raise ValueError("place must be a Place instance")
        if not isinstance(user, User):
            raise ValueError("user must be a User instance")

        self.place = place
        self.user = user

    @property
    def text(self):
        return self._text

    @text.setter
    def text(self, value):
        if not value:
            raise ValueError("text is required")
        self._text = value

    @property
    def rating(self):
        return self._rating

    @rating.setter
    def rating(self, value):
        if value is None or not (1 <= int(value) <= 5):
            raise ValueError("rating must be an integer between 1 and 5")
        self._rating = int(value)
