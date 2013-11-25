
(function(window, document){

    "use strict";

    window.ShowHide = (function(){

        // Constructor
        var showHide = function($container, $triggers, options) {
            var self = this;
            this.$container = $container;
            this.$triggers = $triggers;
            this.activeClass = "showhide-open";
            this.triggerClass = "showhide-active";
            this.animInClass = false;
            this.animOutClass = false;
            this.autoHeight = false;
            this.activateModal = false;
            this.animEvent = Browser.get("animationEvent");

            // Pass in extra attributes
            $.extend(self, options);

            this.isOpen = $container.hasClass(this.activeClass) ? true : false;

            if (this.$triggers) {
                 // Event handlers
                this.$triggers.on("click", $.proxy(self.onClick, self));
            }
        };

        showHide.prototype = {
            onClick: function(e) {
                e.preventDefault();
                var self = this;
                if (self.isOpen) {
                    self.close(e);
                } else {
                    self.open(e);
                }
            },
            open: function(e) {
                var self = this;
                var shouldOpen = this.$container.hasClass(this.activeClass) ? false : true;
                var group = this.$container.attr("data-showhide-group");
                var isDismissible = this.$container.attr("data-showhide-dismissible");
                var $others;
                var $doc =  $(document);

                self.$container.removeClass(self.animOutClass);
                self.$container.addClass(self.activeClass);

                if (self.autoHeight) {
                    self.$container.addClass("autoheight");
                    self.$container.css("height", "auto");
                    self.realHeight = self.$container.outerHeight();
                    var height = self.realHeight + "px";
                    self.$container.css("height", height);
                    // Very important for responsiveness.
                    $(window).one("resize", function() {
                        self.$container
                            .css("height", "auto")
                            .removeClass("autoheight")
                            .off(Browser.get("transitionEvent"));
                    });
                }


                if (self.animInClass && self.animEvent) {
                        self.$container.one(this.animEvent, function() {
                        self.$container.removeClass(self.animInClass);
                    });
                    self.$container.addClass(self.animInClass);
                }

                this.$triggers.each(function() {
                   var $this = $(this);
                    $this.addClass(self.triggerClass);
                    if ($this.attr("data-hide-self")) {
                        $this.hide();
                    }
                });

                if (group) {
                    $doc.trigger("showHide:closeGroup", [group, self.alias]);
                }

                if (typeof(isDismissible) !== "undefined") {
                    e.stopPropagation();
                    this.$container.on("click", function(e) {
                        e.stopPropagation();
                    });
                    $doc.one("click", function(e) {
                        self.close.call(self);
                    });
                }

                // Fire an event that other things can bind to
                $doc.trigger("showHide:open", [self]);

                this.isOpen = true;
                return shouldOpen;
            },
            close: function() {
                var self = this, $document = $(document);
                var shouldClose = this.$container.hasClass(this.activeClass) ? true : false;


                if (self.animOutClass && this.animEvent) {
                    this.$container.one(this.animEvent, function() {
                        self.$container.removeClass(self.animOutClass);
                        self.$container.removeClass(self.activeClass);
                    });
                    self.$container.removeClass(self.animInClass);
                    self.$container.addClass(self.animOutClass);
                } else if (self.autoHeight) {
                    if (self.$container.hasClass("autoheight")) {
                        self.$container.css("height", "0px");
                        self.$container.one(Browser.get("transitionEvent"), function() {
                            self.$container.removeClass(self.activeClass);
                        });
                    } else {
                        self.$container.removeClass(self.activeClass);
                    }
                } else {
                    self.$container.removeClass(self.activeClass);
                }


                this.$triggers.each(function() {
                    var $this = $(this);
                    $this.removeClass(self.triggerClass);
                    if ($this.attr("data-hide-self")) {
                        $this.show();
                    }
                });

                // Fire an event that other things can bind to
                $document.trigger("showHide:close", [self]);

                this.$container.off("click", function(e) {
                    e.stopPropagation();
                });

                $document.off("click", function(e) {
                    self.close.call(self);
                });

                this.isOpen = false;
                return shouldClose;
            },
            remove: function() {
                var self = this;
                this.$container = null;
                this.$triggers.off("click", $.proxy(self.onClick, self));
            }
        };

        return showHide;
    })();

    window.ShowHideController = (function(){
        return {
            showHides : {
            },
            // Find anything that should be a ShowHide and damn right make it a ShowHide
            init : function() {
                var self = this;
                self.add($("[data-showhide-container]"));
                $(document).on("showHide:closeGroup", function(e, group, exclude) {
                    self.closeGroup.call(self, group, exclude);
                });
            },
            add: function($selector) {
                var self = this;
                $selector.each(function(index, elem){
                    var options;
                    var $showHideContainer = $(elem);
                    var name = $showHideContainer.data("showhide-container");
                    var group = $showHideContainer.data("showhide-group");
                    var $showHideTriggers = $("[data-showhide-trigger='" + name + "']");
                    var activeClass = $showHideContainer.data("showhide-activeclass");
                    var animInClass = $showHideContainer.data("showhide-in");
                    var animOutClass = $showHideContainer.data("showhide-out");
                    var triggerClass = $showHideContainer.data("showhide-triggerclass");
                    var autoHeight = typeof($showHideContainer.data("showhide-autoheight")) !== "undefined";

                    options = {
                        alias: name,
                        group: group,
                        activeClass: activeClass,
                        triggerClass: triggerClass,
                        animInClass: animInClass,
                        animOutClass: animOutClass,
                        autoHeight: autoHeight
                    };

                    self.showHides[name] = new ShowHide($showHideContainer, $showHideTriggers, options);
                });
            },
            closeGroup: function(groupName, exclude) {
                var self = this, obj;
                for (var key in self.showHides) {
                    obj = self.showHides[key];
                    if (obj.group === groupName && obj.alias !== exclude) {
                        obj.close();
                    }
                }
            }
        };
    })();

    $(document).ready(function() {
        ShowHide.init();
    });

})(window, document);
