import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import HaulForm from "../../../components/user/dashboard/hauls/HaulForm";
import EditHaulForm from "../../../components/user/dashboard/hauls/EditHaulForm";
// PrimeReact Components
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { ConfirmPopup } from "primereact/confirmpopup"; // To use <ConfirmPopup> tag
import { confirmPopup } from "primereact/confirmpopup"; // To use confirmPopup method
// Store data
import { useSelector, useDispatch } from "react-redux";
import { getDrivers, resetDriverMessages } from "../../../features/drivers/driverSlice";
import { getHauls, deleteHaul, resetHaulMessages } from "../../../features/hauls/haulSlice";

function HaulsDashboard() {
  // #region VARS ------------------------
  const [multiSortMeta, setMultiSortMeta] = useState([{ field: "dateHaul", order: -1 }]);
  const [haulRowSelected, setHaulRowSelected] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    truck: { value: null, matchMode: FilterMatchMode.CONTAINS },
    broker: { value: null, matchMode: FilterMatchMode.CONTAINS },
    chInvoice: { value: null, matchMode: FilterMatchMode.CONTAINS },
    loadType: { value: null, matchMode: FilterMatchMode.CONTAINS },
    invoice: { value: null, matchMode: FilterMatchMode.CONTAINS },
    from: { value: null, matchMode: FilterMatchMode.CONTAINS },
    to: { value: null, matchMode: FilterMatchMode.CONTAINS },
    product: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const dispatch = useDispatch();

  // Select Hauls from store slice
  const { hauls, haulsLoading, haulsError, haulsSuccess, haulsMessage } = useSelector(
    (state) => state.hauls
  );

  // Select Drivers from store slice
  const { drivers, driversLoading, driversError, driversSuccess, driversMessage } = useSelector(
    (state) => state.drivers
  );
  // #endregion

  // #region DATA TABLE TEMPLATES
  const dataTableHeaderTemplate = () => {
    return (
      <div className="flex justify-content-between">
        <div>
          <HaulForm />
        </div>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Invoice, truck, from, to, etc."
          />
        </span>
      </div>
    );
  };

  const dateHaulTemplate = (rowData) => {
    return <>{dayjs(rowData.dateHaul).format("MM/DD/YY")}</>;
  };

  const timeHaulTemplate = (rowData) => {
    return <>{dayjs(rowData.dateHaul).format("hh:MM a")}</>;
  };

  const brokerTemplate = (rowData) => {
    return <>{rowData.broker}</>;
  };

  const invoiceTemplate = (rowData) => {
    return <>{rowData.invoice}</>;
  };

  const chInvoiceTemplate = (rowData) => {
    return <>{rowData.chInvoice}</>;
  };

  const fromTemplate = (rowData) => {
    return <>{rowData.from}</>;
  };

  const toTemplate = (rowData) => {
    return <>{rowData.to}</>;
  };

  const productTemplate = (rowData) => {
    return <>{rowData.product}</>;
  };

  const tonsTemplate = (rowData) => {
    return <>{rowData.tons ? parseFloat(rowData.tons).toFixed(2) : ""}</>;
  };

  const rateTemplate = (rowData) => {
    return <>{rowData.rate ? parseFloat(rowData.rate).toFixed(2) : ""}</>;
  };

  const milesTemplate = (rowData) => {
    return <>{rowData.miles ? parseFloat(rowData.miles).toFixed(2) : ""}</>;
  };

  const payRateTemplate = (rowData) => {
    return <>{rowData.payRate ? parseFloat(rowData.payRate).toFixed(2) : ""}</>;
  };

  const truckTemplate = (rowData) => {
    return <>{rowData.truck}</>;
  };

  const actionsTemplate = (rowData) => {
    return (
      <div style={{ display: "flex" }}>
        <EditHaulForm haul={rowData} />
        <Button
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={(e) => onDelete(e, rowData)}
        />
      </div>
    );
  };
  // #endregion

  // #region Filters
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
      truck: { value: null, matchMode: FilterMatchMode.CONTAINS },
      broker: { value: null, matchMode: FilterMatchMode.CONTAINS },
      chInvoice: { value: null, matchMode: FilterMatchMode.CONTAINS },
      loadType: { value: null, matchMode: FilterMatchMode.CONTAINS },
      invoice: { value: null, matchMode: FilterMatchMode.CONTAINS },
      from: { value: null, matchMode: FilterMatchMode.CONTAINS },
      to: { value: null, matchMode: FilterMatchMode.CONTAINS },
      product: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    setGlobalFilterValue("");
  };
  // #endregion

  // Delete haul confirmation
  const onDelete = (e, rowData) => {
    confirmPopup({
      target: e.target,
      message: `Delete haul invoice ${rowData.invoice}?`,
      icon: "pi pi-exclamation-triangle",
      accept: () => dispatch(deleteHaul(rowData._id)),
      reject: () => null,
    });
  };

  // RUN ONCE - INIT FILTERS
  useEffect(() => {
    initFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hauls.length === 0) {
      dispatch(getHauls());
    }

    if (haulsError && haulsMessage && haulsMessage.length > 0) {
      toast.error(haulsMessage);
    }

    if (haulsSuccess && haulsMessage && haulsMessage.length > 0) {
      toast.success(haulsMessage);
    }

    if (drivers.length === 0) {
      dispatch(getDrivers());
    }

    if (driversError && driversMessage && driversMessage.length > 0) {
      toast.error(driversMessage);
    }

    if (driversSuccess && driversMessage && driversMessage.length > 0) {
      toast.success(driversMessage);
    }

    dispatch(resetDriverMessages());
    dispatch(resetHaulMessages());
  }, [
    hauls,
    haulsError,
    haulsSuccess,
    haulsMessage,
    drivers,
    driversError,
    driversSuccess,
    driversMessage,
    dispatch,
  ]);

  return (
    <section>
      <h1 style={{ textAlign: "center", fontSize: "20pt" }}>C&H Hauls</h1>

      <ConfirmPopup />

      <div className="datatable-templating-demo">
        <div className="card" style={{ height: "calc(100vh - 145px)" }}>
          <DataTable
            value={hauls}
            loading={haulsLoading}
            header={dataTableHeaderTemplate}
            globalFilterFields={[
              "dateHaul",
              "broker",
              "invoice",
              "chInvoice",
              "invoice",
              "from",
              "to",
              "product",
            ]}
            scrollable
            autoLayout
            size="small"
            scrollHeight="flex"
            sortMode="multiple"
            removableSort
            multiSortMeta={multiSortMeta}
            onSort={(e) => setMultiSortMeta(e.multiSortMeta)}
            responsiveLayout="scroll"
            filter
            filters={filters}
            filterDisplay="row"
            onFilter={(e) => setFilters(e.filters)}
            selectionMode="single"
            selection={haulRowSelected}
            onSelectionChange={(e) => setHaulRowSelected(e.value)}
            dataKey="_id"
            stateStorage="session"
            stateKey="dt-hauls-session"
            emptyMessage="No hauls found"
            stripedRows
          >
            {/* <Column field="driver" header="Driver" body={driverTemplate}></Column> */}
            {/* HAUL DATE */}
            <Column
              field="dateHaul"
              header="Date"
              body={dateHaulTemplate}
              dataType="date"
              sortable
            ></Column>

            {/* TIME (DATE HAUL) */}
            <Column field="timeHaul" header="Time" body={timeHaulTemplate} sortable></Column>

            {/* BROKER */}
            <Column field="broker" header="Cust" body={brokerTemplate} sortable></Column>

            {/* INVOICE */}
            <Column field="invoice" header="Inv" body={invoiceTemplate} sortable></Column>

            {/* CHINVOICE */}
            <Column field="chInvoice" header="CH Inv" body={chInvoiceTemplate} sortable></Column>

            {/* FROM */}
            <Column field="from" header="From" body={fromTemplate} sortable></Column>

            {/* TO */}
            <Column field="to" header="To" body={toTemplate} sortable></Column>

            {/* PRODUCT */}
            <Column field="product" header="Mat" body={productTemplate} sortable></Column>

            {/* TONS */}
            <Column field="tons" header="Tons" body={tonsTemplate}></Column>

            {/* RATE */}
            <Column field="rate" header="Rate" body={rateTemplate}></Column>

            {/* MILES */}
            <Column field="miles" header="Miles" body={milesTemplate}></Column>

            {/* PAYRATE */}
            <Column field="payRate" header="Pay" body={payRateTemplate}></Column>

            {/* TRUCK */}
            <Column field="truck" header="Truck" body={truckTemplate}></Column>

            {/* ACTIONS */}
            <Column header="Actions" body={actionsTemplate}></Column>
          </DataTable>
        </div>
      </div>
    </section>
  );
}

export default HaulsDashboard;
