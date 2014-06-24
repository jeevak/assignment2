/**
 * Created by jeevak on 6/8/14.
 */


$("#login-form").click(function (e) {
    var username = $('.login-username').val().trim();
    var passwd = $('.login-password').val().trim();

    if ((username == '') || (passwd == '')) {
        e.stopPropagation();
        $(".login-credentials").show();
    } else {
        //console.log('Check credentials...');
        var loginRef = new Firebase('https://jeevak-example.firebaseio.com/users');
        var query = loginRef.limit(5);
        query.on('child_added', function (snapshot) {
            var value = snapshot.val();
            //console.log("Username: "+ value.username + " and password: "+ value.password);
            if ((value.username == username)&&(value.password==passwd)) {
                $(".ch-home").show();
                $(".ch-home").children("h1").html("Welcome "+username.charAt(0).toUpperCase()+username.slice(1)+" to Foodie.fi" );
                $(".ch-login").html("<button type=\"button\" class=\"btn btn-primary\">"+username.charAt(0).toUpperCase()+username.slice(1)+"</button>");
                sessionStorage.setItem("username",username);
            }
        });
    }
});

$(".ch-order").click(function(e){
    var restaurantRef = new Firebase('https://jeevak-example.firebaseio.com/restaurants');
    var listQuery = restaurantRef.limit(10);
    if($("#listOfRestaurants").children("option").length==0) {
        $("#listOfRestaurants").append("<option selected=\"selected\">Select a restaurant</option>")
        listQuery.on('child_added', function (snapshot) {
            var value = snapshot.val();
            if (value != null) {
                $("#listOfRestaurants").append("<option value= '" + snapshot.name() + "'>" + value.name + "</option>");
            } else {
                alert("Firebase repository is empty. Populate it with a list of restaurants and menu items using JSON.")
            }
        });
    }else{
        $("#listOfRestaurants option:eq(0)").prop("selected", true);
    }
    $("#restaurants").show();
});

$("#listOfRestaurants").change(function () {
    console.log("Tracking the change in the list choice...");
    $("#ready").hide();
    var choice = $("#listOfRestaurants").val();
    $("#menuitems").hide();
    $("#menuitems").empty();

    var menuRef = new Firebase("https://jeevak-example.firebaseio.com/restaurants/" + choice + "/menu");
    var query = menuRef.limit(10);

    query.on('child_added', function (snapshot) {
        var value = snapshot.val();
        if (value != null) {
            $("#menuitems").append("<input type=\"checkbox\" value= '" + value.itemName + "'>" + value.itemName + "</input><br>");
        } else {
            alert("No menu items for this restaurant. Check later.")
        }
    });
    $("#menuitems").show();

});

$('#menuitems').click(function () {
    if ($('input[type=checkbox]').is(":checked")) {
        $("#ready").show();
    }
    else {
        $("#ready").hide();
    }
});

$('#submit').click(function () {
    var checkValues = $('input[type=checkbox]:checked').map(function () {
        return $(this).val();
    }).get();
    var orderRef = new Firebase("https://jeevak-example.firebaseio.com/orders");
    orderRef.push({"user": sessionStorage.getItem("username") , "restaurant": $("#listOfRestaurants option:selected").text(), "order": checkValues});
    $(".modal-title").html("Order Submitted");
    $(".modal-body").children("p").html("You can now view this order in your order history");
    $('#ch-modal').modal('show')
});

$('#ch-modal').on('show.bs.modal', function (e) {
    // do something...
    $("#ready").hide();
    $('#menuitems').hide();
    $('#restaurants').hide();
});

$('#cancel').click(function () {
    $("#ready").hide();
    $('menuitems').hide();
    $('#restaurants').hide();
});


