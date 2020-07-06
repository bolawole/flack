
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
   document.getElementById("userstatus").innerHTML=`<p>${data.msg}</p>`
   
   
})
socket.on('message',data=>{
   document.getElementById("message-input").value="";
  var p= document.createElement('p');
//   p.setAttribute("class","message");
  var br=document.createElement('br');
  var span_username=document.createElement('span');
  span_username.setAttribute("id","span_username");
  var span_timestamp=document.createElement('span');
  if (typeof data.timestamp === 'undefined' || typeof data.username==='undefined')
  { p.innerHTML=data.msg+br.outerHTML;
   document.querySelectorAll(".message").append(p);}
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


  //   if(data.username===username){
//      document.querySelector(".message").style.backgroundColor="white";
//   }
//   document.querySelector(".message").style.backgroundColor="red";
  document.getElementById("message-container").append(p); 
 check_windowheight();
   
   
   
  }
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
      console.log(p.innerHTML);
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
// document.getElementById('message-container').innerHTML="";
scrollwindow.style.overflow="hidden";
}

//print system message
function  printSysMsg(msg){
const p=document.createElement('p');
p.innerHTML=msg;
document.getElementById('message-container').append(p);
}






 function loadpage(name){
   const request=new XMLHttpRequest();
   const state =`/active/${username}/${name}`;
   console.log(state);
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
      socket.emit('image',{"username":username,"image":this.result});
   })
   reader.readAsDataURL(file)
}
})

socket.on('image',msg=>{
var img=document.createElement('img');
img.setAttribute("class","chat-image");
img.setAttribute("src",msg.image)
document.getElementById('message-container').append(img);
check_windowheight();

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

 });

