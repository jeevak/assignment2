/**
 * Created by jeevak on 6/8/14.
 */


$("#login-form").click(function (e) {
    e.stopPropagation();
    $(".login-credentials").show();
    var restaurantRef = new Firebase('https://jeevak-example.firebaseio.com/restaurants');
    var query = restaurantRef.limit(10);
    $("#listOfRestaurants").append("<option selected=\"selected\">Select a restaurant</option>")
    query.on('child_added', function (snapshot) {
        var value = snapshot.val();
        if (value != null) {
            $("#listOfRestaurants").append("<option value= '" + snapshot.name() + "'>" + value.name + "</option>");
        } else {
            alert("Firebase repository is empty. Populate it with a list of restaurants and menu items using JSON.")
        }
    });
    $("#restaurants").show();
});

$("#listOfRestaurants").change(function () {
    $("#ready").hide();
    var choice = $("#listOfRestaurants").val();
    $("#menuitems").hide();
    $("#menuitems").empty();
    //var menuURL= "https://jeevak-example.firebaseio.com/restaurants/"+choice+"/menu";
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
    orderRef.push({"user": "default", "restaurant": $("#listOfRestaurants option:selected").text(), "order": checkValues});
});

$('#cancel').click(function () {
    location.reload();
});


