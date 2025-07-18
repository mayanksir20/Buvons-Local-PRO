import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import { toast } from "react-toastify";
import useAuthInterceptor from "../../../../utils/apis";
import Loader from "../../UI/Loader";
import { hasPermission } from "../../../../CommonComponents/commonMethods";
import { REPORTS_VIEW, REPORTS_EDIT } from "../../../../Constants/constant";
import Card from 'react-bootstrap/Card';
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// define needed URLs here
const postFormDataUrl = "/supplier/PostReportProductList";
const getFormDataUrl = "/supplier/getsalesReport";
const getFormDataCityUrl = "/supplier/reportSupplierCity";
const getFormDataRetailerUrl = "/supplier/reportFormdataRetailer";
const getFormDataproductName = "/supplier/reportFormdataProductsName";
const getFormDataproductType = "/supplier/reportFormdataProducttype";
const getFormDataproductStyle = "/supplier/reportFormdataProductstyle";
const getFormDataproductFormat = "/supplier/reportFormdataProductformat";
const getFormDataproductGroup = "/supplier/reportFormdataProductgroup";
const getFormDataRetailersList = "/supplier/reportFormdataRetailersList";
const getFormDataSupplierList = "/supplier/reportFormdataSupplierList";

const ProductLists = ({ img, token }) => {
  // config for api call
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      permission: "reports-view",
    },
  };

  const apis = useAuthInterceptor();

  // modal, formData, loading states
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    date_type: "",
    from_date: "",
    to_date: "",
    supplier: "",
    retailer: "",
    cad: "",
    product_name: "",
    product_type: "",
    product_style: "",
    product_format: "",
    order_state: "",
    invoice_state: "",
    group: "",
    language: "",
    file_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [getTableDataLoading, setGetTableDataLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [CityData, setCityData] = useState([]);
  const [SupplierData, setSupplierData] = useState([]);
  const [RetailerData, setRetailerData] = useState([]);
  const [ProductNameData, setProductNameData] = useState([]);
  const [ProductTypeData, setProductTypeData] = useState([]);  // testing values for table
  const [ProductStyleData, setProductStyleData] = useState([]);
  const [ProductFormatData, setProductFormatData] = useState([]);
  const [ProductGroupData, setProductGroupData] = useState([]);
  // {
  //   created_at: "123",
  //   file_path: "www.google.com",
  //   file_type: "pdf",
  // },

  // handle change : sets formData
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // from submit
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    // form valid ?
    if (form.checkValidity() === true) {
      setLoading(true);

      // add permissions based on URL
      config.headers.permission = "reports-view";

      //console.log("form submit", { formData }, { config });
      console.log("form submit", { formData });
      apis
      .post(postFormDataUrl, formData, config)
        //  .post(postFormDataUrl, formData)
        .then((res) => {
          console.log("response", { res });

          if (res.status === 200) {
            toast.success("Profile Information saved!", {
              autoClose: 1000,
              position: toast.POSITION.TOP_CENTER,
            });
            setLoading(false);

            fetchFormData();
          } else {
            toast.error(res.data.message, {
              autoClose: 3000,
              position: toast.POSITION.TOP_CENTER,
            });
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log({ error });

          if (error) {
            toast.error("Something went wrong. Please try again later.", {
              autoClose: 3000,
              position: toast.POSITION.TOP_CENTER,
            });
          }
          setLoading(false);
        });
    }
    setValidated(true);
  };

  // fetch saved form data from db
  const fetchFormData = () => {
    // add permissions based on URL
    config.headers.permission = "reports-view";
    setGetTableDataLoading(true);
    apis
      .get(getFormDataUrl, config)
      //.get(getFormDataUrl)
      .then((res) => {
        if (res.status === 200) {
          console.log("response table data", { res });
          setTableData(res.data.data);
          setGetTableDataLoading(false);
        }
      })
      .catch((error) => {
        console.log({ error });
        setGetTableDataLoading(false);
        if (error) {
          console.log({ error });
        }
      });
    setGetTableDataLoading(false);
  };

  useEffect(() => {
    fetchFormData();
  }, []);

  // fetch saved form Retailer data from db
  const fetchFormRetailerData = () => {
    // add permissions based on URL
    config.headers.permission = "reports-view";
    setGetTableDataLoading(true);
    apis
      .get(getFormDataRetailersList, config)
      //.get(getFormDataUrl)
      .then((res) => {
        if (res.status === 200) {
          console.log("response Retailer data", { res });
          setRetailerData(res.data.data);
          setGetTableDataLoading(false);
        }
      })
      .catch((error) => {
        console.log({ error });
        setGetTableDataLoading(false);
        if (error) {
          console.log({ error });
        }
      });
    setGetTableDataLoading(false);
  };

  useEffect(() => {
    fetchFormRetailerData();
  }, []);

  // fetch saved form city data from db
  const fetchFormCityData = () => {
    // add permissions based on URL
    config.headers.permission = "reports-view";
    setGetTableDataLoading(true);
    apis
      .get(getFormDataCityUrl, config)
      //.get(getFormDataUrl)
      .then((res) => {
        if (res.status === 200) {
          console.log("response city data", { res });
          setCityData(res.data.data);
          setGetTableDataLoading(false);
        }
      })
      .catch((error) => {
        console.log({ error });
        setGetTableDataLoading(false);
        if (error) {
          console.log({ error });
        }
      });
    setGetTableDataLoading(false);
  };

  useEffect(() => {
    fetchFormCityData();
  }, []);

  // fetch saved form city data from db
  const fetchFormSupplierData = () => {
    // add permissions based on URL
    config.headers.permission = "reports-view";
    setGetTableDataLoading(true);
    apis
      .get(getFormDataSupplierList, config)
      //.get(getFormDataUrl)
      .then((res) => {
        if (res.status === 200) {
          console.log("response Supplier data", { res });
          setSupplierData(res.data.data);
          setGetTableDataLoading(false);
        }
      })
      .catch((error) => {
        console.log({ error });
        setGetTableDataLoading(false);
        if (error) {
          console.log({ error });
        }
      });
    setGetTableDataLoading(false);
  };

  useEffect(() => {
    fetchFormSupplierData();
  }, []);

  // fetch saved form Product type data from db
  const fetchProductNameData = () => {
    // add permissions based on URL
    config.headers.permission = "reports-view";
    setGetTableDataLoading(true);
    apis
      .get(getFormDataproductName, config)
      //.get(getFormDataUrl)
      .then((res) => {
        if (res.status === 200) {
          console.log("response Product Name data", { res });
          setProductNameData(res.data.data);
          setGetTableDataLoading(false);
        }
      })
      .catch((error) => {
        console.log({ error });
        setGetTableDataLoading(false);
        if (error) {
          console.log({ error });
        }
      });
    setGetTableDataLoading(false);
  };

  useEffect(() => {
    fetchProductNameData();
  }, []);
  // fetch saved form Product type data from db
  const fetchProductTypeData = () => {
    // add permissions based on URL
    config.headers.permission = "reports-view";
    setGetTableDataLoading(true);
    apis
      .get(getFormDataproductType, config)
      //.get(getFormDataUrl)
      .then((res) => {
        if (res.status === 200) {
          console.log("response Product type data", { res });
          setProductTypeData(res.data.data);
          setGetTableDataLoading(false);
        }
      })
      .catch((error) => {
        console.log({ error });
        setGetTableDataLoading(false);
        if (error) {
          console.log({ error });
        }
      });
    setGetTableDataLoading(false);
  };

  useEffect(() => {
    fetchProductTypeData();
  }, []);

  // fetch saved form Product Style data from db
  const fetchProductStyleData = () => {
    // add permissions based on URL
    config.headers.permission = "reports-view";
    setGetTableDataLoading(true);
    apis
      .get(getFormDataproductStyle, config)
      //.get(getFormDataUrl)
      .then((res) => {
        if (res.status === 200) {
          console.log("response Product style data", { res });
          setProductStyleData(res.data.data);
          setGetTableDataLoading(false);
        }
      })
      .catch((error) => {
        console.log({ error });
        setGetTableDataLoading(false);
        if (error) {
          console.log({ error });
        }
      });
    setGetTableDataLoading(false);
  };

  useEffect(() => {
    fetchProductStyleData();
  }, []);

  // fetch saved form Product Style data from db
  const fetchProductFormatData = () => {
    // add permissions based on URL
    config.headers.permission = "reports-view";
    setGetTableDataLoading(true);
    apis
      .get(getFormDataproductFormat, config)
      //.get(getFormDataUrl)
      .then((res) => {
        if (res.status === 200) {
          console.log("response Product format data", { res });
          setProductFormatData(res.data.data);
          setGetTableDataLoading(false);
        }
      })
      .catch((error) => {
        console.log({ error });
        setGetTableDataLoading(false);
        if (error) {
          console.log({ error });
        }
      });
    setGetTableDataLoading(false);
  };

  useEffect(() => {
    fetchProductFormatData();
  }, []);

  // fetch saved form Product Style data from db
  const fetchProductGroupData = () => {
    // add permissions based on URL
    config.headers.permission = "reports-view";
    setGetTableDataLoading(true);
    apis
      .get(getFormDataproductGroup, config)
      //.get(getFormDataUrl)
      .then((res) => {
        if (res.status === 200) {
          console.log("response Group data", { res });
          setProductGroupData(res.data.data);
          setGetTableDataLoading(false);
        }
      })
      .catch((error) => {
        console.log({ error });
        setGetTableDataLoading(false);
        if (error) {
          console.log({ error });
        }
      });
    setGetTableDataLoading(false);
  };

  useEffect(() => {
    fetchProductGroupData();
  }, []);

  return (
    <>
      <div className="col">
        <Card className="reports reports1" style={{ width: '9rem' }}>
      <Card.Body>
        <FontAwesomeIcon icon="fa-solid fa-list-check" />
        <Card.Title></Card.Title>
        <Card.Text>
      Distribution
        </Card.Text>
        <Button variant="primary" onClick={() => setShowModal(true)}><FontAwesomeIcon icon="fa-solid fa-eye" /></Button>
      </Card.Body>
    </Card>
      </div>

      <Modal
        className="modal fade"
        show={showModal}
        fullscreen={true}
        centered
        onHide={() => setShowModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Distribution</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col className="report-img">
                <img src={img} alt="" />
              </Col>

              <Col>
              {SupplierData.map((values) => (
                <h5>{values?.first_name} {values?.last_name}</h5>
              ))}
                Products Distributions
                <br />
                Find out where your products have been delivered.
              </Col>
              <Col xs={6}></Col>
            </Row>

            <hr />
            <Row className="mb-3">
              <Form.Group as={Col} controlId="date-type">
                <Form.Label>Date Type</Form.Label>
                <Form.Control
                  as="select"
                  name="date_type"
                  required
                  onChange={(e) => handleChange(e)}
                >
                  <option value="">Choose...</option>
                  <option value="created_at">Created at</option>
                  <option value="updated_at">Updated at</option>
                </Form.Control>
                <Form.Control.Feedback className="error-label" type="invalid">
                  Date Type is required.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="from_date">
                <Form.Label>From</Form.Label>
                <Form.Control
                  type="date"
                  name="from_date"
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  From date is required.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="to_date">
                <Form.Label>To</Form.Label>
                <Form.Control
                  type="date"
                  name="to_date"
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  To date is required.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="supplier">
                <Form.Label>By Supplier</Form.Label>
                <Form.Control
                  as="select"
                  required
                  name="supplier"
                  onChange={(e) => handleChange(e)}
                >
                  <option value="">Choose...</option>
                  {SupplierData.map((values) => (
                    <option value={values?.id}>{values?.first_name} {values?.last_name}</option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback className="error-label" type="invalid">
                  Supplier is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="retailer">
                <Form.Label>By Retailer</Form.Label>
                <Form.Control
                  as="select"
                  name="retailer"
                  required
                  onChange={(e) => handleChange(e)}
                >
                  <option value="">Choose...</option>
                  {RetailerData.map((values) => (
                    <option value={values?.id}>{values?.first_name} {values?.last_name}</option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback className="error-label" type="invalid">
                  Retailer type is required.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="cad">
                <Form.Label>CSP/CAD</Form.Label>
                <Form.Control
                  as="select"
                  name="cad"
                  required
                  onChange={(e) => handleChange(e)}
                >
                  <option value="">Choose...</option>
                      {CityData.map((values) => (
                        <option value={values?.city}>{values?.city}</option>
                      ))}
                </Form.Control>
                <Form.Control.Feedback className="error-label" type="invalid">
                  CSP/CAD type is required.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="product-name">
                <Form.Label>Product name</Form.Label>
                <Form.Control
                  as="select"
                  name="product_name"
                  required
                  onChange={(e) => handleChange(e)}
                >
                  <option value="">Choose...</option>
                  {ProductNameData.map((values) => (
                    <option value={values?.product_name}>{values?.product_name}</option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback className="error-label" type="invalid">
                  Product name is required.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="product-type">
                <Form.Label>Product Type</Form.Label>
                <Form.Control
                  as="select"
                  name="product_type"
                  required
                  onChange={(e) => handleChange(e)}
                >
                  <option value="">Choose...</option>
                  {ProductTypeData.map((values) => (
                    <option value={values?.product_type}>{values?.product_type}</option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback className="error-label" type="invalid">
                  Product type is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
            <Form.Group as={Col} controlId="product-style">
              <Form.Label>Product style</Form.Label>
              <Form.Control
                as="select"
                name="product_style"
                required
                onChange={(e) => handleChange(e)}
              >
                <option value="">Choose...</option>
                {ProductStyleData.map((values) => (
                  <option value={values?.name}>{values?.name}</option>
                ))}
              </Form.Control>
              <Form.Control.Feedback className="error-label" type="invalid">
                Product style is required.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="product-format">
              <Form.Label>Product format</Form.Label>
              <Form.Control
                as="select"
                name="product_format"
                required
                onChange={(e) => handleChange(e)}
              >
                <option value="">Choose...</option>
                {ProductFormatData.map((values) => (
                  <option value={values?.name}>{values?.name}</option>
                ))}
              </Form.Control>
              <Form.Control.Feedback className="error-label" type="invalid">
                Product format is required.
              </Form.Control.Feedback>
            </Form.Group>
              <Form.Group as={Col} controlId="order-state">
                <Form.Label>Order status I</Form.Label>
                <Form.Control
                  as="select"
                  required
                  name="order_state"
                  onChange={(e) => handleChange(e)}
                >
                  <option value="">Choose...</option>
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Control>
                <Form.Control.Feedback className="error-label" type="invalid">
                  Order state is required.
                </Form.Control.Feedback>
              </Form.Group>
      {/*}        <Form.Group as={Col} controlId="order-state">
                <Form.Label>Order status II</Form.Label>
                <Form.Control
                  as="select"
                  required
                  name="order_state"
                  onChange={(e) => handleChange(e)}
                >
                  <option value="">Choose...</option>
                  <option value="All">All</option>
                  <option value="delivered">Delivered</option>
                  <option value="delivered">NON Delivered</option>
                  <option value="Pending">Refused</option>
                  <option value="Approved">Broken</option>
                  <option value="Onhold">Backorder</option>
                </Form.Control>
                <Form.Control.Feedback className="error-label" type="invalid">
                  Order state is required.
                </Form.Control.Feedback>
              </Form.Group> */}
            </Row>
            <Row className="mb-3">
            <Form.Group as={Col} controlId="invoice-state">
              <Form.Label>Invoices Status</Form.Label>
              <Form.Control
                as="select"
                required
                name="invoice_state"
                onChange={(e) => handleChange(e)}
              >
                <option value="">Choose...</option>
                <option value="All">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="closed">Closed</option>
                <option value="collect">Collect</option>
              </Form.Control>
              <Form.Control.Feedback className="error-label" type="invalid">
                Invoice status is required.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="group">
              <Form.Label>Group</Form.Label>
              <Form.Control
                as="select"
                required
                name="group"
                onChange={(e) => handleChange(e)}
              >
                <option value="">Choose...</option>
                {ProductGroupData.map((values) => (
                  <option value={values?.name}>{values?.name}</option>
                ))}
              </Form.Control>
              <Form.Control.Feedback className="error-label" type="invalid">
                Group is required.
              </Form.Control.Feedback>
            </Form.Group>
              <Form.Group as={Col} controlId="file-type">
                <Form.Label>File Type</Form.Label>
                <Form.Control
                  as="select"
                  name="file_type"
                  onChange={(e) => handleChange(e)}
                >       <option value="">Choose...</option>
                  <option value="xlsx">XLSX</option>
                  <option value="csv">CSV</option>
                  <option value="pdf">PDF</option>
                </Form.Control>
                {/* <Form.Control.Feedback className="error-label" type="invalid">
                  Please select an option.
                </Form.Control.Feedback> */}
              </Form.Group>
              <Form.Group as={Col} controlId="language">
                <Form.Label>Language</Form.Label>
                <Form.Control
                  as="select"
                  name="language"
                  onChange={(e) => handleChange(e)}
                >       <option value="">Choose...</option>
                  <option value="CAeng">CA Eng</option>
                  <option value="CAfr">CA Fr</option>
                </Form.Control>
              </Form.Group>
            </Row>

            <button
              type="submit"
              class="btn btn-success w-auto"
              disabled={loading}
            >
              Generate List
            </button>
          </Form>
          <hr />
          {!!getTableDataLoading && <Loader />}
          {!getTableDataLoading && (
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Created At</th>
                  <th>Download</th>
                  <th>File Type</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((values) => (
                  <tr>
                    <td>{new Date(values?.created_at)?.toLocaleDateString('en-GB').replace(new RegExp("/", 'g'),"-")}</td>
                    <td>
                      <a class="btn btn-success" target="_blank" href={`${values?.file_path}/${values?.filename}`}>
                        Download - {values?.file_type}
                      </a>
                    </td>
                    <td>{values?.file_type}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            variant="warning"
            className="btn btn-danger"
            data-bs-dismiss="modal"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductLists;
