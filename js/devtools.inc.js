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
    var index = -1, i;
    for( i=0; i<arr.length; i++ ){
        if( arr[i][key] == value ){
            index = i;
            i = arr.length;
        }
    }

    return index;
}

function setArrayValue(parent, children){
    if( menuDevData[parent].subtree == undefined ){
        menuDevData[parent].subtree = [];
    }


    //add it as children
    menuDevData[parent].subtree.push( menuDevData[children] );

    //remove it from first level
    menuDevData.splice(children, 1);
}

function parseMenuTree(data){
    var i;

    for( i=0; i<data.length; i++ ){
        if( data[i].parent_id.length > 0 ){
            var index = findIndex(data[i].parent_id, 'id', data);
            if(index>-1){
                setArrayValue(index, i);
            }
        }
    }

    if( arguments.length > 1 ){
        arguments[1]();
    }
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

		var m = devtools.inc.parseTree($('.editor > ul > li > div > .item-title')), mm = "";
        menuDevData = m;
        menuData = menuDevData;
        parseMenuTree(m);
        m = menuDevData;

		// console.log(m);
		for(i=0; i<m.length; i++){


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

			$('.preview-screen [role="navigation"] ul').html(mm);


		}



	}, parseTree: function(ul){
		var tags = [],
			_self = this, 
			data = [],
			id = 0;
		// ul.each(function(_index){
		for(i=0; i<ul.length; i++){
			data = [];
			var subtree = ul.eq(i).closest('li').find('ul').find('li').find('.item-title');
			id = ul.eq(i).attr('data-id');
			data = devtools.inc.returnData(id);
            data.index = i;

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
                for( x=0; x<subtree.length; x++ ){
                    var children = devtools.inc.returnData(subtree.eq(x).attr('data-id'));
                    children.parent_id = id;
                    children.index = x;
                    tags.push(children);
                }
            }



			tags.push(data);
		
		// });
		}


		// return data;
		return tags;
	}, editItem: function(id,append){
		var found = $('.editor .item-title[data-id="' + id + '"]').length > 0,
			item = $('.editor .item-title[data-id="' + id + '"]');
			append = append!=undefined ? append : false;
		var $itemEditor = $('.item-editor');
        if(found){

				// console.log(menuData[editIndex]);
				$itemEditor.find('[rel="name"]').val(item.text());
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
		alert("Trying to find menu settings in DB we found that the table content is being used for something else, do you want to erase the content and format to use it to save menu settings?");
	}, loadMenu: function(){
	 	// console.log(menuData);
	 	var _self = this;
	 	var enableMenu = false;



        $.ajax({
            url: "get.php?id=90&json=true&s=" + currentSite,
            success: function(res){
                // console.log(res);
                if(typeof res != "object"
                    || res.length==0 || res.toString().length<5
                    || res.indexOf('<')>-1 || res.indexOf('lorem')>-1){
                    console.log("Menu from CRM is empty.");
                    devtools.inc.firstTimeMenu();
                }else{
                    menuData = res[activeMenu].data;
                    menuDevData = res[activeMenu].data;
					menu = res;
                    // console.log(menuData);
                    console.log("Menu from CRM is loaded successfully.");
                    function generateMenu(){
                        devtools.inc.genMenu();
                        return true;
                    }

                    parseMenuTree(menuDevData, generateMenu);
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
        "data-name='" + menu[index].name + "' data-id='" + menu[index].id + "'>" + items + "</ul>");
    },
    genMenu: function(){
	 	var items = "", i;
	 	//menuData = eval(menuData);
        menuData = menuDevData;

        console.log(menuData);
        for( i = 0; i < menu.length; i ++ ){
            (function(){
                devtools.inc.generateSingleMenu(i);
            })(i);
        }

        Status.add("editor-ready");
        checkPluginState();


	 }, events: function(){

	 	$('.body')
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
                item.remove();
                Status.quit('editing nostored storing');
                Status.add('nostored');

                for(i=0; i<menuDevData.length; i++){
                    if(menuDevData[i].id==id){
                        menuDevData.splice(i,1);
                    }else{
                        for(x=0; x<menuDevData[i].subtree.length; x++){
                            if(menuDevData[i].subtree[x].id==id){
                                menuDevData[i].subtree.splice(x,1);
                            }
                        }
                    }
                }


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
		        var m = devtools.inc.parseTree($('.editor > ul li > div > .item-title'));
					
					$.ajax({
					    url: 'saveContent.php?cid=90&s=' + currentSite,
					    type: "POST",
					    data: {"content": JSON.stringify(m)},
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

			.on('keyup change', '#search', function(e){
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