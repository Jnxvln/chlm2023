import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Avatar } from "primereact/avatar";
import { OverlayPanel } from "primereact/overlaypanel";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  getDeliveries,
  resetDeliveryMessages,
} from "../../../features/deliveries/deliverySlice";
import {
  getDeliveryClients,
  resetDeliveryClientMessages,
} from "../../../features/deliveryClients/deliveryClientSlice";
import dayjs from "dayjs";
import DeliveryClientForm from "../../../components/user/dashboard/deliveries/deliveryClientForm";
import DeliveryForm from "../../../components/user/dashboard/deliveries/deliveryForm";

function DeliveriesDashboard() {
  const dispatch = useDispatch();
  const deliveryClientOverlayPanel = useRef(null);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedClientAvatar, setSelectedClientAvatar] = useState(null);
  const { deliveries, deliveriesLoading, deliveriesError, deliveriesMessage } =
    useSelector((state) => state.deliveries);

  const {
    deliveryClients,
    deliveryClientsLoading,
    deliveryClientsError,
    deliveryClientsMessage,
  } = useSelector((state) => state.deliveryClients);

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
    return <>{rowData.contactPhone}</>;
  };

  const coordinatesTemplate = (rowData) => {
    if (rowData.coordinates) {
      const parts = rowData.coordinates.replace(/ /g, "").split(",");

      return (
        <div>
          <div>{parts[0]},</div>
          <div>{parts[1]}</div>
        </div>
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
          <i
            className="pi pi-check"
            style={{ color: "green", fontWeight: "bold" }}
          ></i>
        ) : (
          <i
            className="pi pi-dollar"
            style={{ color: "red", fontWeight: "bold" }}
          ></i>
        )}
      </div>
    );
  };

  const completedTemplate = (rowData) => {
    return (
      <div>
        {Boolean(rowData.completed) ? (
          <i
            className="pi pi-check"
            style={{ color: "green", fontWeight: "bold" }}
          ></i>
        ) : (
          <i
            className="pi pi-times"
            style={{ color: "red", fontWeight: "bold" }}
          ></i>
        )}
      </div>
    );
  };

  const dataTableHeaderTemplate = () => {
    return (
      <div className="flex justify-content-between">
        <div>
          <DeliveryForm />
          <DeliveryClientForm />
        </div>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          {/* <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="First, last, or truck #"
          /> */}
        </span>
      </div>
    );
  };
  // #endregion

  // Fetch data
  useEffect(() => {
    dispatch(getDeliveryClients());
    dispatch(getDeliveries());
  }, []);

  // Check for messages
  useEffect(() => {
    if (deliveryClientsError) {
      toast.error(deliveryClientsError);
    }

    if (deliveriesError) {
      toast.error(deliveriesMessage);
    }

    dispatch(resetDeliveryClientMessages());
    dispatch(resetDeliveryMessages());
  }, [
    deliveryClientsError,
    deliveryClientsMessage,
    deliveriesError,
    deliveriesMessage,
  ]);

  // Check for selected client avatar (in Deliveries DataTable)
  useEffect(() => {
    const client = deliveryClients.find(
      (client) => client._id === selectedClientId
    );
    setSelectedClientAvatar(client);
  }, [selectedClientId]);

  return (
    <section>
      <h1>Deliveries</h1>

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
                <div style={{ whiteSpace: "pre" }}>
                  {selectedClientAvatar.phone}
                </div>
              </div>
            )}

            {/* Render address */}
            {selectedClientAvatar.address && (
              <div style={{ marginBottom: "0.6em" }}>
                <strong>Address:</strong>{" "}
                <div style={{ whiteSpace: "pre" }}>
                  {selectedClientAvatar.address}
                </div>
              </div>
            )}

            {/* Render company */}
            {selectedClientAvatar.company && (
              <div style={{ marginBottom: "0.6em" }}>
                <strong>Company:</strong>{" "}
                <div style={{ whiteSpace: "pre" }}>
                  {selectedClientAvatar.company}
                </div>
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
          >
            {/* Has Paid */}
            <Column
              field="hasPaid"
              header="Paid?"
              body={hasPaidTemplate}
            ></Column>

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
            <Column
              field="productQuantity"
              header="Qty"
              body={productQuantityTemplate}
            ></Column>

            {/* Address */}
            <Column
              field="address"
              header="Address"
              body={addressTemplate}
              filter
              filterField="address"
              sortable
            ></Column>

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
              filter
              filterField="coordinates"
              sortable
            ></Column>

            {/* Completed */}
            <Column
              field="completed"
              header="Completed?"
              body={completedTemplate}
            ></Column>
          </DataTable>
        </div>
      </div>
    </section>
  );
}

export default DeliveriesDashboard;
