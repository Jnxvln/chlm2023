import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import Spinner from "../../../../components/layout/Spinner";

import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { createDriver, resetDriverMessages } from "../../../../features/drivers/driverSlice";
import { getDrivers } from "../../../../features/drivers/driverSlice";

function DriverForm() {
  const initialState = {
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
  // SELECT DRIVERS FROM STORE
  const { drivers, driversLoading, driversError, driversSuccess, driversMessage } = useSelector(
    (state) => state.drivers
  );

  const {
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

  const resetForm = () => {
    setFormData(initialState);
  };

  const onClose = () => {
    resetForm();
    setFormDialog(false);
  };

  const renderFooter = () => {
    return (
      <div>
        <Button
          type="button"
          label="Cancel"
          icon="pi pi-times"
          onClick={onClose}
          className="p-button-text"
        />
      </div>
    );
  };

  const onChange = (e) => {
    console.log(e.target.value);
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createDriver(formData));
    onClose();
  };

  useEffect(() => {
    if (driversError) {
      toast.error(driversMessage);
    }

    if (driversSuccess) {
      toast.success(driversMessage);
    }

    if (drivers.length === 0) {
      dispatch(getDrivers());
    }

    dispatch(resetDriverMessages());
  }, [drivers, driversError, driversSuccess, driversMessage, dispatch]);

  if (driversLoading) {
    return <Spinner />;
  }

  return (
    <section>
      <Button label="New Driver" icon="pi pi-plus" onClick={() => setFormDialog(true)} />

      <Dialog
        header="Driver Dialog"
        visible={formDialog}
        footer={renderFooter}
        onHide={onClose}
        style={{ width: "50vw" }}
      >
        <form onSubmit={onSubmit}>
          {/* FIRST NAME, LAST NAME, DEFAULT TRUCK */}
          <div className="formgrid grid">
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
                <span className="p-float-label">
                  <InputText
                    id="endDumpPayRate"
                    name="endDumpPayRate"
                    value={endDumpPayRate}
                    placeholder="ED Rate"
                    onChange={onChange}
                    style={{ width: "100%" }}
                    required
                  />
                  <label htmlFor="endDumpPayRate">End Dump Pay Rate</label>
                </span>
              </div>
            </div>

            {/* Flatbed Pay Rate */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="flatBedPayRate"
                    name="flatBedPayRate"
                    value={flatBedPayRate}
                    placeholder="FB Rate"
                    onChange={onChange}
                    style={{ width: "100%" }}
                    required
                  />
                  <label htmlFor="flatBedPayRate">Flatbed Pay Rate</label>
                </span>
              </div>
            </div>

            {/* NC Rate */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="ncRate"
                    name="ncRate"
                    value={ncRate}
                    placeholder="NC Rate"
                    onChange={onChange}
                    style={{ width: "100%" }}
                    required
                  />
                  <label htmlFor="ncRate">Non-commission Rate</label>
                </span>
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
                    value={dateHired}
                    onChange={onChange}
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
                    value={dateReleased}
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

          <div style={{ marginTop: "1em" }}>
            <Button type="submit" label="Save" iconPos="left" icon="pi pi-save" />
          </div>
        </form>
      </Dialog>
    </section>
  );
}

export default DriverForm;
