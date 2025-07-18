import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import NumericInput from "react-numeric-input";
import { Modal } from "react-bootstrap";
import Sidebar from "../../../CommonComponents/Sidebar/sidebar";
import Header from "../../../CommonComponents/Header/header";
import "../../assets/scss/dashboard.scss";
import useAuthInterceptor from "../../../utils/apis";
import "react-toastify/dist/ReactToastify.css";
import { hasPermission } from "../../../CommonComponents/commonMethods";
import { ORDER_EDIT, PRODUCT_VIEW } from "../../../Constants/constant";

toast.configure();

const CreateOrder = () => {
  const apis = useAuthInterceptor();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const token = localStorage.getItem("supplier_accessToken");
  const [distributorList, setDistributorList] = useState("");
  const [retailerList, setRetailerList] = useState("");
  const [selectedRetailer, setSelectedRetailer] = useState("");
  const [selectedDistributor, setSelectedDistributor] = useState("");
  const [addedItem, setAddedItem] = useState([]);
  const [targetUnit, setTargetUnit] = useState("0");
  const [targetTax, setTargetTax] = useState("");
  const [targetQuantity, setTargetQuantity] = useState(1);
  const [targetSubtotal, setTargetSubtotal] = useState("0");
  const [targetProductId, setTargetProductId] = useState("");
  const [targetProductName, setTargetProductName] = useState("");
  const [targetProductFormat, setTargetProductFormat] = useState("");
  const [targetProductStyle, setTargetProductStyle] = useState("");
  const [editableItem, setEditableItem] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [update, setUpdate] = useState(false);
  const [includeTax, setIncludeTax] = useState(false);
  const [grandSubTot, setGrandSubTot] = useState("0");
  const [grandTot, setGrandTot] = useState("0");
  const [retailerError, setRetailerError] = useState("");
  const [distributorError, setDistributorError] = useState("");
  const [note, setNote] = useState("");

  const handleItemSelect = (e) => {
    setSelectedItem(e.target.value);
    if (e.target.value !== "") {
      let parsed = JSON.parse(e.target.value);
      setTargetUnit(parsed.productUnitPrice);
      setTargetTax(parsed.productTax);
      setTargetProductId(parsed.productId);
      setTargetProductName(parsed.productName);
      setTargetProductStyle(parsed.productStyleId);
      setTargetProductFormat(parsed.productFormatId);
    } else {
      setTargetUnit(0);
      setTargetQuantity(1);
      setTargetSubtotal("0");
      setTargetProductId("");
      setTargetProductName("");
    }
  };

  const handleAddItem = (e) => {
    if (selectedItem === "") {
      toast.error("Please select an item to add.", {
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      let dummyList = addedItem;

      let dummyObject = {
        tax: targetTax,
        price: targetUnit,
        quantity: targetQuantity,
        sub_total: targetSubtotal,
        product_name: targetProductName,
        product_id: targetProductId,
        product_format_id: targetProductFormat,
        product_style_id: targetProductStyle,
      };

      dummyList.push(dummyObject);
      setAddedItem(dummyList);
      setTargetUnit(0);
      setTargetQuantity(1);
      setTargetSubtotal("0");
      setTargetProductId("");
      setTargetProductName("");
      setSelectedItem("");
      const newGroup = editableItem.filter((obj) => obj.id !== targetProductId);
      setEditableItem(newGroup);
      setUpdate(!update);
    }
  };

  const handleCreate = () => {
    let retailerValid = true,
      distributorValid = true,
      added = true;

    if (selectedRetailer == "") {
      retailerValid = false;
      setRetailerError("Please select a retailer.");
    }

    if (selectedDistributor == "") {
      distributorValid = false;
      setDistributorError("Please select a distributor.");
    }

    if (addedItem.length === 0) {
      added = false;
      toast.error("Please add atleast one item to create order.", {
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER,
      });
    }

    if (retailerValid == false || distributorValid == false || added == false) {
      console.log("Validation Error");
    } else {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          permission: "order-edit",
        },
      };

      let finalArray = [];
      for (let i = 0; i < addedItem.length; i++) {
        let finalObj = {
          tax: addedItem[i].tax,
          price: addedItem[i].price,
          quantity: addedItem[i].quantity,
          sub_total: addedItem[i].sub_total,
          product_id: addedItem[i].product_id,
          product_format_id: addedItem[i].product_format_id,
          product_style_id: addedItem[i].product_style_id,
        };

        finalArray.push(finalObj);
      }

      const bodyData = {
        retailer_id: selectedRetailer,
        distributor_id: selectedDistributor,
        note: note,
        items: finalArray,
        total_quantity: 100,
        total_amount: grandTot,
      };

      if(hasPermission(ORDER_EDIT)){
        apis
        .post("supplier/order/add", bodyData, config)
        .then((res) => {
          if (res.data.success === true) {
            toast.success("Order Created Successfully", {
              autoClose: 3000,
              position: toast.POSITION.TOP_CENTER,
            });
            navigate("/supplier/order-management");
          } else {
            toast.error("Could not create order. Please try again later.", {
              autoClose: 3000,
              position: toast.POSITION.TOP_CENTER,
            });
          }
        })
        .catch((error) => {
          if(error.message !== "revoke"){
            toast.error("Could not create order. Please try again later.", {
              autoClose: 3000,
              position: toast.POSITION.TOP_CENTER,
            });
          }
        });
      }else{
        toast.warn("You do not have permission to create/edit orders.", {autoClose: 3000, position: toast.POSITION.TOP_CENTER,})
      }
    }
  };

  useEffect(() => {
    const config1 = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    apis
      .get("/supplier/getLinkedRetailers", config1)
      .then((res) => {
        if (res.data.success === true) {
          setRetailerList(res.data.data);
        } else {
          toast.error("Could not fetch retailers. Please try again later.", {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      })
      .catch((error) => {
        if(error.message !== "revoke"){
          toast.error("Could not fetch retailers. Please try again later.", {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      });

    apis
      .get("/supplier/getLinkedDistributors", config1)
      .then((res) => {
        if (res.data.success === true) {
          setDistributorList(res.data.data);
        } else {
          toast.error("Could not fetch distributors. Please try again later.", {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      })
      .catch((error) => {
        if(error.message !== "revoke"){
          toast.error("Could not fetch distributors. Please try again later.", {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      });
  }, []);

  useEffect(() => {
    if (addedItem.length > 0) {
      let grand_total = 0,
        grand_sub_total = 0;
      if (includeTax) {
        for (let i = 0; i < addedItem.length; i++) {
          grand_sub_total =
            grand_sub_total + parseFloat(addedItem[i].sub_total);
          let itemTax =
            parseFloat(addedItem[i].sub_total) +
            (parseFloat(addedItem[i].sub_total) *
              parseFloat(addedItem[i].tax)) /
              100;
          grand_total = grand_total + itemTax;
        }
        setGrandSubTot(grand_sub_total.toFixed(2));
        setGrandTot(grand_total.toFixed(2));
      } else {
        for (let i = 0; i < addedItem.length; i++) {
          grand_sub_total =
            grand_sub_total + parseFloat(addedItem[i].sub_total);
        }
        setGrandSubTot(grand_sub_total.toFixed(2));
        setGrandTot(grand_sub_total.toFixed(2));
      }
    }
  }, [update, includeTax]);

  useEffect(() => {
    if (selectedDistributor !== "") {
      const config2 = {
        headers: {
          Authorization: `Bearer ${token}`,
          permission: "product-view",
        },
        params: {
          distributor: selectedDistributor,
        },
      };

      if(hasPermission(PRODUCT_VIEW)){
        apis
        .get("/supplier/productsHavingPricing", config2)
        .then((res) => {
          if (res.data.success == true) {
            setEditableItem(res.data.data);
          } else {
            toast.error(
              "Could not fetch product list. Please try again later.",
              { autoClose: 3000, position: toast.POSITION.TOP_CENTER }
            );
          }
        })
        .catch((error) => {
          if(error.message !== "revoke"){
            toast.error("Could not fetch product list. Please try again later.", {
              autoClose: 3000,
              position: toast.POSITION.TOP_CENTER,
            });
          }
        });
      }
    }else{
      setEditableItem([]);
      setAddedItem([]);
    }
  }, [selectedDistributor]);

  useEffect(() => {
    if (selectedItem !== "") {
      const subTotal = parseFloat(targetUnit) * parseFloat(targetQuantity);
      setTargetSubtotal(subTotal.toFixed(2));
    }
  }, [selectedItem, targetQuantity]);

  return (
    <div class="container-fluid page-wrap order-create">
      <div class="row height-inherit">
        <Sidebar userType={"supplier"} />

        <div class="col main p-0">
          <Header title={t("supplier.order_management.new_order.title")} />
          <div class="container-fluid page-content-box px-3 px-sm-4">
            {/* [Card 1] */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-sm-6">
                    <ul class="list-group row1">
                      <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0">
                        {t("supplier.order_management.new_order.status")}
                        <span class="badge text-bg-orange rounded-pill">
                          ON HOLD
                        </span>
                      </li>
                      {/* <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0">
                        Expected Delivery Date
                        <span class="d-inline-flex align-items-center">
                          <img src={calender} className="me-2" alt="" />
                          23 March 2023
                        </span>
                      </li> */}
                    </ul>
                  </div>
                  <div className="w-100">
                    <hr />
                  </div>
                  <div className="w-100">
                    <div className="row">
                      {/* [Retailer] */}
                      <div className="col-sm-4 col-xl-3 mb-4 mb-sm-0">
                        <div className="create-order-dropdown-box mb-3">
                          <label>
                            {t("supplier.order_management.new_order.retailer")}
                          </label>
                          <div className="w-100">
                            <select
                              className="rounded-pill"
                              value={selectedRetailer}
                              onChange={(e) => {
                                setSelectedRetailer(e.target.value);
                                setRetailerError("");
                              }}
                            >
                              <option value="">Select Retailer</option>
                              {retailerList && retailerList.length > 0 ? (
                                retailerList.map((ele) => {
                                  return (
                                    <option value={ele.id}>
                                      {ele.user_profile ? ele.user_profile.business_name ? ele.user_profile.business_name : "N/A" : "N/A"}
                                    </option>
                                  );
                                })
                              ) : (
                                <></>
                              )}
                            </select>
                            {retailerError !== "" ? (
                              <p className="error-label">{retailerError}</p>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                        {/* <div className="addMoreBox">
                            <button>
                              <i className="rounded-circle">&#10010;</i> Add Retailer
                            </button>
                        </div> */}
                      </div>
                      {/* [/Retailer] */}

                      {/* [Distributor] */}
                      <div className="col-sm-4 col-xl-3">
                        <div className="create-order-dropdown-box mb-3">
                          <label>
                            {t(
                              "supplier.order_management.new_order.distributor"
                            )}
                          </label>
                          <div className="w-100">
                            <select
                              className="rounded-pill"
                              value={selectedDistributor}
                              onChange={(e) => {
                                setSelectedDistributor(e.target.value);
                                setDistributorError("");
                                setAddedItem([]);
                              }}
                            >
                              <option value="">Select Distributor</option>
                              {distributorList && distributorList.length > 0 ? (
                                distributorList.map((ele) => {
                                  return (
                                    <option value={ele.id}>
                                      {ele.user_profile.company_name ? ele.user_profile.company_name : "N/A"}
                                    </option>
                                  );
                                })
                              ) : (
                                <></>
                              )}
                            </select>
                            {distributorError !== "" ? (
                              <p className="error-label">{distributorError}</p>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                        {/* <div className="addMoreBox">
                            <button>
                              <i className="rounded-circle">&#10010;</i> Add Distributor
                            </button>
                        </div> */}
                      </div>
                      {/* [/Distributor] */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* [/Card 1] */}

            {/* [Card 2] */}

            <div class="card mb-4">
              <div class="card-body p-0">
                <div className="table-responsive">
                  <table class="table m-0">
                    <thead>
                      <tr>
                        <th scope="col">
                          {t("supplier.order_management.new_order.table_col1")}
                        </th>
                        <th scope="col">
                          {t("supplier.order_management.new_order.table_col2")}
                        </th>
                        <th scope="col" class="">
                          {t("supplier.order_management.new_order.table_col3")}
                        </th>
                        <th scope="col" class="">
                          {t("supplier.order_management.new_order.table_col4")}
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {addedItem && addedItem.length > 0 ? (
                        addedItem.map((ele) => {
                          return (
                            <tr>
                              <td>{ele.product_name}</td>
                              <td>{`$ ${ele.price}`}</td>
                              <td>{ele.quantity}</td>
                              <td>{`$ ${ele.sub_total}`}</td>
                              <td></td>
                            </tr>
                          );
                        })
                      ) : (
                        <></>
                      )}
                      <tr>
                        <td>
                          <div className="table-form-options">
                            
                            <select
                              className="rounded-pill"
                              value={selectedItem}
                              onChange={(e) => handleItemSelect(e)}
                              disabled = {hasPermission(PRODUCT_VIEW) ? false : true}
                              onClick={hasPermission(PRODUCT_VIEW) ? () => console.log("PRODUCT SELECTION FOR ORDER") : () => toast.warn("You do not have permission to view products.", {autoClose: 3000, position: toast.POSITION.TOP_CENTER})}
                            >
                              <span></span>
                              <option value="">Select Item</option>
                              {editableItem && editableItem.length > 0 ? (
                                editableItem.map((ele) => {
                                  return (
                                    <option
                                      value={JSON.stringify({
                                        productId: ele.pricing.product_id,
                                        productUnitPrice:
                                          ele.pricing.unit_price,
                                        productTax: ele.pricing.tax_amount,
                                        productName: ele.product_name,
                                        productFormatId: ele.product_format.id,
                                        productStyleId: ele.style,
                                      })}
                                    >
                                      {ele.product_name}
                                    </option>
                                  );
                                })
                              ) : (
                                <></>
                              )}
                            </select>
                          </div>
                        </td>
                        <td class="">
                          <div className="table-form-options">
                            <span class="badge text-bg-light rounded-pill">
                              {`$ ${targetUnit}`}
                            </span>
                          </div>
                        </td>
                        <td className="">
                          <NumericInput
                            className="form-control border-0 border-bottom rounded-0"
                            value={targetQuantity}
                            min={1}
                            onChange={(e) => setTargetQuantity(e)}
                            step={1}
                            precision={0}
                            size={5}
                            strict
                            disabled={selectedItem == "" ? true : false}
                          />
                        </td>
                        <td class="">
                          <div className="price-box">
                            <div className="mrp">{`$ ${targetSubtotal}`}</div>
                          </div>
                        </td>
                        <td>
                          <div className="addMore d-flex align-items-center justify-content-center">
                            <button
                              type="button"
                              onClick={() => handleAddItem()}
                              className="rounded-circle btn btn-purple"
                            >
                              &#10010;
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="5">
                          <div className="addNoteBox ps-1">
                            <label>
                              {/* <i className="rounded-circle">&#10010;</i> Add */}
                              {t("supplier.order_management.new_order.note")}
                            </label>
                            <div className="noteTextareaBox">
                              <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                              ></textarea>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* [/Card 2] */}

            {/* [Card 3] */}
            <div className="row">
              <div className="col-12 mb-3">
                {/* <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="inlineCheckbox1"
                    value="option1"
                  />
                  <label class="form-check-label" for="inlineCheckbox1">
                    Include Deposit
                  </label>
                </div> */}
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="inlineCheckbox2"
                    value="option2"
                    checked={includeTax}
                    onChange={(e) => setIncludeTax(e.target.checked)}
                  />
                  <label class="form-check-label" for="inlineCheckbox2">
                    {t("supplier.order_management.new_order.include")}
                  </label>
                </div>
              </div>
              <div className="col-sm-3 mb-4">
                <div className="card shadow-none order-subtotal-box">
                  <div className="card-body p-3">
                    <div className="price-breakage mb-2 d-flex justify-content-between">
                      <label>
                        {t("supplier.order_management.new_order.subtotal")}:
                      </label>
                      <span>{`$ ${grandSubTot}`}</span>
                    </div>
                    <div className="price-breakage-sum mb-2 d-flex justify-content-between">
                      <label>
                        {t("supplier.order_management.new_order.total")}:
                      </label>
                      <span>{`$ ${grandTot}`}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <button
                  type="button"
                  onClick={() => navigate("/supplier/order-management")}
                  className="btn btn-outline-black"
                >
                  {t("supplier.order_management.new_order.cancel_btn")}
                </button>
                &nbsp;&nbsp;&nbsp;
                <button
                  type="button"
                  onClick={() => handleCreate()}
                  className="btn btn-purple"
                >
                  {t("supplier.order_management.new_order.create_btn")}
                </button>
              </div>
            </div>
            {/* [/Card 3] */}
          </div>
        </div>
      </div>
      {/* [Modal] */}
      <Modal class="modal fade" id="uploadFiles" show={show} centered={true}>
        <Modal.Dialog>
          <div class="modal-content p-3">
            <div class="modal-header justify-content-start">
              <h6 class="modal-title">Upload Files</h6>
              <hr />
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p>Attach invoice form here</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
              <button
                type="button"
                class="btn btn-outline-black width-auto"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              &nbsp;&nbsp;
              <button type="button" class="btn btn-purple width-auto">
                Attach File
              </button>
            </div>
          </div>
        </Modal.Dialog>
      </Modal>
      {/* {/* [/Modal] */}
    </div>
  );
};

export default CreateOrder;
