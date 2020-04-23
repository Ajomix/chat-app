const socket = io()
const state ={
    mess:[]
}
const $messageForm = document.querySelector('#messenge-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messenge = document.querySelector('#messenge')
const $sendLocationBtn = document.querySelector('#send-location')

//template
const $messengeTemplate = document.querySelector('#message-template').innerHTML
const $locateTemplate = document.querySelector('#locate-template').innerHTML
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const { username,room } = Qs.parse(location.search,{ ignoreQueryPrefix :true })

const autoSCroll = ()=>{
    const newMessEl = $messenge.lastElementChild
    const margin = parseInt(getComputedStyle(newMessEl).marginBottom)
    const newMess = newMessEl.offsetHeight + margin 
    
    const visibleHeight = $messenge.offsetHeight

    const containerContent = $messenge.scrollHeight

    const offSetContent = $messenge.scrollTop + visibleHeight

    if(containerContent - newMess <= offSetContent){
        $messenge.scrollTop = $messenge.scrollHeight
    }
}

socket.on('roomdata' ,({room,allUser})=>{
    const html = Mustache.render($sidebarTemplate,{
        room, 
        users:allUser
    })
    document.querySelector('#sidebar').innerHTML = html
})

socket.on('sendMess',input=>{
    if(!input.text.trim()){
        return 1
    }
    const html = Mustache.render($messengeTemplate,{
        username:input.username,
        messenge:input.text
        ,CreateAt:moment(input.CreateAt).format('h:mm a')
    })
    $messenge.insertAdjacentHTML('beforeend',html)
    autoSCroll()
})

socket.on('sendLocate' ,urlLocate =>{
    const html = Mustache.render($locateTemplate,{
        username  : urlLocate.username,
        urlLocate : urlLocate.url
        ,CreateAt : moment(urlLocate.CreateAt).format('h:mm a')
    })
    $messenge.insertAdjacentHTML('beforeend',html)
    autoSCroll()
})

$messageForm.addEventListener('submit',(event)=>{
   
    event.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')

    const input = $messageFormInput.value
    
    socket.emit('sendMess',input,(e)=>{
        console.log(e)

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ""
        $messageFormInput.focus()
    })   

   
})

$sendLocationBtn.addEventListener('click',  ()=>{
    const location = navigator.geolocation

    const getData = (data,cb)=>{
        if(data) return cb(data,undefined)
        return cb(undefined,'Cant get data !') 
    }

    if (!location) {
        return alert('Need to access location to use this function !')
    }
    
    $sendLocationBtn.setAttribute('disabled','disabled')

    location.getCurrentPosition((position)=>{
        const locate = {
            longitude:position.coords.longitude,
            latitude:position.coords.latitude
        }

        socket.emit('location',locate,(urlLocate)=>{
            console.log('Location is Shared')
            $sendLocationBtn.removeAttribute('disabled')
        })  

        getData(locate,(dat,er)=>{
            if(er) return console.log(er)
            state.locate = dat
        })
    })
})

socket.emit('join',{ username, room },(error)=>{
    if (error) {
        alert(error)
        location.href = '/'
    }
})