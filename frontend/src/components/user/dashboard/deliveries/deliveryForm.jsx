import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { AutoComplete } from "primereact/autocomplete";

import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  createDeliveryClient,
  getDeliveryClients,
  resetDeliveryClientMessages,
} from "../../../../features/deliveryClients/deliveryClientSlice";
import DialogHeader from "../../../dialogComponents/DialogHeader";
import DialogFooter from "../../../dialogComponents/DialogFooter_SubmitClose";

function DeliveryForm() {
  const initialState = {
    deliveryDate: null,
    contactName: "",
    contactPhone: "",
    phone: "",
    companyName: "",
    address: "",
    coordinates: "",
    directions: "",
  };

  const [formDialog, setFormDialog] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [selectedDeliveryClient, setSelectedDeliveryClient] = useState(null);
  const [filteredDeliveryClients, setFilteredDeliveryClients] = useState(null);

  const dispatch = useDispatch();
  // SELECT DELIVERY CLIENTS FROM STORE
  const {
    deliveryClients,
    deliveryClientsError,
    deliveryClientsSuccess,
    deliveryClientsMessage,
  } = useSelector((state) => state.deliveryClients);

  const {
    deliveryDate,
    contactName,
    contactPhone,
    companyName,
    address,
    coordinates,
    directions,
  } = formData;

  const resetForm = () => {
    setFormData(initialState);
  };

  const onClose = () => {
    resetForm();
    setFormDialog(false);
  };

  // #region COMPONENT RENDERERS
  const deliveryDialogHeader = () => {
    return <DialogHeader resourceType="Delivery" isEdit={false} />;
  };

  const deliveryDialogFooter = () => {
    return <DialogFooter onClose={onClose} onSubmit={onSubmit} />;
  };
  // #endregion

  // Handle form text input
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

    if (!contactName || !contactPhone) {
      return toast.error("First name and last name are required fields");
    }

    dispatch(createDeliveryClient(formData));
    onClose();
  };

  const deliveryClientItemTemplate = (client) => {
    return (
      <div>
        <div style={{ marginBottom: "0.5em" }}>
          <strong>Name: </strong>
          <span>
            {client.firstName} {client.lastName}
          </span>
        </div>
        <div style={{ marginBottom: "0.5em" }}>
          <strong>Phone: </strong>
          <div style={{ whiteSpace: "pre" }}>{client.phone}</div>
        </div>
        <div style={{ marginBottom: "0.5em" }}>
          <strong>Address:</strong>
          <address style={{ whiteSpace: "pre", fontStyle: "normal" }}>
            {client.address}
          </address>
        </div>
      </div>
    );
  };

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

  useEffect(() => {
    if (deliveryClientsError) {
      toast.error(deliveryClientsMessage);
    }

    if (deliveryClientsSuccess && deliveryClientsMessage.length > 0) {
      toast.success(deliveryClientsMessage);
    }

    if (deliveryClients.length === 0) {
      dispatch(getDeliveryClients());
    }

    dispatch(resetDeliveryClientMessages());
  }, [
    deliveryClients,
    deliveryClientsError,
    deliveryClientsSuccess,
    deliveryClientsMessage,
    dispatch,
  ]);

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
          {/* DELIVERY DATE, CONTACT NAME */}
          <div className="formgrid grid">
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
                  ></Calendar>
                  <label htmlFor="deliveryDate">Delivery Date</label>
                </span>
              </div>
            </div>
          </div>

          {/* DELIVERY CLIENT NAME */}
          <div className="formgrid grid">
            <div className="field col">
              <AutoComplete
                id="contactName"
                name="contactName"
                value={selectedDeliveryClient}
                placeholder="Contact Name"
                suggestions={filteredDeliveryClients}
                completeMethod={searchDeliveryClient}
                field="firstName"
                itemTemplate={deliveryClientItemTemplate}
                onChange={(e) => setSelectedDeliveryClient(e.value)}
                style={{ width: "100%" }}
              />
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

          {/* DIRECTIONS */}
          <div className="formgrid grid">
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="directions"
                    name="directions"
                    value={directions}
                    placeholder="Enter directions..."
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="directions">Directions</label>
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
