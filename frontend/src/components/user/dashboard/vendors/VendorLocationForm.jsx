import { useState, useEffect } from "react";
import DialogHeader from "../../../dialogComponents/DialogHeader";
import DialogFooter_SubmitClose from "../../../dialogComponents/DialogFooter_SubmitClose";
// PrimeReact Components
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
// Store data
import { useDispatch } from "react-redux";
import { createVendorLocation } from "../../../../features/vendorLocations/vendorLocationSlice";

function VendorLocationForm({ vendors, vendorLocationsLoading }) {
  // #region VARS ------------------------
  const initialState = {
    vendorId: "",
    name: "",
    isActive: true,
  };

  const [formDialog, setFormDialog] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  // Destructure form data
  const { vendorId, name, isActive } = formData;
  // #endregion

  // #region COMPONENT RENDERERS
  const vendorLocationDialogHeader = () => {
    return <DialogHeader resourceType="Vendor Location" isEdit={false} />;
  };

  const vendorLocationDialogFooter = () => {
    return <DialogFooter_SubmitClose onClose={onClose} onSubmit={onSubmit} />;
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
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submit
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createVendorLocation(formData));
    onClose();
  };
  // #endregion

  return (
    <section>
      <Button label="New Vendor Location" icon="pi pi-plus" onClick={() => setFormDialog(true)} />

      <Dialog
        id="newVendorLocationDialog"
        visible={formDialog}
        header={vendorLocationDialogHeader}
        footer={vendorLocationDialogFooter}
        onHide={onClose}
        style={{ minWidth: "40vw" }}
        blockScroll
      >
        <form onSubmit={onSubmit}>
          {/* VENDOR, NAME */}
          <div className="formgrid grid">
            {/* Vendor */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <Dropdown
                    name="vendorId"
                    optionLabel="name"
                    optionValue="_id"
                    value={vendorId}
                    options={vendors}
                    onChange={onChange}
                    placeholder="Choose..."
                    style={{ width: "100%" }}
                    required
                    autoFocus
                  />
                  <label htmlFor="vendorId">Vendor</label>
                </span>
              </div>
            </div>

            {/* Name */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="name"
                    name="name"
                    value={name}
                    placeholder="Name"
                    onChange={onChange}
                    style={{ width: "100%" }}
                    required
                  />
                  <label htmlFor="name">Name</label>
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

export default VendorLocationForm;
