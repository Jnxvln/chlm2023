import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import HaulForm from "../../../components/user/dashboard/hauls/HaulForm";
import EditHaulForm from "../../../components/user/dashboard/hauls/EditHaulForm";
import DateRangeSelector from "../../../components/user/dashboard/hauls/DateRangeSelector";
import DriverSelector from "../../../components/user/dashboard/hauls/DriverSelector";
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
import { getHauls, createHaul, deleteHaul, resetHaulMessages } from "../../../features/hauls/haulSlice";

function HaulsDashboard() {
  // #region VARS ------------------------
  const [rangeDates, setRangeDates] = useState([]);
  const [filteredHauls, setFilteredHauls] = useState([]);
  const [haulRowSelected, setHaulRowSelected] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState(undefined);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [multiSortMeta, setMultiSortMeta] = useState([{ field: "dateHaul", order: -1 }]);
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
  const { hauls, haulsLoading, haulsError, haulsSuccess, haulsMessage } = useSelector((state) => state.hauls);
  const { drivers, driversError, driversSuccess, driversMessage } = useSelector((state) => state.drivers);
  // #endregion

  // #region DATA TABLE TEMPLATES ------------------------
  const dataTableHeaderTemplate = () => {
    return (
      <div className="flex justify-content-between">
        <div className="flex">
          <div style={{ marginRight: "1em" }}>
            <DriverSelector drivers={drivers} onSelectDriver={onSelectDriver} />
          </div>
          <div style={{ marginRight: "4em" }}>
            <HaulForm />
          </div>
          <div>
            <DateRangeSelector onDateRangeSelected={onDateRangeSelected} />
          </div>
        </div>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Invoice, truck, from, to, etc." />
        </span>
      </div>
    );
  };

  const dateHaulTemplate = (rowData) => {
    return <>{dayjs(rowData.dateHaul).format("MM/DD/YY")}</>;
  };

  const timeHaulTemplate = (rowData) => {
    return <>{dayjs(rowData.timeHaul).format("hh:MM a")}</>;
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
      <div style={{ display: "flex", gap: "0.5em" }}>
        <EditHaulForm haul={rowData} />
        <Button icon="pi pi-copy" className="p-button-info" style={{ backgroundColor: "#83B869" }} onClick={(e) => onDuplicate(e, rowData)} />
        <Button icon="pi pi-trash" className="p-button-danger" onClick={(e) => onDelete(e, rowData)} />
      </div>
    );
  };
  // #endregion

  // #region FILTERS ------------------------
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

  // #region HANDLERS ------------------------

  // Handle Delete haul confirmation
  const onDelete = (e, rowData) => {
    confirmPopup({
      target: e.target,
      message: `Delete haul invoice ${rowData.invoice}?`,
      icon: "pi pi-exclamation-triangle",
      accept: () => dispatch(deleteHaul(rowData._id)),
      reject: () => null,
    });
  };

  // Handle duplicate haul
  const onDuplicate = (e, rowData) => {
    confirmPopup({
      target: e.target,
      message: `Copy haul invoice ${rowData.invoice}?`,
      icon: "pi pi-question-circle",
      accept: () => dispatch(createHaul(rowData)),
      reject: () => null,
    });
  };

  // Handle DateRangeSelector component operations
  const onDateRangeSelected = (e) => {
    let dateStart; // e.value[0]
    let dateEnd; // e.value[1]

    if (!e || !e.value) {
      // Clear ranges and filteredHauls (DataTable will default to `hauls`). Used when clear button pressed
      setRangeDates([]);
      setFilteredHauls([]);
      return;
    }

    if (e.value[0] && e.value[1]) {
      // Convert event values to dayjs dates
      dateStart = dayjs(e.value[0]);
      dateEnd = dayjs(e.value[1]);

      // Get difference between start and end dates
      const difference = dateEnd.diff(dateStart, "day");

      // Create an array of dates including start and end dates
      let dates = [];
      for (let i = 0; i < difference + 1; i++) {
        dates.push(new Date(dateStart.add(i, "day")).toDateString()); // toDateString format is used here for ease of comparing dates in another function
      }

      // Set rangeDates in state to this array
      setRangeDates(dates);
    }
  };

  // Handle driver selected in dropdown
  const onSelectDriver = (driverId) => {
    if (!driverId) {
      return new Error("onSelectDriver: Missing driverId");
    }

    setSelectedDriverId(driverId);
  };
  // #endregion

  // RUN ONCE
  useEffect(() => {
    initFilters();
    if (hauls.length === 0) {
      dispatch(getHauls());
    }
    if (drivers.length === 0) {
      dispatch(getDrivers());
    }

    if (localStorage.getItem("selectedHaulsDateRange")) {
      const _haulsDateRange = JSON.parse(localStorage.getItem("selectedHaulsDateRange"));

      if (_haulsDateRange.length > 0) {
        // Manually call onDateRangeSelected, passing in a pseudo-event object based on localStorage values
        let e = {
          value: [new Date(_haulsDateRange[0]), new Date(_haulsDateRange[1])],
        };
        onDateRangeSelected(e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (haulsError && haulsMessage && haulsMessage.length > 0) {
      toast.error(haulsMessage);
    }

    if (haulsSuccess && haulsMessage && haulsMessage.length > 0) {
      toast.success(haulsMessage);
    }

    if (driversError && driversMessage && driversMessage.length > 0) {
      toast.error(driversMessage);
    }

    if (driversSuccess && driversMessage && driversMessage.length > 0) {
      toast.success(driversMessage);
    }

    if (rangeDates && rangeDates.length > 0) {
      // Filter hauls first by date range (rangeDates), then by the driver's id
      let _selectedDriverId = localStorage.getItem("selectedDriverId") || null;

      // Filter hauls within selected date range
      if (_selectedDriverId && _selectedDriverId.length > 0) {
        let _filteredHauls = hauls.filter((haul) => haul.driver === _selectedDriverId && rangeDates.includes(new Date(haul.dateHaul).toDateString()));
        setFilteredHauls(_filteredHauls);
      } else {
        console.log("No driver id found, no hauls to display");
        setFilteredHauls([]);
      }
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
    rangeDates,
    rangeDates.length,
    selectedDriverId,
    dispatch,
  ]);

  return (
    <section>
      <h1 style={{ textAlign: "center", fontSize: "20pt" }}>C&H Hauls</h1>

      <ConfirmPopup />

      <div className="datatable-templating-demo">
        <div className="card" style={{ height: "calc(100vh - 145px)" }}>
          <DataTable
            value={filteredHauls}
            loading={haulsLoading}
            header={dataTableHeaderTemplate}
            globalFilterFields={["dateHaul", "broker", "invoice", "chInvoice", "invoice", "from", "to", "product"]}
            scrollable
            autoLayout
            size="small"
            scrollHeight="flex"
            sortMode="multiple"
            removableSort
            multiSortMeta={multiSortMeta}
            onSort={(e) => setMultiSortMeta(e.multiSortMeta)}
            responsiveLayout="scroll"
            filter="true"
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
            <Column field="dateHaul" header="Date" body={dateHaulTemplate} dataType="date" sortable></Column>

            {/* TIME (DATE HAUL) */}
            <Column field="timeHaul" header="Time" body={timeHaulTemplate} dataType="date" sortable></Column>

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
