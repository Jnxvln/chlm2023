import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";

import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { createMaterial } from "../../../../features/materials/materialSlice";
import { getMaterialCategories } from "../../../../features/materialCategory/materialCategorySlice";
import DialogHeader from "../../../dialogComponents/DialogHeader";
import DialogFooter from "../../../dialogComponents/DialogFooter_SubmitClose";

function MaterialForm() {
  const initialState = {
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

  // SELECT MATERIALS FROM STORE
  const { materials, materialsError, materialsSuccess, materialsMessage } =
    useSelector((state) => state.materials);

  // SELECT MATERIAL CATEGORIES FROM STORE
  const {
    materialCategories,
    materialCategoriesError,
    materialCategoriesMessage,
  } = useSelector((state) => state.materialCategories);

  const {
    category,
    name,
    image,
    binNumber,
    size,
    stock,
    notes,
    description,
    isFeatured,
    isTruckable,
    isActive,
  } = formData;

  // #region COMPONENT RENDERERS
  const materialDialogHeader = () => {
    return <DialogHeader resourceType="Material" isEdit={false} />;
  };

  const materialDialogFooter = () => {
    return <DialogFooter onClose={onClose} onSubmit={onSubmit} />;
  };
  // #endregion

  const resetForm = () => {
    setFormData(initialState);
  };

  const onClose = () => {
    resetForm();
    setFormDialog(false);
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createMaterial(formData));
    onClose();
  };

  useEffect(() => {
    if (materialsError) {
      toast.error(materialsMessage);
    }

    if (materialsSuccess) {
      toast.success(materialsMessage);
    }

    if (materialCategoriesError) {
      toast.error(materialCategoriesMessage);
    }

    if (materialCategories.length === 0) {
      dispatch(getMaterialCategories());
    }
  }, [
    materials,
    materialsError,
    materialsSuccess,
    materialsMessage,
    materialCategories,
    materialCategoriesError,
    materialCategoriesMessage,
    dispatch,
  ]);

  return (
    <section>
      <Button
        label="New Material"
        icon="pi pi-plus"
        onClick={() => setFormDialog(true)}
      />

      <Dialog
        id="newMaterialDialog"
        visible={formDialog}
        header={materialDialogHeader}
        footer={materialDialogFooter}
        onHide={onClose}
        style={{ width: "50vw" }}
        blockScroll
      >
        <form onSubmit={onSubmit}>
          {/* NAME, CATEGORY, BIN NUMBER */}
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
                  <InputText
                    id="binNumber"
                    name="binNumber"
                    value={binNumber}
                    placeholder="Bin #"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
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
                  <InputText
                    id="image"
                    name="image"
                    value={image}
                    placeholder="Image"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="image">Image</label>
                </span>
              </div>
            </div>

            {/* Size */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="size"
                    name="size"
                    value={size}
                    placeholder="Size"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
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
              <InputSwitch
                id="isFeatured"
                name="isFeatured"
                checked={isFeatured}
                onChange={onChange}
              />
              <strong style={{ marginLeft: "0.5em" }}>Featured</strong>
            </div>

            {/* Truckable */}
            <div style={{ margin: "0.8em 0" }}>
              <InputSwitch
                id="isTruckable"
                name="isTruckable"
                checked={isTruckable}
                onChange={onChange}
              />
              <strong style={{ marginLeft: "0.5em" }}>Truckable</strong>
            </div>

            {/* Active */}
            <div style={{ margin: "0.8em 0" }}>
              <InputSwitch
                id="isActive"
                name="isActive"
                checked={isActive}
                onChange={onChange}
              />
              <strong style={{ marginLeft: "0.5em" }}>Active</strong>
            </div>
          </div>
        </form>
      </Dialog>
    </section>
  );
}

export default MaterialForm;
