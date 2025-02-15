from ..models.item import Item

# In-memory storage
items = {}


def get_item(item_id: int):
    return items.get(item_id)


def get_items():
    return list(items.values())


def create_item(item: Item):
    item_id = len(items) + 1
    item.id = item_id
    items[item_id] = item
    return item


def update_item(item_id: int, item: Item):
    if item_id not in items:
        return None
    item.id = item_id
    items[item_id] = item
    return item


def delete_item(item_id: int):
    if item_id not in items:
        return False
    del items[item_id]
    return True
