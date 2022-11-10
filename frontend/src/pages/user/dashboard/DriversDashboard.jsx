import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { ConfirmPopup } from "primereact/confirmpopup"; // To use <ConfirmPopup> tag
import { confirmPopup } from "primereact/confirmpopup"; // To use confirmPopup method
// import DriverForm from "../../../components/user/dashboard/drivers/DriverForm";
// import EditDriverForm from "../../../components/user/dashboard/drivers/EditDriverForm";
// PrimeReact Components
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
// Data
import { useQuery } from "@tanstack/react-query";
import { getDrivers } from "../../../api/drivers/driversApi";

function DriversDashboard() {
  // const queryClient = useQueryClient();
  // const user = useQuery({ queryKey: ["user"] });

  // #region VARS ------------------------
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [driverRowSelected, setDriverRowSelected] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    firstName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    lastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    defaultTruck: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const drivers = useQuery({
    queryKey: ["drivers"],
    queryFn: getDrivers,
  });
  // #endregion

  // #region DATA TABLE TEMPLATES
  const dataTableHeaderTemplate = () => {
    return (
      <div className="flex justify-content-between">
        <div>
          {/* <DriverForm /> */}
          <Button icon="pi pi-plus" label="New Driver" />
        </div>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="First, last, or truck #"
          />
        </span>
      </div>
    );
  };

  const dateHiredTemplate = (rowData) => {
    return <>{dayjs(rowData.dateHired).format("MM/DD/YYYY")}</>;
  };

  const dateReleasedTemplate = (rowData) => {
    return <>{rowData.dateReleased ? dayjs(rowData.dateReleased).format("MM/DD/YY") : ""}</>;
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

  const endDumpPayRateTemplate = (rowData) => {
    return <>{parseFloat(rowData.endDumpPayRate).toFixed(2)}</>;
  };

  const flatBedPayRateTemplate = (rowData) => {
    return <>{parseFloat(rowData.flatBedPayRate).toFixed(2)}</>;
  };

  const ncRateTemplate = (rowData) => {
    return <>{parseFloat(rowData.ncRate).toFixed(2)}</>;
  };

  const actionsTemplate = (rowData) => {
    return (
      <div style={{ display: "flex" }}>
        {/* <EditDriverForm driver={rowData} /> */}
        <Button icon="pi pi-pencil" />
        <Button
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={(e) => onDelete(e, rowData)}
        />
      </div>
    );
  };
  // #endregion

  // #region FILTERS
  // Handle global filter change
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // Initialize filters
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      firstName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      lastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      defaultTruck: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    setGlobalFilterValue("");
  };
  // #endregion

  // Handle delete driver confirmation
  const onDelete = (e, rowData) => {
    confirmPopup({
      target: e.target,
      message: `Delete driver ${rowData.firstName} ${rowData.lastName}?`,
      icon: "pi pi-exclamation-triangle",
      // accept: () => dispatch(deleteDriver(rowData._id)),
      accept: () => console.log("TODO: Delete driver..."),
      reject: () => null,
    });
  };

  // RUN ONCE - INITIALIZE DATATABLE FILTERS
  useEffect(() => {
    initFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      <h1 style={{ textAlign: "center", fontSize: "20pt" }}>C&H Drivers</h1>

      <ConfirmPopup />

      <div className="datatable-templating-demo">
        <div className="card" style={{ height: "calc(100vh - 145px)" }}>
          <DataTable
            value={drivers.data}
            loading={drivers.isLoading}
            header={dataTableHeaderTemplate}
            globalFilterFields={["firstName", "lastName", "defaultTruck"]}
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
            selection={driverRowSelected}
            onSelectionChange={(e) => setDriverRowSelected(e.value)}
            dataKey="_id"
            stateStorage="session"
            stateKey="dt-drivers-session"
            emptyMessage="No drivers found"
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

            {/* FIRST NAME */}
            <Column
              field="firstName"
              header="First"
              filter
              filterField="firstName"
              filterClear={filterClearTemplate}
              style={{ minWidth: "12em" }}
              sortable
            ></Column>

            {/* LAST NAME */}
            <Column
              field="lastName"
              header="Last"
              filter
              filterField="lastName"
              filterClear={filterClearTemplate}
              style={{ minWidth: "12em" }}
              sortable
            ></Column>

            {/* DEFAULT TRUCK */}
            <Column field="defaultTruck" header="Truck" sortable></Column>

            {/* END DUMP PAY RATE */}
            <Column
              field="endDumpPayRate"
              header="ED Rate"
              body={endDumpPayRateTemplate}
              sortable
            ></Column>

            {/* FLAT BED PAY RATE */}
            <Column
              field="flatBedPayRate"
              header="FB Rate"
              body={flatBedPayRateTemplate}
              sortable
            ></Column>

            {/* NC RATE */}
            <Column field="ncRate" header="NC Rate" body={ncRateTemplate} sortable></Column>

            {/* DATE HIRED */}
            <Column
              header="Hired"
              body={dateHiredTemplate}
              dataType="date"
              sortable
              sortField="dateHired"
            ></Column>

            {/* DATE RELESED */}
            <Column
              header="Released"
              body={dateReleasedTemplate}
              dataType="date"
              sortable
              sortField="dateReleased"
            ></Column>

            {/* ACTIONS */}
            <Column header="Actions" body={actionsTemplate}></Column>
          </DataTable>
        </div>
      </div>
    </section>
  );
}

export default DriversDashboard;
