import * as React from 'react'
import { Form, Button, Header, Image,Icon, Modal } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import '../style/newInv.css'
import dateFormat from 'dateformat'
import { createTodo} from '../api/todos-api'
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { History } from 'history'
import { uuid } from 'uuidv4';
import { Buffer } from 'buffer';

interface MakeNewInvProps {
  auth: Auth
  history: History
}
interface InvState {
  usrnm: string
  datetime: string
  adr: string
  usrID: string
  partyName: string
}

export class MakeNewInv extends React.PureComponent <
MakeNewInvProps,InvState
>{
  state: InvState = {
    usrnm: '',
    datetime: '',
    adr: '',
    usrID: '',
    partyName: ''
  }
  dbImg  = null;

  makeNewinv = async () => {
    try {
      const dueDate = this.calculateDueDate()
      console.log("name: " + this.state.usrnm);
      console.log("time: " + this.state.datetime);
      console.log("address: " + this.state.adr);
      console.log("usrID: " + this.state.usrID);
      const newTodo = await createTodo(this.props.auth.getIdToken(), {
        name: this.state.usrnm,
        partyName: this.state.partyName,
        dueDate: dueDate,
        inviteDate: this.state.datetime,
        address: this.state.adr,
        userID: this.state.usrID
      })
      this.props.history.push('/todos');
    } catch {
      alert('Todo creation failed')
    }
  }
  handlePartyNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ partyName: event.target.value })
    console.log("name: " + this.state.partyName);
  }
  handleUsrnmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ usrnm: event.target.value })
    console.log("name: " + this.state.usrnm);
  }
  handleDatetimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({datetime: event.target.value});
  }
  handleAdrChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({adr: event.target.value});
}
  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
  handleDownloadImage = async () => {
    const element = document.getElementById('dbImg')!;
    var canvas = await html2canvas(element);
    var data = canvas.toDataURL('image/jpg');
    var link = document.createElement('a');
 
    link.href = data;
    link.download = 'downloaded-image.jpg';
 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.makeNewinv();
  };
  renderModal() {
    this.state.usrID = uuid()
    let encoded =  Buffer.from(this.state.usrID+this.props.auth.userId).toString('base64');
    return (
      <div >
        <Modal as={Form} trigger={<div className='btn_modal'>Create invitation QR code</div>} size="small">
          <Modal.Content>
          <div className="newrelative">
            <div className="newabsolute newinvCard newbg" id="dbImg" ref={this.dbImg}>
              <div className="newabsolute newinvPremise">THE WEDDING OF</div>
              <div className="newabsolute newweddingName">{this.state.partyName.toUpperCase()}</div>
              <div className="newabsolute newinvName">ARE PLEASE TO INVITE {this.state.usrnm.toUpperCase()} TO THEIR WEDDING CELEBRATION</div>
              <div className="newabsolute newinvTime">{this.state.datetime.toUpperCase()}</div>
              <div className="newabsolute newinvAddr">{this.state.adr.toUpperCase()}</div>
              <div className="newabsolute newQrCoteText">Scan our QR Code to access your invite</div>
              <div className="newabsolute newQrCote"><QRCode
                                  value= {"http://localhost:3000/InviteCard?qrcode="+encoded }
                                  size={100}
                              />
                    </div>
            </div>
          </div>
          <div className='btn_download' onClick={() => this.handleDownloadImage()}>Download Invite Card</div>
          </Modal.Content>
        </Modal>
      </div>
    );
  };
  render() {
    console.log(this.props.auth.userId)
    return (
      <div>
        
        <form className="invite-form">
          <div className="input-container" style={{marginBottom:"0.5%"}}>
            <label ><b>Party Name</b></label>
          </div>
          <div className="input-container">
            <input className="input-field" type="text" placeholder="Party Name" name="partyName" value={this.state.partyName} onChange={this.handlePartyNameChange}/>
          </div>
          <div className="input-container" style={{marginBottom:"0.5%"}}>
            <label ><b>Name</b></label>
          </div>
          <div className="input-container">
            <input className="input-field" type="text" placeholder="Name" name="usrnm" value={this.state.usrnm} onChange={this.handleUsrnmChange}/>
          </div>
          <div className="input-container" style={{marginBottom:"0.5%"}}>
            <label ><b>Party Time</b></label>
          </div>
          <div className="input-container">
            <input className="input-field" type="datetime-local" name="datetime" value={this.state.datetime} onChange={this.handleDatetimeChange}/>
          </div>
          <div className="input-container" style={{marginBottom:"0.5%"}}>
            <label ><b>Party Address</b></label>
          </div>
          <div className="input-container">
            <input className="input-field" type="text" placeholder="Address" name="adr" value={this.state.adr} onChange={this.handleAdrChange}/>
          </div>
        </form>
        <div style={{marginTop:"3%"}}>{this.renderModal()}</div>
      </div>
    )
  }
}
