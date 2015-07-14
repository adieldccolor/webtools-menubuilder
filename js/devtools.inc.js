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
	var $itemEditor = $('.item-editor');

    var scrollPos = ItemTop - ( ( $itemEditor.outerHeight() - 80 ) / 2 );
    if( scrollPos < 0 ){
        scrollPos = 60;
    }

	$itemEditor.css({top: scrollPos});

    $(window).scrollTop(scrollPos);

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
        read = data[activeMenu].data,
		parse = [],
		activeMenuEditing = true;

    if( arguments.length > 2 && arguments[2] ){
        read = data;
		activeMenuEditing = false;
    }


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





function deployMenu(published){
	var published = published != undefined ? published : false;

    var menuTree = [],
        $menus = $('.editor > ul');

    for( var i=0; i<$menus.length; i++ ){
        (function(i){
            var m = {
                name: $menus.eq(i).attr('data-name'),
                id: $menus.eq(i).attr('data-id'),
                data: devtools.inc.parseTree($('> li > div > .item-title', $menus.eq(i)))
            };

            menuTree.push( m );
        })(i);
    }

    log(menuTree);

    $.ajax({
        url: 'saveContent.php?s=' + currentSite,
        type: "POST",
        data: {"content": JSON.stringify(menuTree), "published": published },
        success: function(data){
            Status.quit("nostored"); Status.add("stored");
            Status.quit("editing");

            if(cola["save"]!=undefined){ clearTimeout(cola["save"]); }
            cola["save"] = setTimeout(function(){
                Status.quit("stored");
            }, 500);
        }
    });

}

devtools.inc = {
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
				mm += '<a href="' + m[i].url + '" ' + (m[i].target ? 'target="_blank"':'') + ' ' + (hassubtree?'class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"':'') + '>' + m[i].name + (hassubtree?' <span class="caret"></span>':'') + '</a>';
				if(hassubtree){
					mm += '<ul class="dropdown-menu" role="menu">';

					for(x=0; x<m[i].subtree.length; x++){
						m[i].subtree[x].url = m[i].subtree[x].url.replace(/{{link}}/g, "default.aspx?s=site");
						mm += '<li><a href="' + m[i].subtree[x].url + '" ' + (m[i].subtree[x].target ? 'target="_blank"':'') + '>' + m[i].subtree[x].name + '</a></li>';
					}

					mm += '</ul>';
				}
			}else if(view=='losite'&&m[i].showlosite){
				var hassubtree = m[i].subtree!=undefined&&m[i].subtree.length>0;
				mm += '<li id="' + m[i].id + '" ' + (hassubtree?'class="dropdown"':'') + ' >';
				mm += '<a href="' + m[i].url + '" ' + (m[i].target ? 'target="_blank"':'') + ' ' + (hassubtree?'class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"':'') + '>' + m[i].name + (hassubtree?' <span class="caret"></span>':'') + '</a>';
				if(hassubtree){
					mm += '<ul class="dropdown-menu" role="menu">';

					for(x=0; x<m[i].subtree.length; x++){
						m[i].subtree[x].url = m[i].subtree[x].url.replace(/{{link}}/g, "default.aspx?s=site");
						mm += '<li><a href="' + m[i].subtree[x].url + '" ' + (m[i].subtree[x].target ? 'target="_blank"':'') + '>' + m[i].subtree[x].name + '</a></li>';
					}

					mm += '</ul>';
				}
			}else if(view=='branch'&&m[i].showbranch){
				var hassubtree = m[i].subtree!=undefined&&m[i].subtree.length>0;
				mm += '<li id="' + m[i].id + '" ' + (hassubtree?'class="dropdown"':'') + ' >';
				mm += '<a href="' + m[i].url + '" ' + (m[i].target ? 'target="_blank"':'') + ' ' + (hassubtree?'class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"':'') + '>' + m[i].name + (hassubtree?' <span class="caret"></span>':'') + '</a>';
				if(hassubtree){
					mm += '<ul class="dropdown-menu" role="menu">';

					for(x=0; x<m[i].subtree.length; x++){
						m[i].subtree[x].url = m[i].subtree[x].url.replace(/{{link}}/g, "default.aspx?s=site");
						mm += '<li><a href="' + m[i].subtree[x].url + '" ' + (m[i].subtree[x].target ? 'target="_blank"':'') + '>' + m[i].subtree[x].name + '</a></li>';
					}

					mm += '</ul>';
				}
			}else if(view=='all'){
				var hassubtree = m[i].subtree!=undefined&&m[i].subtree.length>0;
				mm += '<li id="' + m[i].id + '" ' + (hassubtree?'class="dropdown"':'') + ' >';
				mm += '<a href="' + m[i].url + '" ' + (m[i].target ? 'target="_blank"':'') + ' ' + (hassubtree?'class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"':'') + '>' + m[i].name + (hassubtree?' <span class="caret"></span>':'') + '</a>';
				if(hassubtree){
					mm += '<ul class="dropdown-menu" role="menu">';

					for(x=0; x<m[i].subtree.length; x++){
						m[i].subtree[x].url = m[i].subtree[x].url.replace(/{{link}}/g, "default.aspx?s=site");
						mm += '<li><a href="' + m[i].subtree[x].url + '" ' + (m[i].subtree[x].target ? 'target="_blank"':'') + '>' + m[i].subtree[x].name + '</a></li>';
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
			var name = item.text();
			name = name.toLowerCase() == "item title" ? "" : name;

			$itemEditor.find('[rel="name"]').val(name);
			$itemEditor.find('[rel="url"]').val(item.attr('data-link'));
			$itemEditor.find('[rel="value"]').val(item.attr('data-value'));
			$itemEditor.find('[rel="original_title"]').text(item.attr('data-original-title'));
			$itemEditor.find('[rel="type"]').text(item.attr('data-type'));




				if(eval(item.attr('data-target'))){
					$('[rel="target"]').addClass('checked').find('input[type="checkbox"]').attr('checked', true);
					$('[rel="target"]').find('.devicons').removeClass('icon-checkbox').addClass('icon-checkbox-active');
				}else{
					$('[rel="target"]').removeClass('checked').find('input[type="checkbox"]').removeAttr('checked');
					$('[rel="target"]').find('.devicons').removeClass('icon-checkbox-active').addClass('icon-checkbox');
				}

				if(eval(item.attr('data-showcorporate'))){
					$('[rel="showcorporate"]').addClass('checked').find('input[type="checkbox"]').attr('checked', true);
					$('[rel="showcorporate"]').find('.devicons').removeClass('icon-checkbox').addClass('icon-checkbox-active');
				}else{
					$('[rel="showcorporate"]').removeClass('checked').find('input[type="checkbox"]').removeAttr('checked');
					$('[rel="showcorporate"]').find('.devicons').removeClass('icon-checkbox-active').addClass('icon-checkbox');
				}

				if(eval(item.attr('data-showbranch'))){
					$('[rel="showbranch"]').addClass('checked').find('input[type="checkbox"]').attr('checked', true);
					$('[rel="showbranch"]').find('.devicons').removeClass('icon-checkbox').addClass('icon-checkbox-active');
				}else{
					$('[rel="showbranch"]').removeClass('checked').find('input[type="checkbox"]').removeAttr('checked');
					$('[rel="showbranch"]').find('.devicons').removeClass('icon-checkbox-active').addClass('icon-checkbox');
				}

				if(eval(item.attr('data-showlosite'))){
					$('[rel="showlosite"]').addClass('checked').find('input[type="checkbox"]').attr('checked', true);
					$('[rel="showlosite"]').find('.devicons').removeClass('icon-checkbox').addClass('icon-checkbox-active');
				}else{
					$('[rel="showlosite"]').removeClass('checked').find('input[type="checkbox"]').removeAttr('checked');
					$('[rel="showlosite"]').find('.devicons').removeClass('icon-checkbox-active').addClass('icon-checkbox');
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

			$('.edit-it[data-id="' + editing + '"]').trigger('click');

			$('[rel="editlink"]').attr('href', '#/settings/edit/' + _id);




			$itemEditor.find('[rel="name"]').val("Item title");
				$itemEditor.find('[rel="url"]').val("{{link}}");
				$itemEditor.find('[rel="value"]').val("0");
				$itemEditor.find('[rel="original_title"]').text("Home");
				$itemEditor.find('[rel="type"]').text("common");


				$('[rel="target"]').removeClass('checked').find('input[type="checkbox"]').removeAttr('checked');
				$('[rel="target"]').find('.devicons').removeClass('icon-checkbox-active').addClass('icon-checkbox');

				$('[rel="showcorporate"]').addClass('checked').find('input[type="checkbox"]').attr('checked', true);
				$('[rel="showcorporate"]').find('.devicons').removeClass('icon-checkbox').addClass('icon-checkbox-active');

				$('[rel="showbranch"]').addClass('checked').find('input[type="checkbox"]').attr('checked', true);
				$('[rel="showbranch"]').find('.devicons').removeClass('icon-checkbox').addClass('icon-checkbox-active');

				$('[rel="showlosite"]').addClass('checked').find('input[type="checkbox"]').attr('checked', true);
				$('[rel="showlosite"]').find('.devicons').removeClass('icon-checkbox').addClass('icon-checkbox-active');


				devtools.redirectTo('settings/edit/' + _id);


			return false;
		}
		$('.minitabs li').first().find('a').trigger('click');
		$('.item-editor [rel="name"]').trigger('focus');
	}, firstTimeMenu: function(){
		alert("Trying to find menu settings in DB we found that the table content is being " +
			"used for something else, do you want to erase the content and format to use it to save menu settings?");
		devtools.redirectTo('settings/create');
	}, toggleMenus: function(){
        var id = $('#menu').val(),
			id = $('#menu option[value="' + id + '"]').attr('data-id');


        for(var i=0; i<menu.length; i++)
        {
            if(menu[i].id == id)
            {
                activeMenu = i;
            }
        }

        $('.editor > ul').removeClass('active');
        $('.editor > ul[data-id="' + id + '"]').addClass('active');
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
            items += '<li class="menu-item"><div><span class="clearfix"></span><div class="opt tooltip-item move-children" title="Move to first level"><span class="devicons icon-move-children-top"></span></div><div class="sort tooltip-item" title="Drag to move"><i class="devicons icon-move-icon"></i></div> <span data-link="' + menuData[i].url + '" class="item-title" data-target="' + menuData[i].target + '" data-id="' + menuData[i].id + '" data-value="' + menuData[i].value + '" data-type="' + menuData[i].type + '" data-showbranch="' + menuData[i].showbranch + '" data-showcorporate="' + menuData[i].showcorporate + '" data-showlosite="' + menuData[i].showlosite + '" data-original-title="' + menuData[i].original_title + '">' + menuData[i].name + '</span><div class="opt-group"><a href="javascript:;" class="btn-add opt nofloat" data-id="' + menuData[i].id + '"><i class="icon-add devicons"></i></a><a href="javascript:;" class="edit-it opt nofloat" data-id="' + menuData[i].id + '"><i class="icon-edit devicons"></i></a><a href="javascript:;" class="remove-it opt nofloat" data-id="' + menuData[i].id + '"><i class="devicons icon-remove"></i></a></div></div>';
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
            "data-type='" + menu[index].type + "'>" + items + "</ul>");
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
                    "data-id='" + menu[i].id + "' data-type='" + menu[i].type + "'>" + menu[i].name + "</option>";
                devtools.inc.generateSingleMenu(i);
            })(i);
        }

		$("#menu").html(menuDrop).val(0).trigger("change");

        Status.add("editor-ready");
        checkPluginState();


	 }, events: function(){

	 	$('.body')

            .on('change', '#menu', function(){
				if( $(this).val() == -1 ){
					devtools.redirectTo('settings/create');

					$(this).val(0).trigger('change');

					return true;
				}

                devtools.inc.toggleMenus();
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
					menuId = $('#menuIdEdited');

				if( menuName.val().trim().length > 0 )
				{
					$('.editor > ul[data-id="' + menuId.val() + '"]').attr('data-name', menuName.val());

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
					alert("Menu name must be not empty.");
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
						'data-id="' + slug + '" data-type="' + menuType + '"></ul>');

					$('#menu').append('<option value="' + menu.length + '" ' +
                        'data-id="' + slug + '" data-type="' + menuType + '">' + menuName + '</option>');
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
                        message: 'Please fill the menu name and menu type.'
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
                $('.menu-item > div').removeClass('active');
                $(this).closest('.menu-item').find('div').first().addClass('active');
                var _id = $(this).attr('data-id'),
                    ItemTop = $(this).closest('li').position().top;
                Status.quit("editing");
                Que(function(){
                    devtools.inc.editItem(_id);

                    positionateItemEditPopUp(ItemTop);

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
		    var name = $('[rel="name"]').val(),
                url = $('[rel="url"]').val(),
                value = $('[rel="value"]').val(),
                original_title = $('[rel="original_title"]').text(),
                type = $('[rel="type"]').text(),
                target = $('[rel="target"] input[type="checkbox"]').is(":checked"),
                showcorporate = $('[rel="showcorporate"] input[type="checkbox"]').is(":checked"),
                showbranch = $('[rel="showbranch"] input[type="checkbox"]').is(":checked"),
                showlosite = $('[rel="showlosite"] input[type="checkbox"]').is(":checked");


		    var item = $('.editor .item-title[data-id="' + editing + '"]');
		    // console.log("editing: ", editing, item.length);

		    if (item.length > 0) {
		        item.text(name);
		        item.attr('data-link', url);
		        item.attr('data-type', type);
		        item.attr('data-target', target);
		        item.attr('data-value', value);
		        item.attr('data-showcorporate', showcorporate);
		        item.attr('data-showbranch', showbranch);
		        item.attr('data-showlosite', showlosite);
		        item.attr('data-original-title', original_title);

		    }






		    if (Status.is("nostored")) {

						Status.quit("nostored"); Status.add("stored");
						Status.quit("editing");

						if(cola["save"]!=undefined){ clearTimeout(cola["save"]); }
						cola["save"] = setTimeout(function(){
							Status.quit("stored");
						}, 500);
			}




		})
            .on('click', '.btn-addplaceholder', function(){
                if($(this).hasClass('item-append')){
                    devtools.inc.editItem(0,true);
                }else{
                    devtools.inc.editItem(0,false);
                }
            })

            .on('click', '.btn-add', function(){
                var _id = 'menu_' + Math.random(0,10);
                _id = _id.replace(".",'');
                var newItem = '<li class="menu-item"><div><span class="clearfix"></span><div class="opt tooltip-item move-children" title="Move to first level"><span class="devicons icon-move-children-top"></span></div><div class="sort tooltip-item" title="Drag to move"><i class="devicons icon-move-icon"></i></div> <span data-link="{{link}}" class="item-title" data-target="false" data-value="0" data-type="common" data-showbranch="true" data-showcorporate="true" data-showlosite="true" data-original-title="Home" data-id="' + _id + '">Item title</span><div class="opt-group"><a href="javascript:;" class="btn-add opt nofloat" data-id="' + _id + '"><i class="icon-add devicons"></i></a><a href="javascript:;" class="edit-it opt nofloat" data-id="' + _id + '"><i class="icon-edit devicons"></i></a><a href="javascript:;" class="remove-it opt nofloat" data-id="' + _id + '"><i class="devicons icon-remove"></i></a></div></div></li>';

                editing = _id;

                var ul = $(this).closest('li').find('ul');
                if(ul.length>0){
                    ul.append(newItem);
                }else{
                    $(this).closest('li').append('<ul class="ui-sortable">' + newItem + '</ul>');
                }

                $('.edit-it[data-id="' + editing + '"]').trigger('click');
                $('.item-editor [rel="name"]').trigger('focus');

            })

            .on('click', '.cancel-btn', function(){
                Status.quit("editing");
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

			.on('keyup', '#search', function(e){
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
								r += '<a href="javascript:;" data-id="' + data[i].Content.ID + '" data-number="' + data[i].Content.Number + '"><li><span class="rtype">crm</span> <span class="rtitle">' + data[i].Content.Name + '</span></li></a>';
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
                            // alert("Deployment successfully. Menu sent to: " + deployto);
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

};