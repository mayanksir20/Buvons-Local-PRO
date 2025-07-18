import React, { useState } from "react";
import calendar from "../../assets/images/calender.png";
import totalUsers from "../../assets/images/total-users.png";
import graph from "../../assets/images/graph.png";
import Sidebar from "../../../CommonComponents/Sidebar/sidebar";
import Header from "../../../CommonComponents/Header/header";
// import '../../assets/css/dashboard.css'
import "../../assets/scss/dashboard.scss";
import { useTranslation } from "react-i18next";
import Chart from "react-google-charts";
import ReactDatePicker from "react-datepicker";
import { useEffect } from "react";
import useAuthInterceptor from "../../../utils/apis";
import { hasPermission } from "../../../CommonComponents/commonMethods";
import { SUPPLIER_VIEW } from "../../../Constants/constant";
import apis from "../../../utils/apis";
// tabcontent
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import en from "date-fns/locale/en-US"; // Import English localization
import fr from "date-fns/locale/fr";
registerLocale("en", en);
registerLocale("fr", fr);

setDefaultLocale('es');
export const data = [
  ["Orders", "Total per month"],
  ["Approved", 11],
  ["Pending", 2],
  ["Paid", 2],
];

const a = 10;
export const options = {
  // is3D: true,
  colors: ["#9370DB", "#27C26C", "#EFCC12"],
  with: "100%",
  height: "100%",
  chartArea: { left: "10%", top: "10%", width: "80%", height: "80%" },
  legend: { position: "none" },
};
// export const salesData = [
//   ["Element", "Sales", { role: "style" }],
//   ["Copper", 8.94, "#b87333"], // RGB value
//   ["Silver", 10.49, "silver"], // English color name
//   ["Gold", 19.3, "gold"],
//   ["Platinum", 21.45, "color: #e5e4e2"], // CSS-style declaration
// ];
export const comboData = [
  ["Month", "Approved", "Pending", "Paid"],
  ["2004/05", 165, 938, 522],
  ["2005/06", 135, 1120, 599],
  ["2006/07", 157, 1167, 587],
  ["2007/08", 139, 1110, 615],
  ["2008/09", 136, 691, 629],
];

export const comboOptions = {
  with: "100%",
  height: "100%",
  chartArea: { left: "10%", top: "10%", width: "80%", height: "80%" },
  vAxis: { title: "Value" },
  hAxis: { title: "Days" },
  seriesType: "bars",
  // series: { 5: { type: "line" } },
  legend: "none",
  vAxis: {
    format: "CA$#", // This will add "CA$" to the axis labels
  },
  series: {
    0: { color: "#9370DB" }, // Approved
    1: { color: "#27C26C" }, // Pending
    2: { color: "#EFCC12" }, // Paid

    3: { type: "line", color: "#FF6347" }, // Average (line series)
  },
};
const dateFormat = "MM/dd/yyyy";
const Dashboard = () => {
  const apis = useAuthInterceptor();
  const [key, setKey] = useState("Value"); 
  const { t, i18n } = useTranslation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [supplierList, setSupplierList] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState();
  const [selectedSupplierName, setSelectedSupplierName] = useState("");

  const token = localStorage.getItem("distributor_accessToken");

  const updateSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  // const handleChangeLanguage = (newLanguage) => {
  //   i18n.changeLanguage(newLanguage);

  //   // Set the default locale for react-datepicker based on the selected language
  //   if (newLanguage === "fr") {
  //     setDefaultLocale("fr");
  //   } else {
  //     setDefaultLocale("en-US");
  //   }
  // };
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        permission: "supplier-view",
      },
    };
    apis
      .get("distributor/getLinkedSuppliers", config)
      .then((res) => {
        console.log(res);
        setSupplierList(res.data.data);
      })
      .catch((err) => {
        // if(error.message !== "revoke"){
        console.log(err);
        // toast.error(err.response.data.message, {
        //     autoClose: 3000,
        //     position: toast.POSITION.TOP_CENTER,
        // });
        // }
      });
  }, [token]);
  return (
    <div class="container-fluid page-wrap dashboard">
      <div class="row height-inherit">
        <Sidebar userType={"distributor"} />

        <div class="col main p-0">
          <Header
            title={t("distributor.sidebar.dashboard")}
            updateSidebar={updateSidebar}
          />
          <div class="container-fluid page-content-box px-3 px-sm-4">
            <div class="row">
              <div class="col">
                <div class="tab-link-row position-relative">
                  {/* <ul class="nav nav-tabs mb-3" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                      <button
                        class="nav-link active"
                        id="value-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#value-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="value-tab-pane"
                        aria-selected="true"
                      >
                        Value
                      </button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button
                        class="nav-link"
                        id="order-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#order-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="order-tab-pane"
                        aria-selected="false"
                      >
                        Order
                      </button>
                    </li>
                  </ul> */}
                  <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3"
                  >
                    <Tab eventKey="Value" title={t("distributor.sidebar.value")} order="3"> 
                    {/*  */}
                      <div class="row mb-3">
                        <div class="col-sm-5 mb-3 mb-sm-0">
                          <div class="card user-card height-100">
                            <div class="card-body">
                              <h6 class="card-title mb-0">{t("distributor.sidebar.users")}</h6>
                              <div class="row">
                                <div class="col-lg-5 col-6 d-flex align-items-center">
                                  <ul class="amount-status">
                                    <li class="pending">
                                      <div class="value">CA$79.53 (3.19%)</div>
                                      <div class="status">{t("distributor.sidebar.pending")}</div>
                                    </li>
                                    <li class="approved">
                                      <div class="value">CA$79.53 (3.19%)</div>
                                      <div class="status">{t("distributor.sidebar.approved")}</div>
                                    </li>
                                    <li class="paid">
                                      <div class="value">CA$79.53 (3.19%)</div>
                                      <div class="status">{t("distributor.sidebar.paid")}</div>
                                    </li>
                                  </ul>
                                </div>
                                <div class="col-lg-7 col-6">
                                  <div class="amount-progress overflow-hidden d-flex align-items-center justify-content-center">
                                    <Chart
                                      chartType="PieChart"
                                      data={data}
                                      options={options}
                                    />
                                  </div>
                                </div>
                              </div>
                              <hr />
                              <div class="row">
                                <div class="col-6">
                                  <div class="badge text-bg-light w-100 sales-data p-lg-3 p-2 text-start">
                                    <label>{t("distributor.sidebar.sales")}</label>
                                    <div class="amount">CA$2,491.82</div>
                                  </div>
                                </div>
                                <div class="col-6">
                                  <div class="badge text-bg-light w-100 sales-data p-lg-3 p-2 text-start">
                                    <label>{t("distributor.sidebar.per_order_average")}</label>
                                    <div class="amount">CA$2,491.82</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="col-sm-7">
                          <div class="card graph-card height-100">
                            <div class="card-body">
                              <div class="row mb-3">
                                <div class="col">
                                  <h6 class="card-title">{t("distributor.sidebar.heading")}</h6>
                                </div>
                                {/* <div class="col text-end">
                                <select
                                  name=""
                                  id=""
                                  class="btn btn-outline-black btn-sm text-start"
                                >
                                  <option value="" selected>
                                    Yearly
                                  </option>
                                  <option value="">Monthly</option>
                                </select>
                              </div> */}
                              </div>

                              <Chart
                                chartType="ComboChart"
                                width="100%"
                                height="auto"
                                data={comboData}
                                options={comboOptions}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col mb-3 mb-sm-0">
                          <div class="card height-100">
                            <div class="card-body">
                              <div class="row mb-3">
                                <div class="col">
                                  <h6 class="card-title">{t("distributor.sidebar.top_products")}</h6>
                                </div>
                                {/* <div class="col text-end">
                                <select
                                  name=""
                                  id=""
                                  class="btn btn-outline-black btn-sm text-start"
                                >
                                  <option value="" selected>
                                    30 Days
                                  </option>
                                  <option value="">60 Days</option>
                                </select>
                              </div> */}
                              </div>
                              <table class="table">
                                <thead>
                                  <tr>
                                    <th scope="col">{t("distributor.sidebar.product_name")}</th>
                                    <th scope="col"></th>
                                    <th scope="col" class="">
                                    {t("distributor.sidebar.product_value")}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td colspan="2">
                                      <div class="topProd">
                                        <div class="name">Product-1</div>
                                        <div class="desc">
                                          Lorem Ipsum is simply dummy text
                                        </div>
                                      </div>
                                    </td>
                                    <td class="prodPrice">CA $555.00</td>
                                  </tr>
                                  <tr>
                                    <td colspan="2">
                                      <div class="topProd">
                                        <div class="name">Product-1</div>
                                        <div class="desc">
                                          Lorem Ipsum is simply dummy text
                                        </div>
                                      </div>
                                    </td>
                                    <td class="prodPrice">CA $555.00</td>
                                  </tr>
                                  <tr>
                                    <td colspan="2">
                                      <div class="topProd">
                                        <div class="name">Product-1</div>
                                        <div class="desc">
                                          Lorem Ipsum is simply dummy text
                                        </div>
                                      </div>
                                    </td>
                                    <td class="prodPrice">CA $555.00</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        <div class="col mb-3 mb-sm-0">
                          <div class="card height-100">
                            <div class="card-body">
                              <div class="row mb-3">
                                <div class="col">
                                  <h6 class="card-title">{t("distributor.sidebar.top_retailers")}</h6>
                                </div>
                                {/* <div class="col text-end">
                                <select
                                  name=""
                                  id=""
                                  class="btn btn-outline-black btn-sm text-start"
                                >
                                  <option value="" selected>
                                    30 Days
                                  </option>
                                  <option value="">60 Days</option>
                                </select>
                              </div> */}
                              </div>
                              <table class="table">
                                <thead>
                                  <tr>
                                    <th scope="col">{t("distributor.sidebar.product_name")}</th>
                                    <th scope="col"></th>
                                    <th scope="col" class="">
                                    {t("distributor.sidebar.product_value")}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td colspan="2">
                                      <div class="topProd">
                                        <div class="name">Product-1</div>
                                        <div class="desc">
                                          Lorem Ipsum is simply dummy text
                                        </div>
                                      </div>
                                    </td>
                                    <td class="prodPrice">CA $555.00</td>
                                  </tr>
                                  <tr>
                                    <td colspan="2">
                                      <div class="topProd">
                                        <div class="name">Product-1</div>
                                        <div class="desc">
                                          Lorem Ipsum is simply dummy text
                                        </div>
                                      </div>
                                    </td>
                                    <td class="prodPrice">CA $555.00</td>
                                  </tr>
                                  <tr>
                                    <td colspan="2">
                                      <div class="topProd">
                                        <div class="name">Product-1</div>
                                        <div class="desc">
                                          Lorem Ipsum is simply dummy text
                                        </div>
                                      </div>
                                    </td>
                                    <td class="prodPrice">CA $555.00</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab eventKey="profile" title={t("distributor.sidebar.profile")}>
                      <div class="row mb-3">
                        <div class="col-sm-5 mb-3 mb-sm-0">
                          <div class="card user-card height-100">
                            <div class="card-body">
                              <h6 class="card-title mb-0">{t("distributor.sidebar.orders")}</h6>
                              <div class="row">
                                <div class="col-lg-5 col-6 d-flex align-items-center">
                                  <ul class="amount-status">
                                    <li class="pending">
                                      <div class="value">CA$79.53 (3.19%)</div>
                                      <div class="status">{t("distributor.sidebar.pending")}</div>
                                    </li>
                                    <li class="approved">
                                      <div class="value">CA$79.53 (3.19%)</div>
                                      <div class="status">{t("distributor.sidebar.approved")}</div>
                                    </li>
                                    <li class="paid">
                                      <div class="value">CA$79.53 (3.19%)</div>
                                      <div class="status">{t("distributor.sidebar.paid")}</div>
                                    </li>
                                  </ul>
                                </div>
                                <div class="col-lg-7 col-6">
                                  <div class="amount-progress overflow-hidden d-flex align-items-center justify-content-center">
                                    <Chart
                                      chartType="PieChart"
                                      data={data}
                                      options={options}
                                    />
                                  </div>
                                </div>
                              </div>
                              <hr />
                              <div class="row">
                                <div class="col-6">
                                  <div class="badge text-bg-light w-100 sales-data p-lg-3 p-2 text-start">
                                    <label>{t("distributor.sidebar.orders")}</label>
                                    <div class="amount">15</div>
                                  </div>
                                </div>
                                <div class="col-6">
                                  <div class="badge text-bg-light w-100 sales-data p-lg-3 p-2 text-start">
                                    <label>{t("distributor.sidebar.daily_average_order")}</label>
                                    <div class="amount">1.50</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="col-sm-7">
                          <div class="card graph-card height-100">
                            <div class="card-body">
                              <div class="row mb-3">
                                <div class="col">
                                  <h6 class="card-title">{t("distributor.sidebar.heading")}</h6>
                                </div>
                                {/* <div class="col text-end">
                                <select
                                  name=""
                                  id=""
                                  class="btn btn-outline-black btn-sm text-start"
                                >
                                  <option value="" selected>
                                    Yearly
                                  </option>
                                  <option value="">Monthly</option>
                                </select>
                              </div> */}
                              </div>

                              <Chart
                                chartType="ComboChart"
                                width="100%"
                                height="auto"
                                minHeight="400px"
                                data={comboData}
                                options={comboOptions}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col mb-3 mb-sm-0">
                          <div class="card height-100">
                            <div class="card-body">
                              <div class="row mb-3">
                                <div class="col">
                                  <h6 class="card-title">{t("distributor.sidebar.top_products")}</h6>
                                </div>
                                {/* <div class="col text-end">
                                <select
                                  name=""
                                  id=""
                                  class="btn btn-outline-black btn-sm text-start"
                                >
                                  <option value="" selected>
                                    30 Days
                                  </option>
                                  <option value="">60 Days</option>
                                </select>
                              </div> */}
                              </div>
                              <table class="table">
                                <thead>
                                  <tr>
                                    <th scope="col">{t("distributor.sidebar.product_name")}</th>
                                    <th scope="col"></th>
                                    <th scope="col" class="">
                                    {t("distributor.sidebar.product_value")}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td colspan="2">
                                      <div class="topProd">
                                        <div class="name">Product-1</div>
                                        <div class="desc">
                                          Lorem Ipsum is simply dummy text
                                        </div>
                                      </div>
                                    </td>
                                    <td class="prodPrice">CA $555.00</td>
                                  </tr>
                                  <tr>
                                    <td colspan="2">
                                      <div class="topProd">
                                        <div class="name">Product-1</div>
                                        <div class="desc">
                                          Lorem Ipsum is simply dummy text
                                        </div>
                                      </div>
                                    </td>
                                    <td class="prodPrice">CA $555.00</td>
                                  </tr>
                                  <tr>
                                    <td colspan="2">
                                      <div class="topProd">
                                        <div class="name">Product-1</div>
                                        <div class="desc">
                                          Lorem Ipsum is simply dummy text
                                        </div>
                                      </div>
                                    </td>
                                    <td class="prodPrice">CA $555.00</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        <div class="col mb-3 mb-sm-0">
                          <div class="card height-100">
                            <div class="card-body">
                              <div class="row mb-3">
                                <div class="col">
                                  <h6 class="card-title">{t("distributor.sidebar.top_retailers")}</h6>
                                </div>
                                {/* <div class="col text-end">
                                <select
                                  name=""
                                  id=""
                                  class="btn btn-outline-black btn-sm text-start"
                                >
                                  <option value="" selected>
                                    30 Days
                                  </option>
                                  <option value="">60 Days</option>
                                </select>
                              </div> */}
                              </div>
                              <table class="table">
                                <thead>
                                  <tr>
                                    <th scope="col">{t("distributor.sidebar.product_name")}</th>
                                    <th scope="col"></th>
                                    <th scope="col" class="">
                                    {t("distributor.sidebar.product_value")}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td colspan="2">
                                      <div class="topProd">
                                        <div class="name">Product-1</div>
                                        <div class="desc">
                                          Lorem Ipsum is simply dummy text
                                        </div>
                                      </div>
                                    </td>
                                    <td class="prodPrice">CA $555.00</td>
                                  </tr>
                                  <tr>
                                    <td colspan="2">
                                      <div class="topProd">
                                        <div class="name">Product-1</div>
                                        <div class="desc">
                                          Lorem Ipsum is simply dummy text
                                        </div>
                                      </div>
                                    </td>
                                    <td class="prodPrice">CA $555.00</td>
                                  </tr>
                                  <tr>
                                    <td colspan="2">
                                      <div class="topProd">
                                        <div class="name">Product-1</div>
                                        <div class="desc">
                                          Lorem Ipsum is simply dummy text
                                        </div>
                                      </div>
                                    </td>
                                    <td class="prodPrice">CA $555.00</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                  </Tabs>

                  <div class="filter-box position-abs">
                    <label htmlFor="">{t("distributor.sidebar.from")}</label>
                    <div className="date-picker">
                      <ReactDatePicker
                        className="btn btn-sm btn-outline-black rounded-pill filterDate"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="MM/DD/YYYY"
                        dateFormat={dateFormat}
                        showPopperArrow={true}
                        locale={i18n.language}
                      />
                    </div>{" "}
                    <label htmlFor=""> {t("distributor.sidebar.to")} </label>
                    <div className="date-picker">
                      <ReactDatePicker
                        className="btn btn-sm btn-outline-black rounded-pill filterDate"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        placeholderText="MM/DD/YYYY"
                        dateFormat={dateFormat}
                        locale={i18n.language} // Set the locale based on the current language
                      />
                    </div>
                    <div class="dropdown date-selector">
                      <button
                        class="btn btn-outline-black btn-sm dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {selectedSupplier
                          ? selectedSupplierName
                          : t("distributor.sidebar.choose_supplier")}

                      </button>
                      <ul class="dropdown-menu">
                        {supplierList.map((s) => (
                          <li
                            onClick={() => {
                              setSelectedSupplier(s.id);
                              setSelectedSupplierName(s.full_name);
                            }}
                          >
                            <a class="dropdown-item" href="#">
                              {s.full_name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
