import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { ProgressBar } from "primereact/progressbar";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { FilterMatchMode } from "primereact/api";
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
  const [matCategories, setMatCategories] = useState([]);
  const [stateMaterials, setStateMaterials] = useState(null);
  // const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [globalFilterValue2, setGlobalFilterValue2] = useState("");
  const [materialRowSelected, setMaterialRowSelected] = useState(null);
  // const [filters1, setFilters1] = useState(null);
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
      message: `Delete material ${rowData.name}?`,
      icon: "pi pi-exclamation-triangle",
      accept: () => dispatch(deleteMaterial(rowData._id)),
      reject: () => null,
    });
  };

  const categoryRowTemplate = (rowData) => {
    let mat;
    if (matCategories.length > 0) {
      mat = matCategories.find((cat) => cat._id === rowData.category);
      return <>{mat.name}</>;
    }
  };

  // #region RESOURCE STATES & SELECT DATA
  // Select Material data
  const {
    materials,
    materialsLoading,
    materialsError,
    materialsSuccess,
    materialsMessage,
  } = useSelector((state) => state.materials);

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
        width="80%"
        height="auto"
        alt={rowData.name}
        className="material-img"
      />
    );
  };

  const categoryTemplate = (rowData) => {
    return (
      <span className={`product-badge status-${rowData.category}`}>
        {categoryRowTemplate(rowData)}
      </span>
    );
  };

  const categoryRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={matCategories}
        onChange={(e) => {
          if (e && e.value && e.value._id) {
            return options.filterApplyCallback(e.value._id);
          } else if (e && e.value) {
            return options.filterApplyCallback(e.value);
          }
        }}
        itemTemplate={categoryItemTemplate}
        placeholder="Choose..."
        className="p-column-filter"
      />
    );
  };

  const categoryItemTemplate = (option) => {
    return (
      <span className={`category status-${option.name}`}>{option.name}</span>
    );
  };

  const stockTemplate = (rowData) => {
    let progress = {
      value: "",
      color: "",
    };

    switch (rowData.stock.toLowerCase()) {
      case "new":
        progress.value = 100;
        progress.color = "#68DF2C";
        break;
      case "in":
        progress.value = 50;
        progress.color = "#F4BD2B";
        break;
      case "low":
        progress.value = 25;
        progress.color = "#F37531";
        break;
      case "out":
        progress.value = 2;
        progress.color = "#DF1C1C";
        break;
      case "notavail":
        progress.value = 0;
        progress.color = "#F35131";
        break;
      default:
        progress.value = 0;
        progress.color = "#F35131";
        break;
    }

    return (
      <div style={{ width: "100%" }}>
        <ProgressBar
          value={progress.value}
          color={progress.color}
          style={{ height: "6px" }}
        />
      </div>
    );
  };

  const stockItemTemplate = (option) => {
    return <span className={`customer-badge status-${option}`}>{option}</span>;
  };

  const stockRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={stockStatuses}
        onChange={(e) => {
          return options.filterApplyCallback(e.value);
        }}
        itemTemplate={stockItemTemplate}
        placeholder="Choose..."
        className="p-column-filter"
      />
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

  const actionsTemplate = (rowData) => {
    return (
      <div style={{ display: "flex" }}>
        <EditMaterialForm material={rowData} />
        <Button
          icon="pi pi-trash"
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
  // const onGlobalFilterChange1 = (e) => {
  //   const value = e.target.value;
  //   let _filters1 = { ...filters1 };
  //   _filters1["global"].value = value;

  //   setFilters1(_filters1);
  //   setGlobalFilterValue1(value);
  // };

  const onGlobalFilterChange2 = (e) => {
    const value = e.target.value;
    let _filters2 = { ...filters2 };
    _filters2["global"].value = value;

    setFilters2(_filters2);
    setGlobalFilterValue2(value);
  };

  // const clearFilter1 = () => {
  //   initFilters1();
  // };

  // const initFilters1 = () => {
  //   setFilters1({
  //     global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  //     name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  //     stock: {
  //       operator: FilterOperator.OR,
  //       constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  //     },
  //     category: { value: null, matchMode: FilterMatchMode.CONTAINS },
  //     isActive: { value: null, matchMode: FilterMatchMode.EQUALS },
  //     isTruckable: { value: null, matchMode: FilterMatchMode.EQUALS },
  //   });

  //   setGlobalFilterValue1("");
  // };
  // #endregion

  // Fetch resources once (no dependencies)
  useEffect(() => {
    if (materials.length === 0) {
      dispatch(getActiveMaterials());
    }

    if (materialCategories.length === 0) {
      dispatch(getMaterialCategories());
    }

    // initFilters1();
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
        let category = materialCategories.find(
          (cat) => cat._id === materials[i].category
        );

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

  // Create a list of objects with material category names and id's used in categoryRowFilterTemplate
  useEffect(() => {
    if (materialCategories.length > 0) {
      let cats = [];
      for (let i = 0; i < materialCategories.length; i++) {
        cats.push({
          name: materialCategories[i].name,
          _id: materialCategories[i]._id,
        });
      }
      setMatCategories(cats);
    }
  }, [materialCategories]);

  if (materialsLoading || materialCategoriesLoading) {
    return <Spinner />;
  }

  // const header = <div className="table-header">Products</div>;

  const renderHeader2 = () => {
    return (
      <div className="flex justify-content-between">
        <div>
          <MaterialForm />
        </div>
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

  const header2 = renderHeader2();

  return (
    <section>
      <h1 style={{ textAlign: "center", fontSize: "20pt" }}>Materials</h1>

      <br />
      <br />

      <ConfirmPopup />

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
            stateStorage="session"
            stateKey="dt-materials-session"
            filter
            filters={filters2}
            filterfield="name"
            filterDisplay="row"
            onFilter={(e) => setFilters2(e.filters)}
            emptyMessage="No materials found"
            stripedRows
          >
            {/* IMAGE COLUMN */}
            <Column
              header="Image"
              style={{ minWidth: "120px" }}
              body={imageBodyTemplate}
            ></Column>

            {/* BIN NUMBER COLUMN */}
            <Column sortable header="Bin" body={binNumberTemplate}></Column>

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
            <Column
              field="category"
              header="Category"
              body={categoryTemplate}
              filter
              filterElement={categoryRowFilterTemplate}
              showFilterMenu={false}
              filterMenuStyle={{ width: "14rem" }}
              style={{ minWidth: "14rem" }}
            ></Column>

            {/* STOCK COLUMN */}
            <Column
              field="stock"
              header="Stock"
              body={stockTemplate}
              filter
              filterElement={stockRowFilterTemplate}
              showFilterMenu={false}
              filterMenuStyle={{ width: "14rem" }}
              style={{ minWidth: "8rem" }}
            ></Column>

            {/* SIZE COLUMN */}
            <Column sortable field="size" header="Size"></Column>

            {/* ISFEATURED COLUMN */}
            <Column
              field="isFeatured"
              header="Featured"
              dataType="boolean"
              filter
              filterElement={verifiedRowFilterTemplate}
              body={isFeaturedTemplate}
              sortable
            ></Column>

            {/* ISACTIVE COLUMN */}
            <Column
              field="isActive"
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
              field="isTruckable"
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
