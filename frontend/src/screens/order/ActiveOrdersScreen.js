import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DataTableLoader from "../../components/loader/DataTableLoader";
import Pagination from "../../components/Pagination";
import axios from "axios";



/* components */
import LoaderHandler from "../../components/loader/LoaderHandler";
import HeaderContent from "../../components/HeaderContent";
import Table from "../../components/Table";
import {
    OccupiedTableLoader,
    FreeTableLoader,
} from "../../components/loader/SkeletonLoaders";

/* actions */
import { listOrderDetails, listOrders } from "../../actions/orderActions";


const ActiveOrdersScreen = ({ history }) => {
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [products, setProducts] = useState(null);

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders, page, pages } = orderList;

    useEffect(() => {


            const headers = {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjI4MDA2MTU5LCJleHAiOjE2MzA1OTgxNTl9.LOHf9jPyvudVeqRLvSZzDcXj58Yd4WQQGKSuW0Lc7Aw',
            };
            
             axios.get('http://localhost:5000/api/orders/14', { headers })
            .then(response => setProducts(response.data)).catch(err => console.log(err));

    }, []);



    function renderTable() {
        let cliente = ''
        let pedido = ''
        let observaciones = ''




        return (
            <table className="table table-hover text-nowrap">
            <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Pedido</th>
                    <th>Observaciones</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {orders.filter(ord => !ord.isPaid).map((order) => (
                    <tr key={order.id}>
                        <td>{order.name}</td>

                        <td>{}</td>

                        <td>{order.note}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        )
    }

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
            <HeaderContent name={'Pedidos'} />

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
