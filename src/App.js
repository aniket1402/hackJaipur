import React, { Component } from 'react';

class App extends Component {
  constructor(props){
    super(props)

    this.localVideoref = React.createRef()
    this.remoteVideoref = React.createRef()
  }

  componentDidMount() {

    const pc_config = null
    this.pc = new RTCPeerConnection(pc_config)

    this.pc.onicecandidate = (e) => {
      if(e.candidate) console.log(JSON.stringify(e.candidate))
    }

    this.pc.onicegatheringstatechange = (e) => {
      console.log(e)
    }

    this.pc.onaddstream = (e) => {
      console.log('remote screen video')
      this.remoteVideoref.current.srcObject = e.stream
    }

    const constraints = { video : true}

    const success = (stream) => {
      window.localStream = stream
      this.localVideoref.current.srcObject = stream
      this.pc.addStream(stream)
    }

    const failure = (e) => {
      console.log('getUserMedia error: ',e)
    }

    navigator.mediaDevices.getUserMedia(constraints)
    .then(success)
    .catch(failure)
  }

  createOffer = () => {
    console.log('Offer')
    this.pc.createOffer({offerToReceiveVideo:1})
    .then(sdp => {
      console.log(JSON.stringify(sdp))
      this.pc.setLocalDescription(sdp)
    },e => {})
  }

  setRemoteDescription = () => {
    const desc = JSON.parse(this.textref.value)
    this.pc.setRemoteDescription(new RTCSessionDescription(desc))
  }

  createAnswer = () => {
    console.log('Answer')
    this.pc.createAnswer({offerToReceiveVideo:1})
    .then(sdp => {
      console.log(JSON.stringify(sdp))
      this.pc.setLocalDescription(sdp)
    },e => {})
  }

  addCandidate = () => {
    const candidate = JSON.parse(this.textref.value)
    console.log('Adding candidate: ',candidate)

    this.pc.addIceCandidate(new RTCIceCandidate(candidate))
  }

  render() {
    return (
      <div style={{display: 'flex'}}>
        <div style={{width: '100%',height:'100%'}}>
          <p>Here Google Docs can be embedded.</p>
        </div>
        <div>
          <video
            style={{
              width: 240,height: 240,
              margin: 5, backgroundColor: 'black'
            }}
            ref={this.localVideoref}
            autoPlay>
          </video>
          <video
            style={{
              width: 240,height: 240,
              margin: 5, backgroundColor: 'black'
            }}
            ref={this.remoteVideoref}
            autoPlay>
          </video>
          <br/>
        <button style={{backgroundColor: 'green',color:'white',fontSize: 16,padding: '5px 24px',marginLeft: 10,marginRight: 25}} onClick={this.createOffer}>Offer</button>
        <button style={{backgroundColor: 'green',color:'white',fontSize: 16,padding: '5px 24px'}} onClick={this.createAnswer}>Answer</button>
        <br/>
        <textarea style={{margin:10,width: 200}} placeholder='Place here' ref={ref => {this.textref = ref}}/>
        <br/>
        <button style={{backgroundColor: 'green',color:'white',fontSize: 16,padding: '2px 2px',marginLeft: 10,marginRight: 5}} onClick={this.setRemoteDescription}>Set Remote Desc</button>
        <button style={{backgroundColor: 'green',color:'white',fontSize: 16,padding: '2px 2px'}} onClick={this.addCandidate}>Add Candidate</button>
        </div>
        

      </div>
    );
  }
}

export default App;
