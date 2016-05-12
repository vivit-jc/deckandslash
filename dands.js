function shuffle(array) {
  var n = array.length, t, i;
  while (n) {
    i = Math.floor(Math.random() * n--);
    t = array[n];
    array[n] = array[i];
    array[i] = t;
  }
  return array;
}

function makeStr(data){
  str = data.name
  if(data.type=="monster"){
    str += "<br>POW: "+data.power
    if(data.sub) str += "<br>"+data.sub
  } else if(data.type=="item" && data.equip=="sword"){
    str += "<br>POW: "+data.power
  }
  return str
}

function makeItem(dom){
  if(dom.data('data').equip) dom.append('<button>装備</button>')
  else dom.append('<button>使う</button>')
}

function init(data){
  darray = [0,0,0]
  $("body").on('click', 'button', function(){
    console.log($(this).parent().data('data'))
    if($(this).parent().data('data').type == 'item') console.log("item")
    else console.log("click")
  })
  $("div#dungeon").on('click', "div.card", function(s){
  })
  data.forEach(function(val,index,ar){
    darray[index] = shuffle(val)
  })
  var d = $.data($('div#dungeon'),"deck",darray)
  for(var i=0;i<5;i++){
    carddata = d[0].pop()
    divcard = $("<div class=card></div>")
    divcard.css("left",9+i*100)
    str = makeStr(carddata)
    divcard.html(str)
    divcard.data('data',carddata)
    $("div#dungeon").append(divcard)
  }
  $("div.card").click(function(){
    data = $(this).data('data')
    if(data.type=="item") {
      makeItem($(this))
//ここ      console.log($(this).parent("div#dungeon"))
      if($(this).parent() == $("dungeon")){
        $("div#bag").append($(this).clone(true))
        $(this).remove()
      }
    }
  })
}

$(document).ready(function(){
  $.getJSON("data.json", function(data) {init(data)})
})