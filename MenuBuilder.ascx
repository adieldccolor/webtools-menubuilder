<link rel='stylesheet' href='//fonts.googleapis.com/css?family=Open+Sans:400,300|Open+Sans+Condensed:300|Plaster'>
<link rel="stylesheet" href="css/select2.min.css">
<link rel="stylesheet" href="css/style.css">

<div class="body">
    <div class="navigation">
        <div class="content-container">
            <div class="left-nav">
                <ul>

                    <li class="only-editor">
                        <label for="menu">MENU</label>
                        <select name="menu" id="menu" class="form-control select-dropdown" style="min-width: 150px">
                            <option value="-1">Loading...</option>
                        </select>
                    </li>

                    <li class="only-editor">
                        <label for="show">FILTER ITEMS</label>
                        <select name="show" id="show" class="form-control select-dropdown" style="min-width: 200px">
                            <option value="all">Show all</option>
                            <option value="corporate">Show only for corporate</option>
                            <option value="losite">Show only for officers</option>
                            <option value="branch">Show only for branches</option>
                        </select>
                    </li>



                </ul>
            </div>
            <div class="right-nav">
                <ul>
                    <li><a href="#/settings/menu">EDIT MENU</a></li>
                    <li><a href="#/settings/preview">PREVIEW</a></li>
                    <li><a href="#/settings/settings">SAVE</a></li>
                </ul>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>

    <div class="main-body">
        <div class="herolead">
            <div class="content-container">
                <div class="left-nav">
                    <ul class="tabs">
                        <li><span>show:</span></li>
                        <li class="active"><a href="javascript:" data-toggle="all">all</a></li>
                        <li><a href="javascript:" data-toggle="corporate">corporate</a></li>
                        <li><a href="javascript:" data-toggle="branch">branch</a></li>
                        <li><a href="javascript:" data-toggle="losite">lo site</a></li>
                    </ul>
                </div>
                <div class="right-nav">
                    <ul>
                        <li><a href="#/settings/preview" class="prev-btn">preview</a></li>
                        <li><a href="javascript:" class="btn-save">save <span class="miniprogress tooltip-item"
                                                                              title="Save changes"><span
                                class="miniprogress-bg">?</span></span></a></li>
                    </ul>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>

        <div class="workflow">
            <div class="content-container menu-editor-container">

                <div class="edition-column">

                    <div class="preview"></div>
                    <div class="editor">

                        <a href="javascript:" class="btn-addplaceholder-anchor">
                            <div class="btn-addplaceholder text-center">
                                <span class="devicons icon-add nofloat"></span>
                            </div></a>

                    </div>
                    <a href="javascript:" class="btn-addplaceholder-anchor">
                        <div class="btn-addplaceholder item-append text-center">
                            <span class="devicons icon-add nofloat"></span>
                        </div>
                    </a>

                </div>
                <div class="settings-column">

                    <div class="item-editor">
                        <a href="javascript:" class="pull-left cancel-btn btn btn-sm btn-default">&times;</a>
                        <h4>edit item <a href="javascript:" class="btn-save-inside pull-right" onclick="$('.btn-save').trigger('click')">save</a>
                        </h4>
                        <div class="form-group">
                            <input type="text" name="title" id="title" value="Loan Programs" rel="name">
                        </div>
                        <div class="minitabs">
                            <ul>
                                <li class="active"><a href="#/home">general</a></li>
                                <li><a href="#/home">settings</a></li>
                            </ul>
                        </div>

                        <!-- devtools.inc.parseTree($('.editor > ul > li > div > .item-title')) -->
                        <div class="minitab active">
                            <a href="#/settings/edit/" rel="editlink"><div class="form-group open-modal">
                                <div class="pull-right">
                                    <span class="devicons icon-modal tooltip-item" title="Click&nbsp;to&nbsp;change"></span>
                                </div>
                                <span class="text-title" rel="original_title">Loan Programs</span>
                                <span class="label label-type" rel="type">CRM</span>
                            </div></a>
                            <input type="hidden" name="value" id="value" rel="value">
                            <input type="hidden" name="url" id="url" rel="url">

                            <div class="form-group checkbox" rel="target">
                                <label for="target"><span class="devicons icon-checkbox"></span> OPEN LINK IN NEW TAB</label>
                                <input type="checkbox" name="target" id="target">
                            </div>
                        </div>
                        <div class="minitab">
                            <div class="form-group checkbox" rel="showcorporate">
                                <label for="showcorporate"><span class="devicons icon-checkbox"></span> SHOW IN CORPORATE</label>
                                <input type="checkbox" name="showcorporate" id="showcorporate">
                            </div>
                            <div class="form-group checkbox" rel="showbranch">
                                <label for="showbranch"><span class="devicons icon-checkbox"></span> SHOW IN BRANCHES</label>
                                <input type="checkbox" name="showbranch" id="showbranch">
                            </div>
                            <div class="form-group checkbox" rel="showlosite">
                                <label for="showconsultant"><span class="devicons icon-checkbox"></span> SHOW IN LO SITE</label>
                                <input type="checkbox" name="showconsultant" id="showconsultant">
                            </div>

                        </div>

                        <!-- end of item editor -->
                    </div>

                </div>

            </div>
        </div>

    </div>
















    <div class="status">
        <div class="progressbg"></div>
    </div>
    <div class="notifications">
        <ul>
            <!-- <li>Sign in to continue <a href="javascript:;" rel="close">&times;</a></li> -->
        </ul>
    </div>








    <div class="layer">
        <div class="content-container">
            <div class="layer-body">
                <div class="content-container">
                    <div class="navigation">
                        <div class="left-nav">
                            <ul>
                                <li><a href="#/home" class="icon-tools"><span><</span> Back</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="layer-content">


                        <div class="layer-box" data-layer="signin">
                            <h1>LOADING DEPENDECIES </h1>
                            <small>Please wait uuntil dependencies are loaded...</small>

                            <!--<form action="" id="signinform">
                                <div class="form-group">
                                    <label for="username">Username</label>
                                    <input type="text" name="username" id="username" placeholder="Username or email address" tabindex="1">
                                </div>
                                <div class="form-group">
                                    <label for="password">Password</label>
                                    <input type="password" name="password" id="password" placeholder="password" tabindex="1">
                                </div>
                                <div class="form-group">
                                    <input type="submit" class="btn btn-primary signinbtn" value="Sign In" tabindex="1">
                                </div>
                            </form>-->
                        </div>

                        <div class="layer-box" data-layer="signout">
                            <h1>PLEASE WAIT... </h1>
                            <!--<small>Please wait a while, signing out.</small>-->
                        </div>


                        <div class="layer-box" data-layer="create">
                            <h1>ADD NEW MENU</h1>
                            <small>Create a new menu.</small>

                            <form action="" id="newMenuForm">
                                <div class="form-group">
                                    <label for="menuName">Name:</label>
                                    <input type="text" onkeyup="$('#menuId').val(createSlug($(this).val()))" name="menuName" id="menuName" placeholder="Name of the new menu" />
                                </div>
                                <div class="form-group hidden">
                                    <label for="menuId">SLUG:</label>
                                    <input type="text" name="menuId" id="menuId" placeholder="SLUG:" readonly />
                                </div>


                                <div class="form-group">
                                    <label for="menuName">Type:</label>
                                    <div>
                                        <select name="menuType" id="menuType" class="form-control select-dropdown">
                                            <option value="">Select menu type</option>
                                            <option value="header">Header menu</option>
                                            <option value="footer">Footer menu</option>
                                            <option value="sidebar">Sidebar menu</option>
                                            <option value="other">Other menu</option>
                                        </select>
                                    </div>
                                </div>


                                <div class="form-group">
                                    &nbsp;
                                </div>


                                <div class="form-group">
                                    <input type="submit" class="btn btn-primary" value="Create" tabindex="1">
                                </div>
                            </form>

                        </div>



                        <div class="layer-box" data-layer="menu">
                            <h1>EDIT MENU</h1>
                            <small>Edit menu information</small>

                            <form action="" id="editMenuForm">
                                <div class="form-group">
                                    <label for="menuNameEdited">Name:</label>
                                    <input type="text" name="menuNameEdited" id="menuNameEdited" placeholder="Name of the menu" />
                                    <input type="hidden" name="menuIdEdited" id="menuIdEdited" placeholder="Name of the menu" />
                                </div>

                                <div class="form-group">
                                    <label for="menuTypeEdited">Type:</label>
                                   <div>
                                       <select name="menuTypeEdited" id="menuTypeEdited" class="form-control select-dropdown">
                                           <option value="">Select menu type</option>
                                           <option value="header">Header menu</option>
                                           <option value="footer">Footer menu</option>
                                           <option value="sidebar">Sidebar menu</option>
                                           <option value="other">Other menu</option>
                                       </select>
                                   </div>
                                </div>


                                <div class="form-group">
                                    <label for="menuPublishedEdited">Publish status</label>
                                    <div>
                                        <select name="menuPublishedEdited" id="menuPublishedEdited" class="form-control select-dropdown">
                                            <option value="true">Published</option>
                                            <option value="false">Unpublished</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group">
                                    &nbsp;
                                </div>

                                <div class="form-group">
                                    <input type="submit" class="btn btn-primary" value="Update" tabindex="1">

                                    <a href="javascript:;" class="btn btn-danger removeMenu">Delete</a>

                                    <a href="#/home" class="btn btn-default">Cancel</a>
                                </div>


                            </form>

                        </div>




                        <div class="layer-box" data-layer="settings">
                            <h1>DEPLOYMENT</h1>
                            <small>Deploy current settings to any enviroment.</small>

                        </div>

                        <div class="layer-box" data-layer="edit">
                            <h1>EDIT</h1>
                            <small>Edit item target</small>

                            <ul class="filtertabs">
                                <li class="active"><a href="javascript:">content editor</a></li>
                                <li><a href="javascript:">url</a></li>
                            </ul>

                            <div class="filtertab active">
                                <input type="text" name="search" id="search" value="Start typing..." onfocus="if(this.value=='Start typing...'){this.value=''}">

                                <ul class="results">

                                </ul>
                            </div>
                            <div class="filtertab">
                                <div class="form-group">
                                    <label for="curl_title">Title</label>
                                    <input type="text" name="curl_title" id="curl_title">
                                </div>
                                <div class="form-group">
                                    <label for="curl_url">URL</label>
                                    <input type="text" name="curl_url" id="curl_url">
                                </div>
                                <div class="form-group">
                                    <a href="javascript:" class="btn btn-success set-url">Ok</a>
                                </div>

                            </div>



                        </div>








                        <div class="layer-box" data-layer="preview">
                            <h1>PREVIEW</h1>
                            <small>Preview menu</small>

                            <div class="preview-screen">



                                <div class="navbar navbar-static-top header" id="top" role="banner"> <!-- .header -->
                                    <div class="content-container">
                                        <div class="navbar-header">
                                            <button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target=".bs-navbar-collapse">
                                                <span class="sr-only">Toggle navigation</span>
                                                <span class="icon-bar"></span>
                                                <span class="icon-bar"></span>
                                                <span class="icon-bar"></span>
                                            </button>
                                            <a href="../" class="navbar-brand">LOGO</a>
                                        </div>
                                        <div class="collapse navbar-collapse bs-navbar-collapse nav" role="navigation"> <!-- .nav -->
                                            <ul class="nav navbar-nav">
                                                <!-- <li>
                                                  <a href="../getting-started/">Getting started</a>
                                                </li>
                                                <li>
                                                  <a href="../css/">CSS</a>
                                                </li>
                                                <li>
                                                  <a href="../components/">Components</a>
                                                </li>
                                                <li>
                                                  <a href="../javascript/">JavaScript</a>
                                                </li>
                                                <li class="dropdown">
                                                  <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Dropdown <span class="caret"></span></a>
                                                  <ul class="dropdown-menu" role="menu">
                                                    <li><a href="#">Action</a></li>
                                                    <li><a href="#">Another action</a></li>
                                                    <li><a href="#">Something else here</a></li>
                                                    <li class="divider"></li>
                                                    <li><a href="#">Separated link</a></li>
                                                  </ul>
                                                </li> -->
                                            </ul>

                                        </div> <!-- .nav -->
                                    </div>
                                </div> <!-- .header -->



                            </div>

                        </div>




                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="layer-bg"></div>


    <div class="confirmation-modal" id="confirm-modal">
        <div class="overlay"></div>

        <div class="confirmation-modal-content">
            <div class="confirmation-modal-content-wrapper">
                <div class="content-wrapper">
                    <div class="modal-title"></div>
                    <div class="modal-message"></div>
                </div>

                <div class="content-footer">
                    <a href="javascript:;" class="modal-confirmation-accept">Agree</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Core libraries -->
<script src="js/jquery-1.11.0.min.js"></script>
<script src="js/director.min.js"></script>
<script src="js/select2.min.js"></script>
<script src="js/TweenMax.min.js"></script>
<script src="js/modal-dialog.js"></script>
<script src="js/devtools.js"></script>

<!-- From dependencies -->
<script src="js/jquery-ui.js"></script>
<script src="js/jquery.mjs.nestedSortable.js"></script>
<!-- From dependencies -->