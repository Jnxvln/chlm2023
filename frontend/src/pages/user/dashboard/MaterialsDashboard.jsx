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
import { getActiveMaterials, deleteMaterial } from "../../../features/materials/materialSlice";
import { getMaterialCategories } from "../../../features/materialCategory/materialCategorySlice";
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
  // Resource states
  let materialsLoading, materialsError, materialsSuccess, materialsMessage;
  let materialCategoriesLoading, materialCategoriesError, materialCategoriesSuccess, materialCategoriesMessage;

  // Select material data
  const { materials } = useSelector((state) => state.materials);
  materialsLoading = useSelector((state) => state.materials).isLoading;
  materialsError = useSelector((state) => state.materials).isError;
  materialsSuccess = useSelector((state) => state.materials).isSuccess;
  materialsMessage = useSelector((state) => state.materials).message;

  // Select materialCategory data
  const { materialCategories } = useSelector((state) => state.materialCategories);
  materialCategoriesLoading = useSelector((state) => state.materialCategories).isLoading;
  materialCategoriesError = useSelector((state) => state.materialCategories).isError;
  materialCategoriesSuccess = useSelector((state) => state.materialCategories).isSuccess;
  materialCategoriesMessage = useSelector((state) => state.materialCategories).message;
  // #endregion

  // #region DATA TABLE TEMPLATES
  const imageBodyTemplate = (rowData) => {
    return <img src={`https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png`} alt="Test alt" className="product-image" />;
  };

  const stockTemplate = (rowData) => {
    return <span className={`product-badge status-${rowData.stock.toLowerCase()}`}>{rowData.stock}</span>;
  };

  const stockItemTemplate = (option) => {
    return <span className={`customer-badge status-${option}`}>{option}</span>;
  };

  const stockFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={stockStatuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={stockItemTemplate}
        placeholder="Select current stock"
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
        <Button icon="pi pi-trash" iconPos="left" className="p-button-danger" onClick={(e) => onDelete(e, rowData)} />
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
    return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} className="p-button-secondary"></Button>;
  };

  const verifiedRowFilterTemplate = (options) => {
    return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />;
  };
  // #endregion

  // #region FILTER HANDLERS
  const onModelFilterChange = (e) => {
    console.log(e);
    //implementation goes here
  };

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
    // EXAMPLE ONLY:
    // setFilters1({
    //     'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    //     'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    //     'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    //     'representative': { value: null, matchMode: FilterMatchMode.IN },
    //     'date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    //     'balance': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    //     'status': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    //     'activity': { value: null, matchMode: FilterMatchMode.BETWEEN },
    //     'verified': { value: null, matchMode: FilterMatchMode.EQUALS }
    // });

    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      // 'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      // 'category': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
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

    if (stateMaterials) {
      console.log(stateMaterials);
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
        <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={() => {}} />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Keyword Search" />
        </span>
      </div>
    );
  };

  const renderHeader2 = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue2} onChange={onGlobalFilterChange2} placeholder="Keyword Search" />
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
            globalFilterFields={["name", "category", "stock", "binNumber", "isActive", "isTruckable"]}
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
            filter
            filterField="name"
            emptyMessage="No materials found"
            stripedRows
          >
            {/* IMAGE COLUMN */}
            <Column header="Image" body={imageBodyTemplate}></Column>

            {/* NAME COLUMN */}
            <Column field="name" header="Name" filter filterField="name" filterClear={filterClearTemplate} style={{ minWidth: "14rem" }} sortable></Column>

            {/* CATEGORY COLUMN */}
            <Column header="Category" body={categoryTemplate} sortable></Column>

            {/* BIN NUMBER COLUMN */}
            <Column sortable header="Bin" body={binNumberTemplate}></Column>

            {/* STOCK COLUMN */}
            <Column
              header="Stock"
              style={{ minWidth: "12rem" }}
              filter
              showFilterMenu={false}
              filterMenuStyle={{ width: "14rem" }}
              filterField="stock"
              filterElement={stockFilterTemplate}
              body={stockTemplate}
              sortable
            ></Column>

            {/* SIZE COLUMN */}
            <Column sortable field="size" header="Size"></Column>

            {/* ISFEATURED COLUMN */}
            <Column
              header="Featured"
              dataType="boolean"
              filter
              filterField="isFeatured"
              filterElement={verifiedRowFilterTemplate}
              body={isFeaturedTemplate}
              sortable
            ></Column>

            {/* ISACTIVE COLUMN */}
            <Column
              header="Active"
              dataType="boolean"
              filter
              filterField="isActive"
              filterElement={verifiedRowFilterTemplate}
              body={isActiveTemplate}
              sortable
            ></Column>

            {/* ISTRUCKABLE COLUMN */}
            <Column
              header="Truckable"
              dataType="boolean"
              filter
              filterField="isTruckable"
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
