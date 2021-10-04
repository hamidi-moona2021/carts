import React, { Component, Fragment, useState } from 'react';
import './card.css'
import './toolTip.css'
import _ from "lodash"
import DragAndDrop from './../Modules/DragAndDrop'
import DeleteIcon from '@material-ui/icons/Delete'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// import AdbIcon from '@material-ui/icons/Adb';
import TouchAppOutlined from '@material-ui/icons/TouchAppOutlined';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { capacity } from "../../../utils/trafficUtil/trafficUtil";
import { confirmAlert } from 'react-confirm-alert';


class Card extends Component {
    state = { ports: [], flagPort: false, currentPort: null, flag: false, info: [] };
    //Confirm Delete
    confirmDelete = (ev, num, id, selectedCurrentService, port, card, groomout_id) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                        <h1 className="title">Are you sure?</h1>
                        <p className="disc">You want to delete this Service?</p>
                        <div className="btns">
                            <button className="_btn btnClose" onClick={onClose}>No</button>
                            <button className="_btn btnyes"
                                onClick={() => {
                                    this.deleteService_of_port(ev,
                                        num,
                                        id,
                                        selectedCurrentService,
                                        port,
                                        card,
                                        groomout_id);
                                    onClose();
                                }}
                            >
                                Yes, Delete it!
                            </button>
                        </div>
                    </div>
                );
            },
            closeOnEscape: true,
            closeOnClickOutside: true
        });
    }

    connectionCarts = () => {
        // console.log('**********************************')
        let current_traffic = {};
        if (this.props.traffic) {
            if (this.props.traffic.main) {
                if (this.props.traffic.main.lightpaths) {
                    current_traffic = this.props.traffic.main.lightpaths[this.props.elem.lightpathId];
                    console.log("current_traffic", this.props.traffic.main.lightpaths[this.props.elem.lightpathId]);
                }
            }
        }

        // console.log('8888', this.props.card,  this.props.elem, this.props.elem.lightpathId, current_traffic);
        let info = [];
        if (current_traffic) {

            if (current_traffic.service_id_list) {
                current_traffic.service_id_list.map((row, index) => {
                    if (row.type === 'groomout') {
                        // console.log(row.mp2x_panel_address, this.props.num);
                        info.push(row.mp2x_panel_address);
                    }
                });
            }
            this.state.info = info;
        }
        // console.log('*****', info)
        return info;
    };

    makeTable = () => {
        //محاسبه ی کارت های متصل به lightpath
        let info = this.connectionCarts();
        //*****************************************
        if (this.props.card) {
            const { textLabel, bgColor, size, url } = this.props.card;
            const textLength = "translateY(" + (textLabel ? textLabel.length : '') * 3.6 + "px)  rotate(-90deg)";
            let k = [];
            let tr = [];
            const fractionCoEf = Math.ceil(1 / size);
            const border = "border-2px" + (this.props.selected ? "-red" : "");
            for (let i = 0; i < size; i++) {
                k.push(<th key={i} style={{ transform: "0px 10px 0p 0px" }}
                    className={border + " width-25 text-center"}>{this.props.num + Math.ceil(size) - i - 1}</th>);
            }


            for (let i = 0; i < Math.ceil(1 / size); i++) {

                const width = 55 * Math.ceil(size);
                const height = 300 / fractionCoEf - 5;
                tr.push(<tr key={this.props.num + i} id={this.props.num}>
                    <td colSpan={size}
                        className={"text-nowrap width-25 " + border + "-top height-" + 250 / fractionCoEf}>
                        <div key={`cart${this.props.num}`} style={{ position: "relative" }}>
                            {/* {console.log("FIND",this.props.num)} */}
                            <img src={url} width={width} height={height} alt={textLabel} />
                            {this.makeButtons(width, height)}
                            {/* {this.makeConfirmMenu(width, height)} */}
                            {this.makeButtons2(width, height)}
                            {this.makeButtons3(width, height, this.props.num)}
                            {this.makeButtons4(width, height, this.props.num, info)}
                        </div>
                    </td>
                </tr>);
            }

            return <table className={"margin--1 " + border}>
                <tbody>
                    <tr>
                        {k}
                    </tr>
                    {/*<tr>*/}
                    {tr}
                    {/*<td colSpan={Math.ceil(size)} className={"width-25 border-2px text-nowrap height-" + 50/Math.ceil(1/size)} style={*/}
                    {/*    {*/}
                    {/*        backgroundColor: bgColor,*/}
                    {/*    }*/}
                    {/*}>{<section style={{transform: textLength}}>{textLabel}</section>}</td>*/}
                    {/*</tr>*/}
                </tbody>
            </table>
        } else {
            return null;
        }
    };

    dropPort(ev, arr, serviceId, card, num, currentPort, groomout_id) {

        ev.preventDefault();
        console.log('****drop****', arr, serviceId, card, num, currentPort);
        this.props.dragService_to_port(num, currentPort, serviceId, card, groomout_id);
    }

    deleteService_of_port = (ev, num, currentPort, serviceId, port, card, groomout_id) => {
        console.log('deleteService_of_port', ev.target, num, currentPort, serviceId, port.serviceId, card, groomout_id);


        this.props.deleteService_from_port(num, currentPort, serviceId, port.serviceId, card, port, groomout_id);
    };
    //ساختن ports
    makeButtons = (width, height) => {
        // console.log('*******', this.props.card)
        if (typeof this.props.card.ports !== "undefined") {
            // console.log('card is : ', this.props.card);
            const ports = this.calcDims(this.props.card.ports, width, height);
            this.state.ports = ports;
            return this.state.ports.map(port => {

                const butBorder = port.connected === this.props.enums.notConnected ? "button--black--border" :
                    port.connected === this.props.enums.pending ? "button--red--border" : "button--green--border";
                return (<>
                    <button key={port.id} className={"mp2xP--button " + butBorder}
                        style={{
                            width: port.width, height: port.height,
                            transform: "translate(" + (port.pos.width - width) + "px, " + port.pos.height + "px)"
                        }}
                        onClick={(ev) => {
                            this.onClicked(ev, port.id);
                            console.log("ev, port.id", ev, port.id);
                            this.CallContextMenu(port.id);
                        }}
                        onDrop={(ev) => this.dropPort(ev, port, this.props.selectedCurrentService, this.props.card, this.props.num, port.id, this.props.groomout_id)}>
                    </button>
                </>);
            });
        }
    };

    // make confirm for menu
    makeConfirmMenu = (width, height) => {
        if (typeof this.props.card.ports !== "undefined") {
            // console.log('card is : ', this.props.card);
            const ports = this.calcDims(this.props.card.ports, width, height);
            this.state.ports = ports;
            return this.state.ports.map(port => {

                const butBorder = port.connected === this.props.enums.notConnected ? "button--black--border" :
                    port.connected === this.props.enums.pending ? "button--red--border" : "button--green--border";
                return (<>
                    <ContextMenuTrigger id={`${port.id}`} className={"mp2xP--button " + butBorder}
                            style={{
                                backgroundColor: "red",
                                width: port.width, height: port.height,
                                transform: "translate(" + (port.pos.width - width) + "px, " + port.pos.height + "px)"
                            }}
                            onClick={(ev) => {
                                this.onClicked(ev, port.id);
                                console.log("ev, port.id", ev, port.id);
                                this.CallContextMenu(port.id);
                            }}>
                            <span>gg</span>
                    </ContextMenuTrigger>

                    <ContextMenu  id={`${port.id}`}>
                        <MenuItem data={{ copy: 'MI50' }}>
                            <span>Copy</span>
                        </MenuItem>
                    </ContextMenu>

                </>);
            });
        }
    };

    //ساختن سطل زباله و حذف سرویس
    makeButtons2 = (width, height) => {

        if (typeof this.props.card.ports !== "undefined") {
            const ports = this.calcDims(this.props.card.ports, width, height);
            this.state.ports = ports;
            return this.state.ports.map(port => {
                let height = port.pos.height - 10;
                if (this.state[`flagPort${port.id}`]) {
                    if (port.connected == this.props.enums.connected) {

                    }
                }
                return <DeleteIcon id={port.id} color="secondary"
                    key={port.id}
                    onClick={(ev) => this.confirmDelete(ev, this.props.num, port.id, this.props.selectedCurrentService, port, this.props.card, this.props.groomout_id)}
                    type="button"
                    className={"mp2xP--button"}
                    style={{
                        display: `${port.connected === this.props.enums.connected ? '' : 'none'}`,
                        width: port.width, height: (port.height),
                        transform: "translate(" + (port.pos.width - width - 10) + "px, " + height + "px)"
                    }}>

                </DeleteIcon>

            });

        }
    };

    //tooltip port
    makeButtons3 = (width, height, num) => {
        console.log('*****//tooltip port*****', this.props.card, this.props.elem, this.props.traffic);

        console.log("width:", width);
        console.log("height:", height);
        console.log("num:", num);
        console.log("PROPS::", this.props);

        if (typeof this.props.card.ports !== "undefined") {
            const ports = this.calcDims(this.props.card.ports, width, height);
            this.state.ports = ports;
            return this.state.ports.map(port => {
                let serviceType = 'lightpath';
                if (this.props.elem.ports) {
                    if (this.props.elem.ports[port.id - 1]) {
                        if (this.props.elem.ports[port.id - 1].serviceId) {

                            console.log('port 88788 is : ', port, this.props.elem.ports[port.id].serviceId);
                            if (this.props.elem.ports[port.id - 1].serviceId.type) {
                                serviceType = this.props.elem.ports[port.id - 1].serviceId.type
                                console.log('serviceType:serviceId.type', port.id - 1, serviceType)
                            }
                            if (this.props.elem.ports[port.id - 1].serviceId.serviceType) {
                                serviceType = this.props.elem.ports[port.id - 1].serviceId.serviceType
                                console.log('serviceType', port.id - 1, serviceType)
                            }

                        }

                    } else {

                    }
                }
                //
                let cap = capacity(serviceType);
                // //hamidi 
                // if(serviceType == 'groomout')
                // {

                // }

                if (this.props.elem.capacity) {
                    cap = this.props.elem.capacity;
                    // console.log("CAP:",this.props.elem,cap);
                }
                // end

                if (port.id === 11 && (this.props.card.textLabel === 'MP1H')) {
                    if (this.props.elem.capacity) {
                        cap = this.props.elem.capacity;
                    }
                }
                if (port.id === 11 && (this.props.card.textLabel === 'TP1H')) {
                    if (this.props.elem.capacity) {
                        cap = this.props.elem.capacity;
                    }
                }
                let height = port.pos.height + 5;
                if (this.state[`flagPort${port.id}`]) {
                    if (port.connected == this.props.enums.connected) {

                    }
                }
                return <>

                    <ExitToAppIcon
                        key={'tooltip' + port.id}
                        id={'tooltip' + port.id}
                        type="button"
                        onMouseOver={(e) => {
                            this.onMouseOverPortToolTip(e, port.id, num)
                        }}
                        onMouseOut={(e) => {
                            this.onMouseOutPort(e, port.id, num)
                        }}
                        onClick={(ev) => this.deleteService_of_port(ev, this.props.num,
                            port.id,
                            this.props.selectedCurrentService,
                            port,
                            this.props.card,
                            this.props.groomout_id)}
                        className={"mp2xP--button "}
                        style={{
                            display: `${port.connected === this.props.enums.connected || (port.id === 11 && (this.props.card.textLabel === 'MP1H' || this.props.card.textLabel === 'TP1H')) ? '' : 'none'}`,
                            width: port.width, height: port.height,
                            transform: "translate(" + (port.pos.width - width + 8) + "px, " + height + "px)"
                        }}>

                    </ExitToAppIcon>

                    {port.id % 2 === 0 ? <span className={`mp2xP--button tooltipHidden`}
                        key={num + 'tooltipD' + port.id}
                        id={num + 'tooltipD' + port.id}
                        style={{
                            backgroundColor: "black",
                            color: "#fff",
                            marginLeft: '20px', borderRadius: "4px", padding: "5px",
                            transform: "translate(" + (port.pos.width - width) + "px, " + port.pos.height + "px)"
                        }}
                    >{`source -> destination :  ${this.props.elem.source}  -> ${this.props.elem.destination} , type : ${serviceType}, cap : ${cap}`}  </span>
                        :
                        <span className={`mp2xP--button tooltipHidden`}
                            key={num + 'tooltipD' + port.id}
                            id={num + 'tooltipD' + port.id}
                            style={{
                                backgroundColor: "black",
                                color: "#fff", marginTop: '-25px', borderRadius: "4px", padding: "5px",
                                transform: "translate(" + (port.pos.width - width) + "px, " + port.pos.height + "px)"
                            }}
                        >{`source -> destination :   ${this.props.elem.source}  -> ${this.props.elem.destination} , type : ${serviceType} , cap : ${cap}`} </span>}
                </>

            });
        }
    };

    //tooltip cart
    makeButtons4 = (width, height, num, info) => {
        // console.log('**********', this.props.card, this.props.elem);
        if (typeof this.props.card.ports !== "undefined") {
            let height2 = 0;

            return <>
                <TouchAppOutlined color="primary"
                    key={'tooltipCart' + num}
                    id={'tooltipCart' + num}
                    type="button"
                    onMouseOver={(e) => {
                        this.onMouseOverCartToolTip(e, num)
                    }}
                    onMouseOut={(e) => {
                        this.onMouseOutCart(e, num)
                    }}

                    className={"mp2xP--button "}
                    style={{
                        width: 30, height: 25,
                        transform: "translate(" + -25 + "px, " + height2 + "px)"
                    }}>

                </TouchAppOutlined>
                <div className={`mp2xP--button tooltipHidden`}
                    key={num + 'tooltipCartD'}
                    id={num + 'tooltipCartD'}
                    style={{

                        display: "unset",
                        // whiteSpace: "break-spaces",
                        backgroundColor: "black",
                        color: "#fff", marginTop: '-25px', borderRadius: "4px", padding: "5px",
                        index: '100',
                        transform: "translate(" + -120 + "px, " + 40 + "px)"
                    }}
                >{`  ${this.props.elem.source}  -> ${this.props.elem.destination}`}
                    {console.log(this.props.num, this.props.card.id)}
                    {this.props.card.id % 2 === 0 ?
                        info.map((carts, index) => {
                            // console.log(carts,carts.source.slot_id_list);

                            return <>
                                <div>
                                    <label>
                                        sourceInfo =>
                                    </label>
                                    <div> rack : {carts.source.rack_id} ,
                                        shelf: {carts.source.shelf_id} ,slots: {JSON.stringify(carts.source.slot_id_list)}</div>
                                    <label>
                                        destInfo =>
                                    </label>
                                    <div>rack : {carts.destination.rack_id} ,
                                        shelf: {carts.destination.shelf_id} ,slots: {JSON.stringify(carts.destination.slot_id_list)}</div>
                                </div>

                            </>
                        })
                        : null}


                </div>
            </>
        }
    };

    //Here set right Click
    onClicked = (ev, id) => {
        console.log('****', ev.target)
        ev.preventDefault();
        if (typeof this.props.setPrevClick === "function") {
            this.props.setPrevClick(true);
            this.props.onPortClick(id);
        }
    };

    calcDims(ports, width, height) {
        const newPorts = _.cloneDeep(ports);
        newPorts.forEach(port => {
            port.width *= width;
            port.height *= height;
            port.pos.width *= width;
            port.pos.height *= height;
        });
        return newPorts;
    };

    onMouseOverPortToolTip = (e, portID, num) => {
        // console.log('onMouseOverPortToolTip', document.getElementById('tooltipD' + portID))
        document.getElementById(num + 'tooltipD' + portID).classList.remove("tooltipHidden");
        document.getElementById(num + 'tooltipD' + portID).classList.add("tooltipVisible")

    };

    onMouseOutPort = (e, portID, num) => {
        // console.log('onMouseOutPort', document.getElementById('tooltipD' + portID));
        document.getElementById(num + 'tooltipD' + portID).classList.remove("tooltipVisible");
        document.getElementById(num + 'tooltipD' + portID).classList.add("tooltipHidden");
    };

    onMouseOverCartToolTip = (e, num) => {
        // console.log('onMouseOverPortToolTip', document.getElementById('tooltipD' + portID))
        document.getElementById(num + 'tooltipCartD').classList.remove("tooltipHidden");
        document.getElementById(num + 'tooltipCartD').classList.add("tooltipVisible")

    };

    onMouseOutCart = (e, num) => {
        // console.log('onMouseOutPort', document.getElementById('tooltipD' + portID));
        document.getElementById(num + 'tooltipCartD').classList.remove("tooltipVisible");
        document.getElementById(num + 'tooltipCartD').classList.add("tooltipHidden");
    };



    render(props) {

        return (
            this.makeTable()
        );
    }

}


export default Card;