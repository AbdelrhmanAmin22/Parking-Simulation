import React, { useState } from 'react';
import Webcam from 'react-webcam';
import AlertAlarm from "../assets/mixkit-alert-alarm-1005.wav"
import "./css/Face.css"

function Face() {
    const [imageStart, setImageStart] = useState(null);
    const [imageEnd, setImageEnd] = useState(null);
    const [verificationStatus, setVerificationStatus] = useState(false);
    const [alarmTriggered, setAlarmTriggered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

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
        <div className="take-photo">
        <div className="camera">
            <p>Authentication Via Face</p>
            <Webcam
            audio={false}
            videoConstraints={videoConstraints}
            ref={webcamRef}
            screenshotFormat="image/png"
            className="webcam"
            />
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
    );
}

export default Face;

