var Backbone = require('backbone'),
	wp = require('wp'),
	Shortcodes = require('sui-collections/shortcodes');
	
sui = {};

jQuery(document).ready(function(){

	var shortcodes = new Shortcodes( shortcodeUIData.shortcodes )
	sui.shortcodes = shortcodes;
	
	shortcodes.each( function( shortcode ) {
		if( wp.mce.views ) {
			// Register the mce view for each shortcode.
			// Note - clone the constructor.
			wp.mce.views.register(
				shortcode.get('shortcode_tag'),
				$.extend( true, {}, shortcodeViewConstructor )
			);
		}
	} );

});
