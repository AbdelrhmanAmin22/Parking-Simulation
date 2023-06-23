import React from "react";
import Parking from "./Parking";
import QRScanner from "./QRScanner";
import "./css/SimPage.css"

function SimPage(){
    return(
    <div className="container">
        <p className="park-header">Parking Simulation system for Omar Makram  </p>
      <div className="row">
        <div className="col-9 g-0 ">
          <Parking/>
        </div>
        <div className="col-3 g-0">
          <div className="sim-scan-container">
            <div className="auth-container ">
              <QRScanner/>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
}

export default SimPage ;