import React, { useEffect, useState} from "react";
import { useZxing } from "react-zxing";
import "./css/QRScanner.css";
import Webcam from 'react-webcam';
import AlertAlarm from "../assets/alert-alarm.mp3"



function QRScanner() {
  const [result, setResult] = useState("null");
  const { ref } = useZxing({
    onResult(result) {
      setResult(result.getText());
    },
  });

  // variables of QR code 
  const [reservationData, setReservationData] = useState(null);
  const [endReservationData, setEndReservationData] = useState(null);
  const [isOpenDoor, setIsOpenDoor] = useState(false);
  const [row, setRow] = useState(null);
  const [column, setColumn] = useState(null);

  // variables of Face recognation
  const [imageStart, setImageStart] = useState(null);
  const [imageEnd, setImageEnd] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(false);
  const [alarmTriggered, setAlarmTriggered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

// functions of QR code  
// open Door 
  function openDoor() {
    if (result) {
      setIsOpenDoor(true);
      const timer = setTimeout(() => {
      setIsOpenDoor(false);
      }, 5000); 
    return () => {
      clearTimeout(timer);
    }
  }
}

async function startReservation(uid) {
  if (!result) {
    console.log("Result is null");
    return;
  }
  try {
    const response = await fetch(
      `https://rakna.site/api/parking/start-reservation?uid=${result}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
    setReservationData(data);
    setResult(null);
    if (data.status === true) {
      const { row, column } = data["Reservation Data"]["parking_slot"];
      setRow(row);
      setColumn(column);
      console.log("row = " + row + "col = " +column)
        openDoor(); 
    } else {
      alert("InValid Reservation");
    }
  } catch (error) {
    console.error(error);
  }
}

async function endReservation(uid) {
  if (!result && !reservationData) {
    console.log("Result is null");
    return;
  }

  if (verificationStatus) {
    try {
      const response = await fetch(
        `https://rakna.site/api/parking/end-reservation?uid=${result}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setEndReservationData(data);
      console.log(endReservationData);
      if (data.status === true) {
        openDoor();
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    alert("Please verify your face before ending the reservation.");
  }
}


// useEffect to handle changes in endReservationData
useEffect(() => {
  console.log("Updated endReservationData:", endReservationData);
}, [endReservationData]);

//functions for Face recognation
  // Function to play the alarm sound
  const alarmAudio = new Audio(AlertAlarm);
  const playAlarmSound = () => {
      alarmAudio.loop = true; // Set the audio to loop
      alarmAudio.play();
      setIsPlaying(true);
  };
  // Function to stop the alarm sound
  const stopAlarmSound = () => {
      window.location.reload();
  };

  const handleCaptureEnter = () => {
      const dataUrl = webcamRef.current.getScreenshot();
      setImageStart(dataUrl);
      console.log(dataUrl);
  };

  const handleCaptureExit = () => {
      const dataUrl = webcamRef.current.getScreenshot();
      setImageEnd(dataUrl);
      console.log(dataUrl);
  };

  const FaceVerification = async () => {
      const url = 'https://face-verification2.p.rapidapi.com/faceverification';

      const options = {
          method: 'POST',
          headers: {
              'content-type': 'application/x-www-form-urlencoded',
              'X-RapidAPI-Key': '74be325bcamsh06373d5544d168bp12cf8ajsn7c7a066040be',
              'X-RapidAPI-Host': 'face-verification2.p.rapidapi.com'
          },
          body: new URLSearchParams({
              image1Base64: imageStart,
              image2Base64: imageEnd
          })
      };
      
      try {
          const response = await fetch(url, options);
          const result = await response.json();
          console.log(result.data);
      
          let resultMessage = '';
          if (result.data && result.data.resultMessage) {
              resultMessage = result.data.resultMessage;
          } else {
              resultMessage = 'Result message not available';
          }
          console.log( "Result = " + resultMessage);
          console.log( result);
          if (resultMessage ==="The two faces belong to the same person. ") {
              setVerificationStatus(true);
          }
          else {
              setVerificationStatus(false);
              setAlarmTriggered(true); // Trigger the alarm
              playAlarmSound();
          }
      }  catch (error) {
          console.error(error);
      }
  };

  const videoConstraints = {
      facingMode: 'user',
      width: 1280,
      height: 720,
  };

  const webcamRef = React.useRef(null);

  return (
    <div className="all-container">
        <div className="scanner-container">
          <div className="door-container">
              <h6>Parking barrier </h6>
              <div className={`my-circle-door ${isOpenDoor ? "open-door" : "close-door"}`} ></div>
            </div>

          <h6>Scan QR Code Here </h6>
          <video className="camera" ref={ref} />
          <p>
            <span className="result">UID : </span>
            <span className="result-text">{result}</span>
            <button className="reset-btn" onClick={() => setResult(null)}>
              Reset
            </button>
          </p>
          <div className="btn-options">
            <button className="reset-btn" onClick={startReservation}>
              Start
            </button>
            <button className="reset-btn" onClick={endReservation}>
              End
            </button>
          </div>
          {row? (
          <div className="digital-screen">
            <p>Go to Row {row} : Col {column}</p>
          </div>) : (
            <p> Wating for scanning </p>
          )
          }
      </div>

      <div className="camera-container">
        <div>
          <p>Authentication Via Face</p>
          <Webcam
          audio={false}
          videoConstraints={videoConstraints}
          ref={webcamRef}
          screenshotFormat="image/png"
          className="webcam" />
        </div>
        <div className="btns-container">
            <button className="btn enter" onClick={handleCaptureEnter}>
            Capture To Enter
            </button>
            <button className="btn exit" onClick={handleCaptureExit}>
            Capture To Exit
            </button>
            <button className="btn" onClick={FaceVerification}>
            Face Verification
            </button>
        </div>

        <div className="images-container">
          <div className="enter">
          <p>Enter Image</p>
          {imageStart && <img src={imageStart} alt="User's captured" />}
          </div>
          <div className="exit">
          <p>Exit Image</p>
          {imageEnd && <img src={imageEnd} alt="User's captured" />}
        </div>
        <div className="verification-status">
            Verification Status: {verificationStatus ? 'True' : 'False'}
        </div>
        {verificationStatus === false && alarmTriggered && (
            <>
            <div className="alarm">Alarm triggered! Unauthorized access detected.</div>
            <button onClick={stopAlarmSound}>Stop Alarm</button>
            </>
        )}
        </div>
      </div>
    </div>  
  );
}

export default QRScanner;
