import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import calendar from "../../assets/images/calender.png";
import filter from "../../assets/images/filter-icon.png";
import { Modal } from "react-bootstrap";
import {
  TablePagination,
  tablePaginationClasses as classes,
} from "@mui/base/TablePagination";
import { styled } from "@mui/system";
import DatePicker from "react-datepicker";
import moment from "moment";
import LoadingOverlay from "react-loading-overlay";
import Sidebar from "../../../CommonComponents/Sidebar/sidebar";
import Header from "../../../CommonComponents/Header/header";
import "../../assets/scss/dashboard.scss";
import { NavLink } from "react-router-dom";
import useAuthInterceptor from "../../../utils/apis";
import { toast } from "react-toastify";

import "react-datepicker/dist/react-datepicker.css";
import { hasPermission } from "../../../CommonComponents/commonMethods";
import { ORDER_EDIT, ORDER_VIEW } from "../../../Constants/constant";

const CustomTablePagination = styled(TablePagination)`
  & .${classes.toolbar} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }

  & .${classes.selectLabel} {
    margin: 0;
  }

  & .${classes.displayedRows} {
    margin: 0;

    @media (min-width: 768px) {
      margin-left: auto;
    }
  }

  & .${classes.spacer} {
    display: none;
  }

  & .${classes.actions} {
    display: flex;
    gap: 0.25rem;
  }
`;

const OrderManagement = () => {
  const apis = useAuthInterceptor();
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem("supplier_accessToken");
  const [orderList, setOrderList] = useState("");
  const [targetId, setTargetId] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusError, setStatusError] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [dateError, setDateError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOrderSelect = (e) => {
    if (e.target.checked) {
      setTargetId([...targetId, parseInt(e.target.value)]);
    } else {
      let dummy = targetId;
      dummy = dummy.filter(function (item) {
        return item !== parseInt(e.target.value);
      });
      setTargetId(dummy);
    }
  };

  const handleUpdateStatus = () => {
    let dateValid = true,
      statusValid = true;

    if (selectedStatus === "") {
      setStatusError("Status is required.");
      statusValid = false;
    }

    if (!startDate && selectedStatus === "1") {
      setDateError("Date is required.");
      dateValid = false;
    }

    if (!dateValid || !statusValid) {
      console.log("validation error");
    } else {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          permission: "order-edit",
        },
      };

      const bodyData = {
        order_id: targetId.toString(),
        action: selectedStatus,
      };

      if (selectedStatus === "1") {
        bodyData["expected_delivery_date"] =
          moment(startDate).format("YYYY-MM-DD");
      }
      setShow(false);
      apis
        .post("/supplier/order/status/update", bodyData, config)
        .then((res) => {
          if (res.data.success === true) {
            setTargetId([]);
            setUpdate(!update);
            toast.success("Status updated for selected orders.", {
              autoClose: 3000,
              position: toast.POSITION.TOP_CENTER,
            });
          } else {
            toast.error("Could not update status. Please try again later.", {
              autoClose: 3000,
              position: toast.POSITION.TOP_CENTER,
            });
          }
        })
        .catch((error) => {
          if (error.message !== "revoke") {
            toast.error("Could not update status. Please try again later.", {
              autoClose: 3000,
              position: toast.POSITION.TOP_CENTER,
            });
          }
        });
    }
  };

  useEffect(() => {
    if (hasPermission(ORDER_VIEW)) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          permission: `order-view`,
        },
      };

      apis
        .get("/supplier/orders", config)
        .then((res) => {
          setLoading(false);
          if (res.data.success === true) {
            setOrderList(res.data.data);
          } else {
            toast.error("Could not fetch order list. Please try again later.", {
              autoClose: 3000,
              position: toast.POSITION.TOP_CENTER,
            });
          }
        })
        .catch((error) => {
          setLoading(false);
          if (error.message !== "revoke") {
            toast.error("Could not fetch order list. Please try again later.", {
              autoClose: 3000,
              position: toast.POSITION.TOP_CENTER,
            });
          }
        });
    }
  }, [update]);

  let data;
  if (rowsPerPage > 0) {
    data = orderList.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  } else {
    data = orderList;
  }

  return (
    <div className="container-fluid page-wrap order-manage">
      <div className="row height-inherit">
        <Sidebar userType={"supplier"} />

        <div className="col main p-0">
          <Header title={t("supplier.order_management.list.title")} />
          <LoadingOverlay
            active={loading}
            spinner
            className="h-100"
            styles={{
              overlay: (base) => ({
                ...base,
                background: "#fefefe",
                width: "100%",
                "& svg circle": {
                  stroke: "black",
                },
              }),
            }}
          >
            <div className="container-fluid page-content-box px-3 px-sm-4">
              <div className="row mb-3">
                <div className="col">
                  <div className="filter-row page-top-filter">
                    {/* [Page Filter Box] */}
                    <div className="filter-box">
                      {/* [Date] */}
                      <div className="dropdown date-selector">
                        <button
                          className="btn btn-outline-black btn-sm dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <img src={calendar} alt="" />{" "}
                          {t("supplier.order_management.list.select_date")}
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">
                              Date
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              Date
                            </a>
                          </li>
                        </ul>
                      </div>
                      {/* [/Date] */}

                      {/* [Supplier] */}
                      <div className="dropdown date-selector">
                        <button
                          className="btn btn-outline-black btn-sm dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {t("supplier.order_management.list.supplier")}
                        </button>
                        <ul className="dropdown-menu py-0 overflow-hidden">
                          <li>
                            <a className="dropdown-item" href="#">
                              Supplier 1
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              Supplier 2
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/* [/Page Filter Box] */}

                    {/* Right Filter */}
                    <div class="dropdown right-filter">
                      <button
                        type="button"
                        class="btn dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        data-bs-auto-close="outside"
                      >
                        <img src={filter} />
                        {""}
                        {t("supplier.order_management.list.filter")}
                      </button>
                      <form class="dropdown-menu p-3 ">
                        <div class="mb-3">
                          <label class="form-label">Client</label>
                          <select className="form-select">
                            <option selected disabled>
                              {t(
                                "supplier.order_management.list.choose_client"
                              )}
                            </option>
                            <option value="">Client 1</option>
                            <option value="">Client 2</option>
                            <option value="">Client 3</option>
                          </select>
                        </div>
                        <div class="mb-3">
                          <label class="form-label">Routes</label>
                          <select className="form-select">
                            <option selected disabled>
                              {t(
                                "supplier.order_management.list.choose_routes"
                              )}
                            </option>
                            <option value="">Route 1</option>
                            <option value="">Route 2</option>
                            <option value="">Route 3</option>
                          </select>
                        </div>
                        <div class="mb-3">
                          <label class="form-label">
                            {t("supplier.order_management.list.issues")}{" "}
                          </label>
                          <select className="form-select">
                            <option selected disabled>
                              {t(
                                "supplier.order_management.list.choose_issues"
                              )}
                            </option>
                            <option value="">
                              {t(
                                "supplier.order_management.list.order_without_warning"
                              )}
                            </option>
                            <option value="">
                              {t(
                                "supplier.order_management.list.approval_is_overdue"
                              )}{" "}
                            </option>
                            <option value="">
                              {t(
                                "supplier.order_management.list.delivery_Delay"
                              )}{" "}
                            </option>
                            <option value="">
                              {t(
                                "supplier.order_management.list.not_invoiced_paid"
                              )}{" "}
                            </option>
                            <option value="">
                              {t(
                                "supplier.order_management.list.paymment_overdue"
                              )}
                            </option>
                            <option value="">
                              {t(
                                "supplier.order_management.list.need_attention"
                              )}{" "}
                            </option>
                          </select>
                        </div>
                        <div class="mb-3">
                          <label class="form-label">
                            {t("supplier.order_management.list.order_status")}
                          </label>
                          <select className="form-select">
                            <option selected disabled>
                              {t(
                                "supplier.order_management.list.choose_status"
                              )}
                            </option>
                            <option value="">
                              {t("supplier.order_management.list.approved")}{" "}
                            </option>
                            <option value="">
                              {t("supplier.order_management.list.cancelled")}{" "}
                            </option>
                            <option value="">
                              {t("supplier.order_management.list.delivered")}{" "}
                            </option>
                            <option value="">
                              {t("supplier.order_management.list.onhold")}{" "}
                            </option>
                            <option value="">
                              {t("supplier.order_management.list.pending")}{" "}
                            </option>
                            <option value="">
                              {t("supplier.order_management.list.shipped")}{" "}
                            </option>
                          </select>
                        </div>
                        <div class="mb-3">
                          <label class="form-label">
                            {t("supplier.order_management.list.distributor")}{" "}
                          </label>
                          <select className="form-select">
                            <option selected disabled>
                              {t(
                                "supplier.order_management.list.choose_distributor"
                              )}
                            </option>
                            <option value="">Distributor 1</option>
                            <option value="">Distributor 2</option>
                            <option value="">Distributor 3</option>
                          </select>
                        </div>
                        <div class="mb-3">
                          <div class="form-check form-check-inline">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="inlineCheckbox1"
                              value="Invoiced"
                            />
                            <label
                              class="form-check-label"
                              for="inlineCheckbox1"
                            >
                              {t("supplier.order_management.list.invoiced")}
                            </label>
                          </div>
                          <div class="form-check form-check-inline">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="inlineCheckbox2"
                              value="Expired"
                            />
                            <label
                              class="form-check-label"
                              for="inlineCheckbox2"
                            >
                              {t("supplier.order_management.list.expired")}
                            </label>
                          </div>
                          <div class="form-check form-check-inline">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="inlineCheckbox3"
                              value="Paid"
                            />
                            <label
                              class="form-check-label"
                              for="inlineCheckbox3"
                            >
                              {t("supplier.order_management.list.paid")}
                            </label>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end">
                          <button
                            type="submit"
                            class="btn btn-purple width-auto me-2"
                          >
                            {t("supplier.order_management.list.applied")}
                          </button>
                          <input
                            type="reset"
                            class="btn btn-outline-black width-auto"
                            value={t("supplier.order_management.list.clear")}
                          />
                        </div>
                      </form>
                    </div>
                    {/* Right Filter */}
                  </div>
                </div>
              </div>

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
                                ></input>
                              </div>
                            </div>
                            {/* [/Table Search] */}

                            {/* [Right Filter] */}
                            <div className="filter-row text-end">
                              {/* [Page Filter Box] */}
                              <div className="filter-box">
                                {/* <a href="#" className="btn btn-purple btn-sm" data-bs-toggle="modal" data-bs-target="#assignToShipment">Assign to Shipment</a> */}
                                {/* [Date] */}
                                <div className="dropdown date-selector">
                                  {/* <button className="btn btn-outline-black btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <img src={calendar} alt="" /> Delivery Date
                                                            </button>
                                                            <ul className="dropdown-menu">
                                                                <li><a className="dropdown-item" href="#">Date</a></li>
                                                                <li><a className="dropdown-item" href="#">Date</a></li>
                                                            </ul> */}
                                </div>
                                {/* [/Date] */}

                                {/* [Supplier] */}
                                <div className="dropdown date-selector">
                                  {/* <button className="btn btn-outline-black btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                Set Status
                                                            </button>
                                                            <ul className="dropdown-menu">
                                                                <li><a className="dropdown-item" href="#">Approved</a></li>
                                                                <li><a className="dropdown-item" href="#">Rejected</a></li>
                                                                <li><a className="dropdown-item" href="#">Pending</a></li>
                                                            </ul> */}
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-purple btn-sm"
                                  style={{
                                    display:
                                      targetId.length > 0 ? "block" : "none",
                                  }}
                                  onClick={() => setShow(true)}
                                >
                                  Change Status
                                </button>
                                {hasPermission(ORDER_EDIT) && (
                                  <NavLink
                                    to="/supplier/order-management/create-order"
                                    className="btn btn-purple btn-sm"
                                  >
                                    {t("supplier.order_management.list.new")}
                                  </NavLink>
                                )}
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
                                  <th></th>
                                  <th>
                                    {t(
                                      "supplier.order_management.list.table_col1"
                                    )}
                                  </th>
                                  <th>
                                    {t(
                                      "supplier.order_management.list.table_col2"
                                    )}
                                  </th>
                                  <th>
                                    {t(
                                      "supplier.order_management.list.table_col3"
                                    )}
                                  </th>
                                  <th>
                                    {t(
                                      "supplier.order_management.list.table_col4"
                                    )}
                                  </th>
                                  <th>
                                    {t(
                                      "supplier.order_management.list.table_col5"
                                    )}
                                  </th>
                                  <th>
                                    {t(
                                      "supplier.order_management.list.table_col6"
                                    )}
                                  </th>
                                  <th>
                                    {t(
                                      "supplier.order_management.list.table_col7"
                                    )}
                                  </th>
                                  <th>
                                    {t(
                                      "supplier.order_management.list.table_col8"
                                    )}
                                  </th>
                                  <th></th>
                                </tr>
                              </thead>
                              <tbody>
                                {data && data.length > 0 ? (
                                  data.map((ele) => {
                                    return (
                                      <tr key={ele.id}>
                                        <td className="text-center">
                                          <input
                                            type="checkbox"
                                            value={ele.id}
                                            checked={targetId.includes(ele.id)}
                                            key={ele.id}
                                            onChange={(e) =>
                                              handleOrderSelect(e)
                                            }
                                          />{" "}
                                        </td>
                                        <td>{ele.order_reference}</td>
                                        <td>{ele.order_date}</td>
                                        <td>
                                          {ele.retailer_information.user_profile ? ele.retailer_information.user_profile.business_name ? ele.retailer_information.user_profile.business_name : "N/A" : "N/A"}
                                        </td>
                                        <td>TBD</td>
                                        <td>
                                          {ele.status === "Approved" ? (
                                            <span className="badge text-bg-green">
                                              {ele.status}
                                            </span>
                                          ) : ele.status === "Pending" ||
                                            ele.status === "On Hold" ? (
                                            <span className="badge text-bg-orange">
                                              {ele.status}
                                            </span>
                                          ) : ele.status === "Cancelled" ? (
                                            <span className="badge text-bg-red">
                                              {ele.status}
                                            </span>
                                          ) : (
                                            "TBD"
                                          )}
                                        </td>
                                        <td>TBD</td>
                                        <td>TBD</td>
                                        <td>
                                          {ele.order_distributors[0] &&
                                          ele.order_distributors[0]
                                            .distributor_info.user_profile
                                            .company_name
                                            ? ele.order_distributors[0]
                                                .distributor_info.user_profile
                                                .company_name
                                            : "N/A"}
                                        </td>
                                        <td>
                                          <div class="btn-group dropstart table-action">
                                            <button
                                              type="button"
                                              class="dropdown-toggle"
                                              data-bs-toggle="dropdown"
                                              aria-expanded="false"
                                            >
                                              <span></span>
                                            </button>
                                            <ul class="dropdown-menu">
                                              <li>
                                                <NavLink
                                                  to={`/supplier/order-management/order-detail/${ele.id}`}
                                                  className="dropdown-item"
                                                >
                                                  View
                                                </NavLink>
                                              </li>
                                              {/* <li>
                                                                                            <a className="dropdown-item">Edit</a>
                                                                                        </li> */}
                                              <li className="seperator">
                                                <a className="dropdown-item">
                                                  Download
                                                </a>
                                              </li>
                                            </ul>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <>
                                    {t(
                                      "supplier.order_management.list.no_data_to_show"
                                    )}
                                  </>
                                )}
                              </tbody>
                              <tfoot>
                                <tr>
                                  {data.length > 0 ? (
                                    <CustomTablePagination
                                      rowsPerPageOptions={[
                                        5,
                                        10,
                                        15,
                                        { label: "All", value: -1 },
                                      ]}
                                      labelRowsPerPage={t(
                                        "admin.supplier_management.list.pagination_text"
                                      )}
                                      colSpan={10}
                                      count={orderList.length}
                                      rowsPerPage={rowsPerPage}
                                      page={page}
                                      size="small"
                                      slotProps={{
                                        select: {
                                          "aria-label": "rows per page",
                                        },
                                        actions: {
                                          showFirstButton: true,
                                          showLastButton: true,
                                        },
                                      }}
                                      onPageChange={handleChangePage}
                                      onRowsPerPageChange={
                                        handleChangeRowsPerPage
                                      }
                                      sx={{
                                        ".MuiTablePagination-toolbar button": {
                                          backgroundColor: "#623ead",
                                          borderColor: "#623ead",
                                          borderRadius: "25px",
                                          color: "#fefefe",
                                        },

                                        ".MuiTablePagination-toolbar span": {
                                          fontSize: "12px",
                                        },
                                      }}
                                    />
                                  ) : (
                                    <></>
                                  )}
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </LoadingOverlay>
        </div>
      </div>

      <Modal
        className="modal fade"
        show={show}
        centered
        onHide={() => {
          setShow(false);
        }}
      >
        <Modal.Header>
          <h5 class="modal-title text-purpal">Change Order Status</h5>
          <button
            type="button"
            class="btn-close text-purpal"
            aria-label="Close"
            onClick={() => setShow(false)}
          ></button>
        </Modal.Header>
        <Modal.Body>
          <p>{`Total number of selected orders : ${targetId.length}`}</p>
          <div className="border-purple p-3 rounded-2">
            <div>Select Status</div>
            <div className="mt-2">
              <div className="input-group">
                <select
                  className="form-select rounded-pill"
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setStatusError("");
                  }}
                >
                  <option value="">Select status</option>
                  <option value="1">Approved</option>
                  <option value="2">On-hold</option>
                  <option value="5">Cancelled</option>
                </select>
              </div>
              {statusError === "" ? (
                <></>
              ) : (
                <p className="error-label">{statusError}</p>
              )}
            </div>
          </div>
          <div
            className="border-purple p-3 mt-3 rounded-2"
            style={{ display: selectedStatus === "1" ? "block" : "none" }}
          >
            <div>Delivery Date</div>
            <div className="mt-2">
              <div className="input-group">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    setDateError("");
                  }}
                  minDate={new Date()}
                  dateFormat="yyyy/MM/dd"
                />
              </div>
              {dateError === "" ? (
                <></>
              ) : (
                <p className="error-label">{dateError}</p>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            class="btn btn-outline-purple"
            onClick={() => {
              setShow(false);
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-purple btn-md w-auto"
            onClick={() => handleUpdateStatus()}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderManagement;
