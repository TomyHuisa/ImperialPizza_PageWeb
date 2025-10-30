/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("34095o60clsn6l3")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ejc4gpy4",
    "name": "status",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "pending",
        "confirmed",
        "preparing",
        "onway",
        "withdrawal",
        "delivered",
        "cancelled"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("34095o60clsn6l3")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ejc4gpy4",
    "name": "status",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "pending",
        "confirmed",
        "preparing",
        "delivered",
        "cancelled"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
