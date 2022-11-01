import { useState, useEffect } from "react";
import DialogHeader from "../../../dialogComponents/DialogHeader";
import DialogFooter_SubmitClose from "../../../dialogComponents/DialogFooter_SubmitClose";
// PrimeReact Components
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
// Store data
import { useDispatch } from "react-redux";
import { createVendorProduct } from "../../../../features/vendorProducts/vendorProductSlice";
import { toast } from "react-toastify";

function VendorProductForm({ vendors, vendorLocations }) {
  // #region VARS ------------------------
  const initialState = {
    vendorId: undefined,
    vendorLocationId: undefined,
    name: "",
    productCost: undefined,
    notes: "",
    isActive: true,
  };

  const [sortedVendors, setSortedVendors] = useState([]);
  const [filteredVendorLocations, setFilteredVendorLocations] = useState([]);
  const [formDialog, setFormDialog] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  // Destructure form data
  const { vendorId, vendorLocationId, name, productCost, notes, isActive } = formData;
  // #endregion

  // #region COMPONENT RENDERERS
  const vendorProductDialogHeader = () => {
    return <DialogHeader resourceType="Vendor Product" isEdit={false} />;
  };

  const vendorProductDialogFooter = () => {
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

    if (!vendorId) {
      return toast.error("A vendor is required");
    }

    if (!name) {
      return toast.error("A product name is required");
    }

    if (!productCost) {
      return toast.error("A product cost is required (or 0)");
    }

    dispatch(createVendorProduct(formData));
    onClose();
  };
  // #endregion

  // #region TEMPLATES
  const vendorOptionTemplate = (option) => {
    return <>{option.name}</>;
  };

  const vendorLocationOptionTemplate = (option) => {
    return <>{option.name}</>;
  };
  // #endregion

  useEffect(() => {
    // Sort vendors alphabetically
    if (vendors && vendors.length > 1) {
      setSortedVendors([...vendors].sort((a, b) => a.name.localeCompare(b.name)));
    }

    // Get vendor locations according to vendorId selected
    if (vendorId && vendorId.length > 0 && vendorLocations && vendorLocations.length > 0) {
      const _filteredLocations = vendorLocations.filter((loc) => loc.vendorId === vendorId);
      setFilteredVendorLocations(_filteredLocations);
    }
  }, [vendors, vendorId, vendorLocations]);

  return (
    <section>
      <Button label="New Vendor Product" icon="pi pi-plus" onClick={() => setFormDialog(true)} />

      <Dialog
        id="newVendorProductDialog"
        visible={formDialog}
        header={vendorProductDialogHeader}
        footer={vendorProductDialogFooter}
        onHide={onClose}
        blockScroll
      >
        <form onSubmit={onSubmit}>
          {/* VENDOR, VENDOR LOCATION */}
          <div className="formgrid grid">
            {/* Vendor Id */}
            <div className="field col">
              <div className="p-float-label">
                <Dropdown
                  id="vendorProductVendorId"
                  value={vendorId}
                  options={sortedVendors}
                  onChange={(e) => {
                    setFormData((prevState) => ({
                      ...prevState,
                      vendorId: e.value,
                    }));
                  }}
                  optionLabel="name"
                  optionValue="_id"
                  placeholder="Choose vendor"
                  itemTemplate={vendorOptionTemplate}
                  style={{ width: "100%" }}
                  required
                  autoFocus
                />
                <label htmlFor="vendorProductVendorId">Vendor *</label>
              </div>
            </div>

            {/* Vendor Location ID */}
            <div className="field col">
              <div className="p-float-label">
                <Dropdown
                  id="vendorLocationId"
                  value={vendorLocationId}
                  options={filteredVendorLocations}
                  onChange={(e) => {
                    setFormData((prevState) => ({
                      ...prevState,
                      vendorLocationId: e.value,
                    }));
                  }}
                  optionLabel="name"
                  optionValue="_id"
                  placeholder="Location..."
                  itemTemplate={vendorLocationOptionTemplate}
                  style={{ width: "100%" }}
                  required
                  autoFocus
                />
                <label htmlFor="vendorLocationId">Location *</label>
              </div>
            </div>
          </div>

          {/* NAME, PRODUCT COST */}
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
                    required
                  />
                  <label htmlFor="name">Name *</label>
                </span>
              </div>
            </div>

            {/* Product Cost */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputNumber
                    id="productCost"
                    name="productCost"
                    value={productCost}
                    placeholder="Product Cost"
                    mode="decimal"
                    minFractionDigits={2}
                    step={0.01}
                    onChange={onChangeNumber}
                    style={{ width: "100%" }}
                    required
                  />
                  <label htmlFor="productCost">Product Cost *</label>
                </span>
              </div>
            </div>
          </div>

          {/* NOTES */}
          <div className="formgrid grid">
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputTextarea
                    id="notes"
                    name="notes"
                    value={notes}
                    placeholder="Notes"
                    onChange={onChange}
                    rows={5}
                    cols={30}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="notes">Notes</label>
                </span>
              </div>
            </div>
          </div>

          {/* IS ACTIVE */}
          <div className="formgrid grid">
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

export default VendorProductForm;
