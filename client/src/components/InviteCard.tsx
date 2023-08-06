import * as React from 'react'
import { Form, Button, Icon ,Dimmer, Loader, Image, Segment} from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { patchTodo,getUrl, uploadFile ,getOneTodos,} from '../api/todos-api'
import { Todo } from '../types/Todo'
import '../style/InviteCard.css'
import { Buffer } from 'buffer';
import { Todos } from './Todos'
import image from "../public_image/wedding.jpg"; 
import { Transfer } from 'aws-sdk'
interface invState {
  userId: string
  todoId: string
  loadingTodos: boolean
  name: string
  partyName: string
  inviteDate: string
  address: string
  wish: string
  done: boolean
  attachmentUrl: string
  file: any
  isLoading: boolean
}
export class InviteCard extends React.PureComponent {
  state: invState = {
    userId: '',
    todoId: '',
    loadingTodos: true,
    name: '',
    partyName: '',
    inviteDate: '',
    address: '',
    wish: '',
    done: false,
    attachmentUrl: '',
    file: undefined,
    isLoading: false,

  }
  
  queryParameters = new URLSearchParams(window.location.search)
  qrcode = this.queryParameters.get("qrcode")!
  decodeString = ""
  async getUserInfo(){
      const todos = await getOneTodos(this.state.todoId)
      try {
        const todos = await getOneTodos(this.state.todoId)
        this.setState({
          name: todos[0].name,
          partyName: todos[0].partyName,
          inviteDate: todos[0].inviteDate,
          address: todos[0].address,
          wish: todos[0].wish,
          done: todos[0].done,
          attachmentUrl: todos[0].attachmentUrl,
          loadingTodos: false
        })
        console.log(todos)
      } catch (e) {
        alert(`Failed to fetch todos: ${(e as Error).message}`)
      }
  }
  /*
  this.decodeString =Buffer.from(this.qrcode, 'base64').toString('ascii');
  state.todoId = this.decodeString
  this.getUserInfo()
  */
  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    const element = document.getElementById('dbImg')!;
    if (!files) return
    this.setState({
      file: files[0]
    })
    const file = files[0];
    const fileReader = new FileReader();

    fileReader.onload = () => {
      element.style.backgroundImage = `url(${fileReader.result})`;
      element.style.backgroundImage = "no-repeat"
      element.style.backgroundSize = "cover"
      element.style.height = "100%"
    };
    
    fileReader.readAsDataURL(file);

  }
  handleWishChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ wish: event.target.value })
    console.log("wish: " + this.state.wish);
  }
  updateWish = async () => {
    try {
      await patchTodo({
        userId: this.state.userId,
        todoId: this.state.todoId,
        name: this.state.name,
        wish: this.state.wish,
        done: true
      })

    } catch {
      alert('Todo deletion failed')
    }
  }
  postSubmit = async () => {
    this.forceUpdate()
    this.state.isLoading = true
    try {
      const uploadUrl = await getUrl(this.state.todoId)
      await uploadFile(uploadUrl, this.state.file)
      this.updateWish()
      this.state.isLoading = false
      this.forceUpdate()
    } catch {
      alert('Could not upload a file: ')
    } finally {

    }
  }

  render() {
    
    this.decodeString =Buffer.from(this.qrcode, 'base64').toString('ascii');
    this.state.todoId = this.decodeString.substring(0, 36);
    this.state.userId = this.decodeString.substring(36, this.decodeString.length);
    console.log(this.state.userId)
    console.log(this.state.todoId)
    if (this.state.loadingTodos) {
      this.getUserInfo()
    }
    console.log(this.state.address)
    return (
      <body className="bg">
      <div className="relative">
        {this.state.isLoading && ( <div> :
            <Segment inverted
                textAlign='center'
                style={{opacity: .5, minHeight:'400px', zIndex: 1}}
                vertical>
                <Loader inverted content='Posting' style={{marginTop:'150px'}}active inline='centered' size='big'/>
            </Segment>
          </div>)}
          <div className="absolute invCard">
            <div className="absolute invPremise">THE WEDDING OF</div>
            <div className="absolute weddingName">{this.state.partyName.toUpperCase()}</div>
            <div className="absolute invName">ARE PLEASE TO INVITE {this.state.name.toUpperCase()} TO THEIR WEDDING CELEBRATION</div>
            <div className="absolute invTime">{this.state.inviteDate.toUpperCase()}</div>
            <div className="absolute invAddr"> {this.state.address.toUpperCase()}</div>
          </div>
          <div className="absolute status">
            <div className="absolute status-note">It is our pleasure to receive your wishes. If you have any photo taken with us, please upload it in the box below!</div>
            <div className="absolute status_input">
              <textarea name="wish" rows={4} placeholder="Input your wishes..." onChange={this.handleWishChange}  value={this.state.wish}/>
            </div>
            <div className="absolute image_add">
              <div className="upload-btn-wrapper">
                <button className="upload-btn">Upload Image</button>
                <input type="file" accept="image/*" onChange={this.handleFileChange} name="myfile" />
              </div>
            </div>
            <div  className="absolute post_area" onClick={() => this.postSubmit()}>
                <button className="post-btn" disabled={!this.state.wish}>Post</button>
            </div>
          </div>
          <div className="absolute image-pos">
          <div id="dbImg" className="bg-image" ></div>
          </div>
          
          
      </div>
      </body>
    )
  }
}
