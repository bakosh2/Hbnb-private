"""Module for User class"""
from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, String, Boolean, DateTime, CheckConstraint
from sqlalchemy.orm import validates

from werkzeug.security import generate_password_hash

from model.review import Review
from services.Database.database import Base, get_session
from services.Validators.validators import Validator


class User(Base):
    """The User Class"""
    __tablename__ = 'users'

    id = Column(String(36), primary_key=True, default=lambda: uuid4())
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow(), nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow(), onupdate=datetime.utcnow(), nullable=False)
    role = Column(String(5), default='user', nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)

    __table_args__ = (
        CheckConstraint(role.in_(['user', 'admin', 'owner']), name='role_check'),
    )

    @validates('email')
    def validate_email(self, key, value):
        validated_email = value.lower()
        mailcheck, status = Validator.validate_user_mail(validated_email)
        if not mailcheck:
            if status == 1:
                raise ValueError("Email format is not correct")
            elif status == 0:
                raise ValueError("User with this email already exists")
        return validated_email

    @validates('password')
    def validate_password(self, key, value):
        import re

        # Check if password is minimum 8 characters
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters")

        # Check if password contains at least one uppercase letter
        elif not re.search('[A-Z]', value):
            raise ValueError("Password must contain at least one uppercase letter")

        # Check if password contains at least one lowercase letter
        elif not re.search('[a-z]', value):
            raise ValueError("Password must contain at least one lowercase letter")

        # Check if password contains at least one number
        elif not re.search('[0-9]', value):
            raise ValueError("Password must contain at least one number")

        # Hash using sha256
        hashed_password = generate_password_hash(value)
        return hashed_password

    @validates('first_name')
    def validate_first_name(self, key, value):
        validated_first_name = ' '.join(word.capitalize() for word in value.split())
        return validated_first_name

    @validates('last_name')
    def validate_last_name(self, key, value):
        validated_last_name = ' '.join(word.capitalize() for word in value.split())
        return validated_last_name

    @staticmethod
    def delete(deletionid: str):
        """Function for delete a user object"""
        from model.place import Place

        session = get_session()
        try:
            usertodelete = session.query(User).filter(User.id == deletionid).one()
            if not usertodelete:
                raise ValueError("User does not exist")
            places = session.query(Place).filter(Place.host == deletionid).all()
            for place in places:
                Place.delete(place.id)
                session.commit()
            reviews = session.query(Review).filter(Review.user == deletionid).all()
            for review in reviews:
                Review.delete(review.id)
                session.commit()
            session.delete(usertodelete)
            session.commit()
            return usertodelete
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
