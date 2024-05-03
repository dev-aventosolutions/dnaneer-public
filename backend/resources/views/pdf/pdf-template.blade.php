<!DOCTYPE html>
<html lang="eng">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic&display=swap" rel="stylesheet" />
    <title>POA Agreement</title>
</head>

<body style="
      margin: 0px 100px;
      min-height: 100vh;
      font-family: 'Noto Naskh Arabic', serif;
    ">
    <section>
        <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
      ">
            <div>
                <img style="width: 55%" src="data:image/png;base64,{{ $logo }}" />
            </div>
            <div>
                <h2>رقم الاتفاقية:Serial Num</h2>
            </div>
        </div>
        <centre style="text-align: center">
            <h1 style="font-weight: 600; font-size: 1.85em"> اتفاقية وكالة بالإستثمار </h1>
            <h2 style="
          font-weight: 500;
          font-size: 1.46em;
          font-weight: 500 !important;
          padding-top: 15px;
        "> :بين كل من </h2>
            <h2 style="
          font-weight: 500;
          font-size: 1.46em;
          font-weight: 500 !important;
          padding-top: 15px;
        "> شركة دنانير للتمويل </h2>
            <h2 style="
          font-weight: 500;
          font-size: 1.46em;
          font-weight: 500 !important;
          padding-top: 15px;
        "> و </h2>
            <h2 style="
          font-weight: 500;
          font-size: 1.46em;
          font-weight: 500 !important;
          padding-top: 15px;
        "> المستثمر: {{ $investor_name }}
        </h2>
            <h2 style="
          font-weight: 500;
          font-size: 1.46em;
          font-weight: 500 !important;
          padding-top: 15px;
          padding-top: 130px !important;
        ">
          {{$submission_date}} :التاريخ
        </h2>
        </centre>
        <centre style="text-align: center; font-size: 0.8em; color: blueviolet">
            <div style="margin-bottom: 20px; padding-top: 50px"> شركة دنانير للتمويل سجل تجاري رقم 1010621840 والرقم الموحد 7016651718 ، وهي شركة مرخصة من قبل البنك المركزي السعودي برأس مال خمسة ملايين ريال (5,000,000)، وعنونها الوطني الرياض، </div>
            <h4 style="margin-left: 30px">Riyadh, Saudi Arabia,</h4>
            <h4 style="margin-top: -10px">www.dnaneer.com</h4>
        </centre>
    </section>
    <section>
        <!-- second page -->
        <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
      ">
            <div>
                <img style="width: 55%" src="data:image/png;base64,{{ $logo }}" />
            </div>
            <div>
                <h2 style="white-space: nowrap">رقم الاتفاقية:xxxx</h2>
            </div>
        </div>
        <div style="text-align: right; padding: 0px 30px">
            <h2 style="font-weight: 500; font-size: 1.25em"> :الحمد الله، والصلاة والسلام على رسول الله، وبعد </h2>
            <h2 style="font-weight: 500" font-size: 1.25em;> :إنه في يوم ({{$submission_date}}) ،أبرمت هذه الاتفاقية بين كل من </h2>
            <h2 style="
          display: flex;
          justify-content: center;
          font-size: 1.25em;
          font-weight: 500;
        "> :أطراف الاتفاقية </h2>
            <h2 style="font-weight: 500; font-size: 1.25em"> أولاً: تم إنشاء شركة دنانير للتمويل وفقًا لقوانين المملكة العربية السعودية وهي مرخصة من قبل البنك المركزي السعودي. يقع مقر الشركة الرئيسي في المملكة العربية السعودية، مدينة الرياض، ص. ب .14258. ويتم الإشارة إليها في هذه الاتفاقية باسم "الطرف الأول" أو "الشركة" أو "الوكيل" </h2>
            <h2 style="
          display: flex;
          justify-content: center;
          font-size: 1.25em;
          font-weight: 500;
        "> ثانياً: ({{$investor_name}}) هويـة رقـم ({{$national_id}}) وتـاريخ ميلاد ({{$dob}})، وعنوانه الرئيسي: ({{$address}}) ، ويُشار إليه في هذه الاتفاقية باسم "الطرف الثاني" أو "المستثمر" أو "المستخدم" ويُشار إلى الطرف الأول والطرف الثاني مجتمعين فيما بعد بـــــــ(الطرفان/الطرفين) </h2>
            <h2 style="
          display: flex;
          justify-content: center;
          font-size: 1.25em;
          font-weight: 500;
        "> :التمهيد </h2>
            <h2 style="font-weight: 500; font-size: 1.25em"> لما كان الطرف الثاني قد تقدم برغبته في استثمار أمواله من خلال منصة التمويل الجماعي بالدين والتي يديرها الطرف الأول، حيث أن الطرف الأول شركة مرخصة من قبل البنك المركزي السعودي وتخضع لرقابته ومتوافقة مع الأنظمة المعمول بها في المملكة العربية السعودية. وهي متخصصة بتقديم منصة رقمية للخدمات المالية عن طريق التمويل الجماعي بالدين. </h2>
            <h2 style="font-weight: 500; font-size: 1.25em"> تم الاتفاق بين الطرفين اللذين يتمتعان بالأهلية الكاملة شرعًا ونظامًا على الانضمام إلى هذه الاتفاقية التي تحدد شروط وأحكام اتفاقية الوكالة بالاستثمار، وتفاصيل الاتفاق كما يلي: </h2>
            <h2 style="
          display: flex;
          justify-content: center;
          font-size: 1.25em;
          font-weight: 500;
        "> : المادة الأولى: المقدمة والتمهيد والملاحق </h2>
            <h2 style="font-weight: 500; font-size: 1.25em">
            .تمثل المقدمة والتمهيد أعلاه جزءًا لا يتجزأ من هذه الاتفاقية ومتممةً لها
          </h2>
        </div>
        <centre style="text-align: center; font-size: 0.8em; color: blueviolet">
            <div style="margin-bottom: 20px; padding-top: 40px"> شركة دنانير للتمويل سجل تجاري رقم 1010621840 والرقم الموحد 7016651718 ، وهي شركة مرخصة من قبل البنك المركزي السعودي برأس مال خمسة ملايين ريال (5,000,000)، وعنونها الوطني الرياض، </div>
            <h4 style="margin-left: 30px">Riyadh, Saudi Arabia,</h4>
            <h4 style="margin-top: -10px">www.dnaneer.com</h4>
        </centre>
    </section>
    <section>
        <!-- Third page -->
        <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
      ">
            <div>
                <img style="width: 55%" src="data:image/png;base64,{{ $logo }}" />
            </div>
            <div>
                <h2 style="white-space: nowrap">رقم الاتفاقية:xxxx</h2>
            </div>
        </div>
        <div style="text-align: right; padding: 0px 30px">
            <h2 style="
          display: flex;
          justify-content: center;
          font-size: 1.25em;
          font-weight: 500;
        "> المادة الثانية: التعريفات: </h2>
            <h2 style="font-weight: 500; font-size: 1.25em"> :يقصد بالعبارات التالية أينما وردت في هذه الاتفاقية </h2>
            <ul style="font-weight: bold; direction: rtl">
                <li style="
            font-size: 1.25em !important;
            padding: 10px;
            font-weight: 500;
            padding-top: 20px;
          "> "اتفاقية الوكالة بالاستثمار: تعد اتفاقية الوكالة بالاستثمار اتفاقية تعاقدية بين شخصين أو أكثر، يتم بموجبها تحديد مهمة الوكيل في القيام بإجراءات الاستثمار نيابةً عن المستثمر، وذلك بموجب تفويض صريح من المستثمر. وتشمل مهام الوكالة بالاستثمار
                    عادةً إجراءات شراء وبيع الأوراق المالية والأصول الأخرى المرتبطة بالاستثمار. </li>
                <li style="font-size: 1.25em; font-weight: 500; padding-top: 20px"> منصة التمويل الجماعي بالدين (منصة دنانير): المنصة الإلكترونية التي يقدم من خلالها نشاط التمويل لشركة دنانير للتمويل. </li>
                <li style="font-size: 1.25em; font-weight: 500; padding-top: 20px"> "مبلغ الاستثمار :"يشير إلى القيمة المالية التي يرغب الطرف الثاني في استثمارها في فرصة استثمارية متاحة على منصة الطرف الأول. يمكن أن يكون هذا المبلغ مختلفًا تبعًا لنوع الفرصة الاستثمارية وشروطها. </li>
                <li style="font-size: 1.25em; font-weight: 500; padding-top: 20px"> "مجموع مبلغ الاستثمار :"مجموع مبلغ الاستثمار يشير إلى إجمالي المبالغ التي تم جمعها من المستثمرين عبر منصة التمويل الجماعي والتي يتم استثمارها في فرصة استثمارية محددة. يتضمن هذا المبلغ جميع المساهمات التي تم جمعها من المستثمرين بما في ذلك
                    الأموال المستثمرة بالفعل والمبالغ التي تم تعهد بالاستثمار بها. </li>
                <li style="font-size: 1.25em; font-weight: 500; padding-top: 20px"> " َّمعدل العائد الاستثماري المتوقع: على أنه معدل العائد الذي يتوقع المستثمر الحصول عليه بمجرد انتهاء الفرصة الاستثمارية، والذي يتم الإعلان عنه من قبل الوكيل على منصة التمويل الجماعي. </li>
                <li style="font-size: 1.25em; font-weight: 500; padding-top: 20px"> "صافي العائد الاستثماري الفعلي" :صافي العائد الاستثماري الفعلي يشير إلى الربح الفعلي الذي تحقق من فرصة الاستثمار. ويتم حسابه عن طريق طرح كلفة الاستثمار من إجمالي العائدات المحققة. </li>
                <li style="font-size: 1.25em; font-weight: 500; padding-top: 20px"> "العائد المستحق :"هو المبلغ الذي يحق للموكل الحصول عليه وفقًا لحصته في مجموع مبلغ الاستثمار، بعد خصم رسوم الوكالة وأي مصاريف أخرى. </li>
            </ul>
        </div>
        <centre style="text-align: center; font-size: 0.8em; color: blueviolet">
            <div style="margin-bottom: 20px; padding-top: 40px;"> شركة دنانير للتمويل سجل تجاري رقم 1010621840 والرقم الموحد 7016651718 ، وهي شركة مرخصة من قبل البنك المركزي السعودي برأس مال خمسة ملايين ريال (5,000,000)، وعنونها الوطني الرياض، </div>
            <h4 style="margin-left: 30px">Riyadh, Saudi Arabia,</h4>
            <h4 style="margin-top: -10px">www.dnaneer.com</h4>
        </centre>
    </section>
    <section>
        <!-- Fourth page -->
        <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
      ">
            <div>
                <img style="width: 55%" src="data:image/png;base64,{{ $logo }}" />
            </div>
            <div>
                <h2 style="white-space: nowrap">رقم الاتفاقية:xxxx</h2>
            </div>
        </div>
        <div style="text-align: right; padding: 0px 30px">
            <ul style="font-weight: bold; direction: rtl">
                <li style="font-size: 1.25em; font-weight: 500; padding-top: 20px"> "تاريخ الاستحقاق" :تاريخ الاستحقاق يشير إلى تاريخ استحقاق العوائد المستحقة على فرصة الاستثمار في حسابات دنانير، ويتم ذلك وفقًا للإعلان الموجود في تفاصيل الفرصة الاستثمارية على منصة دنانير. </li>
                <li style="
            font-size: 1.25em !important;
            padding: 10px;
            font-weight: 500;
            padding-top: 20px;
          "> "تاريخ الايداع : هي (5) خمسة أيام عمل من التاريخ الذي يلي إيداع المبالغ في حسابات دنانير من العميل أو المقترض. يرجى ملاحظة أن هذه الفترة تعتمد على أيام العمل في الأسبوع ولا تشمل عطلات نهاية الأسبوع والعطلات الرسمية. </li>
                <li style="font-size: 1.25em; font-weight: 500; padding-top: 20px"> "السداد المبكر :"هي عملية سداد المبالغ المستحقة قبل موعدها المحدد </li>
                <li style="font-size: 1.25em; font-weight: 500; padding-top: 20px"> "التاريخ الفعلي للسداد :"هو التاريخ الذي يتم فيه سداد المبلغ المستحق المعلن عنه في الفرصة الاستثمارية. </li>
                <li style="font-size: 1.25em; font-weight: 500; padding-top: 20px"> المستثمرون / المستثمرين :هم الأطراف الراغبين بالاستثمار في منصة دنانير للتمويل. </li>
                <li style="font-size: 1.25em; font-weight: 500; padding-top: 20px"> "رسـوم الوكالـة :"أجـرة محـدودة للوكيـل بنسـبة مئويـة مـن صـافي الربـح الفعلـي للفرصة الاستثمارية، وذلك مقابل قيام الوكيل بإدارة الفرصة الاستثمارية. </li>
                <li style="font-size: 1.25em; font-weight: 500; padding-top: 20px"> "الفرصـة" : هي فرصة استثمارية تعلن عنها منصة دنانير تكون من خلال عملية التورق المتوافقة مع الأحكام الإسلامية. ، </li>
                <li style="font-size: 1.25em; font-weight: 500; padding-top: 20px"> "تفاصيل الفرصة الاستثمارية :"هي مجموعة من المعلومات والتفاصيل المهمة حول كل فرصة استثمارية مُعَلن عنها عبر منصة دنانير. </li>
                <li style="font-size: 1.25em; font-weight: 500; padding-top: 20px"> " الحساب التجميعي للمستثمر" هو حساب مالي إلكتروني يُقَدِّم عبر منصات التمويل الجماعية، والذي يتضمن شروطًا تفصيلية للاستخدام. يقر المستثمرون بأن حسابهم الافتراضي لا يشكل حسابًا مصرفيًّا، كما أنه لا يُقَدِّم خدْمات مصرفية سوى المذكورة في
                    اتفافية فتح الحساب على منصة دنانير. </li>
                <h2 style="font-size: 1.25em; font-weight: 500; padding-top: 140px; display: flex; justify-content: center;"> المادة الثالثة: نطاق الاتفاقية: </h2>
                <h2 style="font-size: 1.25em; font-weight: 500; padding-top: 20px; display: flex; justify-content: center;"> وفقًا لهذه الاتفاقية، يُخوِّل "الطرف الثاني" أو "المستثمر" - بصفته وكيلٍ - "الطرف الأول" أو "الشركة" باستثمار مبلغٍ محدَّد في فرصة استثمارية مُحَدَّدة، نيابةً عن المستثمر ولصالحه ولا يتعارض ذلك مع أحكام وشروط الشريعة الاسلامية. يُمنَح
                    الطرف الأول بصفته وكيلاً لجميع حقوق وسلطات المستثمر ذات العلاقة، بالإضافة إلى قدْرتِه على تحصيل مبلغ الاستثمار من "المقترض" أو "العميل"، ورفع الدعاوى نيابةً عنه. كما يأذَن الطرف الثاني للطرف الأول بهذه التخويلات لضمان استيفاء التزامات
                    المستثمر في هذه الاتفاقية.." </h2>
            </ul>
        </div>
        <centre style="text-align: center; font-size: 0.8em; color: blueviolet">
            <div style="margin-bottom: 20px; padding-top: 40px"> شركة دنانير للتمويل سجل تجاري رقم 1010621840 والرقم الموحد 7016651718 ، وهي شركة مرخصة من قبل البنك المركزي السعودي برأس مال خمسة ملايين ريال (5,000,000)، وعنونها الوطني الرياض، </div>
            <h4 style="margin-left: 30px">Riyadh, Saudi Arabia,</h4>
            <h4 style="margin-top: -10px">www.dnaneer.com</h4>
        </centre>
    </section>
    <section>
        <!-- Fifth Page -->
        <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
      ">
            <div>
                <img style="width: 55%" src="data:image/png;base64,{{ $logo }}" />
            </div>
            <div>
                <h2 style="white-space: nowrap">xxxx:رقم الاتفاقية</h2>
            </div>
        </div>
        <div style="text-align: right; padding: 0px 30px">
            <h2 style="
          display: flex;
          justify-content: center;
          font-size: 1.25em;
          font-weight: 500;
        "> :المادة الرابعة: إدارة النشاط الاستثماري </h2>
            <ul style="font-weight: bold; direction: rtl">
                <li style="
            font-size: 1.25em !important;
            padding: 10px;
            font-weight: 500;
            padding-top: 20px;
">
اتفق الطرفان على تحديد نشاط الاستثمار في عمليات التمويل من خلال المنصة الإلكترونية للشركة، وذلك في أي فرصة استثمارية معيَّنة يحددها العميل. يتضمَّن هذا التحديد قيام الوكيل بشراء سلعٍ وبيعها بالآجِــــــْل، مُرابِحَة لِصالِح المشتري.
</li>
<li style="font-size: 1.25em; font-weight: 500; padding-top: 15px">
يتعهد الطرف الأول الى الطرف الثاني وفقًا لهذه الاتفاقية، بإدارة مبلغ الاستثمار بالكفاءة والعناية المطلوبَتيْن. كما يتعهد بالإشراف على إجراءات سياسات الائتمان المُعْتَمَدَة في الشِّرْكة.
</li>
    <li style="font-size: 1.25em; font-weight: 500; padding-top: 15px">يحتفظ "الطرف الاول" أو "الوكيل" بالحرية المطلقة في اتخاذ الإجراءات اللازمة للاستثمار، دون الرجوع إلى "الطرف الثاني" أو "المكلِّف"، ويشمل ذلك توقيع العقود والتفاوض مع أطراف ثالثة، ودفع قيمة عمليات الاستثمار وأية مصاريفٍ تُطْبَق على هذه العمليات. كذلك يُخصِّص صلاحية التحصيل والدفع لصالح المستثمر من خلال استثمار أمواله. يُسَنِّد جزء أو كافة صلاحياته إلى شخص آخر حسب تقديره في حال دعت الضروف لذلك.</li>

    <li style="font-size: 1.25em; font-weight: 500; padding-top: 15px">
    توصَّل الطرفان إلى اتفاقٍ ينص على أنَّ "الطرف الثاني" أو "المستثمر"  ليس لديه حق مراجعة "الوكيل" أو "الشركة"  والاجبار على أداء بعض الأعمال، كما لا يحق له طلب الموافقة من الوكيل قبل اتخاذ بعض الاجراءات. كما يُحظَر على "الطرف الثاني" أو "المستثمر"  رفع دعوى قضائية، أو تنظيم إجراءات أخرى دون الرجوع الى "الوكيل" أو "الشركة".
  </li>
  <li>اتفق الطرفان بأن "للوكيل" أو "للشركة" كامل الحق بالتواصل مع طالب التمويل أو المقترض و المستثمرين في الفرص الاستثمارية، ولا يحق "الطرف الثاني" أو "المستثمر" بمطالبة المقترضين او المشاركين (المستثمرين) بأي اجراءات. </li>
            </ul>
        </div>
        <centre style="text-align: center; font-size: 0.8em; color: blueviolet">
            <div style="margin-bottom: 20px; padding-top: 40px"> شركة دنانير للتمويل سجل تجاري رقم 1010621840 والرقم الموحد 7016651718 ، وهي شركة مرخصة من قبل البنك المركزي السعودي برأس مال خمسة ملايين ريال (5,000,000)، وعنونها الوطني الرياض، </div>
            <h4 style="margin-left: 30px">Riyadh, Saudi Arabia,</h4>
            <h4 style="margin-top: -10px">www.dnaneer.com</h4>
        </centre>
    </section>
    <section>
        <!-- Sixth Page -->
        <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
      ">
            <div>
                <img style="width: 55%" src="data:image/png;base64,{{ $logo }}" />
            </div>
            <div>
                <h2 style="white-space: nowrap">xxxx:رقم الاتفاقية</h2>
            </div>
        </div>
        <div style="text-align: right; padding: 0px 30px">
            <h2 style="
          display: flex;
          justify-content: center;
          font-size: 1.25em;
          font-weight: 500;
        "> المادة الخامسة: مبلغ الاستثمار: </h2>
            <ul style="font-weight: bold; direction: rtl">
                <li style="
            font-size: 1.25em !important;
            font-weight: 500;
            padding-top: 10px;
">
عند توقيع هذه الاتفاقية فأن الطرف الثاني وافق على ان للوكيل أو للشركة دمج مبلغ الاستثمار مع أي من الأصول والأموال الأخرى التي يتسلَّمها الوكيل من المستثمرين، وذلــِــك في فترات زمنية مُحددة. 
</li>
          <li style="
            font-size: 1.25em !important;
            font-weight: 500;
            padding-top: 50px;">
            يتعيَّن على الطرف الثاني إيداع رأس ماله في الحساب الاستثماري الخاص به في منصة دنانير، والذي يُطلق عليه "حساب التجميعي للمستثمر". ويربط هذا الحساب بصفحة الطرف الثاني  على المنصة الإلكترونية لدى الشركة وحتى يتمكن من الاستثمار بالمبلغ الذي يراه مناسباً لكل فرصة استثمارية.      
          </li>
            </ul>
            <h2 style="
          display: flex;
          justify-content: center;
          font-size: 1.25em;
          font-weight: 500;
        "> :المادة السادسة: مدة الاستثمار </h2>
            <ul style="font-weight: bold; direction: rtl">
                <li style="
            font-size: 1.25em !important;
            font-weight: 500;
            padding-top: 10px;
          "> تسري هذه الاتفاقية من تاريخ توقيعها، وتنتهي بصورةٍ تلقائية في حال ألغى "الطرف الثاني" أو "المستثمر" حسابه على منصة الشركة الإلكتروني، أو إذا قامت الشركة باستحداث تعديلات على شروط وأحكام هذه الاتفاقية. </li>
                <li style="
            font-size: 1.25em !important;
            font-weight: 500;
            padding-top: 20px;
          "> ينبغي أن لا يؤثر انتهاء هذه الاتفاقية على حقوق والتزامات أيٍ من الطرفيْـــن المتعلِّقة بأية فرصة استثمارية قائمة وسارية المفعول قبل انتهاء هذه الاتفاقية. إضافة إلى ذلك، تظل شروط وأحكام هذه الاتفاقية سارِيَة المفعول حتى مُعالَجَة تسوية
                    الفرصة الاستثماريَّة التي لا زالت سارِــيْة المفعول. </li>
                    <li style="
            font-size: 1.25em !important;
            font-weight: 500;
            padding-top: 20px;
          ">
                    مدة كل فرصة استثمارية تختلف من فرصة الى أخرى يتم تحديدها في منصة المستثمرين ويمكن للمستثمر الاطلاع على مدة كل فرصة قبل الخضوع في الاستثمار عبر المنصة. 
                    </li>
            </ul>
        </div>
        <centre style="text-align: center; font-size: 0.8em; color: blueviolet">
            <div style="margin-bottom: 20px; padding-top: 40px"> شركة دنانير للتمويل سجل تجاري رقم 1010621840 والرقم الموحد 7016651718 ، وهي شركة مرخصة من قبل البنك المركزي السعودي برأس مال خمسة ملايين ريال (5,000,000)، وعنونها الوطني الرياض، </div>
            <h4 style="margin-left: 30px">Riyadh, Saudi Arabia,</h4>
            <h4 style="margin-top: -10px">www.dnaneer.com</h4>
        </centre>
    </section>
    <section>
        <!-- Seventh Page -->
        <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
      ">
            <div>
                <img style="width: 55%" src="data:image/png;base64,{{ $logo }}" />
            </div>
            <div>
                <h2 style="white-space: nowrap">xxxx:رقم الاتفاقية </h2>
            </div>
        </div>
        <div style="text-align: right; padding: 0px 30px">
            <h2 style="
          display: flex;
          justify-content: center;
          font-size: 1.25em;
          font-weight: 500;
          margin-top: 2.5rem;
        ">:المادة السابعة: نطاق المسؤولية </h2>
            <h2 style="
          margin-top: -15px;
          display: flex;
          justify-content: center;
          font-size: 1.25em;
          font-weight: 500;
        "> تُعنى هذه البنود بالمسؤولية القانونية والمالية لشركة دنانير للتمويل فيما يتعلق بـ منصتها الالكترونية وعمليات التمويل المتعلقة به. وتشير البنود إلى ما يلي: </h2>
            <ul style="font-weight: bold; direction: rtl">
                <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">
          لا تتحمل دنانير مسؤولية أي خسارة تنجم عن استخدام الموقع أو المحتوى الموجود فيه، بما في ذلك الخسائر المباشرة أو غير المباشرة أو الخاصة أو المترابطة. كما أنها ليست مسؤولة عن أي خسارة تتعلق بالأعمال التجارية أو الدخل أو الأرباح أو التوفير أو فوات العقود أو العلاقات التجارية أو السمعة أو الشهرة أو البيانات.
        </li>
        <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">تتحمل دنانير مسؤولية إرجاع المبالغ التي تم جمعها من المشاركين في حالة عدم اكتمال المبلغ التمويلي المطلوب خلال مدة الطرح. وليس لها أي مسؤولية تجاه المشاركين في هذه الحالة.</li>
        <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">تتحمل دنانير مسؤولية إشعار العملاء في حالة وجود أي خلل في عملية التمويل ومعالجة الخطأ.</li>
        <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">يقر "الموكِّل" أو "المستخدم" بأن "الوكيل" أو "الشركة" يضمن حفظ مبلغ الاستثمار وإدارته، إلا في حالة ارتكاب أي خطأ أو تجاوزات أو مخالفات لشروط هذه الاتفاقية. وعلى هذا الأساس، فإن حدود المسؤولية للوكيل على جميع الخسائر، التكاليف، والضرر المادي - بما في ذلك التكاليف القانونية - ستحصَــــــر دائِمَـــًا (بغضِ النظَر عَنْ سُبُب) في مجمل مبلغ الاستثمار. كافة التعويضات ستُحصى من خلال قضاء الحكم السعودي. </li>
        <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">يقر "الموكل" أو "المستخدم" بأنه يدرك مخاطر الاستثمار وعمليات التمويل عبر منصات التمويل الجماعي، وبأن هناك احتمالية لفقدان المبالغ المستثمرة كاملًا أو جزئيًا.</li>
        <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">     إذا حدثت خسارة - لا قدر الله - في الفرصة الاستثمارية، سيتم توزيع هذه الخسائر على جميع المستثمرين في هذه الفرصة بحسب حصتهم من إجمالي مبلغ الاستثمار. ولا يحق للوكيل المطالبة بأية تعويضات عن جهده وعمله في ظل هذه الظروف من "الموكل" أو "المستخدم".</li>
        <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">إذا تخلفت المنشأة المستفيدة عن سداد قرضها، فسيتم اتخاذ الخطوات التالية:</li>
        <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">سيتم إرسال خطاب إلى المنشأة المستفيدة يطلب منها السداد.</li>
        <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">إذا لم تقم المنشأة المستفيدة بالسداد، فسيتم إرسال خطاب ثان يطلب منها السداد وإلا سيتم اتخاذ إجراءات قانونية.</li>
        <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">إذا لم تقم المنشأة المستفيدة بالسداد، فسيتم رفع دعوى قضائية ضدها.</li>
        <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">إذا حكمت المحكمة لصالح المقرض، فسيتم إصدار أمر بدفع المنشأة المستفيدة للقرض.</li>
        <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">إذا لم تقم المنشأة المستفيدة بدفع القرض، فسيتم تنفيذ الأمر بواسطة دائرة التنفيذ.</li>
                
            </ul>
        </div>
        <centre style="text-align: center; font-size: 0.8em; color: blueviolet">
            <div style="margin-bottom: 20px; padding-top: 40px"> شركة دنانير للتمويل سجل تجاري رقم 1010621840 والرقم الموحد 7016651718 ، وهي شركة مرخصة من قبل البنك المركزي السعودي برأس مال خمسة ملايين ريال (5,000,000)، وعنونها الوطني الرياض، </div>
            <h4 style="margin-left: 30px">Riyadh, Saudi Arabia,</h4>
            <h4 style="margin-top: -10px">www.dnaneer.com</h4>
        </centre>
    </section>
    <section>
        <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
      ">
            <div>
                <img style="width: 55%" src="data:image/png;base64,{{ $logo }}" />
            </div>
            <div>
                <h2 style="white-space: nowrap">xxxx:رقم الاتفاقية </h2>
            </div>
        </div>
        <div style="text-align: right; padding: 0px 30px">
            <h2 style="
            display: flex;
            justify-content: center;
            font-size: 1.25em;
            font-weight: 500;
            padding-top: 30px;
            "> المادة الثامنة: عوائد الاستثمار: </h2>
            <ul style="font-weight: bold; direction: rtl">
            <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">في حال تحققت الأرباح الفعلية، يتعهد "الوكيل" أو "الشركة" بتَحويل مبلغ الاستثمار المستثمر به ونصيب المكلِّف من الأرباح إلى حساب المكلِّف، وذلــِــك في التاريخ المذكور في تفاصيل الفرصة الإستثمارية على أن يتم خصْم أية مصروفات ذات صلة بالفرصة الاستثمارية كالرسوم التحصيل والإجور للاستشاريين والمحامين.</li>
            <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">في حال السداد المبكر للفرصة الاستثمارية فيتم إعادة احتساب العائد المستحق للمستثمر بناء على التاريخ الفعلي للسداد.</li>
            <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">تودع المبالغ في حسابات المستثمرين خلال (5) خمسة أيام من تاريخ السداد أو الاستحقاق.</li>
            </ul>
            <h2 style="
            display: flex;
            justify-content: center;
            font-size: 1.25em;
            font-weight: 500;
            padding-top: 30px;
            "> المادة التاسعة: الرسوم أجرة الوكيل </h2>
            <h2 style="font-size: 1.25em; font-weight: 500"> اتفق الطرفان على أنَّ "الوكيل" أو "الطرف الأول" يحق له استلام رسوم مُعيَّنة مقابل خدمات وكالته لصالح الطرف الثاني، وذلــِــك بنسبة مئوية من صافي العائد الاستثماري الفعلي، حسبما تُحدد ذلك في نشْرة فرصة الاستثمار المخصصة لهذا المشروع. اتفق الطرفان على أن "الطرف الاول" أو "الوكيل" يستحق رسومًا مقابل عمله وكيلًا عن الطرف الثاني تقدر بنسبة مئوية من صافي الربح الفعلي، يُحددها الطرف الأول في النشرة الخاصة بكل فرصة استثمارية. </h2>
            <h2 style="
            display: flex;
            justify-content: center;
            font-size: 1.25em;
            font-weight: 500;
            padding-top: 30px;
            ">المادة العاشرة: تسوية المنازعات:</h2>
            <h2 style="font-size: 1.25em; font-weight: 500">يُخضع هذا الاتفاق للأنظمة المعتمدة في المملكة العربية السعودية، ويتم تفسيره وتنفيذه بالشكل المطابق لهذه الأنظمة. في حال نشوء أي خلاف يتصل بتطبيق هذا الاتفاق، فإن كلاً من الطرفين يجوز له التوصُّل إلى تسوية بهدف حلِّ هذا الخلاف. وإذا عجزَ كلاً منهما عن ذلك، يحال هذا الخلاف إلى ديوان المظالم لإصدار قرار نهائي بشأنه. </h2>
            <h2 style="
            display: flex;
            justify-content: center;
            font-size: 1.25em;
            font-weight: 500;
            padding-top: 30px;
">المادة الحادية عشر: الإخطارات والمراسلات:</h2>
<h2 style="font-size: 1.25em; font-weight: 500">تُعد العناوين المذكورة في هذه الاتفاقية عنوان كل طرف من الأطراف بشكل قانوني، وجميع المراسلات بخصوص طلبات أو إشعارات أو إقرارات أو موافقات أو أية مستنداتٍ أُخْرَى يتمّ إرسالها من خِلال تِلْكَ العناوين أو عن طريق البريد الإلكتروني المسجل لدى الطرف الأول.</h2>
<h2 style="
            display: flex;
            justify-content: center;
            font-size: 1.25em;
            font-weight: 500;
            padding-top: 30px;">المادة الثانية عشر: سرية المعلومات     :</h2>
<ol style="font-weight: bold; direction: rtl">
            <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">يتعين على الطرف الثاني وموظفيه الملتزمين بهذا العقد أن يحافظوا على سرية جميع الأعمال التابعة لهذا الاتفاق والتي تمَّ استلامها أو إجراؤُها بسبب هذا الاتفاق.</li>
            <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">يتوجب على الطرف الثاني توقيع اتفاقية سرية المعلومات، وذلك باستخدام نموذج مُعتَمَد من قِبَل الطرف الأول.     </li>
            <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">يُمنع على الطرف الثاني، بدون الحصول على موافقة خطية مسبقة من الطرف الأول، أن يُعلِن أو يكشف في وسائل الإعلام أو على شبكة الإنترنت حول هذا الاتفاق أو حول الخدمات التي تم تزويدها للشركة.</li>
            </ol>

            <h2 style="
            display: flex;
            justify-content: center;
            font-size: 1.25em;
            font-weight: 500;
            padding-top: 30px;">المادة الثالثة عشر: خطة استمرارية الأعمال والتعافي من الكوارث (BCP)</h2>
            <ol style="font-weight: bold; direction: rtl">
            <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">	الشركة لديها خطة استمرارية الأعمال والتعافي من الكوارث (BCP) هي خطة تهدف إلى حماية الأعمال وضمان استمرارها في حالة وقوع حادث أو كارثة.</li>
            <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">	تتضمن الخطة: </li>
            <ol style="font-weight: bold; direction: rtl">
              <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">كيفية الحفاظ على تدفق السيولة في حالة حدوث كارثة.</li>
              <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">كيفية استعادة البيانات في حالة فقدانها أو تلفها.</li>
              <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">كيفية التواصل مع المستثمرين في حالة وقوع كارثة.</li>
              <li style=" font-size: 1.25em !important; font-weight: 500; padding-top: 10px; ">كيفية إعادة تشغيل النظام الأساسي في حالة تعطله.</li>
            </ol>
            </ol>
        </div>
        <centre style="text-align: center; font-size: 0.8em; color: blueviolet">
            <div style="margin-bottom: 20px; padding-top: 40px"> شركة دنانير للتمويل سجل تجاري رقم 1010621840 والرقم الموحد 7016651718 ، وهي شركة مرخصة من قبل البنك المركزي السعودي برأس مال خمسة ملايين ريال (5,000,000)، وعنونها الوطني الرياض، </div>
            <h4 style="margin-left: 30px">Riyadh, Saudi Arabia,</h4>
            <h4 style="margin-top: -10px">www.dnaneer.com</h4>
        </centre>
    </section>
    <section>
        <!-- Last page -->
        <div style="
         display: flex;
         justify-content: space-between;
         align-items: center;
         margin-bottom: 30px;
         ">
            <div>
                <img style="width: 55%" src="data:image/png;base64,{{ $logo }}" />
            </div>
            <div>
                <h2 style="
               font-weight: 500;
               font-size: 1.46em;
               font-weight: 600 !important;
               white-space: nowrap;
               "> رقم الاتفاقية:xxxx </h2>
            </div>
        </div>
        <div style="text-align: right">
            <h2 style="font-weight: 500; font-size: 1.46em; font-weight: 500 !important"> :حررت هذه الاتفاقية من نسخ الكيونية </h2>
            <h2 style="font-weight: 500; font-size: 1.46em; font-weight: 500 !important"> :نسخة لل رشكة (الطرف الأول)، نسخة للموكل (الطرف الثا نن) </h2>
        </div>
        <div style="display: flex; justify-content: space-around; flex-wrap: wrap">
            <h2 style="
            width: 50%;
            text-align: center;
            font-weight: 500;
            font-size: 1.46em;
            font-weight: 500 !important;
            "> الطرف الثا نن </h2>
            <h2 style="
            width: 50%;
            text-align: center;
            font-weight: 500;
            font-size: 1.46em;
            font-weight: 500 !important;
            "> الطرف الأول </h2>
            <h2 style="
            width: 50%;
            text-align: center;
            font-weight: 500;
            font-size: 1.46em;
            font-weight: 500 !important;
            "> شركة دناني للتمويل </h2>
            <h2 style="
            width: 50%;
            text-align: center;
            font-weight: 500;
            font-size: 1.46em;
            font-weight: 500 !important;
            "> الموكل/المستثمر </h2>
            <h2 style="
            width: 50%;
            text-align: center;
            font-weight: 500;
            font-size: 1.46em;
            font-weight: 500 !important;
            "> ويمثلها الاستاذ / بدر بن محمد الجه نت ي </h2>
            <h2 style="
            width: 50%;
            text-align: center;
            font-weight: 500;
            font-size: 1.46em;
            font-weight: 500 !important;
            "> ______ / ______ </h2>
            <h2 style="
            width: 50%;
            text-align: center;
            font-weight: 500;
            font-size: 1.46em;
            font-weight: 500 !important;
            "> الرئيس التنفيذي للعمليات </h2>
            <h2 style="
            width: 50%;
            text-align: center;
            font-weight: 500;
            font-size: 1.46em;
            font-weight: 500 !important;
            "> المفوض بالتوقيع </h2>
        </div>
        <div style="display: flex; justify-content: space-between; flex-wrap: wrap">
            <h2 style="
            width: 50%;
            text-align: right;
            font-weight: 500;
            font-size: 1.46em;
            font-weight: 500 !important;
            "> التوقيع : {{ $investor_name }}
        </h2>
            <h2 style="
            width: 50%;
            text-align: right;
            font-weight: 500;
            font-size: 1.46em;
            font-weight: 500 !important;
            "> التوقيع : {{ $investor_name }}
        </h2>
            <h2 style="
            padding-top: 40px;
            width: 50%;
            text-align: right;
            font-weight: 500;
            font-size: 1.46em;
            font-weight: 500 !important;
            "> التاريخ: {{$submission_date}}
        </h2>
            <h2 style="
            padding-top: 40px;
            width: 50%;
            text-align: right;
            font-weight: 500;
            font-size: 1.46em;
            font-weight: 500 !important;
            "> التاريخ: {{$submission_date}}
        </h2>
        </div>
        <centre style="text-align: center; font-size: 0.8em; color: blueviolet">
            <div style="margin-bottom: 20px; padding-top: 40px;"> شركة دنانير للتمويل سجل تجاري رقم 1010621840 والرقم الموحد 7016651718 ، وهي شركة مرخصة من قبل البنك المركزي السعودي برأس مال خمسة ملايين ريال (5,000,000)، وعنونها الوطني الرياض، </div>
            <h4 style="margin-left: 30px">Riyadh, Saudi Arabia,</h4>
            <h4 style="margin-top: -10px">www.dnaneer.com</h4>
        </centre>
    </section>
</body>

</html>