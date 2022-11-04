import { useState, useEffect } from "react";
import DialogHeader from "../../../dialogComponents/DialogHeader";
import DialogFooter_SubmitClose from "../../../dialogComponents/DialogFooter_SubmitClose";
// PrimeReact Components
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { InputNumber } from "primereact/inputnumber";
// Store data
import { useSelector, useDispatch } from "react-redux";
import { createVendor } from "../../../../features/vendors/vendorSlice";
import { getVendorLocations } from "../../../../features/vendorLocations/vendorLocationSlice";

function VendorForm() {
  // #region VARS ------------------------
  const initialState = {
    name: "",
    locations: [],
    shortName: "",
    chtFuelSurcharge: 0,
    vendorFuelSurcharge: 0,
    isActive: true,
  };

  // const [vendorLocations, setVendorLocations] = useState([]);
  const [formDialog, setFormDialog] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  // Get VendorLocations from store
  const { vendorLocations } = useSelector((state) => state.vendorLocations);

  // Destructure form data
  const { name, locations, shortName, chtFuelSurcharge, vendorFuelSurcharge, isActive } = formData;
  // #endregion

  // #region COMPONENT RENDERERS
  const vendorDialogHeader = () => {
    return <DialogHeader resourceType="Vendor" isEdit={false} />;
  };

  const vendorDialogFooter = () => {
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
    dispatch(createVendor(formData));
    onClose();
  };
  // #endregion

  useEffect(() => {
    if (!vendorLocations || vendorLocations.length <= 0) {
      dispatch(getVendorLocations());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      <Button label="New Vendor" icon="pi pi-plus" onClick={() => setFormDialog(true)} />

      <Dialog
        id="newVendorDialog"
        visible={formDialog}
        header={vendorDialogHeader}
        footer={vendorDialogFooter}
        onHide={onClose}
        blockScroll
      >
        <form onSubmit={onSubmit}>
          {/* NAME, SHORT NAME */}
          <div className="formgrid grid">
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
                    autoFocus
                    required
                  />
                  <label htmlFor="name">Name</label>
                </span>
              </div>
            </div>

            {/* Short Name */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="shortName"
                    name="shortName"
                    value={shortName}
                    placeholder="Short name"
                    onChange={onChange}
                    style={{ width: "100%" }}
                    required
                  />
                  <label htmlFor="shortName">Short Name</label>
                </span>
              </div>
            </div>
          </div>

          {/* CHT FUEL SURCHARGE, VENDOR FUEL SURCHARGE */}
          <div className="formgrid grid">
            {/* CHT Fuel Surcharge */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <label htmlFor="chtFuelSurcharge">CHT Fuel Schg</label>
                <InputNumber
                  id="chtFuelSurcharge"
                  name="chtFuelSurcharge"
                  value={chtFuelSurcharge}
                  placeholder="CHT Fuel Schg"
                  mode="decimal"
                  minFractionDigits={2}
                  step={0.01}
                  onChange={onChangeNumber}
                  style={{ width: "100%" }}
                  required
                />
              </div>
            </div>

            {/* Vendor Fuel Surcharge */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <label htmlFor="vendorFuelSurcharge">Vendor Fuel Schg</label>
                <InputNumber
                  id="vendorFuelSurcharge"
                  name="vendorFuelSurcharge"
                  value={vendorFuelSurcharge}
                  placeholder="Vendor Fuel Schg"
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

export default VendorForm;
