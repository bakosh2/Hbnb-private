"""Module containing Amenity class"""
from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import validates

from services.Database.database import Base, get_session
from services.Validators.validators import Validator


class Amenity(Base):
    """The Amenity Class"""
    __tablename__ = 'amenities'

    id = Column(String(36), primary_key=True, default=lambda: uuid4())
    name = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.now(), nullable=False)
    updated_at = Column(DateTime, default=datetime.now(), onupdate=datetime.now(), nullable=False)

    @validates('name')
    def validate_name(self, key, value):
        if not value:
            raise ValueError('Amenity name cannot be empty')
        validated_name = ' '.join(word.capitalize() for word in value.split())
        if Validator.validate_amenity(validated_name):
            raise ValueError('Amenity already exists')
        return validated_name

    @staticmethod
    def delete(deletionid: str):
        """Function to delete an Amenity from the database"""
        from model.place_amenity import PlaceAmenity

        session = get_session()
        try:
            amenity_to_delete = session.query(Amenity).filter(Amenity.id == deletionid).one()
            if not amenity_to_delete:
                raise ValueError('Amenity does not exist')
            amenity_place = session.query(PlaceAmenity).filter(PlaceAmenity.amenity_id == deletionid).all()
            for amenityobj in amenity_place:
                session.delete(amenityobj)
                session.commit()
            session.delete(amenity_to_delete)
            session.commit()
            return amenity_to_delete
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
