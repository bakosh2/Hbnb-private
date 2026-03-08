import uuid
import re

class User:
    def __init__(self, first_name, last_name, email, password=None, id=None):
        self.id = id or str(uuid.uuid4())
        self.first_name = self.validate_string(first_name, "first_name")
        self.last_name = self.validate_string(last_name, "last_name")
        self.email = self.validate_email(email)
        self.password = password

    @staticmethod
    def validate_string(value, field_name):
        if not value or not isinstance(value, str):
            raise ValueError(f"{field_name} must be a non-empty string")
        return value

    @staticmethod
    def validate_email(email):
        email_regex = r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w+$'
        if not re.match(email_regex, email):
            raise ValueError("Invalid email format")
        return email

    def update(self, data):
        """Updates the user attributes based on the provided dictionary."""
        protected_fields = ['id', 'email']
        for key, value in data.items():
            if key not in protected_fields and hasattr(self, key):
                setattr(self, key, value)
