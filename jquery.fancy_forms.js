/*
Project Name: Fancy Forms
URL: https://github.com/keobrien/Fancy-Forms
Author: Kevin O'Brien
Company: Clockwork Acive Media Systems
Company Site: clockwork.net
License: MIT
Copyright (C) 2012 Clockwork Active Media Systems
Version: 0.2
**************************************/

(function ($) {

	"use strict";

	// These locally scoped variables help minification by aliasing strings
	var data_key               =  'CW_fancy_forms',
		event_suffix           =  '.CW_fancy_forms',
		class_prefix           =  'fancy-',
	// Custom events
		component_initialized  =  'component_initialized' + event_suffix,
		$elements              =  $(), // Used to filter propHooks to plugin elements only
		$radios                =  $(); // Used to make the radio updater faster

	var methods  =  {

		_init_el  :  function (settings) {

			if($(this).hasClass(class_prefix + 'active')) { return this; }

			var $el  =  $(this),
				type =  $el.prop("tagName").toLowerCase(),
				type =  type === 'select' ? type : $el.attr('type'),
				options  =  $.extend({
					// Settings for selects, checkboxes and radios
					selected_class  :  class_prefix + type + '-checked',
					disabled_class  :  class_prefix + type + '-disabled',
					wrap_class      :  class_prefix + type +'-wrap',
					wrap_id         :  $el.attr('id') ? class_prefix + type +'-' + $el.attr('id') : '',
					wrap_tag        :  'div',
					type            :  type
				}, settings);
			if( options.wrap_id !== '') {
				options.wrap_html       =  '<' + options.wrap_tag + ' class="' + options.wrap_class + '" id="' + options.wrap_id + '"></' + options.wrap_tag + '>';
			}
			else {
				options.wrap_html       =  '<' + options.wrap_tag + ' class="' + options.wrap_class + '"></' + options.wrap_tag + '>';
			}
			$elements = $elements.add(this);
			if(type === 'select') {
				// Settings specific to selects
				options  =  $.extend({
					selected        :  $el.find('option:selected'),
					visible_class   :  class_prefix + type +'-visible',
					fallback        :  '<div class="'+ class_prefix + type +'-fallback_button"></div>',
					visible_tag     :  'div'
				}, options);
				options.visible_html   =  '<' + options.visible_tag + ' class="' + options.visible_class + '">' + options.selected.html() + '</' + options.visible_tag + '>';
			}else {
				// Makes sure change event is fired when jQuery change is called on element
				$.propHooks.checked = {
					set: function(el, value) {
						if ($elements.filter(el).length !== 0) {
							el.checked = value;
							$(el).trigger('change');
						}
					}
				};
				if(type === 'radio') {
					$radios = $radios.add(this);
				}
			}

			$el.data(data_key, options);
			methods._make.apply(this);

			return this;
		},

		_make  :  function (evt) {

			var	$el      =  $(this),
				options  =  evt ? $(evt.currentTarget).data(data_key) : $(this).data(data_key);

			options.$wrap = $el.wrap(options.wrap_html).parent()
				.css({
					'width'          :  $el.outerWidth() + 'px',
					'height'          :  $el.outerHeight() + 'px'
				})
			if($el.attr('class')) {
				options.$wrap.addClass(class_prefix + $el.attr('class'))
			}	
			
			if( $el.attr('id' ) ) {
				options.$wrap.attr('id', class_prefix + $el.attr('id' ));
			}

			if(options.type === 'select') {
				options.$visible  =  $(options.visible_html).appendTo(options.$wrap);
				if ($.browser.msie  && parseInt($.browser.version, 10) < 8) {
					$(options.fallback).appendTo(options.$wrap);
				}
			}else if(options.type === 'radio') {
				// Need to check all since checking one in a group doesn't fire change on the element that looses checked
				$el.change(function(){ $radios.each(function(){ methods.update.apply(this) }); });
			}

			$el
				.change(methods.update)
				.each(methods.update)
				.trigger(component_initialized, options.$wrap, options)
				.addClass(class_prefix +'active');

			return this;
		},

		/* usage: jQuery( element ).cw_fancy_forms("update") */
		update  :  function (evt) {

			var	$el      =  $(this),
				options  =  evt ? $(evt.currentTarget).data(data_key) : $(this).data(data_key),
				checked  =  $el.prop('checked'),
				disabled =  $el.prop('disabled');

			if((options.type === 'select') && options.$visible) {
				options.selected  =  options.$wrap.find('option:selected');
				options.$visible.html(options.selected.html());
			}else {
				checked === true ? $el.parent().addClass(options.selected_class) : $el.parent().removeClass(options.selected_class);
			}
			if(disabled) {
				$el.parent().addClass(options.disabled_class);
			}

		}
	};

	$.fn.cw_fancy_forms  =  function (method) {

		if (methods[method] && method.charAt(0) !== '_') {
			return $(this).map(function(i, val) { return methods[method].apply(this, Array.prototype.slice.call(arguments, 1)); });
		} else if (typeof method === 'object' || !method) {
			var args  =  arguments;
			return $(this).map(function(i, val) { return methods._init_el.apply(this, args); });
		}
	};

}(jQuery));