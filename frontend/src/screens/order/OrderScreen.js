import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReconnectingEventSource from "reconnecting-eventsource";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import DataTableLoader from "../../components/loader/DataTableLoader";
import Search from "../../components/Search";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Pagination from "../../components/Pagination";
import axios from "axios";



import {
    listOrderDetails,
    updateOrderToPaid,
} from "../../actions/orderActions";

/* Actions */
import { listOrders } from "../../actions/orderActions";

const OrderScreen = ({ history }) => {
    const [keyword, setKeyword] = useState("");

    const dispatch = useDispatch();
    const [ listening, setListening ] = useState(false);
    const BACKEND_IP='192.168.0.119'

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const orderList = useSelector((state) => state.orderList);
    let { loading, error, orders, page, pages } = orderList;
    const [ords, setOrds] = useState(orders);

    const headers = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjI4MDA2MTU5LCJleHAiOjE2MzA1OTgxNTl9.LOHf9jPyvudVeqRLvSZzDcXj58Yd4WQQGKSuW0Lc7Aw',
      };

    useEffect(() => {

        if (true) {
            const events = new ReconnectingEventSource('http://'+BACKEND_IP+':5000/events');
                events.onmessage = (event) => {

                    //sleep(800).then(() => {
                        console.log("wantit: "+event)
                        dispatch(listOrders("", 1));
                   // })
                };
            
            console.log("heree")
            let paid = orders.filter(ord => !ord.isPaid)
            console.log("evento: "+paid.length); 

            //if(paid.length!== 0 && paid.length%4==0) window.location.reload(false);
                    

            //setListening(true);
          }
          


    }, [dispatch, history, userInfo, keyword
    ]);

    const renderCreateButton = () => (
        <Link to="/order/create">
            <button className="btn btn-success btn-lg">
                <i className="fas fa-edit" /> Nuevo Pedido
            </button>
        </Link>
    );



    async function deleteDelivery (ids)  {
      // e.preventDefault();
       console.log("resB: "+orders.length )

        const updatedOrder = {
            id: ids,
        };
        
        dispatch(updateOrderToPaid(updatedOrder));
        let filtered = ords.filter((item) => item.id !== ids)
        setOrds(filtered)
        
        //Hacer un reset y luego un filter remove
    }

    const renderTable = () => (
        <table className="table table-hover text-nowrap">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Precio</th>
                    <th>Observaciones</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {orders.filter(ord => !ord.isPaid).map((order) => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.name}</td>

                        <td className="d-none d-sm-table-cell h4">
                            <span className={"badge bg-success"}>
                                ${order.total}
                            </span>
                        </td>
                        <td>{order.note}</td>
                        <td>
                            <Link
                                to={`/order/${order.id}/view`}
                                className="btn btn-info btn-lg"
                            >
                                Ver
                            </Link>
                        </td>

                        <td>
                        <Link to="/order">
                            <button className="btn btn-success btn-lg"
                            onClick ={() => deleteDelivery(order.id)}>
                                
                                <i className="fas fa-edit" /> Entregado
                            </button>
                        </Link>
                        </td>

                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderOrders = () => (
        <>
            <div className="card ">
                <div className="card-header">
                    <h3 className="card-title">Lista de Pedidos</h3>
                    <div className="card-tools">
                        <Search
                            keyword={keyword}
                            setKeyword={setKeyword}
                        />
                    </div>
                </div>
                {/* /.card-header */}
                <div className="card-body table-responsive p-0">
                    <LoaderHandler
                        loading={loading}
                        error={error}
                        loader={DataTableLoader()}
                        render={renderTable}
                    />
                </div>
                {/* /.card-body */}
            </div>

        </>
    );

    return (
        <>
            <HeaderContent name={"Pedidos"} />

            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            {renderCreateButton()}
                            <hr />
                            {renderOrders()}
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

export default OrderScreen;
