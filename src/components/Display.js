
import React, {useEffect} from "react"
import {Table} from "./Table"
import {VIEW_MODE, CREATE_MODE, EDIT_MODE} from "../pages/constants"
import {Row, Card} from "react-bootstrap"
import {Form} from "./Form"
import {UI_FRAMES} from "./constants"

export const DisplayDocuments = ({results, css, config, title}) => {
    return <div className="text-break m-2 border-0">
        <Table documents = {results}
            config={config}
            title={title}
            css={css}/>
    </div>
}

export const ViewDocument = ({frames, type, getDocumentToolBar, onTraverse, FieldTemplate, uiFrame, handleSelect, showDocument}) => {

    return <Card className="text-break p-4">
        <Card.Header className="text-dark border-primary" tilte={`Asset ID - ${showDocument["@id"]}`}>
            {showDocument["@id"]}
        </Card.Header>
        <Row>
            {getDocumentToolBar && getDocumentToolBar(showDocument)}
        </Row>
        <Row className="text-break">
            {frames && <Form frames={frames}
                uiFrame={UI_FRAMES}
                FieldTemplate={FieldTemplate}
                type={type}
                mode={VIEW_MODE}
                hideSubmit={true}
                onSelect={handleSelect}
                onTraverse={onTraverse}
                formData={showDocument}
            />}
        </Row>
    </Card>
}


export const CreateDocument = ({frames, type, handleSelect, handleSubmit}) => {

    return <Card className="text-break p-4">
        <Form frames={frames}
            uiFrame={UI_FRAMES}
            type={type}
            mode={CREATE_MODE}
            onSubmit={handleSubmit}
            onSelect={handleSelect}
            formData={{}}
        />
    </Card>
}

export const EditDocument = ({frames, type, editDocument, getDocumentToolBar, handleUpdate, handleSelect}) => {

    return <Card className="text-break p-4">
        <Row>
            {getDocumentToolBar(editDocument)}
        </Row>
        <Row className="text-break">
            <Form frames={frames}
                type={type}
                uiFrame={UI_FRAMES}
                mode={EDIT_MODE}
                onSubmit={handleUpdate}
                onSelect={handleSelect}
                formData={editDocument}
            />
        </Row>
    </Card>
}

