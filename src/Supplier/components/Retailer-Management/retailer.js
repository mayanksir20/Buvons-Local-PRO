import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import {
  TablePagination,
  tablePaginationClasses as classes,
} from "@mui/base/TablePagination";
import filter from "../../assets/images/filter-icon.png";
import Sidebar from "../../../CommonComponents/Sidebar/sidebar";
import Header from "../../../CommonComponents/Header/header";
import "../../assets/scss/dashboard.scss";
import useAuthInterceptor from "../../../utils/apis";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingOverlay from "react-loading-overlay";

toast.configure();

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

const SupplierRetailerDetail = () => {
  // const token = localStorage.getItem("admin_accessToken");
  const token = localStorage.getItem("supplier_accessToken")
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [retailerList, setRetailerList] = useState("");
  const [retailerFilter, setRetailerFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRetailer, setSelectedRetailer] = useState("");
  const [updateList, setUpdateList] = useState(false);
  const [search, setSearch] = useState("");
  const [hideFilter, setHideFilter] = useState("");
  const [loading, setLoading] = useState(true)
  const apis = useAuthInterceptor();
  const updateSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleEditRetailer = (targetId) => {
    navigate(`/retailer-management/edit-retailer/${targetId}`);
  };

  const handleViewRetailer = (targetId) => {
    navigate(`/supplier/retailer-management/retailer-details/${targetId}`);
  };

  const handleFilterChange = (e) => {
    setSelectedRetailer(e.target.value);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleResetFilter = () => {
    setSelectedRetailer("");
    setUpdateList(!updateList);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        permission: "retailer-view",
      },
    };

    let paramObj = {};

    if (search !== "") {
      paramObj["search"] = search;
    }

    if (selectedRetailer !== "") {
      paramObj["filter_user_id"] = selectedRetailer;
    }

    config["params"] = paramObj;

    apis
      .get("/supplier/retailerList", config)
      .then((res) => {
        setLoading(false)
        if (res.data.success === true) {
          setRetailerList(res.data.data);
          setHideFilter("");
        } else {
          toast.error("Something went wrong. Please try again later.", {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      })
      .catch((error) => {
        setLoading(false)
        if(error.message !== "revoke"){
          toast.error("Something went wrong. Please try again later.", {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      });
  }, [search, updateList]);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        permission: "retailer-view",
      },
    };

    apis
      .get("/retailerFilterList", config)
      .then((res) => {
        if (res.data.success === true) {
          const list = res.data.data;
          list.sort((a, b) => {
            let firstNameA = a.first_name;
            let firstNameB = b.first_name;
            if (a.first_name === null) {
              firstNameA = "";
            }
            if (b.first_name === null) {
              firstNameB = "";
            }

            return firstNameA.localeCompare(firstNameB);
          });
          setRetailerFilter(list);
          setHideFilter("");
        } else {
          toast.error("Something went wrong. Please try again later.", {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      })
      .catch((error) => {
        if(error.message !== "revoke"){
          toast.error("Something went wrong. Please try again later.", {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      });
  }, []);

  let data;
  if (rowsPerPage > 0) {
    data = retailerList.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  } else {
    data = retailerList;
  }
  return (
    <div class="container-fluid page-wrap product-manage">
      <div class="row height-inherit">
        <Sidebar
          showSidebar={showSidebar}
          updateSidebar={updateSidebar}
          userType={"supplier"}
        />

        <div class="col main p-0">
          <Header title="Retailer Management" updateSidebar={updateSidebar} />
          <LoadingOverlay
            active={loading}
            spinner
            styles={{
            overlay: (base) => ({
                ...base,
                background: '#fefefe',
                width: '100%',
                '& svg circle': {
                stroke: 'black'
                }
            })
            }}
          >
            <div class="container-fluid page-content-box px-3 px-sm-4">
            <div class="row">
              <div class="col">
                <div className="card user-card height-100">
                  <div className="card-body p-0">
                    <div className="row">
                      <div className="col">
                        <div className="card-top-filter-box p-3">
                          <div className="search-table">
                            <div className="form-group">
                              <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearch(e)}
                                className="search-input"
                                placeholder="Search by Retailer Name..."
                              ></input>
                            </div>
                          </div>

                          <div class="dropdown right-filter">
                            {/* <button
                              type="button"
                              onClick={() =>
                                navigate("/retailer-management/add-retailer")
                              }
                              className="btn btn-purple"
                            >
                              + Add Retailer
                            </button> */}
                            <button
                              type="button"
                              className={`btn dropdown-toggle ${hideFilter}`}
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              onClick={() => setHideFilter("show")}
                              data-bs-auto-close="outside"
                            >
                              <img src={filter} alt="" /> Filter
                            </button>
                            <form
                              className={`dropdown-menu p-3 ${hideFilter}`}
                              data-popper-placement="bottom-end"
                              style={{
                                position: "absolute",
                                inset: "0px 0px auto auto",
                                margin: "0px",
                                transform: "translate(0px, 42px)",
                              }}
                            >
                              <div class="mb-3">
                                <label class="form-label">Retailer Name</label>
                                <select
                                  className="form-select"
                                  value={selectedRetailer}
                                  onChange={(e) => handleFilterChange(e)}
                                >
                                  <option value="">Choose Retailer</option>
                                  {retailerFilter &&
                                    retailerFilter.map((ele) => {
                                      return (
                                        <option key={ele.id} value={ele.id}>
                                          {ele.first_name + " " + ele.last_name}
                                        </option>
                                      );
                                    })}
                                </select>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">Route Name</label>
                                <select className="form-select">
                                  <option selected disabled>
                                    Choose Route
                                  </option>
                                </select>
                              </div>

                              <div className="d-flex justify-content-end">
                                <button
                                  type="button"
                                  class="btn btn-purple width-auto me-2"
                                  onClick={() => setUpdateList(!updateList)}
                                >
                                  Apply
                                </button>
                                <button
                                  type="button"
                                  class="btn btn-outline-black width-auto"
                                  onClick={() => handleResetFilter()}
                                >
                                  Reset
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="table-responsive">
                          <table className="table table-striped m-0">
                            <thead>
                              <tr>
                                <th>Retailer Name</th>
                                <th>Routes</th>
                                <th>Address</th>
                                <th>CSP</th>
                                <th>CAD</th>
                                <th className="tableActionBox"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {data && data.length > 0 ? (
                                data.map((ele) => {
                                  return (
                                    <tr key={ele.id}>
                                      <td>
                                        {ele.user_profile ? ele.user_profile.business_name && ele.user_profile.business_name !== "" ? ele.user_profile.business_name : "N/A" : "N/A"}
                                      </td>
                                      <td>
                                        {ele.user_profile &&
                                        ele.user_profile.company_name
                                          ? ele.user_profile.company_name
                                          : "N/A"}
                                      </td>
                                      <td>
                                        {ele.user_main_address
                                          ? ele.user_main_address.address_1
                                          : "N/A"}
                                      </td>
                                      <td>
                                        {ele.user_profile ? (
                                          ele.user_profile.opc_status ===
                                          "1" ? (
                                            <FontAwesomeIcon
                                              icon="fa-solid fa-check"
                                              size="2xl"
                                              color="green"
                                            />
                                          ) : (
                                            <FontAwesomeIcon
                                            icon="fa-solid fa-xmark"
                                            size="2xl"
                                            color="red"
                                          />
                                          )
                                        ) : (
                                          <FontAwesomeIcon
                                            icon="fa-solid fa-xmark"
                                            size="2xl"
                                            color="red"
                                          />
                                        )}
                                      </td>
                                      <td>
                                        {ele.user_profile ? (
                                          ele.user_profile.home_consumption ===
                                          "1" ? (
                                            <FontAwesomeIcon
                                              icon="fa-solid fa-check"
                                              size="2xl"
                                              color="green"
                                            />
                                          ) : (
                                            <FontAwesomeIcon
                                            icon="fa-solid fa-xmark"
                                            size="2xl"
                                            color="red"
                                          />
                                          )
                                        ) : (
                                          <FontAwesomeIcon
                                            icon="fa-solid fa-xmark"
                                            size="2xl"
                                            color="red"
                                          />
                                        )}
                                      </td>
                                      <td>
                                        <div className="btn-group dropstart table-action">
                                          <button
                                            type="button"
                                            className="dropdown-toggle"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                          >
                                            <span></span>
                                          </button>
                                          <ul className="dropdown-menu">
                                            <li>
                                              <p
                                                onClick={() =>
                                                  handleViewRetailer(ele.id)
                                                }
                                                className="dropdown-item"
                                              >
                                                View
                                              </p>
                                              {/* <p
                                                className="dropdown-item"
                                                onClick={() =>
                                                  handleEditRetailer(ele.id)
                                                }
                                              >
                                                Edit
                                              </p> */}
                                            </li>
                                          </ul>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td>No data show.</td>
                                </tr>
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
                                    colSpan={6}
                                    count={retailerList.length}
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
    </div>
  );
};

export default SupplierRetailerDetail;
