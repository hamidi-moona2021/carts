import React from 'react';
import socket from './img/socket.jpg'
import complete from './img/circle/complete.jpg'
import {FaTrashAlt} from "react-icons/fa"
import './PS6X.css'
import config from "../../config";

class PS6X extends React.Component {
    render() {
        let loop = [];
        for (let z = 0; z < 7; z++) {
            loop.push(z);
        }
        let key = this.props.index;
        console.log('PS6X ');
        return <div key={`bodyPS6X${key}`}>
            <div key={`rightPS6X${key}`}
                 style={{height: '450px', width: '5%', backgroundColor: '#F2F8FD', float: 'left'}}>

                {loop.map((row, i) => {
                    return <div key={`socketsDiv${i}`}>
                        <img key={`socket${i}`} src={socket} height={'30px'} alt={'socket'}
                             style={{paddingLeft: '5px', paddingTop: '15px'}}/>
                        <img key={`socket${i + 1}`} src={socket} height={'30px'} alt={'socket'}
                             style={{paddingLeft: '5px', paddingTop: '15px'}}/>
                    </div>
                })}


            </div>
            <div className={'leftPS6X'} key={`leftPS6X${key}`}
                 style={{height: '450px', width: '5%', backgroundColor: '#F2F8FD', float: 'left'}}>
                <FaTrashAlt key={key} onClick={() => {
                    this.props.deletemp2x(this.props.selectedShelves, key, config.carts.PS6X.id)
                }} style={{color: 'maroon'}} className={'menuOfCarts'}/>
                <img src={complete} height={'450px'} alt={'socket'}/>
                PS6X
            </div>
        </div>
    }
}

export default PS6X;
