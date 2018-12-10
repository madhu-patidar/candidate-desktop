// $('.owl-carousel').owlCarousel({
//     loop:true,
//     margin:10,
//     nav:true,
//     responsive:{
//         0:{
//             items:1
//         },
//         600:{
//             items:3
//         },
//         1000:{
//             items:5
//         }
//     }
// })




function myfunction(){
    alert('hello')
}

var geocoder;
var map;
function initialize(address) {
    // alert(address)
    // function initialize() {
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(-34.397, 150.644);
        var myOptions = {
          zoom: 8,
          center: latlng,
        mapTypeControl: true,
        mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
        navigationControl: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        if (geocoder) {
          geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
              map.setCenter(results[0].geometry.location);
    
                var infowindow = new google.maps.InfoWindow(
                    { content: '<b>'+address+'</b>',
                      size: new google.maps.Size(150,50)
                    });
    
                var marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map, 
                    title:address
                }); 
                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map,marker);
                });
    
              } else {
                alert("No results found");
              }
            } else {
              alert("Geocode was not successful for the following reason: " + status);
            }
          });
        }
    //   }
}

function initializePoint(Lat, Long, json) {
    var geocoder = new google.maps.Geocoder();
    var address = "new york";

    geocoder.geocode( { 'address': address}, function(results, status) {

    if (status == google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
    var longitude = results[0].geometry.location.lng();
        alert(latitude);
        alert(longitude);
        } 

        Lat = latitude;
        Long = longitude
    }); 
   
    if (Lat != 0) {
        // Creating a new map
        var map = new google.maps.Map(document.getElementById("map_canvas"), {
            center: new google.maps.LatLng(Lat, Long),
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        // Creating a global infoWindow object that will be reused by all markers

        var infoWindow = new google.maps.InfoWindow();
        // Looping through the JSON data
        for (var i in json) {
            
            var data = json[i],
               latLng = new google.maps.LatLng(data.lat, data.lng);
            // Creating a marker and putting it on the map
            var marker = new google.maps.Marker({
                position: latLng,
                map: map
            });
            // Creating a closure to retain the correct data, notice how I pass the current data in the loop into the closure (marker, data)
            (function (marker, data) {        
                // Attaching a click event to the current marker
                google.maps.event.addListener(marker, "click", function (e) {
                    infoWindow.setContent("<div style='width:280px;height:90px;text-align:left;z-index:1000;'><strong>" + data.address  + "</div>");
                    infoWindow.open(map, marker);
                    infoWindow.style.height = "205px";
                });
            })(marker, data);
            if (i == 0)
                break;
        }
        document.getElementById("map_canvas").style.display = "block";
    } else {
        document.getElementById("map_canvas").style.display = "none";
    }
}



function viewSharedLink(vHandler, sJobCode, jobTitle) {
    var vHostName = "http://careers.wipro.com/share-search-for-jobs.aspx?jobcode=" + sJobCode + "&#divsh"; //document.location.hostname;
    var vJobTitle = "Opening for " + jobTitle + " -";
    if (vHandler == 'LI')
    window
    .open(
    "http://www.linkedin.com/shareArticle?mini=true&url="
    + vHostName + "&summary="
    + encodeURIComponent(vJobTitle)
    + "&ro=false&title=Job Requirement in Wipro",
    "",
    'alwaysRaised,location=no,menubar=no,resizable=yes,scrollbars=yes,status=yes,width=500,height=500,top=10,left=10');
    else if (vHandler == 'FB')
    window
    .open(
    "http://www.facebook.com/sharer/sharer.php?u=" + vHostName
    + "&title=" + encodeURIComponent(vJobTitle)
    + "&ro=false",
    "",
    'alwaysRaised,location=no,menubar=no,resizable=yes,scrollbars=yes,status=yes,width=500,height=500,top=10,left=10');
    else if (vHandler == 'TW')
    window
    .open(
    "https://twitter.com/intent/tweet?url=" + vHostName
    + "&text=" + encodeURIComponent(vJobTitle)
    + "&ro=false",
    "",
    'alwaysRaised,location=no,menubar=no,resizable=yes,scrollbars=yes,status=yes,width=500,height=500,top=10,left=10');
    else if (vHandler == 'GP')
    window
    .open(
    "https://plus.google.com/share?url=" + vHostName
    + "&ro=false&title="
    + encodeURIComponent(vJobTitle),
    "",
    'alwaysRaised,location=no,menubar=no,resizable=yes,scrollbars=yes,status=yes,width=500,height=500,top=10,left=10');
    else if (vHandler == 'MA') {
    var mailContent = "mailto:?subject=Recruitment at Wipro&body="
    + encodeURIComponent(vJobTitle) + "%0D%0A" + "Please click on "
    + vHostName + " to view complete job description.";
    window.location.href = mailContent;
    } else
    alert("Data is invalid");
    }
