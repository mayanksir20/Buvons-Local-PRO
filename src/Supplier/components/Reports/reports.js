import React, { useEffect, useState } from "react";
import Sidebar from "../../../CommonComponents/Sidebar/sidebar";
import Header from "../../../CommonComponents/Header/header";
import { Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import generateReportImage from "../../assets/images/generate-report-icon.svg";
import ProductLists from "./Partials/ProductLists";
import InventoryLists from "./Partials/InventoryLists";
import SalesLists from "./Partials/SalesLists";
import InvoiceLists from "./Partials/InvoiceLists";
import CustomMade from "./Partials/CustomMade";
import SuperInvoice from "./Partials/SuperInvoice";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
//const token = localStorage.getItem("supplier_accessToken");

const Reports = () => {
  const token = localStorage.getItem("supplier_accessToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      permission: "reports-view",
    },
  };

  const [showModal2, setShowModal2] = useState(false);

  return (
    <>
      <div className="container-fluid page-wrap product-manage">
        <div className="row height-inherit">
          <Sidebar userType={"supplier"} />

          <div className="col main p-0">
            <Header title="Reports" />
            <div className="container-fluid page-content-box px-3 px-sm-4">
              <div className="row">
                <div className="col">
                  <div className="card">
                    <div className="card-body centere-align">
                      <div className="row">
                      <Breadcrumb>
                        <Breadcrumb.Item href="#">Products</Breadcrumb.Item>
                      </Breadcrumb>
                        <div className="col-2">
                          <ProductLists
                            img={generateReportImage}
                            token={token}
                          />
                        </div>
                        <div className="col-2">
          <InventoryLists
          img={generateReportImage}
          token={token}
        />
                        </div>
                        <div className="col-2">
          <CustomMade
          img={generateReportImage}
          token={token}
        />
                        </div>
                      </div>
                      <br />
                      <div className="row">
                      <Breadcrumb>
                        <Breadcrumb.Item href="#">Sales</Breadcrumb.Item>
                      </Breadcrumb>
                        <div className="col-2">
                          <SalesLists
                            img={generateReportImage}
                            token={token}
                          />
                        </div>
                        <div className="col-2">
                    <InvoiceLists
                    img={generateReportImage}
                    token={token}
                    />
                        </div>
                        <div className="col-2">
                    <SuperInvoice
                    img={generateReportImage}
                    token={token}
                    />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
