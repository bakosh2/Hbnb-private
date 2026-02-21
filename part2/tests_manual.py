"""
Manual tests for core business logic models.
Run with: python tests_manual.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.models.user import User
from app.models.place import Place
from app.models.review import Review
from app.models.amenity import Amenity


def test_user_creation():
    user = User(
        first_name="John",
        last_name="Doe",
        email="john.doe@example.com",
        password="secret"
    )
    assert user.first_name == "John"
    assert user.last_name == "Doe"
    assert user.email == "john.doe@example.com"
    assert user.is_admin is False
    assert user.id is not None
    assert 'password' not in user.to_dict()
    print("✓ User creation test passed!")


def test_place_creation():
    owner = User(
        first_name="Alice",
        last_name="Smith",
        email="alice.smith@example.com",
        password="secret"
    )
    place = Place(
        title="Cozy Apartment",
        description="A nice place to stay",
        price=100,
        latitude=37.7749,
        longitude=-122.4194,
        owner_id=owner.id
    )
    review = Review(
        text="Great stay!",
        rating=5,
        place_id=place.id,
        user_id=owner.id
    )
    place.reviews.append(review)

    assert place.title == "Cozy Apartment"
    assert place.price == 100
    assert len(place.reviews) == 1
    assert place.reviews[0].text == "Great stay!"
    print("✓ Place creation and relationship test passed!")


def test_amenity_creation():
    amenity = Amenity(name="Wi-Fi")
    assert amenity.name == "Wi-Fi"
    assert amenity.id is not None
    print("✓ Amenity creation test passed!")


def test_review_creation():
    review = Review(
        text="Amazing!",
        rating=5,
        place_id="place-123",
        user_id="user-456"
    )
    assert review.text == "Amazing!"
    assert review.rating == 5
    assert review.id is not None
    print("✓ Review creation test passed!")


def test_email_validation():
    assert User.validate_email("valid@example.com") is True
    assert User.validate_email("notanemail") is False
    assert User.validate_email("missing@") is False
    print("✓ Email validation test passed!")


if __name__ == "__main__":
    test_user_creation()
    test_place_creation()
    test_amenity_creation()
    test_review_creation()
    test_email_validation()
    print("\nAll manual tests passed! ✓")
