
document.addEventListener('DOMContentLoaded',()=>{
const triangle=document.getElementById("triangle");
const m_button=document.getElementById("modal-button");
const modalbg=document.querySelector(".modal-bg");
const channeloverlay=document.querySelector(".channel-overlay");
const createchannel=document.getElementById("create-channel");
var channel_list,arr_of_channellist=[];
var socket=io.connect(location.protocol + '//' + document.domain + ':' + location.port);
var room;
//localStorage.removeItem("channellist");
triangle.addEventListener('click',function(){
triangle.classList.toggle("change");
})


m_button.addEventListener('click',()=>{
   modalbg.classList.add("bg-active"); 
})
modalbg.addEventListener('click',()=>{
modalbg.classList.remove("bg-active");
})
createchannel.addEventListener('click',()=>{
   channeloverlay.classList.remove("channel-active");
})
const close_button=document.getElementById("close-button");
close_button.addEventListener('click',()=>{
   channeloverlay.classList.add("channel-active");
})
document.getElementById("new-channel").onsubmit = ()=>{
   const li=document.createElement('li');
   const a =document.createElement('p');
   // a.setAttribute('href',"");
   a.setAttribute('class',"nav-link");
   a.setAttribute('data-page',`${document.getElementById("channel-name").value}`)
   a.innerHTML=document.getElementById("channel-name").value;
   li.appendChild(a);
   arr_of_channellist.push(li.innerHTML);
   console.log(arr_of_channellist);
   document.getElementById("channel-list").append(li)
   localStorage.setItem('channellist',(JSON.stringify(arr_of_channellist)));
   console.log(localStorage.setItem('channellist',(JSON.stringify(arr_of_channellist)))
   )
   document.getElementById("channel-name").value='';
   localStorage.setItem('channellist',(JSON.stringify(arr_of_channellist)));

   return false;
}

channel_list=JSON.parse(localStorage.getItem("channellist"));

if(channel_list==undefined || channel_list.length<0){
   console.log("storage is empty");
}
if(channel_list!=undefined)
{
for(i=0; i<channel_list.length; i++){
  var child_list=document.createElement('li');
  child_list.innerHTML=channel_list[i];
  arr_of_channellist.push(child_list.innerHTML);
  document.getElementById("channel-list").append(child_list);

}
}

document.getElementById("send-button").onclick=()=>{
const message=document.getElementById("message-input").value;
socket.send({'msg': message,'username':username,'room':room});
}
socket.on('join',data=>{
   console.log(data.msg);
   document.getElementById("userstatus").innerHTML=`<p>${data.msg}</p>`
   
   
})
socket.on('message',data=>{
   console.log(`message received: ${data}`);
   document.getElementById("message-input").value="";
  var p= document.createElement('p');
  p.setAttribute("class","message");
  var br=document.createElement('br');
  var span_username=document.createElement('span');
  span_username.setAttribute("id","span_username");
  var span_timestamp=document.createElement('span');
  if (typeof data.timestamp === 'undefined' || typeof data.username==='undefined')
  { p.innerHTML=data.msg+br.outerHTML;
   document.getElementById("message-container").append(p);}
  else{
  span_username.innerHTML=" " +data.username;
  span_timestamp.innerHTML=" " +data.timestamp;
  p.innerHTML=span_username.outerHTML+ br.outerHTML+ data.msg+br.outerHTML + span_timestamp.outerHTML;
  document.getElementById("message-container").append(p); 
  }
})

document.querySelectorAll('.nav-link').forEach(p=>{
p.onclick=()=>{
   let newRoom=p.innerHTML;
   console.log(p.dataset.page);
   if(newRoom==room){
      msg=`you are already in this room.`
      printSysMsg(msg);
   }
   else{

      leaveRoom(room);
      document.title=username+'-'+p.innerHTML;
      history.pushState({'title': p.dataset.page,'text': document.getElementById("chat").innerHTML},p.innerHTML,p.innerHTML);
      joinRoom(newRoom);
      room=newRoom;
      document.getElementById("chat-tag").innerHTML=newRoom;
   }
}

})   


//leave room
function leaveRoom(room){
socket.emit('leave',{'username': username,'room':room});
}

//join room
function joinRoom(room){
socket.emit('join',{'username':username,'room':room});
document.getElementById('message-container').innerHTML="";
}

//print system message
function  printSysMsg(msg){
const p=document.createElement('p');
p.innerHTML=msg;
document.getElementById('message-container').append(p);
}

var scrollwindow=document.getElementById("message-container");

scrollwindow.onscroll=()=>{
   console.log(scrollwindow.clientHeight);
   console.log(scrollwindow.scrollHeight);
   console.log(Math.floor(scrollwindow.scrollTop));
}

window.onpopstate=e=>{
   try
{
const data=e.state;
document.title=data.title;
document.getElementById("chat").innerHTML=data.text;
}
catch(err){
   if (err instanceof TypeError){
      const request=new XMLHttpRequest();
      request.open('GET',"/active");
      request.onload=()=>{
         const response=request.responseText;
         document.querySelector('body').innerHTML=response;
      }
      request.send();
   }
}
}
});

