import { useState, useEffect } from "react";
import VendorProductForm from "./VendorProductForm";
import EditVendorProductForm from "./EditVendorProductForm";
// PrimeReact Components
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmPopup } from "primereact/confirmpopup"; // To use <ConfirmPopup> tag
import { confirmPopup } from "primereact/confirmpopup"; // To use confirmPopup method
import { Button } from "primereact/button";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
// Store data
import { useDispatch } from "react-redux";
import { deleteVendorProduct } from "../../../../features/vendorProducts/vendorProductSlice";

function VendorProductDataTable({
  vendors,
  vendorLocations,
  vendorProducts,
  vendorProductsLoading,
}) {
  // #region VARS -------------------------------
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [vendorProductRowSelected, setVendorProductRowSelected] = useState(null);
  const dispatch = useDispatch();
  // #endregion

  // #region TEMPLATES -------------------------------
  const vendorProductsDataTableHeaderTemplate = () => {
    return (
      <div className="flex justify-content-between">
        <div>
          <VendorProductForm vendors={vendors} vendorLocations={vendorLocations} />
        </div>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Name" />
        </span>
      </div>
    );
  };

  const vendorProductTemplate = (option) => {
    return (
      <>
        <strong>{option.name}</strong>
      </>
    );
  };

  const vendorNameTemplate = (rowData) => {
    return <>{vendors.find((v) => v._id === rowData.vendorId).name}</>;
  };

  const vendorLocationTemplate = (rowData) => {
    return <>{vendorLocations.find((loc) => loc._id === rowData.vendorLocationId).name}</>;
  };

  const vendorProductProductCostTemplate = (rowData) => {
    return <>${parseFloat(rowData.productCost).toFixed(2)}</>;
  };

  const isActiveRowFilterTemplate = (option) => {
    <TriStateCheckbox value={option.value} onChange={(e) => option.filterApplyCallback(e.value)} />;
  };

  const isActiveTemplate = (rowData) => {
    return <>{rowData.isActive ? <i className="pi pi-check" /> : ""}</>;
  };

  const actionsTemplate = (rowData) => {
    return (
      <div style={{ display: "flex" }}>
        <EditVendorProductForm
          vendors={vendors}
          vendorLocations={vendorLocations}
          vendorProduct={rowData}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={(e) => onDelete(e, rowData)}
        />
      </div>
    );
  };
  // #endregion

  // #region FILTERS -------------------------------
  // Handle filter change
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // Initialize datatable filters
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      shortName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    setGlobalFilterValue("");
  };
  // #endregion

  // Delete vendor confirmation
  const onDelete = (e, rowData) => {
    confirmPopup({
      target: e.target,
      message: `Delete product ${rowData.name}?`,
      icon: "pi pi-exclamation-triangle",
      accept: () => dispatch(deleteVendorProduct(rowData._id)),
      reject: () => null,
    });
  };

  // RUN ONCE - INIT FILTERS
  useEffect(() => {
    initFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="datatable-templating-demo">
      <ConfirmPopup />
      <div className="card" style={{ height: "calc(100vh - 145px)" }}>
        <DataTable
          value={vendorProducts}
          loading={vendorProductsLoading}
          header={vendorProductsDataTableHeaderTemplate}
          globalFilterFields={["name"]}
          size="small"
          scrollable
          scrollHeight="flex"
          sortMode="multiple"
          responsiveLayout="scroll"
          filter="true"
          filters={filters}
          filterfield="name"
          filterDisplay="row"
          onFilter={(e) => setFilters(e.filters)}
          selectionMode="single"
          selection={vendorProductRowSelected}
          onSelectionChange={(e) => setVendorProductRowSelected(e.value)}
          dataKey="_id"
          stateStorage="session"
          stateKey="dt-vendorProducts-session"
          emptyMessage="No vendor products found"
          stripedRows
        >
          {/* VENDOR NAME */}
          <Column field="vendorId" header="Vendor" body={vendorNameTemplate} sortable />

          {/* VENDOR LOCATION */}
          <Column
            field="vendorLocationId"
            header="Location"
            body={vendorLocationTemplate}
            sortable
          />

          {/* NAME */}
          <Column field="name" header="Name" body={vendorProductTemplate} sortable></Column>

          {/* PRODUCT COST */}
          <Column
            field="productCost"
            dataType="number"
            header="Product Cost"
            body={vendorProductProductCostTemplate}
            sortable
          ></Column>

          {/* IS ACTIVE */}
          <Column
            field="isActive"
            dataType="boolean"
            header="Active"
            filterElement={isActiveRowFilterTemplate}
            body={isActiveTemplate}
            sortable
          ></Column>

          {/* ACTIONS */}
          <Column header="Actions" body={actionsTemplate}></Column>
        </DataTable>
      </div>
    </div>
  );
}

export default VendorProductDataTable;
