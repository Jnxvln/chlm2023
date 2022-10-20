import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { classNames } from "primereact/utils";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  getActiveMaterials,
  deleteMaterial,
  resetMaterialMessages,
} from "../../../features/materials/materialSlice";
import {
  getMaterialCategories,
  resetMaterialCategoryMessages,
} from "../../../features/materialCategory/materialCategorySlice";
import MaterialForm from "../../../components/user/dashboard/materials/MaterialForm";
import EditMaterialForm from "../../../components/user/dashboard/materials/EditMaterialForm";
import Spinner from "../../../components/layout/Spinner";

import { ConfirmPopup } from "primereact/confirmpopup"; // To use <ConfirmPopup> tag
import { confirmPopup } from "primereact/confirmpopup"; // To use confirmPopup method

function MaterialsDashboard() {
  const dispatch = useDispatch();
  const stockStatuses = ["new", "in", "low", "out", "notavail"];
  const [stateMaterials, setStateMaterials] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [globalFilterValue2, setGlobalFilterValue2] = useState("");
  const [materialRowSelected, setMaterialRowSelected] = useState(null);
  const [filters1, setFilters1] = useState(null);
  const [filters2, setFilters2] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    stock: { value: null, matchMode: FilterMatchMode.EQUALS },
    category: { value: null, matchMode: FilterMatchMode.CONTAINS },
    isFeatured: { value: null, matchMode: FilterMatchMode.EQUALS },
    isActive: { value: null, matchMode: FilterMatchMode.EQUALS },
    isTruckable: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const onDelete = (e, rowData) => {
    confirmPopup({
      target: e.target,
      message: "Are you sure you want to delete?",
      icon: "pi pi-exclamation-triangle",
      accept: () => dispatch(deleteMaterial(rowData._id)),
      reject: () => null,
    });
  };

  // #region RESOURCE STATES & SELECT DATA
  // Select Material data
  const { materials, materialsLoading, materialsError, materialsSuccess, materialsMessage } =
    useSelector((state) => state.materials);

  // Select MaterialCategory data
  const {
    materialCategories,
    materialCategoriesLoading,
    materialCategoriesError,
    materialCategoriesSuccess,
    materialCategoriesMessage,
  } = useSelector((state) => state.materialCategories);
  // #endregion

  // #region DATA TABLE TEMPLATES
  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={`${rowData.image}`}
        width="100"
        height="100"
        alt="Test alt"
        className="product-image"
      />
    );
  };

  const stockTemplate = (rowData) => {
    return (
      <span className={`product-badge status-${rowData.stock.toLowerCase()}`}>{rowData.stock}</span>
    );
  };

  const stockItemTemplate = (option) => {
    return <span className={`customer-badge status-${option}`}>{option}</span>;
  };

  const stockFilterTemplate = (options) => {
    console.log("OPTIONS FOUND: ");
    console.log(options);
    return (
      <Dropdown
        value={options.value}
        options={stockStatuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={stockItemTemplate}
        placeholder="Current stock"
        className="p-column-filter"
        showClear
      />
    );
  };

  const stockRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={stockStatuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={stockItemTemplate}
        placeholder="Select a Status"
        className="p-column-filter"
        showClear
      />
    );
  };

  const binNumberTemplate = (rowData) => {
    return <>{rowData.binNumber ? <span>Bin #{rowData.binNumber}</span> : <span></span>}</>;
  };

  const categoryTemplate = (rowData) => {
    const category = materialCategories.find((cat) => cat._id === rowData.category);
    return <>{category && <span>{category.name}</span>}</>;
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

  const isFeaturedTemplate = (rowData) => {
    return (
      <i
        className={classNames("pi", {
          "true-icon pi-check-circle": rowData.isFeatured,
        })}
      ></i>
    );
  };

  const isActiveTemplate = (rowData) => {
    return (
      <i
        className={classNames("pi", {
          "true-icon pi-check-circle": rowData.isActive,
        })}
      ></i>
    );
  };

  const isTruckableTemplate = (rowData) => {
    return (
      <i
        className={classNames("pi", {
          "true-icon pi-check-circle": rowData.isTruckable,
        })}
      ></i>
    );
  };

  const filterClearTemplate = (options) => {
    return (
      <Button
        type="button"
        icon="pi pi-times"
        onClick={options.filterClearCallback}
        className="p-button-secondary"
      ></Button>
    );
  };

  const verifiedRowFilterTemplate = (options) => {
    return (
      <TriStateCheckbox
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.value)}
      />
    );
  };
  // #endregion

  // #region FILTER HANDLERS
  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1["global"].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  const onGlobalFilterChange2 = (e) => {
    const value = e.target.value;
    let _filters2 = { ...filters2 };
    _filters2["global"].value = value;

    setFilters2(_filters2);
    setGlobalFilterValue2(value);
  };

  const clearFilter1 = () => {
    initFilters1();
  };

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      stock: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      category: { value: null, matchMode: FilterMatchMode.CONTAINS },
      isActive: { value: null, matchMode: FilterMatchMode.EQUALS },
      isTruckable: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    setGlobalFilterValue1("");
  };
  // #endregion

  // Fetch resources once (no dependencies)
  useEffect(() => {
    if (materials.length === 0) {
      dispatch(getActiveMaterials());
    }

    if (materialCategories.length === 0) {
      dispatch(getMaterialCategories());
    }

    initFilters1();
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

    if (materials.length > 0) {
      let materialsListCopy = [];

      for (let i = 0; i < materials.length; i++) {
        let category = materialCategories.find((cat) => cat._id === materials[i].category);

        let materialCopy = { ...materials[i] };
        if (category && category.name) {
          materialCopy.categoryName = category.name;
        }
        materialsListCopy.push(materialCopy);
      }
      setStateMaterials(materialsListCopy);
    }

    dispatch(resetMaterialMessages());
    dispatch(resetMaterialCategoryMessages());
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
            onChange={onGlobalFilterChange1}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  const renderHeader2 = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue2}
            onChange={onGlobalFilterChange2}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  // Choose whichever you like (header2 puts filters on separate row)
  // Also choose between filters (use filters1 with header1, filters2 with header2)
  const header1 = renderHeader1();
  const header2 = renderHeader2();

  return (
    <section>
      <h1>Materials</h1>

      <ConfirmPopup />

      <MaterialForm />

      <div className="datatable-templating-demo">
        <div className="card" style={{ height: "calc(100vh - 145px)" }}>
          <DataTable
            value={stateMaterials}
            header={header2}
            globalFilterFields={[
              "name",
              "category",
              "stock",
              "binNumber",
              "isActive",
              "isTruckable",
            ]}
            size="small"
            scrollable
            scrollHeight="flex"
            sortMode="multiple"
            responsiveLayout="scroll"
            selectionMode="single"
            selection={materialRowSelected}
            onSelectionChange={(e) => setMaterialRowSelected(e.value)}
            dataKey="_id"
            filters={filters2}
            // filterDisplay="menu"
            filterDisplay="row"
            filter="true"
            filterfield="name"
            emptyMessage="No materials found"
            stripedRows
          >
            {/* IMAGE COLUMN */}
            <Column header="Image" body={imageBodyTemplate}></Column>

            {/* NAME COLUMN */}
            <Column
              field="name"
              header="Name"
              filter="true"
              filterfield="name"
              filterClear={filterClearTemplate}
              style={{ minWidth: "14rem" }}
              sortable
            ></Column>

            {/* CATEGORY COLUMN */}
            <Column header="Category" body={categoryTemplate} sortable></Column>

            {/* BIN NUMBER COLUMN */}
            <Column sortable header="Bin" body={binNumberTemplate}></Column>

            {/* STOCK COLUMN */}
            <Column
              field="stock"
              header="Stock"
              body={stockTemplate}
              filter
              filterElement={stockRowFilterTemplate}
              showFilterMenu={false}
              filterMenuStyle={{ width: "14rem" }}
              style={{ minWidth: "12rem" }}
            ></Column>

            {/* SIZE COLUMN */}
            <Column sortable field="size" header="Size"></Column>

            {/* ISFEATURED COLUMN */}
            <Column
              header="Featured"
              dataType="boolean"
              filter="true"
              filterfield="isFeatured"
              filterElement={verifiedRowFilterTemplate}
              body={isFeaturedTemplate}
              sortable
            ></Column>

            {/* ISACTIVE COLUMN */}
            <Column
              header="Active"
              dataType="boolean"
              filter="true"
              filterfield="isActive"
              filterElement={verifiedRowFilterTemplate}
              body={isActiveTemplate}
              sortable
            ></Column>

            {/* ISTRUCKABLE COLUMN */}
            <Column
              header="Truckable"
              dataType="boolean"
              filter="true"
              filterfield="isTruckable"
              filterElement={verifiedRowFilterTemplate}
              body={isTruckableTemplate}
              sortable
            ></Column>
            <Column header="Actions" body={actionsTemplate}></Column>
          </DataTable>
        </div>
      </div>
    </section>
  );
}

export default MaterialsDashboard;
