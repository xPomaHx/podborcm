;
var mainHerosList = [];
mainHerosList.banlist = [];
mainHerosList.ourpick = [];
mainHerosList.theypick = [];
mainHerosList.weekpick = [];
mainHerosList.counterpick = [];
mainHerosList.strongpick = [];
$.ajaxSetup({
    crossDomain: true,
});

mainHerosList.download = function () {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: homeurl + "getlastdb.php",
            method: "get",
            crossDomain: true,
        }).done((data) => {
            Object.assign(mainHerosList, JSON.parse(data));
            mainHerosList.prependData();
            mainHerosList.renderAllHeroList();
            resolve();
        }).fail(error => reject(error));
    });
}
mainHerosList.update = function () {
    return new Promise(function (resolve, reject) {
        function getAllyHero(keyhero) {
            return new Promise(function (resolve, reject) {
                var i = 0;
                var l = mainHerosList.length;
                var p = 0;
                var pmax = 10;
                var anti = [];
                fn(i);
                var intervallog = setInterval(function () { }, 2222);

                function fn(ii) {
                    $(".update").html(i + "/" + l);
                    var url = "https://www.dotabuff.com/heroes/" + mainHerosList[ii].urlheroName + "/counters?date=week";
                    p++;
                    $.ajax({
                        method: "get",
                        url: homeurl + "HttpCrosGet.php",
                        data: { url: url },
                        success: function (data) {

                            p--;
                            anti = mainHerosList.getOtherherosList(data);
                            mainHerosList[ii][keyhero] = anti;
                            for (var n = p; n < pmax; n++) {
                                i++;
                                if (i < l) {
                                    fn(i);
                                }
                            }
                            if (p == 0 && i >= l) {
                                clearInterval(intervallog);
                                resolve();
                                $(".update").html("done");
                            }
                        }
                    });
                }
            });
        };
        $(".update").prop("disabled", true);

        $.when(
            $.ajax({
                method: "get",
                url: homeurl + "HttpCrosGet.php",
                data: { url: "https://www.dotabuff.com/heroes/played?date=week" }
            }), $.ajax({
                method: "get",
                url: homeurl + "HttpCrosGet.php",
                data: { url: "https://www.dotabuff.com/heroes/lanes?lane=mid&date=week" }
            }), $.ajax({
                method: "get",
                url: homeurl + "HttpCrosGet.php",
                data: { url: "https://www.dotabuff.com/heroes/lanes?lane=off&date=week" }
            }), $.ajax({
                method: "get",
                url: homeurl + "HttpCrosGet.php",
                data: { url: "https://www.dotabuff.com/heroes/lanes?lane=safe&date=week" }
            }), $.ajax({
                method: "get",
                url: homeurl + "HttpCrosGet.php",
                data: { url: "https://www.dotabuff.com/heroes/lanes?lane=jungle&date=week" }
            }), $.ajax({
                method: "get",
                url: homeurl + "HttpCrosGet.php",
                data: { url: "https://www.dotabuff.com/heroes/impact?date=week" }
            }), $.ajax({
                method: "get",
                url: homeurl + "HttpCrosGet.php",
                data: { url: "https://www.dotabuff.com/heroes/economy?date=week" }
            }), $.ajax({
                method: "get",
                url: homeurl + "HttpCrosGet.php",
                data: { url: "https://www.dotabuff.com/heroes/farm?date=week" }
            }), $.ajax({
                method: "get",
                url: homeurl + "HttpCrosGet.php",
                data: { url: "https://www.dotabuff.com/heroes/damage?date=week" }
            }),
        )
            .done(function (winrate, midlane, offlane, safelane, jungl, gameimpact, economic, farm, demage) {
                debugger;
                mainHerosList.getMainHerosList(winrate, midlane, offlane, safelane, jungl, gameimpact, economic, farm, demage);
                getAllyHero("anti").then(() => {
                    mainHerosList.saveData();
                    $(".update").prop("disabled", false);
                });

            });
    });
};
mainHerosList._select = "abaddon";
mainHerosList.select = function (name) {
    if (!name) return this._select;
    this._select = name;
}
var hero = function () {
    this.urlheroName = "none";
    this.winrate = 0;
    this.pickrate = 0;
    this.effect = 0;
    this.heroName = "none";
    this.imgurl = "none";
    this.ally = [];
    this.comb = [];
}
mainHerosList.getMainHerosList = function (winrate, midlane, offlane, safelane, jungl, gameimpact, economic, farm, demage) {
    var that = this;
    this.length = 0;
    var dataline;
    var parser = new DOMParser();
    var prepend = function (data) {
        var doc = parser.parseFromString(data, "text/html");
        return $(".sortable tbody tr", doc);
    }
    var templist = {};
    winrate = prepend(winrate);
    midlane = prepend(midlane);
    offlane = prepend(offlane);
    safelane = prepend(safelane);
    jungl = prepend(jungl);
    gameimpact = prepend(gameimpact);
    economic = prepend(economic);
    farm = prepend(farm);
    demage = prepend(demage);
    winrate.each(function (i, el) {
        var urlheroName = $(el).find(".link-type-hero").attr("href").replace("/heroes/", "").replace("\')", "");
        templist[urlheroName] = {};
        templist[urlheroName].urlheroName = urlheroName;
        templist[urlheroName].pickrate = +$(el).find("td:nth-child(3)").attr("data-value").replaceAll(",", "");
        templist[urlheroName].winrate = +$(el).find("td:nth-child(5)").attr("data-value").replaceAll(",", "");
        templist[urlheroName].heroName = urlheroName;
        templist[urlheroName].imgurl = "https://www.dotabuff.com" + $(el).find(".image-hero").attr("src");
    });
    midlane.each(function (i, el) {
        var urlheroName = $(el).find(".link-type-hero").attr("href").replace("/heroes/", "").replace("\')", "");
        templist[urlheroName].midlane = +$(el).find("td:nth-child(3)").attr("data-value").replaceAll(",", "");
    });
    offlane.each(function (i, el) {
        var urlheroName = $(el).find(".link-type-hero").attr("href").replace("/heroes/", "").replace("\')", "");
        templist[urlheroName].offlane = +$(el).find("td:nth-child(3)").attr("data-value").replaceAll(",", "");
    });
    safelane.each(function (i, el) {
        var urlheroName = $(el).find(".link-type-hero").attr("href").replace("/heroes/", "").replace("\')", "");
        templist[urlheroName].safelane = +$(el).find("td:nth-child(3)").attr("data-value").replaceAll(",", "");
    });
    jungl.each(function (i, el) {
        var urlheroName = $(el).find(".link-type-hero").attr("href").replace("/heroes/", "").replace("\')", "");
        templist[urlheroName].jungl = +$(el).find("td:nth-child(3)").attr("data-value").replaceAll(",", "");
    });
    gameimpact.each(function (i, el) {
        var urlheroName = $(el).find(".link-type-hero").attr("href").replace("/heroes/", "").replace("\')", "");
        templist[urlheroName].kills = +$(el).find("td:nth-child(4)").attr("data-value").replaceAll(",", "");
        templist[urlheroName].deaths = +$(el).find("td:nth-child(5)").attr("data-value").replaceAll(",", "");
        templist[urlheroName].assists = +$(el).find("td:nth-child(6)").attr("data-value").replaceAll(",", "");
        templist[urlheroName].matchduration = +$(el).find("td:nth-child(7)").attr("data-value").replaceAll(",", "");
    });
    economic.each(function (i, el) {
        var urlheroName = $(el).find(".link-type-hero").attr("href").replace("/heroes/", "").replace("\')", "");
        templist[urlheroName].gpm = +$(el).find("td:nth-child(3)").attr("data-value").replaceAll(",", "");
        templist[urlheroName].epm = +$(el).find("td:nth-child(4)").attr("data-value").replaceAll(",", "");
    });
    farm.each(function (i, el) {
        var urlheroName = $(el).find(".link-type-hero").attr("href").replace("/heroes/", "").replace("\')", "");
        templist[urlheroName].lasthits = +$(el).find("td:nth-child(3)").attr("data-value").replaceAll(",", "");
        templist[urlheroName].denies = +$(el).find("td:nth-child(4)").attr("data-value").replaceAll(",", "");
    });
    demage.each(function (i, el) {
        var urlheroName = $(el).find(".link-type-hero").attr("href").replace("/heroes/", "").replace("\')", "");
        templist[urlheroName].herodamage = +$(el).find("td:nth-child(3)").attr("data-value").replaceAll(",", "");
        templist[urlheroName].towerdamage = +$(el).find("td:nth-child(4)").attr("data-value").replaceAll(",", "");
        templist[urlheroName].herohealing = +$(el).find("td:nth-child(5)").attr("data-value").replaceAll(",", "");
    });
    debugger;
    for (var key in templist) {
        that.push(templist[key]);
    }
}
mainHerosList.getOtherherosList = function (data) {
    var OtherherosList = [];
    var parser = new DOMParser();
    var doc = parser.parseFromString(data, "text/html");
    var dataline = $(".sortable tbody tr", doc);
    dataline.each(function (i, el) {
        var urlheroName = $(el).attr("data-link-to").replace("/heroes/", "").replace("\')", "");
        var effect = +$(el).find("td:nth-child(3)").attr("data-value").replaceAll(",", "");
        var winrate = +$(el).find("td:nth-child(4)").attr("data-value").replaceAll(",", "");
        var pickrate = +$(el).find("td:nth-child(5)").attr("data-value").replaceAll(",", "");
        OtherherosList.push({ urlheroName: urlheroName, winrate: winrate, pickrate: pickrate, effect: effect, });
    });
    return OtherherosList;
}
mainHerosList.saveData = function () {
    $.ajax({
        method: "post",
        url: homeurl + "save.php",
        data: { data: JSON.stringify(mainHerosList) },
        success: function (data) {
            console.log("Сохранение успешно!");
        }
    });
}
mainHerosList.prependData = function () {
    var maxProp = function (prop) {
        var tempArr = [];
        mainHerosList.forEach(function (el, i) {
            el.anti.forEach(function (el, i) { tempArr.push(el[prop]); });
        });
        return Math.max.apply(null, tempArr);
    }
    var minProp = function (prop) {
        var tempArr = [];
        mainHerosList.forEach(function (el, i) {
            el.anti.forEach(function (el, i) { tempArr.push(el[prop]); });
        });
        return Math.min.apply(null, tempArr);
    }
    var avrProp = function (prop) {
        var tempArr = 0;
        mainHerosList.forEach(function (el, i) {

            tempArr += (el[prop]);

        });
        return tempArr / mainHerosList.length;
    }
    this.sumprop = {};
    this.forEach(function (el, i) {
        el.order = {};
    });
    ["pickrate",
        "winrate",
        "midlane",
        "offlane",
        "safelane",
        "jungl",
        "kills",
        "deaths",
        "assists",
        "matchduration",
        "gpm",
        "epm",
        "lasthits",
        "denies",
        "herodamage",
        "towerdamage",
        "herohealing",
    ].forEach((prop) => {
        this.sumprop[prop] = {};
        this.sumprop[prop].max = maxProp(prop);
        this.sumprop[prop].avr = avrProp(prop);
        this.sumprop[prop].min = minProp(prop);

        this.orderBy(prop, true);
        this.forEach(function (hero, i) {
            hero.order[prop] = i;
        });
    });

    this.orderBy("urlheroName");
    this.allHeroName = [];
    this.forEach((el, i) => {
        this.allHeroName.push(el.urlheroName);
    });
};
mainHerosList.orderBy = function (prop, reverse = false) {
    if (!reverse) {
        this.sort(function (a, b) {
            if (!(prop in a)) { return 1 }
            if (a[prop] > b[prop]) {
                return 1;
            } else {
                return -1;
            }
        });
    } else {
        this.sort(function (a, b) {
            if (!(prop in a)) { return 1 }
            if (a[prop] < b[prop]) {
                return 1;
            } else {
                return -1;
            }
        });
    }
}
mainHerosList.countHeroList = function (prop, herolist, action) {
    var tarr = [];
    herolist.forEach(function (hname, i) {
        var hero = mainHerosList.getHero(hname)[prop];
        if (action !== "-") {
            tarr = mainHerosList.CalcHeroList(hero, tarr, "+")
        } else {
            tarr = mainHerosList.CalcHeroList(hero, tarr, "-")
        }
    });
    tarr.forEach((hero) => {
        hero.broDif = mainHerosList.getHero(hero.urlheroName).winrate - (hero.winrate / herolist.length);
    });
    return tarr;
}

mainHerosList.CalcHeroList = function (arr1, arr2, action) {
    function calcHero(hero1, hero2) {
        var hero3 = {};
        var hero1 = hero1 || new hero();
        var hero2 = hero2 || new hero();
        hero3.urlheroName = hero1.urlheroName;
        hero3.winrate = hero1.winrate + hero2.winrate;
        hero3.pickrate = hero1.pickrate + hero2.pickrate;
        hero3.effect = hero1.effect + hero2.effect;
        hero3.broAttr1 = hero1.broAttr1 + hero2.broAttr1;
        return hero3;
    }

    function disCalcHero(hero1, hero2) {
        var hero3 = {};
        var hero1 = hero1 || new hero();
        var hero2 = hero2 || new hero();
        hero3.urlheroName = hero1.urlheroName;
        hero3.winrate = hero1.winrate + (100 - hero2.winrate);
        hero3.pickrate = hero1.pickrate - hero2.pickrate;
        hero3.effect = hero1.effect - hero2.effect;
        hero3.broAttr1 = hero1.broAttr1 - hero2.broAttr1;
        return hero3;
    }
    var arr2 = arr2 || [];
    if (arr2.length < 1) {
        return arr1;
    }
    var tarr = [];
    if (arr1.length < 1) {
        arr2.forEach(function (hero2) {
            var hero2 = hero2;
            hero2.winrate = 100 - hero2.winrate;
            tarr.push(hero2);
        });
        return tarr;
    }

    arr1.forEach(function (hero1) {
        var hero2 = mainHerosList.getHero(hero1.urlheroName, arr2);
        if (action !== "-") {
            tarr.push(calcHero(hero1, hero2));
        } else {
            tarr.push(disCalcHero(hero1, hero2));
        }
    });
    return tarr;
}
mainHerosList.getHero = function (hname, arr) {
    var arr = arr || [];
    if (arr.length < 1) { arr = mainHerosList; }
    var hero = arr.find(function (el) {
        return el.urlheroName === hname;
    });
    return hero;
}
mainHerosList.mainCalc = function () {
    var heroListSort = function (a, b) {
        if (a.broDif < b.broDif) {
            return 1
        } else {
            return -1
        };
    };
    this.weekpick = this.countHeroList("anti", this.ourpick, "+").sort(heroListSort);
    this.counterpick = this.countHeroList("anti", this.theypick, "+").sort(heroListSort);
    this.strongpick = this.countHeroList("anti", this.banlist, "+").sort(heroListSort);

}