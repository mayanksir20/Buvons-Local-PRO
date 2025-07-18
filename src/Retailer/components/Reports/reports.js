import React, { useEffect, useState } from "react";
import calendar from "../../assets/images/calender.png";
import filter from "../../assets/images/filter-icon.png";
import downloadIocn from "../../assets/images/volit-download.png";
import Sidebar from "../Sidebar/sidebar";
import Header from "../Header/header";
import "../../assets/scss/dashboard.scss";
import { Link, useNavigate } from "react-router-dom";
import useAuthInterceptor from "../../../utils/apis";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const RetailerReports = () => {
  const apis = useAuthInterceptor();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const token = localStorage.getItem("distributor_accessToken");
  const [showSidebar, setShowSidebar] = useState(false);
  const [orders, setOrders] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingShipmentCheck, setExistingShipemtCheck] = useState(false);
  const [shipmentId, setShipmentId] = useState();
  const [route, setRoute] = useState();
  const [routeList, setRouteList] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState();
  const [newShipmentCheck, setNewShipmentCheck] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [show, setShow] = useState(false);
  const [shipmentIdError, setShipmentIdError] = useState("");
  const [deliveryDateError, setDeliveryDateError] = useState("");
  const [routeError, setRouteError] = useState("");
  const [existingShipmentError, setExistingShipemtError] = useState("");
  const [linkedSuppliers, setLinkedSuppliers] = useState({});
  const updateSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        permission: "order-view",
      },
    };
    apis
      .get(`distributor/orderListing`, config)
      .then((res) => {
        setLoading(false);
        setOrders(res.data.data);
      })
      .catch((err) => {
        if(err.message !== "revoke"){
        setLoading(false);
        toast.error(t("error_message.something_went_wrong"), {
          autoClose: 3000,
          position: toast.POSITION.TOP_CENTER,
        });
      }
      });
    const config1 = {
      headers: {
        Authorization: `Bearer ${token}`,
        permission: "shipment-view",
      },
    };
    apis
      .get(`distributor/getExistingShipments`, config1)
      .then((res) => {
        setLoading(false);
        setShipments(res.data.data);
      })
      .catch((err) => {
        if(err.message !== "revoke"){
        setLoading(false);
        toast.error(t("error_message.something_went_wrong"), {
          autoClose: 3000,
          position: toast.POSITION.TOP_CENTER,
        });
      }
      });
  }, [token]);
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        permission: "supplier-view",
      },
    };

    apis
      .get(`distributor/getLinkedSuppliers`, config)
      .then((res) => {
        if (res.data.success === true) {
          setLinkedSuppliers(res.data.data);
        } else {
          toast.error(res.data.data.message, {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        // if (err.response.data.data.error) {
        //     toast.error(err.response.data.data.error, {
        //         autoClose: 3000,
        //         position: toast.POSITION.TOP_CENTER,
        //     });
        // }
        // toast.error(err.response.data.message, {
        //     autoClose: 3000,
        //     position: toast.POSITION.TOP_CENTER,
        // });
        // toast.error(err.response.data.message, {
        //     autoClose: 3000,
        //     position: toast.POSITION.TOP_CENTER,
        // });
      });
  }, [token]);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        permission: "routes-view",
      },
    };

    apis
      .get(`distributor/routes`, config)
      .then((res) => {
        if (res.data.success === true) {
          setRouteList(res.data.data);
        } else {
          toast.error(res.data.data.message, {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        if(err.message !== "revoke"){
        toast.error(err.response.data.message, {
          autoClose: 3000,
          position: toast.POSITION.TOP_CENTER,
        });
      }
      });
  }, [token]);
  const handleDeliveryDate = (e) => {
    setDeliveryDateError("");
    if (!e.target.value) {
      setDeliveryDate(null);
      e.target.value = "";
      console.log(e.target.value);
      return;
    }
    const selectedDate = new Date(e.target.value);
    const isoString = selectedDate.toISOString().split("T")[0];
    setDeliveryDate(isoString);
  };

  const handleSelectedOrder = (e) => {
    let updatedList = [...selectedOrder];
    if (e.target.checked && !updatedList.includes(e.target.value)) {
      console.log(e.target.value);
      updatedList.push(parseInt(e.target.value));
    } else {
      updatedList = updatedList.filter(
        (val) => val !== parseInt(e.target.value)
      );
    }
    setSelectedOrder(updatedList);
  };

  const assignToShipment = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        permission: "shipment-edit",
      },
    };

    let bodyData = {};
    let hasError = false;

    if (newShipmentCheck) {
      if (!route || route === 0) {
        setRouteError(
          t("distributor.order_management.listing.please_select_route")
        );
        hasError = true;
      }

      if (hasError) {
        return;
      }

      bodyData = {
        shipment_number: shipmentId,
        route_id: route,
        delivery_date: deliveryDate,
        order_ids: selectedOrder,
        shipment_type: "new",
      };
    } else {
      if (!shipmentId) {
        setExistingShipemtError(
          t("distributor.order_management.listing.please_select_shipment")
        );
        return;
      }

      bodyData = {
        shipment_id: shipmentId,
        order_ids: selectedOrder,
        shipment_type: "existing",
      };
    }

    apis
      .post("distributor/assignShipmentToOrder", bodyData, config)
      .then((res) => {
        if (res.data.success) {
          toast.success(
            t(
              "distributor.order_management.listing.order_listing_successfully"
            ),
            {
              autoClose: 3000,
              position: toast.POSITION.TOP_CENTER,
            }
          );
          setShow(false);
        } else {
          toast.error(t("error_message.something_went_wrong"), {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      })
      .catch((err) => {
        if(err.message !== "revoke"){
        toast.error(t("error_message.something_went_wrong"), {
          autoClose: 3000,
          position: toast.POSITION.TOP_CENTER,
        });
      }
      });
  };

  const handleCancel = () => {
    setShow(false);
    setDeliveryDate();
    setExistingShipemtCheck(false);
    setNewShipmentCheck(false);
    setShipmentId("");
    setRoute("");
  };
  const handleExistingShipmentCheck = (e) => {
    setExistingShipemtCheck(e.target.checked);
    setNewShipmentCheck(false);
    setShipmentId();
    setRoute();
    setDeliveryDate();
  };
  const handleNewShipmentCheck = (e) => {
    setExistingShipemtCheck(false);
    setNewShipmentCheck(e.target.checked);
    setShipmentId();
  };

  return (
    <div className="container-fluid page-wrap order-manage">
      <div className="row height-inherit">
        <Sidebar showSidebar={showSidebar} updateSidebar={updateSidebar} />

        <div className="col main p-0">
          <Header
            title={t("distributor.order_management.listing.title")}
            updateSidebar={updateSidebar}
          />
          {loading ? (
            <div className="d-flex justify-content-center">
              <Oval color="purple" secondaryColor="purple" />
            </div>
          ) : (
            <div className="container-fluid page-content-box px-3 px-sm-4">
              <div className="row">
                <div className="col">
                  {/* [Card] */}
                  <div className="card user-card height-100">
                    <div className="card-body p-0">
                      <div className="row">
                        <div className="col">
                          <div className="card-top-filter-box p-3">
                            {/* [Table Search] */}
                            <div className="search-table">
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="search-input"
                                  placeholder={t(
                                    "distributor.order_management.listing.search_here"
                                  )}
                                ></input>
                              </div>
                            </div>
                            {/* [/Table Search] */}

                            {/* [Right Filter] */}
                            <div className="filter-row text-end">
                              {/* [Page Filter Box] */}
                              <div className="filter-box">
                                {/* Modal */}
                                <div class="dropdown right-filter">
                                  <button
                                    type="button"
                                    class="btn dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    data-bs-auto-close="outside"
                                  >
                                    <img src={filter} />{" "}
                                    {t(
                                      "distributor.inventory_management.listing.filter"
                                    )}
                                  </button>
                                  <form class="dropdown-menu p-3 ">
                                    <div class="mb-3">
                                      <label class="form-label">
                                        {t(
                                          "distributor.inventory_management.listing.format"
                                        )}
                                      </label>
                                      <select className="form-select">
                                        <option selected disabled>
                                          {t(
                                            "distributor.inventory_management.listing.select_format"
                                          )}
                                        </option>
                                        <option value="">Bottle</option>
                                        <option value="">Can</option>
                                        <option value="">Keg</option>
                                      </select>
                                    </div>
                                    <div class="mb-3">
                                      <label class="form-label">
                                        {t(
                                          "distributor.inventory_management.listing.producer"
                                        )}
                                      </label>
                                      <select className="form-select">
                                        <option selected disabled>
                                          {t(
                                            "distributor.inventory_management.listing.select_producer"
                                          )}
                                        </option>
                                      </select>
                                    </div>

                                    <div className="d-flex justify-content-end">
                                      <button
                                        type="submit"
                                        class="btn btn-purple width-auto me-2"
                                      >
                                        {t(
                                          "distributor.inventory_management.listing.apply"
                                        )}
                                      </button>
                                      <button
                                        type="reset"
                                        class="btn btn-outline-black width-auto"
                                      >
                                        {t(
                                          "distributor.inventory_management.listing.reset"
                                        )}
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </div>
                              {/* [/Page Filter Box] */}
                            </div>
                            {/* [/Right Filter] */}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <div className="table-responsive">
                            <table className="table table-striped m-0">
                              <thead>
                                <tr>
                                  <td>Report</td>
                                  <td>Status</td>
                                  <td style={{ width: "13%" }}>Info</td>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <Link
                                      to={""}
                                      className="fw-bold text-underline"
                                    >
                                      User Data Report
                                    </Link>
                                  </td>
                                  <td>
                                    <span className="badge text-bg-green">
                                      {" "}
                                      Approved
                                    </span>
                                  </td>
                                  <td>
                                    <Link
                                      to={""}
                                      download={""}
                                      className="text-purple fw-bold text-underline"
                                    >
                                      Download Invoice
                                      <img
                                        src={downloadIocn}
                                        alt="download"
                                        className="ms-2"
                                      />
                                    </Link>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <Link
                                      to={""}
                                      className="fw-bold text-underline"
                                    >
                                      User Data Report
                                    </Link>
                                  </td>
                                  <td>
                                    <span className="badge text-bg-green">
                                      {" "}
                                      Approved
                                    </span>
                                  </td>
                                  <td>
                                    <Link
                                      to={""}
                                      download={""}
                                      className="text-purple fw-bold text-underline"
                                    >
                                      Download Invoice
                                      <img
                                        src={downloadIocn}
                                        alt="download"
                                        className="ms-2"
                                      />
                                    </Link>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <Link
                                      to={""}
                                      className="fw-bold text-underline"
                                    >
                                      User Data Report
                                    </Link>
                                  </td>
                                  <td>
                                    <span className="badge text-bg-green">
                                      {" "}
                                      Approved
                                    </span>
                                  </td>
                                  <td>
                                    <Link
                                      to={""}
                                      download={""}
                                      className="text-purple fw-bold text-underline"
                                    >
                                      Download Invoice
                                      <img
                                        src={downloadIocn}
                                        alt="download"
                                        className="ms-2"
                                      />
                                    </Link>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <Link
                                      to={""}
                                      className="fw-bold text-underline"
                                    >
                                      User Data Report
                                    </Link>
                                  </td>
                                  <td>
                                    <span className="badge text-bg-red">
                                      {" "}
                                      Rejected
                                    </span>
                                  </td>
                                  <td>
                                    <Link
                                      to={""}
                                      download={""}
                                      className="text-purple fw-bold text-underline"
                                    >
                                      Download Invoice
                                      <img
                                        src={downloadIocn}
                                        alt="download"
                                        className="ms-2"
                                      />
                                    </Link>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <Link
                                      to={""}
                                      className="fw-bold text-underline"
                                    >
                                      User Data Report
                                    </Link>
                                  </td>
                                  <td>
                                    <span className="badge text-bg-orange ">
                                      {" "}
                                      Pending
                                    </span>
                                  </td>
                                  <td>
                                    <Link
                                      to={""}
                                      download={""}
                                      className="text-purple fw-bold text-underline"
                                    >
                                      Download Invoice
                                      <img
                                        src={downloadIocn}
                                        alt="download"
                                        className="ms-2"
                                      />
                                    </Link>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* [/Card] */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* [Modal] */}

      <Modal
        className="modal fade"
        show={show}
        centered
        onHide={() => {
          setShow(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {t("distributor.order_management.listing.assign_to_shipment")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="modal-body">
            <p>Assign 1 Order to shipment</p>
            <div className="routeInfo mb-3">Route 1:5 Orders</div>
            <div className="border-purple p-3">
              <div class="form-check">
                <input
                  value={newShipmentCheck}
                  onChange={(e) => handleNewShipmentCheck(e)}
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="radio1"
                />
                <label class="form-check-label" for="radio1">
                  {t("distributor.order_management.listing.new_shipment")}
                </label>
              </div>
              {newShipmentCheck && (
                <div className="border-purple py-2 px-3 ">
                  <div className="input-group">
                    <select
                      className="form-select rounded-pill"
                      value={route}
                      onChange={(e) => {
                        setRoute(e.target.value);
                        setRouteError("");
                      }}
                    >
                      <option value={0}>
                        {t("distributor.order_management.listing.choose_route")}
                      </option>
                      {routeList.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                    {routeError !== "" ? (
                      <p className="error-label">{routeError}</p>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="input-group mt-2">
                    <input
                      value={deliveryDate}
                      onChange={(e) => handleDeliveryDate(e)}
                      class="form-control rounded-5"
                      type="date"
                      name="daye"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="border-purple p-3 mt-3">
              <div class="form-check">
                <input
                  checked={existingShipmentCheck}
                  onClick={(e) => handleExistingShipmentCheck(e)}
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="radio2"
                />
                <label class="form-check-label" for="radio2">
                  {t("distributor.order_management.listing.existing_shipment")}
                </label>
              </div>
              {existingShipmentCheck && (
                <div className="mt-2">
                  <div className="input-group">
                    <select
                      className="form-select rounded-pill"
                      onChange={(e) => {
                        setShipmentId(e.target.value);
                        setExistingShipemtError("");
                      }}
                    >
                      <option selected disabled>
                        {t(
                          "distributor.order_management.listing.choose_shipment"
                        )}
                      </option>
                      {shipments.map((s) => (
                        <option value={s.id}>{s.id}</option>
                      ))}
                    </select>
                  </div>
                  {existingShipmentError !== "" ? (
                    <p className="error-label">{existingShipmentError}</p>
                  ) : (
                    <></>
                  )}
                  <div className="input-group mt-2">
                    <input
                      value={deliveryDate}
                      onChange={(e) => handleDeliveryDate(e)}
                      class="form-control rounded-5"
                      type="date"
                      name="daye"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            onClick={() => handleCancel()}
            class="btn btn-outline-black width-auto"
            data-bs-dismiss="modal"
          >
            {t("distributor.order_management.listing.cancel")}
          </button>
          &nbsp;&nbsp;
          <button
            type="button"
            onClick={() => assignToShipment()}
            class="btn btn-purple width-auto"
          >
            {t("distributor.order_management.listing.save")}
          </button>
        </Modal.Footer>
      </Modal>
      {/* [/Modal] */}
    </div>
  );
};

export default RetailerReports;
