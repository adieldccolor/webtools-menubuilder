var devtools, Status, cola, Que, access, menuData,
    menuDevData, editing = 0, colas = [], view = 'all',
    currentSite, menu = [], activeMenu = 0, menuLoaded = false, isNewItem = false;



var itemData = {};

currentSite = 'responsive_template04';


$.fn.miniTip = function(){
    $element = $(this);

    $element.each(function(){
        $current = $(this);

        $current.prepend('<div class="t-c"><div class="t-w">' + $current.attr('title') + '</div></div>');
        $current.addClass('has-minitip').removeAttr('title');
    });
}








/* =ParseItem */
function parseItem(item){

    var contentNumber = item.attr('data-value'),
        isContent = contentNumber != "" && item.attr('data-type') == "page";

    itemData = {
        name: item.text().toLowerCase() == "item title" ? "" : item.text(),
        link: {
            isContent: isContent,
            url: isContent ? "{{link}}&pageid=" + contentNumber : item.attr('data-link'),
            content: {
                id: contentNumber,
                name: item.attr('data-original-title')
            },
            type: item.attr('data-type') != "" ? item.attr('data-type') : 'link',
            target: item.attr('data-target') == "true"
        },
        filter: {
            isCorporate: item.attr('data-showcorporate') == "true",
            isBranch: item.attr('data-showbranch') == "true",
            isLosite: item.attr('data-showlosite') == "true"
        }
    };

    return itemData;
}




function getParsedItem(){

    var name = $('[rel="name"]').val(),
        url = $('#link-url').val(),
        value = $('#link').val(),
        original_title = $('.select2-selection__rendered').text(),
        type = value != "" ? "page" : 'link',
        target = $('[rel="target"] input[type="checkbox"]').is(":checked"),
        showcorporate = $('[rel="showcorporate"] input[type="checkbox"]').is(":checked"),
        showbranch = $('[rel="showbranch"] input[type="checkbox"]').is(":checked"),
        showlosite = $('[rel="showlosite"] input[type="checkbox"]').is(":checked"),
        isContent = $('#link-type').is(':checked');


    itemData = {
        id: editing,
        name: name,
        link: {
            isContent: isContent,
            url: isContent ? "{{link}}&pageid=" + value : url,
            content: {
                id: value,
                name: original_title
            },
            type: type,
            target: target
        },
        filter: {
            isCorporate: showcorporate,
            isBranch: showbranch,
            isLosite: showlosite
        }
    };

    return itemData;
}











/* =Dropdown */
var dropdown = {


    formatResult: function (repo) {
        if (repo.loading) return repo.text;

        var markup = repo.name;

        return markup;
    }, formatSelection: function(repo){
        return repo.name || repo.text;
    },

    create: function(){
        $('.select-dropdown').not('.with-search').select2({ minimumResultsForSearch: Infinity });

        $('.select-dropdown.with-search').select2({
            ajax: {
                url: "contents.php",
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term, // search term
                        page: params.page
                    };
                },
                processResults: function (data, page) {
                    // parse the results into the format expected by Select2.
                    // since we are using custom formatting functions we do not need to
                    // alter the remote JSON data


                    return {
                        results: (function(data){

                            var d = [];

                            for(var i=0; i<data.length; i++){
                                d.push({name: data[i].Content.Name, id: data[i].Content.Number});
                            }

                            return d;

                        })(data)
                    };
                },
                cache: true
            },
            minimumInputLength: 1,
            templateResult: dropdown.formatResult,
            templateSelection: dropdown.formatSelection
        });
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
    devtools.inc.bindMenuHandle('.editor ul');

    $('.has-tooltip').miniTip();
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
                //Status.notify('Changes saved.');
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
    },

















    inc: {
        init: function(){
            // console.log('init');
            devtools.inc.loadMenu();
            devtools.inc.events();

        }, bindMenuHandle: function(item){
            $(item).nestedSortable({
                handle: 'div',
                listType: 'ul',
                items: 'li',
                placeholder: "ui-sortable-placeholder",
                helper:	'clone',
                isTree: true,
                toleranceElement: '> div',
                maxLevels: 2,
                opacity: .3,
                revert: 100
            });
            $(item).on('sortupdate', function(ui,event){

                updateMenuOnTheFly();


                console.log(ui,event);
            });

        }, returnData: function(id){
            var data = {};

            var item = $('.editor').find('.item-title[data-id="' + id + '"]').first();

            if(item.length > 0){
                data = {
                    "name": item.text(),
                    "url": item.attr('data-link'),
                    "target": item.attr('data-target') == "true",
                    "id": item.attr('data-id'),
                    "showcorporate": item.attr('data-showcorporate') == "true",
                    "showbranch": item.attr('data-showbranch') == "true",
                    "showlosite": item.attr('data-showlosite') == "true",
                    "type": item.attr('data-type'),
                    "original_title": item.attr('data-original-title'),
                    "value": item.attr('data-value'),
                    "parent_id": "",
                    "index": 0,
                    "subtree": []
                }
            }

            // console.log(data);
            return data;
        }, previewMenu: function(view){

            var m = devtools.inc.parseTree($('.editor > ul.active > li > div > .item-title')),
                mm = "";
            m = parseMenuTree(m, function(){}, true);
            //m = menuDevData;

            //m = m.data;
            m = menu[activeMenu].data;
            console.log('parseMenuTree preview', m);


            for(var i=0; i<m.length; i++){


                m[i].url = m[i].url.replace(/{{link}}/g, "default.aspx?s=site");

                //show corporate
                if(view=='corporate'&&m[i].showcorporate){
                    var hassubtree = m[i].subtree!=undefined&&m[i].subtree.length>0;
                    mm += '<li id="' + m[i].id + '" ' + (hassubtree?'class="dropdown"':'') + ' >';
                    mm += '<a href="' + m[i].url + '" ' + (m[i].target ? 'target="_blank"':'') + ' '
                        + (hassubtree?'class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"':'')
                        + '>' + m[i].name + (hassubtree?' <span class="caret"></span>':'') + '</a>';
                    if(hassubtree){
                        mm += '<ul class="dropdown-menu" role="menu">';

                        for(0; x<m[i].subtree.length; x++){
                            m[i].subtree[x].url = m[i].subtree[x].url.replace(/{{link}}/g, "default.aspx?s=site");
                            mm += '<li><a href="' + m[i].subtree[x].url + '" ' + (m[i].subtree[x].target ? 'target="_blank"':'') + '>'
                                + m[i].subtree[x].name + '</a></li>';
                        }

                        mm += '</ul>';
                    }
                }else if(view=='losite'&&m[i].showlosite){
                    var hassubtree = m[i].subtree!=undefined&&m[i].subtree.length>0;
                    mm += '<li id="' + m[i].id + '" ' + (hassubtree?'class="dropdown"':'') + ' >';
                    mm += '<a href="' + m[i].url + '" ' + (m[i].target ? 'target="_blank"':'') + ' '
                        + (hassubtree?'class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"':'') + '>'
                        + m[i].name + (hassubtree?' <span class="caret"></span>':'') + '</a>';
                    if(hassubtree){
                        mm += '<ul class="dropdown-menu" role="menu">';

                        for(x=0; x<m[i].subtree.length; x++){
                            m[i].subtree[x].url = m[i].subtree[x].url.replace(/{{link}}/g, "default.aspx?s=site");
                            mm += '<li><a href="' + m[i].subtree[x].url + '" ' + (m[i].subtree[x].target ? 'target="_blank"':'') + '>'
                                + m[i].subtree[x].name + '</a></li>';
                        }

                        mm += '</ul>';
                    }
                }else if(view=='branch'&&m[i].showbranch){
                    var hassubtree = m[i].subtree!=undefined&&m[i].subtree.length>0;
                    mm += '<li id="' + m[i].id + '" ' + (hassubtree?'class="dropdown"':'') + ' >';
                    mm += '<a href="' + m[i].url + '" ' + (m[i].target ? 'target="_blank"':'') + ' '
                        + (hassubtree?'class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"':'') + '>'
                        + m[i].name + (hassubtree?' <span class="caret"></span>':'') + '</a>';
                    if(hassubtree){
                        mm += '<ul class="dropdown-menu" role="menu">';

                        for(x=0; x<m[i].subtree.length; x++){
                            m[i].subtree[x].url = m[i].subtree[x].url.replace(/{{link}}/g, "default.aspx?s=site");
                            mm += '<li><a href="' + m[i].subtree[x].url + '" ' + (m[i].subtree[x].target ? 'target="_blank"':'') + '>'
                                + m[i].subtree[x].name + '</a></li>';
                        }

                        mm += '</ul>';
                    }
                }else if(view=='all'){
                    var hassubtree = m[i].subtree!=undefined&&m[i].subtree.length>0;
                    mm += '<li id="' + m[i].id + '" ' + (hassubtree?'class="dropdown"':'') + ' >';
                    mm += '<a href="' + m[i].url + '" ' + (m[i].target ? 'target="_blank"':'') + ' '
                        + (hassubtree?'class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"':'') + '>'
                        + m[i].name + (hassubtree?' <span class="caret"></span>':'') + '</a>';
                    if(hassubtree){
                        mm += '<ul class="dropdown-menu" role="menu">';

                        for(x=0; x<m[i].subtree.length; x++){
                            m[i].subtree[x].url = m[i].subtree[x].url.replace(/{{link}}/g, "default.aspx?s=site");
                            mm += '<li><a href="' + m[i].subtree[x].url + '" ' + (m[i].subtree[x].target ? 'target="_blank"':'')
                                + '>' + m[i].subtree[x].name + '</a></li>';
                        }

                        mm += '</ul>';
                    }
                }



            }

            $('.preview-screen [role="navigation"] ul').html(mm);





        }, parseTree: function(ul){
            var tags = [],
                _self = this,
                data = [],
                id = 0;
            // ul.each(function(_index){
            for(var i=0; i<ul.length; i++){
                data = [];
                var subtree = ul.eq(i).closest('li').find('ul').find('li').find('.item-title');
                id = ul.eq(i).attr('data-id');
                data = devtools.inc.returnData(id);
                data.index = i;
                data.parent_id = "";

                console.log(data);

                /* do not generate subtree, but push items as first level with parent reference
                 if(subtree.length > 0){
                 // alert("has subitems");
                 // alert(subtree.length);
                 // alert(data.toString());
                 var subtreetags = [];
                 for(x=0; x<subtree.length; x++){
                 subtreetags.push(devtools.inc.returnData(subtree.eq(x).attr('data-id')));
                 }
                 // data.subtree = devtools.inc.parseTree(subtree);
                 data.subtree = subtreetags;

                 }else{
                 // alert(data.toString(), "has not subitems");
                 }*/

                if( subtree.length > 0 )
                {
                    for( var x=0; x<subtree.length; x++ ){
                        var children = devtools.inc.returnData(subtree.eq(x).attr('data-id'));
                        children.parent_id = id;
                        children.index = x;
                        console.log(children);
                        tags.push(children);
                    }
                }



                tags.push(data);

                // });
            }

            console.log('returning tags from parseTree', tags);

            // return data;
            return tags;
        }, editItem: function(id,append){

            var found = $('.editor .item-title[data-id="' + id + '"]').length > 0,
                item = $('.editor .item-title[data-id="' + id + '"]');
            append = append!=undefined ? append : false;
            var $itemEditor = $('.item-editor');

            if(found){

                // console.log(menuData[editIndex]);

                var data = parseItem(item);

                $itemEditor.find('[rel="name"]').val(data.name);
                $itemEditor.find('[rel="url"]').val(data.link.url);
                $itemEditor.find('[rel="value"]').val(data.link.content.id);
                $itemEditor.find('[rel="original_title"]').text(data.link.content.name);
                $itemEditor.find('[rel="type"]').text(data.link.type);




                function appendOption(data){
                    var $link = $('#link');
                    var hasOption = $link.find('option[value="' + data.link.content.id + '"]').length > 0;
                    if( !hasOption ){
                        $link.append('<option value="' + data.link.content.id + '">' + data.link.content.name + '</option>');
                    }

                    $link.val(data.link.content.id).trigger('change');
                }



                /* RESET ALL CHECKS */
                /* =Reset target checkbox */
                $('[rel="target"] input').attr('checked', false).prop('checked', false).trigger('change');

                /* =Reset corporate filter */
                $('[rel="showcorporate"] input').attr('checked', false).prop('checked', false).trigger('change');

                /* =Reset branch filter */
                $('[rel="showbranch"] input').attr('checked', false).prop('checked', false).trigger('change');

                /* =Reset losite filter */
                $('[rel="showlosite"] input').attr('checked', false).prop('checked', false).trigger('change');

                /* =Reset content checbox */
                $('#link-type').attr('checked', false).prop('checked', false).trigger('change');




                if(data.link.target){
                    $('[rel="target"] input').attr('checked', true).prop('checked', true).trigger('change');
                }

                if(data.filter.isCorporate){
                    $('[rel="showcorporate"] input').attr('checked', true).prop('checked', true).trigger('change');
                }

                if(data.filter.isBranch){
                    $('[rel="showbranch"] input').attr('checked', true).prop('checked', true).trigger('change');
                }

                if(data.filter.isLosite){
                    $('[rel="showlosite"] input').attr('checked', true).prop('checked', true).trigger('change');
                }


                if(data.link.isContent){
                    $('#link-type').attr('checked', true).prop('checked', true).trigger('change');
                    appendOption(data);
                }


                $('[rel="editlink"]').attr('href', '#/settings/edit/' + id);


                editing = id;


                return true;

            }else{









                //create new item
                console.log("not found", "create new one");

                var _id = 'menu_' + Math.random(0,10);
                _id = _id.replace(".",'');
                var newItem = '<li class="menu-item"><div><span class="clearfix"></span><div class="opt tooltip-item move-children" title="Move to first level"><span class="devicons icon-move-children-top"></span></div><div class="sort tooltip-item" title="Drag to move"><i class="devicons icon-move-icon"></i></div> <span data-link="{{link}}" class="item-title" data-target="false" data-value="0" data-type="common" data-showbranch="true" data-showcorporate="true" data-showlosite="true" data-original-title="Home" data-id="' + _id + '">Item title</span><div class="opt-group"><a href="javascript:;" class="btn-add opt nofloat" data-id="' + _id + '"><i class="icon-add devicons"></i></a><a href="javascript:;" class="edit-it opt nofloat" data-id="' + _id + '"><i class="icon-edit devicons"></i></a><a href="javascript:;" class="remove-it opt nofloat" data-id="' + _id + '"><i class="devicons icon-remove"></i></a></div></div></li>';

                editing = _id;
                if(append){
                    $('.editor > ul.active').append(newItem);
                }else{
                    $('.editor > ul.active').prepend(newItem);
                }


                var $editBtn = $('.edit-it[data-id="' + editing + '"]');
                $editBtn.addClass('is-new');
                $editBtn.trigger('click');

                $('[rel="editlink"]').attr('href', '#/settings/edit/' + _id);




                $itemEditor.find('[rel="name"]').val("");
                $itemEditor.find('[rel="url"]').val("{{link}}");
                $itemEditor.find('[rel="value"]').val("0");
                $itemEditor.find('[rel="original_title"]').text("Home");


                /* =Reset target checkbox */
                $('[rel="target"] input').attr('checked', false).prop('checked', false).trigger('change');

                /* =Reset corporate filter */
                $('[rel="showcorporate"] input').attr('checked', false).prop('checked', false).trigger('change');

                /* =Reset branch filter */
                $('[rel="showbranch"] input').attr('checked', false).prop('checked', false).trigger('change');

                /* =Reset losite filter */
                $('[rel="showlosite"] input').attr('checked', false).prop('checked', false).trigger('change');

                /* =Reset content checbox */
                $('#link-type').attr('checked', false).prop('checked', false).trigger('change');



                return false;
            }
            $('.minitabs li').first().find('a').trigger('click');
            $('.item-editor [rel="name"]').trigger('focus');
        }, firstTimeMenu: function(){
            alert("Trying to find menu settings in DB we found that the table content is being " +
                "used for something else, do you want to erase the content and format to use it to save menu settings?");
            devtools.redirectTo('settings/create');
        }, toggleMenus: function(){
            var value = $('#menu').val(),
                id = $('#menu option[value="' + value + '"]').attr('data-id'),
                published = $('.editor ul[data-id="' + id + '"]').attr('data-published') == "true";

            log('pubished', published);

            $('.editor > ul').removeClass('active');
            $('.editor > ul[data-id="' + id + '"]').addClass('active');

            $('#published').prop('checked', published).trigger('change');


            for(var i=0; i<menu.length; i++)
            {
                if(menu[i].id == id)
                {
                    activeMenu = i;
                }
            }

        }, loadMenu: function(){
            // console.log(menuData);
            var _self = this;
            var enableMenu = false;



            $.ajax({
                url: "get.php?id=90&json=true&s=" + currentSite,
                success: function(res){
                    // console.log(res);
                    menuLoaded = true;

                    if(typeof res != "object"){
                        console.log("Menu from CRM is empty.");
                        devtools.inc.firstTimeMenu();
                    }else{
                        menuData = res[activeMenu].data;
                        menuDevData = res[activeMenu].data;
                        menu = res;
                        // console.log(menuData);
                        console.log("Menu from CRM is loaded successfully.");
                        function generateMenu(){
                            setTimeout(function(){
                                devtools.inc.genMenu();
                            }, 500);
                            return true;
                        }

                        menu[activeMenu].data = parseMenuTree(menu, generateMenu);
                    }
                }
            });
        },
        generateSingleMenu: function(index){
            // console.log(menuData[0].name);
            var items = "";

            menu[index].data = parseMenuTree(menu[index].data, function(){}, true);

            menuData = menu[index].data;
            for(i=0;i<menuData.length;i++){
                // console.log(menuData[i].name);
                menuData[i].target = menuData[i].target.length==0 ? "default" : menuData[i].target;
                menuData[i].value = menuData[i].value!=undefined ? menuData[i].value : "";

                if(menuData[i].type=="link"){
                    menuData[i].url = menuData[i].url.indexOf('//')>-1 || menuData[i].url.indexOf('://')>-1 || menuData[i].url.indexOf('http')>-1 ? menuData[i].url : "http://" + menuData[i].url;
                }else{
                    //menuData[i].url = menuData[i].url.replace('https://','http://');
                }
                items += '<li class="menu-item"><div><span class="clearfix"></span>' +
                    '<div class="opt tooltip-item move-children" title="Move to first level">' +
                    '<span class="devicons icon-move-children-top"></span></div>' +
                    '<div class="sort tooltip-item" title="Drag to move"><i class="devicons icon-move-icon"></i></div> ' +
                    '<span data-link="' + menuData[i].url + '" class="item-title" data-target="' + menuData[i].target + '" data-id="' + menuData[i].id + '" data-value="' + menuData[i].value + '" data-type="' + menuData[i].type + '" data-showbranch="' + menuData[i].showbranch + '" data-showcorporate="' + menuData[i].showcorporate + '" data-showlosite="' + menuData[i].showlosite + '" data-original-title="' + menuData[i].original_title + '">' + menuData[i].name + '</span><div class="opt-group"><a href="javascript:;" class="btn-add opt nofloat" data-id="' + menuData[i].id + '"><i class="icon-add devicons"></i></a><a href="javascript:;" class="edit-it opt nofloat" data-id="' + menuData[i].id + '"><i class="icon-edit devicons"></i></a><a href="javascript:;" class="remove-it opt nofloat" data-id="' + menuData[i].id + '"><i class="devicons icon-remove"></i></a></div></div>';
                if(menuData[i].subtree!=undefined&&menuData[i].subtree.length>0){
                    items += '<ul>';
                    for(x=0;x<menuData[i].subtree.length;x++){
                        // console.log(menuData[i].subtree[x].name);
                        menuData[i].subtree[x].target = menuData[i].subtree[x].target.length==0 ? "default" : menuData[i].subtree[x].target;
                        menuData[i].subtree[x].value = menuData[i].subtree[x].value!=undefined ? menuData[i].subtree[x].value : "";

                        if(menuData[i].subtree[x].type=="link"){
                            menuData[i].subtree[x].url = menuData[i].url.indexOf('//')>-1 || menuData[i].subtree[x].url.indexOf('://')>-1 || menuData[i].subtree[x].url.indexOf('http')>-1 ? menuData[i].subtree[x].url : /*"http://" +*/ menuData[i].subtree[x].url;
                        }else{
                            menuData[i].subtree[x].url = menuData[i].subtree[x].url.replace('https://','');
                        }
                        items += '<li class="menu-item"><div><span class="clearfix"></span><div class="opt tooltip-item move-children" title="Move to first level"><span class="devicons icon-move-children-top"></span></div><div class="sort tooltip-item" title="Drag to move"><i class="devicons icon-move-icon"></i></div> <span data-link="' + menuData[i].subtree[x].url + '" class="item-title" data-target="' + menuData[i].subtree[x].target + '" data-value="' + menuData[i].subtree[x].value + '" data-type="' + menuData[i].subtree[x].type + '" data-showbranch="' + menuData[i].subtree[x].showbranch + '" data-showcorporate="' + menuData[i].subtree[x].showcorporate + '" data-showlosite="' + menuData[i].subtree[x].showlosite + '" data-original-title="' + menuData[i].subtree[x].original_title + '" data-id="' + menuData[i].subtree[x].id + '">' + menuData[i].subtree[x].name + '</span><div class="opt-group"><a href="javascript:;" class="btn-add opt nofloat" data-id="' + menuData[i].subtree[x].id + '"><i class="icon-add devicons"></i></a><a href="javascript:;" class="edit-it opt nofloat" data-id="' + menuData[i].subtree[x].id + '"><i class="icon-edit devicons"></i></a><a href="javascript:;" class="remove-it opt nofloat" data-id="' + menuData[i].subtree[x].id + '"><i class="devicons icon-remove"></i></a></div></div></li>';
                    }
                    items += '</ul>';
                }
                items += '</li>';
            }
            $('.editor').append("<ul class='" + ( activeMenu == index ? 'active' : '' ) + "' " +
                "data-name='" + menu[index].name + "' data-id='" + menu[index].id + "' " +
                "data-type='" + menu[index].type + "' data-published='" + menu[index].published + "'>" + items + "</ul>");
        },
        genMenu: function(){
            var items = "", i;
            //menuData = eval(menuData);
            menuData = menu;

            console.log(menuData);

            var menuDrop = "<option value='-1'>Create new menu</option>";
            for( i = 0; i < menu.length; i ++ ){
                (function(){
                    menuDrop += "<option value=" + i + " " +
                        "data-id='" + menu[i].id + "' data-type='" + menu[i].type + "' " +
                        "data-published='" + menu[i].published + "'>" + menu[i].name + "</option>";
                    devtools.inc.generateSingleMenu(i);
                })(i);
            }

            $("#menu").html(menuDrop).val(0).trigger("change");

            Status.add("editor-ready");
            checkPluginState();


        }, events: function(){

            $('.body')

                .on('change', '#link-type', function(){
                    var isChecked = $(this).is(':checked'),
                        $tabs = $('[rel="content-type"] .single-block');

                    $tabs.first().show().siblings().hide();
                    $('[rel="type"]').text('link');

                    if( isChecked ){
                        $tabs.last().show().siblings().hide();
                        $('[rel="type"]').text('page');
                    }


                })

                .on('change', '#menu', function(){
                    if( $(this).val() == -1 ){
                        devtools.redirectTo('settings/create');

                        $(this).val(0).trigger('change');

                        return true;
                    }

                    devtools.inc.toggleMenus();
                })

                .on('change', '#published', function(){
                    var published = $(this).is(':checked'),
                        notFirst = $(this).data('started') != undefined;

                    //if( !published && notFirst ){
                    //    $('#confirm-modal').confirm({
                    //        title: 'Unpublish menu',
                    //        message: "Are you sure you want to unpublish this menu? If you continue the menu and the changes you do will not" +
                    //        "be visible for anyone.",
                    //        onAccept: function(){
                    //            $('.editor > ul.active')
                    //                .attr('data-published', published)
                    //            ;
                    //        },
                    //        onCancel: function(){
                    //            $('#published').prop('checked', false).trigger('change');
                    //        },
                    //        cancelButton: 'Cancel',
                    //        acceptButton: 'Unpublish'
                    //    });
                    //
                    //}else{
                    //    $('.editor > ul.active')
                    //        .attr('data-published', published)
                    //    ;
                    //}

                    $('.editor > ul.active')
                        .attr('data-published', published)
                    ;



                    var menuId = $('.editor > ul.active').attr('data-id'),
                        menuName = $('.editor > ul.active').attr('data-name');

                    //$("#menu").val(2).trigger('change');
                    var $option = $('#menu option[data-id="' + menuId + '"]'),
                        value = $option.attr('value');

                    $option.text(menuName);
                    $option.attr('data-published', published);



                    //$(this).data('started', true);

                })

                .on('click', '.removeMenu', function(e){
                    e.stopPropagation();e.preventDefault();

                    var message = "Are you sure you want to remove this menu?";

                    function onConfirm()
                    {
                        var $menu = $('.editor > ul.active'),
                            name = $menu.attr('data-name'),
                            id = $menu.attr('data-id');

                        $menu.remove();
                        $('#menu option[data-id="' + id + '"]').remove();

                        for(var i=0; i<menu.length; i++)
                        {
                            if(menu[i].id == id)
                            {
                                menu.splice(i, 1);
                            }
                        }

                        if( $('#menu option').length > 1 ){
                            $('#menu').val( $('#menu option').eq(1).attr('value'));
                        }else{
                            $('#menu').val(-1);
                            menu = [];
                        }

                        $('#menu').trigger('change');

                        devtools.redirectTo('home');
                    }


                    $('#confirm-modal').confirm({
                        title: 'Delete menu',
                        message: message,
                        onAccept: onConfirm,
                        cancelButton: 'Cancel',
                        acceptButton: 'Yes, remove it'
                    });

                    return false;
                })

                .on('submit', '#editMenuForm', function(e){
                    e.stopPropagation();e.preventDefault();
                    var menuName = $('#menuNameEdited'),
                        menuId = $('#menuIdEdited'),
                        menuType = $('#menuTypeEdited'),
                        menuPublished = $('#menuPublishedEdited');

                    if( menuName.val().trim().length > 0 && menuType.val().trim().length > 0 )
                    {
                        $('.editor > ul[data-id="' + menuId.val() + '"]')
                            .attr('data-name', menuName.val())
                            .attr('data-type', menuType.val())
                            .attr('data-published', menuPublished.val())
                        ;

                        //$("#menu").val(2).trigger('change');
                        var $option = $('#menu option[data-id="' + menuId.val() + '"]'),
                            value = $option.attr('value');

                        $option.text(menuName.val());

                        var $clone = $option.clone();

                        $option.before($clone);
                        $option.remove();

                        $('#menu').val(value).trigger('change');

                        devtools.redirectTo("home");
                    }else{
                        $('#confirm-modal').confirm({
                            title: 'Error',
                            message: 'Please fill the menu name and menu type.'
                        });
                    }


                    return false;
                })


                .on('submit', '#newMenuForm', function(e){
                    e.stopPropagation();e.preventDefault();

                    //console.log( $(this).find(':input').serialize() + '&index=' + menu.length );

                    var menuName = $('#menuName').val(),
                        slug = $('#menuId').val(),
                        menuType = $('#menuType').val();

                    if( menuType.trim().length > 1 && menuName.trim() != "" && menuName.trim().length > 0 ){
                        $('.editor').append('<ul class="ui-sortable" data-name="' + menuName + '" ' +
                            'data-id="' + slug + '" data-type="' + menuType + '" data-published="false"></ul>');

                        $('#menu').append('<option value="' + menu.length + '" ' +
                            'data-id="' + slug + '" data-type="' + menuType + '" data-published="false">'
                            + menuName + '</option>');
                        $('#menu').val(menu.length).trigger('change');

                        menu.push({
                            name: menuName,
                            id: slug,
                            type: menuType,
                            data: []
                        });

                        checkPluginState();

                        $('#menuType').val("").trigger('change');

                        devtools.redirectTo('home');
                    }else{
                        $('#confirm-modal').confirm({
                            title: 'Error',
                            message: 'Please fill the menu name and menu type.',
                            onAccept: function(){
                                $('#menuName').focus()
                            }, acceptButton: "Ok, Edit"
                        });
                    }

                    return false;
                })

                .on('click', '.move-children', function(){
                    var item = $(this).closest('li');

                    if(item.find('ul').length>0){
                        var subitems = item.find('ul').find('li');
                        item.after(subitems);
                    }

                    $(this).closest('li').closest('ul').closest('li').after(item);

                    Status.add('nostored');

                })

                .on('click', '.remove-it', function(){
                    var item = $(this).closest('li');
                    var id = $(this).attr('data-id');

                    var message = "Are you sure you want to remove this menu item?";

                    function onConfirmItem()
                    {
                        item.remove();
                        Status.quit('editing nostored storing');
                        Status.add('nostored');

                        for(var i=0; i<menu[activeMenu].data.length; i++){
                            if(menu[activeMenu].data[i].id==id){
                                menu[activeMenu].data.splice(i,1);
                            }else{
                                for(var x=0; x<menu[activeMenu].data[i].subtree.length; x++){
                                    if(menu[activeMenu].data[i].subtree[x].id==id){
                                        menu[activeMenu].data[i].subtree.splice(x,1);
                                    }
                                }
                            }
                        }
                    }

                    $('#confirm-modal').confirm({
                        title: 'Remove menu item',
                        message: message,
                        onAccept: onConfirmItem,
                        cancelButton: 'Cancel',
                        acceptButton: 'Yes, remove it'
                    });





                })

                .on('change', '.checkbox input[type="checkbox"]', function(){
                    if($(this).is(":checked")){
                        $(this).closest('.checkbox').addClass('checked').find('.devicons').addClass('icon-checkbox-active').removeClass('icon-checkbox');
                    }else{
                        $(this).closest('.checkbox').removeClass('checked').find('.devicons').addClass('icon-checkbox').removeClass('icon-checkbox-active');
                    }
                })

                .on('click', '.minitabs a', function(){
                    $(this).parent().addClass('active').siblings().removeClass('active');

                    $('.minitab').eq($(this).parent().index()).addClass('active').siblings().removeClass('active');
                })

                //edit item, editItem
                .on('click', '.edit-it', function(){

                    $('.item-editor-header h4').text('edit item');

                    isNewItem = false;

                    if( $(this).hasClass('is-new') ){
                        $(this).removeClass('is-new');
                        isNewItem = true;
                        $('.item-editor-header h4').text('add item');
                    }

                    $('.menu-item > div').removeClass('active');
                    $(this).closest('.menu-item').find('div').first().addClass('active');
                    var _id = $(this).attr('data-id'),
                        ItemTop = $(this).closest('li').position().top;
                    Status.quit("editing");

                    Que(function(){

                        devtools.inc.editItem(_id);
                        positionateItemEditPopUp(ItemTop);

                        Que(function(){ $('#title').focus(); }, 200);

                        Status.add("editing");

                    }, 200);
                })

                .on('change', '.item-editor .checkbox input[type="checkbox"]', function(){
                    Status.add("nostored");
                }).on('keyup', '[rel="name"]', function(e){
                    if((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode == 189 || e.keyCode == 191) || e.keyCode==8){
                        // console.log(e.keyCode, "matched");
                        Status.add("nostored");
                    }else{
                        // console.log(e.keyCode, "not matched");
                    }
                }).on('click', '.btn-save', function () {




                    //save item
                    // console.log(editing, "save");

                    var item = $('.editor .item-title[data-id="' + editing + '"]');
                    // console.log("editing: ", editing, item.length);


                    var data = getParsedItem();

                    var $t = $('#title');

                    if( $t.val().trim() == "" || data.link.url.length == 0 ){

                        $('#confirm-modal').confirm({
                            title: 'Invalid inputs',
                            message: "Please fill all the inputs (title and url are required).",
                            onAccept: function(){
                                $t.focus();
                            },
                            acceptButton: 'Edit'
                        });

                    }else{
                        if (item.length > 0) {
                            item.text(data.name);
                            item.attr('data-link', data.link.url);
                            item.attr('data-type', data.link.type);
                            item.attr('data-target', data.link.target);
                            item.attr('data-value', ( data.link.isContent ? data.link.content.id : "" ));
                            item.attr('data-showcorporate', data.filter.isCorporate);
                            item.attr('data-showbranch', data.filter.isBranch);
                            item.attr('data-showlosite', data.filter.isLosite);
                            item.attr('data-original-title', ( data.link.isContent ? data.link.content.name : "" ));

                        }

                        Status.quit("nostored"); Status.add("stored");
                        Status.quit("editing");

                        if(cola["save"]!=undefined){ clearTimeout(cola["save"]); }
                        cola["save"] = setTimeout(function(){
                            Status.quit("stored");

                            updateMenuOnTheFly();

                        }, 500);
                    }




                })
                .on('click', '.btn-addplaceholder', function(){

                    isNewItem = true;
                    devtools.inc.editItem(0, ($(this).hasClass('item-append')) );

                })

                .on('click', '.btn-add', function(){

                    var _id = 'menu_' + Math.random(0,10);
                    _id = _id.replace(".",'');
                    var newItem = '<li class="menu-item"><div><span class="clearfix"></span><div class="opt tooltip-item move-children" title="Move to first level"><span class="devicons icon-move-children-top"></span></div><div class="sort tooltip-item" title="Drag to move"><i class="devicons icon-move-icon"></i></div> <span data-link="{{link}}" class="item-title" data-target="false" data-value="0" data-type="common" data-showbranch="true" data-showcorporate="true" data-showlosite="true" data-original-title="Home" data-id="' + _id + '">Item title</span><div class="opt-group"><a href="javascript:;" class="btn-add opt nofloat" data-id="' + _id + '"><i class="icon-add devicons"></i></a><a href="javascript:;" class="edit-it opt nofloat" data-id="' + _id + '"><i class="icon-edit devicons"></i></a><a href="javascript:;" class="remove-it opt nofloat" data-id="' + _id + '"><i class="devicons icon-remove"></i></a></div></div></li>';

                    editing = _id;

                    isNewItem = true;

                    var ul = $(this).closest('li').find('ul');
                    if(ul.length>0){
                        ul.append(newItem);
                    }else{
                        $(this).closest('li').append('<ul class="ui-sortable">' + newItem + '</ul>');
                    }

                    var $editBtn = $('.edit-it[data-id="' + editing + '"]');

                    $editBtn.addClass('is-new');

                    $editBtn.trigger('click');
                    $('.item-editor-header h4').text('add item');

                })

                .on('click', '.cancel-btn', function(){

                    var $t = $('#title');

                    var data = getParsedItem();

                    function removeSingleItem(){
                        $('.editor li [data-id="' + data.id + '"]').closest('li').remove();
                        Status.quit("editing");
                    }

                    if( ( $t.val().trim() == "" || data.link.url.length == 0 ) && isNewItem ){

                        $('#confirm-modal').confirm({
                            title: 'Empty fields (title and url are required)',
                            message: "If you continue this item will be removed.",
                            onAccept: function(){
                                removeSingleItem();
                            },
                            acceptButton: 'Close and Remove',
                            onCancel: function(){
                                $t.focus();
                            },
                            cancelButton: 'Continue editing'
                        });

                    }else{
                        if( isNewItem ){
                            $('.btn-save-inside').trigger('click');
                        }else{
                            Status.quit("editing");
                        }
                    }

                })

                .on('click', '.tabs a', function(){
                    $(this).parent().addClass('active').siblings().removeClass('active');
                    var toggle = $(this).attr('data-toggle');
                    switch (toggle){
                        case "all":
                            $('.editor li').show();
                            view = toggle;
                            break;
                        case "corporate":
                            $('.item-title[data-showbranch], .item-title[data-showlosite], .item-title[data-showcorporate]').closest('li').hide();
                            $('.item-title[data-showcorporate="true"]').closest('li').show();
                            view = toggle;
                            break;
                        case "branch":
                            $('.item-title[data-showbranch], .item-title[data-showlosite], .item-title[data-showcorporate]').closest('li').hide();
                            $('.item-title[data-showbranch="true"]').closest('li').show();
                            view = toggle;
                            break;
                        case "losite":
                            $('.item-title[data-showbranch], .item-title[data-showlosite], .item-title[data-showcorporate]').closest('li').hide();
                            $('.item-title[data-showlosite="true"]').closest('li').show();
                            view = toggle;
                            break;

                    }
                })

                .on('change', '#show', function(){
                    var toggle = $(this).val(), $items = [];

                    switch (toggle){
                        case "all":
                            $('.editor li').show();
                            view = toggle;
                            break;
                        case "corporate":
                            $('.item-title[data-showbranch], .item-title[data-showlosite], .item-title[data-showcorporate]').closest('li').hide();
                            $('.item-title[data-showcorporate="true"]').closest('li').show();
                            view = toggle;
                            break;
                        case "branch":
                            $('.item-title[data-showbranch], .item-title[data-showlosite], .item-title[data-showcorporate]').closest('li').hide();
                            $('.item-title[data-showbranch="true"]').closest('li').show();
                            view = toggle;
                            break;
                        case "losite":
                            $('.item-title[data-showbranch], .item-title[data-showlosite], .item-title[data-showcorporate]').closest('li').hide();
                            $('.item-title[data-showlosite="true"]').closest('li').show();
                            view = toggle;
                            break;

                    }
                })

                .on('keyup focus', '#search', function(e){
                    if((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode == 189 || e.keyCode == 191) || e.keyCode==8 || e.keyCode==undefined){

                        if(colas['search']!=undefined){
                            clearTimeout(colas['search']);
                        }

                        var q = $(this).val();

                        colas['search'] = setTimeout(function(){
                            $.ajax({
                                url: 'contents.php?s=' + currentSite + '&q=' + encodeURI(q),
                                success: function(data){
                                    // console.log(data);
                                    var r = "";
                                    for(i=0; i<data.length; i++){
                                        r += '<a href="javascript:;" data-id="' + data[i].Content.ID + '" data-number="'
                                            + data[i].Content.Number
                                            + '"><li><span class="rtype">crm</span>' +
                                            ' <span class="rtitle">' + data[i].Content.Name + '</span></li></a>';
                                    }

                                    $('.results').empty();
                                    $('.results').html(r);
                                }
                            });
                        }, 500);

                    }



                }).on('click', '.filtertabs a', function(){
                    var _i = $(this).parent().index();

                    $(this).parent().addClass('active').siblings().removeClass('active');
                    $('.filtertab').eq(_i).addClass('active').siblings().removeClass('active');
                }).on('click', '.results a', function(){

                    $(this).addClass('active').siblings().removeClass('active');
                    var number = $(this).attr('data-number'), title = $(this).find('.rtitle').text();

                    Que(function(){
                        devtools.redirectTo("home");

                        $('.item-editor [rel="name"]').val(title);
                        $('.item-editor [rel="original_title"]').text(title);
                        $('.item-editor [rel="type"]').text("crm");
                        $('.item-editor [rel="value"]').val(number);


                        Status.add("nostored");

                    }, 400);

                }).on('click', '.set-url', function(){
                    var title = $('#curl_title').val(), url = $('#curl_url').val();
                    $('.item-editor [rel="name"]').val(title);
                    $('.item-editor [rel="original_title"]').text(title);
                    $('.item-editor [rel="type"]').text("link");
                    $('.item-editor [rel="value"]').val("0");
                    $('.item-editor [rel="url"]').val(url);

                    Que(function(){
                        devtools.redirectTo("home");
                        Status.add("nostored");
                    }, 400);
                }).on('click', '[rel="deploybtn"]', function(){
                    var deployto = $('[rel="deploy"]').val();

                    if (deployto == "Production") {
                        devtools.redirectTo("home");
                        Status.notify('This demo has no access to ' + deployto + ' server.<br>Fake notification. Keep in mind this is a demo.');
                    } else {


                        var m = devtools.inc.parseTree($('.editor > ul > li > div > .item-title'));

                        $.ajax({
                            url: 'saveContent.php?cid=91&s=' + currentSite,
                            type: "POST",
                            data: {"content": JSON.stringify(m)},
                            success: function(data){
                                console.log('deployed');
                                devtools.redirectTo("home");
                                setTimeout(function(){
                                    // alert("Deployment successfully. ` sent to: " + deployto);
                                    Status.notify('Deployment successfully. Menu sent to: ' + deployto);
                                }, 800);
                            }
                        });

                    }
                }).on('click', '[rel="close"]', function(){
                    var item = $(this).closest('li'), _id = item.attr('id');
                    if(colas[_id]!=undefined){
                        clearTimeout(colas[_id]);
                    }

                    colas[_id] = setTimeout(function(){
                        item.fadeOut(500, function(){
                            item.remove();
                        });
                    }, 10);

                }).on('click', '.preview-screen a', function(e){
                    if(!$(this).hasClass('dropdown-toggle')){
                        e.preventDefault(); e.stopPropagation();
                    }
                });
        }

    },
























    deniedAccess: function(){
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
    }, activateServices: function(){

        //load navigation options
        /*var rightNav = "";
        for(i=0; i<data.menu[0].length; i++){
            rightNav += '<li><a href="#/' + data.menu[0][i]['url'] + '">' + data.menu[0][i]['title'].toUpperCase() + '</a></li>';
        }
        $('.navigation .right-nav ul').html(rightNav);*/

        //load dependencies
        /*for(i=0; i<data.dependencies.length; i++){
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
        }*/

        devtools.inc.init();


        //load settings
        /*var settingsnav = "" +
            "<div class='form-group'>" +
            "<select rel='deploy' class='form-control select-dropdown' style='min-width: 200px'>";
        for(i=0; i<data.menu[1].length; i++){
            settingsnav = settingsnav + ""
                + '<option value="' + data.menu[1][i]['title'] + '">' + data.menu[1][i]['hint'] + '</option>';
        }
        settingsnav = settingsnav + "</select></div><div class='form-group'><a href='javascript:;' class='btn btn-success'" +
            " rel='deploybtn'>Deploy</a></div>"

        $('[data-layer="settings"]').append(settingsnav);*/

        $('.only-editor').show();
        dropdown.create();


    }, checkLogin: function(){
        //var info = [$(this).find('[name="username"]').val(), $(this).find('[name="password"]').val()];
        /*$.ajax({
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
        });*/


        devtools.activateServices();
        Status.add('signedin');
        Status.quit('signedout');

        access = [false, Math.random()];
        // console.log(access);
        devtools.redirectTo('home');

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
    } else if( modal == "save" ){


        var obj = getMenuObject();

        var message = 'This action will save your menu settings. <br>Check what menus will be published:<ul>';
        for( var s=0; s<obj.length; s++ ){
            message += '<li>'
                + (obj[s].published ? '<i class="devicons icon-checkbox-active for-list"></i>' : '<i class="devicons icon-checkbox for-list"></i>')
                + '<b>' + obj[s].name + '</b></li>';
        }
        message += '</ul>';

        $('#confirm-modal').confirm({
            title: 'Continue?',
            message: message,
            onAccept: function(){
                deployMenu();
            },
            onCancel: function(){
                devtools.redirectTo('home');
            },
            cancelButton: 'Cancel',
            acceptButton: 'Save'
        });


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

            $('#search').val(name).trigger('focus');


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






























/* From devtools.inc.js */
/* =Devtools-init */

// Function:        sortData
// Description:     Sort array according to sortMode
// Parameters:      j: array containing the items to be sorted
//                  sortMode: mode to sort; name or date; ascending or descending
// Return:          Sorted array
function sortData(entries, sortMode) {
    if (sortMode === "none")
        return;

    function ascSort(a, b) {
        return Number(a.index) - Number(b.index);
    }
    function descSort(a, b) {
        return Number(b.index) - Number(a.index);
    }

    switch (sortMode) {
        case "ASC":
            entries.sort(ascSort);
            break;
        case "DESC":
            entries.sort(descSort);
            break;
    }

    return entries;
}


// Function:        positionateItemEditPopUp
// Description:     set top position centered in the item is being edited
// Parameters:      ItemTop: int or string plus units
// Return:          true
function positionateItemEditPopUp(ItemTop) {
    /*var $itemEditor = $('.item-editor');

    var scrollPos = ItemTop - ( ( $itemEditor.outerHeight() - 80 ) / 2 );
    if( scrollPos < 0 ){
        scrollPos = 60;
    }

    $itemEditor.css({top: scrollPos});

    $(window).scrollTop(scrollPos);*/

    /* DO nothing because now it will be fixed position */

    return true;
}

function findIndex(value, key, arr){
    var index = -1, i, found = false;
    for( i=0; i<arr.length; i++ ){
        if( arr[i][key] == value && !found ){
            index = i;
            found = true;
            //i = arr.length;
        }
    }

    return index;
}

function log()
{
    if( arguments.length > 0 )
    {
        console.log(arguments);
    }
}

function setArrayValue(parent, children, objectData){

    console.log('setArrarValue', objectData);
    console.log('setArrarValue', menu[activeMenu].data);

    if( objectData.length > parent ){
        if( typeof objectData[parent].subtree == "undefined" ){
            objectData[parent].subtree = [];
        }

        //add it as children
        objectData[parent].subtree.push( objectData[children] );

        //remove it from first level
        objectData.splice(children, 1);

        log('adding children ', children, 'to parent', parent);
    }

    menu[activeMenu].data = objectData;
    return objectData;
}






function parseMenuTree(data){
    var i,
        read = [],
        parse = [],
        activeMenuEditing = true;

    if( arguments.length > 2 && arguments[2] ){
        read = data;
        activeMenuEditing = false;
    }else{
        read = data[activeMenu].data;
    }

    read = sortData(read, "ASC");


    for( i=0; i<read.length; i++ ){
        //only fathers
        (function(i){
            if( read[i].parent_id.length == 0 && read[i].parent_id.length < 5 || read[i].parent_id == " ") {
                parse.push( read[i] );
            }
        })(i);
    }


    for( i=0; i<read.length; i++ ){
        //only fathers
        (function(i){
            if( read[i].parent_id.length > 0 && read[i].parent_id.length > 5 && read[i].parent_id != " ") {
                for( var x=0; x<parse.length; x++ )
                {
                    (function(i, x){
                        if( parse[x].id == read[i].parent_id )
                        {
                            if( typeof parse[x].subtree == "undefined" )
                            {
                                parse[x].subtree = [];
                            }

                            parse[x].subtree.push( read[i] );
                        }
                    })(i, x);
                }
            }
        })(i);
    }

    if( activeMenuEditing )
    {
        menu[activeMenu].data = parse;
    }

    if( arguments.length > 1 ){
        arguments[1]();
    }

    return parse;
}







function getMenuObject(published){

    var menuTree = [],
        $menus = $('.editor > ul');

    for( var i=0; i<$menus.length; i++ ){
        (function(i){
            var m = {
                name: $menus.eq(i).attr('data-name'),
                id: $menus.eq(i).attr('data-id'),
                type: $menus.eq(i).attr('data-type'),
                published: $menus.eq(i).attr('data-published') == "true",
                data: devtools.inc.parseTree($('> li > div > .item-title', $menus.eq(i)))
            };

            if(m.data.length > 0 ){
                menuTree.push( m );
            }

        })(i);
    }

    //menuTree = {"Content": menuTree};

    return menuTree;
}





function deployMenu(published){
    var published = published != undefined ? published : false;

    var menuTree = [],
        $menus = $('.editor > ul');

    for( var i=0; i<$menus.length; i++ ){
        (function(i){
            var m = {
                name: $menus.eq(i).attr('data-name'),
                id: $menus.eq(i).attr('data-id'),
                type: $menus.eq(i).attr('data-type'),
                published: $menus.eq(i).attr('data-published') == "true",
                data: devtools.inc.parseTree($('> li > div > .item-title', $menus.eq(i)))
            };

            menuTree.push( m );
        })(i);
    }

    log(menuTree);


    //menuTree = {"Content": menuTree};

    $.ajax({
        url: 'saveContent.php',
        type: "POST",
        data: {"content": JSON.stringify(menuTree), "siteid": currentSite },
        success: function(data){
            Status.quit("nostored"); Status.add("stored");
            Status.quit("editing");

            if(cola["save"]!=undefined){ clearTimeout(cola["save"]); }
            cola["save"] = setTimeout(function(){
                Status.quit("stored");

                Status.notify('Menu saved successfully');

                devtools.redirectTo('home');
            }, 500);
        }
    });

}




//update on every event
function updateMenuOnTheFly(){
    Status.add('nostored');


    var m = devtools.inc.parseTree($('.editor > ul.active > li > div > .item-title')),
        id = $('.editor > ul.active').attr('data-id');
    m = parseMenuTree(m, function(){}, true);
    m = m;

    for(var i=0; i<menu.length; i++)
    {
        if(menu[i].id == id)
        {
            console.log(m);
            menu[i].data = m;
            console.log('sort update found', menu[i].data);
        }
    }
}





Status.add('loading signedout');
$(document).on('ready', function(){
    devtools.visitor();
}).ajaxStart(function(){
    Status.add("loading");
    Pace.restart();
}).ajaxComplete(function(){
    Status.quit("loading");
});














/*PACE */

var paceOptions = {
    ajax: true, // disabled
    document: true, // disabled
    eventLag: true, // disabled
};

/*! pace 1.0.0 */
(function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X=[].slice,Y={}.hasOwnProperty,Z=function(a,b){function c(){this.constructor=a}for(var d in b)Y.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},$=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};for(u={catchupTime:100,initialRate:.03,minTime:250,ghostTime:100,maxProgressPerFrame:20,easeFactor:1.25,startOnPageLoad:!0,restartOnPushState:!0,restartOnRequestAfter:500,target:"body",elements:{checkInterval:100,selectors:["body"]},eventLag:{minSamples:10,sampleCount:3,lagThreshold:3},ajax:{trackMethods:["GET"],trackWebSockets:!0,ignoreURLs:[]}},C=function(){var a;return null!=(a="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance.now():void 0)?a:+new Date},E=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,t=window.cancelAnimationFrame||window.mozCancelAnimationFrame,null==E&&(E=function(a){return setTimeout(a,50)},t=function(a){return clearTimeout(a)}),G=function(a){var b,c;return b=C(),(c=function(){var d;return d=C()-b,d>=33?(b=C(),a(d,function(){return E(c)})):setTimeout(c,33-d)})()},F=function(){var a,b,c;return c=arguments[0],b=arguments[1],a=3<=arguments.length?X.call(arguments,2):[],"function"==typeof c[b]?c[b].apply(c,a):c[b]},v=function(){var a,b,c,d,e,f,g;for(b=arguments[0],d=2<=arguments.length?X.call(arguments,1):[],f=0,g=d.length;g>f;f++)if(c=d[f])for(a in c)Y.call(c,a)&&(e=c[a],null!=b[a]&&"object"==typeof b[a]&&null!=e&&"object"==typeof e?v(b[a],e):b[a]=e);return b},q=function(a){var b,c,d,e,f;for(c=b=0,e=0,f=a.length;f>e;e++)d=a[e],c+=Math.abs(d),b++;return c/b},x=function(a,b){var c,d,e;if(null==a&&(a="options"),null==b&&(b=!0),e=document.querySelector("[data-pace-"+a+"]")){if(c=e.getAttribute("data-pace-"+a),!b)return c;try{return JSON.parse(c)}catch(f){return d=f,"undefined"!=typeof console&&null!==console?console.error("Error parsing inline pace options",d):void 0}}},g=function(){function a(){}return a.prototype.on=function(a,b,c,d){var e;return null==d&&(d=!1),null==this.bindings&&(this.bindings={}),null==(e=this.bindings)[a]&&(e[a]=[]),this.bindings[a].push({handler:b,ctx:c,once:d})},a.prototype.once=function(a,b,c){return this.on(a,b,c,!0)},a.prototype.off=function(a,b){var c,d,e;if(null!=(null!=(d=this.bindings)?d[a]:void 0)){if(null==b)return delete this.bindings[a];for(c=0,e=[];c<this.bindings[a].length;)e.push(this.bindings[a][c].handler===b?this.bindings[a].splice(c,1):c++);return e}},a.prototype.trigger=function(){var a,b,c,d,e,f,g,h,i;if(c=arguments[0],a=2<=arguments.length?X.call(arguments,1):[],null!=(g=this.bindings)?g[c]:void 0){for(e=0,i=[];e<this.bindings[c].length;)h=this.bindings[c][e],d=h.handler,b=h.ctx,f=h.once,d.apply(null!=b?b:this,a),i.push(f?this.bindings[c].splice(e,1):e++);return i}},a}(),j=window.Pace||{},window.Pace=j,v(j,g.prototype),D=j.options=v({},u,window.paceOptions,x()),U=["ajax","document","eventLag","elements"],Q=0,S=U.length;S>Q;Q++)K=U[Q],D[K]===!0&&(D[K]=u[K]);i=function(a){function b(){return V=b.__super__.constructor.apply(this,arguments)}return Z(b,a),b}(Error),b=function(){function a(){this.progress=0}return a.prototype.getElement=function(){var a;if(null==this.el){if(a=document.querySelector(D.target),!a)throw new i;this.el=document.createElement("div"),this.el.className="pace pace-active",document.body.className=document.body.className.replace(/pace-done/g,""),document.body.className+=" pace-running",this.el.innerHTML='<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>',null!=a.firstChild?a.insertBefore(this.el,a.firstChild):a.appendChild(this.el)}return this.el},a.prototype.finish=function(){var a;return a=this.getElement(),a.className=a.className.replace("pace-active",""),a.className+=" pace-inactive",document.body.className=document.body.className.replace("pace-running",""),document.body.className+=" pace-done"},a.prototype.update=function(a){return this.progress=a,this.render()},a.prototype.destroy=function(){try{this.getElement().parentNode.removeChild(this.getElement())}catch(a){i=a}return this.el=void 0},a.prototype.render=function(){var a,b,c,d,e,f,g;if(null==document.querySelector(D.target))return!1;for(a=this.getElement(),d="translate3d("+this.progress+"%, 0, 0)",g=["webkitTransform","msTransform","transform"],e=0,f=g.length;f>e;e++)b=g[e],a.children[0].style[b]=d;return(!this.lastRenderedProgress||this.lastRenderedProgress|0!==this.progress|0)&&(a.children[0].setAttribute("data-progress-text",""+(0|this.progress)+"%"),this.progress>=100?c="99":(c=this.progress<10?"0":"",c+=0|this.progress),a.children[0].setAttribute("data-progress",""+c)),this.lastRenderedProgress=this.progress},a.prototype.done=function(){return this.progress>=100},a}(),h=function(){function a(){this.bindings={}}return a.prototype.trigger=function(a,b){var c,d,e,f,g;if(null!=this.bindings[a]){for(f=this.bindings[a],g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(c.call(this,b));return g}},a.prototype.on=function(a,b){var c;return null==(c=this.bindings)[a]&&(c[a]=[]),this.bindings[a].push(b)},a}(),P=window.XMLHttpRequest,O=window.XDomainRequest,N=window.WebSocket,w=function(a,b){var c,d,e,f;f=[];for(d in b.prototype)try{e=b.prototype[d],f.push(null==a[d]&&"function"!=typeof e?a[d]=e:void 0)}catch(g){c=g}return f},A=[],j.ignore=function(){var a,b,c;return b=arguments[0],a=2<=arguments.length?X.call(arguments,1):[],A.unshift("ignore"),c=b.apply(null,a),A.shift(),c},j.track=function(){var a,b,c;return b=arguments[0],a=2<=arguments.length?X.call(arguments,1):[],A.unshift("track"),c=b.apply(null,a),A.shift(),c},J=function(a){var b;if(null==a&&(a="GET"),"track"===A[0])return"force";if(!A.length&&D.ajax){if("socket"===a&&D.ajax.trackWebSockets)return!0;if(b=a.toUpperCase(),$.call(D.ajax.trackMethods,b)>=0)return!0}return!1},k=function(a){function b(){var a,c=this;b.__super__.constructor.apply(this,arguments),a=function(a){var b;return b=a.open,a.open=function(d,e){return J(d)&&c.trigger("request",{type:d,url:e,request:a}),b.apply(a,arguments)}},window.XMLHttpRequest=function(b){var c;return c=new P(b),a(c),c};try{w(window.XMLHttpRequest,P)}catch(d){}if(null!=O){window.XDomainRequest=function(){var b;return b=new O,a(b),b};try{w(window.XDomainRequest,O)}catch(d){}}if(null!=N&&D.ajax.trackWebSockets){window.WebSocket=function(a,b){var d;return d=null!=b?new N(a,b):new N(a),J("socket")&&c.trigger("request",{type:"socket",url:a,protocols:b,request:d}),d};try{w(window.WebSocket,N)}catch(d){}}}return Z(b,a),b}(h),R=null,y=function(){return null==R&&(R=new k),R},I=function(a){var b,c,d,e;for(e=D.ajax.ignoreURLs,c=0,d=e.length;d>c;c++)if(b=e[c],"string"==typeof b){if(-1!==a.indexOf(b))return!0}else if(b.test(a))return!0;return!1},y().on("request",function(b){var c,d,e,f,g;return f=b.type,e=b.request,g=b.url,I(g)?void 0:j.running||D.restartOnRequestAfter===!1&&"force"!==J(f)?void 0:(d=arguments,c=D.restartOnRequestAfter||0,"boolean"==typeof c&&(c=0),setTimeout(function(){var b,c,g,h,i,k;if(b="socket"===f?e.readyState<2:0<(h=e.readyState)&&4>h){for(j.restart(),i=j.sources,k=[],c=0,g=i.length;g>c;c++){if(K=i[c],K instanceof a){K.watch.apply(K,d);break}k.push(void 0)}return k}},c))}),a=function(){function a(){var a=this;this.elements=[],y().on("request",function(){return a.watch.apply(a,arguments)})}return a.prototype.watch=function(a){var b,c,d,e;return d=a.type,b=a.request,e=a.url,I(e)?void 0:(c="socket"===d?new n(b):new o(b),this.elements.push(c))},a}(),o=function(){function a(a){var b,c,d,e,f,g,h=this;if(this.progress=0,null!=window.ProgressEvent)for(c=null,a.addEventListener("progress",function(a){return h.progress=a.lengthComputable?100*a.loaded/a.total:h.progress+(100-h.progress)/2},!1),g=["load","abort","timeout","error"],d=0,e=g.length;e>d;d++)b=g[d],a.addEventListener(b,function(){return h.progress=100},!1);else f=a.onreadystatechange,a.onreadystatechange=function(){var b;return 0===(b=a.readyState)||4===b?h.progress=100:3===a.readyState&&(h.progress=50),"function"==typeof f?f.apply(null,arguments):void 0}}return a}(),n=function(){function a(a){var b,c,d,e,f=this;for(this.progress=0,e=["error","open"],c=0,d=e.length;d>c;c++)b=e[c],a.addEventListener(b,function(){return f.progress=100},!1)}return a}(),d=function(){function a(a){var b,c,d,f;for(null==a&&(a={}),this.elements=[],null==a.selectors&&(a.selectors=[]),f=a.selectors,c=0,d=f.length;d>c;c++)b=f[c],this.elements.push(new e(b))}return a}(),e=function(){function a(a){this.selector=a,this.progress=0,this.check()}return a.prototype.check=function(){var a=this;return document.querySelector(this.selector)?this.done():setTimeout(function(){return a.check()},D.elements.checkInterval)},a.prototype.done=function(){return this.progress=100},a}(),c=function(){function a(){var a,b,c=this;this.progress=null!=(b=this.states[document.readyState])?b:100,a=document.onreadystatechange,document.onreadystatechange=function(){return null!=c.states[document.readyState]&&(c.progress=c.states[document.readyState]),"function"==typeof a?a.apply(null,arguments):void 0}}return a.prototype.states={loading:0,interactive:50,complete:100},a}(),f=function(){function a(){var a,b,c,d,e,f=this;this.progress=0,a=0,e=[],d=0,c=C(),b=setInterval(function(){var g;return g=C()-c-50,c=C(),e.push(g),e.length>D.eventLag.sampleCount&&e.shift(),a=q(e),++d>=D.eventLag.minSamples&&a<D.eventLag.lagThreshold?(f.progress=100,clearInterval(b)):f.progress=100*(3/(a+3))},50)}return a}(),m=function(){function a(a){this.source=a,this.last=this.sinceLastUpdate=0,this.rate=D.initialRate,this.catchup=0,this.progress=this.lastProgress=0,null!=this.source&&(this.progress=F(this.source,"progress"))}return a.prototype.tick=function(a,b){var c;return null==b&&(b=F(this.source,"progress")),b>=100&&(this.done=!0),b===this.last?this.sinceLastUpdate+=a:(this.sinceLastUpdate&&(this.rate=(b-this.last)/this.sinceLastUpdate),this.catchup=(b-this.progress)/D.catchupTime,this.sinceLastUpdate=0,this.last=b),b>this.progress&&(this.progress+=this.catchup*a),c=1-Math.pow(this.progress/100,D.easeFactor),this.progress+=c*this.rate*a,this.progress=Math.min(this.lastProgress+D.maxProgressPerFrame,this.progress),this.progress=Math.max(0,this.progress),this.progress=Math.min(100,this.progress),this.lastProgress=this.progress,this.progress},a}(),L=null,H=null,r=null,M=null,p=null,s=null,j.running=!1,z=function(){return D.restartOnPushState?j.restart():void 0},null!=window.history.pushState&&(T=window.history.pushState,window.history.pushState=function(){return z(),T.apply(window.history,arguments)}),null!=window.history.replaceState&&(W=window.history.replaceState,window.history.replaceState=function(){return z(),W.apply(window.history,arguments)}),l={ajax:a,elements:d,document:c,eventLag:f},(B=function(){var a,c,d,e,f,g,h,i;for(j.sources=L=[],g=["ajax","elements","document","eventLag"],c=0,e=g.length;e>c;c++)a=g[c],D[a]!==!1&&L.push(new l[a](D[a]));for(i=null!=(h=D.extraSources)?h:[],d=0,f=i.length;f>d;d++)K=i[d],L.push(new K(D));return j.bar=r=new b,H=[],M=new m})(),j.stop=function(){return j.trigger("stop"),j.running=!1,r.destroy(),s=!0,null!=p&&("function"==typeof t&&t(p),p=null),B()},j.restart=function(){return j.trigger("restart"),j.stop(),j.start()},j.go=function(){var a;return j.running=!0,r.render(),a=C(),s=!1,p=G(function(b,c){var d,e,f,g,h,i,k,l,n,o,p,q,t,u,v,w;for(l=100-r.progress,e=p=0,f=!0,i=q=0,u=L.length;u>q;i=++q)for(K=L[i],o=null!=H[i]?H[i]:H[i]=[],h=null!=(w=K.elements)?w:[K],k=t=0,v=h.length;v>t;k=++t)g=h[k],n=null!=o[k]?o[k]:o[k]=new m(g),f&=n.done,n.done||(e++,p+=n.tick(b));return d=p/e,r.update(M.tick(b,d)),r.done()||f||s?(r.update(100),j.trigger("done"),setTimeout(function(){return r.finish(),j.running=!1,j.trigger("hide")},Math.max(D.ghostTime,Math.max(D.minTime-(C()-a),0)))):c()})},j.start=function(a){v(D,a),j.running=!0;try{r.render()}catch(b){i=b}return document.querySelector(".pace")?(j.trigger("start"),j.go()):setTimeout(j.start,50)},"function"==typeof define&&define.amd?define(function(){return j}):"object"==typeof exports?module.exports=j:D.startOnPageLoad&&j.start()}).call(this);