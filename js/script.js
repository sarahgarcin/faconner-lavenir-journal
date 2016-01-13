//$(document).ready(function(){
    $.fn.hasOverflow = function () {
        var el = $(this)[0];
        return el.scrollHeight > el.clientHeight;
    };
    $.fn.isTable = function () {
        var el = $(this)[0];
        return el.nodeType === 1 && (el.tagName || '').toUpperCase() === 'TABLE';
    };

    $.fn.isImages = function(){
    	var el = $(this)[0];
    	return el.nodeType === 1 && (el.tagName || '').toUpperCase() === 'IMG';
    }

    $.fn.withColumns = function(){
        var el = $(this);
        return el.is('[class^="columns"]');
    }

    var g = {}; // Globals

    function makePage(template) {
        console.log('Making a new page');
        var clone = $('.page').first().clone();
        $(clone).find('.page-body').empty();
        $(clone).appendTo('.printview');
        g.currentPage = clone;
        g.currentPbody  =  getPageBody(clone);
        return $(clone).hasOverflow()? undefined: clone;
    }

    function getPageBody(page) {
        //console.log('Getting the page-body');
        var currentPage = page || makePage();
        return currentPage.find('.page-body');
    }

    function paginate(content,  page, cont) {
        //console.log('pagination initiated');
        if (!Object.hasOwnProperty(g, 'currentPage')){
            g.currentPage = page || makePage();
        }
        if (!Object.hasOwnProperty(g, 'currentPbody')){
            g.currentPbody = getPageBody(page || g.currentPage || MakePage());
        }
        var currentContent = $(content),
            container;
        if (currentContent.withColumns()){
            container = currentContent.clone().empty().appendTo(g.currentPbody);
        } else if (currentContent.parent().withColumns() && cont){
            container = cont;
        } else {
            container = null;
        }
        //console.log(container);
        if (currentContent.isTable()) {
            console.log('working with a table');
            paginateTable(currentContent, g.currentPage);
        } else if (currentContent.children().size()>0) {
            //console.log('element has childrens');
            //console.log(container);
            var i = 0,
                childrens = currentContent.children(),
                l = childrens.size(),
                child;
            for (; i < l; i++) {
                child = childrens[i];
                paginate( child,  g.currentPage, container);
            }
        } else {
            //console.log('working with text content');
            paginateText(currentContent, g.currentPage, container);
        }
        if(currentContent.isImages()){
        	console.log('working with images');
					//var currentImagesbody = getPageBody(page || g.currentPage || getMakePage());
					// console.log(currentImagesbody.hasOverflow());        	

          // paginateImages(currentContent, g.currentPage, container);
        }
    }

    function paginateText(node, page, cont) {
        var currentPbody = getPageBody(page || g.currentPage || getMakePage()),
            container = node.clone().empty(),
            contentText = node.text(),
            wordArray = contentText.split(" "),
            currentText = "",
            i = 0,
            l = wordArray.length,
            oldText,
            word;
        container.appendTo(cont ? cont : currentPbody);
        //console.log(currentPbody);    
        for (; i < l; i++) {
            word = wordArray[i];
            oldText = currentText;
            currentText += word + " ";
            container.text(currentText);
            if (currentPbody.hasOverflow()) {
                //console.log('in text has encountred overflow');
                container.text(oldText);
                //console.log([word, wordArray.slice(i)]);
                paginate(
                    node.clone().empty().text(wordArray.slice(i - 1).join(' ')),
                    makePage()
                );
                break;
            }
        }
    }

    function paginateTable(table, page, cont) {    
        var currentPbody = getPageBody(page || g.currentPage || makePage()),
            container = cont || table.clone(),
            currentTbody = container.find('tbody'),
            currentRows = container.find('tbody > tr'),
            i = 0,
            l = currentRows.length,
            row;
        
        currentTbody.empty();
        container.appendTo(currentPbody);
        for (; i < l; i++) {
            row = $(currentRows[i]);
            currentTbody.append(row);
            if (currentPbody.hasOverflow()) {
                //console.log('in table has encountred overflow');
                //console.log([container, container.find('tbody > tr').length]);
                //console.log([i, container.has(currentTbody) ? 'Sim' : 'Não']);
                row.detach();
                container = $(container).clone();
                currentTbody = container.find('tbody');
                currentTbody.empty().append(currentRows.slice(i));
                //console.log([container, currentTbody.find('tr').length]);
                paginate(container, makePage());
                break;
            }
        }
    }

    function paginateImages(node, page, cont) {
      var currentPbody = getPageBody(page || g.currentPage || getMakePage());
      var container = node.clone().empty();
      //console.log(node.clone());
      //console.log(currentPbody);    
      if (currentPbody.hasOverflow()) {
      		console.log(container);
          // paginate(
          //     container, 
          //     makePage()
          // );
      }
  	}

    $(function () {
        /* insert content and generate regions */
        paginate(
            $('.content'),
            $('.page')
        );
        /* remove pages without content
        $('.page').each(function(){
            var pbody = $(this).find('.page-body');
            if (pbody.text().length===0){
                $(this).remove();
            }
        });*/
        /* define page numbers and add current date */
        var pages = $('.page').length,
            date = new Date(),
            tDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        $('.page').each(function (i, p) {
            var foot = $(p).find('.page-footer');
            $(foot).html(
                '<span style="float: left;">' + tDate + '</span><span style="float: right">Page ' + (1 + i) + ' sur ' + pages + '</span>');
        });
        $('#print').click(function (ev) {
            window.print();
        });
        console.log($('.page').size());
    });

//});



// $(document).ready(function(){

// 	var A4Height = 29.7;
// 	var centimeter = 0.02645833;

// 	var $content = $(".page .content");
// 	var contentHeight = $content.height();
// 	var contentWidth = $content.width();
// 	var contentHeightCm = contentHeight*centimeter;
// 	var contentWidthCm = contentWidth * centimeter;
// 	var $paragraphe = $(".page .content .article");

// 	var htmlText = [];
// 	var totalWidth=0;
// 	var numberOfPages = [];
// 	//overflowText();
// 	//recursive();
// 	calculRightText();

// 	function calculRightText(){
// 		$paragraphe.each(function(){
// 			var pWidth = $(this).width();
// 			var offset = $(this).offset();
// 			totalWidth = totalWidth + pWidth;
// 			totalWidthCm = totalWidth * centimeter;
// 			//console.log(Math.floor(totalWidthCm / 19.5));
// 			numberOfPages.push(Math.floor(totalWidthCm / 19.5));
					
// 		});
// 		var number = numberOfPages[numberOfPages.length-1];
// 		for(var i=0; i<=number; i++){
// 			$('body').append('<div class="page"><div class="marge vertical-align"><div class="content"></div></div></div>');
// 		}
// 	}

// 	function overflowText(){
// 		$paragraphe.each(function(){
// 			var pHeight = $(this).height();
// 			var offset = $(this).offset();
// 			var offesetLeftCm = offset.left * centimeter;
// 			var $parent = $(this).parent();
// 			console.log(offesetLeftCm);
// 			if(offesetLeftCm > 19.5){
// 				$(this).remove();
// 				//htmlText = $(this).html();
// 				htmlText.push($(this).html());
// 				//console.log(htmlText);
// 				//$('body').append('<div class="page"><div class="marge vertical-align"><div class="content"><div class="article"'+htmlText+'</div></div></div></div>');
// 			}
// 		});
// 		$('body').append('<div class="page"><div class="marge vertical-align"><div class="content"><div class="article"'+htmlText+'</div></div></div></div>');
// 	}	
    

// 	// //get text and explode it as an array
// 	// var p1text = p1.text();
// 	// p1text = p1text.split('');

// 	// //prepare p2 text
// 	// p2text = [];

// 	// //if greater height
// 	// while (p1Height > cont1Height) {

// 	//     //remove last character
// 	//     lastChar = p1text.pop();

// 	//     //prepend to p2 text
// 	//     p2text.unshift(lastChar);

// 	//     //reassemble p1 text
// 	//     p1temp = p1text.join('');

// 	//     //place back to p1
// 	//     p1.text(p1temp);

// 	//     //re-evaluate height
// 	//     p1Height = p1.height();

// 	//     //loop
// 	// }

// 	// //if less than, assemble p2 text and render to p2 container
// 	// p2.text(p2text.join(''));​
// });
