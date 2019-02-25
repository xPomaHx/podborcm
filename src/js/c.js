;

//начальная загрузка
window.setTimeout(function() {
    mainHerosList.download().then(() => {
        $(".bro-search").autocomplete({
            source: mainHerosList.allHeroName,
            select: function(e, ui) {
                mainHerosList.select(ui.item.value);
                mainHerosList.renderSelect();
            },
        });
        mainHerosList.renderSelect();
    });
}, 1);

//кнопка скачивания базы
$(document).on("click", ".update", function() {
    mainHerosList.update();
});

//даблклик добовляет героя в контейнер
$(document).on("mousedown", ".banlist, .ourpick, .theypick", function(e) {
    if ($(e.target).hasClass("bro-del")) {
        return;
    }
    var targetdb = $(e.currentTarget).attr('class');
    var heroname = mainHerosList.select();
    var cont = mainHerosList[targetdb];
    if (mainHerosList["theypick"].indexOf(heroname) == -1 && mainHerosList["banlist"].indexOf(heroname) == -1 && mainHerosList["ourpick"].indexOf(heroname) == -1) {
        cont.push(heroname);
        mainHerosList.renderChoosemCont();
        mainHerosList.mainCalc();
        mainHerosList.renderCalcCont();
    }

});
$(document).on("mousedown", ".bro-del", function(e) {
    var targetdb = $(e.currentTarget).closest("div").attr('class');
    var heroname = $(e.currentTarget).closest("p").find("span").html();
    var i = mainHerosList[targetdb].indexOf(heroname);
    mainHerosList[targetdb].splice(i, 1);
    mainHerosList.renderChoosemCont();
    mainHerosList.mainCalc();
    mainHerosList.renderCalcCont();
});
//клик по герою выбирает его из списка всех героев
$(document).on("mousedown", ".bro-allherolist img, .weekpick p, .counterpick p, .strongpick p", function(e) {
    mainHerosList.select($(e.currentTarget).data('urlheroname'));
    mainHerosList.renderSelect();
});
$(document).on("click", ".bro-search", function(e) {
    /* var s = e.currentTarget.value;
     var name = mainHerosList.allHeroName.find(function(el) {
         if (el.indexOf(s) != -1) {
             return true;
         }
     });
     if (name !== undefined) {
         $("bro-nowselect").html(name);
         mainHerosList.select(name);
         mainHerosList.renderSelect();
     }*/
    //$(this).select();
});
//$(document).on("autocompleteselect", ".bro-search", function(e, ui) {
//    console.log($(ui).val());
//    mainHerosList.select($(ui).val());
//    mainHerosList.renderSelect();
//});
