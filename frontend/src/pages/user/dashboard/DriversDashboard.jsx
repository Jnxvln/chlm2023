import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { classNames } from "primereact/utils";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

function DriversDashboard() {
  return (
    <section>
      <h1>Drivers</h1>

      <div className="datatable-templating-demo">
        <div className="card" style={{ height: "calc(100vh - 145px)" }}>
          <DataTable></DataTable>
        </div>
      </div>
    </section>
  );
}

export default DriversDashboard;
