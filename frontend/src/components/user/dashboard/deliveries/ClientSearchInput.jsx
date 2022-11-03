import { useState } from "react";
import DeliveryForm from "./DeliveryForm";
import DeliveryClientForm from "./DeliveryClientForm";
// PrimeReact Components
import { AutoComplete } from "primereact/autocomplete";

function ClientSearchInput({ deliveryClients }) {
  // #region VARS -------------------------------
  const [searchInput, setSearchInput] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  // #endregion

  // #region TEMPLATES -------------------------------
  const searchItemTemplate = (option) => {
    return (
      <div className="flex flex-column gap-2" style={{ width: "100%" }}>
        <div>
          <strong>
            {option.firstName} {option.lastName}
          </strong>
        </div>
        <div style={{ whiteSpace: "pre" }}>{option.phone}</div>
        <div>
          <address style={{ whiteSpace: "pre" }}>{option.address}</address>
        </div>
        <div>
          <DeliveryForm selectedClient={option} />
        </div>
      </div>
    );
  };

  const searchFieldTemplate = (option) => {
    return `${option.firstName} ${option.lastName}`;
  };
  // #endregion

  const searchDeliveryClient = (e) => {
    const { query } = e;
    console.log(query);
    let filteredClients = deliveryClients.filter(
      (client) =>
        client.firstName.toLowerCase().includes(query.toLowerCase()) ||
        client.lastName.toLowerCase().includes(query.toLowerCase()) ||
        `${client.firstName.toLowerCase()} ${client.lastName.toLowerCase()}`.includes(
          query.toLowerCase()
        ) ||
        client.phone.toLowerCase().includes(query.toLowerCase()) ||
        client.address.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredClients(filteredClients);
  };

  return (
    <>
      <AutoComplete
        dropdown
        value={searchInput}
        field={searchFieldTemplate}
        itemTemplate={searchItemTemplate}
        suggestions={filteredClients}
        completeMethod={searchDeliveryClient}
        onChange={(e) => setSearchInput(e.value)}
        placeholder="Customer search (name, phone, address)"
        style={{ width: "15vw" }}
      />
      {filteredClients.length <= 0 && searchInput.length > 0 ? (
        <DeliveryClientForm clientName={searchInput} />
      ) : null}
    </>
  );
}

export default ClientSearchInput;
