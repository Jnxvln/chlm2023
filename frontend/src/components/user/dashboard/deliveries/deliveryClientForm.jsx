import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  createDeliveryClient,
  getDeliveryClients,
  resetDeliveryClientMessages,
} from "../../../../features/deliveryClients/deliveryClientSlice";
import DialogHeader from "../../../dialogComponents/DialogHeader";
import DialogFooter from "../../../dialogComponents/DialogFooter_SubmitClose";

function DeliveryClientForm() {
  const initialState = {
    firstName: "",
    lastName: "",
    phone: "",
    companyName: "",
    address: "",
    coordinates: "",
    directions: "",
  };

  const [formDialog, setFormDialog] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const dispatch = useDispatch();
  // SELECT DELIVERY CLIENTS FROM STORE
  const {
    deliveryClients,
    deliveryClientsError,
    deliveryClientsSuccess,
    deliveryClientsMessage,
  } = useSelector((state) => state.deliveryClients);

  const {
    firstName,
    lastName,
    phone,
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
  const deliveryClientDialogHeader = () => {
    return <DialogHeader resourceType="Delivery Client" isEdit={false} />;
  };

  const deliveryClientDialogFooter = () => {
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

    if (!firstName || !lastName || !phone) {
      return toast.error(
        "First name, last name, and phone number are required fields"
      );
    }

    dispatch(createDeliveryClient(formData));
    onClose();
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
        label="New Delivery Client"
        icon="pi pi-plus"
        onClick={() => setFormDialog(true)}
      />

      <Dialog
        id="newDeliveryClientDialog"
        visible={formDialog}
        header={deliveryClientDialogHeader}
        footer={deliveryClientDialogFooter}
        onHide={onClose}
        style={{ width: "50vw" }}
        blockScroll
      >
        <form onSubmit={onSubmit}>
          {/* FIRST NAME, LAST NAME, COMPANY */}
          <div className="formgrid grid">
            {/* First Name */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    placeholder="First name *"
                    onChange={onChange}
                    style={{ width: "100%" }}
                    autoFocus
                    required
                  />
                  <label htmlFor="firstName">First Name *</label>
                </span>
              </div>
            </div>

            {/* Last Name */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    placeholder="Last name *"
                    onChange={onChange}
                    style={{ width: "100%" }}
                    required
                  />
                  <label htmlFor="lastName">Last Name *</label>
                </span>
              </div>
            </div>

            {/* Company */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="company"
                    name="company"
                    value={companyName}
                    placeholder="Company Name"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="company">Company Name</label>
                </span>
              </div>
            </div>
          </div>

          {/* PHONE, ADDRESS */}
          <div className="formgrid grid">
            {/* Phone */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputTextarea
                    id="phone"
                    name="phone"
                    value={phone}
                    placeholder="Phone(s) *"
                    onChange={onChange}
                    rows={4}
                    cols={30}
                    style={{ width: "100%" }}
                    required
                  />
                  <label htmlFor="phone">Phone(s) *</label>
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
                    placeholder="Phone(s)"
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

export default DeliveryClientForm;
