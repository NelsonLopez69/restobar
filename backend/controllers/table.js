const asyncHandler = require("express-async-handler");
const Table = require("../models").Table;
const Order = require("../models").Order;
const { Op } = require("sequelize");

//@desc     Create a table
//@route    POST /api/tables
//@access   Private/user

exports.createTable = asyncHandler(async (req, res) => {
    const name = req.body.name;
    const createdTable = await Table.create({ name });
    res.status(201).json(createdTable);
});

//@desc     Get all tables with pagination
//@route    GET /api/tables
//@access   Private/user
exports.getTables = asyncHandler(async (req, res) => {
    const pageSize = 1000;
    const page = Number(req.query.pageNumber) || 1;
    let count;

    const keyword = req.query.keyword ? req.query.keyword : null;

    if (keyword) {
        count = await Table.count({
            where: {
                [Op.or]: [
                    { id: { [Op.like]: `%${keyword}%` } },
                    { name: { [Op.like]: `%${keyword}%` } },
                ],
            },
        });
        tables = await Table.findAll({
            attributes: {
                exclude: ["updatedAt"],
            },
            where: {
                [Op.or]: [
                    { id: { [Op.like]: `%${keyword}%` } },
                    { name: { [Op.like]: `%${keyword}%` } },
                ],
            },
            offset: pageSize * (page - 1),
            limit: pageSize,
        });
    } else {
        count = await Table.count({});
        tables = await Table.findAll({
            attributes: {
                exclude: ["updatedAt"],
            },
            offset: pageSize * (page - 1),
            limit: pageSize,
        });
    }

    res.json({ tables, page, pages: Math.ceil(count / pageSize) });
});

//@desc     Get all tables
//@route    GET /api/tables/all
//@access   Private/user
exports.getAllTables = asyncHandler(async (req, res) => {
    const tables = await Table.findAll({
        include: [
            {
                model: Order,
                as: "orders",
                limit: 1,
                order: [["id", "DESC"]],
            },
        ],
    });
    res.json(tables);
});

//@desc     Get all tables
//@route    GET /api/tables/with-orders
//@access   Private/user
exports.getAllTablesWithOrders = asyncHandler(async (req, res) => {
    const allTables = await Table.findAll({
        include: { all: true, nested: true },
        where: { "$orders.isPaid$": false },
    });
    res.json(allTables);
});

//@desc     Get all available tables
//@route    GET /api/tables/all/available
//@access   Private/user
exports.getAllAvailableTables = asyncHandler(async (req, res) => {
    const tables = await Table.findAll({
        where: {
            occupied: false,
        },
    });
    res.json(tables);
});

//@desc     Get table by ID
//@route    GET /api/tables/:id
//@access   Private/user
exports.getTable = asyncHandler(async (req, res) => {
    const table = await Table.findByPk(req.params.id);

    if (table) {
        res.json(table);
    } else {
        res.status(404);
        throw new Error("Table not found");
    }
});

//@desc     Update table
//@route    PUT /api/tables/:id
//@access   Private/user
exports.updateTable = asyncHandler(async (req, res) => {
    const { name, occupied } = req.body;

    const table = await Table.findByPk(req.params.id);

    if (table) {
        table.name = name;
        table.occupied = occupied;
        const updatedTable = await table.save();
        res.json(updatedTable);
    } else {
        res.status(404);
        throw new Error("Table not found");
    }
});

//@desc     Delete a table
//@route    DELETE /api/tables/:id
//@access   Private/user
exports.deleteTable = asyncHandler(async (req, res) => {
    const table = await Table.findByPk(req.params.id);

    if (table) {
        await table.destroy();
        res.json({ message: "Table removed" });
    } else {
        res.status(404);
        throw new Error("Table not found");
    }
});
