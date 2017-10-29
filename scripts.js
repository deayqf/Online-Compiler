var editor = ace.edit( 'editor' );
var output = ace.edit( 'output' );

$( function() {
	
	setTheme( 'dracula' );
	editor.$blockScrolling = Infinity;
	setLanguage( 'c_cpp', 'C/C++' );

	output.setTheme( 'ace/theme/terminal' );
	output.renderer.setShowGutter( false );
	output.renderer.$cursorLayer.element.style.display = "none"
	output.$blockScrolling = Infinity;
	output.getSession().setUseWrapMode( true );
	output.setOptions( {
		readOnly: true,
		highlightActiveLine: false,
		highlightGutterLine: false,
		showPrintMargin: false
	});

	$( 'ul#themes li a' ).click( function( e ) {
		e.preventDefault();
		setTheme( $( this ).attr( 'title' ) );
	});

	$( 'ul#langs li a' ).click( function( e ) {
		e.preventDefault();
		setLanguage( $( this ).attr( 'title' ), $( this ).html() );
	});

	$( 'ul#examples li a' ).click( function( e ) {
		e.preventDefault();
		loadExample( $( this ).attr( 'title' ) );
	});

});

function sendToCompiler()
{
	output.setValue( '' );
	var mode = editor.session.$modeId;
	mode = mode.substr( mode.lastIndexOf( '/' ) + 1 );
	$.ajax( {
		url: "controller.php",
		data: { code: editor.getValue() + "\n", lang: mode },
		type: 'post',
		success: function( out )
		{
			output.setValue( out, -1 );
			output.setValue( out, 1 );
		}
	});
}

function setLanguage( mode, lang )
{
	editor.getSession().setMode( 'ace/mode/' + mode );
	$( '#term_head' ).html( lang );

	var version;
	switch( mode )
	{
		case 'c_cpp':
			version = 'g++ v: 5.4.0';
			break;
		case 'python':
			version = 'python v: 2.7.12';
			break;
		case 'lua':
			version = 'lua v: 5.3.1';
			break;
	}
	$( '#out_head' ).html( version );

	var code = JSON.parse( localStorage.getItem( mode ) );
	if( code != null )
	{
		editor.setValue( code, -1 );
		editor.setValue( code, 1 );
	}
	else
	{
		editor.setValue( '' );
	}
	output.setValue( '' );
}

function setTheme( theme )
{
	editor.setTheme( 'ace/theme/' + theme );
	var bg;
	switch( theme )
	{
		case 'monokai':
			bg = '#2F3129';
			break;
		case 'dracula':
			bg = '#21222c';
			break;
		case 'cobalt':
			bg = '#011e3a';
			break;
		case 'xcode':
			bg = '#e8e8e8';
			break;
	}
	$( '#term_body' ).css( 'background-color', bg );
	$( '.ace_gutter' ).css( 'background-color', bg );
}

function clearOutput()
{
	output.setValue( '' );
}

function loadExample( which )
{
	var mode = editor.session.$modeId;
	mode = mode.substr( mode.lastIndexOf( '/' ) + 1 );
	$.ajax( {
		url: 'controller.php',
		data: { ex: mode + which },
		type: 'post',
		success: function( out )
		{
			editor.setValue( out, -1 );
			editor.setValue( out, 1 );
		}
	});
}

function saveCode()
{
	var mode = editor.session.$modeId;
	mode = mode.substr( mode.lastIndexOf( '/' ) + 1 );
	let code = editor.getValue();

	localStorage.setItem( mode, JSON.stringify( code ) );
}
