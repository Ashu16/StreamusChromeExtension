﻿define([
    'activePlaylistItemsView',
    'text!../template/activePlaylistArea.htm',
    'playAllButtonView',
    'streamItems'
], function (ActivePlaylistItemsView, ActivePlaylistAreaTemplate, PlayAllButtonView, StreamItems) {
    'use strict';

    var ActivePlaylistAreaView = Backbone.View.extend({

        className: 'left-pane',
        
        template: _.template(ActivePlaylistAreaTemplate),
        
        activePlaylistItemsView: null,
        //playlistItemInputView: null,
        
        attributes: {
            id: 'activePlaylistArea'
        },
        
        events: {
            'click .playAll': 'addToStreamAndPlay'
        },
        
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            
            this.$el.html(this.template(
                _.extend(this.model.toJSON(), {
                    //  Mix in chrome to reference internationalize.
                    'chrome.i18n': chrome.i18n
                })
            ));

            this.$el.find('.left-top-divider').after(this.activePlaylistItemsView.render().el);
            this.$el.find('.playlist-actions').append(this.playAllButtonView.render().el);

            return this;
        },

        initialize: function () {

            this.activePlaylistItemsView = new ActivePlaylistItemsView({
                model: this.model.get('playlist')
            });

            this.playAllButtonView = new PlayAllButtonView({
                model: this.model.get('playlist')
            });

            //this.playlistItemInputView = new PlaylistItemInputView({
            //    model: this.model
            //});

            //this.$el.prepend(this.playlistItemInputView.render().el);

        },
        
        addToStreamAndPlay: function () {
            var playlist = this.model.get('playlist');

            var isFirst = true;

            var streamItems = playlist.get('items').map(function (playlistItem) {

                var selected = isFirst;
                isFirst = false;

                return {
                    id: _.uniqueId('streamItem_'),
                    video: playlistItem.get('video'),
                    title: playlistItem.get('title'),
                    selected: selected
                };
            });

            StreamItems.addAndPlay(streamItems);
        },
        
        show: function() {

            this.$el.show().transition({
                opacity: 1
            });

        },
        
        hide: function () {
            
            this.$el.transition({
                opacity: 0
            }, function () {
                $(this).hide();
            });

        }

    });

    return ActivePlaylistAreaView;
});