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
        });

	}, returnData: function(id){
		var data = {};

		var item = $('.editor').find('.item-title[data-id="' + id + '"]').first();

		if(item.length > 0){
			data = {
				"name": item.text(),
				"url": item.attr('data-link'),
				"target": item.attr('data-target') == "true" ? true : false,
				"id": item.attr('data-id'),
				"data": {
					"showcorporate": item.attr('data-showcorporate') == "true" ? true : false,
					"showbranch": item.attr('data-showbranch') == "true" ? true : false,
					"showlosite": item.attr('data-showlosite') == "true" ? true : false,
					"type": item.attr('data-type'),
					"original_title": item.attr('data-original-title'),
					"value": item.attr('data-value')
				}
			}
		}

		// console.log(data);
		return data;
	}, previewMenu: function(view){

		var m = devtools.inc.parseTree($('.editor > ul > li > div > .item-title')), mm = "";
		// console.log(m);
		for(i=0; i<m.length; i++){


			m[i].url = m[i].url.replace(/{{link}}/g, "default.aspx?s=site");

			//show corporate
			if(view=='corporate'&&m[i].data.showcorporate){
				var hasSubthree = m[i].subthree!=undefined&&m[i].subthree.length>0?true:false;
				mm += '<li id="' + m[i].id + '" ' + (hasSubthree?'class="dropdown"':'') + ' >';
				mm += '<a href="' + m[i].url + '" ' + (m[i].target ? 'target="_blank"':'') + ' ' + (hasSubthree?'class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"':'') + '>' + m[i].name + (hasSubthree?' <span class="caret"></span>':'') + '</a>';
				if(hasSubthree){
					mm += '<ul class="dropdown-menu" role="menu">';
					
					for(x=0; x<m[i].subthree.length; x++){
						m[i].subthree[x].url = m[i].subthree[x].url.replace(/{{link}}/g, "default.aspx?s=site");
						mm += '<li><a href="' + m[i].subthree[x].url + '" ' + (m[i].subthree[x].target ? 'target="_blank"':'') + '>' + m[i].subthree[x].name + '</a></li>';
					}

					mm += '</ul>';
				}
			}else if(view=='losite'&&m[i].data.showlosite){
				var hasSubthree = m[i].subthree!=undefined&&m[i].subthree.length>0?true:false;
				mm += '<li id="' + m[i].id + '" ' + (hasSubthree?'class="dropdown"':'') + ' >';
				mm += '<a href="' + m[i].url + '" ' + (m[i].target ? 'target="_blank"':'') + ' ' + (hasSubthree?'class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"':'') + '>' + m[i].name + (hasSubthree?' <span class="caret"></span>':'') + '</a>';
				if(hasSubthree){
					mm += '<ul class="dropdown-menu" role="menu">';
					
					for(x=0; x<m[i].subthree.length; x++){
						m[i].subthree[x].url = m[i].subthree[x].url.replace(/{{link}}/g, "default.aspx?s=site");
						mm += '<li><a href="' + m[i].subthree[x].url + '" ' + (m[i].subthree[x].target ? 'target="_blank"':'') + '>' + m[i].subthree[x].name + '</a></li>';
					}

					mm += '</ul>';
				}
			}else if(view=='branch'&&m[i].data.showbranch){
				var hasSubthree = m[i].subthree!=undefined&&m[i].subthree.length>0?true:false;
				mm += '<li id="' + m[i].id + '" ' + (hasSubthree?'class="dropdown"':'') + ' >';
				mm += '<a href="' + m[i].url + '" ' + (m[i].target ? 'target="_blank"':'') + ' ' + (hasSubthree?'class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"':'') + '>' + m[i].name + (hasSubthree?' <span class="caret"></span>':'') + '</a>';
				if(hasSubthree){
					mm += '<ul class="dropdown-menu" role="menu">';
					
					for(x=0; x<m[i].subthree.length; x++){
						m[i].subthree[x].url = m[i].subthree[x].url.replace(/{{link}}/g, "default.aspx?s=site");
						mm += '<li><a href="' + m[i].subthree[x].url + '" ' + (m[i].subthree[x].target ? 'target="_blank"':'') + '>' + m[i].subthree[x].name + '</a></li>';
					}

					mm += '</ul>';
				}
			}else if(view=='all'){
				var hasSubthree = m[i].subthree!=undefined&&m[i].subthree.length>0?true:false;
				mm += '<li id="' + m[i].id + '" ' + (hasSubthree?'class="dropdown"':'') + ' >';
				mm += '<a href="' + m[i].url + '" ' + (m[i].target ? 'target="_blank"':'') + ' ' + (hasSubthree?'class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"':'') + '>' + m[i].name + (hasSubthree?' <span class="caret"></span>':'') + '</a>';
				if(hasSubthree){
					mm += '<ul class="dropdown-menu" role="menu">';
					
					for(x=0; x<m[i].subthree.length; x++){
						m[i].subthree[x].url = m[i].subthree[x].url.replace(/{{link}}/g, "default.aspx?s=site");
						mm += '<li><a href="' + m[i].subthree[x].url + '" ' + (m[i].subthree[x].target ? 'target="_blank"':'') + '>' + m[i].subthree[x].name + '</a></li>';
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
			if(subtree.length > 0){
				// alert("has subitems");
				// alert(subtree.length);
				// alert(data.toString());
				var subtreetags = [];
				for(x=0; x<subtree.length; x++){
					subtreetags.push(devtools.inc.returnData(subtree.eq(x).attr('data-id')));
				}
				// data.subthree = devtools.inc.parseTree(subtree);
				data.subthree = subtreetags;
		
			}else{
				// alert(data.toString(), "has not subitems");
			}
			tags.push(data);
		
		// });
		}


		// return data;
		return tags;
	}, editItem: function(id,append){
		var found = $('.editor .item-title[data-id="' + id + '"]').length > 0 ? true : false,
			item = $('.editor .item-title[data-id="' + id + '"]');
			append = append!=undefined ? append : false;
		if(found){

				// console.log(menuData[editIndex]);
				$('.item-editor').find('[rel="name"]').val(item.text());
				$('.item-editor').find('[rel="url"]').val(item.attr('data-link'));
				$('.item-editor').find('[rel="value"]').val(item.attr('data-value'));
				$('.item-editor').find('[rel="original_title"]').text(item.attr('data-original-title'));
				$('.item-editor').find('[rel="type"]').text(item.attr('data-type'));




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
				$('.editor > ul').append(newItem);
			}else{
				$('.editor > ul').prepend(newItem);
			}

			$('.edit-it[data-id="' + editing + '"]').trigger('click');

			$('[rel="editlink"]').attr('href', '#/settings/edit/' + _id);




			$('.item-editor').find('[rel="name"]').val("Item title");
				$('.item-editor').find('[rel="url"]').val("{{link}}");
				$('.item-editor').find('[rel="value"]').val("0");
				$('.item-editor').find('[rel="original_title"]').text("Home");
				$('.item-editor').find('[rel="type"]').text("common");


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
		    url: "menu.json",
		    success: function(res){
		    	// console.log(res);
		      if(typeof res != "object" || res.length==0 || res.toString().length<5 || res.indexOf('<')>-1 || res.indexOf('lorem')>-1){
		      	console.log("Menu from CRM is empty.");
		      	devtools.inc.firstTimeMenu();
		      }else{
		      	menuData = res;
		      	menuDevData = res;
		      	// console.log(menuData);
		      	console.log("Menu from CRM is loaded successfully.");
		      	devtools.inc.genMenu();
		      }
		    }
		});
	 }, genMenu: function(){
	 	var items = "";
	 	menuData = eval(menuData);
	 	// console.log(menuData[0].name);
	 	for(i=0;i<menuData.length;i++){
		// console.log(menuData[i].name);
		menuData[i].target = menuData[i].target.length==0 ? "default" : menuData[i].target;
		menuData[i].data.value = menuData[i].data.value!=undefined ? menuData[i].data.value : "";

		if(menuData[i].data.type=="link"){
			menuData[i].url = menuData[i].url.indexOf('//')>-1 || menuData[i].url.indexOf('://')>-1 || menuData[i].url.indexOf('http')>-1 ? menuData[i].url : "http://" + menuData[i].url;
		}else{
			menuData[i].url = menuData[i].url.replace('https://','http://');
		}
		items += '<li class="menu-item"><div><span class="clearfix"></span><div class="opt tooltip-item move-children" title="Move to first level"><span class="devicons icon-move-children-top"></span></div><div class="sort tooltip-item" title="Drag to move"><i class="devicons icon-move-icon"></i></div> <span data-link="' + menuData[i].url + '" class="item-title" data-target="' + menuData[i].target + '" data-id="' + menuData[i].id + '" data-value="' + menuData[i].data.value + '" data-type="' + menuData[i].data.type + '" data-showbranch="' + menuData[i].data.showbranch + '" data-showcorporate="' + menuData[i].data.showcorporate + '" data-showlosite="' + menuData[i].data.showlosite + '" data-original-title="' + menuData[i].data.original_title + '">' + menuData[i].name + '</span><div class="opt-group"><a href="javascript:;" class="btn-add opt nofloat" data-id="' + menuData[i].id + '"><i class="icon-add devicons"></i></a><a href="javascript:;" class="edit-it opt nofloat" data-id="' + menuData[i].id + '"><i class="icon-edit devicons"></i></a><a href="javascript:;" class="remove-it opt nofloat" data-id="' + menuData[i].id + '"><i class="devicons icon-remove"></i></a></div></div>';
			if(menuData[i].subthree!=undefined&&menuData[i].subthree.length>0){ 
				items += '<ul>';
				for(x=0;x<menuData[i].subthree.length;x++){
					// console.log(menuData[i].subthree[x].name);
					menuData[i].subthree[x].target = menuData[i].subthree[x].target.length==0 ? "default" : menuData[i].subthree[x].target;
					menuData[i].subthree[x].data.value = menuData[i].subthree[x].data.value!=undefined ? menuData[i].subthree[x].data.value : "";
					
					if(menuData[i].subthree[x].data.type=="link"){
						menuData[i].subthree[x].url = menuData[i].url.indexOf('//')>-1 || menuData[i].subthree[x].url.indexOf('://')>-1 || menuData[i].subthree[x].url.indexOf('http')>-1 ? menuData[i].subthree[x].url : "http://" + menuData[i].subthree[x].url;
					}else{
						menuData[i].subthree[x].url = menuData[i].subthree[x].url.replace('https://','http://');
					}
					items += '<li class="menu-item"><div><span class="clearfix"></span><div class="opt tooltip-item move-children" title="Move to first level"><span class="devicons icon-move-children-top"></span></div><div class="sort tooltip-item" title="Drag to move"><i class="devicons icon-move-icon"></i></div> <span data-link="' + menuData[i].subthree[x].url + '" class="item-title" data-target="' + menuData[i].subthree[x].target + '" data-value="' + menuData[i].subthree[x].data.value + '" data-type="' + menuData[i].subthree[x].data.type + '" data-showbranch="' + menuData[i].subthree[x].data.showbranch + '" data-showcorporate="' + menuData[i].subthree[x].data.showcorporate + '" data-showlosite="' + menuData[i].subthree[x].data.showlosite + '" data-original-title="' + menuData[i].subthree[x].data.original_title + '" data-id="' + menuData[i].subthree[x].id + '">' + menuData[i].subthree[x].name + '</span><div class="opt-group"><a href="javascript:;" class="btn-add opt nofloat" data-id="' + menuData[i].subthree[x].id + '"><i class="icon-add devicons"></i></a><a href="javascript:;" class="edit-it opt nofloat" data-id="' + menuData[i].subthree[x].id + '"><i class="icon-edit devicons"></i></a><a href="javascript:;" class="remove-it opt nofloat" data-id="' + menuData[i].subthree[x].id + '"><i class="devicons icon-remove"></i></a></div></div></li>';
				}
				items += '</ul>';
			}
			items += '</li>';
		}
		$('.editor').append("<ul>" + items + "</ul>");
		Status.add("editor-ready");
		checkPluginState();
	 }, events: function(){
	 	$('body').on('click', '.move-children', function(){
	 		var item = $(this).closest('li');

	 		if(item.find('ul').length>0){
	 			var subitems = item.find('ul').find('li');
	 			item.after(subitems);
	 		}

	 		$(this).closest('li').closest('ul').closest('li').after(item);

	 		Status.add('nostored');

	 	}).on('click', '.remove-it', function(){
	 		var item = $(this).closest('li');
	 		var id = $(this).attr('data-id');
	 		item.remove();
	 		Status.quit('editing nostored storing');
	 		Status.add('nostored');

	 		for(i=0; i<menuDevData.length; i++){
	 			if(menuDevData[i].id==id){
	 				menuDevData.splice(i,1);
	 			}else{
	 				for(x=0; x<menuDevData[i].subthree.length; x++){
	 					if(menuDevData[i].subthree[x].id==id){
	 						menuDevData[i].subthree.splice(x,1);
	 					}
	 				}
	 			}
	 		}


	 	}).on('change', '.checkbox input[type="checkbox"]', function(){
			if($(this).is(":checked")){
				$(this).closest('.checkbox').addClass('checked').find('.devicons').addClass('icon-checkbox-active').removeClass('icon-checkbox');
			}else{
				$(this).closest('.checkbox').removeClass('checked').find('.devicons').addClass('icon-checkbox').removeClass('icon-checkbox-active');
			}
		}).on('click', '.minitabs a', function(){
			$(this).parent().addClass('active').siblings().removeClass('active');

			$('.minitab').eq($(this).parent().index()).addClass('active').siblings().removeClass('active');
		}).on('click', '.edit-it', function(){
			$('.menu-item > div').removeClass('active');
			$(this).closest('.menu-item').find('div').first().addClass('active');
			var _id = $(this).attr('data-id');
			Status.quit("editing");
			Que(function(){
				devtools.inc.editItem(_id);
				Status.add("editing");
			}, 200);
		}).on('change', '.item-editor .checkbox input[type="checkbox"]', function(){
			Status.add("nostored");
		}).on('keyup', '[rel="name"]', function(e){
			if((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode == 189 || e.keyCode == 191) || e.keyCode==8){
				// console.log(e.keyCode, "matched");
				Status.add("nostored");
			}else{
				// console.log(e.keyCode, "not matched");
			}
		}).on('click', '.btn-save', function(){
				if(Status.is("nostored")){
					
					$.ajax({
						url: 'menu.json',
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


				//save item
				// console.log(editing, "save");
				var name =  			$('[rel="name"]').val(),
					url = 				$('[rel="url"]').val(),
					value = 			$('[rel="value"]').val(),
					original_title = 	$('[rel="original_title"]').text(),
					type = 				$('[rel="type"]').text(),
					target = 			$('[rel="target"] input[type="checkbox"]').is(":checked"),
					showcorporate =		$('[rel="showcorporate"] input[type="checkbox"]').is(":checked"),
					showbranch =		$('[rel="showbranch"] input[type="checkbox"]').is(":checked"),
					showlosite =		$('[rel="showlosite"] input[type="checkbox"]').is(":checked");


				var item = $('.editor .item-title[data-id="' + editing + '"]');
				// console.log("editing: ", editing, item.length);

				if(item.length > 0){
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

		}).on('click', '.btn-addplaceholder', function(){
			if($(this).hasClass('item-append')){
				devtools.inc.editItem(0,true);
			}else{
				devtools.inc.editItem(0,false);
			}
		}).on('click', '.btn-add', function(){
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

		}).on('click', '.cancel-btn', function(){
			Status.quit("editing");
		}).on('click', '.tabs a', function(){
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
		}).on('keyup change', '#search', function(e){
			if((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode == 189 || e.keyCode == 191) || e.keyCode==8 || e.keyCode==undefined){

				if(colas['search']!=undefined){
					clearTimeout(colas['search']);
				}

				colas['search'] = setTimeout(function(){
					$.ajax({
						url: 'contents.json',
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
			$.ajax({
				url: 'menu.json',
				success: function(data){
					console.log('deployed');
					devtools.redirectTo("home");
					setTimeout(function(){
						// alert("Deployment successfully. Menu sent to: " + deployto);
						Status.notify('Deployment successfully. Menu sent to: ' + deployto);
					}, 800);
				}
			});
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

}