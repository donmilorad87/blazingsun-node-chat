const socket = io()

const messageForm = document.getElementById('message-form')
const messageFormInput = messageForm.getElementsByTagName('input')[0]
const messageFormButton = messageForm.getElementsByTagName('button')[0]

const sendLocation = document.getElementById('send-location')

const temp = document.getElementsByTagName("template")[0];
const item0 = temp.content.querySelector("div");
const item = temp.content.querySelector("p");
let a;
const messages = document.getElementById('messages')
const locations = document.getElementById('locations')
const userList = document.getElementById('userList')

function getUrlParameters(){

    const urlParams = new URLSearchParams(location.search)

    let obj ={}

    urlParams.forEach(function(value, key) {
        obj[key] = value;
        if(key === 'username' && value === ''){
            obj[key] = 'no_name';
        }
      })
      
      return obj
}

const { username, room } = getUrlParameters()

console.log(username, room)

socket.on('message', (message) => {

    
    a = document.importNode(item, true);
    a.innerHTML += '<span class="message__name"> '+ message.username +' </span><span class="message__meta">' + message.createdAt.chatTime + '</span>' + ' - ' + message.text
    messages.appendChild(a)
 
    messages.scrollTop = messages.scrollHeight;

})

socket.on('locationMesage', (location) => {
  
    a = document.importNode(item0, true);
    a.innerHTML = `<p>
                        <span class="message__name"> ${location.username} </span>
                        <span class="message__meta">Client Send Location at: ${location.createdAt.date} </span>
                    </p> ${location.img}`
    locations.appendChild(a)
})

socket.on('roomData',({room, users}) => {
    
    document.getElementById('roomName').textContent = room
    console.log(room)
    console.log(users)
    userList.innerHTML = ''
    users.forEach(function(user) {
        a = document.importNode(item0, true);
        a.innerHTML = `<p class="message__name" ${socket.id === user.id ? 'id="iAm"' : 'id="youAre"'} > ${user.username} </p>`
        a.style.cssText = 'text-transform:capitalize; width: 80%; margin:0 auto; padding:4px;'
        userList.appendChild(a)
      })
   

})

messageForm.addEventListener('submit', (e) => {
    
    e.preventDefault()

    messageFormButton.disabled = true

    const message = e.target.elements.message.value
    if (message !== ''){
        socket.emit('sendMessage', message, (error) =>{
        
            messageFormButton.disabled = false
            messageFormInput.value = ''
            messageFormInput.focus()
    
            if(error){
                return console.log(error)
            }
            console.log('Message delivered!')
        })
    }else{
        messageFormButton.disabled = false
        console.log('nema sta da saljes praznu poruku na q te nabijem')
    }
    
    
})

sendLocation.addEventListener('click', () =>{

    if(!navigator.geolocation){
        return alert('location is not supported by your browser')
    }

    sendLocation.disabled = true

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (answer) => {
            console.log('Location shared', answer)
            sendLocation.remove()
        })
    }) 
})

socket.emit('join',{username, room})

// document.getElementById('krma').addEventListener('click', () =>{

//     socket.emit('join',{username, room, game:game+'33'}, (error) =>{
//         if(error){
//             alert(error)
//             location.href = '/'
//         }
//     })

// })