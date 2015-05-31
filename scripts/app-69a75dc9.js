(function(){angular.module("pirhoo",["ngAnimate","ngCookies","ngTouch","ngSanitize","ui.bootstrap","headroom","duScroll"])}).call(this),function(){angular.module("pirhoo").directive("projects",["$timeout",function(t){return{restrict:"EA",link:function(e,n){return t(function(){return imagesLoaded(n,function(){return new Isotope(n[0],{itemSelector:".main__projects__cascading__item",gutter:0,isHorizontal:!0})})})}}}])}.call(this),function(){angular.module("pirhoo").directive("activity",["$http",function(){return{restrict:"E",replace:!0,template:'<svg class="main__activity__chart"></svg>',scope:{commits:"="},link:function(t,e){var n,r,a,o,i,c,s,u,l,m,d,h,p,g,f,y,w,v,x;return p=d3.select(e[0]),g=d3.tip().attr("class","d3-tip").html(function(t){return m[t.month.getMonth()]+" "+t.month.getFullYear()+": <strong>"+t.count+" commits</strong>"}),p.call(g),f=s=0,u=o=null,r=25,n=0,m=["January","February","March","April","May","June","July","August","September","October","November","December"],h=new Date(1e3*t.commits.older_commit.timestamp),d=new Date(1e3*t.commits.newer_commit.timestamp),x=function(){var t,e,n,r;for(r=[],w=t=e=h.getFullYear(),n=d.getFullYear();n>=e?n>=t:t>=n;w=n>=e?++t:--t)r.push(w);return r}(),y=d3.time.scale().domain([h,d]),v=function(t){return y(new Date(t+1,0,1))-y(new Date(t,0,1))},i={commits:_.sortBy(_.reduce(_.keys(t.commits.months_count),function(e,n){return e.push({month:new Date(n),count:t.commits.months_count[n]}),e},[]),"month")},a=_.max(i.commits,"count").count,l=function(){var t;return t=[(r+n)*i.commits.length,e.height()],f=t[0],s=t[1],p.style("width",f+"px"),y.range([0,f-r]),u=d3.scale.linear().domain([0,a]).range([0,s]),p=p.append("g").attr("class","main__activity__chart__commits"),c()},c=function(){var t;return t=p.append("defs").append("linearGradient").attr({id:"yeargradient",x1:0,x2:0,y1:0,y2:1}),t.append("stop").attr("offset","0%").attr("stop-color","white").attr("stop-opacity",0),t.append("stop").attr("offset","100%").attr("stop-color","white").attr("stop-opacity",.2),p.selectAll("g.year").data(x).enter().append("g").attr("class","year").append("rect").attr("x",function(t){return y(new Date(t,0,1))}).attr("y",0).attr("width",v).attr("height",s),p.selectAll("g.year").append("text").attr("class","year-label").text(function(t){return t}).attr("text-anchor","middle").attr("x",function(t){var e;return e=y(new Date(t,0,1))+v(t)/2,e=Math.min(f-25,e),e=Math.max(25,e)}).attr("y",20),p.selectAll("rect.bar").data(i.commits).enter().append("rect").attr("class","bar").attr("x",function(t){return y(t.month)}).attr("y",function(t){return s-u(t.count)}).attr("width",r).attr("height",function(t){return u(t.count)}).on("mouseover",g.show).on("mouseout",g.hide),p.selectAll("text.bar-label").data(i.commits).enter().append("text").attr("class","bar-label").attr("text-anchor","middle").attr("x",function(t){return y(t.month)+r/2}).attr("y",function(t){return s-u(t.count)+10}).text(function(t){return t.count})},l()}}}])}.call(this),function(){angular.module("pirhoo").controller("ActivityCtrl",["$scope",function(){}])}.call(this),angular.module("pirhoo").directive("screenHeight",["$window",function(t){return function(e,n,r){var a="resize.screenHeight",o=function(){isNaN(r.screenHeight)?n.css("min-height",t.innerHeight):n.css("min-height",Math.max(r.screenHeight,t.innerHeight))};o(),angular.element(t).bind(a,o),e.$on("$destroy",function(){angular.element(t).unbind(a)})}}]),function(){angular.module("pirhoo").controller("HeaderCtrl",["$scope",function(){}])}.call(this),function(){angular.module("pirhoo").controller("MainCtrl",["$scope","$http","$q",function(t,e,n){return n.all({commits:e.get("assets/json/commits.json"),projects:e.get("assets/json/projects.json"),trainings:e.get("assets/json/trainings.json"),awards:e.get("assets/json/awards.json")}).then(function(e){return t.commits=e.commits.data,t.projects=e.projects.data,t.trainings=e.trainings.data,t.awards=e.awards.data})}])}.call(this);