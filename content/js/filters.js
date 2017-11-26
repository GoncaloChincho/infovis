activeFilters = ['dist-top15'];
styleActiveClass = 'nice-button-active';

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

function activateFilterBtns() {
    var btns = $(".filterbtn");
    for(i = 0; i < btns.length;i++){
        var button  = $(btns[i]);
        if(activeFilters.includes(button.val())){
            button.addClass(styleActiveClass);  
        }
        else{
            button.removeClass(styleActiveClass);
        }
    }
}

function removeOtherFilters(currFilter){
    var str = currFilter.split("-")[0];
    for(i = activeFilters.length - 1; i >= 0;i--){
        if(activeFilters[i].split("-")[0] != str){
            activeFilters.splice(i,1);
        }
    }
    
}

$(document).ready(function(){
    activateFilterBtns();
    $(".nice-button").click(function(){
       var item = $(this);
       var filter = item.val();
       if(item.hasClass(styleActiveClass)){
           item.removeClass(styleActiveClass);
           activeFilters.splice(activeFilters.indexOf(filter),1);
           //remove filter
       }
       else{
           item.addClass(styleActiveClass);
           removeOtherFilters(filter);
           activeFilters.push(filter);
           //add filter
       }
       activateFilterBtns();
       console.log(activeFilters);
    });
});
