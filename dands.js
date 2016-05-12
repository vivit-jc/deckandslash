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

function addButtonToItem($dom) {
    if ($dom.attr('data-equip')) {
        $dom.append('<button class=equip>装備</button>');
    } else {
        $dom.append('<button class=use>使う</button>');
    }
    $dom.append('<button class=drop>捨てる</button>');
}

function removeButtonOfItem($dom) {
    $dom.find('button').remove();
}

function dropItem($card) {
    $card.remove();
    removeButtonOfItem($card);
    $("div#dungeon").append($card.clone(true));
}

var bindEvents = function () {
    $("body").on('click', 'button', function () {
        var $btn = $(this);
        if ($btn.attr("class") === "drop") {
            dropItem($btn.closest('div.card'))
        }
    });

    // 動的に生成されたdiv.card要素のクリックイベントを監視
    $("body").on('click', 'div.card', function (e) {
        var $card = $(e.target).closest('div.card');
        if ($card.attr('data-type') === "item") {
            if ($card.parent().attr("id") === "dungeon") {
                $card.remove();
                addButtonToItem($card);
                $("div#bag").append($card.clone(true));
            }
        }
    });
};

var init = function (data) {
    var darray = [0, 0, 0];
    data.forEach(function (val, index, ar) {
        darray[index] = shuffle(val);
    });
    console.info(darray);

    for (var i = 0; i < 5; i++) {
        var carddata = darray[0].pop();
        var carddataKeys = Object.keys(carddata);
        var $divcard = $("<div class=card></div>");
        $divcard.css("left", 9 + i * 100);
        str = makeStr(carddata);
        $divcard.html(str);
        // DOMのdataset属性にカード情報を持たせる
        carddataKeys.forEach(function (key) {
            $divcard.attr('data-' + key, carddata[key]);
        });
        $("div#dungeon").append($divcard);
    }
};

$(function () {
    bindEvents();
    $.getJSON("data.json", function (data) {
        init(data);
    });
});