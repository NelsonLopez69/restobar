import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import ButtonGoBack from "../../components/ButtonGoBack";
import ViewBox from "../../components/ViewBox";
import LoaderHandler from "../../components/loader/LoaderHandler";
import ModalButton from "../../components/ModalButton";
import { BigSpin } from "../../components/loader/SvgLoaders";

/* constants */
import { ORDER_UPDATE_RESET } from "../../constants/orderConstants";

/* actions */
import {
    listOrderDetails,
    updateOrderToPaid,
} from "../../actions/orderActions";

/* Styles */
import { modalStyles } from "../../utils/styles";

const OrderViewScreen = ({ history, match }) => {
    const orderId = parseInt(match.params.id);

    const dispatch = useDispatch();

    const [modal, setModal] = useState(false);

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

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: ORDER_UPDATE_RESET });
            if (order.delivery) {
                history.push("/delivery");
            } else {
                history.push("/order");
            }
        }
        if (order) {
            if (!order.id || order.id !== orderId) {
                dispatch(listOrderDetails(orderId));
            }
        }
    }, [dispatch, history, order, orderId, successUpdate]);

    const renderModalPay = () => (
        <Modal
            style={modalStyles}
            isOpen={modal}
            onRequestClose={() => setModal(false)}
        >
            <h2 className="text-center">Eliminar Pedido</h2>
            <p className="text-center">¿Desea eliminar el pedido?.</p>
            <form onSubmit={handlePay}>
                <button type="submit" className="btn btn-primary">
                    Si
                </button>

                <ModalButton
                    modal={modal}
                    setModal={setModal}
                    classes={"btn-danger float-right"}
                />
            </form>
        </Modal>
    );

    const handlePay = async (e) => {
        e.preventDefault();
        const updatedOrder = {
            id: orderId,
        };
        setModal(false);
        dispatch(updateOrderToPaid(updatedOrder));
    };

    const handleEdit = (e) => {
        e.preventDefault();
        history.push(`/order/${orderId}/edit`);
    };

    //get all order items
    const totalItems = (productsIn) => {
        return productsIn.reduce(
            (acc, item) => acc + item.OrderProduct.quantity,
            0
        );
    };

    const renderCartInfo = () =>
        order &&
        order.products && (
            <div className="small-box bg-info">
                <div className="inner">
                    <h3>TOTAL ${order.total}</h3>
                    <p>
                        {order.products.length > 0
                            ? totalItems(order.products)
                            : 0}{" "}
                        Productos
                    </p>
                </div>
                <div className="icon">
                    <i className="fas fa-shopping-cart" />
                </div>
            </div>
        );

    const renderOrderProducts = () => (
        <table
            id="orderTable"
            className="table table-bordered table-hover table-striped text-center table-overflow"
        >
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {order &&
                    order.products &&
                    order.products.length > 0 &&
                    order.products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td className="text-center h4">
                                <span className="badge bg-primary">
                                    {product.OrderProduct.quantity}
                                </span>
                            </td>
                            <td className="text-center h4">
                                <span className="badge bg-info">
                                    ${product.price}
                                </span>
                            </td>
                            <td className="text-center h4">
                                <span className={"badge bg-success"}>
                                    $
                                    {product.price *
                                        product.OrderProduct.quantity}{" "}
                                </span>
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>
    );

    const renderOrderInfo = () =>
        order && (
            <>
                <div className="row">
                    <div className="col-12 col-md-6">
                        {order.client && (
                            <ViewBox
                                title={order.client.name}
                                paragraph={`ID: ${order.client.id}`}
                                icon={"fas fa-user"}
                                color={"bg-info"}
                            />
                        )}
                    </div>

                </div>

                <div className="col-12">
                    <ViewBox
                        title={"Observaciones:"}
                        paragraph={order.note}
                        icon={"far fa-sticky-note"}
                        color={"bg-silver"}
                    />
                </div>
            </>
        );

    const renderOrderEdit = () => (
        <div className="card">
            <div className="card-header bg-warning">Editar Pedido</div>
            <div className="card-body">
                <button className="btn btn-block" onClick={handleEdit}>
                    <ViewBox
                        title={`Editar`}
                        paragraph={`Click para editar`}
                        icon={"fas fa-edit"}
                        color={"bg-warning"}
                    />
                </button>
            </div>
        </div>
    );

    const renderOrderPay = () => (
        <div className="card">
            <div className="card-header bg-success">¿Pedido Entregado?</div>
            <div className="card-body">
                <button
                    className="btn btn-block"
                    onClick={() => setModal(true)}
                >
                    <ViewBox
                        title={`Eliminar`}
                        paragraph={`Click para eliminar`}
                        icon={"fas fa-hand-holding-usd"}
                        color={"bg-success"}
                    />
                </button>
            </div>
        </div>
    );

    const renderInfo = () => (
        <>
            <div className="col-12 col-md-6">
                {renderCartInfo()}
                {renderOrderProducts()}
            </div>

            <div className="col-12 col-md-6">{renderOrderInfo()}</div>
        </>
    );

    const renderOrderButton = () => (
        <div className="col-12 col-md-3">
            {order && !order.isPaid && renderOrderEdit()}
        </div>
    );

    const renderPayButton = () => (
        <div className="col-12 col-md-3">
            {order && !order.isPaid && renderOrderPay()}
        </div>
    );

    return (
        <>
            {/* Content Header (Page header) */}
            <HeaderContent name={"Pedidos"} />
            <LoaderHandler loading={loadingUpdate} error={errorUpdate} />
            {/* Main content */}
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        {renderModalPay()}
                        <div className="col-12">
                            <ButtonGoBack history={history} />

                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Detalles del Pedido</h3>
                                </div>
                                {/* /.card-header */}
                                <div className="card-body">
                                    <div className="row d-flex justify-content-center">
                                        <LoaderHandler
                                            loading={loading}
                                            error={error}
                                            render={renderInfo}
                                            loader={<BigSpin />}
                                        />
                                    </div>
                                </div>
                                {/* /.card-body */}
                            </div>
                        </div>
                        {/* /.col */}
                    </div>
                    {/* /.row */}
                    <div className="row d-flex justify-content-between">
                        <LoaderHandler
                            loading={loading}
                            error={error}
                            render={renderOrderButton}
                            loader={<BigSpin />}
                        />
                        <LoaderHandler
                            loading={loading}
                            error={error}
                            render={renderPayButton}
                            loader={<BigSpin />}
                        />
                    </div>
                </div>
                {/* /.container-fluid */}
            </section>
        </>
    );
};

export default OrderViewScreen;
