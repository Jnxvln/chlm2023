import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputTextarea } from "primereact/inputtextarea";
import { toast } from "react-toastify";

// import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { updateMaterial } from "../../../../features/materials/materialSlice";
// import { getMaterialCategories } from "../../../../features/materialCategory/materialCategorySlice";

function EditMaterialForm({ material }) {
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
      label: 'New',
      value: 'new'
    },
    {
      label: 'In',
      value: 'in'
    },
    {
      label: 'Low',
      value: 'low'
    },
    {
      label: 'Out',
      value: 'out'
    },
    {
      label: 'Not Avail',
      value: 'notavail'
    }
  ]

  const [formDialog, setFormDialog] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  // SELECT MATERIAL CATEGORIES FROM STORE
  const {
    materialCategories,
    materialCategoriesError,
    materialCategoriesSuccess,
    materialCategoriesMessage,
  } = useSelector((state) => state.materialCategories);

  const {
    _id,
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

  const onClose = () => {
    // resetForm();
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
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(updateMaterial(formData));
    onClose();
  };

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

  useEffect(() => {
    if (materialCategoriesError) {
      toast.error(materialCategoriesMessage);
    }

    if (materialCategoriesSuccess) {
      toast.success(materialCategoriesSuccess);
    }
  }, [
    materialCategoriesError,
    materialCategoriesSuccess,
    materialCategoriesMessage,
    dispatch,
  ]);

  return (
    <section>
      <Button
        icon="pi pi-pencil"
        iconPos="left"
        style={{ marginRight: "0.5em" }}
        onClick={(e) => setFormDialog(true)}
      />

      <Dialog
        header="Edit Material Dialog"
        visible={formDialog}
        style={{ width: "50vw" }}
        footer={renderFooter}
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

          <div style={{ marginTop: "1em" }}>
            <Button
              type="submit"
              label="Save"
              iconPos="left"
              icon="pi pi-save"
            />
          </div>
        </form>
      </Dialog>
    </section>
  );
}

export default EditMaterialForm;
