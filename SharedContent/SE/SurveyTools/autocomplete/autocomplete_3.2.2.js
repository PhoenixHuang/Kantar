/**
 * autocomplete class
 * Inherits from SESurveyTool
 */
function autocomplete(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
autocomplete.prototype = Object.create(SESurveyTool.prototype);
autocomplete.prototype.type = function() {
    return "autocomplete";
}
autocomplete.prototype.getDependencies = function() {
    return [];
}

autocomplete.prototype.setInitialResponses = function() {


}
autocomplete.prototype.setResponses = function() {
	var selected = this.component.find('input').val();
    $.each(this.inputs, function(i, e) {
        var el = $(e);
        label = el.parent().find('label').clone();
        var rowDescription = $.trim(label.text().split("|")[0]);
        if (rowDescription == selected) {
			$(e).prop("checked", true);
            $(e).attr('checked', 'checked');
        } 

    });
}
autocomplete.prototype.build = function() {
	$("head").append("<style>.autocomplete-items{position:absolute;border:1px solid #d4d4d4;border-bottom:none;border-top:none;z-index:99;top:100%;left:0;right:0}.autocomplete-items div{padding:10px;cursor:pointer;background-color:#fff;border-bottom:1px solid #d4d4d4}.autocomplete-items div:hover{background-color:"+this.getProperty('dropdownhoverbgcolor')+"}.autocomplete-active{background-color:"+this.getProperty('dropdownactivebgcolor')+" !important;color:#"+this.getProperty('dropdownactivecolor')+"}</style>");
    var that = this;
	var selected = "";
	var active = "";
	this.values = [];
    $.each(this.inputs, function(i, e) {
        var el = $(e);
        label = el.parent().find('label').clone();
        var rowDescription = $.trim(label.text().split("|")[0]);
		that.values.push(rowDescription);
        if (el.is(":checked")) {
			active = "active";
            selected = rowDescription;
        } 

    });
	
	this.input='<div class="md-form autocomplete"><input type="text" id="autocomplete_'+this.questionFullName+'" class="form-control mdb-autocomplete" value="'+selected+'"><label for="autocomplete_'+this.questionFullName+'" class="'+active+'">'+this.getProperty("searchablestring")+'</label></div>';
	
    this.deferred.resolve();
}
autocomplete.prototype.render = function() {
	var that = this;
    this.componentContainer = $('<div>');
    this.componentContainer.append(this.nativeContainer.find(".question-text").clone());
    this.componentContainer.attr('id', 'qc_' + this.questionFullName); //change to be more identifable with question?
    this.componentContainer.addClass('qcContainer');
    this.component = $("<div class='col-sm-12 question-component'>");
    this.component.append(this.input);
    this.componentContainer.append(this.component);
    this.nativeContainer.after(this.componentContainer);
    this.nativeContainer.find(".otherbuttons").appendTo(this.component);
    this.nativeContainer.hide();
	autocompleteRender(document.getElementById("autocomplete_"+this.questionFullName), that.values, this.getProperty("searchstartlength"));
}


autocomplete.prototype.toolOptions = function() {
    return {
		searchstartlength: 2,
		searchablestring : "Search here...",
		dropdownhoverbgcolor : "#e4e4e4",		
		dropdownactivebgcolor : "#00838f",
		dropdownactivecolor : "#fff"
    }
}

function autocompleteRender(inp, arr, len) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
		
		var matchPOS = arr[i].toUpperCase().indexOf(val.toUpperCase())
        if (arr[i].substr(matchPOS, val.length).toUpperCase() == val.toUpperCase() && val.length >= len) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
		   b.innerHTML = arr[i];
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}