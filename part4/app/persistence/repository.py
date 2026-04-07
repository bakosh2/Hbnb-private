from abc import ABC, abstractmethod


class Repository(ABC):
    @abstractmethod
    def add(self, obj): pass

    @abstractmethod
    def get(self, obj_id): pass

    @abstractmethod
    def get_all(self): pass

    @abstractmethod
    def update(self, obj_id, data): pass

    @abstractmethod
    def delete(self, obj_id): pass

    @abstractmethod
    def get_by_attribute(self, attr_name, attr_value): pass


class InMemoryRepository(Repository):
    def __init__(self):
        self._storage = {}

    def add(self, obj):
        self._storage[obj.id] = obj

    def get(self, obj_id):
        return self._storage.get(obj_id)

    def get_all(self):
        return list(self._storage.values())

    def update(self, obj_id, data):
        obj = self.get(obj_id)
        if obj:
            obj.update(data)
            return obj
        return None

    def delete(self, obj_id):
        if obj_id in self._storage:
            del self._storage[obj_id]

    def get_by_attribute(self, attr_name, attr_value):
        return next(
            (obj for obj in self._storage.values()
             if str(getattr(obj, attr_name, None)) == str(attr_value)),
            None
        )

    def get_by_attributes(self, **attrs):
        for obj in self._storage.values():
            if all(str(getattr(obj, k, None)) == str(v) for k, v in attrs.items()):
                return obj
        return None

    def filter_by_attributes(self, **attrs):
        return [
            obj for obj in self._storage.values()
            if all(str(getattr(obj, k, None)) == str(v) for k, v in attrs.items())
        ]


class SQLAlchemyRepository(Repository):
    """SQLAlchemy-based repository for persistent storage."""

    def __init__(self, model):
        from app import db
        self.model = model
        self.db = db

    def add(self, obj):
        self.db.session.add(obj)
        self.db.session.commit()

    def get(self, obj_id):
        return self.model.query.get(obj_id)

    def get_all(self):
        return self.model.query.all()

    def update(self, obj_id, data):
        obj = self.get(obj_id)
        if obj:
            for key, value in data.items():
                setattr(obj, key, value)
            self.db.session.commit()
        return obj

    def delete(self, obj_id):
        obj = self.get(obj_id)
        if obj:
            self.db.session.delete(obj)
            self.db.session.commit()

    def get_by_attribute(self, attr_name, attr_value):
        return self.model.query.filter_by(**{attr_name: attr_value}).first()

    def get_by_attributes(self, **attrs):
        return self.model.query.filter_by(**attrs).first()

    def filter_by_attributes(self, **attrs):
        return self.model.query.filter_by(**attrs).all()
