export interface GovernorateExamQuestion {
  id: string;
  governorate: 'القاهرة' | 'الجيزة' | 'الإسكندرية' | 'الدقهلية' | 'الشرقية' | 'القليوبية';
  year: string;
  subject: string;
  subjectId: 'arabic' | 'science' | 'math' | 'social' | 'english';
  term: 'الترم الأول' | 'الترم الثاني';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  rimwaEncouragement: string;
}

export const GOVERNORATE_EXAMS: GovernorateExamQuestion[] = [
  // اللغة العربية
  {
    id: 'exam-ar-1',
    governorate: 'القاهرة',
    year: '2024',
    subject: 'اللغة العربية',
    subjectId: 'arabic',
    term: 'الترم الأول',
    question: 'في جملة: "يا أبناءَ مصر، حافظوا على وطنكم"، نوع المنادى وإعرابه:',
    options: [
      'منادى مضاف منصوب وعلامة نصبه الفتحة',
      'منادى شبيه بالمضاف منصوب',
      'منادى نكرة مقصودة مبني على الضم',
      'منادى علم مفرد مبني على الضم'
    ],
    correctIndex: 0,
    explanation: 'كلمة (أبناء) مضافة إلى (مصر)، والمنادى المضاف معرب منصوب دائماً، لذلك إعرابه منادى مضاف منصوب بالفتحة.',
    rimwaEncouragement: 'يا قمر البنات يا ريموا، سؤال امتحان محافظة القاهرة حلتيه بامتياز!'
  },
  {
    id: 'exam-ar-2',
    governorate: 'الجيزة',
    year: '2024',
    subject: 'اللغة العربية',
    subjectId: 'arabic',
    term: 'الترم الأول',
    question: 'في نص (عباد الرحمن)، التعبير القرآني "يمشون على الأرض هوناً" يدل على:',
    options: ['الضعف والاستسلام', 'التواضع والسكينة والوقار', 'الخوف والتردد', 'السرعة في المشي'],
    correctIndex: 1,
    explanation: 'تعبير جميل يدل على تواضع عباد الرحمن الدائم ولين جانبهم وسكينتهم.',
    rimwaEncouragement: 'برافو يا حبيبة أحمد! مواطن الجمال في سورة الفرقان سهلة جداً عليكي.'
  },
  {
    id: 'exam-ar-3',
    governorate: 'الدقهلية',
    year: '2023',
    subject: 'اللغة العربية',
    subjectId: 'arabic',
    term: 'الترم الأول',
    question: 'من قصة (طموح جارية): نجحت شجر الدر في فك حصار قلعة سنجار بفضل خطتها المحكمة والاستعانة بـ:',
    options: ['سيف الدين', 'الخوارزمية وقاضي سنجار بدر الدين الزرزاري', 'الصالح إسماعيل', 'داود أمير الكرك'],
    correctIndex: 1,
    explanation: 'استعانت بقاضي سنجار بدر الدين الزرزاري لنقل رسالتها الذكية والمؤثرة إلى قومها الخوارزمية لنجدتهم وفك الحصار عن سنجار وآميد.',
    rimwaEncouragement: 'شطورة يا ريموا! أحداث طموح جارية بقت في جيبك!'
  },

  // العلوم
  {
    id: 'exam-sci-1',
    governorate: 'الإسكندرية',
    year: '2024',
    subject: 'العلوم',
    subjectId: 'science',
    term: 'الترم الأول',
    question: 'سيارة تتحرك بسرعة 80 كم/س، وسيارة أخرى تتحرك بجوارها في نفس الاتجاه بسرعة 60 كم/س، فإن السرعة النسبية للسيارة الأولى بالنسبة لمراقب في السيارة الثانية تساوي:',
    options: ['140 كم/س', '20 كم/س', '80 كم/س', '60 كم/س'],
    correctIndex: 1,
    explanation: 'عندما يتحرك الجسمان في نفس الاتجاه، فإن السرعة النسبية = الفرق بين السرعتين (السرعة الفعلية - سرعة المراقب) = 80 - 60 = 20 كم/س.',
    rimwaEncouragement: 'ممتازة يا ريموا! في نفس الاتجاه نطرح، وفي عكس الاتجاه نجمع!'
  },
  {
    id: 'exam-sci-2',
    governorate: 'القاهرة',
    year: '2024',
    subject: 'العلوم',
    subjectId: 'science',
    term: 'الترم الأول',
    question: 'أصل المجموعة الشمسية وفقاً لنظرية "السديم" للعالم الفلكي لابلاس هو:',
    options: ['الشمس نفسها', 'كرة غازية متوهجة كانت تدور حول نفسها', 'نجم عملاق آخر بجوار الشمس', 'انفجار هائل لنجم قريب'],
    correctIndex: 1,
    explanation: 'افترض العالم الفرنسي لابلاس عام 1796 أن أصل المجموعة الشمسية هو السديم، وهو كرة غازية متوهجة كانت تدور حول نفسها وفقدت حرارتها تدريجياً.',
    rimwaEncouragement: 'فنانة في مادة العلوم يا ريموا القمر!'
  },
  {
    id: 'exam-sci-3',
    governorate: 'الشرقية',
    year: '2024',
    subject: 'العلوم',
    subjectId: 'science',
    term: 'الترم الأول',
    question: 'إذا وضع جسم على بعد 15 سم أمام مرآة مقعرة بعدها البؤري 10 سم، فإن الصورة المتكونة تكون:',
    options: ['حقيقية مقلوبة مصغرة', 'حقيقية مقلوبة مكبرة', 'تقديرية معتدلة مكبرة', 'لا تتكون صورة'],
    correctIndex: 1,
    explanation: 'البعد البؤري ع = 10 سم، إذن مركز التكور نق = 20 سم. الجسم هنا على بعد 15 سم (بين البؤرة ومركز التكور)، لذلك صورته تتكون بعد مركز التكور وتكون حقيقية مقلوبة مكبرة.',
    rimwaEncouragement: 'أحلى ريموا في الدنيا! حفظتي مسارات أشعة المرايا والعدسات زي أبطال أوائل الجمهورية!'
  },

  // الرياضيات
  {
    id: 'exam-math-1',
    governorate: 'الجيزة',
    year: '2024',
    subject: 'الرياضيات',
    subjectId: 'math',
    term: 'الترم الأول',
    question: 'إذا كان المستقيمان اللذان ميلاهما (-2 / 3) و (ك / 2) متعامدين، فإن قيمة ك تساوي:',
    options: ['3', '-3', '4/3', '-4/3'],
    correctIndex: 0,
    explanation: 'شرط تعامد مستقيمين هو: م1 × م2 = -1. إذن (-2 / 3) × (ك / 2) = -1 => (-2 ك) / 6 = -1 => -2 ك = -6 => ك = 3.',
    rimwaEncouragement: 'ملكة الرياضيات بلا منازع يا ريموا! شرط التعامد إشارة مقلوب الميل!'
  },
  {
    id: 'exam-math-2',
    governorate: 'القاهرة',
    year: '2024',
    subject: 'الرياضيات',
    subjectId: 'math',
    term: 'الترم الأول',
    question: 'إذا كانت النقطة (أ ، 3) تقع على الخط المستقيم الممثل للدالة د(س) = 4 س - 5، فإن قيمة أ تساوي:',
    options: ['1', '2', '3', '-2'],
    correctIndex: 1,
    explanation: 'نعوض عن س بـ أ، وعن ص بـ 3 في الدالة: 3 = 4 أ - 5 => 4 أ = 3 + 5 = 8 => أ = 8 ÷ 4 = 2.',
    rimwaEncouragement: 'شطورة يا حبيبة! التعويض المباشر سر حل أي نقطة تقع على مستقيم.'
  },
  {
    id: 'exam-math-3',
    governorate: 'القليوبية',
    year: '2023',
    subject: 'الرياضيات',
    subjectId: 'math',
    term: 'الترم الثاني',
    question: 'في الدائرة، قياس الزاوية المركزية يساوي بالنسبة لقياس الزاوية المحيطية المشتركة معها في نفس القوس:',
    options: ['نصف قياسها', 'ضعف قياسها', 'مساوياً لقياسها', 'ربع قياسها'],
    correctIndex: 1,
    explanation: 'الزاوية المركزية تساوي ضعف قياس الزاوية المحيطية المشتركة معها في القوس (المحيطية نصف المركزية).',
    rimwaEncouragement: 'برافو يا هندستنا المستقبلية يا ريموا!'
  },

  // الدراسات الاجتماعية
  {
    id: 'exam-soc-1',
    governorate: 'القاهرة',
    year: '2024',
    subject: 'الدراسات الاجتماعية',
    subjectId: 'social',
    term: 'الترم الأول',
    question: 'تنمو أشجار (المهوجني والمطاط) في الإقليم المناخي:',
    options: ['الموسمي', 'الاستوائي وشبه الاستوائي', 'البحر المتوسط', 'التندرا'],
    correctIndex: 1,
    explanation: 'تتميز الغابات الاستوائية بكثافتها وتشابك أشجارها، ومن أشهر أشجارها المطاط والمهوجني وتعيش بها الزواحف والطيور والحيوانات المتسلقة.',
    rimwaEncouragement: 'خرائط وأقاليم الجغرافيا سهلة وسلسة مع ريموا القمر!'
  },
  {
    id: 'exam-soc-2',
    governorate: 'الدقهلية',
    year: '2024',
    subject: 'الدراسات الاجتماعية',
    subjectId: 'social',
    term: 'الترم الأول',
    question: 'وجهت إنجلترا حملة عسكرية إلى مصر عام 1807 لاحتلال مصر وتثبيت محمد بك الألفي، وعرفت باسم:',
    options: ['حملة نابليون', 'حملة فريزر', 'حملة كليبر', 'حملة مينو'],
    correctIndex: 1,
    explanation: 'حملة فريزر الإنجليزية 1807 هزمها أهالي رشيد والحماد البواسل واضطر فريزر للجلاء مقابل الإفراج عن الأسرى الإنجليز.',
    rimwaEncouragement: 'تاريخ مصر وأبطاله محفور في ذاكرتك يا حبيبة!'
  },

  // اللغة الإنجليزية
  {
    id: 'exam-eng-1',
    governorate: 'الإسكندرية',
    year: '2024',
    subject: 'اللغة الإنجليزية',
    subjectId: 'english',
    term: 'الترم الأول',
    question: 'Choose the correct answer: "Have you _______ been to Luxor or Aswan before?"',
    options: ['never', 'ever', 'yet', 'since'],
    correctIndex: 1,
    explanation: 'We use "ever" in questions to ask about experiences in someone\'s life (Have you ever...?).',
    rimwaEncouragement: 'Brilliant work Rimwa! English grammar is piece of cake for you!'
  },
  {
    id: 'exam-eng-2',
    governorate: 'الجيزة',
    year: '2024',
    subject: 'اللغة الإنجليزية',
    subjectId: 'english',
    term: 'الترم الأول',
    question: 'Complete the sentence: "Dr. Magdi Yacoub is a famous surgeon _______ helps people with heart diseases."',
    options: ['which', 'where', 'who', 'whose'],
    correctIndex: 2,
    explanation: 'We use the relative pronoun "who" to refer to people (Dr. Magdi Yacoub).',
    rimwaEncouragement: 'Excellent ya Rimwa! You are truly our Prep 3 superstar!'
  }
];
