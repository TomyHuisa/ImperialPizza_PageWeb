/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("euqjk6154krkeil")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rsvaeurr",
    "name": "points",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("euqjk6154krkeil")

  // remove
  collection.schema.removeField("rsvaeurr")

  return dao.saveCollection(collection)
})
