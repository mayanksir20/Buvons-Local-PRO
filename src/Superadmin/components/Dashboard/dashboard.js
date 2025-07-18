import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// icon File
import calendar from "../../assets/images/calender.png";
import totalUsers from "../../assets/images/total-users.png";
import graph from "../../assets/images/graph.png";
import Sidebar from "../../../CommonComponents/Sidebar/sidebar";
import Header from "../../../CommonComponents/Header/header";
// import css
import "../../assets/scss/dashboard.scss";

// import React Bootstarp
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  Card,
  Table,
  Form,
} from "react-bootstrap";

const Dashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const accessToken = localStorage.getItem("admin_accessToken");
  const navigate = useNavigate();

  const updateSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    if (!accessToken) {
      navigate("/", {
        state: {
          url: "/dashboard",
        },
      });
    } else {
      console.log("Call dashboard data API");
    }
  }, []);
  return (
    <Container fluid className="page-wrap dashboard">
      <Row className="height-inherit">
        <Sidebar userType={"admin"} />
        <Col className="main p-0">
          <Header title="Dashboard" updateSidebar={updateSidebar} />
          <Container fluid className="page-content-box px-3 px-sm-4">
            <Row>
              <Col>
                <div className="tab-link-row position-relative">
                  <Nav className="nav nav-tabs mb-3" id="myTab" role="tablist">
                    <NavItem className="nav-item" role="presentation">
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
                    </NavItem>
                    <NavItem className="nav-item" role="presentation">
                      <button
                        className="nav-link"
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
                    </NavItem>
                  </Nav>

                  <div className="filter-box position-abs">
                    <Dropdown className="date-selector">
                      <Dropdown.Toggle
                        variant="Warning"
                        id="dropdown-basic"
                        className="btn btn-outline-black btn-sm"
                      >
                        <img src={calendar} alt="" className="me-1" /> Select
                        Date
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-2">Date</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Date</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className="date-selector">
                      <Dropdown.Toggle
                        variant="Warning"
                        id="dropdown-basic"
                        className="btn btn-outline-black btn-sm"
                      >
                        {" "}
                        Supplier
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-2">
                          Supplier 1
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-3">
                          Supplier 2
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                <div class="tab-content" id="myTabContent">
                  <div
                    class="tab-pane fade show active"
                    id="value-tab-pane"
                    role="tabpanel"
                    aria-labelledby="value-tab"
                    tabindex="0"
                  >
                    <Row className="mb-3">
                      <Col md={5} className="mb-3 mb-md-0">
                        <Card className="user-card height-100">
                          <Card.Body>
                            <Card.Title className="h6 mb-3">Users</Card.Title>
                            <Row>
                              <Col>
                                <Nav as="ul" class="amount-status">
                                  <NavItem as="li" class="pending">
                                    <div class="value">CA$79.53 (3.19%)</div>
                                    <div class="status">Pending</div>
                                  </NavItem>
                                  <NavItem as="li" class="approved">
                                    <div class="value">CA$79.53 (3.19%)</div>
                                    <div class="status">Approved</div>
                                  </NavItem>
                                  <NavItem as="li" class="paid">
                                    <div class="value">CA$79.53 (3.19%)</div>
                                    <div class="status">Paid</div>
                                  </NavItem>
                                </Nav>
                              </Col>
                              <Col class="col">
                                <div class="amount-progress">
                                  <img
                                    src={totalUsers}
                                    class="img-fluid"
                                    alt=""
                                  />
                                </div>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col sm={6}>
                                <div class="badge text-bg-light w-100 sales-data p-3 text-start">
                                  <label>Sales</label>
                                  <div class="amount">CA$2,491.82</div>
                                </div>
                              </Col>
                              <Col sm={6}>
                                <div class="badge text-bg-light w-100 sales-data p-3 text-start">
                                  <label>Per Order Average</label>
                                  <div class="amount">CA$2,491.82</div>
                                </div>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={7}>
                        <Card className="graph-card height-100">
                          <Card.Body>
                            <Row className="mb-3">
                              <Col>
                                <Card.Title className="h6 mb-0">
                                  Heading
                                </Card.Title>
                              </Col>
                              <Col className="text-end">
                                {/* <select
                                  name=""
                                  id=""
                                  class="btn btn-outline-black btn-sm text-start"
                                >
                                  <option value="" selected>
                                    Yearly
                                  </option>
                                  <option value="">Monthly</option>
                                </select> */}
                                <Form.Select
                                  aria-label="Default select example"
                                  className="btn btn-outline-black btn-sm w-auto pe-4 ps-2"
                                >
                                  <option value="Yearly">Yearly</option>
                                  <option value="2">Monthly</option>
                                </Form.Select>
                              </Col>
                            </Row>

                            <img src={graph} class="img-fluid" alt="" />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-3 mb-md-0">
                        <Card class="height-100">
                          <Card.Body>
                            <Row className="mb-3">
                              <Col className="w-auto">
                                <Card.Title className="h6">
                                  Top Products
                                </Card.Title>
                              </Col>
                              <Col className="text-end">
                                {/* <select
                                  name=""
                                  id=""
                                  class="btn btn-outline-black btn-sm text-start"
                                >
                                  <option value="" selected>
                                    30 Days
                                  </option>
                                  <option value="">60 Days</option>
                                </select> */}
                                <Form.Select
                                  aria-label="Default select example"
                                  className="btn btn-outline-black btn-sm w-auto pe-5 ps-2"
                                >
                                  <option value="1">30 Days</option>
                                  <option value="2">60 Days</option>
                                </Form.Select>
                              </Col>
                            </Row>
                            <Table>
                              <thead>
                                <tr>
                                  <th scope="col">Product name</th>
                                  <th scope="col"></th>
                                  <th scope="col" class="">
                                    Product Value
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
                            </Table>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6} className="mb-3 mb-md-0">
                        <Card class="height-100">
                          <Card.Body>
                            <Row className="mb-3">
                              <Col className="col-auto">
                                <Card.Title className="h6">
                                  Top Retailers
                                </Card.Title>
                              </Col>
                              <Col className="text-end">
                                {/* <select
                                  name=""
                                  id=""
                                  class="btn btn-outline-black btn-sm text-start"
                                >
                                  <option value="" selected>
                                    30 Days
                                  </option>
                                  <option value="">60 Days</option>
                                </select> */}
                                <Form.Select
                                  aria-label="Default select example"
                                  className="btn btn-outline-black btn-sm w-auto pe-5 ps-2"
                                >
                                  <option value="1">30 Days</option>
                                  <option value="2">60 Days</option>
                                </Form.Select>
                              </Col>
                            </Row>
                            <Table className="w-100">
                              <thead>
                                <tr>
                                  <th scope="col">Product name</th>
                                  <th scope="col"></th>
                                  <th scope="col" class="">
                                    Product Value
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
                            </Table>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>

                  <div
                    class="tab-pane fade"
                    id="order-tab-pane"
                    role="tabpanel"
                    aria-labelledby="order-tab"
                    tabindex="0"
                  >
                    <p>
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Rem esse hic harum, maxime adipisci aliquam, quos aliquid
                      labore sit, accusamus quisquam quidem ducimus sequi ab id
                      sed mollitia voluptatum doloremque!Lorem ipsum dolor sit,
                      amet consectetur adipisicing elit. Rem esse hic harum,
                      maxime adipisci aliquam, quos aliquid labore sit,
                      accusamus quisquam quidem ducimus sequi ab id sed mollitia
                      voluptatum doloremque!
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
