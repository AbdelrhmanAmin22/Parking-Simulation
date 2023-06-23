import React, { useEffect, useState } from "react";
import "./css/Parking.css";
import Lots from "./Lots";
import axios from "axios";



function refreshPage() {
  window.location.reload();
}

function Parking() {
  const [parkingSlots, setParkingSlots] = useState(null);
  
  useEffect(() => {
    const fetchParkingSlots = async () => {
      try {
        const response = await axios.get(
          "https://rakna.site/api/parking/parking-slots-info"
        );
        setParkingSlots(response.data.parking_slots); // Set parking slots array
      } catch (error) {
        console.error("Error fetching parking slot information:", error);
      }
    };
  
    fetchParkingSlots();
  }, []);
  

  return (
    <>
    <button className="button" onClick={refreshPage}>Update</button>
      {parkingSlots ? (
        <div className="car-lot-grid">
          {Object.keys(parkingSlots).map((key) => (
            <Lots
              key={key}
              row={parkingSlots[key].row}
              col={parkingSlots[key].column}
              status={parkingSlots[key].status}
            />
          ))}
        </div>
      ) : (
        <p>Loading parking slot information...</p>
      )}
    </>
  );
}

export default Parking;
