/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3720670791")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select4156564586",
    "maxSelect": 1,
    "name": "size",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "large",
      "medium"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3720670791")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select4156564586",
    "maxSelect": 1,
    "name": "size",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "medium, large"
    ]
  }))

  return app.save(collection)
})
