import React, { useState, useEffect } from "react";
import dayjs from 'dayjs'
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { getDrivers } from "../../../features/drivers/driverSlice"
import { Button } from "primereact/button";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
// import { InputText } from "primereact/inputtext";
// import { Dropdown } from "primereact/dropdown";
// import { FilterMatchMode, FilterOperator } from "primereact/api";
// import { classNames } from "primereact/utils";

function DriversDashboard() {
  const dispatch = useDispatch();

  const { drivers, driversLoading, driversError, driversSuccess, driversMessage } = useSelector((state) => state.drivers)

  // #region DATA TABLE TEMPLATES

  const dateHiredTemplate = (rowData) => {
    return (
      <>{dayjs(rowData.dateHired).format('MM/DD/YYYY')}</>
    )
  }

  const dateReleasedTemplate = (rowData) => {
    return (
      <>{rowData.dateReleased ? dayjs(rowData.dateReleased).format('MM/DD/YY') : ''}</>
    )
  }

  const isActiveTemplate = (rowData) => {
    return (
      <>
        { rowData.isActive ? (
          <i className="pi pi-check"/>
        ) : ""}
      </>
    )
  }

  const isActiveRowFilterTemplate = (options) => {
    <TriStateCheckbox
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.value)}
      />
  }

  const filterClearTemplate = (options) => {
    return (
      <Button
        type="button"
        icon="pi pi-times"
        onClick={options.filterClearCallback}
        className="p-button-secondary"
      ></Button>
    );
  }

  const actionsTemplate = (rowData) => {
    return (
      <>
        <Button icon="pi pi-pencil" style={{ marginRight: '0.5em' }} />
        <Button icon="pi pi-trash" className="p-button-danger" />
      </>
    )
  }
  // #endregion

  // RUN ONCE - FETCH
  useEffect(() => {
    if (drivers.length === 0) {
      dispatch(getDrivers())
    }
  }, [])

  useEffect(() => {
    if (driversError) {
      toast.error(driversMessage)
    }

    if (driversSuccess) {
      toast.success(driversMessage)
    }
  }, [drivers, driversError, driversSuccess, driversMessage])
  return (
    <section>
      <h1>Drivers</h1>

      <div className="datatable-templating-demo">
        <div className="card" style={{ height: "calc(100vh - 145px)" }}>
          <DataTable value={drivers}>
            <Column field="isActive" dataType="boolean" header="Active" filterElement={isActiveRowFilterTemplate} body={isActiveTemplate} sortable></Column>
            <Column field="firstName" header="First" filter filterField="firstName" filterClear={filterClearTemplate} sortable></Column>
            <Column field="lastName" header="Last" filter filterField="lastName" filterClear={filterClearTemplate} sortable></Column>
            <Column field="defaultTruck" header="Truck" filter filterField="defaultTruck" filterClear={filterClearTemplate} sortable></Column>
            <Column field="endDumpPayRate" header="ED Rate" filter filterField="endDumpPayRate" filterClear={filterClearTemplate} sortable></Column>
            <Column field="flatBedPayRate" header="FB Rate" filter filterField="flatBedPayRate" filterClear={filterClearTemplate} sortable></Column>
            <Column field="ncRate" header="NC Rate" filter filterField="ncRate" filterClear={filterClearTemplate} sortable></Column>
            <Column header="Hired" body={dateHiredTemplate} dataType="date" filter filterField="dateHired" filterClear={filterClearTemplate} sortable sortField="dateHired"></Column>
            <Column header="Released" body={dateReleasedTemplate}></Column>
            <Column header="Actions" body={actionsTemplate}></Column>
          </DataTable>
        </div>
      </div>
    </section>
  );
}

export default DriversDashboard;
