// ==UserScript==
// @name         Google Classroom Extended
// @namespace    https://classroom.google.com/
// @version      0.3
// @description  Расширяет возможности Google Classroom
// @author       SnakeMS
// @match        https://classroom.google.com/u/*/*/*
// @grant        unsafeWindow
// @updateURL    https://snakems.github.io/tm/GoogleClassroomExt.user.js
// ==/UserScript==

(function() {
    'use strict';
    var Config={
        Timeout:750,
        Targets:{
            TabLinks: "div[role='listitem']>a",
            ActiveTabClass: "eumXzf",
            ProgressBarClass: "r7E7Wc",
            DonnedTask: "li div.oC328b"
        }
    };
    var GCE={
        buttonsContainer: null,
        buttons:{
            hideDonned: null
        },
        init: function(){
            GCE.addButtons();
            GCE.setTabLinksEvents();
            console.log("GCE inited");
        },
        addButtons: ()=> {
            GCE.buttonsContainer=document.querySelector(Config.Targets.TabLinks).parentNode.parentNode.parentNode.nextSibling.firstChild;
            GCE.buttons.hideDonned=document.createRange().createContextualFragment('<div role="button" class="uArJ5e TuHiFd UQuaGc Y5sE8d"><div class="Fvio9d MbhUzd" jsname="ksKsZd"></div><div class="e19J0b CeoRYc"></div><span jsslot="" class="l4V7wb Fxmcue"><span class="NPEfkd RveJvd snByac">Скрыть выполненные</span></span></div>').firstChild;
            GCE.buttons.hideDonned.style.display="none";
            GCE.buttonsContainer.appendChild(GCE.buttons.hideDonned);
            GCE.buttons.hideDonned.addEventListener('click', () => {
                console.log('Hide donned tasks');
                GCE.hideAllDonnedTasks();
            });
        },
        hideAllDonnedTasks: () => {
            //Удаляем выполненные задачи
            [...unsafeWindow.document.querySelectorAll(Config.Targets.DonnedTask)].map(el => el.parentElement.parentElement.parentElement.parentElement).forEach(function(taskItem) {
                taskItem.remove();
            });
            //Удаляем пустые курсы
            [...document.querySelectorAll("li ol")].filter(el => el.childElementCount==0).map(el => el.parentElement.parentElement.parentElement.parentElement.parentElement).forEach(function(taskItem) {
                taskItem.remove();
            });
        },
        setTabLinksEvents:function(){
            var inputs = document.querySelectorAll(Config.Targets.TabLinks);
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].addEventListener('click', function() {
                    console.log("Selected Tab: "+this.text);
                    if(GCE.isTaskTab(this)){
                        console.log("Needed tab selected");
                        GCE.waitTaskTabLoad();
                    }else{
                        console.log("Tab not interested");
                    }
                });
                if(GCE.isTaskTab(inputs[i])){
                    console.log("Needed tab selected");
                    GCE.waitTaskTabLoad();
                }
            }
        },
        isTaskTab: function(el){
            return (el.text.indexOf("Задания")!=-1)
        },
        waitTaskTabLoad: function(){
            if([...document.querySelectorAll(Config.Targets.TabLinks+"."+Config.Targets.ActiveTabClass)].filter(e => e.innerText == "Задания").length!=0 && !document.body.classList.contains(Config.Targets.ProgressBarClass)){
                console.log("Tasks loaded");
                GCE.buttons.hideDonned.style.display="";
                GCE.applyStylesForTask();
            }else{
                setTimeout(GCE.waitTaskTabLoad, Config.Timeout);
            }
        },
        applyStylesForTask: () => {
            [...document.querySelectorAll("li.tfGBod")].filter(el => el.innerText.indexOf("Сегодня")!=-1).forEach((item) => {
                item.style['background-color']="darksalmon";
            });
            [...document.querySelectorAll("li.tfGBod")].filter(el => el.innerText.match(/Срок сдачи:\s\d{2}:\d{2}/i)).forEach((item) => {
                item.style['background-color']="darksalmon";
            });
            [...document.querySelectorAll("li.tfGBod")].filter(el => el.innerText.indexOf("Завтра")!=-1).forEach((item) => {
                item.style['background-color']="aquamarine";
            });
        }
    }
    setTimeout(loopMain, Config.Timeout);

    function loopMain () {
        if (document.querySelectorAll(Config.Targets.TabLinks).length==0) {
            setTimeout(loopMain, Config.Timeout);
        } else {
            GCE.init();
        }
    }

})();
