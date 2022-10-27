import { useState, useEffect } from "react";
import DialogHeader from "../../../dialogComponents/DialogHeader";
import DialogFooter from "../../../dialogComponents/DialogFooter_SubmitClose";
// PrimeReact Components
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
// Store data
import { useDispatch } from "react-redux";
import { updateDriver } from "../../../../features/drivers/driverSlice";

function EditDriverForm({ driver }) {
  // #region VARS ------------------------
  const initialState = {
    _id: "",
    firstName: "",
    lastName: "",
    endDumpPayRate: "",
    flatBedPayRate: "",
    ncRate: "",
    defaultTruck: "",
    dateHired: "",
    dateReleased: "",
    isActive: true,
  };
  const [formDialog, setFormDialog] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  // Destructure form data
  const {
    _id,
    firstName,
    lastName,
    endDumpPayRate,
    flatBedPayRate,
    ncRate,
    defaultTruck,
    dateHired,
    dateReleased,
    isActive,
  } = formData;
  // #endregion

  // #region COMPONENT RENDERERS
  const driverDialogHeader = () => {
    return (
      <DialogHeader
        resourceType="Driver"
        resourceName={`${driver.firstName} ${driver.lastName}`}
        isEdit
      />
    );
  };

  const driverDialogFooter = () => {
    return <DialogFooter onClose={onClose} onSubmit={onSubmit} />;
  };
  // #endregion

  // #region FORM HANDLERS
  // Handle form reset
  const resetForm = () => {
    if (driver) {
      setFormData((prevState) => ({
        ...prevState,
        _id: driver._id,
        firstName: driver.firstName,
        lastName: driver.lastName,
        endDumpPayRate: driver.endDumpPayRate,
        flatBedPayRate: driver.flatBedPayRate,
        ncRate: driver.ncRate,
        defaultTruck: driver.defaultTruck,
        dateHired: driver.dateHired,
        dateReleased: driver.dateReleased,
        isActive: driver.isActive,
      }));
    } else {
      setFormData(initialState);
    }
  };

  // Handle form closing
  const onClose = () => {
    resetForm();
    setFormDialog(false);
  };

  // Handle form text input
  const onChange = (e) => {
    if (e.hasOwnProperty("target")) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  // Handle form number input
  const onChangeNumber = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.originalEvent.target.name]: e.originalEvent.target.value,
    }));
  };

  // Handle form submit
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(updateDriver(formData));
    onClose();
  };
  // #endregion

  // Set form data to `driver` prop
  useEffect(() => {
    if (driver) {
      setFormData((prevState) => ({
        ...prevState,
        _id: driver._id,
        firstName: driver.firstName,
        lastName: driver.lastName,
        endDumpPayRate: driver.endDumpPayRate,
        flatBedPayRate: driver.flatBedPayRate,
        ncRate: driver.ncRate,
        defaultTruck: driver.defaultTruck,
        dateHired: driver.dateHired,
        dateReleased: driver.dateReleased,
        isActive: driver.isActive,
      }));
    }
  }, [driver]);

  return (
    <section>
      <Button
        icon="pi pi-pencil"
        iconPos="left"
        style={{ marginRight: "0.5em" }}
        onClick={() => setFormDialog(true)}
      />

      <Dialog
        id="editDriverDialog"
        visible={formDialog}
        style={{ width: "50vw" }}
        header={driverDialogHeader}
        footer={driverDialogFooter}
        onHide={onClose}
        blockScroll
      >
        <form onSubmit={onSubmit}>
          {/* FIRST NAME, LAST NAME, DEFAULT TRUCK */}
          <div className="formgrid grid">
            {/* ID */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="_id"
                    name="_id"
                    value={_id}
                    placeholder="ID"
                    onChange={onChange}
                    style={{ width: "100%" }}
                    readOnly
                    required
                  />
                  <label htmlFor="_id">ID</label>
                </span>
              </div>
            </div>

            {/* First Name */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    placeholder="First name"
                    onChange={onChange}
                    style={{ width: "100%" }}
                    autoFocus
                    required
                  />
                  <label htmlFor="firstName">First Name</label>
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
                    placeholder="Last name"
                    onChange={onChange}
                    style={{ width: "100%" }}
                    required
                  />
                  <label htmlFor="lastName">Last Name</label>
                </span>
              </div>
            </div>

            {/* Default Truck */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="defaultTruck"
                    name="defaultTruck"
                    value={defaultTruck}
                    placeholder="Truck #"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="defaultTruck">Truck #</label>
                </span>
              </div>
            </div>
          </div>

          {/* ENDDUMP RATE, FLATBED RATE, NC RATE */}
          <div className="formgrid grid">
            {/* End Dump Pay Rate */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <label htmlFor="endDumpPayRate">End Dump Pay Rate</label>
                <InputNumber
                  id="endDumpPayRate"
                  name="endDumpPayRate"
                  value={endDumpPayRate}
                  placeholder="ED Rate"
                  mode="decimal"
                  minFractionDigits={2}
                  step={0.01}
                  onChange={onChangeNumber}
                  style={{ width: "100%" }}
                  required
                />
              </div>
            </div>

            {/* Flatbed Pay Rate */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <label htmlFor="flatBedPayRate">Flatbed Pay Rate</label>
                <InputNumber
                  id="flatBedPayRate"
                  name="flatBedPayRate"
                  value={flatBedPayRate}
                  placeholder="FB Rate"
                  mode="decimal"
                  minFractionDigits={2}
                  step={0.01}
                  onChange={onChangeNumber}
                  style={{ width: "100%" }}
                  required
                />
              </div>
            </div>

            {/* NC Rate */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <label htmlFor="ncRate">Non-commission Rate</label>
                <InputNumber
                  id="ncRate"
                  name="ncRate"
                  value={ncRate}
                  placeholder="NC Rate"
                  mode="decimal"
                  minFractionDigits={2}
                  step={0.01}
                  onChange={onChangeNumber}
                  style={{ width: "100%" }}
                  required
                />
              </div>
            </div>
          </div>

          {/* DATE HIRED, DATE RELEASED */}
          <div className="formgrid grid">
            {/* Date Hired */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <Calendar
                    id="dateHired"
                    name="dateHired"
                    value={new Date(dateHired)}
                    onChange={onChange}
                    selectOtherMonths
                    style={{ width: "100%" }}
                  ></Calendar>
                  <label htmlFor="dateHired">Date Hired</label>
                </span>
              </div>
            </div>

            {/* Date Released */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <Calendar
                    id="dateReleased"
                    name="dateReleased"
                    value={new Date(dateReleased)}
                    onChange={onChange}
                    style={{ width: "100%" }}
                  ></Calendar>
                  <label htmlFor="dateReleased">Date Released</label>
                </span>
              </div>
            </div>
          </div>

          {/* IS ACTIVE */}
          <div className="formgrid grid">
            {/* IsActive */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <InputSwitch id="isActive" name="isActive" checked={isActive} onChange={onChange} />
                <strong style={{ marginLeft: "0.5em" }}>Active</strong>
              </div>
            </div>
          </div>
        </form>
      </Dialog>
    </section>
  );
}

export default EditDriverForm;
