import React, {useState, useEffect} from "react"
import {Card, Col, Row, Button} from "react-bootstrap"
import Dropdown from 'react-bootstrap/Dropdown'
import {
    VAR_MAX,
    SHOW_ALL_FAILURE_CHAIN_TITLE,
    SHOW_ALL_ASSETS_TITLE,
    SHOW_ALL_ASSETS,
    SEARCH_ASSET,
    SEARCH_ASSET_PLACEHOLDER,
    FAILURE_CHAIN_TITLE,
    HAZARD_TYPE,
    HAZARD_DROPDOWN_TITLE,
    UPWARD_CHAIN_TITLE,
    SHOW_ALL_UPWARD_CHAIN_TITLE
} from "./constants"
import Select from 'react-select'
import {getAssetSelectOptions} from "./utils"
import {DocumentDetail} from "./DocumentDetail"
import {WOQLClientObj} from '../init-woql-client'
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes'
import {SearchBar} from "./SearchBar"
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import {GradedButtons} from "./GradedButtons"
import {getEventScaleQuery} from "../hooks/queries"
import {QueryHook} from "../hooks/QueryHook"
import {ASSET_TYPE} from "../pages/constants"

export const MapToolBar = ({setResetMap, resetMap, onMarkerClick, setDisplayFailureChains, setDisplayUpwardChains, setUpwardChain, setFilterAssetByEvent, setFailureChain, setFilterAssetById}) => {

    // constants to gather events and grades
    const [eventList, setEventList] = useState(false)
    const [gradedEvents, setGradedEvents]= useState(false)
    const [currentGrade, setCurrentGrade]= useState(false)
    const [currentEvent, setCurrentEvent]= useState(false)
    const [value, setValue]=useState(null) // select value

    // scale constants
    const [maxScale, setMaxScale]= useState(false)

    const {
        prefix,
        frames,
        woqlClient,
        setLoading,
        setSuccessMsg,
        setErrorMsg
	} = WOQLClientObj()

    const [scaleQuery, setScaleQuery]=useState(false)
    let scaleResults = QueryHook(woqlClient, scaleQuery, setLoading, setSuccessMsg, setErrorMsg)

    // onchange of select events
    function handleEvents(e) {
        // show grades when event selected
        setGradedEvents(true)
        setCurrentEvent(e.value)
        setValue({label: e.value, value: e.value})
        if(setFilterAssetByEvent) {
            setFilterAssetByEvent({eventName: e.value})
        }
    }

    useEffect(() => {
        // once event is populated
        if(value && Object.keys(value).length && value.hasOwnProperty("value")) {
            let q = getEventScaleQuery(value.value)
            setScaleQuery(q)
        }
    }, [value])

    // ones we get min and max of hazrad from hazard scale
    useEffect(() => {
        if(scaleResults && Array.isArray(scaleResults) && scaleResults.length) {
            let eventScale = scaleResults[0] // we do only single select of event
            if(eventScale.hasOwnProperty(VAR_MAX)) {
                setMaxScale(eventScale[VAR_MAX]["@value"])
            }
        }
    }, [scaleResults])

    //clear filters
    function handleShowAll() {
        // clear filters and show all available assets
        if(setResetMap) setResetMap(Date.now())
        if(setDisplayFailureChains) {
            // clear failure chains
            setDisplayFailureChains([])
            setFailureChain(false)
        }
        // clear upward chain
        if(setDisplayUpwardChains) {
            setDisplayUpwardChains([])
            setUpwardChain(false)
        }
        // clear filter by ID, Events
        if(setFilterAssetById) setFilterAssetById(false)
        if(setFilterAssetByEvent) setFilterAssetByEvent(false)
        // clear grades
        setGradedEvents(false)
        // clear grade scales
        setMaxScale(false)
        setCurrentGrade(false)
        // clear react select value
        setValue(null)
    }

    // on grade selection
    useEffect(() => {
        if(currentGrade && currentEvent && setFilterAssetByEvent) {
            setFilterAssetByEvent({eventName: currentEvent, grade: currentGrade})
        }
    }, [currentGrade])

    // populate hazrad events
    useEffect(() => {
        // get all hazard event names
        if(Object.keys(frames).length) {
            //let type = `${prefix}${HAZARD_TYPE}`
            let type = `${HAZARD_TYPE}`
            let list = frames[type]["@values"], options=[]
            list.map(lst => {
                options.push({label: lst, value: lst})
            })
            setEventList(options)
        }
    }, [frames])

    // function to display failure chains
    function handleClicked (e) {
        //setFailureChain(e.target.checked)
        if(setFailureChain) setFailureChain(true)
        // clear filter by events or ID
        //if(setFilterAssetByEvent) setFilterAssetByEvent(false)
        //if(setFilterAssetById) setFilterAssetById(false)
    }

    // function to display upward links
    function handleUpwardChainClick(e) {
        if(setUpwardChain) setUpwardChain(true)
    }

    //console.log("value", value)



    return <Card>
        <Card.Body className="d-flex">
            <Row className="flex-row flex-wrap" style={{position: 'relative', zIndex: 999}}>

                <Col>
                    <SearchBar
                        resetMap={resetMap}
                        woqlClient={woqlClient}
                        type={ASSET_TYPE}
                        placeholder={SEARCH_ASSET_PLACEHOLDER}
                        setFilterAssetById={setFilterAssetById}/>
                </Col>


                {
                    eventList &&
                        <Col>
                            <div className="hazard-select-button">
                                <Select options={eventList}
                                    placeholder={HAZARD_DROPDOWN_TITLE}
                                    value={value}
                                    onChange={handleEvents}/>
                                {/*<ReactMultiSelectCheckboxes
                                    options={eventList}
                                    placeholderButtonLabel={HAZARD_DROPDOWN_TITLE}
                                    onChange={handleEvents}
                                /> */}
                            </div>
                        </Col>
                    }

                {
                    maxScale && <Col>
                        <ButtonToolbar aria-label="Toolbar with button groups" >
                            <ButtonGroup className="me-2" aria-label="First group">
                                <GradedButtons setCurrentGrade={setCurrentGrade} max={maxScale}/>
                            </ButtonGroup>
                        </ButtonToolbar>
                    </Col>
                }

                {
                onMarkerClick && onMarkerClick.hasOwnProperty("id") &&
                    <Col>
                        <Button variant="outline-secondary"
                            className="btn-sm"
                            onClick={handleClicked}
                            title={SHOW_ALL_FAILURE_CHAIN_TITLE}>
                            {FAILURE_CHAIN_TITLE}
                        </Button>
                    </Col>
                }

                {
                onMarkerClick && onMarkerClick.hasOwnProperty("id") &&
                    <Col>
                        <Button variant="outline-secondary"
                            className="btn-sm"
                            onClick={handleUpwardChainClick}
                            title={SHOW_ALL_UPWARD_CHAIN_TITLE}>
                            {UPWARD_CHAIN_TITLE}
                        </Button>
                    </Col>
                }

                <Col>
                    <Button variant="outline-secondary"
                        className="btn-sm"
                        onClick={handleShowAll}
                        title={SHOW_ALL_ASSETS_TITLE}>
                        {SHOW_ALL_ASSETS}
                    </Button>
                </Col>



        </Row>
        </Card.Body>
    </Card>
}

/**
 * let hazard = "@schema:Hazard/Pest%20Infestations"
triple("v:Assets", "@schema:applicable_hazards", hazard)
str.replace(/%20/g, " ");
 */