<?php 
return [
	'format'           => 'A4', // See https://mpdf.github.io/paging/page-size-orientation.html
	'author'           => 'John Doe',
	'subject'          => 'This Document will explain the whole universe.',
	'keywords'         => 'PDF, Laravel, Package, Peace', // Separate values with comma
	'creator'          => 'Laravel Pdf',
	'display_mode'     => 'fullpage',
    'font_path' => storage_path('fonts/'),
	'font_data' => [
		'noto_naskh_arabic' => [
			'R'  => 'NotoNaskhArabic-Regular.ttf',    // regular font
			'B'  => 'NotoNaskhArabic-Bold.ttf',       // optional: bold font
			'I'  => 'NotoNaskhArabic-Italic.ttf',     // optional: italic font
			'BI' => 'NotoNaskhArabic-Bold-Italic.ttf' // optional: bold-italic font
			//'useOTL' => 0xFF,    // required for complicated langs like Persian, Arabic and Chinese
			//'useKashida' => 75,  // required for complicated langs like Persian, Arabic and Chinese
		]
		// ...add as many as you want.
	]
];

?>