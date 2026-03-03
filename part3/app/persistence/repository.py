from abc import ABC, abstractmethod


class Repository(ABC):
    @abstractmethod
    def add(self, obj):
        pass

    @abstractmethod
    def get(self, obj_id):
        pass

    @abstractmethod
    def get_all(self):
        pass

    @abstractmethod
    def update(self, obj_id, data):
        pass

    @abstractmethod
    def delete(self, obj_id):
        pass

    @abstractmethod
    def get_by_attribute(self, attr_name, attr_value):
        pass


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
        """
        Return the first object matching all provided attribute name/value pairs.
        Comparison is done using stringified values to avoid type mismatches.
        """
        for obj in self._storage.values():
            match = True
            for k, v in attrs.items():
                if str(getattr(obj, k, None)) != str(v):
                    match = False
                    break
            if match:
                return obj
        return None

    def filter_by_attributes(self, **attrs):
        """
        Return a list of objects matching all provided attribute name/value pairs.
        Useful for queries like "all reviews for a place" or similar filters.
        """
        results = []
        for obj in self._storage.values():
            match = True
            for k, v in attrs.items():
                if str(getattr(obj, k, None)) != str(v):
                    match = False
                    break
            if match:
                results.append(obj)
        return results
