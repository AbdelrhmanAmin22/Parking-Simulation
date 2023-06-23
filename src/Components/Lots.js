import React from 'react';
import './css/lots.css'

function Lots(props) {
    const carLotClassName = props.status === 'booked' ? 'car-lot car-lot-notEmpty' : 'car-lot';
    const myCircleClassName = props.status === 'booked' ? 'my-circle open' : 'my-circle close';
    return (
        <div className='lots-container'>
            <div className="lot-number">Row {props.row} Col {props.col}  </div> 
            <div className={carLotClassName}></div>
            <div className={myCircleClassName}></div>
        </div>
    );
}

export default Lots;
