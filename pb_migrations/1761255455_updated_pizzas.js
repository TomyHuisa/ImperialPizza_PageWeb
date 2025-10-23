/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("20qg9sb0b6qkb00")

  collection.createRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("20qg9sb0b6qkb00")

  collection.createRule = ""
  collection.updateRule = ""

  return dao.saveCollection(collection)
})
