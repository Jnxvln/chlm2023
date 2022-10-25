import { useState, useEffect } from "react";
import DialogHeader from "../../../dialogComponents/DialogHeader";
import DialogFooter from "../../../dialogComponents/DialogFooter_SubmitClose";
// PrimeReact Components
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
// Store data
import { useSelector, useDispatch } from "react-redux";
import { updateHaul } from "../../../../features/hauls/haulSlice";

function EditHaulForm({ haul }) {
  // #region VARS ------------------------
  const initialState = {
    _id: "",
    driver: undefined,
    dateHaul: undefined,
    truck: "",
    broker: "",
    chInvoice: "",
    loadType: "",
    invoice: "",
    from: "",
    to: "",
    product: "",
    tons: null,
    rate: null,
    miles: null,
    payRate: null,
    driverPay: null,
  };

  const loadTypeOptions = [
    { label: "End Dump", value: "enddump" },
    { label: "Flatbed (%)", value: "flatbedperc" },
    { label: "Flatbed (mi)", value: "flatbedmi" },
  ];

  const [formDialog, setFormDialog] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  // Select drivers from store
  const { drivers } = useSelector((state) => state.drivers);

  // Destructure form data
  const {
    _id,
    driver,
    dateHaul,
    truck,
    broker,
    chInvoice,
    loadType,
    invoice,
    from,
    to,
    product,
    tons,
    rate,
    miles,
    payRate,
    driverPay,
  } = formData;
  // #endregion

  // #region COMPONENT RENDERERS
  const haulDialogHeader = () => {
    return <DialogHeader resourceType="Haul" resourceName={`Inv ${haul.invoice}`} isEdit />;
  };

  const haulDialogFooter = () => {
    return <DialogFooter onClose={onClose} onSubmit={onSubmit} />;
  };
  // #endregion

  // #region COMPONENT TEMPLATES
  const driversItemTemplate = (rowData) => {
    return (
      <>
        {rowData.firstName} {rowData.lastName}
      </>
    );
  };

  const driverOptionLabelTemplate = (rowData) => {
    return (
      <>
        {rowData.firstName} {rowData.lastName}
      </>
    );
  };
  // #endregion

  // #region FORM HANDLERS
  // Handle form reset
  const resetForm = () => {
    if (haul) {
      setFormData((prevState) => ({
        ...prevState,
        _id: haul._id,
        driver: haul.driver,
        dateHaul: haul.dateHaul,
        truck: haul.truck,
        broker: haul.broker,
        chInvoice: haul.chInvoice,
        loadType: haul.loadType,
        invoice: haul.invoice,
        from: haul.from,
        to: haul.to,
        product: haul.product,
        tons: haul.tons,
        rate: haul.rate,
        miles: haul.miles,
        payRate: haul.payRate,
        driverPay: haul.driverPay,
      }));
    } else {
      setFormData(initialState);
    }
  };

  // Handle form closing
  const onClose = () => {
    resetForm();
    setFormDialog(false);
  };

  // Handle form text input
  const onChange = (e) => {
    if (e.hasOwnProperty("target")) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  // Handle form number input
  const onChangeNumber = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.originalEvent.target.name]: e.originalEvent.target.value,
    }));
  };

  // Handle form submit
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(updateHaul(formData));
    onClose();
  };
  // #endregion

  useEffect(() => {
    if (haul) {
      setFormData((prevState) => ({
        ...prevState,
        _id: haul._id,
        driver: haul.driver,
        dateHaul: haul.dateHaul,
        truck: haul.truck,
        broker: haul.broker,
        chInvoice: haul.chInvoice,
        loadType: haul.loadType,
        invoice: haul.invoice,
        from: haul.from,
        to: haul.to,
        product: haul.product,
        tons: haul.tons,
        rate: haul.rate,
        miles: haul.miles,
        payRate: haul.payRate,
        driverPay: haul.driverPay,
      }));
    }

    if (drivers && driver) {
      // Get the current driver as an object
      const driverObj = drivers.find(d => d._id === driver)

      // Set the FormData's defaultTruck field to driverObj's defaultTruck & associated driver pay
      if (driverObj) {
        setFormData((prevState) => ({
          ...prevState,
          truck: driverObj.defaultTruck,
        }))

        if (loadType === 'enddump') {
          setFormData((prevState) => ({
            ...prevState,
            driverPay: driverObj.endDumpPayRate,
          }))
        }
  
        if (loadType === 'flatbedperc') {
          setFormData((prevState) => ({
            ...prevState,
            driverPay: driverObj.flatBedPayRate,
          }))
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [haul, driver, drivers, dispatch]);

  return (
    <section>
      <Button icon="pi pi-pencil" iconPos="left" onClick={() => setFormDialog(true)} />

      <Dialog
        id="editHaulDialog"
        visible={formDialog}
        header={haulDialogHeader}
        footer={haulDialogFooter}
        onHide={onClose}
        blockScroll
      >
        <form onSubmit={onSubmit}>
          <div class="formgrid grid">
            {/* ID */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="_id"
                    name="_id"
                    value={_id}
                    placeholder="ID"
                    onChange={onChange}
                    style={{ width: "100%" }}
                    readOnly
                    required
                  />
                  <label htmlFor="_id">ID</label>
                </span>
              </div>
            </div>
          </div>

          {/* DRIVER, LOAD TYPE, TRUCK */}
          <div className="formgrid grid">

            {/* Driver */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <Dropdown
                    name="driver"
                    optionLabel={driverOptionLabelTemplate}
                    optionValue="_id"
                    value={driver}
                    options={drivers.filter((driver) => driver.isActive === true)}
                    onChange={onChange}
                    itemTemplate={driversItemTemplate}
                    showClear
                    placeholder="Choose..."
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="driver">Driver</label>
                </span>
              </div>
            </div>

            {/* Load Type */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <Dropdown
                    name="loadType"
                    optionLabel="label"
                    optionValue="value"
                    value={loadType}
                    options={loadTypeOptions}
                    onChange={onChange}
                    showClear
                    placeholder="Choose..."
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="loadType">Load Type</label>
                </span>
              </div>
            </div>

            {/* Truck */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="truck"
                    name="truck"
                    value={truck}
                    placeholder="Truck"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="truck">Truck</label>
                </span>
              </div>
            </div>
          </div>

          {/* DATE HAUL, CUSTOMER (BROKER), LOAD/REF # (invoice) */}
          <div className="formgrid grid">
            {/* Date Haul */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <Calendar
                    id="dateHaul"
                    name="dateHaul"
                    value={new Date(dateHaul)}
                    onChange={onChange}
                    showTime
                    hourFormat="12"
                    style={{ width: "100%" }}
                  ></Calendar>
                  <label htmlFor="dateHaul">Haul Date</label>
                </span>
              </div>
            </div>

            {/* Customer (broker) */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="broker"
                    name="broker"
                    value={broker}
                    placeholder="broker"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="broker">Customer</label>
                </span>
              </div>
            </div>

            {/* Load/Ref # (invoice) */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="invoice"
                    name="invoice"
                    value={invoice}
                    placeholder="invoice"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="invoice">Load/Ref #</label>
                </span>
              </div>
            </div>
          </div>

          {/* CHINVOICE, FROM, TO */}
          <div className="formgrid grid">
            {/* chInoice */}
            { (loadType === 'flatbedperc' || loadType === 'flatbedmi') && <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="chInvoice"
                    name="chInvoice"
                    value={chInvoice}
                    placeholder="CH Invoice"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="chInvoice">CH Invoice</label>
                </span>
              </div>
            </div>}
            

            {/* From */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="from"
                    name="from"
                    value={from}
                    placeholder="From"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="from">From</label>
                </span>
              </div>
            </div>

            {/* To */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="to"
                    name="to"
                    value={to}
                    placeholder="To"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="to">To</label>
                </span>
              </div>
            </div>
          </div>

          {/* MATERIAL */}
          <div className="formgrid grid">
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <span className="p-float-label">
                  <InputText
                    id="product"
                    name="product"
                    value={product}
                    placeholder="Material"
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                  <label htmlFor="product">Material</label>
                </span>
              </div>
            </div>
          </div>

          {/* RATE or PAY RATE, TONS, MILES, DRIVER PAY  */}
          <div className="formgrid grid">

            {/* Rate */}
            { (loadType === 'enddump' || loadType === 'flatbedmi') && <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <label htmlFor="ncRate">Rate</label>
                <InputNumber
                  id="rate"
                  name="rate"
                  value={rate}
                  placeholder="Rate"
                  mode="decimal"
                  minFractionDigits={2}
                  step={0.01}
                  onChange={onChangeNumber}
                  style={{ width: "100%" }}
                  required
                />
              </div>
            </div>}
            
            {/* Pay Rate */}
            { loadType === 'flatbedperc' && <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <label htmlFor="payRate">Pay Rate</label>
                <InputNumber
                  id="payRate"
                  name="payRate"
                  value={payRate}
                  placeholder="Pay Rate"
                  mode="decimal"
                  minFractionDigits={2}
                  step={0.01}
                  onChange={onChangeNumber}
                  style={{ width: "100%" }}
                  required
                />
              </div>
            </div>}
            
            {/* Tons */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <label htmlFor="tons">Tons</label>
                <InputNumber
                  id="tons"
                  name="tons"
                  value={tons}
                  placeholder="Tons"
                  mode="decimal"
                  minFractionDigits={2}
                  step={0.01}
                  onChange={onChangeNumber}
                  style={{ width: "100%" }}
                  required
                />
              </div>
            </div>

            {/* Miles */}
            { loadType === 'flatbedmi' && <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <label htmlFor="miles">Miles</label>
                <InputNumber
                  id="miles"
                  name="miles"
                  value={miles}
                  placeholder="Miles"
                  mode="decimal"
                  minFractionDigits={2}
                  step={0.01}
                  onChange={onChangeNumber}
                  style={{ width: "100%" }}
                  required
                />
              </div>
            </div>}

            {/* Driver Pay */}
            { loadType !== 'flatbedmi' && <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <label htmlFor="driverPay">Driver Pay</label>
                <InputNumber
                  id="driverPay"
                  name="driverPay"
                  value={driverPay}
                  placeholder="Driver Pay"
                  mode="decimal"
                  minFractionDigits={2}
                  step={0.01}
                  onChange={onChangeNumber}
                  style={{ width: "100%" }}
                  required
                />
              </div>
            </div>}
          </div>
        </form>
      </Dialog>
    </section>
  );
}

export default EditHaulForm;
