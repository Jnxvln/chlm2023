import { useState } from "react";
import { toast } from "react-toastify";
import DialogHeader from "../../../dialogComponents/DialogHeader";
import DialogFooter from "../../../dialogComponents/DialogFooter_SubmitClose";
// PrimeReact Components
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
// Store data
import { useDispatch } from "react-redux";
import { createDeliveryClient } from "../../../../features/deliveryClients/deliveryClientSlice";

function DeliveryClientForm() {
  // #region VARS ------------------------
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

  // Select deliveryClients from store
  // const { deliveryClients, deliveryClientsError, deliveryClientsSuccess, deliveryClientsMessage } =
  //   useSelector((state) => state.deliveryClients);

  // Select deliveries from store
  const { firstName, lastName, phone, companyName, address, coordinates, directions } = formData;
  // #endregion

  // #region COMPONENT RENDERERS
  const deliveryClientDialogHeader = () => {
    return <DialogHeader resourceType="Delivery Client" isEdit={false} />;
  };

  const deliveryClientDialogFooter = () => {
    return <DialogFooter onClose={onClose} onSubmit={onSubmit} />;
  };
  // #endregion

  // #region FORM HANDLERS
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
      return toast.error("First name, last name, and phone number are required fields");
    }

    dispatch(createDeliveryClient(formData));
    onClose();
  };

  // Handle form reset
  const resetForm = () => {
    setFormData(initialState);
  };

  // Handle form closing
  const onClose = () => {
    resetForm();
    setFormDialog(false);
  };
  // #endregion

  return (
    <section>
      <Button label="New Delivery Client" icon="pi pi-plus" onClick={() => setFormDialog(true)} />

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
