(function(){angular.module("pirhoo",["ngAnimate","ngCookies","ngTouch","ngSanitize","ui.bootstrap","headroom","duScroll","angular-inview","infinite-scroll","wu.masonry"])}).call(this),function(){angular.module("pirhoo").directive("projects",["$rootScope",function(t){return{restrict:"EA",link:function(i,n){var e;return e=function(){return $(n).imagesLoaded().progress(function(i,n){var e;return e=$(n.img).parent(),e.hasClass("graded")||Grade(e[0]),e.addClass("graded"),t.$broadcast("images:progress",n)}).done(function(){return t.$broadcast("images:over")})},i.$watch("projects.objects.length",e)}}}])}.call(this),function(){angular.module("pirhoo").directive("activity",["$http",function(){return{restrict:"E",replace:!0,template:'<svg class="main__activity__chart"></svg>',scope:{commits:"="},link:function(t,i){var n,e,a,o,r,s,c,l,u,m,h,d,p,g,f,v,y,b,w,j,x;return f=d3.select(i[0]),v=d3.tip().attr("class","d3-tip").html(function(t){return h[t.month.getMonth()]+" "+t.month.getFullYear()+": <strong>"+t.count+" commits</strong><br />on "+_.keys(t.repositories).length+" project(s)"}),f.call(v),y=c=0,g=10,l=o=null,e=20,n=5,h=["January","February","March","April","May","June","July","August","September","October","November","December"],p=new Date(1e3*t.commits.older_commit.timestamp),d=new Date(1e3*t.commits.newer_commit.timestamp),x=function(){var t,i,n,e;for(e=[],w=t=i=p.getFullYear(),n=d.getFullYear();n>=i?n>=t:t>=n;w=n>=i?++t:--t)e.push(w);return e}(),b=d3.time.scale().domain([p,d]),j=function(t){return b(new Date(t+1,0,1))-b(new Date(t,0,1))},r={commits:_.sortBy(_.reduce(_.keys(t.commits.months_count),function(i,n){return i.push({month:new Date(n),count:t.commits.months_count[n].count,repositories:t.commits.months_count[n].repositories}),i},[]),"month")},a=_.max(r.commits,"count").count,m=d3.svg.line().x(function(t){return b(t.month)}).y(function(t){return l(t.count)}).interpolate("monotone"),u=function(){var t;return t=[(e+n)*r.commits.length,i.height()-2*g],y=t[0],c=t[1],f.style("width",y+"px"),b.range([2*g,y-e-g]),l=d3.scale.linear().domain([0,a]).range([c-g,g]),f=f.append("g").attr("class","main__activity__chart__commits"),s()},s=function(){var t,i;return f.selectAll("g.year").data(x).enter().append("g").attr("class","year").append("rect").attr("x",function(t){return b(new Date(t,0,1))}).attr("y",0).attr("width",j).attr("height",c+2*g),f.selectAll("g.year").append("text").attr("class","year-label").text(function(t){return t}).attr("text-anchor","middle").attr("x",function(t){var i;return i=b(new Date(t,0,1))+j(t)/2,i=Math.min(y-25,i),i=Math.max(25,i)}).attr("y",20),t=f.append("path").datum(r.commits).attr("class","line").attr("d",m),i=t.node().getTotalLength(),t.attr("stroke-dasharray",i+" "+i).attr("stroke-dashoffset",i).transition().duration(2e3).ease("linear").attr("stroke-dashoffset",0),f.selectAll("circle.dot").data(r.commits).enter().append("circle").attr("class","dot").attr("cx",function(t){return b(t.month)}).attr("cy",function(t){return l(t.count)}).attr("r",3).on("mouseover",v.show).on("mouseout",v.hide),f.selectAll("text.bar-label").data(r.commits).enter().append("text").attr("class","bar-label").attr("text-anchor","left").attr("x",function(t){return b(t.month)+6}).attr("y",function(t){return l(t.count)+3}).text(function(t){return l(t.count)>=25?t.count:""})},u()}}}])}.call(this),function(){angular.module("pirhoo").controller("ActivityCtrl",["$scope",function(){}])}.call(this),angular.module("pirhoo").directive("screenHeight",["$window",function(t){return function(i,n,e){var a="resize.screenHeight",o=function(){isNaN(e.screenHeight)?n.css("min-height",t.innerHeight):n.css("min-height",Math.max(e.screenHeight,t.innerHeight))};o(),angular.element(t).bind(a,o),i.$on("$destroy",function(){angular.element(t).unbind(a)})}}]),function(){angular.module("pirhoo").directive("sticky",["$window",function(){return{restrict:"AC",link:function(t,i){return null==document.documentMode?angular.element(i).addClass("sticky").Stickyfill():void 0}}}])}.call(this),function(){var t=function(t,i){return function(){return t.apply(i,arguments)}};angular.module("pirhoo").service("Paginator",function(){var i;return i=function(){function i(i){this.next=t(this.next,this),this.get=t(this.get,this),this.page=1,this.response=i,this.objects=null!=i.data?i.data:i,this.limit=Math.max(1,this.objects.length),this.over=this.busy=0===this.objects.length}return i.prototype.get=function(t,i){var n;return null==t&&(t=this.page),null==i&&(i=this.limit),n=this.objects.reqParams||{},n=angular.extend(n,{limit:i,page:t}),function(t){return function(i){return null==i&&(i=angular.noop),t.objects.getList(n).then(function(t){return i(t.data||t)})}}(this)},i.prototype.next=function(){return this.busy=!0,this.page=this.page+1,this.get(this.page,this.limit)(function(t){return function(i){var n,e,a;for(n=0,e=i.length;e>n;n++)a=i[n],t.objects.push(a);return t.busy=t.over=i.length<t.limit}}(this))},i}()})}.call(this),function(){angular.module("pirhoo").controller("HeaderCtrl",["$scope",function(){}])}.call(this),function(){var t=function(t,i){return function(){return t.apply(i,arguments)}},i=[].indexOf||function(t){for(var i=0,n=this.length;n>i;i++)if(i in this&&this[i]===t)return i;return-1};angular.module("pirhoo").directive("main",["$timeout",function(n){return{restrict:"EAC",link:function(n,e){var a;return new(a=function(){function n(){this.raf=t(this.raf,this),this.useFrame=t(this.useFrame,this),this.bind=t(this.bind,this),this.ui=t(this.ui,this)}return n.prototype.ui=function(){return this.sections=e.find(".main__section:not(:last)")},n.prototype.bind=function(){return this.useFrame()?this.animationId=this.animationFrame.request(this.raf):$(window).on("scroll",this.raf)},n.prototype.useFrame=function(){return i.call(window,"ontouchstart")>=0},n.prototype.raf=function(){var t,i;return t=$(window).scrollTop(),i=$(window).height(),this.sections.each(function(){var n,e,a,o,r,s;return a=$(this),o=a.height(),r=a.offset().top,n=(t-.3*i-r)/o,n=Math.max(0,Math.min(1,n)),e=1-.5*n,s=i-i*e+"px",a.find(".wrapper").css({transform:"translateY("+s+") ",opacity:1-n})}),this.useFrame()?this.bind():void 0},n}())}}}])}.call(this),function(){angular.module("pirhoo").controller("MainCtrl",["$scope","$http","$q","Paginator",function(t,i,n,e){return n.all({commits:i.get("assets/json/commits.json"),projects:i.get("assets/json/projects.json"),trainings:i.get("assets/json/trainings.json"),awards:i.get("assets/json/awards.json")}).then(function(i){return t.commits=i.commits.data,t.trainings=i.trainings.data,t.awards=i.awards.data,t.projects=new e(i.projects.data.slice(0,10)),t.projects.get=function(){return function(t,n){return function(e){var a;return a=i.projects.data.slice((t-1)*n,(t-1)*n+n),e(a)}}}(this),t.$on("images:over",t.projects.next)})}])}.call(this),angular.module("pirhoo").run(["$templateCache",function(t){t.put("app/main/main.html",'<div ng-controller="MainCtrl" class="main"><div ng-include="\'app/main/introduction/introduction.html\'"></div><div ng-include="\'app/main/activity/activity.html\'"></div><div ng-include="\'app/main/projects/projects.html\'"></div></div>'),t.put("components/header/header.html",'<div headroom="headroom" class="header"><div du-scrollspy="introduction" class="header__section header__section--introduction"><a href="#introduction" du-smooth-scroll="du-smooth-scroll">Introduction</a></div><div du-scrollspy="activity" class="header__section header__section--activity"><a href="#activity" du-smooth-scroll="du-smooth-scroll">Activity</a></div><div du-scrollspy="projects" class="header__section header__section--projects"><a href="#projects" du-smooth-scroll="du-smooth-scroll">Projects</a></div></div>'),t.put("app/main/activity/activity.html",'<section id="activity" ng-controller="ActivityCtrl" class="main__section main__activity"><div screen-height="600" class="wrapper"><div class="main__section__panel"><h2 aria-section="Activity">I’ve been busy,<br><strong>let the data talk</strong></h2><p>My time is split between coding, investigating and teaching. I’m better with numbers so let the figures below speak for themselves.</p></div><div class="container-base main__activity__figures list"><div class="main__activity__figures__item"><i class="fa fa-fw fa-code fa-2x main__activity__figures__item__icon"></i>I authored <strong>{{ commits.commits_count }}</strong>&nbsp; <abbr title="A submission of my latest changes of a source code">commits</abbr> over <strong>{{ commits.repositories_count }}</strong>&nbsp;projects</div><div class="main__activity__figures__item"><i class="fa fa-fw fa-graduation-cap fa-2x main__activity__figures__item__icon"></i>I gave ±<strong>{{ trainings.hours_count }}</strong>&nbsp;hours of training in <strong>{{ trainings.countries_count }}</strong>&nbsp;countries</div><div class="main__activity__figures__item"><i class="fa fa-fw fa-trophy fa-2x main__activity__figures__item__icon"></i><strong>{{ awards.awards_count }}</strong>&nbsp;prizes awarded for <strong>{{awards.projects_count }}</strong>&nbsp;projects I worked on</div></div><div in-view="projectsInView = projectsInView || $inview" class="main__activity__chart-wrapper"><activity commits="commits" ng-if="commits &amp;&amp; projectsInView"></activity></div><h3 class="main__activity__chart-title"><abbr title="A submission of my latest changes of a source code">Commits</abbr> by month</h3></div></section>'),t.put("app/main/introduction/introduction.html",'<section id="introduction" class="main__section main__introduction"><div screen-height="600" class="wrapper"><div class="main__section__panel"><h2 aria-section="Introduction">Hi, I’m <strong>Pierre Romera</strong><br>developer &amp; data-journalist</h2><p>I’m CTO at <a href="http://jplusplus.org">Journalism++</a>, an agency that I co-founded after having been responsible of the web applications at <a href="http://owni.fr">OWNI</a>.</p><p>I’m also a Associate Professor at Sciences Po, where I teach computer science to journalists. I otherwise do many trainings for professional journalists, covering data-journalism, computer security and programming.</p></div><div class="main__introduction__social list"><a href="https://twitter.com/pirhoo" target="_blank" class="main__introduction__social__item"><i class="fa fa-fw fa-twitter main__introduction__social__item__icon"></i>Find me<br>on Twitter</a><a href="https://github.com/pirhoo" target="_blank" class="main__introduction__social__item"><i class="fa fa-fw fa-github main__introduction__social__item__icon"></i>Find me<br>on Github</a><a href="https://keybase.io/pirhoo" target="_blank" class="main__introduction__social__item"><i class="fa fa-fw fa-key main__introduction__social__item__icon"></i>Find me<br>on Keybase</a><a href="mailto:hello@pirhoo.com" target="_blank" class="main__introduction__social__item"><i class="fa fa-fw fa-envelope-o main__introduction__social__item__icon"></i>Send me<br>an email</a></div><a title="Discover more" href="#activity" du-smooth-scroll="du-smooth-scroll" class="main__introduction__discover"><span class="sr-only">Discover more</span><i class="fa fa-4x fa-angle-down"></i></a></div></section>'),t.put("app/main/projects/projects.html",'<section id="projects" ng-if="projects" class="main__section main__projects"><div screen-height="600" class="wrapper"><div class="main__section__panel"><h2 aria-section="Projects">Here’s what I’ve <strong>done</strong></h2><p>According to my <a href="http://coderstats.net/github/pirhoo/" target="_blank">Github Stats</a> I mostly code in Javascript and Python. Both are my favorite languages. Almost all my projects are Open Source and available on <a href="https://github.com/pirhoo?tab=activity" target="_blank">Github</a>.</p></div><masonry projects="projects" reload-on-resize="reload-on-resize" infinite-scroll="projects.next()" infinite-scroll-disabled="projects.busy" class="main__projects__cascading container-base"><div ng-repeat="project in projects.objects" ng-class="{ \'main__projects__cascading__item--in-view\': project.inView }" yolo-in-view="project.inView = project.inView || $inview" class="masonry-brick main__projects__cascading__item"><a ng-href="{{ project.url }}" class="main__projects__cascading__item__wrapper"><div class="main__projects__cascading__item__wrapper__ghost"><div ng-style="{ \'padding-top\': project.height / project.width * 100 + \'%\' }"></div></div><img ng-src="{{ project.thumbnail }}" class="main__projects__cascading__item__wrapper__thumbnail"><div class="main__projects__cascading__item__wrapper__title">{{ project.title }}</div></a></div></masonry></div></section>')}]);