import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  getActiveMaterials,
  deleteMaterial,
} from "../../../features/materials/materialSlice";
import { getMaterialCategories } from "../../../features/materialCategory/materialCategorySlice";
import MaterialForm from "../../../components/user/dashboard/materials/MaterialForm";
import EditMaterialForm from "../../../components/user/dashboard/materials/EditMaterialForm";
import Spinner from "../../../components/layout/Spinner";

import { ConfirmPopup } from "primereact/confirmpopup"; // To use <ConfirmPopup> tag
import { confirmPopup } from "primereact/confirmpopup"; // To use confirmPopup method

function MaterialsDashboard() {
  const dispatch = useDispatch();

  const [globalFilterValue1, setGlobalFilterValue1] = useState("");

  // #region RESOURCE STATES & SELECT DATA
  // Resource states
  let materialsLoading, materialsError, materialsSuccess, materialsMessage;
  let materialCategoriesLoading,
    materialCategoriesError,
    materialCategoriesSuccess,
    materialCategoriesMessage;

  // Select material data
  const { materials } = useSelector((state) => state.materials);
  materialsLoading = useSelector((state) => state.materials).isLoading;
  materialsError = useSelector((state) => state.materials).isError;
  materialsSuccess = useSelector((state) => state.materials).isSuccess;
  materialsMessage = useSelector((state) => state.materials).message;

  // Select materialCategory data
  const { materialCategories } = useSelector(
    (state) => state.materialCategories
  );
  materialCategoriesLoading = useSelector(
    (state) => state.materialCategories
  ).isLoading;
  materialCategoriesError = useSelector(
    (state) => state.materialCategories
  ).isError;
  materialCategoriesSuccess = useSelector(
    (state) => state.materialCategories
  ).isSuccess;
  materialCategoriesMessage = useSelector(
    (state) => state.materialCategories
  ).message;
  // #endregion

  // #region DATA TABLE TEMPLATES
  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={`https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png`}
        alt="Test alt"
        className="product-image"
      />
    );
  };

  const stockTemplate = (rowData) => {
    return (
      <span className={`product-badge status-${rowData.stock.toLowerCase()}`}>
        {rowData.stock}
      </span>
    );
  };

  const binNumberTemplate = (rowData) => {
    return (
      <>
        {rowData.binNumber ? (
          <span>Bin #{rowData.binNumber}</span>
        ) : (
          <span></span>
        )}
      </>
    );
  };

  const categoryTemplate = (rowData) => {
    const category = materialCategories.find(
      (cat) => cat._id === rowData.category
    );
    return <>{category ? <span>{category.name}</span> : <span>No ID</span>}</>;
  };

  const actionsTemplate = (rowData) => {
    return (
      <div style={{ display: "flex" }}>
        <EditMaterialForm material={rowData} />
        <Button
          icon="pi pi-trash"
          iconPos="left"
          className="p-button-danger"
          onClick={(e) => onDelete(e, rowData)}
        />
      </div>
    );
  };
  // #endregion

  const onDelete = (e, rowData) => {
    confirmPopup({
      target: e.target,
      message: "Are you sure you want to delete?",
      icon: "pi pi-exclamation-triangle",
      accept: () => dispatch(deleteMaterial(rowData._id)),
      reject: () => null,
    });
  };

  const onModelFilterChange = (e) => {
    console.log(e);
    //implementation goes here
  };

  // Fetch resources once (no dependencies)
  useEffect(() => {
    if (materials.length === 0) {
      dispatch(getActiveMaterials());
    }

    if (materialCategories.length === 0) {
      dispatch(getMaterialCategories());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect for everything else
  useEffect(() => {
    if (materialsError) {
      toast.error(materialsMessage);
    }

    if (materialCategoriesError) {
      toast.error(materialCategoriesMessage);
    }
  }, [
    materials,
    materialsError,
    materialsSuccess,
    materialsMessage,
    materialCategories,
    materialCategoriesError,
    materialCategoriesSuccess,
    materialCategoriesMessage,
    dispatch,
  ]);

  if (materialsLoading || materialCategoriesLoading) {
    return <Spinner />;
  }

  const header = <div className="table-header">Products</div>;

  const renderHeader1 = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          className="p-button-outlined"
          onClick={() => {}}
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={(e) => setGlobalFilterValue1(e.target.value)}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  let modelFilter = (
    <InputText
      style={{ width: "100%" }}
      className="ui-column-filter"
      onChange={onModelFilterChange}
    />
  );

  return (
    <section>
      <h1>Materials</h1>

      <ConfirmPopup />

      <MaterialForm />

      <div className="datatable-templating-demo">
        <div className="card">
          <DataTable
            value={materials}
            header={renderHeader1}
            sortMode="multiple"
            responsiveLayout="scroll"
          >
            <Column header="Image" body={imageBodyTemplate}></Column>
            <Column
              field="name"
              header="Name"
              filterElement={modelFilter}
              filterMatchMode="contains"
              filter
              sortable
            ></Column>
            <Column sortable header="Category" body={categoryTemplate}></Column>
            <Column sortable header="Bin" body={binNumberTemplate}></Column>
            <Column sortable header="Stock" body={stockTemplate}></Column>
            <Column sortable field="size" header="Size"></Column>
            <Column sortable field="isFeatured" header="Featured"></Column>
            <Column sortable field="isActive" header="Active"></Column>
            <Column sortable field="isTruckable" header="Truckable"></Column>
            <Column header="Actions" body={actionsTemplate}></Column>
          </DataTable>
        </div>
      </div>

      <br />
      <br />
      <br />

      <h3>Material Categories</h3>
      <div className="datatable-templating-demo">
        <div className="card">
          <DataTable value={materialCategories} responsiveLayout="scroll">
            <Column sortable field="_id" header="ID"></Column>
            <Column sortable field="name" header="Name"></Column>
            <Column sortable field="isPublic" header="Public"></Column>
          </DataTable>
        </div>
      </div>
    </section>
  );
}

export default MaterialsDashboard;
