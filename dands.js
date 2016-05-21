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
    var str = data.name
    if(data.type=="monster"){
        str += "<br>POW: "+"<span class=monpower>"+data.power+"</span>"
        if(data.sub) str += "<br>"+data.sub
    } else if(data.type=="item" && data.equip=="sword"){
        str += "<br>POW: "+data.power
    }
    return str+"<br>"
}

function execBattle(){
    $('span#hp').html(+$('span#hp').html() - $('span#damage').html())
    $('div#dungeon div.card').each(function(i,v){
        if($(v).attr('data-type') != "monster") return true
        var $card = $(v)
        if($card.children('input.escape').is(':checked')){
            $("div#trash").append($card.clone(true));
        } else {
            $("div#removed").append($card.clone(true));
        }
        $card.remove()
    })
    calcDamage()
    $('button#next').text("進む")
}

function drawCards(){
    $('div#dungeon div.card').each(function(i,v){
        $(v).remove()
        $('div#trash').append($(v).clone(true))
    })
    for (var i = 0; i < 5; i++) {
        var carddata = darray[0].pop();
        var carddataKeys = Object.keys(carddata);
        var $divcard = $("<div class=card></div>");
        $divcard.css("left", 9 + i * 100);
        var str = makeStr(carddata);
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
    calcDamage()
    $('button#next').text("戦う")
}

function calcDamage(){
    var damage = 0
    var escape = getEscapedMonster()
    $('div#dungeon div.card').each(function(i,v){
        if($(v).attr('data-type') != "monster") return true
        if($(v).children('input.escape').is(':checked')) return true
        damage += +$(v).children('.monpower').html()
    })
    $('span#damage').html(damage+escape)
    if(damage+escape >= +$('span#hp').html()){
        $('span#damage').css('color','red')
        $('span#damage').css('font-weight','bold')
    } else {
        $('span#damage').css('color','black')
        $('span#damage').css('font-weight','')
    }
    $('span#escape').html(getEscapedMonster()+"/"+getMaxEscape())
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

function getEscapedMonster(){
    return $('div#dungeon input.escape:checked').length
}

var bindEvents = function () {
    $("body").on('click', 'button.drop', function (dom) {
        dropItem(getSelfCard(dom))
    });

    $("body").on('click', 'button#next', function (dom) {
        if($(dom.target).html() == "戦う") execBattle()
        else if($(dom.target).html() == "進む") drawCards()
    })

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

    // 逃げるチェックボックスのクリックイベント
    $("body").on('click', 'input.escape', function(e) {
        var $card = getSelfCard(e)
        var escape = getEscapedMonster()
        if($('div#dungeon input.escape:checked').length >= getMaxEscape()){
            $('div#dungeon input.escape:not(:checked)').each(function (i,v) {
                $(v).prop('disabled', true)
            })
        } else {
            $('div#dungeon input.escape:disabled').each(function (i,v) {
                $(v).prop('disabled', false)
            })
        }
        calcDamage()
    })
};

var init = function (data) {
    data.forEach(function (val, index, ar) {
        darray[index] = shuffle(val);
    });
    console.info(darray);
    drawCards()
};

$(function () {
    darray = [0, 0, 0]
    bindEvents();
    $.getJSON("data.json", function (data) {
        init(data);
        calcDamage();
    });
});