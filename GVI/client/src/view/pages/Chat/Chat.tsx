import {useState, useEffect, useId} from 'react';
import axios from 'axios';
import ChatWindow from './components/ChatWindow';
import CurrentRecipient from './components/CurrentRecipient';
import SideBar from './components/SideBar';
import {socket} from '../../../index';
import {ObjectId} from 'mongoose';
import { text } from 'node:stream/consumers';

export interface MessageUserInterface {
    userId: String;
fullName:String;
}
export interface UserInterface {
    _id: String;
    fullName: String;
}
export interface MessageInterface {
    _id?: String;
    sender: MessageUserInterface;
    recipients: Array<MessageUserInterface>;
    text?: String;
    file?: String;
    time?: String;
}

function Chat() {
    const [scroll, setScroll] = useState('');
    const [sentMessage, setSentMessage] = useState('');
    const [room, setRoom] = useState('');
    const [messageList, setMessageList] = useState<Array<MessageInterface>>([]);
    const [recipient, setRecipient] = useState<UserInterface>();
    const [userList, setUserList] = useState<Array<UserInterface>>([]);
    const [searchMessagesToggle,setSearchMessagesToggle] = useState<boolean>(false)

    function dateFromObjectId(messageId: string) {
        if (messageId) {

            return `${new Date(parseInt(messageId.substring(0, 8), 16) * 1000)}`;
        }
    }
    function handleJoinRoom(ev: any, user: UserInterface) {
        const room:any = user._id;
        if (room !== '' || room) {
            socket.emit('join-room', room);
            setRoom(room);
            setRecipient(user)
        }
    }

    useEffect(() => {
        console.log('on');
        socket.on('receive-message', (message: MessageInterface) => {
            console.log('received');
            const id: any = message._id;
            const payload = {
                text: message.text,
                sender: message.sender,
                recipients: [...message.recipients],
                file: '',
                time: dateFromObjectId(id),
            };

            setMessageList((messageList: Array<MessageInterface>) => [...messageList, payload]);

            setScroll('0');
        });

        return () => {
            console.log('off');
            socket.off('receive-message');
        };
    }, [socket]);

    function handleChatSearchBar () {
        setSearchMessagesToggle((p:boolean) => !p);
    }
    function handleSendMessage() {
        try {
            
            const id:any = recipient?._id
            const fullName:any = recipient?.fullName
            if(sentMessage === '') throw new Error('Type something!')
            const payload = {
                text: sentMessage,
                sender: {userId: '', fullName: ''},
                recipients: [{userId: id, fullName: fullName}],
                file: '',
            };
            socket.emit('send-message', payload);
            setMessageList((messageList: Array<MessageInterface>) => [...messageList, payload]);
        } catch (error) {
            console.log(error);
            
        }
    }

    async function getMessageList() {
        try {
            const {data} = await axios.post('/api/messages/get-messages', {ok: true});

            setMessageList(data.allMessages);
        } catch (error) {
            console.log(error);
        }
    }
    async function getUserList() {
        try {
            const {data} = await axios.post('/api/users/get-all-recipients', {ok: true});
            console.log(data.allUsers, 'userList');
            setUserList(data.allUsers);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='chat'>
            <SideBar handleJoinRoom={handleJoinRoom} getUserList={getUserList} userList={userList} />
            {recipient ? <CurrentRecipient recipient={recipient} handleChatSearchBar={handleChatSearchBar} searchMessagesToggle={searchMessagesToggle}/> : null}
            <ChatWindow dateFromObjectId={dateFromObjectId} scroll={scroll} setSentMessage={setSentMessage} handleSendMessage={handleSendMessage} getMessageList={getMessageList} messageList={messageList} setMessageList={setMessageList} />
        </div>
    );
}

export default Chat;
