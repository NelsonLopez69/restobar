import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DataTableLoader from "../../components/loader/DataTableLoader";
import Pagination from "../../components/Pagination";
import axios from "axios";
import ReconnectingEventSource from "reconnecting-eventsource";
import {
    listOrderDetails,
    updateOrderToPaid,
    listOrders, deleteOrder, updateOrder
} from "../../actions/orderActions";




/* components */
import LoaderHandler from "../../components/loader/LoaderHandler";
import HeaderContent from "../../components/HeaderContent";
import Table from "../../components/Table";
import {
    OccupiedTableLoader,
    FreeTableLoader,
} from "../../components/loader/SkeletonLoaders";

/* actions */

    const BACKEND_IP='192.168.0.119'


const ActiveOrdersScreen = ({ history }) => {
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [products, setProducts] = useState(null);

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders, page, pages } = orderList;
    const [ords, setOrds] = useState(orders);


    useEffect(() => {

        if (true) {
            const events = new ReconnectingEventSource('http://'+BACKEND_IP+':5000/events');
                events.onmessage = (event) => {

                    //sleep(800).then(() => {
                        console.log("wantit: "+event)
                        dispatch(listOrders("", 1));
                   // })
                };
        

            //if(paid.length!== 0 && paid.length%4==0) window.location.reload(false);
                    

            //setListening(true);
          }
          


    }, [dispatch, history, userInfo, keyword
    ]);

    async function deleteDelivery (ids)  {
        // e.preventDefault();
         console.log("resB: "+orders.length )
  
          const updatedOrder = {
              id: ids,
          };
          
          dispatch(deleteOrder(ids));
          let filtered = ords.filter((item) => item.id !== ids)
          setOrds(filtered)
          
          //Hacer un reset y luego un filter remove
      }


    async function unpayOrder (order)  {
        // e.preventDefault();
        console.log('maname1: '+order.isPaid)

            order.isPaid = false;
          
          dispatch(updateOrder(order));
        let filtered = ords.filter((item) => item.id !== order.id
        )
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
                {orders.reverse().filter(ord => ord.isPaid).map((order) => (
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
                            <Link 
                                    to={"/active"}
                                    className="btn btn-info btn-lg"
                                    onClick ={() => deleteDelivery(order.id)}
                                    style={{ backgroundColor: '#cc0000'}}
                                    
                                    > Eliminar
                            </Link>
                        </td>

                        <td>
                            <Link 
                                
                                to="/active"
                                className="btn btn-info btn-lg"

                                onClick ={() => unpayOrder(order)}
                                style={{ backgroundColor: '#ffc000',
                                         color: "black"}}
                                >
                                    
                                 Devolver
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    function getProducts (orderId) {
        const headers = {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjI4MDA2MTU5LCJleHAiOjE2MzA1OTgxNTl9.LOHf9jPyvudVeqRLvSZzDcXj58Yd4WQQGKSuW0Lc7Aw',
        };
        
        return axios.get('http://localhost:5000/api/orders/'+orderId, { headers })
        .then(response => response.data.toString);
    }



    const renderOrders = () => (
        <>
            <div className="card ">
                <div className="card-header">
                    <h3 className="card-title">Lista de Pedidos</h3>
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

            <Pagination page={page} pages={pages} setPage={setPageNumber} />
        </>
    );


    return (
        <>
            <HeaderContent name={'Historial de Pedidos'} />

            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
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

export default ActiveOrdersScreen;
