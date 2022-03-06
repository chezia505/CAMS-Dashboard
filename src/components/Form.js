import React from "react"
import {FrameViewer} from "@terminusdb/terminusdb-documents-ui"

export const Form = ({frames, type, mode, onSubmit, uiFrame, onSelect, formData, FieldTemplate, hideSubmit, onChange}) => {
    return <FrameViewer frame={frames}
        uiFrame={uiFrame}
        type={type}
        mode={mode}
        onSubmit={onSubmit}
        onSelect={onSelect}
        formData={formData}
        FieldTemplate={FieldTemplate}
        hideSubmit={hideSubmit}
        onChange={onChange}
    />
}