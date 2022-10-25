import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";

import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  getDeliveryClients,
  resetDeliveryClientMessages,
} from "../../../../features/deliveryClients/deliveryClientSlice";
import {
  createDelivery,
  resetDeliveryMessages,
} from "../../../../features/deliveries/deliverySlice";
import DialogHeader from "../../../dialogComponents/DialogHeader";
import DialogFooter from "../../../dialogComponents/DialogFooter_SubmitClose";

function DeliveryForm() {
  // #region VARS ------------------------
  const initialState = {
    deliveryClient: undefined,
    deliveryDate: undefined,
    contactName: "",
    contactPhone: "",
    companyName: "",
    address: "",
    coordinates: "",
    productName: "",
    productQuantity: "",
    notes: "",
    directions: "",
    hasPaid: false,
    directionsReminder: false,
    completed: false,
  };
  const [formDialog, setFormDialog] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [selectedDeliveryClient, setSelectedDeliveryClient] = useState(null);
  const [filteredDeliveryClients, setFilteredDeliveryClients] = useState(null);
  const dispatch = useDispatch();

  // Select deliveryClients from store
  const {
    deliveryClients,
    deliveryClientsError,
    deliveryClientsSuccess,
    deliveryClientsMessage,
  } = useSelector((state) => state.deliveryClients);

  // Select deliveries from store
  const { deliveries, deliveriesError, deliveriesSuccess, deliveriesMessage } =
    useSelector((state) => state.deliveries);
  const {
    deliveryClient,
    deliveryDate,
    contactPhone,
    address,
    coordinates,
    productName,
    productQuantity,
    notes,
    directions,
    hasPaid,
    directionsReminder,
    completed,
  } = formData;
  // #endregion

  // #region COMPONENT RENDERERS ------------------------
  const deliveryDialogHeader = () => {
    return <DialogHeader resourceType="Delivery" isEdit={false} />;
  };

  const deliveryDialogFooter = () => {
    return <DialogFooter onClose={onClose} onSubmit={onSubmit} />;
  };
  // #endregion

  // #region TEMPLATES ------------------------
  const clientOptionTemplate = (option, props) => {
    if (option) {
      return (
        <>
          {option.firstName} {option.lastName}
        </>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const selectedClientTemplate = (option, props) => {
    if (option) {
      return (
        <>
          {option.firstName} {option.lastName}
        </>
      );
    }

    return <span>{props.placeholder}</span>;
  };
  // #endregion

  // #region FORM HANDLERS ------------------------
  const onChange = (e) => {
    if (e.hasOwnProperty("target")) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  // Handle form submit
  const onSubmit = (e) => {
    e.preventDefault();

    formData.deliveryClient = formData.deliveryClient._id;
    console.log("DELIVERY TO SUBMIT: ");
    console.log(formData);

    if (!deliveryClient) {
      return toast.error("A client is required");
    }

    if (!deliveryDate) {
      return toast.error("The delivery date is required");
    }

    if (!contactPhone) {
      return toast.error("A contact phone number is required");
    }

    if (!productName) {
      return toast.error("The products field is required");
    }

    if (!productQuantity) {
      return toast.error("The product quantity is required");
    }

    dispatch(createDelivery(formData));
    onClose();
  };

  // Handle form reset
  const resetForm = () => {
    setFormData(initialState);
  };

  // Handle dialog close
  const onClose = () => {
    resetForm();
    setFormDialog(false);
  };

  // Handle delivery client search
  const searchDeliveryClient = (event) => {
    setTimeout(() => {
      let _filteredClients;
      if (!event.query.trim().length) {
        _filteredClients = [...deliveryClients];
      } else {
        _filteredClients = deliveryClients.filter((client) => {
          return (
            client.firstName
              .toLowerCase()
              .includes(event.query.toLowerCase()) ||
            client.lastName.toLowerCase().includes(event.query.toLowerCase()) ||
            client.address.toLowerCase().includes(event.query.toLowerCase()) ||
            client.phone.toLowerCase().includes(event.query.toLowerCase())
          );
        });
      }

      setFilteredDeliveryClients(_filteredClients);
    }, 250);
  };
  // #endregion

  useEffect(() => {
    if (deliveryClientsError) {
      toast.error(deliveryClientsMessage);
    }

    if (deliveriesError && deliveriesMessage.length > 0) {
      toast.error(deliveriesMessage);
    }

    if (deliveryClientsSuccess && deliveryClientsMessage.length > 0) {
      toast.success(deliveryClientsMessage);
    }

    if (deliveriesSuccess && deliveriesMessage.length > 0) {
      toast.success(deliveriesMessage);
    }

    if (deliveryClients.length === 0) {
      dispatch(getDeliveryClients());
    }

    dispatch(resetDeliveryClientMessages());
    dispatch(resetDeliveryMessages());
  }, [
    deliveryClients,
    deliveryClientsError,
    deliveryClientsSuccess,
    deliveryClientsMessage,
    deliveries,
    deliveriesError,
    deliveriesSuccess,
    deliveriesMessage,
    dispatch,
  ]);

  useEffect(() => {
    console.log("Delivery client selected: ");
    console.log(selectedDeliveryClient);
    if (selectedDeliveryClient) {
      setFormData((prevState) => ({
        ...prevState,
        contactName:
          selectedDeliveryClient.firstName +
          " " +
          selectedDeliveryClient.lastName,
        contactPhone: selectedDeliveryClient.phone,
        address: selectedDeliveryClient.address,
        coordinates: selectedDeliveryClient.coordinates,
        productName,
        productQuantity,
        notes,
        directions: selectedDeliveryClient.directions,
      }));
    }
  }, [selectedDeliveryClient]);

  return (
    <section>
      <Button
        label="New Delivery"
        icon="pi pi-plus"
        onClick={() => setFormDialog(true)}
      />

      <Dialog
        id="newDeliveryDialog"
        visible={formDialog}
        header={deliveryDialogHeader}
        footer={deliveryDialogFooter}
        onHide={onClose}
        style={{ width: "50vw" }}
        blockScroll
      >
        <form onSubmit={onSubmit}>
          {/* DELIVERY CLIENT, DELIVERY DATE */}
          <div className="formgrid grid">
            {/* Delivery client */}
            <div className="field col">
              <div
                style={{
                  margin: "0.8em 0",
                  width: "100%",
                }}
              >
                <span className="p-float-label">
                  <Dropdown
                    id="deliveryClient"
                    name="deliveryClient"
                    value={deliveryClient}
                    options={deliveryClients}
                    optionLabel="firstName"
                    itemTemplate={clientOptionTemplate}
                    valueTemplate={selectedClientTemplate}
                    filter
                    filterBy="firstName"
                    onChange={(e) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        deliveryClient: e.value,
                      }));
                      setSelectedDeliveryClient(e.value);
                    }}
                    placeholder="Client name"
                    style={{ minWidth: "100% !important" }}
                    required
                    autoFocus
                  />
                  <label htmlFor="deliveryClient">Client Name *</label>
                </span>
              </div>
            </div>

            {/* Delivery Date */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <Calendar
                    id="deliveryDate"
                    name="deliveryDate"
                    value={deliveryDate}
                    onChange={onChange}
                    style={{ width: "100%" }}
                    required
                  ></Calendar>
                  <label htmlFor="deliveryDate">Delivery Date</label>
                </span>
              </div>
            </div>
          </div>

          {/* CONTACT PHONE, ADDRESS */}
          <div className="formgrid grid">
            {/* Contact Phone */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputTextarea
                    id="contactPhone"
                    name="contactPhone"
                    value={contactPhone}
                    placeholder="Contact Phone(s) *"
                    onChange={onChange}
                    rows={4}
                    cols={30}
                    style={{ width: "100%" }}
                    required
                  />
                  <label htmlFor="contactPhone">Contact Phone(s) *</label>
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputTextarea
                    id="address"
                    name="address"
                    value={address}
                    placeholder="Address"
                    onChange={onChange}
                    rows={4}
                    cols={30}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="address">Address</label>
                </span>
              </div>
            </div>
          </div>

          {/* COORDINATES */}
          <div className="formgrid grid">
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="coordinates"
                    name="coordinates"
                    value={coordinates}
                    placeholder="Coordinates"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="coordinates">Coordinates</label>
                </span>
              </div>
            </div>
          </div>

          {/* PRODUCT NAMES (MATERIALS), PRODUCT QUANTITIES */}
          <div className="formgrid grid">
            {/* Product Name (material) */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputTextarea
                    id="productName"
                    name="productName"
                    value={productName}
                    placeholder="Products *"
                    onChange={onChange}
                    rows={4}
                    cols={30}
                    style={{ width: "100%" }}
                    required
                  />
                  <label htmlFor="productName">Products *</label>
                </span>
              </div>
            </div>

            {/* Product Quantity */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputTextarea
                    id="productQuantity"
                    name="productQuantity"
                    value={productQuantity}
                    placeholder="Material(s) *"
                    onChange={onChange}
                    rows={4}
                    cols={30}
                    style={{ width: "100%" }}
                    required
                  />
                  <label htmlFor="productQuantity">Quantities *</label>
                </span>
              </div>
            </div>
          </div>

          {/* DIRECTIONS & NOTES */}
          <div className="formgrid grid">
            {/* Directions */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputTextarea
                    id="directions"
                    name="directions"
                    value={directions}
                    placeholder="Enter directions"
                    onChange={onChange}
                    rows={4}
                    cols={30}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="directions">Directions</label>
                </span>
              </div>
            </div>

            {/* Notes */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputTextarea
                    id="notes"
                    name="notes"
                    value={notes}
                    placeholder="Enter notes"
                    onChange={onChange}
                    rows={4}
                    cols={30}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="notes">Notes</label>
                </span>
              </div>
            </div>
          </div>
        </form>
      </Dialog>
    </section>
  );
}

export default DeliveryForm;
