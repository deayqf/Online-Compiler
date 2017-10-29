<?php
ini_set( 'display_errors', 1 ); 
ini_set( 'display_startup_errors', 1 );
error_reporting( E_ALL );

if( isset( $_POST[ 'code' ] ) && !empty( $_POST[ 'code' ] ) ) 
{
	$code = $_POST[ 'code' ];
	$lang = $_POST[ 'lang' ];

	$comp = '';
	$file = '';
	$runc = '';
	switch( $lang )
	{
		case 'c_cpp':
			$comp = 'g++ c_cpp.cpp';
			$file = 'c_cpp.cpp';
			$runc = './a.out';
			break;
		case 'python':
			$comp = 'python -m py_compile python.py';
			$file = 'python.py';
			$runc = 'python python.pyc';
			break;
		case 'lua':
			$comp = 'luac5.3 lua.lua';
			$file = 'lua.lua';
			$runc = 'lua5.3 luac.out';
			break;
	}

	writeCode( $code, $file );

	$compile_feed = '';
	$run_feed = '';
	if( compileCode( $comp ) == 1 )
	{
		$compile_feed = getError( 'comp_error.txt' );
	}
	else
	{
		if( runCode( $runc ) == 1 )
		{
			$run_feed = getError( 'run_error.txt' );
		}
	}
	
	echo "{$compile_feed} {$run_feed}";
}
elseif( isset( $_POST[ 'ex' ] ) && !empty( $_POST[ 'ex' ] ) )
{
	$file = "{$_POST[ 'ex' ]}.txt";
	$handle = fopen( $file, 'r' );
	$template = fread( $handle, filesize( $file ) );
	fclose( $handle );
	echo $template;
}

function writeCode( $code, $file )
{
	$handle = fopen( $file, 'w+' );
	fwrite( $handle, $code );
	fclose( $handle );
}

function compileCode( $cmd )
{
	$descriptor = array(
		0 => array( "pipe", "r" ),
		1 => array( "pipe", "w" ),
		2 => array( "file", "comp_error.txt", "w+" )
	);

	$proc = proc_open( $cmd, $descriptor, $pipes, NULL, NULL );

	if( is_resource( $proc ) )
	{
		fwrite( $pipes[ 0 ], '<?php print_r( $_ENV ); ?>' );
		fclose( $pipes[ 0 ] );

		echo stream_get_contents( $pipes[ 1 ] );
		fclose( $pipes[ 1 ] );

		$ret_val = proc_close( $proc );
		return $ret_val;
	}
	return 1;
}

function runCode( $cmd )
{
	$descriptor = array(
		0 => array( "pipe", "r" ),
		1 => array( "pipe", "w" ),
		2 => array( "file", "run_error.txt", "w+" )
	);

	$proc = proc_open( $cmd, $descriptor, $pipes, NULL, NULL );

	if( is_resource( $proc ) )
	{
		fwrite( $pipes[ 0 ], '<?php print_r( $_ENV ); ?>' );
		fclose( $pipes[ 0 ] );

		echo stream_get_contents( $pipes[ 1 ] );
		fclose( $pipes[ 1 ] );

		$ret_val = proc_close( $proc );
		return $ret_val;
	}
	return 1;
}

function getError( $file )
{
	$handle = fopen( $file, 'r' );
	$error = fread( $handle, filesize( $file ) );
	fclose( $handle );
	return $error;
}
?>