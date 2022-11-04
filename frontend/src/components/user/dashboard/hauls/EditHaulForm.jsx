import { useState, useEffect } from "react";
import DialogHeader from "../../../dialogComponents/DialogHeader";
import DialogFooter from "../../../dialogComponents/DialogFooter_SubmitClose";
import HaulFromSelector from "./HaulFromSelector";
import HaulToSelector from "./HaulToSelector";
import HaulLocationSelector from "./HaulLocationSelector";
import HaulVendorProductSelector from "./HaulMaterialSelector";
// PrimeReact Components
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
// Store data
import { useSelector, useDispatch } from "react-redux";
import { getHauls, updateHaul } from "../../../../features/hauls/haulSlice";
import { getVendors } from "../../../../features/vendors/vendorSlice";
import { getVendorProducts } from "../../../../features/vendorProducts/vendorProductSlice";
import { getVendorLocations } from "../../../../features/vendorLocations/vendorLocationSlice";
import { getFreightRoutes } from "../../../../features/freightRoutes/freightRouteSlice";
import { getDrivers } from "../../../../features/drivers/driverSlice";

function EditHaulForm({ haul, selectedDriverId }) {
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
    vendorLocation: "",
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
  const [vendorSelected, setVendorSelected] = useState(null);
  const [vendorProductSelected, setVendorProductSelected] = useState(null);
  const [vendorLocationSelected, setVendorLocationSelected] = useState(null);
  const dispatch = useDispatch();

  // Select hauls from store
  const { hauls } = useSelector((state) => state.hauls);

  // Select drivers from store
  const { drivers } = useSelector((state) => state.drivers);

  // Select vendors from store
  const { vendors } = useSelector((state) => state.vendors);

  // Select vendor products from store
  const { vendorProducts } = useSelector((state) => state.vendorProducts);

  // Select vendor locations from store
  const { vendorLocations } = useSelector((state) => state.vendorLocations);

  // Select freight routes from store
  const { freightRoutes } = useSelector((state) => state.freightRoutes);

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
    vendorLocation,
    to,
    product,
    tons,
    rate,
    miles,
    payRate,
    driverPay,
  } = formData;
  // #endregion

  // #region COMPONENT RENDERERS ------------------------
  const haulDialogHeader = () => {
    return <DialogHeader resourceType="Haul" resourceName={`Inv ${haul.invoice}`} isEdit />;
  };

  const haulDialogFooter = () => {
    return <DialogFooter onClose={onClose} onSubmit={onSubmit} />;
  };
  // #endregion

  // #region COMPONENT TEMPLATES ------------------------
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

  // #region FORM HANDLERS ------------------------
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

  const onVendorSelected = (selectedVendor) => {
    setFormData((prevState) => ({
      ...prevState,
      from: selectedVendor.name,
    }));
    setVendorSelected(selectedVendor);
  };

  const onVendorLocationSelected = (selectedVendorLocation) => {
    setVendorLocationSelected(selectedVendorLocation);
  };

  const onVendorProductSelected = (selectedVendorProduct) => {
    setFormData((prevState) => ({
      ...prevState,
      product: selectedVendorProduct.name,
    }));
    setVendorProductSelected(selectedVendorProduct);
  };

  const onFreightRouteSelected = (selectedFreightRoute) => {
    setFormData((prevState) => ({
      ...prevState,
      to: selectedFreightRoute.destination,
      rate: selectedFreightRoute.freightCost,
    }));
    setVendorSelected(selectedFreightRoute);
  };

  // Handle form submit
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(updateHaul(formData));
    onClose();
  };
  // #endregion

  // Fetch data
  useEffect(() => {
    if (hauls.length === 0) {
      dispatch(getHauls());
    }

    if (drivers.length === 0) {
      dispatch(getDrivers());
    }

    if (vendorProducts.length === 0) {
      dispatch(getVendorProducts());
    }

    if (vendors.length === 0) {
      dispatch(getVendors());
    }

    if (vendorLocations.length === 0) {
      dispatch(getVendorLocations());
    }

    if (freightRoutes.length === 0) {
      dispatch(getFreightRoutes());
    }

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
        vendorLocation: haul.vendorLocation,
        to: haul.to,
        product: haul.product,
        tons: haul.tons,
        rate: haul.rate,
        miles: haul.miles,
        payRate: haul.payRate,
        driverPay: haul.driverPay,
      }));
      setVendorSelected(haul.from);
      setVendorLocationSelected(haul.vendorLocation);
      setVendorSelected(haul.to);
      setVendorProductSelected(haul.product);
    }
  }, []);

  useEffect(() => {
    if (formDialog) {
      if (haul) {
        const vendorObj = vendors.find((v) => v.name.toLowerCase() === haul.from.toLowerCase());
        setVendorSelected(vendorObj);

        const vendorLocationObj = vendorLocations.find(
          (loc) => loc.name.toLowerCase() === haul.vendorLocation.toLowerCase()
        );
        setVendorLocationSelected(vendorLocationObj);

        const productObj = vendorProducts.find(
          (product) => product.name.toLowerCase() === haul.product.toLowerCase()
        );
        setVendorProductSelected(productObj);
      }
    }
  }, [formDialog]);

  useEffect(() => {
    if (selectedDriverId) {
      setFormData((prevState) => ({
        ...prevState,
        driver: selectedDriverId,
      }));
    }
  }, [selectedDriverId]);

  useEffect(() => {
    // if (haul) {
    //   setFormData((prevState) => ({
    //     ...prevState,
    //     _id: haul._id,
    //     driver: haul.driver,
    //     dateHaul: haul.dateHaul,
    //     truck: haul.truck,
    //     broker: haul.broker,
    //     chInvoice: haul.chInvoice,
    //     loadType: haul.loadType,
    //     invoice: haul.invoice,
    //     from: haul.from,
    //     vendorLocation: haul.vendorLocation,
    //     to: haul.to,
    //     product: haul.product,
    //     tons: haul.tons,
    //     rate: haul.rate,
    //     miles: haul.miles,
    //     payRate: haul.payRate,
    //     driverPay: haul.driverPay,
    //   }));
    // }

    if (drivers && driver) {
      // Get the current driver as an object
      const driverObj = drivers.find((d) => d._id === driver);

      // Set the FormData's defaultTruck field to driverObj's defaultTruck & associated driver pay
      if (driverObj) {
        setFormData((prevState) => ({
          ...prevState,
          truck: driverObj.defaultTruck,
        }));

        if (loadType === "enddump") {
          setFormData((prevState) => ({
            ...prevState,
            driverPay: driverObj.endDumpPayRate,
          }));
        }

        if (loadType === "flatbedperc") {
          setFormData((prevState) => ({
            ...prevState,
            driverPay: driverObj.flatBedPayRate,
          }));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [haul, driver, drivers, loadType, dispatch]);

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
          <div className="formgrid grid">
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
                  <label htmlFor="driver">Driver *</label>
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
                  <label htmlFor="loadType">Load Type *</label>
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
                    selectOtherMonths
                    style={{ width: "100%" }}
                  ></Calendar>
                  <label htmlFor="dateHaul">Haul Date *</label>
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
                  <label htmlFor="invoice">Load/Ref# *</label>
                </span>
              </div>
            </div>
          </div>

          {/* CHINVOICE, FROM, TO */}
          <div className="formgrid grid">
            {/* chInvoice */}
            {(loadType === "flatbedperc" || loadType === "flatbedmi") && (
              <div className="field col">
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
              </div>
            )}

            {/* From */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <HaulFromSelector
                  value={from}
                  vendors={vendors}
                  onVendorSelected={onVendorSelected}
                />
              </div>
            </div>

            {/* Vendor Location */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <HaulLocationSelector
                  value={vendorLocation}
                  vendorLocations={vendorLocations}
                  vendorSelected={vendorSelected}
                  onVendorLocationSelected={onVendorLocationSelected}
                />
              </div>
            </div>

            {/* To */}
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <HaulToSelector
                  value={to}
                  freightRoutes={freightRoutes}
                  vendorLocationSelected={vendorLocationSelected}
                  onFreightRouteSelected={onFreightRouteSelected}
                />
              </div>
            </div>
          </div>

          {/* MATERIAL */}
          <div className="formgrid grid">
            <div className="field col">
              <div style={{ margin: "0.8em 0" }}>
                <HaulVendorProductSelector
                  value={product}
                  vendorProducts={vendorProducts}
                  vendorLocationSelected={vendorLocationSelected}
                  onVendorProductSelected={onVendorProductSelected}
                />
              </div>
            </div>
          </div>

          {/* RATE or PAY RATE, TONS, MILES, DRIVER PAY  */}
          <div className="formgrid grid">
            {/* Rate */}
            {(loadType === "enddump" || loadType === "flatbedmi") && (
              <div className="field col">
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
              </div>
            )}

            {/* Pay Rate */}
            {loadType === "flatbedperc" && (
              <div className="field col">
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
              </div>
            )}

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
            {loadType === "flatbedmi" && (
              <div className="field col">
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
              </div>
            )}

            {/* Driver Pay */}
            {loadType !== "flatbedmi" && (
              <div className="field col">
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
              </div>
            )}
          </div>
        </form>
      </Dialog>
    </section>
  );
}

export default EditHaulForm;
