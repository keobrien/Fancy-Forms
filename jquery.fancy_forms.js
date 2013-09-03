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
	var data_key               =  'CW_fancy_forms',
		event_suffix           =  '.CW_fancy_forms',
	// Custom events
		component_initialized  =  'component_initialized' + event_suffix,
		component_error        =  'component_error'       + event_suffix,
		event_change           =  'fancy_change'          + event_suffix;

	var methods  =  {


		/* Selects
		*****************/
		_init_selects  :  function (settings) {

			if($(this).hasClass('fancy_selects-active')) { return this; }

			var $el  =  $(this),
				options  =  $.extend({
					content         :  null,
					selected        :  $el.find('option:selected'),
					wrap_class      :  'fancy_selects-wrap',
					// consider a private function
					wrap_id         :  $el.attr('id') ? 'fancy_selects-' + $el.attr('id') : '',
					wrap_tag        :  'div',
					visible_class   :  'fancy_selects-visible',
					visible_tag     :  'div'
				}, settings);

			var visible_content  =  options.content || options.selected.html();
			options.wrap_html       =  '<' + options.wrap_tag + ' class="' + options.wrap_class + '" id="' + options.wrap_id + '"></' + options.wrap_tag + '>';
			options.visible_html   =  '<' + options.visible_tag + ' class="' + options.visible_class + '">' + visible_content + '</' + options.visible_tag + '>';

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

			methods.apply_fancy_css($el, options.$wrap);

			$el
				.change(methods.update_selected_select)
				.on(event_change, options.$wrap, methods.update_selected_select);

			$el.trigger(component_initialized, options.$wrap, options);
		},


		update_selected_select  :  function (evt) {

			var	$el      =  $(evt.currentTarget),
				options  =  $el.data(data_key);

			if(options.$visible) {
				options.selected  =  options.$wrap.find('option:selected');
				options.$visible.html(options.selected.html());
			}

		},

		/* Shared
		*****************/
		apply_fancy_css  :  function($el, $wrapper) {

			$wrapper
				.css({
					'position'       :  'relative',
					'width'          :  $el.outerWidth() + 'px'
				})
				.addClass($el.attr('class'))
				.attr('id', data_key + '-' + $el.attr('id' ));

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
		},

		/* Checkboxes
		*****************/
		_init_checks  :  function (settings) {

			var $el  =  $(this),
				options  =  $.extend({
					selected_class  :  'fancy_checkbox-checked',
					wrap_class      :  'fancy_checkbox-wrap',
					wrap_id         :  $el.attr('id') ? 'fancy_checkbox-' + $el.attr('id') : '',
					wrap_tag        :  'div'
				}, settings);

			options.wrap_html       =  '<' + options.wrap_tag + ' class="' + options.wrap_class + '" id="' + options.wrap_id + '"></' + options.wrap_tag + '>';

			$el.data(data_key, options);

			methods._make_fancy_checks($el);

			return this;
		},


		_make_fancy_checks  :  function ($el) {

			var	options  =  $el.data(data_key);

			$el
				.wrap(options.wrap_html)
				.change(methods.update_selected_check)
				.each(methods.update_selected_check)
				.trigger(component_initialized, options);
			
			options.$wrap = $el.parent();

			methods.apply_fancy_css($el, $el.parent());
		},


		update_selected_check  :  function (evt) {

			var	options  =  evt ? $(evt.currentTarget).data(data_key) : $(this).data(data_key),
				$el   =  $(this),
				checked  =  $el.prop('checked');

			if(checked === true) {
				$el.parent().addClass(options.selected_class);
			}else {
				$el.parent().removeClass(options.selected_class);
			}

			$el.trigger(event_change, options);
		}
	};

	$.fn.cw_fancy_selects  =  function (method) {

		if (methods[method] && method.charAt(0) !== '_') {
			return $(this).map(function(i, val) { return methods[method].apply(this, Array.prototype.slice.call(arguments, 1)); });
		} else if (typeof method === 'object' || !method) {
			var args  =  arguments;
			return $(this).map(function(i, val) { return methods._init_selects.apply(this, args); });
		}
	};

	$.fn.cw_fancy_checks  =  function (method) {

		if (methods[method] && method.charAt(0) !== '_') {
			return $(this).map(function(i, val) { return methods[method].apply(this, Array.prototype.slice.call(arguments, 1)); });
		} else if (typeof method === 'object' || !method) {
			var args  =  arguments;
			return $(this).map(function(i, val) { return methods._init_checks.apply(this, args); });
		}
	};

}(jQuery));