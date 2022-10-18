import React, { useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { Button } from "primereact/button";
import { useSelector } from "react-redux";
import MaterialForm from "../../../components/user/dashboard/materials/MaterialForm";

function MaterialsDashboard() {
  const { materials } = useSelector((state) => state.materials);

  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={`images/product/${rowData.image}`}
        onError={(e) =>
          (e.target.src =
            "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
        }
        alt={rowData.image}
        className="product-image"
      />
    );
  };

  const stockTemplate = (rowData) => {
    return (
      <span className={`product-badge status-${rowData.stock.toLowerCase()}`}>
        {rowData.stock}
      </span>
    );
  };

  const header = (
    <div className="table-header">
      Products
      {/* <Button icon="pi pi-refresh" /> */}
    </div>
  );

  const footer = `I am the footer`;

  useEffect(() => {}, [materials]);

  return (
    <section>
      <h1>Materials</h1>

      <MaterialForm />

      <div className="datatable-templating-demo">
        <div className="card">
          <DataTable
            value={materials}
            header={header}
            footer={footer}
            responsiveLayout="scroll"
          >
            <Column field="name" header="Name"></Column>
            <Column field="category" header="Category"></Column>
            <Column header="Image" body={imageBodyTemplate}></Column>
            <Column field="binNumber" header="Bin"></Column>
            <Column field="category" header="Category"></Column>
            <Column field="size" header="Size"></Column>
            <Column header="Stock" body={stockTemplate}></Column>
            <Column field="notes" header="Notes"></Column>
            <Column field="description" header="Description"></Column>
            <Column field="isFeatured" header="Featured"></Column>
            <Column field="isActive" header="Active"></Column>
            <Column field="isTruckable" header="Truckable"></Column>
          </DataTable>
        </div>
      </div>
    </section>
  );
}

export default MaterialsDashboard;
