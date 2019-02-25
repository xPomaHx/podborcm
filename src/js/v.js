;
mainHerosList.renderAllHeroList = function() {
    this.forEach(function(el, i) {
        var icon = $("<img>").attr("src", el.imgurl).attr("data-urlheroName", el.urlheroName);
        $(".bro-allherolist").append(icon);
    });
};
mainHerosList.renderSelect = function() {
    $(".weekpick p, .counterpick p, .strongpick p").removeClass("bro-select");
    $(".bro-allherolist img").removeClass("bro-select");
    $(".bro-nowselect").html(this.select());
    var vueselect = $(".weekpick p, .counterpick p, .strongpick p,.bro-allherolist img")
    vueselect = vueselect.filter("[data-urlheroName=" + this.select() + "]")
    vueselect.addClass("bro-select");
};
mainHerosList.renderChoosemCont = function() {
    var ars = ["banlist", "ourpick", "theypick"].forEach((sel) => {
        var cont = $("." + sel);
        cont.find("p").remove();
        mainHerosList[sel].forEach((hero) => {
            var heroline = $("<p>");
            var heroname = $("<span>").html(hero);
            var delbtn = $("<button>").addClass("bro-del").html(" &#10007;");
            heroline.append(heroname).append(delbtn);
            cont.append(heroline);
        });
    });
}
mainHerosList.renderCalcCont = function() {
    var ars = ["weekpick", "counterpick", "strongpick"];
    var AllSelectedHeroName = [].concat(this.banlist, this.ourpick, this.theypick);
    ars.forEach((sel) => {
        var cont = $("." + sel);
        cont.scrollTop(0);
        cont.children().remove();
        this[sel].forEach(function(el) {
            var brobreak = false;
            if (isNaN(el.winrate)) {
                brobreak = true;
            }
            AllSelectedHeroName.forEach(function(heroname) {
                if (el.urlheroName == heroname) {
                    brobreak = true;
                }
            });
            if (brobreak) {
                return false;
            }
            var znak = "";
            [{
                    prop: "pickrate",
                    znak: "P",
                    bgcolor: "rgba(0,255,0,0.5)",
                },
                {
                    prop: "winrate",
                    znak: "W",
                    bgcolor: "rgba(0,255,0,0.5)",
                },
                {
                    prop: "midlane",
                    znak: "M",
                    bgcolor: "rgba(0,0,255,0.5)",
                },
                {
                    prop: "offlane",
                    znak: "O",
                    bgcolor: "rgba(0,0,255,0.5)",
                },
                {
                    prop: "safelane",
                    znak: "S",
                    bgcolor: "rgba(0,0,255,0.5)",
                },
                {
                    prop: "jungl",
                    znak: "J",
                    bgcolor: "rgba(0,0,255,0.5)",
                },
                {
                    prop: "kills",
                    znak: "K",
                    bgcolor: "rgba(0,255,0,0.5)",
                },
                {
                    prop: "deaths",
                    znak: "D",
                    bgcolor: "rgba(255,0,0,0.5)",
                },
                {
                    prop: "assists",
                    znak: "A",
                    bgcolor: "rgba(0,255,0,0.5)",
                },
                {
                    prop: "matchduration",
                    znak: "MD",
                    bgcolor: "rgba(255,0,0,0.5)",
                },
                {
                    prop: "gpm",
                    znak: "G",
                    bgcolor: "rgba(0,255,0,0.5)",
                },
                {
                    prop: "epm",
                    znak: "E",
                    bgcolor: "rgba(0,255,0,0.5)",
                },
                {
                    prop: "lasthits",
                    znak: "L",
                    bgcolor: "rgba(0,255,0,0.5)",
                },
                {
                    prop: "denies",
                    znak: "DE",
                    bgcolor: "rgba(0,255,0,0.5)",
                },
                {
                    prop: "herodamage",
                    znak: "HD",
                    bgcolor: "rgba(0,255,0,0.5)",
                },
                {
                    prop: "towerdamage",
                    znak: "TD",
                    bgcolor: "rgba(0,255,0,0.5)",
                },
                {
                    prop: "herohealing",
                    znak: "HH",
                    bgcolor: "rgba(0,255,0,0.5)",
                },
            ].forEach(function(zi) {
                var order = mainHerosList.getHero(el.urlheroName).order[zi.prop];
                if (order <= 9) {
                    //if (mainHerosList.getHero(el.urlheroName)[zi.prop] >= mainHerosList.sumprop[zi.prop].avr) {
                    znak += $("<li>")
                        .attr("title", zi.prop + " " + order)
                        .css("background-color", zi.bgcolor)
                        .html(zi.znak)[0].outerHTML;
                }
            });
            let order = mainHerosList.getHero(el.urlheroName).order["winrate"]

            var line = $("<p>").append(
                "<span>" + order + "\t" + el.urlheroName + "</span>" +
                /*"<span>" + el.winrate.toFixed(2) + "</span>" +*/
                "<span>" + el.broDif.toFixed(2) + "</span>" +
                "<ul>" + znak + "</ul>");
            if (brobreak) {
                // line.addClass("bro-alredyExist");
            }
            line.attr("data-urlheroName", el.urlheroName);

            cont.append(line);

        });
    });
}