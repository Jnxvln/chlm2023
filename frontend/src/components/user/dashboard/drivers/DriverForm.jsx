import { useState, useEffect } from "react";
import { toast } from "react-toastify";
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
import { createDriver } from "../../../../api/drivers/driversApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function DriverForm() {
  const queryClient = useQueryClient();
  // #region VARS ------------------------
  const initialState = {
    firstName: "",
    lastName: "",
    endDumpPayRate: null,
    flatBedPayRate: null,
    ncRate: null,
    defaultTruck: "",
    dateHired: "",
    dateReleased: "",
    isActive: true,
  };

  const [formDialog, setFormDialog] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const user = useQuery(["user"], () => JSON.parse(localStorage.getItem("user")));

  const mutation = useMutation({
    mutationKey: ["drivers"],
    mutationFn: ({ formData, token }) => createDriver(formData, token),
    onSuccess: () => {
      toast.success("Driver created", { autoClose: 1000 });
      queryClient.invalidateQueries(["drivers"]);
    },
    onError: (err) => {
      console.log("Error while creating driver: ");
      console.log(err);
      toast.error("Error creating driver", { autoClose: false });
    },
  });

  // Destructure form data
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
  // #endregion

  // #region COMPONENT RENDERERS
  const driverDialogHeader = () => {
    return <DialogHeader resourceType="Driver" isEdit={false} />;
  };

  const driverDialogFooter = () => {
    return <DialogFooter onClose={onClose} onSubmit={onSubmit} />;
  };
  // #endregion

  // #region FORM HANDLERS
  // Handle form reset
  const resetForm = () => {
    setFormData(initialState);
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
      [e.originalEvent.target.name]: e.value,
    }));
  };

  // Handle form submit
  const onSubmit = (e) => {
    e.preventDefault();

    if (!firstName) {
      return toast.error("First name is required");
    }

    if (!lastName) {
      return toast.error("First name is required");
    }

    if (!endDumpPayRate) {
      return toast.error("End dump pay rate is required");
    }

    if (!flatBedPayRate) {
      return toast.error("Flat bed pay rate is required");
    }

    if (!ncRate) {
      return toast.error("Non-commission rate is required");
    }

    // dispatch(createDriver(formData));
    mutation.mutate({ formData, token: user.data.token });
    onClose();
  };
  // #endregion

  return (
    <section>
      <Button label="New Driver" icon="pi pi-plus" onClick={() => setFormDialog(true)} />

      <Dialog
        id="newDriverDialog"
        visible={formDialog}
        header={driverDialogHeader}
        footer={driverDialogFooter}
        onHide={onClose}
        style={{ width: "50vw" }}
        blockScroll
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
                    placeholder="Last name"
                    onChange={onChange}
                    style={{ width: "100%" }}
                    required
                  />
                  <label htmlFor="lastName">Last Name *</label>
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
                <label htmlFor="endDumpPayRate">End Dump Pay Rate *</label>
                <InputNumber
                  id="endDumpPayRate"
                  name="endDumpPayRate"
                  value={endDumpPayRate}
                  placeholder="End dump Rate"
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
                <label htmlFor="flatBedPayRate">Flatbed Pay Rate *</label>
                <InputNumber
                  id="flatBedPayRate"
                  name="flatBedPayRate"
                  value={flatBedPayRate}
                  placeholder="Flatbed Rate"
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
                <label htmlFor="ncRate">Non-commission Rate *</label>
                <InputNumber
                  id="ncRate"
                  name="ncRate"
                  value={ncRate}
                  placeholder="NC Rate *"
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
                    value={dateHired}
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
        </form>
      </Dialog>
    </section>
  );
}

export default DriverForm;
