
document.addEventListener('DOMContentLoaded',()=>{
const triangle=document.getElementById("triangle");
const m_button=document.getElementById("modal-button");
const modalbg=document.querySelector(".modal-bg");
const channeloverlay=document.querySelector(".channel-overlay");
const createchannel=document.getElementById("create-channel");
var channel_list,arr_of_channellist=[];
var socket=io.connect(location.protocol + '//' + document.domain + ':' + location.port);
var room;
var scrollwindow=document.getElementById("upperchat-layer");
var infile=document.getElementById("infile");
var chat_msg=document.getElementById("message-input");
//localStorage.removeItem("channellist");
window.onpopstate=e=>{
   try {
const data=e.state;
console.log(data.title);
document.title=username+'-'+data.title;
document.getElementById("upperchat-layer").innerHTML=data.text;
}
catch(err){
   if (err instanceof TypeError){
     document.title=username;
   }
}
}
triangle.addEventListener('click',function(){
triangle.classList.toggle("change");
document.querySelector("#channel-list").classList.toggle("channel-dropdown");
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
   document.getElementById("channel-list").append(li)
   localStorage.setItem('channellist',(JSON.stringify(arr_of_channellist)));
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
const message=chat_msg.value;
socket.send({'msg': message,'username':username,'room':room});
}
socket.on('join',data=>{
   // document.getElementById("userstatus").innerHTML=`<p>${data.msg}</p>`
   printSysMsg(data.msg)
   
})
// this part gets the message from the server and displays it 
socket.on('message',data=>{
   chat_msg.value="";
  var p= document.createElement('p');

  var br=document.createElement('br');
  var span_username=document.createElement('span');
  span_username.setAttribute("id","span_username");
  var span_timestamp=document.createElement('span');
  if (typeof data.timestamp === 'undefined' || typeof data.username==='undefined')
  { 
     printSysMsg(data.msg);
   
   // p.innerHTML=data.msg+br.outerHTML;
   // document.querySelectorAll(".message").append(p);
 }
  else{
  span_username.innerHTML=" " +data.username;
  span_timestamp.innerHTML=" " +data.timestamp;
  p.innerHTML=span_username.outerHTML+ br.outerHTML+ data.msg+br.outerHTML + span_timestamp.outerHTML;
 if (data.username!=username){
   p.setAttribute("class","receiver");
 }
 else
 {
   p.setAttribute("class","message");
 }

  document.getElementById("message-container").append(p); 
 check_windowheight(); 
 update_scroll();
   
  }
})
// gets the images from the server and displays it
socket.on('image',msg=>{
   var p= document.createElement('p');
   var br=document.createElement('br');

   p.setAttribute("class","img_container");
if (msg.username!=username){
 
   p.innerHTML=`<img src="${msg.image}" class="img_receiver">`;
 }
 else
 {
   p.innerHTML=`<img src="${msg.image}" class="Img_message">`;
 }

document.getElementById('message-container').append(p);
check_windowheight();
update_scroll();

})

document.querySelectorAll('.nav-link').forEach(p=>{
p.onclick=()=>{
   let newRoom=p.innerHTML;

   if(newRoom==room){
      msg=`you are already in this room.`
      printSysMsg(msg);
   }
   else{

      document.title=username+'-'+p.innerHTML;
      loadpage(p.innerHTML);
      leaveRoom(room);
      joinRoom(newRoom);
      room=newRoom;
      document.getElementById("chat-tag").innerHTML=titleCase(p.innerHTML);
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
chat_msg.focus();
scrollwindow.style.overflow="hidden";
}

//print system message
function  printSysMsg(msg){
const p=document.createElement('p');
p.setAttribute("class","printSysMsg")
p.innerHTML=msg;
document.getElementById('message-container').append(p);
}






 function loadpage(name){
   const request=new XMLHttpRequest();
   const state =`/active/${username}/${name}`;
   request.open('GET',`/active/${username}/${name}`);
   request.onload=()=>{
      const response=request.responseText;
      document.getElementById('upperchat-layer').innerHTML=response;
      history.pushState({'title': name,'text': response},name,state);

   }
   request.send();
 }


 function titleCase(str) {
   str = str.toLowerCase().split(' ');
   for (var i = 0; i < str.length; i++) {
     str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
   }
   return str.join(' ');
 }

infile.addEventListener('change',function(){
const file=this.files[0];
if (file){
   const reader= new FileReader();

   reader.addEventListener('load',function(){
      socket.emit('image',{"username":username,"image":this.result,'room':room});
   })
   reader.readAsDataURL(file)
}
})



function check_windowheight(){
   if((scrollwindow.scrollHeight) > (scrollwindow.clientHeight))
   {
   scrollwindow.style.overflow="scroll";
   scrollwindow.style.overflowX ="hidden";
   }
   else
   scrollwindow.style.overflow="hidden";
   scrollwindow.style.overflowX ="hidden";
      console.log(scrollwindow.clientHeight);
      console.log(scrollwindow.scrollHeight);
      console.log(Math.floor(scrollwindow.scrollTop));
}
function update_scroll(){
   scrollwindow.scrollTop=scrollwindow.scrollHeight;
}
chat_msg.addEventListener("keyup",event =>{
   event.preventDefault();
   if(event.keyCode===13){
      document.getElementById("send-button").click();
   }
})
scrollwindow.onscroll=()=>{
   console.log(scrollwindow.clientHeight);
   console.log(scrollwindow.scrollHeight);
   console.log(Math.floor(scrollwindow.scrollTop));
}

 });

