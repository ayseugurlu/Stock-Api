"use strict";
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// Purchase Controllers:

const Purchase = require("../models/purchase");
const Product = require("../models/product");

module.exports = {
  list: async (req, res) => {
    /* 
            #swagger.tags = ["Purchases"]
            #swagger.summary = "List Purchases"
            #swagger.description = `
                You can use <u>filter[] & search[] & sort[] & page & limit</u> queries with endpoint.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
                    <li>URL/?<b>limit=10&page=1</b></li>
                </ul>
            `
        */

    const data = await res.getModelList(Purchase, {}, [
      { path: "firmId", select: "name -_id" },
      { path: "brandId", select: "name _id" },
      { path: "productId", select: "name -_id" },
      { path: "userId", select: "username -_id" },
    ]);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Purchase),
      data,
    });
  },

  create: async (req, res) => {
    /* 
            #swagger.tags = ["Purchases"]
            #swagger.summary = "Create Purchase"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                   $ref: "#/definitions/Purchase"
                }
            }
        */

    //set userId from logged in user:
    req.body.userId = req.user._id;

    const data = await Purchase.create(req.body);

    //After purchase  increase the product quantity

    await Product.updateOne(
      { _id: data.productId },
      { $inc: { quantity: +data.quantity } }
    );

    res.status(201).send({
      error: false,
      data,
    });
  },

  read: async (req, res) => {
    /* 
            #swagger.tags = ["Purchases"]
            #swagger.summary = "Read Purchase"
        */

    const data = await Purchase.findOne({ _id: req.params.id }).populate([
      { path: "firmId", select: "name -_id" },
      { path: "brandId", select: "name -_id" },
      { path: "productId", select: "name -_id" },
      { path: "userId", select: "username -_id" },
    ]);

    res.status(200).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {
    /* 
            #swagger.tags = ["Purchases"]
            #swagger.summary = "Update Purchase"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    $ref: "#/definitions/Purchase"
                }
            }
        */

    if (req.body?.quantity) {
      const currentPurchase = await Purchase.findOne({ _id: req.params.id });
      const difference = req.body.quantity - currentPurchase.quantity;
      await Product.updateOne(
        { _id: currentPurchase.productId },
        { $inc: { quantity: +difference } }
      );
    }

    const data = await Purchase.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    res.status(200).send({
      error: false,
      data,
      new: await Purchase.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res) => {
    /* 
            #swagger.tags = ["Purchases"]
            #swagger.summary = "Delete Purchase"
        */

    const currentPurchase = await Purchase.findOne({ _id: req.params.id });
    const data = await Purchase.deleteOne({ _id: req.params.id });

    await Product.updateOne(
      { _id: currentPurchase.productId },
      { $inc: { quantity: -currentPurchase.quantity } }
    );

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
