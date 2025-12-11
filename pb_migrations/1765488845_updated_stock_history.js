/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3609746841")

  // update field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3052975985",
    "max": 0,
    "min": 0,
    "name": "itemid",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "select2257754847",
    "maxSelect": 1,
    "name": "itemtype",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "pizza, drink, dessert"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3609746841")

  // update field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3052975985",
    "max": 0,
    "min": 0,
    "name": "itemId",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "select2257754847",
    "maxSelect": 1,
    "name": "itemType",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "pizza, drink, dessert"
    ]
  }))

  return app.save(collection)
})
