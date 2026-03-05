/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3527180448");

  return app.delete(collection);
}, (app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "json3776899405",
        "maxSize": 0,
        "name": "items",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "select1274211008",
        "maxSelect": 1,
        "name": "select",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "pending, confirmed, preparing, ready, out-for-delivery, delivered, cancelled"
        ]
      },
      {
        "hidden": false,
        "id": "number3925197119",
        "max": null,
        "min": null,
        "name": "totalprice",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "number2978823210",
        "max": null,
        "min": null,
        "name": "discountapplied",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "number4109780607",
        "max": null,
        "min": null,
        "name": "pointsused",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "number4248531391",
        "max": null,
        "min": null,
        "name": "pointsearned",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1555773706",
        "max": 0,
        "min": 0,
        "name": "customername",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1308312497",
        "max": 0,
        "min": 0,
        "name": "customerphone",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3932975500",
        "max": 0,
        "min": 0,
        "name": "deliveryaddress",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "json2551633526",
        "maxSize": 0,
        "name": "coordinates",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "date3331331489",
        "max": "",
        "min": "",
        "name": "estimateddelivery",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "select2583302449",
        "maxSelect": 1,
        "name": "ordermode",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "delivery, takeaway"
        ]
      },
      {
        "hidden": false,
        "id": "select100796390",
        "maxSelect": 1,
        "name": "paymetmethod",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "cash, card"
        ]
      },
      {
        "hidden": false,
        "id": "json3591548012",
        "maxSize": 0,
        "name": "cardinfo",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "relation2375276105",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "user",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_3527180448",
    "indexes": [],
    "listRule": null,
    "name": "orders",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
})
