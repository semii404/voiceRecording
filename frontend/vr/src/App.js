
import './App.css';

//react meadia api for recording voice 
import {useReactMediaRecorder} from 'react-media-recorder';


function App() {
var responseBlob;
//functions  of react  media api
 const {status,startRecording,stopRecording,mediaBlobUrl,clearBlobUrl}=useReactMediaRecorder({audio:true});



 //uploading recording file to remote mongoDB cloud server
 async function upload() {
if (!mediaBlobUrl) {
  console.log('recording not available')
} else {
  try {
      
    //captured blob from blob url
    let response = await fetch(mediaBlobUrl);

     responseBlob = await response.blob();

   console.log(mediaBlobUrl)

  
  
  
   //uploading recording to mongoDB
 
  var myHeaders = new Headers();
  myHeaders.append("name", "saleem");
  
  var formdata = new FormData();
  formdata.append("file", responseBlob );
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
  };
  
  fetch("http://localhost:5000/upload", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

    clearBlobUrl();
}  
    catch(error) {
    console.error(error);
  }
}

}


  



  return (
    <div className="App">
      <div><h1>Voice Recording App</h1></div>
 
     <button  onClick={startRecording}>Start</button>
     <button onClick={stopRecording}>Stop</button>
     <button onClick={upload} >Upload</button>
     <br></br>
     {status}
     <br></br>
     <audio controls src={mediaBlobUrl} ></audio>
      
     <div>
  
    </div>  
    </div>
  );
}

export default App;
