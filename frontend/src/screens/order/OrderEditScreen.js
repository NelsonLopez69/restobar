import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextName from "../../components/form/TextName";

/* Components */
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import HeaderContent from "../../components/HeaderContent";
import ButtonGoBack from "../../components/ButtonGoBack";

/* Form components */
import Textarea from "../../components/form/Textarea";
import Checkbox from "../../components/form/Checkbox";

/* Order Components */
import ProductsTable from "../../components/order/ProductsTable";
import OrderInfo from "../../components/order/OrderInfo";
import Select from "../../components/Select";
import OrderCart from "../../components/order/OrderCart";
import LoaderHandler from "../../components/loader/LoaderHandler";

/* Constants */
import {
    ORDER_DETAILS_RESET,
    ORDER_UPDATE_RESET,
} from "../../constants/orderConstants";

/* Actions */
import { listOrderDetails, updateOrder } from "../../actions/orderActions";
import { allClients } from "../../actions/clientActions";
import { allTables } from "../../actions/tableActions";

const OrderEditScreen = ({ history, match }) => {
    const orderId = parseInt(match.params.id);

    const [table, setTable] = useState(null);
    const [total, setTotal] = useState(0);
    const [client, setClient] = useState(null);
    const [delivery, setDelivery] = useState(false);
    const [note, setNote] = useState("");
    const [clientName, setName] = useState("");
    const [productsInOrder, setProductsInOrder] = useState([]);
    const [productsAlreadyOrdered, setProductsAlreadyOrdered] = useState([]);
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    //order details state
    const orderDetails = useSelector((state) => state.orderDetails);
    const { loading, error, order } = orderDetails;

    //order edit state
    const orderUpdate = useSelector((state) => state.orderUpdate);
    const {
        loading: loadingUpdate,
        success: successUpdate,
        errorUpdate,
    } = orderUpdate;

    //tables list state
    const tableAll = useSelector((state) => state.tableAll);
    const {
        loading: loadingAllTables,
        error: errorAllTables,
        tables,
    } = tableAll;

    //client list state
    const clientAll = useSelector((state) => state.clientAll);
    const {
        loading: loadingAllClients,
        error: errorAllClients,
        clients,
    } = clientAll;

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: ORDER_UPDATE_RESET });
            dispatch({ type: ORDER_DETAILS_RESET });
            if (delivery) {
                history.push("/delivery");
            } else {
                history.push("/order");
            }
        }
    }, [successUpdate]);

    /* Load Tables and Clients */
    useEffect(() => {
        dispatch(allTables());
        dispatch(allClients());
    }, [dispatch, history]);

    useEffect(() => {
        //load order
        if (order) {
            if (!order.id || order.id !== orderId) {
                dispatch(listOrderDetails(orderId));
            } else {
                //set states
                setTable(order.table ? order.table.id : null);
                setClient(order.client ? order.client.id : null);
                setNote(order.note ? order.note : note);
                setName(order.name ? order.name : clientName);
                setDelivery(order.delivery ? order.delivery : delivery);

                if (order.products) {
                    /* Format products */
                    const products = order.products.map((product) => {
                        return {
                            ...product,
                            quantity: product.OrderProduct.quantity,
                        };
                    });

                    /* Set products state */
                    setProductsInOrder(products);
                    setProductsAlreadyOrdered(products);
                }
            }
        }
    }, [dispatch, history, order, orderId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let errorsCheck = {};

       /* if (!table && !delivery) {
            errorsCheck.table = "Table is required";
        }
        if (!client) {
            errorsCheck.client = "Client is required";
        }*/

        console.log('maname1')


        if (productsInOrder.length < 1) {
            errorsCheck.products = "Pedido sin productos";
        }

        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            const order = {
                id: orderId,
                total: total,
                tableId: !delivery ? table : 0,
                clientId: 1,
                products: productsInOrder,
                delivery: delivery,
                name: clientName,
                note: note,
            };



            dispatch(updateOrder(order));
        }
    };

    const filterFreeTables = () => {
        const mappedTables = tables.filter((tableItem) => {
            /* return if table is not occupied OR if the same from order */
            return tableItem.occupied === false || tableItem.id === table;
        });
        return mappedTables;
    };

    const renderProductsTable = () => (
        <ProductsTable
            productsInOrder={productsInOrder}
            productsAlreadyOrdered={productsAlreadyOrdered}
            setProductsInOrder={setProductsInOrder}
        />
    );

    const renderCart = () => (
        <>
            {errors.products && (
                <Message message={errors.products} color={"warning"} />
            )}
            <OrderInfo
                total={total}
                setTotal={setTotal}
                productsInOrder={productsInOrder}
            />
            <OrderCart
                productsInOrder={productsInOrder}
                setProductsInOrder={setProductsInOrder}
            />
        </>
    );

    const renderTablesSelect = () => (
        <>
            <Select
                data={table}
                setData={setTable}
                items={filterFreeTables(tables)}
                disabled={delivery}
            />
            {errors.table && (
                <Message message={errors.table} color={"warning"} />
            )}
        </>
    );

    const renderClientsSelect = () => (
        <>
            <Select data={client} setData={setClient} items={clients} />
            {errors.client && (
                <Message message={errors.client} color={"warning"} />
            )}
        </>
    );

    const renderDeliveryCheckbox = () => (
        <Checkbox name={"delivery"} data={delivery} setData={setDelivery} />
    );

    const renderNoteTextarea = () => (
        <Textarea
            title={"Note (optional)"}
            rows={3}
            data={note}
            setData={setNote}
        />
    );

    const renderNoteTextName = () => (
        <TextName
            title={"Cliente"}
            rows={1}
            data={clientName}
            setData={setName}
        />
    );

    const renderSubmitButton = () => (
        <button
            onClick={handleSubmit}
            className="btn btn-success btn-lg float-right "
        >
            Guardar
        </button>
    );

    return (
        <>
            {/* Content Header (Page header) */}
            <HeaderContent name={"Pedido"} />

            {/* Main content */}
            <section className="content">
                <div className="container-fluid">
                    <ButtonGoBack history={history} />
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Editar pedido</h3>
                                    <Loader variable={loadingUpdate} />
                                    <Message
                                        message={errorUpdate}
                                        color={"danger"}
                                    />
                                    <Loader variable={loading} />
                                    <Message message={error} color={"danger"} />
                                </div>
                                {/* /.card-header */}
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12 col-lg-6">
                                            {renderProductsTable()}
                                        </div>
                                        <div className="col-12 col-lg-6">
                                            {renderCart()}
                                            <div className="row">
                                                <div className="col-12 col-md-6">
                                                    <LoaderHandler
                                                        loading={
                                                            loadingAllTables
                                                        }
                                                        error={errorAllTables}
                                                       /* render={
                                                            renderTablesSelect
                                                        }*/
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <LoaderHandler
                                                        loading={
                                                            loadingAllClients
                                                        }
                                                        error={errorAllClients}
                                                       /* render={
                                                            renderClientsSelect
                                                        }*/
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                {/*renderDeliveryCheckbox()*/}
                                            </div>
                                            {renderNoteTextName()}
                                            {renderNoteTextarea()}
                                        </div>
                                    </div>
                                    {renderSubmitButton()}
                                </div>
                                {/* /.card-body */}
                            </div>
                        </div>
                        {/* /.col */}
                    </div>
                    {/* /.row */}
                </div>
                {/* /.container-fluid */}
            </section>
        </>
    );
};

export default OrderEditScreen;
