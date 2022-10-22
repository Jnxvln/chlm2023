import { Button } from "primereact/button";

const DialogFooter_SubmitClose = ({ onSubmit, onClose }) => {
  return (
    <footer className="dialog-footer">
      <Button
        type="button"
        label="Cancel"
        icon="pi pi-times"
        onClick={onClose}
        className="p-button-text"
      />
      <Button
        type="submit"
        label="Save"
        iconPos="left"
        icon="pi pi-save"
        onClick={onSubmit}
      />
    </footer>
  );
};

export default DialogFooter_SubmitClose;
