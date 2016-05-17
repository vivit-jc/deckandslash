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
        str += "<br>POW: "+"<span class=monpower>"+data.power+"</span>"
        if(data.sub) str += "<br>"+data.sub
    } else if(data.type=="item" && data.equip=="sword"){
        str += "<br>POW: "+data.power
    }
    return str+"<br>"
}

function calcDamage(escape){
    var damage = 0
    $('div.card').each(function(i,v){
        if($(v).attr('data-type') != "monster") return true
        if($(v).children('input.escape').is(':checked')) return true
        damage += +$(v).children('.monpower').html()
    })
    $('span#damage').html(damage+escape)
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

function getSelfCard(e) {
    return $(e.target).closest('div.card')
}

function getMaxEscape(){
    return 2
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
        var $card = getSelfCard(e)
        if ($card.attr('data-type') === "item") {
            if ($card.parent().attr("id") === "dungeon") {
                $card.remove();
                addButtonToItem($card);
                $("div#bag").append($card.clone(true));
            }
        }
    });

    $("body").on('click', 'input.escape', function(e) {
        var $card = getSelfCard(e)
        var escape = $('input.escape:checked').length
        if($('input.escape:checked').length >= getMaxEscape()){
            $('input.escape:not(:checked)').each(function (i,v) {
                $(v).prop('disabled', true)
            })
        } else {
            $('input.escape:disabled').each(function (i,v) {
                $(v).prop('disabled', false)
            })
        }
        calcDamage(escape)
    })
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
        if(carddata.type=="monster"){
          $divcard.append("逃げる<input type=checkbox class=escape>")
        }
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