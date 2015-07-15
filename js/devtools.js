var devtools, Status, cola, Que, access, menuData,
    menuDevData, editing = 0, colas = [], view = 'all',
    currentSite, menu = [], activeMenu = 0, menuLoaded = false;

currentSite = 'responsive_template04';

var dropdown = {
    create: function(){
        $('.select-dropdown').select2({ minimumResultsForSearch: Infinity });
    }, destroy: function(){
        $('.select-dropdown').select2('destroy');
    }, setValue: function($select, value){
        $select.val(value).trigger('change');
    }
};

function convertToSlug(Text)
{
    return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
        ;
}

function createSlug(Text)
{
    if( menu.length > 0 )
    {
        var found = false, i;
        for( i=0; i<menu.length; i++ )
        {
            if( menu[i].id.toLowerCase() == convertToSlug(Text).toLowerCase() )
            {
                found = menu[i].id.toLowerCase();
            }
        }

        if( found !== false )
        {
            Text = Text + " " + menu.length + " " + ((new Date).getMilliseconds());
        }

    }

    Text = convertToSlug(Text);

    return Text;
}

var checkPluginState = function(){
    // console.log('check state');
    if(typeof nestedSortable!="undefined" && typeof devtools.inc!="undefined"){
        // console.log(typeof nestedSortable!="undefined", typeof devtools.inc!="undefined", "inside not undef");
        devtools.inc.bindMenuHandle('.editor ul');
    }else{
        setTimeout(checkPluginState,9);
    }
}

''.trim || (String.prototype.trim = // Use the native method if available, otherwise define a polyfill:
    function () { // trim returns a new string (which replace supports)
        return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,'') // trim the left and right sides of the string
    });

Status = {
    Statuss: function(){
        return $('.body').attr('class');
    }, quit: function(statusClass){
        $('.body').removeClass(statusClass);

        var sep = statusClass.split(" ");
        for(i=0; i<sep.length; i++){
            if(sep[i]=="stored"){
                Status.notify('Changes saved.');
            }
        }

        return this.Statuss();
    }, add: function(Status){
        if(Status==undefined){ Status = "ready"; }
        $('.body').addClass(Status);
        return this.Statuss();
    }, is: function(statusClass){
        return $('.body').hasClass(statusClass);
    }, notify: function(msg){
        var _id = ('noti_' + Math.random(0,10)).replace('.','');
        $('.notifications ul').append('<li id="' + _id + '"><a href="javascript:;" rel="close">&times;</a> ' + msg + '</li>');

        if(colas[_id]!=undefined){
            clearTimeout(colas[_id]);
        }

        colas[_id] = setTimeout(function(){
            var item = $('.notifications ul').find('li#'+_id); item.fadeOut(500, function(){
                item.remove();

                if($('.notifications ul li').length==0){
                    Status.quit("notify");
                }
            });
        }, 3000);

        if(!Status.is('notify')){
            Status.add("notify");
        }
    }
}

Que = function(callback, time){
    if(cola!=undefined){ clearTimeout(cola); }
    cola = setTimeout(function(){ callback() }, time);
}

devtools = {
    redirectTo: function(to){
        to = "#/" + to;
        window.location = to;
        return to;
    }, deniedAccess: function(){
        var isAccess = access==null ? true : access[0];
        return isAccess;
    }, events: function(){
        Status.add('ready');
        window.onload = function(){
            Status.add('loaded');
            Status.quit('loading');
        }

        $('.body').on('click', '.signinbtn', function(e){
            e.preventDefault(); e.stopPropagation();
            devtools.checkLogin();
        }).on('submit', '#signinform', function(e){
            e.preventDefault(); e.stopPropagation();
            devtools.checkLogin();
        }).on('keyup', function(e){
            // console.log(e.keyCode);
            if(e.keyCode==27){
                if(Status.is("open")){
                    Status.quit("open");
                    devtools.redirectTo("home");
                }else if(Status.is("editing")){
                    Status.quit("editing");
                    $('.menu-item > div').removeClass('active');
                }

            }
        });
    }, visitor: function(){
        this.events();

        if(this.deniedAccess()){
            this.redirectTo('settings/signin');
        }

        return true;
    }, activateServices: function(data){

        //load navigation options
        var rightNav = "";
        for(i=0; i<data.menu[0].length; i++){
            rightNav += '<li><a href="#/' + data.menu[0][i]['url'] + '">' + data.menu[0][i]['title'].toUpperCase() + '</a></li>';
        }
        $('.navigation .right-nav ul').html(rightNav);

        //load dependencies
        for(i=0; i<data.dependencies.length; i++){
            (function(){
                if(data.dependencies[i]['type'] == "text/javascript"){
                    var currentURL = data.dependencies[i]['url'];
                    var s = document.createElement("script");
                    s.type = "text/javascript";
                    s.src = currentURL;
                    $(".body").append(s);
                    if(currentURL.indexOf('devtools')>-1){
                        devtools.inc.init();
                    }
                }
            })();
        }


        //load settings
        var settingsnav = "" +
            "<div class='form-group'>" +
            "<select rel='deploy' class='form-control select-dropdown' style='min-width: 200px'>";
        for(i=0; i<data.menu[1].length; i++){
            settingsnav = settingsnav + ""
                + '<option value="' + data.menu[1][i]['title'] + '">' + data.menu[1][i]['hint'] + '</option>';
        }
        settingsnav = settingsnav + "</select></div><div class='form-group'><a href='javascript:;' class='btn btn-success' rel='deploybtn'>Deploy</a></div>"

        $('[data-layer="settings"]').append(settingsnav);

        $('.only-editor').show();
        dropdown.create();


    }, checkLogin: function(){
        //var info = [$(this).find('[name="username"]').val(), $(this).find('[name="password"]').val()];
        $.ajax({
            url: 'js/sign.json',
            type: 'post',
            success: function(data){
                // console.log(data);
                if(data.status == "Ok"){
                    devtools.activateServices(data);
                    access = [false, Math.random()];
                    // console.log(access);
                    devtools.redirectTo('home');
                    Status.add('signedin');
                    Status.quit('signedout');
                }else{
                    devtools.redirectTo("home");
                }

            }
        });
    }, setModal: function(modal){
        $('.layer-box[data-layer="' + modal + '"]').show().siblings().hide();
    }, loadMenu: function(){
        console.log("callback");
    }, setCookie: function(cname,cvalue){
        var exdays = 30;
        var d = new Date();
        d.setTime(d.getTime()+(exdays*24*60*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }, getCookie: function(cname){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++){
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return null;
    }
};








var home = function () {

    if( menu.length == 0 && menuLoaded ){
        devtools.redirectTo('settings/create');
        return false;
    }

    if(devtools.deniedAccess()){
        Status.quit('open');
        Que(function(){ devtools.redirectTo('settings/signin') },800);
    }else{
        Status.quit('open');
    }
};

var homeTabs = function(mode, tab){
    console.log(mode, tab);
}

var settings = function () {
    if(!devtools.deniedAccess()){
        devtools.setModal("settings");
        Status.add("open");
    }else{
        devtools.redirectTo("home");
    }
};
var insideSettings = function (modal) {
    if(modal=="signin"){
        devtools.setModal(modal);

        if(devtools.deniedAccess()){
            //Status.add('open');
        devtools.checkLogin();

        }else{
            Status.quit('open');
            devtools.redirectTo('home');
        }
    }else if(modal=="signout"){
        devtools.setModal(modal);
        if(!devtools.deniedAccess()){
            Status.add('open');
            Que(function(){
                Status.quit('open');
                Que(function(){
                    window.location.reload();
                }, 800);
            }, 1200);
        }else{
            Status.quit("open");
        }
    }else if(modal=="create"){

        $('#menuName').val('');
        $('#menuId').val('');

        devtools.setModal(modal);
        Status.add('open');

    }else if(modal=="menu"){

        $('#menuNameEdited').val( $('.editor > ul.active').attr('data-name') );
        $('#menuIdEdited').val($('.editor > ul.active').attr('data-id') );
        $('#menuTypeEdited').val($('.editor > ul.active').attr('data-type')).trigger('change');
        $('#menuPublishedEdited').val($('.editor > ul.active').attr('data-published')).trigger('change');

        devtools.setModal(modal);
        Status.add('open');

    }else if(modal=="preview"){
        devtools.setModal(modal);
        if(!devtools.deniedAccess()){
            Status.add('open');

            devtools.inc.previewMenu(view);

        }else{
            Status.quit("open");
        }
    }
};

var insideSettingsEdit = function(modal){
    devtools.setModal("edit");
    if(!devtools.deniedAccess()){
        Status.add("open");
        var name = $('[rel="name"]').val();
        name = name.toLowerCase() == "item title" ? "" : name;
        $('.itemcurrenttitle').text(name).trigger('change keyup keydown keypress');

        $('.itemcurrenttype').text($('[rel="type"]').text());

        if($('[rel="type"]').text()=="link"){
            $('.filtertabs a').eq(1).trigger('click');

            $('#curl_title').val($('[rel="name"]').val());
            $('#curl_url').val($('[rel="url"]').val());
        }else{
            $('.filtertabs a').eq(0).trigger('click');

            $('#search').val($('[rel="name"]').val());

            $('#curl_title').val("");
            $('#curl_url').val("");

        }
    }else{
        Status.quit("open");
        devtools.redirectTo("home");
    }
}

var routes = {
    '/home': home,
    '/home/:mode/edit/:tab': homeTabs,
    '/settings': settings,
    '/settings/:modal': insideSettings,
    '/settings/edit/:modal': insideSettingsEdit
};

var router = Router(routes);
router.init();



Status.add('loading signedout');
$(document).on('ready', function(){
    devtools.visitor();
}).ajaxStart(function(){
    Status.add("loading");
}).ajaxComplete(function(){
    Que(function(){ Status.quit("loading"); }, 500);
});