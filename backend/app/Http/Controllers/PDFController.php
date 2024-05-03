<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PDF;
use File;
use TCPDF;
use Storage;

class PDFController extends Controller
{
    public function updatePDF(Request $request)
    {

      $pdf = PDF::loadView('pdf/pdf-template', [
            'logo' => base64_encode(file_get_contents(public_path('images/pdf-logo.png'))),
            'investor_name' => "Ijaz Ali",
            'submission_date' =>date('d-m-Y'),
        ]);

        // Create the destination folder if it doesn't exist
        $destinationPath = public_path('uploaded_pdfs');
        if (!File::exists($destinationPath)) {
            File::makeDirectory($destinationPath, 0755, true);
        }

        // Upload the PDF to a folder
        $destinationPath = public_path('uploaded_pdfs');
        $newFileName = 'updated_pdf_' . time() . '.pdf';
        $uploadedFile = $pdf->save($destinationPath . '/' . $newFileName);

        // Optionally, you can delete the temporary PDF file
        // unlink($pdfPath);
exit;
        $locale = 'ar';
        if (in_array($locale, config('app.locales'))) {
            app()->setLocale($locale);
        }
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);
        $pdf->AddPage();
        // Prepare the base64-encoded PNG image
        $logo = base64_encode(file_get_contents(public_path('images/pdf-logo.png')));
        $investor_name = "Ijaz Ali";
        $submission_date = date('d-m-Y');
        // Load and render the Blade view's HTML content
        $htmlContent = view('pdf/pdf-template', compact('logo', 'investor_name', 'submission_date'))->render();
        $pdf->WriteHTML($htmlContent, true, 0, true, 0);

        $pdf->Output('arabic_document.pdf', 'I');
        exit;
// Get the PDF content
$pdfContent = $pdf->Output('arabic_document.pdf', 'S');

// Store the PDF in the storage/app directory
Storage::put('pdfs/arabic_document.pdf', $pdfContent);

return "PDF has been generated and stored in storage/app/pdfs/arabic_document.pdf";
// // Get the PDF content
// $pdfContent = $pdf->Output('arabic_document.pdf', 'S');

// // Return the PDF as a downloadable response
// return response($pdfContent)
//     ->header('Content-Type', 'application/pdf')
//     ->header('Content-Disposition', 'attachment; filename="arabic_document.pdf"');

        exit;
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

// set document information
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Nicola Asuni');
$pdf->SetTitle('TCPDF Example 018');
$pdf->SetSubject('TCPDF Tutorial');
$pdf->SetKeywords('TCPDF, PDF, example, test, guide');

// set default header data
$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE.' 018', PDF_HEADER_STRING);

// set header and footer fonts
$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

// set auto page breaks
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

// set image scale factor
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

// set some language dependent data:
$lg = Array();
$lg['a_meta_charset'] = 'UTF-8';
$lg['a_meta_dir'] = 'rtl';
$lg['a_meta_language'] = 'fa';
$lg['w_page'] = 'page';

// set some language-dependent strings (optional)
$pdf->setLanguageArray($lg);

// ---------------------------------------------------------

// set font
$pdf->SetFont('dejavusans', '', 12);

// add a page
$pdf->AddPage();

// Persian and English content
$htmlpersian = '<span color="#660000">Persian example:</span><br />سلام بالاخره مشکل PDF فارسی به طور کامل حل شد. اینم یک نمونش.<br />مشکل حرف \"ژ\" در بعضی کلمات مانند کلمه ویژه نیز بر طرف شد.<br />نگارش حروف لام و الف پشت سر هم نیز تصحیح شد.<br />با تشکر از  "Asuni Nicola" و محمد علی گل کار برای پشتیبانی زبان فارسی.';
$pdf->WriteHTML($htmlpersian, true, 0, true, 0);

// set LTR direction for english translation
$pdf->setRTL(false);

$pdf->SetFontSize(10);

// print newline
$pdf->Ln();

// Persian and English content
$htmlpersiantranslation = '<span color="#0000ff">Hi, At last Problem of Persian PDF Solved completely. This is a example for it.<br />Problem of "jeh" letter in some word like "ویژه" (=special) fix too.<br />The joining of laa and alf letter fix now.<br />Special thanks to "Nicola Asuni" and "Mohamad Ali Golkar" for Persian support.</span>';
$pdf->WriteHTML($htmlpersiantranslation, true, 0, true, 0);

// Restore RTL direction
$pdf->setRTL(true);

// set font
$pdf->SetFont('aefurat', '', 18);

// print newline
$pdf->Ln();

// Arabic and English content
$pdf->Cell(0, 12, 'بِسْمِ اللهِ الرَّحْمنِ الرَّحِيمِ',0,1,'C');
$htmlcontent = 'تمَّ بِحمد الله حلّ مشكلة الكتابة باللغة العربية في ملفات الـ<span color="#FF0000">PDF</span> مع دعم الكتابة <span color="#0000FF">من اليمين إلى اليسار</span> و<span color="#009900">الحركَات</span> .<br />تم الحل بواسطة <span color="#993399">صالح المطرفي و Asuni Nicola</span>  . ';
$pdf->WriteHTML($htmlcontent, true, 0, true, 0);

// set LTR direction for english translation
$pdf->setRTL(false);

// print newline
$pdf->Ln();

$pdf->SetFont('aealarabiya', '', 18);

// Arabic and English content
$htmlcontent2 = '<span color="#0000ff">This is Arabic "العربية" Example With TCPDF.</span>';
$pdf->WriteHTML($htmlcontent2, true, 0, true, 0);

// ---------------------------------------------------------

//Close and output PDF document
$pdf->Output('example_018.pdf', 'I');

//============================================================+
// END OF FILE
//============================================================+


        //TCPDF
        // Initialize TCPDF
        $pdf = new TCPDF();
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);
        $pdf->AddPage();
        // $fontPath = public_path('fonts/notonaskharabic-regular.ttf');
        // Set font for Arabic content (you may need to adjust the font path)
        // $fontPath = public_path('fonts/NotoNaskhArabic-Regular.ttf');
        // $pdf->SetFont($fontPath, '', 14, '', true);

        // Write Arabic text
        $arabicText = __('messages.hello'); // Get the translated text from language files
        $pdf->Write(0, $arabicText, '', 0, 'C', true, 0, false, false, 0);

        // Output PDF
        $pdf->Output('document.pdf', 'I');
        //DOMPDF
        $pdf = PDF::loadView('pdf/pdf-template')->setOptions([
            'fontDir' => public_path('fonts/'),
            'fontCache' => storage_path('app/fonts'),
            // 'defaultFont' => 'noto_naskh_arabic', // Use the font configuration key here
        ]);
        $pdf->getDomPDF()->getOptions()->setDefaultFont('noto_naskh_arabic');
        return $pdf->stream('document.pdf', ['Content-Type' => 'application/pdf']);

        // return $pdf->stream('document.pdf');

        $pdf = PDF::loadView('pdf/pdf-template', [
            'name' => $request->input('name'),
            'field1' => $request->input('field1'),
            // Add other fields here
        ])->setOptions([
            'font_path' => storage_path('fonts/static/NotoSansArabic-Regular.ttf'), // Update with actual font path
            'font' => 'NotoSansArabic-Regular',
        ]);
        return $pdf->download('your-pdf-file-name.pdf');

        // $pdf = PDF::loadView('pdf/pdf-template', [
        //     'name' => $request->input('name'),
        //     'field1' => $request->input('field1'),
        //     // Add other fields here
        // ]);

        // // Save the PDF to a temporary location
        // $pdfPath = storage_path('app/temp.pdf');
        // $pdf->save($pdfPath);

        // Create the destination folder if it doesn't exist
        // $destinationPath = public_path('uploaded_pdfs');
        // if (!File::exists($destinationPath)) {
        //     File::makeDirectory($destinationPath, 0755, true);
        // }

        // // Upload the PDF to a folder
        // $destinationPath = public_path('uploaded_pdfs');
        // $newFileName = 'updated_pdf_' . time() . '.pdf';
        // $uploadedFile = $pdf->save($destinationPath . '/' . $newFileName);

        // Optionally, you can delete the temporary PDF file
        // unlink($pdfPath);

        return response()->json(['message' => 'PDF updated and uploaded successfully']);
    }
}
