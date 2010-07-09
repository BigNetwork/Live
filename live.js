var defaultTag = "lanparty";
var flickrTag  = defaultTag;
var twitterTag = defaultTag;
var youTubeTag = defaultTag;
var flickrURL  = "";
var twitterURL = "";
var youTubeURL = "";
var refreshDelay = 60000;

$(document).ready(function(){
  if($.query.get("event_tag")){
    // Set tags based on querystring:
    flickrTag = $.query.get("event_tag");
    twitterTag = $.query.get("event_tag");
    youTubeTag = $.query.get("event_tag");
    // Set the same as value for the form input field:
    $("input#event_tag").val($.query.get("event_tag"));
  }
  flickrURL = "http://api.flickr.com/services/feeds/photos_public.gne?tags=" + flickrTag + "&tagmode=any&format=json&jsoncallback=?";
  twitterURL = "http://search.twitter.com/search.json?q=#" + twitterTag + "&result_type=recent";
  //twitterURL = "http://twitter.com/status/user_timeline/MPV3.json?&callback=?";
  youTubeURL = "http://gdata.youtube.com/feeds/api/videos/-/" + youTubeTag + "?alt=json&max-results=10&format=5";
  rssURL = "http://mls.heroku.com/signups.xml";
  
  fetchTweets();
  fetchFlickrImages();
  fetchYouTubeVideos();
  fetchRssNews();
  
  setInterval(fetchTweets, refreshDelay);
  setInterval(fetchFlickrImages, refreshDelay);
  setInterval(fetchYouTubeVideos, refreshDelay);
  
});

function fetchTweets(){
  // Get tweets from Twitter and add them to the page:
  $("#tweets").empty();
  $.getJSON(twitterURL, function(data){
    if(data != null && data.results.length > 0){
      $.each(data.results, function(i, item){
        if($.isArray(item)){
          $("#tweets").append("<li class=\"tweet\">" + item.text + " <span class='created_at'>" + /*relative_time(item.created_at)*/ /*" via " + item.source +*/ "</span></li>");
          console.log(item);
        }
      });
    }
    else{
      $("#tweets").append("<li class=\"empty\">Inga twitterinlägg med taggen '#" + twitterTag + "' hittades.</li>")
    }
  });
}

function fetchFlickrImages(){
  // Get images from Flickr and add them to the page:
  $("#flickr_images").empty();
  $.getJSON(flickrURL, function(data){
    if(data != null && data.items.length > 0){  
      $.each(data.items, function(i,item){
        if ( i >= 9 ){
          return false;
        }
        else{
          $("<img/>").attr("src", item.media.m).appendTo("#flickr_images")
          .wrap("<li><a href='" + item.link + "' target=\"_blank\"></a></li>");
        }
      });
    }
    else{
      $("#flickr_images").append("<li class=\"empty\">Inga bilder med taggen '" + flickrTag + "' hittades.</li>");
    }
  });
}

function fetchYouTubeVideos(){
  $("#youtube_videos").empty();
  $.getJSON(youTubeURL, function(data){
    if(data != null && data.feed.entry.length > 0){
      $.each(data.feed.entry, function(i,item){
        $("#youtube_videos").append("<li><a href=\"" + item.link[0].href + "\" title=\"" + item.title.$t + "\"><img src=\"" + item.media$group.media$thumbnail[3].url + "\" alt=\"" + item.title.$t + "\" width=\"120\" height=\"90\" /></a></li>");
      })
    }
    else{
      $("#youtube_videos").append("<li class=\"empty\">Inga videor med taggen '" + youTubeTag + "' hittades.</li>");
    }

  });
}

function fetchRssNews(){
  $.getFeed({
    url: rssURL,
    success: function(feed){
      console.log(feed);
      if(feed != null && feed.items > 0){
        $.each(feed.items, function(i,item){
          $()
        });
      }
    }
  });
}

String.prototype.linkify = function() {
	  return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/, function(m) {
      return m.link(m);
  });
 }

function relative_time(time_value) {
   var values = time_value.split(" ");
   time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
   var parsed_date = Date.parse(time_value);
   var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
   var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
   delta = delta + (relative_to.getTimezoneOffset() * 60);
   
   var r = '';
   if (delta < 60) {
     r = 'en minut sedan';
   } else if(delta < 120) {
     r = 'några minuter sedan';
   } else if(delta < (45*60)) {
     r = (parseInt(delta / 60)).toString() + ' minuter sedan';
   } else if(delta < (90*60)) {
     r = 'en timme sedan';
   } else if(delta < (24*60*60)) {
     r = '' + (parseInt(delta / 3600)).toString() + ' timmar sedan';
   } else if(delta < (48*60*60)) {
     r = '1 dag sedan';
   } else {
     r = (parseInt(delta / 86400)).toString() + ' dagar sedan';
   }
   
   return 'för ' + r;
}