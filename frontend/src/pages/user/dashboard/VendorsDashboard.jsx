import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import VendorForm from "../../../components/user/dashboard/vendors/VendorForm";
import EditVendorForm from "../../../components/user/dashboard/vendors/EditVendorForm";
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
import { useSelector, useDispatch } from "react-redux";
import {
  getVendors,
  deleteVendor,
  resetVendorMessages,
} from "../../../features/vendors/vendorSlice";

function VendorsDashboard() {
  // #region VARS ------------------------
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [vendorRowSelected, setVendorRowSelected] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    shortName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const dispatch = useDispatch();

  // Select Vendors from store slice
  const { vendors, vendorsLoading, vendorsError, vendorsSuccess, vendorsMessage } = useSelector(
    (state) => state.vendors
  );
  // #endregion

  // #region DATA TABLE TEMPLATES
  const dataTableHeaderTemplate = () => {
    return (
      <div className="flex justify-content-between">
        <div>
          <VendorForm />
        </div>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Name or short name"
          />
        </span>
      </div>
    );
  };

  const isActiveTemplate = (rowData) => {
    return <>{rowData.isActive ? <i className="pi pi-check" /> : ""}</>;
  };

  const isActiveRowFilterTemplate = (options) => {
    <TriStateCheckbox
      value={options.value}
      onChange={(e) => options.filterApplyCallback(e.value)}
    />;
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

  const chtFuelSurchargeTemplate = (rowData) => {
    return <>{parseFloat(rowData.chtFuelSurcharge).toFixed(2)}</>;
  };

  const vendorFuelSurchargeTemplate = (rowData) => {
    return <>{parseFloat(rowData.vendorFuelSurcharge).toFixed(2)}</>;
  };

  const actionsTemplate = (rowData) => {
    return (
      <div style={{ display: "flex" }}>
        <EditVendorForm vendor={rowData} />
        <Button
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={(e) => onDelete(e, rowData)}
        />
      </div>
    );
  };
  // #endregion

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

  // Delete vendor confirmation
  const onDelete = (e, rowData) => {
    confirmPopup({
      target: e.target,
      message: `Delete vendor ${rowData.name}?`,
      icon: "pi pi-exclamation-triangle",
      accept: () => dispatch(deleteVendor(rowData._id)),
      reject: () => null,
    });
  };

  // RUN ONCE - INIT FILTERS
  useEffect(() => {
    initFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (vendors.length === 0) {
      dispatch(getVendors());
    }

    if (vendorsError && vendorsMessage && vendorsMessage.length > 0) {
      toast.error(vendorsMessage);
    }

    if (vendorsSuccess && vendorsMessage && vendorsMessage.length > 0) {
      toast.success(vendorsMessage);
    }

    dispatch(resetVendorMessages());
  }, [vendors, vendorsError, vendorsSuccess, vendorsMessage, dispatch]);

  return (
    <section>
      <h1 style={{ textAlign: "center", fontSize: "20pt" }}>C&H Vendors</h1>

      <ConfirmPopup />

      <div className="datatable-templating-demo">
        <div className="card" style={{ height: "calc(100vh - 145px)" }}>
          <DataTable
            value={vendors}
            loading={vendorsLoading}
            header={dataTableHeaderTemplate}
            globalFilterFields={["name", "shortName"]}
            size="small"
            scrollable
            scrollHeight="flex"
            sortMode="multiple"
            responsiveLayout="scroll"
            filter
            filters={filters}
            filterfield="name"
            filterDisplay="row"
            onFilter={(e) => setFilters(e.filters)}
            selectionMode="single"
            selection={vendorRowSelected}
            onSelectionChange={(e) => setVendorRowSelected(e.value)}
            dataKey="_id"
            stateStorage="session"
            stateKey="dt-vendors-session"
            emptyMessage="No vendors found"
            stripedRows
          >
            {/* IS ACTIVE */}
            <Column
              field="isActive"
              dataType="boolean"
              header="Active"
              filterElement={isActiveRowFilterTemplate}
              body={isActiveTemplate}
              sortable
            ></Column>

            {/* NAME */}
            <Column
              field="name"
              header="Name"
              filter
              filterField="name"
              filterClear={filterClearTemplate}
              style={{ minWidth: "12em" }}
              sortable
            ></Column>

            {/* SHORT NAME */}
            <Column
              field="shortName"
              header="Short Name"
              filter
              filterField="shortName"
              filterClear={filterClearTemplate}
              style={{ minWidth: "12em" }}
              sortable
            ></Column>

            {/* CHT FSC */}
            <Column
              field="chtFuelSurcharge"
              dataType="number"
              header="CHT FSC"
              style={{ minWidth: "12em" }}
              sortable
              body={chtFuelSurchargeTemplate}
            ></Column>

            {/* VENDOR FSC */}
            <Column
              field="vendorFuelSurcharge"
              dataType="number"
              header="Vendor FSC"
              style={{ minWidth: "12em" }}
              sortable
              body={vendorFuelSurchargeTemplate}
            ></Column>

            {/* ACTIONS */}
            <Column header="Actions" body={actionsTemplate}></Column>
          </DataTable>
        </div>
      </div>
    </section>
  );
}

export default VendorsDashboard;
