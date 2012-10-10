/*
Project Name: Fancy Forms
URL: https://github.com/keobrien/Fancy-Forms
Author: Kevin O'Brien
Company: Clockwork Acive Media Systems
Company Site: clockwork.net
License: MIT
Copyright (C) 2012 Clockwork Active Media Systems
Version: 0.1
**************************************/

(function ($) {

	"use strict";

	// These locally scoped variables help minification by aliasing strings
	var data_key               =  'CW_fancy_selects-options',
		event_suffix           =  '.CW_fancy_selects',
	// Custom events
		component_initialized  =  'component_initialized' + event_suffix,
		component_error        =  'component_error'       + event_suffix,
		event_change           =  'fancy_change'                + event_suffix;

	var methods  =  {

		init  :  function (settings) {

			if($(this).hasClass('fancy_selects-active')) { return this; }

			var $el  =  $(this),
				options  =  $.extend({
					content         :  null,
					selected        :  $el.find('option:selected'),
					wrap_class      :  'fancy_selects-wrap',
					wrap_id         :  $el.attr('id') ? 'fancy_selects-' + $el.attr('id') : '',
					wrap_tag        :  'div',
					visible_class   :  'fancy_selects-visible',
					visible_tag     :  'div'
				}, settings);

			var visible_content  =  options.content || options.selected.html();
			options.wrap_html       =  '<' + options.wrap_tag + ' class="' + options.wrap_class + '" id="' + options.wrap_id + '"></' + options.wrap_id + '>';
			options.visible_html   =  '<' + options.visible_tag + ' class="' + options.visible_class + '">' + visible_content + '</' + options.visible_tag + '>'

			$el.data(data_key, options);

			methods._make_fancy_select($el);

			return this;
		},


		_make_fancy_select  :  function ($el) {

			var	options  =  $el.data(data_key);

			$el.wrap(options.wrap_html).addClass('fancy_selects-active');

			options.$wrap     =  $el.parent();
			options.$visible  =  $(options.visible_html).appendTo(options.$wrap);
			if ($.browser.msie  && parseInt($.browser.version, 10) < 8) {
				$('<div class="fancy_selects-fallback_button">&nu;</div>').appendTo(options.$wrap);
			}

			options.$wrap.css({
				'display'        :  'inline-block',
				'position'       :  'relative',
				'width'          :  $el.outerWidth() + 'px'
			}).addClass($el.attr('class'));

			$el.css({
				'opacity'  :  0,
				'min-height'  :  '100%',
				'min-width'   :  '100%',
				'position'    :  'absolute',
				'top'         :  0,
				'left'        :  0,
				'z-index'     :  2,
				'cursor'      :  'pointer'
			});

			$el.change(methods.update_selected);

			$el.trigger(component_initialized, options);
		},


		update_selected  :  function (evt) {

			var	$el      =  $(evt.currentTarget),
				options  =  $el.data(data_key);

			options.selected  =  options.$wrap.find('option:selected');
			options.$visible.html(options.selected.html());

			$el.trigger(event_change, options);
		}
	};

	$.fn.cw_fancy_selects  =  function (method) {

		if (methods[method] && method.charAt(0) !== '_') {
			return $(this).map(function(i, val) { return methods[method].apply(this, Array.prototype.slice.call(arguments, 1)); });
		} else if (typeof method === 'object' || !method) {
			var args  =  arguments;
			return $(this).map(function(i, val) { return methods.init.apply(this, args); });
		}
	};

}(jQuery));