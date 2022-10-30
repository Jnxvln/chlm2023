import { useState, useEffect } from "react";
import DialogHeader from "../../../dialogComponents/DialogHeader";
import DialogFooter from "../../../dialogComponents/DialogFooter_SubmitClose";
// PrimeReact Components
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputTextarea } from "primereact/inputtextarea";
// Select data
import { useSelector, useDispatch } from "react-redux";
import { updateMaterial } from "../../../../features/materials/materialSlice";

function EditMaterialForm({ material }) {
  // #region VARS ------------------------
  const initialState = {
    _id: "",
    category: "",
    name: "",
    image: "",
    binNumber: "",
    size: "",
    stock: "",
    notes: "",
    description: "",
    isFeatured: false,
    isTruckable: false,
    isActive: true,
  };

  const stockStatuses = [
    {
      label: "New",
      value: "new",
    },
    {
      label: "In",
      value: "in",
    },
    {
      label: "Low",
      value: "low",
    },
    {
      label: "Out",
      value: "out",
    },
    {
      label: "Not Avail",
      value: "notavail",
    },
  ];

  const [formDialog, setFormDialog] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  // Select materials from state
  const { materialCategories } = useSelector((state) => state.materialCategories);

  const { _id, category, name, image, binNumber, size, stock, notes, description, isFeatured, isTruckable, isActive } = formData;
  // #endregion

  // #region COMPONENT RENDERERS
  const materialDialogHeader = () => {
    return <DialogHeader resourceType="Material" resourceName={material.name} isEdit />;
  };

  const materialDialogFooter = () => {
    return <DialogFooter onClose={onClose} onSubmit={onSubmit} />;
  };
  // #endregion

  // #region FORM HANDLERS
  // Handle reset form
  const resetForm = () => {
    if (material) {
      setFormData((prevState) => ({
        ...prevState,
        _id: material._id,
        name: material.name,
        category: material.category,
        image: material.image,
        binNumber: material.binNumber,
        size: material.size,
        stock: material.stock,
        notes: material.notes,
        description: material.description,
        isFeatured: material.isFeatured,
        isActive: material.isFeatured,
        isTruckable: material.isTruckable,
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
  // Handle form change
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submit
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(updateMaterial(formData));
    onClose();
  };
  // #endregion

  // Fill FormData with contents of Material prop
  useEffect(() => {
    if (material) {
      setFormData((prevState) => ({
        ...prevState,
        _id: material._id,
        name: material.name,
        category: material.category,
        image: material.image,
        binNumber: material.binNumber,
        size: material.size,
        stock: material.stock,
        notes: material.notes,
        description: material.description,
        isFeatured: material.isFeatured,
        isActive: material.isFeatured,
        isTruckable: material.isTruckable,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      <Button icon="pi pi-pencil" iconPos="left" style={{ marginRight: "0.5em" }} onClick={(e) => setFormDialog(true)} />

      <Dialog
        id="editMaterialDialog"
        visible={formDialog}
        style={{ width: "50vw" }}
        header={materialDialogHeader}
        footer={materialDialogFooter}
        onHide={onClose}
        blockScroll
      >
        <form onSubmit={onSubmit}>
          {/* NAME, CATEGORY, BIN NUMBER */}
          <div className="formgrid grid">
            {/* ID */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText id="_id" name="_id" value={_id} placeholder="ID" onChange={onChange} style={{ width: "100%" }} readOnly required />
                  <label htmlFor="_id">ID</label>
                </span>
              </div>
            </div>

            {/* Name */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText id="name" name="name" value={name} placeholder="Name" onChange={onChange} style={{ width: "100%" }} autoFocus required />
                  <label htmlFor="name">Name</label>
                </span>
              </div>
            </div>

            {/* Category */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <Dropdown
                    name="category"
                    optionLabel="name"
                    optionValue="_id"
                    value={category}
                    options={materialCategories}
                    onChange={onChange}
                    filter
                    showClear
                    filterBy="name"
                    placeholder="Choose..."
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="category">Category</label>
                </span>
              </div>
            </div>

            {/* Bin Number */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText id="binNumber" name="binNumber" value={binNumber} placeholder="Bin #" onChange={onChange} style={{ width: "100%" }} />
                  <label htmlFor="binNumber">Bin #</label>
                </span>
              </div>
            </div>
          </div>

          {/* IMAGE, SIZE, STOCK */}
          <div className="formgrid grid">
            {/* Image */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText id="image" name="image" value={image} placeholder="Image" onChange={onChange} style={{ width: "100%" }} />
                  <label htmlFor="image">Image</label>
                </span>
              </div>
            </div>

            {/* Size */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText id="size" name="size" value={size} placeholder="Size" onChange={onChange} style={{ width: "100%" }} />
                  <label htmlFor="size">Size</label>
                </span>
              </div>
            </div>

            {/* Stock */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <Dropdown
                    name="stock"
                    optionLabel="label"
                    optionValue="value"
                    value={stock}
                    options={stockStatuses}
                    onChange={onChange}
                    placeholder="Choose..."
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="stock">Stock</label>
                </span>
              </div>
            </div>
          </div>

          {/* NOTES, DESCRIPTION */}
          <div className="formgrid grid">
            {/* Notes */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputTextarea id="notes" name="notes" value={notes} placeholder="Notes" onChange={onChange} rows={5} cols={30} style={{ width: "100%" }} />
                  <label htmlFor="notes">Notes</label>
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputTextarea
                    id="description"
                    name="description"
                    value={description}
                    placeholder="Description"
                    onChange={onChange}
                    rows={5}
                    cols={30}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="description">Description</label>
                </span>
              </div>
            </div>
          </div>

          {/* FEATURED, TRUCKABLE, ACTIVE  */}
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              gap: "25px",
            }}
          >
            {/* Featured */}
            <div style={{ margin: "0.8em" }}>
              <InputSwitch id="isFeatured" name="isFeatured" checked={isFeatured} onChange={onChange} />
              <strong style={{ marginLeft: "0.5em" }}>Featured</strong>
            </div>

            {/* Truckable */}
            <div style={{ margin: "0.8em 0" }}>
              <InputSwitch id="isTruckable" name="isTruckable" checked={isTruckable} onChange={onChange} />
              <strong style={{ marginLeft: "0.5em" }}>Truckable</strong>
            </div>

            {/* Active */}
            <div style={{ margin: "0.8em 0" }}>
              <InputSwitch id="isActive" name="isActive" checked={isActive} onChange={onChange} />
              <strong style={{ marginLeft: "0.5em" }}>Active</strong>
            </div>
          </div>
        </form>
      </Dialog>
    </section>
  );
}

export default EditMaterialForm;
