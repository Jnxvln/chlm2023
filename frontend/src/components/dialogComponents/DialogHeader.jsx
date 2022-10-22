import React from "react";

const DialogHeader = ({ resourceName, resourceType, isEdit, title }) => {
  return (
    <header className={`dialog-header`}>
      {title ? (
        <h3 className="dialog-title">{title}</h3>
      ) : (
        <>
          {resourceType ? (
            <>
              {isEdit ? (
                <>
                  {resourceName ? (
                    <h3 className="dialog-title">
                      Edit {resourceType}: {resourceName}
                    </h3>
                  ) : (
                    <h3 className="dialog-title">
                      [DialogHeader.jsx, isEdit] Missing `resourceName`
                    </h3>
                  )}
                </>
              ) : (
                <h3 className="dialog-title">Create New {resourceType}</h3>
              )}
            </>
          ) : (
            <>
              <h3 className="dialog-title">
                [DialogHeader]: Missing `title` or `resourceType`
              </h3>
            </>
          )}
        </>
      )}
    </header>
  );
};

export default DialogHeader;
