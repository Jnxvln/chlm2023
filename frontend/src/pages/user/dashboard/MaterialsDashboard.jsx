import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';

import { useSelector } from "react-redux"

function MaterialsDashboard() {

  const { materials } = useSelector((state) => state.materials)

  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  const imageBodyTemplate = (rowData) => {
    return <img src={`images/product/${rowData.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={rowData.image} className="product-image" />;
  }

  const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.price);
  }

  const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  }

  const statusBodyTemplate = (rowData) => {
    return <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
  }

  const header = (
    <div className="table-header">
      Products
      <Button icon="pi pi-refresh" />
    </div>
  );

  const footer = `I am the footer`;

  return (
    <section>
      <h1>Materials</h1>

      <div className="datatable-templating-demo">
        <div className="card">
          <DataTable value={materials} header={header} footer={footer} responsiveLayout="scroll">
            <Column field="name" header="Name"></Column>
            <Column header="Image" body={imageBodyTemplate}></Column>
            <Column field="price" header="Price" body={priceBodyTemplate}></Column>
            <Column field="category" header="Category"></Column>
            <Column field="rating" header="Reviews" body={ratingBodyTemplate}></Column>
            <Column header="Status" body={statusBodyTemplate}></Column>
          </DataTable>
        </div>
      </div>
    </section>
  )
}

export default MaterialsDashboard