import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import DeliveryClientForm from "../../../components/user/dashboard/deliveries/DeliveryClientForm";
import DeliveryForm from "../../../components/user/dashboard/deliveries/DeliveryForm";
import EditDeliveryForm from "../../../components/user/dashboard/deliveries/EditDeliveryForm";
// PrimeReact Components
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputText } from "primereact/inputtext";
import { Tooltip } from "primereact/tooltip";
import { ContextMenu } from "primereact/contextmenu";
import { FilterMatchMode } from "primereact/api";
import { ConfirmPopup } from "primereact/confirmpopup"; // To use <ConfirmPopup> tag
import { confirmPopup } from "primereact/confirmpopup"; // To use confirmPopup method
// Store data
import { useSelector, useDispatch } from "react-redux";
import {
  deleteDelivery,
  getDeliveries,
  resetDeliveryMessages,
} from "../../../features/deliveries/deliverySlice";
import {
  getDeliveryClients,
  resetDeliveryClientMessages,
} from "../../../features/deliveryClients/deliveryClientSlice";

function DeliveriesDashboard() {
  // #region VARS ------------------------
  const dispatch = useDispatch();
  const deliveryClientOverlayPanel = useRef(null);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedClientAvatar, setSelectedClientAvatar] = useState(null);
  const [deliveryRowSelected, setDeliveryRowSelected] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [copyCoordinates, setCopyCoordinates] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    productName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    address: { value: null, matchMode: FilterMatchMode.CONTAINS },
    contactName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    contactPhone: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const deliveryMapMarkerReference = useRef(null);
  const deliveryMarkerContextMenuItems = [
    {
      label: "Copy coordinates",
      icon: "pi pi-copy",
      command: () => {
        const coords = `${copyCoordinates[0]},${copyCoordinates[1]}`;
        navigator.clipboard.writeText(coords);
        toast.success("Coordinates copied!");
      },
    },
  ];

  // Pull in delivery state
  const { deliveries, deliveriesLoading, deliveriesError, deliveriesSuccess, deliveriesMessage } =
    useSelector((state) => state.deliveries);

  // Pull in delivery client state
  const { deliveryClients, deliveryClientsError, deliveryClientsSuccess, deliveryClientsMessage } =
    useSelector((state) => state.deliveryClients);
  // #endregion

  // #region COMPONENT TEMPLATES
  const deliveryDateTemplate = (rowData) => {
    return <>{dayjs(rowData.deliveryDate).format("MM/DD/YY")}</>;
  };

  const deliveryClientTemplate = (rowData) => {
    return (
      <>
        <Avatar
          icon="pi pi-user"
          onClick={(e) => {
            setSelectedClientId(rowData.deliveryClient);
            deliveryClientOverlayPanel.current.toggle(e);
          }}
        />
      </>
    );
  };

  const addressTemplate = (rowData) => {
    return <div style={{ whiteSpace: "pre" }}>{rowData.address}</div>;
  };

  const contactNameTemplate = (rowData) => {
    return <>{rowData.contactName}</>;
  };

  const contactPhoneTemplate = (rowData) => {
    return <div style={{ whiteSpace: "pre" }}>{rowData.contactPhone}</div>;
  };

  const coordinatesTemplate = (rowData) => {
    if (rowData.coordinates) {
      const parts = rowData.coordinates.replace(/ /g, "").split(",");
      const coords = [parseFloat(parts[0]).toFixed(6), parseFloat(parts[1]).toFixed(6)];

      return (
        <>
          <ContextMenu
            model={deliveryMarkerContextMenuItems}
            ref={deliveryMapMarkerReference}
          ></ContextMenu>
          <a
            href={`https://maps.google.com/?q=${coords[0]},${coords[1]}`}
            target="_blank"
            rel="noreferrer"
            onContextMenu={(e) => {
              setCopyCoordinates(coords);
              deliveryMapMarkerReference.current.show(e);
            }}
          >
            <Tooltip target=".deliveryMapMarker">
              <span>
                {coords[0]}, {coords[1]}
              </span>
            </Tooltip>
            <i className="pi pi-map-marker deliveryMapMarker" tooltip="Enter your username" />
          </a>
        </>
      );
    } else {
      return <></>;
    }
  };

  const productNameTemplate = (rowData) => {
    return <>{rowData.productName}</>;
  };

  const productQuantityTemplate = (rowData) => {
    return <>{rowData.productQuantity}</>;
  };

  const hasPaidTemplate = (rowData) => {
    return (
      <div>
        {Boolean(rowData.hasPaid) ? (
          <i className="pi pi-check" style={{ color: "green", fontWeight: "bold" }}></i>
        ) : (
          <i className="pi pi-dollar" style={{ color: "red", fontWeight: "bold" }}></i>
        )}
      </div>
    );
  };

  const completedTemplate = (rowData) => {
    return (
      <div>
        {Boolean(rowData.completed) ? (
          <i className="pi pi-check" style={{ color: "green", fontWeight: "bold" }}></i>
        ) : (
          <i className="pi pi-times" style={{ color: "red", fontWeight: "bold" }}></i>
        )}
      </div>
    );
  };

  const dataTableHeaderTemplate = () => {
    return (
      <div className="flex justify-content-between">
        <div>
          <div className="flex" style={{ gap: "1em" }}>
            <DeliveryForm />
            <DeliveryClientForm />
          </div>
        </div>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Phone, address, or product name"
          />
        </span>
      </div>
    );
  };

  const actionsTemplate = (rowData) => {
    return (
      <div style={{ display: "flex" }}>
        <EditDeliveryForm delivery={rowData} />
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
      productName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      address: { value: null, matchMode: FilterMatchMode.CONTAINS },
      contactName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      contactPhone: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    setGlobalFilterValue("");
  };
  // #endregion

  // Delete delivery confirmation
  const onDelete = (e, rowData) => {
    confirmPopup({
      target: e.target,
      message: `Delete this delivery?`,
      icon: "pi pi-exclamation-triangle",
      accept: () => dispatch(deleteDelivery(rowData._id)),
      reject: () => null,
    });
  };

  // RUN ONCE - INIT FILTERS
  useEffect(() => {
    initFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for messages
  useEffect(() => {
    if (deliveryClients.length === 0) {
      dispatch(getDeliveryClients());
    }

    if (deliveriesError && deliveriesMessage.length > 0) {
      toast.error(deliveriesMessage);
    }

    if (deliveryClientsSuccess && deliveryClientsMessage.length > 0) {
      toast.success(deliveryClientsMessage);
    }

    if (deliveries.length === 0) {
      dispatch(getDeliveries());
    }

    if (deliveriesError && deliveriesMessage.length > 0) {
      toast.error(deliveriesMessage);
    }

    if (deliveriesSuccess && deliveriesMessage.length > 0) {
      toast.success(deliveriesMessage);
    }

    // Check for selected client avatar (in Deliveries DataTable)
    if (selectedClientId) {
      const client = deliveryClients.find((client) => client._id === selectedClientId);
      setSelectedClientAvatar(client);
    }

    dispatch(resetDeliveryClientMessages());
    dispatch(resetDeliveryMessages());
  }, [
    selectedClientId,
    deliveryClients,
    deliveryClientsError,
    deliveryClientsSuccess,
    deliveryClientsMessage,
    deliveries,
    deliveriesError,
    deliveriesSuccess,
    deliveriesMessage,
    dispatch,
  ]);

  return (
    <section>
      <h1 style={{ textAlign: "center", fontSize: "20pt" }}>C&H Deliveries</h1>

      <ConfirmPopup />

      <OverlayPanel ref={deliveryClientOverlayPanel} showCloseIcon>
        {selectedClientAvatar && (
          <section>
            {/* Render First & Last Name */}
            {selectedClientAvatar.firstName && selectedClientAvatar.lastName && (
              <div style={{ marginBottom: "0.6em" }}>
                <strong>Name:</strong> {selectedClientAvatar.firstName}{" "}
                {selectedClientAvatar.lastName}
              </div>
            )}

            {/* Render phone */}
            {selectedClientAvatar.phone && (
              <div style={{ marginBottom: "0.6em" }}>
                <strong>Phone(s):</strong>{" "}
                <div style={{ whiteSpace: "pre" }}>{selectedClientAvatar.phone}</div>
              </div>
            )}

            {/* Render address */}
            {selectedClientAvatar.address && (
              <div style={{ marginBottom: "0.6em" }}>
                <strong>Address:</strong>{" "}
                <div style={{ whiteSpace: "pre" }}>{selectedClientAvatar.address}</div>
              </div>
            )}

            {/* Render company */}
            {selectedClientAvatar.company && (
              <div style={{ marginBottom: "0.6em" }}>
                <strong>Company:</strong>{" "}
                <div style={{ whiteSpace: "pre" }}>{selectedClientAvatar.company}</div>
              </div>
            )}

            {/* Render coordinates */}
            {selectedClientAvatar.coordinates && (
              <div style={{ marginBottom: "0.6em" }}>
                <strong>Coords:</strong>{" "}
                <div style={{ whiteSpace: "pre" }}>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedClientAvatar.coordinates}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {selectedClientAvatar.coordinates}
                  </a>
                </div>
              </div>
            )}
          </section>
        )}
      </OverlayPanel>

      <div className="datatable-templating-demo">
        <div className="card" style={{ height: "calc(100vh - 145px)" }}>
          <DataTable
            value={deliveries}
            loading={deliveriesLoading}
            header={dataTableHeaderTemplate}
            globalFilterFields={["productName", "address", "contactName", "contactPhone"]}
            scrollable
            autoLayout
            responsiveLayout="scroll"
            size="small"
            scrollHeight="flex"
            sortMode="multiple"
            removableSort
            filter
            filters={filters}
            filterDisplay="row"
            onFilter={(e) => setFilters(e.filters)}
            selectionMode="single"
            selection={deliveryRowSelected}
            onSelectionChange={(e) => setDeliveryRowSelected(e.value)}
            dataKey="_id"
            stateStorage="session"
            stateKey="dt-deliveries-session"
            emptyMessage="No deliveries found"
            stripedRows
          >
            {/* Has Paid */}
            <Column field="hasPaid" header="Paid?" body={hasPaidTemplate}></Column>

            {/* Delivery Date */}
            <Column
              field="deliveryDate"
              header="Deliver"
              body={deliveryDateTemplate}
              sortable
            ></Column>

            {/* Delivery Client */}
            <Column
              field="deliveryClient"
              header="Client"
              body={deliveryClientTemplate}
              sortable
            ></Column>

            {/* Product Name */}
            <Column
              field="productName"
              header="Material"
              body={productNameTemplate}
              sortable
            ></Column>

            {/* Product Quantity */}
            <Column field="productQuantity" header="Qty" body={productQuantityTemplate}></Column>

            {/* Address */}
            <Column field="address" header="Address" body={addressTemplate} sortable></Column>

            {/* Contact Name */}
            <Column
              field="contactName"
              header="Contact Name"
              body={contactNameTemplate}
              sortable
            ></Column>

            {/* Contact  Phone */}
            <Column
              field="contactPhone"
              header="Contact Phone"
              body={contactPhoneTemplate}
              sortable
            ></Column>

            {/* Coordinates */}
            <Column
              field="coordinates"
              header="Coords"
              body={coordinatesTemplate}
              sortable
            ></Column>

            {/* Completed */}
            <Column field="completed" header="Completed?" body={completedTemplate}></Column>

            {/* Actions */}
            <Column header="Actions" body={actionsTemplate}></Column>
          </DataTable>
        </div>
      </div>
    </section>
  );
}

export default DeliveriesDashboard;
