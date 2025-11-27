/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("20qg9sb0b6qkb00")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number1780688505",
    "max": null,
    "min": null,
    "name": "price_points",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("20qg9sb0b6qkb00")

  // remove field
  collection.fields.removeById("number1780688505")

  return app.save(collection)
})
