const axios = require('axios').default;
const asyncHandler = require("express-async-handler");
const Order = require("../models").Order;
const Product = require("../models").Product;
const { Op } = require("sequelize");
const Client = require("../models").Client;
const Table = require("../models").Table;
const { sequelize } = require("../models");


//utils
const {
    stock,
    updateTable,
    addProductsInOrder,
    updateProductsStock,
} = require("../utils/order");

//@desc     Create a Order
//@route    POST /api/orders
//@access   Private/user
exports.createOrder = asyncHandler(async (req, res) => {
    //get data from request
    const { total, tableId, clientId, name,  products, delivery, note } = req.body;
    await stock(products);

    //console.error("totl", total)

    if (stock) {
            //create order
            const createdOrder = await Order.create({
                total: total,
                tableId: tableId,
                userId: 1,
                clientId: clientId,
                delivery: false,
                note: note,
                name: name
            })

            //create order products
            await addProductsInOrder(createdOrder, products).then(err => {
                console.log("mala:"+err)
                axios.post("http://localhost:5000/fact")
            });

            //update table to occupied
            if (!delivery) {
               // updateTable(createdOrder.tableId, true);
            }

            //update stock
            //await updateProductsStock(products, -1);

            //response OK

            //const ans  = this.getOrders()
            //console.log("totl", createdOrder)

            res.status(200).json();
        } else {
            res.status(400).json({ message: "There is no stock available" });
        }
});

//@desc     Get all orders
//@route    GET /api/orders/all
//@access   Private/user
exports.getAllOrders = asyncHandler(async (req, res) => {
    orders = await Order.findAll({ order: [["id", "ASC"]] });
    res.json(orders);
});

//@desc     Get all active orders
//@route    GET /api/orders/active/all
//@access   Private/user
exports.getAllActiveOrders = asyncHandler(async (req, res) => {
    orders = await Order.findAll({
        include: [
            { model: Client, as: "client" },
            { model: Table, as: "table" },
        ],
        order: [["id", "ASC"]],
        where: { isPaid: false },
    });
    res.json(orders);
});

//@desc     Get all delivery orders
//@route    GET /api/orders/all/delivery
//@access   Private/user
exports.getAllDeliveryOrders = asyncHandler(async (req, res) => {
    orders = await Order.findAll({
        order: [["id", "ASC"]],
        where: { delivery: true },
    });
    res.json(orders);
});

//@desc     Get all in place orders
//@route    GET /api/orders/all/in-place
//@access   Private/user
exports.getAllInPlaceOrders = asyncHandler(async (req, res) => {
    orders = await Order.findAll({
        order: [["id", "ASC"]],
        where: { delivery: false },
    });
    res.json(orders);
});

//@desc     Get all sales
//@route    GET /api/orders/all/sales
//@access   Private/user
exports.getAllSales = asyncHandler(async (req, res) => {
    orders = await Order.findAll({
        group: ["Order.id"],
        includeIgnoreAttributes: false,
        attributes: [
            "id",
            "delivery",
            "total",
            "updatedAt",
            [sequelize.fn("COUNT", "products.id"), "total_products"],
        ],
        include: [
            {
                model: Product,
                as: "products",
                attributes: [],
                duplicating: false,
            },
        ],
        order: [["updatedAt", "ASC"]],
        where: { isPaid: true },
    });
    res.json(orders);
});

//@desc     Get all orders
//@route    GET /api/orders
//@access   Private/user
exports.getOrders = asyncHandler(async (req, res) => {
    const pageSize = Number.MAX_SAFE_INTEGER;
    const page = Number(req.query.pageNumber) || 1;
    let orders;
    let count;

    const keyword = req.query.keyword ? req.query.keyword : null;

    if (keyword) {
        count = await Order.count({
            include: [
                { model: Client, as: "client" },
                { model: Table, as: "table" },
                { model: Product, as: "product" },
            ],
            where: {
                [Op.or]: [
                    { id: { [Op.like]: `%${keyword}%` } },
                    { total: keyword },
                    { "$client.name$": { [Op.like]: `%${keyword}%` } },
                    { "$table.name$": { [Op.like]: `%${keyword}%` } },
                ],
            },
        });
        orders = await Order.findAll({
            include: [
                { model: Client, as: "client" },
                { model: Table, as: "table" },
            ],
            attributes: {
                exclude: ["userId", "clientId", "tableId", "updatedAt"],
            },
            where: {
                [Op.or]: [
                    { id: { [Op.like]: `%${keyword}%` } },
                    { total: keyword },
                    { "$client.name$": { [Op.like]: `%${keyword}%` } },
                    { "$table.name$": { [Op.like]: `%${keyword}%` } },
                ],
            },
            order: [["id", "ASC"]],

            offset: pageSize * (page - 1),
            limit: pageSize,
        });
    } else {
        count = await Order.count({});
        orders = await Order.findAll({
            include: [
                { model: Client, as: "client" },
                { model: Table, as: "table" },
                { model: Product, as: "products" },

            ],
            attributes: {
                exclude: ["userId", "clientId", "tableId", "updatedAt"],
            },
            order: [["id", "ASC"]],
            offset: pageSize * (page - 1),
            limit: pageSize,
        });
    }

    res.json({ orders, page, pages: Math.ceil(count / pageSize) });
});



//@desc     Get all active orders
//@route    GET /api/orders/active
//@access   Private/user
exports.getActiveOrders = asyncHandler(async (req, res) => {
    const pageSize = 100;
    const page = Number(req.query.pageNumber) || 1;
    const delivery = req.query.delivery ? true : false;
    let orders;
    let count;

    const keyword = req.query.keyword ? req.query.keyword : null;

    if (keyword) {
        count = await Order.count({
            include: [
                { model: Client, as: "client" },
                { model: Table, as: "table" },
            ],
            where: {
                [Op.or]: [
                    { id: { [Op.like]: `%${keyword}%` } },
                    { total: keyword },
                    { "$client.name$": { [Op.like]: `%${keyword}%` } },
                    { "$table.name$": { [Op.like]: `%${keyword}%` } },
                ],
                [Op.and]: {
                    [Op.or]: [false ? { isPaid: false } : ""],
                },
                [Op.and]: { delivery: delivery },
            },
        });
        orders = await Order.findAll({
            include: [
                { model: Client, as: "client" },
                { model: Table, as: "table" },
            ],
            attributes: {
                exclude: ["userId", "clientId", "tableId", "updatedAt"],
            },
            where: {
                [Op.or]: [
                    { id: { [Op.like]: `%${keyword}%` } },
                    { total: keyword },
                    { "$client.name$": { [Op.like]: `%${keyword}%` } },
                    { "$table.name$": { [Op.like]: `%${keyword}%` } },
                ],
                [Op.and]: {
                    [Op.or]: [{ isPaid: false }],
                },
                [Op.and]: { delivery: delivery },
            },
            order: [["id", "ASC"]],

            offset: 0,
            limit: pageSize,
        });
    } else {
        count = await Order.count({
            where: {
                [Op.or]: [{ isPaid: false }],
                [Op.and]: { delivery: delivery },
            },
        });
        orders = await Order.findAll({
            include: [
                { model: Client, as: "client" },
                { model: Table, as: "table" },
            ],
            attributes: {
                exclude: ["userId", "clientId", "tableId", "updatedAt"],
            },
            where: {
                [Op.or]: [{ isPaid: false }],
                [Op.and]: { delivery: delivery },
            },
            order: [["id", "ASC"]],
            offset: 0,
            limit: pageSize,
        });
    }

    res.json({ orders, page: 1, pages: 1 });
});

//@desc     Get order by ID
//@route    GET /api/order/:id
//@access   Private/user
exports.getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id, {
        include: { all: true, nested: true },
    });
    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

//@desc     Get order items by ID
//@route    GET /api/order/:id/items
//@access   Private/user
exports.getOrderItems = asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id);

    if (order) {
        const orderItems = await order.getProducts();
        res.json(orderItems);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

//@desc     Update order to paid
//@route    POST /api/orders/:id/pay
//@access   Private/user
exports.updateOrderPay = asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id);

    if (order) {
       /* if (order.tableId) {
            const table = await Table.findByPk(order.tableId);
            table.occupied = false;
            table.save();
        }*/

        order.isPaid = !order.isPaid;
        const updatedOrder = await order.save().then(err => {
            console.log("mala3:"+err)
            axios.post("http://localhost:5000/fact")

        });
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

//@desc     Update order
//@route    PUT /api/orders/:id
//@access   Private/user
exports.updateOrder = asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id, {
        include: { all: true, nested: true },
    });

    const { total, clientId, name, tableId, delivery, products, note } = req.body;

    if (order) {
        console.log('orderis: ', name)

        order.clientId = clientId;
        order.name = name
        order.delivery = delivery;
        order.note = note;

        /* CHECK TABLE */
        if (order.tableId !== tableId) {
            if (!order.tableId && !delivery) {
                /* DELIVERY -> TABLE */
                updateTable(tableId, true);
                order.tableId = tableId;
            } else if (order.tableId && delivery) {
                /* TABLE -> DELIVERY */
                updateTable(order.tableId, false);
                order.tableId = null;
            } else {
                /* TABLE -> TABLE */
                updateTable(order.tableId, false);
                updateTable(tableId, true);
                order.tableId = tableId;
            }
        }

        /* CHECK PRODUCTS */
        if (parseFloat(order.total) !== parseFloat(total)) {
            const oldProducts = await order.getProducts();
            if (oldProducts) {
                /* FORMAT OLD PRODUCTS */
                const formattedOldProducts = oldProducts.map((product) => {
                    product.quantity = product.OrderProduct.quantity;
                    return product;
                });

                /* RESTOCK OLD PRODUCTS */
                updateProductsStock(formattedOldProducts, 1);

                /* DELETE ALL PRODUCTS FROM ORDER */
                await order.setProducts(null);

                /* CREATE NEW PRODUCTS */
                addProductsInOrder(order, products);

                /* UPDATE STOCK */
                updateProductsStock(products, -1);
            }
        }
        order.total = total;
        const updatedOrder = await order.save().then(err => {
            console.log("mala3:"+err)
            axios.post("http://localhost:5000/fact")

        });
        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

//@desc     Update order to delivered
//@route    POST /api/orders/:id/delivery
//@access   Private/user
exports.updateOrderDelivery = asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id);

    if (order) {
        order.delivery = !order.delivery;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

//@desc     Update order items
//@route    PUT /api/orders/:id/items
//@access   Private/user
exports.updateOrderItems = asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id);

    const { products } = req.body;

    if (order) {
        //delete order items
        order.setProducts(null).then((item) => {
            // create order items
            products.map((product) => {
                order.addProduct(product.id, {
                    through: { quantity: product.quantity },
                });
            });
        });

        //save
        //const updatedOrder =  await order.save()
        const orders = await order.getProducts();
        res.json(orders);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

//@desc     Delete a order
//@route    DELETE /api/orders/:id
//@access   Private/user
exports.deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id);

    if (order) {
        await order.destroy();
        res.json({ message: "Order removed" });
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});
