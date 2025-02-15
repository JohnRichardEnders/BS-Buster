from fastapi import APIRouter, HTTPException
from ..models.item import Item
from ..services import item_service

router = APIRouter(prefix="/items", tags=["items"])


@router.post("/", response_model=Item)
def create_item(item: Item):
    return item_service.create_item(item)


@router.get("/", response_model=list[Item])
def read_items():
    return item_service.get_items()


@router.get("/{item_id}", response_model=Item)
def read_item(item_id: int):
    item = item_service.get_item(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.put("/{item_id}", response_model=Item)
def update_item(item_id: int, item: Item):
    updated_item = item_service.update_item(item_id, item)
    if updated_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return updated_item


@router.delete("/{item_id}")
def delete_item(item_id: int):
    if not item_service.delete_item(item_id):
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Item deleted successfully"}
