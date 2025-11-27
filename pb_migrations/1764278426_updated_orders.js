/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("34095o60clsn6l3")

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "select3785202386",
    "maxSelect": 1,
    "name": "service",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "delivery",
      "takeaway"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("34095o60clsn6l3")

  // remove field
  collection.fields.removeById("select3785202386")

  return app.save(collection)
})
