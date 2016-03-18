(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var InnerContent = require('../../js/src/models/inner-content');

describe( "Shortcode Inner Content Model", function() {

	var data = {
		label:       'Inner Content',
		type:        'textarea',
		value:       'test content',
		placeholder: 'test placeholder',
	};

	it( 'sets defaults correctly.', function() {
		var content = new InnerContent();
		expect( content.toJSON() ).toEqual( {
			label:       'Inner Content',
			type:        'textarea',
			value:       '',
			placeholder: '',
		} );
	});

	it( 'sets data correctly.', function() {
		var content = new InnerContent( data );
		expect( content.toJSON() ).toEqual( data );
	});

} );

},{"../../js/src/models/inner-content":9}],2:[function(require,module,exports){
var ShortcodeAttribute = require('../../js/src/models/shortcode-attribute');

describe( "Shortcode Attribute Model", function() {

	var attrData = {
		attr:        'attr',
		label:       'Attribute',
		type:        'text',
		value:       'test value',
		description: 'test description',
		encode:      false,
		meta:  {
			placeholder: 'test placeholder'
		},
	};

	var attr = new ShortcodeAttribute( attrData );

	it( 'should correctly set data.', function() {
		expect( attr.toJSON() ).toEqual( attrData );
	});


} );

},{"../../js/src/models/shortcode-attribute":10}],3:[function(require,module,exports){
(function (global){
var Shortcode = require('../../js/src/models/shortcode');
var InnerContent = require('../../js/src/models/inner-content');
var ShortcodeAttribute = require('../../js/src/models/shortcode-attribute');
var ShortcodeAttributes = require('../../js/src/collections/shortcode-attributes');
var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

describe( "Shortcode Model", function() {

	var defaultShortcode, shortcode, data;

	data = {
		label: 'Test Label',
		shortcode_tag: 'test_shortcode',
		attrs: [
			{
				attr:        'attr',
				label:       'Attribute',
				type:        'text',
				value:       'test value',
				placeholder: 'test placeholder'
			}
		],
		inner_content: {
			value: 'test content',
		},
	};

	defaultShortcode = new Shortcode();
	shortcode = new Shortcode( data );

	it( 'Defaults set correctly.', function() {
		expect( defaultShortcode.get( 'label' ) ).toEqual( '' );
		expect( defaultShortcode.get( 'shortcode_tag' ) ).toEqual( '' );
		expect( defaultShortcode.get( 'attrs' ) instanceof ShortcodeAttributes ).toEqual( true );
		expect( defaultShortcode.get( 'attrs' ).length ).toEqual( 0 );
		expect( defaultShortcode.get( 'inner_content' ) ).toEqual( undefined );
	});

	it( 'Attribute data set correctly..', function() {
		expect( shortcode.get( 'attrs' ) instanceof ShortcodeAttributes ).toEqual( true );
		expect( shortcode.get( 'attrs' ).length ).toEqual( 1 );
		expect( shortcode.get( 'attrs' ).first().get('type') ).toEqual( data.attrs[0].type );
	});

	it( 'Inner content set correctly..', function() {
		expect( shortcode.get( 'inner_content' ) instanceof InnerContent ).toEqual( true );
		expect( shortcode.get( 'inner_content' ).get('value') ).toEqual( data.inner_content.value );
	});

	it( 'Converted to JSON correctly.', function() {
		var json = shortcode.toJSON();
		expect( json.label ).toEqual( data.label );
		expect( json.attrs[0].label ).toEqual( data.attrs[0].label );
	});

	it( 'Format shortcode.', function() {

		var _shortcode = jQuery.extend( true, {}, shortcode );

		// Test with attribute and with content.
		expect( _shortcode.formatShortcode() ).toEqual( '[test_shortcode attr="test value"]test content[/test_shortcode]' );

		// Test without content.
		_shortcode.get('inner_content').unset( 'value' );
		expect( _shortcode.formatShortcode() ).toEqual( '[test_shortcode attr="test value"]' );

		// Test without attributes
		_shortcode.get( 'attrs' ).first().unset( 'value' );
		expect( _shortcode.formatShortcode() ).toEqual( '[test_shortcode]' );

	});

	it( 'Format shortcode with encoded attributes.', function() {

		var shortcode_encoded_attribute, formatted, expected;

		shortcode_encoded_attribute = new Shortcode({
			label: 'Test Label',
			shortcode_tag: 'test_shortcode_encoded',
			attrs: [
				{
					attr:   'attr',
					type:   'text',
					value:  '<b class="foo">bar</b>',
					encode: true,
				},
			],
		});

		formatted = shortcode_encoded_attribute.formatShortcode();
		expected  = '[test_shortcode_encoded attr="%3Cb%20class%3D%22foo%22%3Ebar%3C%2Fb%3E"]';
		expect( formatted ).toEqual( expected );

	});

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../js/src/collections/shortcode-attributes":7,"../../js/src/models/inner-content":9,"../../js/src/models/shortcode":11,"../../js/src/models/shortcode-attribute":10}],4:[function(require,module,exports){
(function (global){
var Shortcode = require('../../js/src/models/shortcode');
var ShortcodeViewConstructor = require('../../js/src/utils/shortcode-view-constructor');
var sui = require('../../js/src/utils/sui');
var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

describe( 'Shortcode View Constructor', function(){


	it( 'Persists inner_content when parsing a shortcode without inner_content attribute defined', function(){
		var data = {
			label: 'Test Label',
			shortcode_tag: 'no_inner_content',
			attrs: [
				{
					attr:        'foo',
					label:       'Attribute',
					type:        'text',
					value:       'test value',
					placeholder: 'test placeholder',
				}
			]
		};
		sui.shortcodes.add( data );
		var shortcode = ShortcodeViewConstructor.parseShortcodeString( '[no_inner_content foo="bar"]burrito[/no_inner_content]' );
		var _shortcode = $.extend( true, {}, shortcode );
		expect( _shortcode.formatShortcode() ).toEqual( '[no_inner_content foo="bar"]burrito[/no_inner_content]' );
		ShortcodeViewConstructor.shortcode = {
			'type' : 'single',
			'tag' : 'no_inner_content',
			'attrs' : {
				'named' : {
					'foo' : 'bar',
				},
				'numeric' : [],
			},
			'content' : 'burrito'
		};
		var ShortcodeViewConstructorWithoutFetch = ShortcodeViewConstructor;
		ShortcodeViewConstructorWithoutFetch.delayedFetch = function() {
			return new $.Deferred();
		};
		ShortcodeViewConstructor.initialize();
		expect( ShortcodeViewConstructor.shortcodeModel.formatShortcode() ).toEqual( '[no_inner_content foo="bar"]burrito[/no_inner_content]' );
	});

	it( 'Persists custom attribute when parsing a shortcode without the attribute defined in UI', function() {
		var data = {
			label: 'Test Label',
			shortcode_tag: 'no_custom_attribute',
			attrs: [
				{
					attr:        'foo',
					label:       'Attribute',
					type:        'text',
				}
			]
		};
		sui.shortcodes.add( data );
		var shortcode = ShortcodeViewConstructor.parseShortcodeString( '[no_custom_attribute foo="bar" bar="banana"]' );
		var _shortcode = $.extend( true, {}, shortcode );
		expect( _shortcode.formatShortcode() ).toEqual( '[no_custom_attribute foo="bar" bar="banana"]' );
		ShortcodeViewConstructor.shortcode = {
			'type' : 'single',
			'tag' : 'no_custom_attribute',
			'attrs' : {
				'named' : {
					'foo' : 'bar',
					'bar' : 'banana',
				},
				'numeric' : [],
			},
		};
		var ShortcodeViewConstructorWithoutFetch = ShortcodeViewConstructor;
		ShortcodeViewConstructorWithoutFetch.delayedFetch = function() {
			return new $.Deferred();
		};
		ShortcodeViewConstructor.initialize();
		expect( ShortcodeViewConstructor.shortcodeModel.formatShortcode() ).toEqual( '[no_custom_attribute foo="bar" bar="banana"]' );
	});

	it( 'Reverses the effect of core adding wpautop to shortcode inner content', function(){
		var shortcode = {
			tag: 'pullquote',
			content: 'This quote has</p>\n<p>Multiple line breaks two</p>\n<p>Test one',
			type: 'closed',
			attrs: {
				named: {},
				numeric: [],
			}
		};
		var data = {
			label: 'Pullquote',
			shortcode_tag: 'pullquote',
			inner_content: true,
		};
		sui.shortcodes.add( data );
		var model = ShortcodeViewConstructor.getShortcodeModel( shortcode );
		expect( model.get('inner_content').get('value') ).toEqual( 'This quote has\n\nMultiple line breaks two\n\nTest one' );
	});

	it( 'Reverses the effect of core adding wpautop to shortcode attribute', function(){
		var shortcode = {
			tag: 'pullquote_attr',
			attrs: {
				named: {
					quote: 'This quote has</p>\n<p>Multiple line breaks two</p>\n<p>Test one',
				},
			},
			type: 'single',
			content: null,
		};
		var data = {
			label: 'Pullquote',
			shortcode_tag: 'pullquote_attr',
			attrs: [
				{
					attr: 'quote',
					label: 'Quote',
					type: 'text',
				}
			],
		};
		sui.shortcodes.add( data );
		var model = ShortcodeViewConstructor.getShortcodeModel( shortcode );
		expect( model.get('attrs').first().get('value') ).toEqual( 'This quote has\n\nMultiple line breaks two\n\nTest one' );
	});

	it( 'Can parse shortcode content idempotently', function() {
		sui.shortcodes.add({
			label: 'Test Label',
			shortcode_tag: 'no_custom_content',
			attrs: [
				{
					attr:        'foo',
					label:       'Attribute',
					type:        'text',
					value:       'test value',
					placeholder: 'test placeholder',
				}
			]
		});
    var shortcodeString = '[no_custom_content foo="bar"]';
		var firstCall = ShortcodeViewConstructor.parseShortcodeString( shortcodeString );
		var secondCall = ShortcodeViewConstructor.parseShortcodeString( shortcodeString );
		expect( secondCall ).toBeDefined();
	});

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../js/src/models/shortcode":11,"../../js/src/utils/shortcode-view-constructor":13,"../../js/src/utils/sui":14}],5:[function(require,module,exports){
(function (global){
var Shortcode = require('./../../../js/src/models/shortcode.js');
var MceViewConstructor = require('./../../../js/src/utils/shortcode-view-constructor.js');
var sui = require('./../../../js/src/utils/sui.js');
var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var wp = (typeof window !== "undefined" ? window['wp'] : typeof global !== "undefined" ? global['wp'] : null);

describe( "MCE View Constructor", function() {

	beforeEach( function() {
		wp.shortcode.regexp = function( tag ) {
			return new RegExp( '\\[(\\[?)(' + tag + ')(?![\\w-])([^\\]\\/]*(?:\\/(?!\\])[^\\]\\/]*)*?)(?:(\\/)\\]|\\](?:([^\\[]*(?:\\[(?!\\/\\2\\])[^\\[]*)*)(\\[\\/\\2\\]))?)(\\]?)', 'g' );
		};
	});

	sui.shortcodes.push( new Shortcode( {
		label: 'Test Label',
		shortcode_tag: 'test_shortcode',
		attrs: [
			{
				attr:        'attr',
				label:       'Attribute',
			}
		],
		inner_content: {
			value: 'test content',
		},
	} ) );

	sui.shortcodes.push( new Shortcode( {
		label: 'Test shortcode with dash',
		shortcode_tag: 'test-shortcode',
		attrs: [
			{
				attr:        'test-attr',
				label:       'Test attribute with dash',
			}
		],
		inner_content: {
			value: 'test content',
		},
	} ) );

	sui.shortcodes.push( new Shortcode( {
		label: 'Test Label',
		shortcode_tag: 'test_shortcode_encoded',
		attrs: [
			{
				attr:   'attr',
				label:  'Attribute',
				encode: true,
			}
		],
	} ) );

	it ( 'test get shortcode model', function() {

		var constructor = jQuery.extend( true, {}, MceViewConstructor );

		constructor.shortcode = {
			tag: "test_shortcode",
			attrs: {
				named: {
					attr: "Vestibulum ante ipsum primis"
				},
			},
			content: "Mauris iaculis porttitor posuere."
		};

		constructor.shortcodeModel = constructor.getShortcodeModel( constructor.shortcode );
		expect( constructor.shortcodeModel instanceof Shortcode ).toEqual( true );
		expect( constructor.shortcodeModel.get( 'attrs' ).first().get( 'value' ) ).toEqual( 'Vestibulum ante ipsum primis' );
		expect( constructor.shortcodeModel.get( 'inner_content' ).get( 'value' ) ).toEqual( 'Mauris iaculis porttitor posuere.' );

	} );

	describe( "Fetch preview HTML", function() {

		beforeEach(function() {
			jasmine.Ajax.install();
		});

		afterEach(function() {
			jasmine.Ajax.uninstall();
		});

		var constructor = jQuery.extend( true, {
			render: function( force ) {},
		}, MceViewConstructor );

		// Mock shortcode model data.
		constructor.shortcodeModel = jQuery.extend( true, {}, sui.shortcodes.first() );

		it( 'Fetches data success', function(){

			spyOn( wp.ajax, "post" ).and.callThrough();
			spyOn( constructor, "render" );

			constructor.fetch();

			expect( constructor.fetching ).toEqual( true );
			expect( constructor.content ).toEqual( undefined );
			expect( wp.ajax.post ).toHaveBeenCalled();
			expect( constructor.render ).not.toHaveBeenCalled();

			jasmine.Ajax.requests.mostRecent().respondWith( {
				'status': 200,
				'responseText': '{"success":true,"data":"test preview response body"}'
			} );

			expect( constructor.fetching ).toEqual( undefined );
			expect( constructor.content ).toEqual( 'test preview response body' );
			expect( constructor.render ).toHaveBeenCalled();

		});

		it( 'Handles errors when fetching data', function() {

			spyOn( constructor, "render" );

			constructor.fetch();

			jasmine.Ajax.requests.mostRecent().respondWith( {
				'status': 500,
				'responseText': '{"success":false}'
			});

			expect( constructor.fetching ).toEqual( undefined );
			expect( constructor.content ).toContain( 'shortcake-error' );
			expect( constructor.render ).toHaveBeenCalled();

		} );

	} );

	it( 'parses simple shortcode', function() {
		var shortcode = MceViewConstructor.parseShortcodeString( '[test_shortcode attr="test value"]');
		expect( shortcode instanceof Shortcode ).toEqual( true );
		expect( shortcode.get( 'attrs' ).findWhere( { attr: 'attr' }).get('value') ).toEqual( 'test value' );
	});

	it( 'parses shortcode with content', function() {
		var shortcode = MceViewConstructor.parseShortcodeString( '[test_shortcode attr="test value 1"]test content[/test_shortcode]');
		expect( shortcode instanceof Shortcode ).toEqual( true );
		expect( shortcode.get( 'attrs' ).findWhere( { attr: 'attr' }).get('value') ).toEqual( 'test value 1' );
		expect( shortcode.get( 'inner_content' ).get('value') ).toEqual( 'test content' );
	});

	it( 'parses shortcode with dashes in name and attribute', function() {
		var shortcode = MceViewConstructor.parseShortcodeString( '[test-shortcode test-attr="test value 2"]');
		expect( shortcode instanceof Shortcode ).toEqual( true );
		expect( shortcode.get( 'attrs' ).findWhere( { attr: 'test-attr' }).get('value') ).not.toEqual( 'test value 2' );
	});

	// https://github.com/fusioneng/Shortcake/issues/171
	it( 'parses shortcode with line breaks in inner content', function() {
		var shortcode = MceViewConstructor.parseShortcodeString( "[test_shortcode]test \ntest \rtest[/test_shortcode]");
		expect( shortcode instanceof Shortcode ).toEqual( true );
		expect( shortcode.get( 'inner_content' ).get('value') ).toEqual( "test \ntest \rtest" );
	} );

	it( 'parses shortcode with paragraph and br tags in inner content', function() {
		var shortcode = MceViewConstructor.parseShortcodeString( "[test_shortcode]<p>test</p><p>test<br/>test</p>[/test_shortcode]");
		expect( shortcode instanceof Shortcode ).toEqual( true );
		expect( shortcode.get( 'inner_content' ).get('value') ).toEqual( "test\n\ntest\ntest" );
	} );

	it( 'parses shortcode with unquoted attributes', function() {
		var shortcode = MceViewConstructor.parseShortcodeString( '[test_shortcode attr=test]');
		expect( shortcode instanceof Shortcode ).toEqual( true );
		expect( shortcode.get( 'attrs' ).findWhere( { attr: 'attr' }).get('value') ).toEqual( 'test' );
	});

	// See https://github.com/fusioneng/Shortcake/issues/495
	xit( 'parses shortcode with hyphened-attribute', function() {
		var shortcode = MceViewConstructor.parseShortcodeString( '[test-shortcode test-attr=test]');
		expect( shortcode instanceof Shortcode ).toEqual( true );
		expect( shortcode.get( 'attrs' ).findWhere( { attr: 'test-attr' }).get('value') ).toEqual( 'test' );
	});

	it( 'parses shortcode with encoded attribute', function() {
		var shortcode = MceViewConstructor.parseShortcodeString( '[test_shortcode_encoded attr="%3Cb%20class%3D%22foo%22%3Ebar%3C%2Fb%3E"]');
		expect( shortcode instanceof Shortcode ).toEqual( true );
		expect( shortcode.get( 'attrs' ).findWhere({ attr: 'attr' }).get('value') ).toEqual( '<b class="foo">bar</b>' );
	});

} );

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./../../../js/src/models/shortcode.js":11,"./../../../js/src/utils/shortcode-view-constructor.js":13,"./../../../js/src/utils/sui.js":14}],6:[function(require,module,exports){
var Shortcodes = require('./../../../js/src/collections/shortcodes.js');
var sui = require('./../../../js/src/utils/sui.js');

describe( "SUI Util", function() {

	it( 'sets global variable', function() {
		expect( window.Shortcode_UI ).toEqual( sui );
	});

	it( 'expected properties', function() {
		expect( sui.shortcodes instanceof Shortcodes ).toEqual( true );
		expect( sui.views ).toEqual( {} );
	});

} );

},{"./../../../js/src/collections/shortcodes.js":8,"./../../../js/src/utils/sui.js":14}],7:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var ShortcodeAttribute = require('./../models/shortcode-attribute.js');

/**
 * Shortcode Attributes collection.
 */
var ShortcodeAttributes = Backbone.Collection.extend({
	model : ShortcodeAttribute,
	//  Deep Clone.
	clone : function() {
		return new this.constructor(_.map(this.models, function(m) {
			return m.clone();
		}));
	},

});

module.exports = ShortcodeAttributes;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./../models/shortcode-attribute.js":10}],8:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var Shortcode = require('./../models/shortcode.js');

// Shortcode Collection
var Shortcodes = Backbone.Collection.extend({
	model : Shortcode
});

module.exports = Shortcodes;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./../models/shortcode.js":11}],9:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);

/**
 * Shortcode Attribute Model.
 */
var InnerContent = Backbone.Model.extend({
	defaults : {
		label:       shortcodeUIData.strings.insert_content_label,
		type:        'textarea',
		value:       '',
		placeholder: '',
	},
});

module.exports = InnerContent;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],10:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);

var ShortcodeAttribute = Backbone.Model.extend({

	defaults: {
		attr:        '',
		label:       '',
		type:        '',
		value:       '',
		description: '',
		encode:      false,
		meta: {
			placeholder: '',
		},
	},

});

module.exports = ShortcodeAttribute;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],11:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var ShortcodeAttributes = require('./../collections/shortcode-attributes.js');
var InnerContent = require('./inner-content.js');
var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

Shortcode = Backbone.Model.extend({

	defaults: {
		label: '',
		shortcode_tag: '',
		attrs: new ShortcodeAttributes(),
		attributes_backup: {},
	},

	/**
	 * Custom set method.
	 * Handles setting the attribute collection.
	 */
	set: function( attributes, options ) {

		if ( attributes.attrs !== undefined && ! ( attributes.attrs instanceof ShortcodeAttributes ) ) {
			attributes.attrs = new ShortcodeAttributes( attributes.attrs );
		}

		if ( attributes.inner_content && ! ( attributes.inner_content instanceof InnerContent ) ) {
			attributes.inner_content = new InnerContent( attributes.inner_content );
		}

		return Backbone.Model.prototype.set.call(this, attributes, options);
	},

	/**
	 * Custom toJSON.
	 * Handles converting the attribute collection to JSON.
	 */
	toJSON: function( options ) {
		options = Backbone.Model.prototype.toJSON.call(this, options);
		if ( options.attrs && ( options.attrs instanceof ShortcodeAttributes ) ) {
			options.attrs = options.attrs.toJSON();
		}
		if ( options.inner_content && ( options.inner_content instanceof InnerContent ) ) {
			options.inner_content = options.inner_content.toJSON();
		}
		return options;
	},

	/**
	 * Custom clone
	 * Make sure we don't clone a reference to attributes.
	 */
	clone: function() {
		var clone = Backbone.Model.prototype.clone.call( this );
		clone.set( 'attrs', clone.get( 'attrs' ).clone() );
		if ( clone.get( 'inner_content' ) ) {
			clone.set( 'inner_content', clone.get( 'inner_content' ).clone() );
		}
		return clone;
	},

	/**
	 * Get the shortcode as... a shortcode!
	 *
	 * @return string eg [shortcode attr1=value]
	 */
	formatShortcode: function() {

		var template, shortcodeAttributes, attrs = [], content, self = this;

		this.get( 'attrs' ).each( function( attr ) {

			// Skip empty attributes.
			if ( ! attr.get( 'value' ) ||  attr.get( 'value' ).length < 1 ) {
				return;
			}

			// Encode textareas incase HTML
			if ( attr.get( 'encode' ) ) {
				attr.set( 'value', encodeURIComponent( decodeURIComponent( attr.get( 'value' ) ) ), { silent: true } );
			}

			attrs.push( attr.get( 'attr' ) + '="' + attr.get( 'value' ) + '"' );

		} );

		$.each( this.get( 'attributes_backup' ), function( key, value){
			attrs.push( key + '="' + value + '"' );
		});

		if ( this.get( 'inner_content' ) ) {
			content = this.get( 'inner_content' ).get( 'value' );
		} else if ( this.get( 'inner_content_backup' ) ) {
			content = this.get( 'inner_content_backup' );
		}

		if ( attrs.length > 0 ) {
			template = "[{{ shortcode }} {{ attributes }}]";
		} else {
			template = "[{{ shortcode }}]";
		}

		if ( content && content.length > 0 ) {
			template += "{{ content }}[/{{ shortcode }}]";
		}

		template = template.replace( /{{ shortcode }}/g, this.get('shortcode_tag') );
		template = template.replace( /{{ attributes }}/g, attrs.join( ' ' ) );
		template = template.replace( /{{ content }}/g, content );

		return template;

	},
});

module.exports = Shortcode;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./../collections/shortcode-attributes.js":7,"./inner-content.js":9}],12:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

/**
 * A Utility object for batching requests for shortcode previews.
 *
 * Returns a "singleton" object with two methods, `queueToFetch` and
 * `fetchAll`. Calling `Fetcher.queueToFetch()` will add the requested query to
 * the fetcher's array, and set a timeout to run all queries after the current
 * call stack has finished.
 *
 * @this {Fetcher} aliased as `fetcher`
 */
var Fetcher = (function() {
	var fetcher = this;

	/*
	 * Counter, used to match each request in a batch with its response.
	 * @private
	 */
	this.counter = 0;

	/*
	 * Array of queries to be executed in a batch.
	 * @private
	 */
	this.queries = [];

	/*
	 * The timeout for the current batch request.
	 * @private
	 */
	this.timeout = null;

	/**
	 * Add a query to the queue.
	 *
	 * Adds the requested query to the next batch. Either sets a timeout to
	 * fetch previews, or adds to the current one if one is already being
	 * built. Returns a jQuery Deferred promise that will be resolved when the
	 * query is successful or otherwise complete.
	 *
	 * @param {object} query Object containing fields required to render preview: {
	 *   @var {integer} post_id Post ID
	 *   @var {string} shortcode Shortcode string to render
	 *   @var {string} nonce Preview nonce
	 * }
	 * @return {Deferred}
	 */
	this.queueToFetch = function( query ) {
		var fetchPromise = new $.Deferred();

		query.counter = ++fetcher.counter;

		fetcher.queries.push({
			promise: fetchPromise,
			query: query,
			counter: query.counter
		});

		if ( ! fetcher.timeout ) {
			fetcher.timeout = setTimeout( fetcher.fetchAll );
		}

		return fetchPromise;
	};

	/**
	 * Execute all queued queries.
	 *
	 * Posts to the `bulk_do_shortcode` ajax endpoint to retrieve any queued
	 * previews. When that request recieves a response, goes through the
	 * response and resolves each of the promises in it.
	 *
	 * @this {Fetcher}
	 */
	this.fetchAll = function() {
		delete fetcher.timeout;

		if ( 0 === fetcher.queries.length ) {
			return;
		}

		var request = $.post( ajaxurl + '?action=bulk_do_shortcode', {
				queries: _.pluck( fetcher.queries, 'query' )
			}
		);

		request.done( function( response ) {
			_.each( response.data, function( result, index ) {
				var matchedQuery = _.findWhere( fetcher.queries, {
					counter: parseInt( index ),
				});

				if ( matchedQuery ) {
					fetcher.queries = _.without( fetcher.queries, matchedQuery );
					matchedQuery.promise.resolve( result );
				}
			} );
		} );
	};

	// Public API methods available
	return {
		queueToFetch : this.queueToFetch,
		fetchAll     : this.fetchAll
	};

})();

module.exports = Fetcher;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],13:[function(require,module,exports){
(function (global){
var sui = require('./sui.js'),
	fetcher = require('./fetcher.js'),
	wp = (typeof window !== "undefined" ? window['wp'] : typeof global !== "undefined" ? global['wp'] : null),
	$ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

/**
 * Generic shortcode MCE view constructor.
 *
 * A Backbone-like View constructor intended for use when rendering a TinyMCE View.
 * The main difference is that the TinyMCE View is not tied to a particular DOM node.
 * This is cloned and used by each shortcode when registering a view.
 *
 */
var shortcodeViewConstructor = {

	/**
	 * Initialize a shortcode preview View.
	 *
	 * Fetches the preview by making a delayed Ajax call, and renders if a preview can be fetched.
	 *
	 * @constructor
	 * @this {Shortcode} Model registered with sui.shortcodes
	 * @param {Object} options Options
	 */
	initialize: function( options ) {
		var self = this;

		this.shortcodeModel = this.getShortcodeModel( this.shortcode );
		this.fetching = this.delayedFetch();

		this.fetching.done( function( queryResponse ) {
			var response = queryResponse.response;
			if ( '' === response ) {
				var span = $('<span />').addClass('shortcake-notice shortcake-empty').text( self.shortcodeModel.formatShortcode() );
				var wrapper = $('<div />').html( span );
				self.content = wrapper.html();
			} else {
				self.content = response;
			}
		}).fail( function() {
			var span = $('<span />').addClass('shortcake-error').text( shortcodeUIData.strings.mce_view_error );
			var wrapper = $('<div />').html( span );
			self.content = wrapper.html();
		} ).always( function() {
			delete self.fetching;
			self.render( null, true );
		} );
	},

	/**
	 * Get the shortcode model given the view shortcode options.
	 *
	 * If the shortcode found in the view is registered with Shortcake, this
	 * will clone the shortcode's Model and assign appropriate attribute
	 * values.
	 *
	 * @this {Shortcode}
	 * @param {Object} options Options formatted as wp.shortcode.
	 */
	getShortcodeModel: function( options ) {
		var shortcodeModel;

		shortcodeModel = sui.shortcodes.findWhere( { shortcode_tag: options.tag } );

		if ( ! shortcodeModel ) {
			return;
		}

		currentShortcode = shortcodeModel.clone();

		var attributes_backup = {};
		var attributes = options.attrs;
		for ( var key in attributes.named ) {

			if ( ! attributes.named.hasOwnProperty( key ) ) {
				continue;
			}

			value = attributes.named[ key ];
			attr  = currentShortcode.get( 'attrs' ).findWhere({ attr: key });

			// Reverse the effects of wpautop: https://core.trac.wordpress.org/ticket/34329
			value = this.unAutoP( value );

			if ( attr && attr.get('encode') ) {
				value = decodeURIComponent( value );
			}

			if ( attr ) {
				attr.set( 'value', value );
			} else {
				attributes_backup[ key ] = value;
			}
		}

		currentShortcode.set( 'attributes_backup', attributes_backup );

		if ( options.content ) {
			var inner_content = currentShortcode.get( 'inner_content' );
			// Reverse the effects of wpautop: https://core.trac.wordpress.org/ticket/34329
			options.content = this.unAutoP( options.content );
			if ( inner_content ) {
				inner_content.set( 'value', options.content );
			} else {
				currentShortcode.set( 'inner_content_backup', options.content );
			}
		}

		return currentShortcode;
	},

	/**
	 * Queue a request with Fetcher class, and return a promise.
	 *
	 * @return {Promise}
	 */
	delayedFetch: function() {
		return fetcher.queueToFetch({
			post_id: $( '#post_ID' ).val(),
			shortcode: this.shortcodeModel.formatShortcode(),
			nonce: shortcodeUIData.nonces.preview,
		});
	},

	/**
	 * Fetch a preview of a single shortcode.
	 *
	 * Async. Sets this.content and calls this.render.
	 *
	 * @return undefined
	 */
	fetch: function() {
		var self = this;

		if ( ! this.fetching ) {
			this.fetching = true;

			wp.ajax.post( 'do_shortcode', {
				post_id: $( '#post_ID' ).val(),
				shortcode: this.shortcodeModel.formatShortcode(),
				nonce: shortcodeUIData.nonces.preview,
			}).done( function( response ) {
				if ( '' === response ) {
					self.content = '<span class="shortcake-notice shortcake-empty">' + self.shortcodeModel.formatShortcode() + '</span>';
				} else {
					self.content = response;
				}
			}).fail( function() {
				self.content = '<span class="shortcake-error">' + shortcodeUIData.strings.mce_view_error + '</span>';
			} ).always( function() {
				delete self.fetching;
				self.render( null, true );
			} );
		}
	},

	/**
	 * Get the shortcode model and open modal UI for editing.
	 *
	 * @param {string} shortcodeString String representation of the shortcode
	 */
	edit: function( shortcodeString ) {
		var currentShortcode;

		// Backwards compatability for WP pre-4.2
		if ( 'object' === typeof( shortcodeString ) ) {
			shortcodeString = decodeURIComponent( $(shortcodeString).attr('data-wpview-text') );
		}

		currentShortcode = this.parseShortcodeString( shortcodeString );

		if ( currentShortcode ) {

			var wp_media_frame = wp.media.frames.wp_media_frame = wp.media({
				frame : "post",
				state : 'shortcode-ui',
				currentShortcode : currentShortcode,
			});

			wp_media_frame.open();

		}

	},

	/**
	 * Parse a shortcode string and return shortcode model.
	 * Must be a shortcode which has UI registered with Shortcake - see
	 * `window.sui.shortcodes`.
	 *
	 * @todo - I think there must be a cleaner way to get the
	 * shortcode & args here that doesn't use regex.
	 *
	 * @param  {string} shortcodeString
	 * @return Shortcode
	 */
	parseShortcodeString: function( shortcodeString ) {
		var model, attr;

		var shortcode_tags = _.map( sui.shortcodes.pluck( 'shortcode_tag' ), this.pregQuote ).join( '|' );
		var regexp = wp.shortcode.regexp( shortcode_tags );
		regexp.lastIndex = 0;
		var matches = regexp.exec( shortcodeString );

		if ( ! matches ) {
			return;
		}

		defaultShortcode = sui.shortcodes.findWhere({
			shortcode_tag : matches[2]
		});

		if ( ! defaultShortcode ) {
			return;
		}

		var shortcode = wp.shortcode.fromMatch( matches );
		return this.getShortcodeModel( shortcode );
	},

 	/**
	 * Strip 'p' and 'br' tags, replace with line breaks.
	 *
	 * Reverses the effect of the WP editor autop functionality.
	 *
	 * @param {string} content Content with `<p>` and `<br>` tags inserted
	 * @return {string}
	 */
	unAutoP: function( content ) {
		if ( switchEditors && switchEditors.pre_wpautop ) {
			content = switchEditors.pre_wpautop( content );
		}

		return content;
	},

	/**
	 * Escape any special characters in a string to be used as a regular expression.
	 *
	 * JS version of PHP's preg_quote()
	 *
	 * @see http://phpjs.org/functions/preg_quote/
	 *
	 * @param {string} str String to parse
	 * @param {string} delimiter Delimiter character to be also escaped - not used here
	 * @return {string}
	 */
	pregQuote: function( str, delimiter ) {
		return String(str)
			.replace(
				new RegExp( '[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + ( delimiter || '' ) + '-]', 'g' ),
				'\\$&' );
	},

	// Backwards compatability for Pre WP 4.2.
	View: {

		overlay: true,

		initialize: function( options ) {
			this.shortcode = this.getShortcode( options );
			this.fetch();
		},

		getShortcode: function( options ) {

			var shortcodeModel, shortcode;

			shortcodeModel = sui.shortcodes.findWhere( { shortcode_tag: options.shortcode.tag } );

			if (!shortcodeModel) {
				return;
			}

			shortcode = shortcodeModel.clone();

			shortcode.get('attrs').each(
					function(attr) {

						if (attr.get('attr') in options.shortcode.attrs.named) {
							attr.set('value',
									options.shortcode.attrs.named[attr
											.get('attr')]);
						}

					});

			if ('content' in options.shortcode) {
				var inner_content = shortcode.get('inner_content');
				if ( inner_content ) {
					inner_content.set('value', options.shortcode.content);
				}
			}

			return shortcode;

		},

		fetch : function() {

			var self = this;

			if ( ! this.parsed ) {

				wp.ajax.post( 'do_shortcode', {
					post_id: $( '#post_ID' ).val(),
					shortcode: this.shortcode.formatShortcode(),
					nonce: shortcodeUIData.nonces.preview,
				}).done( function( response ) {
					if ( response.indexOf( '<script' ) !== -1 ) {
						self.setIframes( self.getEditorStyles(), response );
					} else {
						self.parsed = response;
						self.render( true );
					}
				}).fail( function() {
					self.parsed = '<span class="shortcake-error">' + shortcodeUIData.strings.mce_view_error + '</span>';
					self.render( true );
				} );

			}

		},

		/**
		 * Render the shortcode
		 *
		 * To ensure consistent rendering - this makes an ajax request to the
		 * admin and displays.
		 *
		 * @return string html
		 */
		getHtml : function() {
			return this.parsed;
		},

		/**
		 * Returns an array of <link> tags for stylesheets applied to the TinyMCE editor.
		 *
		 * @method getEditorStyles
		 * @returns {Array}
		 */
		getEditorStyles: function() {

			var styles = '';

			this.getNodes( function ( editor, node, content ) {
				var dom = editor.dom,
					bodyClasses = editor.getBody().className || '',
					iframe, iframeDoc, i, resize;

				tinymce.each( dom.$( 'link[rel="stylesheet"]', editor.getDoc().head ), function( link ) {
					if ( link.href && link.href.indexOf( 'skins/lightgray/content.min.css' ) === -1 &&
						link.href.indexOf( 'skins/wordpress/wp-content.css' ) === -1 ) {

						styles += dom.getOuterHTML( link ) + '\n';
					}

				});

			} );

			return styles;
		},

	},
};

module.exports = sui.utils.shortcodeViewConstructor = shortcodeViewConstructor;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./fetcher.js":12,"./sui.js":14}],14:[function(require,module,exports){
var Shortcodes = require('./../collections/shortcodes.js');

window.Shortcode_UI = window.Shortcode_UI || {
	shortcodes: new Shortcodes(),
	views: {},
	controllers: {},
	utils: {},
};

module.exports = window.Shortcode_UI;

},{"./../collections/shortcodes.js":8}]},{},[1,2,3,4,5,6]);
