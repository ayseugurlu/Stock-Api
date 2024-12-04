"use strict";
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// Category Controllers:

const Category = require("../models/category");

module.exports = {
  list: async (req, res) => {
    /* 
            #swagger.tags = ["Categorys"]
            #swagger.summary = "List Categorys"
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

    const data = await res.getModelList(Category);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Category),
      data,
    });
  },
  create: async (req, res) => {
    /* 
            #swagger.tags = ["Categorys"]
            #swagger.summary = "Create Category"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "categoryname": "test",
                    "password": "1234",
                    "email": "test@site.com",
                    "firstName": "test",
                    "lastName": "test",
                }
            }
        */

    const data = await Category.create(req.body);

    res.status(201).send({
      error: false,
      data,
    });
  },

  read: async (req, res) => {
    /* 
            #swagger.tags = ["Categorys"]
            #swagger.summary = "Read Category"
        */

    const data = await Category.findOne({ _id: req.params.id });

    res.status(200).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {
    /* 
            #swagger.tags = ["Categorys"]
            #swagger.summary = "Update Category"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "categoryname": "test",
                    "password": "1234",
                    "email": "test@site.com",
                    "firstName": "test",
                    "lastName": "test",
                }
            }
        */

    const data = await Category.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    res.status(200).send({
      error: false,
      data,
      new: await Category.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res) => {
    /* 
            #swagger.tags = ["Categorys"]
            #swagger.summary = "Delete Category"
        */

    const data = await Category.deleteOne({ _id: req.params.id });

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
