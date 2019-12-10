var PersadoCode = (function () { // Persado namescape to ensure no conflict with existing JS libraries on page

	// Post error messages
    function postLog(msg)
    {
      setTimeout(function() {
        try {
          var xhr = new XMLHttpRequest();
          var data = encodeURIComponent(JSON.stringify(msg));
          var timePnow2 = new Date().getTime();
          xhr.open("GET",per_LogURL +"?data="+data+'&_='+timePnow2, true);
          xhr.send(null);
        } catch (ex) {
            console.log("Failed to send Log");
        }
      }, 100);
    }

    var waitForAnalytics_adobe = function(userID,variant,full_variant,per_count_wait_for_analytics_adobe, callback) {
      if (typeof s_gi === "function")
          callback(userID,variant,full_variant);
      else {
        setTimeout(function() {
        per_count_wait_for_analytics_adobe++;
        if(per_count_wait_for_analytics_adobe<per_wait_for_libraries) { //check up to 'per_wait_for_libraries' times
              waitForAnalytics_adobe(userID,variant,full_variant, per_count_wait_for_analytics_adobe,callback);
            } else {
              postLog({ "userID":MD5(userID),"Campaign":per_campaign_ID,"Phase":per_phase_ID, "Variant":variant,"Status":"Error","Msg":"S_GI_not_found","User-agent":navigator.userAgent});
              console.log('Analytics never fired');
              return;
          }
          }, 100);  //check every 100ms
        }
      };

    var waitForAnalytics_ga = function(userID,variant,full_variant,per_count_wait_for_analytics_ga, callback) {
      if (typeof ga === "function")
          callback(userID,variant,full_variant);
      else {
        setTimeout(function() {
        per_count_wait_for_analytics_ga++;
        if(per_count_wait_for_analytics_ga<per_wait_for_libraries) { //check up to 'per_wait_for_libraries' times
              waitForAnalytics_ga(userID,variant,full_variant, per_count_wait_for_analytics_ga,callback);
            } else {
              postLog({ "userID":MD5(userID),"Campaign":per_campaign_ID,"Phase":per_phase_ID, "Variant":variant,"Status":"Error","Msg":"GA_not_found","User-agent":navigator.userAgent});
              console.log('GA Analytics never fired');
              return;
          }
          }, 100);  //check every 100ms
        }
      };

    var waitForAnalytics_sp = function(userID,variant,full_variant,per_count_wait_for_analytics_sp, callback) {
      if (typeof PRSD === "object")
          callback(userID,variant);
      else {
        setTimeout(function() {
        per_count_wait_for_analytics_sp++;
        if(per_count_wait_for_analytics_sp<per_wait_for_libraries) { //check up to 'per_wait_for_libraries' times
              waitForAnalytics_sp(userID,variant,full_variant, per_count_wait_for_analytics_sp,callback);
            } else {
              postLog({ "userID":MD5(userID),"Campaign":per_campaign_ID,"Phase":per_phase_ID, "Variant":variant,"Status":"Error","Msg":"Wasabi not found","User-agent":navigator.userAgent});
              console.log('Analytics for Snowplow never fired');
              return;
          }
          }, 100);  //check every 100ms
        }
      };

    function allTrueCheck(obj)
    {
      for (var i = 0; i < obj.length; i++)
          if(!(document.querySelector(obj[i])!=null)) return false;
      return true;
    }

    var waitForElements = function(PersadoVariantReturned,UserID,per_count_wait_for_change, callback) {
      if (allTrueCheck(per_touchpoint_elements))
          callback(PersadoVariantReturned,UserID);
      else {
        setTimeout(function() {
        per_count_wait_for_change++;
        if(per_count_wait_for_change<per_wait_for_elements) { //check up to 'per_wait_for_libraries' times
              waitForElements(PersadoVariantReturned,UserID,per_count_wait_for_change,callback);
            } else {
              console.log('Element Never Ready');
              callback(PersadoVariantReturned,UserID);
              return;
          }
          }, 50);  //check every 50ms
        }
      };

    function allHidden()
    {
      for (var j = 0; j < per_touchpoint_elements_unhide.length; j++)
      {
      	var p_style = window.getComputedStyle(document.querySelector(per_touchpoint_elements_unhide[j]));
      	if (!(p_style.visibility === 'hidden')) return false;
      }
      return true;
    }

    var waitForUnhide = function(per_count_wait_for_unhide,callback) {
      if (allHidden())
          callback();
      else {
        setTimeout(function() {
        per_count_wait_for_unhide++;
        if(per_count_wait_for_unhide<per_wait_for_unhide) { //check up to 'per_wait_for_libraries' times
              waitForUnhide(per_count_wait_for_unhide,callback);
            } else {
              console.log('Element Never Unhidden');
              setTimeout(function() {
                for (var j = 0; j < per_touchpoint_elements_unhide.length; j++) {
                  if (per_platformUsed != "Maxymiser") document.querySelector(per_touchpoint_elements_unhide[j]).style.visibility = 'visible';
                  else dom.changeStyle(per_touchpoint_elements_unhide[j], 'visibility: visible !important;');
                  }
                  }, per_soft_timeout);
              return;
          }
          }, 10);  //check every 10ms
        }
      };

    // Unhide all elements
    function unhideElements() {
      if (per_unhide_elements) {
      	var per_count_wait_for_unhide = 0;
  		waitForUnhide(per_count_wait_for_unhide,function() {setTimeout(function() {
  		  for (var j = 0; j < per_touchpoint_elements_unhide.length; j++) {
			if (per_platformUsed != "Maxymiser") document.querySelector(per_touchpoint_elements_unhide[j]).style.visibility = 'visible';
      else dom.changeStyle(per_touchpoint_elements_unhide[j], 'visibility: visible !important;');
      }
		}, per_unhide_timeout);});
      }
    }

    // MD5 function
    function MD5(d){return rstr2hex(binl2rstr(binl_md5(rstr2binl(d),8*d.length)))}function rstr2hex(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function rstr2binl(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function binl2rstr(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function binl_md5(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}

        // General function to get all the query->value parameters from the url
        function getQueryVariable(variable)
        {
               var query = window.location.search.substring(1);
               var vars = query.split("&");
               for (var i = 0; i < vars.length; i++) {
                   var pair = vars[i].split("=");
                   if(pair[0] == variable){return pair[1];}
               }
               return('');
        }

        // Generate an almost unique UID to use (chances of ducplicate very low) in order to track user (saved in a cookie later on)
        function generateUUID() {
          var d = new Date().getTime();
          var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              var r = (d + Math.random()*16)%16 | 0;
              d = Math.floor(d/16);
              return (c=='x' ? r : (r&0x3|0x8)).toString(16);
          });
          return uuid;
        }

        // Read UserID from Optimzely
        function getOptimizelyUser() {
          var visitor = null;
          try {
            visitor = window.optimizely.get("visitor");
            }
          catch(errout) { }
          if (visitor != null)
            return visitor.visitorId;
          else
            return "";
        }

        // Get or Set our own ID to cookie to track and serve the user (this is 1st party cookie)
        function getPersadoIDCookie() {
          if (document.cookie.indexOf("PersadIDExp=") >= 0) { // Check if cookie exist and if it does then load the UUID from there (return user)
            var value = "; " + document.cookie;
            var parts = value.split("; PersadIDExp=");
            if (parts.length == 2) return parts.pop().split(";").shift();
            else return 0;
          }
          else { // Else generate new UUID, save it to cookie and return it
            var expiry = new Date();
              expiry.setTime(expiry.getTime()+(31536000000)); // Expire in 1 year
              var userID = "";

              if (per_AdobeAnalyticsUse) {
                if (document.cookie.split("CMCMID").pop().split("%7C")[1] != null)
                {
                    var cpid =  document.cookie.split("CMCMID").pop().split("%7C")[1];
                    if (cpid.length>30) userID = cpid;
                }
              }
              else if (per_GAuse) {
                try {
                  userID = document.cookie.match(/_ga=(.+?);/)[1].split('.').slice(-2).join(".");
                }
               catch(errout) { }
            }
            if (userID.length<=10)
            {
              if (per_platformUsed == "Optimizely") userID = getOptimizelyUser(); // Get Optimizely one if needed
              if (userID.length <= 10 ) userID = generateUUID(); // Generate UUID if no optimizely one
            }
              // Date()'s toUTCString() method will format the date correctly for a cookie
              document.cookie = "PersadIDExp="+userID+"; expires=" + expiry.toUTCString() + "; domain=." + location.hostname.split('.').reverse()[1] + "." + location.hostname.split('.').reverse()[0] + "; path=/";
              return userID;
          }
        }

        // Get all the IDs we need to track properly and construct the Persado API URL we will call
        function create_persado_url(baseURL,campaignID,fvar) {

          var urls = "";
          var variant_enter = getQueryVariable(per_qa_force_name); // IF variant is specified on query parameter then use it to serve the copy [mainly for QA]
          var userID = getPersadoIDCookie(); // Our UUID that we generate or load
          if (fvar!="") variant_enter = fvar;

          if (variant_enter) { // Create the URL with all the parameters set. We use the UUID ID as the user_id that will determine the random shuffling and also pass all additional query parameters for personalisation and variant_code
            urls = baseURL + campaignID +"/"+per_touchpoint_name+".js?user_id="+MD5(userID)+"&variant_code="+variant_enter;
          }
          else {
            urls = baseURL + campaignID +"/"+per_touchpoint_name+".js?user_id="+MD5(userID);
          }

          return { // Return all the information
              userID: userID,
              urls: urls
          };
        }

        // Function track all Adobe
        function trackAllPersado_adobe(userID,variant,full_variant) {
          setTimeout(function() {
            try { // This is used for Adobe Analytics. Save our variant ID on an eVar so we can track in in analytics across all pages

                var s_account=per_AdobeAnalyticsTemplate;
                var spc=s_gi(s_account);
                var per_adobe_track = "";

                if (per_tealium_eVar != "") {
                  var utaglink = {};
                  utaglink[per_tealium_eVar] = full_variant;
                  if (per_tealium_link_name != "") utaglink[per_tealium_link_name] = "Set Persado Data";
                  if (per_tealium_event != "") utaglink[per_tealium_event] = per_tealium_eventName;
                  utag.link(utaglink);
                }
                else {
                   if (per_AdobeAnalyticsContext != "") {
                    spc.contextData[per_AdobeAnalyticsContext] = full_variant;
                    spc.linkTrackVars = "contextData."+per_AdobeAnalyticsContext;
                    }
                    else {
                      if (per_AdobeAnalyticsEvar != "") {
                        per_adobe_track = per_AdobeAnalyticsEvar;
                      }
                      else if (per_AdobeAnalyticsListVar != "")
                      {
                        per_adobe_track = per_AdobeAnalyticsListVar;
                      }
                      if (spc.linkTrackVars=="") { spc.linkTrackVars = per_adobe_track;}
                      else {spc.linkTrackVars = spc.linkTrackVars + ","+per_adobe_track;} // Add the var to existing TrackVars
                      spc[per_adobe_track] = full_variant;
                      if (per_AdobeProp!="") spc[per_AdobeProp]= full_variant;
                    }
                    if (per_AdobeViewEvent!="") {
                        if (spc.linkTrackVars=="") { spc.linkTrackVars = "events";}
                        else {spc.linkTrackVars = spc.linkTrackVars + ",events";} // Add the events to existing TrackVars
                        if (s.linkTrackEvents=="") { s.linkTrackEvents = per_AdobeViewEvent;}
                        else {s.linkTrackEvents= s.linkTrackEvents + "," + per_AdobeViewEvent;}
                        spc.events=per_AdobeViewEvent;
                    }
                    if (per_AdobeProp!="") {
                        if (spc.linkTrackVars=="") { spc.linkTrackVars = per_AdobeProp;}
                        else {spc.linkTrackVars = spc.linkTrackVars + "," + per_AdobeProp;} // Add the prop to existing TrackVars
                    }
                spc.tl(true,'o','Set Persado Data');
                }
            } catch(errout) {
              console.log("AdobeAnalytics event cannot be fired");
              postLog({ "userID":MD5(userID),"Campaign":per_campaign_ID,"Phase":per_phase_ID, "Variant":variant,"Status":"Error","Msg":"Adobe_Analytics","User-agent":navigator.userAgent});
              return;
               }
          }, per_soft_timeout);
        }

        // Function track all GA
        function trackAllPersado_ga(userID,variant,full_variant) {
          setTimeout(function() {
            try { // This is used for Google Analytics. Save our variant ID on an dimension so we can track in in analytics across all pages
                if (per_GA_type == 1) {
                      ga('create', per_GA_ID);
                      ga('set', per_GA_dimname, full_variant);
                      if (per_GAViewEvent!="") ga('set', per_GAViewEvent, 1);
                      ga('send', 'event', 'custom_dimension', 'view', { nonInteraction: true });
                }
                else {
                var jsonVar = {};
                if (per_GAViewEvent!="") { //view custom metric
                      jsonVar[per_GA_dimname] = 'persado';
                      jsonVar[per_GAViewEvent] = 'persado_view';
                      gtag('config', per_GA_ID, { 'custom_map': jsonVar});
                      gtag('event', 'custom_dimension', {'persado': full_variant, 'persado_view': 1, 'non_interaction': true});
                  }
                else {
                      jsonVar[per_GA_dimname] = 'persado';
                      gtag('config', per_GA_ID, { 'custom_map': jsonVar});
                      gtag('event', 'custom_dimension', {'persado': full_variant, 'non_interaction': true });
                }
              }
            } catch(errout) {
              console.log("GoogleAnalytics event cannot be fired");
              postLog({ "userID":MD5(userID),"Campaign":per_campaign_ID,"Phase":per_phase_ID, "Variant":variant,"Status":"Error","Msg":"Google_Analytics","User-agent":navigator.userAgent});
              return;
               }
          }, per_soft_timeout);
        }

        // Function track all Snowplow
        function trackAllPersado_sp(userID,variant) {
          setTimeout(function() {
           try { // This is used for Snowplow
                PRSD.set(per_campaign_ID, variant, MD5(userID));
                console.log('Tracked Persado view event');

                if (per_snowplow_clicks!="") {
                    for (var k = 0; k < per_snowplow_clicks.length; k++) { // Add the event listeners in order to track clicks
                      var elements = document.querySelectorAll(per_snowplow_clicks[k]);
                      Array.prototype.forEach.call(elements, function(el, i){
                        el.addEventListener('click', function(ev) {
                          PRSD.track(persado_sp,'click');
                          console.log('Tracked Persado click event');
                        }, true);
                    });
                  }
                }
            } catch(errout) {
              console.log("Snowplow event cannot be fired");
              postLog({ "userID":MD5(userID),"Campaign":per_campaign_ID,"Phase":per_phase_ID, "Variant":variant,"Status":"Error","Msg":"Snowplow","User-agent":navigator.userAgent});
              return;
             }
       }, per_soft_timeout);
      }


      // Function that does all the element changes for us based on the variant returned
        function run_change_elements(PersadoVariant,userID) {
          var ret = PersadoVariant;
          var variant = ret.variant_code; // Get the variant id to use it for analytics
          try { if (ret.geno_code !="") variant = ret.geno_code; } catch(errout) {} // Support for HCID (use geno_message_id if available)
          var full_variant = per_campaign_ID + "_" + per_phase_ID + "_" + variant; // full saved info for campign, phase and variant
          var cs_changed = 0;

          setTimeout(function() {
          try {
                  var strT = ret.js;
                  if (strT!=null) strT = strT.replace(/\}\)\;$/, '\}\)');
                  var funcTP = new Function(strT);
                  funcTP();
                  unhideElements();
            }
           catch(errout) {
              cs_changed = 1;
              console.log("Error replacing Touchpoint");
              unhideElements();
              postLog({ "userID":MD5(userID),"Campaign":per_campaign_ID,"Phase":per_phase_ID, "Variant":variant,"Status":"Error","Msg":"Touchpoint","User-agent":navigator.userAgent});
          }

          if (cs_changed==0) {

            if (per_platformUsed == "Optimizely")
              {
                try {
                window["optimizely"].push({ "type": "user", "attributes": { "PersadoVariant": full_variant} }); // Add the variant to Optimizely tracking
              }
                catch(errout) { }
              }

            postLog({ "userID":MD5(userID),"Campaign":per_campaign_ID,"Phase":per_phase_ID, "Variant":variant,"Status":"OK","Msg":"Success","User-agent":navigator.userAgent});
            var per_count_wait_for_analytics_adobe = 0;
            var per_count_wait_for_analytics_ga = 0;
            var per_count_wait_for_analytics_sp = 0;
            if (per_AdobeAnalyticsUse) waitForAnalytics_adobe(userID,variant,full_variant,per_count_wait_for_analytics_adobe,function() {trackAllPersado_adobe(userID,variant,full_variant);});
            if (per_GAuse) waitForAnalytics_ga(userID,variant,full_variant,per_count_wait_for_analytics_ga,function() {trackAllPersado_ga(userID,variant,full_variant);});
            if (per_snowplow) waitForAnalytics_sp(userID,variant,full_variant,per_count_wait_for_analytics_sp,function() {trackAllPersado_sp(userID,variant);});
           }
        }, per_JS_timeout);

        }

      // Main function that will be called every time we have a new campaign
        function run_persado(fvar) {


        // Create the URL properly
        var persado_ret = create_persado_url(per_PerasdoAPI_URL,per_campaign_ID,fvar);
        // Assign all the IDs to variables
        var urls = persado_ret.urls;
        var userID = persado_ret.userID;
          // Call our API and get all the touchpoints for the user
          var request = new XMLHttpRequest();
          var timePnow = new Date().getTime();
          request.open('GET', urls+'&_='+timePnow, true);
          request.timeout = per_hard_timeout;
          // request.setRequestHeader('If-Unmodified-Since', timePnow);

          request.onload = function() { // Once it loads
          if (request.status >= 200 && request.status < 400) { //Check if no errors
            try {
              try {var vrT = request.getResponseHeader("x-variant");} catch(errout) {};
              try {var gnT = request.getResponseHeader("x-geno");} catch(errout) {};
              if ((vrT!=null)&&(vrT.includes(':'))) vrT = vrT.substr(0, vrT.indexOf(':'));
              else if (vrT==null) vrT = "";
              if (gnT==null) gnT = "";
              var PersadoVariantReturned = {"variant_code":vrT,"geno_code":gnT,"js":request.responseText};
              var per_count_wait_for_change = 0;
              waitForElements(PersadoVariantReturned,userID,per_count_wait_for_change,function() {run_change_elements(PersadoVariantReturned,userID);});
            }
            catch(errout) {
              console.log("Error parsing Touchpoint");
              unhideElements();
              postLog({ "userID":MD5(userID),"Campaign":per_campaign_ID,"Phase":per_phase_ID, "Variant":"Undefined","Status":"Error","Msg":"Parsing Touchpoint","User-agent":navigator.userAgent});
            }
          } else { // In case of any error just unhide elements to show the control
              console.log("Received Error Code from Persado API");
              unhideElements();
              postLog({ "userID":MD5(userID),"Campaign":per_campaign_ID,"Phase":per_phase_ID, "Variant":"Undefined","Status":"Error","Msg":"BadResponseCode_API","User-agent":navigator.userAgent});
            }
          };

        request.onerror = function() { // In case of any error on our ajax call just unhide elements to show the control
              console.log("Error on call to Persado API");
              unhideElements();
              postLog({ "userID":MD5(userID),"Campaign":per_campaign_ID,"Phase":per_phase_ID, "Variant":"Undefined","Status":"Error","Msg":"OnCall_API","User-agent":navigator.userAgent});

        };

        request.ontimeout = function() { // In case of timeout on our ajax call just unhide elements to show the control
            console.log("Timeout on call to Persado API");
            unhideElements();
            postLog({ "userID":MD5(userID),"Campaign":per_campaign_ID,"Phase":per_phase_ID, "Variant":"Undefined","Status":"Error","Msg":"Timeout_API","User-agent":navigator.userAgent});

        };

          request.send(); // call our Persado API
      }

  return { run_persado: run_persado, postLog: postLog, unhideElements: unhideElements };
    })();


// Customer details (can be the same across campaigns)
var per_platformUsed = "Adobe"; // Which platform is this script for. Options are "Adobe","Optimizely","Maxymiser","GoogleOptimize"
var per_AdobeAnalyticsTemplate = "persadoexchangepartn"; // Adobe Analytics template name
var per_AdobeAnalyticsEvar = ""; // Adobe Analytics eVar for tracking variants across pages (i.e. eVar4)
var per_AdobeAnalyticsListVar = ""; // Adobe Analytics list var for tracking variants across pages (i.e. list1) - Have either eVar or ListVar or Context
var per_AdobeAnalyticsContext = ""; // Adobe Analytics context variable to be written - Have either eVar or ListVar or Context
var per_AdobeViewEvent = ""; // Adobe event to track our views (i.e. event19)
var per_tealium_eVar = ""; // If present, this will write tealium data (utag_data) instead of directly on eVar (else keep empty "")
var per_tealium_event = ""; // If present, this will write tealium data (utag_data) instead of directly on event (else keep empty "")
var per_tealium_eventName = ""; // Name to give to tealium event if set (else keep empty "")
var per_tealium_link_name = ""; // Name to give to link event when fired (else keep empty "")
var per_AdobeProp= ""; // Adobe prop for tracking (i.e. prop2)
var per_GA_ID = ""; // Google Analytics customer ID
var per_GA_dimname = ""; // Custom dimension for Google Analytics (i.e. dimension1)
var per_GAViewEvent = ""; // GA event to track our views (i.e metric1)
var per_GA_type = 1; // 1 for GA and 2 for GTAG
var per_snowplow_clicks = ""; // Elements to be tracked for clicks only for Snowplow
var per_AdobeAnalyticsUse = false; // Track with Analytics
var per_GAuse = false; // Track with Google Analytics
var per_snowplow = false; // Track with Snowplow

// Campaign specific details
var per_campaign_ID = "285_Omf4SEMc32"; // Campaign ID provided by Persado
var per_phase_ID = "exploration"; // Set a name for the current phase as provided by Persado
var per_touchpoint_elements = ["div#to-hide"]; // Page elements to wait to load (or "" if none)
var per_touchpoint_elements_unhide = [""]; // Page elements to unhide (or "" if none)
var per_touchpoint_name = ""; // Touchpoint names corresping to elements
var per_unhide_elements = true; // Whether to unhide elements or just not (in case we never hide them in the first place using Adobe Target)

// Persado configuration details [change only if needed]
var per_PerasdoAPI_URL = 'https://rts.persado.com/api/v1/'; // Persado Enterprise API endpoint
var per_LogURL = 'https://rts.persado.com/log/v1/i.gif'; // Front-end logging of errors to our Kibana
var per_qa_force_name = 'variant_code'; // Override the QA name for forcing variants (otherwise keep as 'variant_code')
var per_soft_timeout = 200; // Soft timer for waiting before firing an action
var per_JS_timeout = 20; // Timeout before executing JS changes
var per_unhide_timeout = 20; // Timeout before unhiding elements
var per_hard_timeout = 4000; // Hard timer for waiting a response [timeouts]
var per_wait_for_libraries = 100; // How long to wait for libraries to load (i.e. Analytics). Counted as X*100ms
var per_wait_for_elements = 50; // How long to wait for elements to appear Counted as X*50ms
var per_wait_for_unhide = 100; // How long to wait for items to be hidden before unhidding them Counted as X*10ms
var PersadoVariantReturned =""; // variable to save in memory our returned variant

// If the script has run before (a bug in Adobe Target that runs script twice if no Adobe cookie found) or cookies are not allowed, then just show the control
  if (!((typeof(PersadoRunOnce) !== 'undefined') || (!navigator.cookieEnabled))) {
    var PersadoRunOnce = true; // In order to fix bug that Adobe is triggered twice
    try { // Run our code from the library we created for namescape reasons
      PersadoCode.run_persado(""); //Run our adobe method with all the parameters required for the experiment
      }
    catch(errout) { // In case of any error just unhide elements to show the control
          console.log("Error on Persado Script");
          PersadoCode.unhideElements();
          PersadoCode.postLog({ "userID":"Undefined","Campaign":per_campaign_ID,"Phase":per_phase_ID,"Variant":"Undefined","Status":"Error","Msg":"Generic","User-agent":navigator.userAgent});
    }
}