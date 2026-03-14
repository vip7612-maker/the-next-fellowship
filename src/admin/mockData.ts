export interface Applicant {
    id: number;
    name: string;
    school: string;
    phone: string;
    email: string;
    careerReason: string;
    motivation: string;
    questionForYoon: string;
    status: 'Pending' | 'Selected' | 'Waitlist';
    date: string;
    deletedAt?: string;
}

const initialMockApplicants: Applicant[] = [
    {
        id: 1,
        name: "목진교",
        school: "홍천고등학교",
        phone: "1089401421",
        email: "mjk051300962@gmail.com",
        careerReason: "어릴 때 컴퓨터 하드웨어의 성능 한계를 극복하는 '전력 효율' 기술에 매료되었습니다. 그래서 반도체에 관심을 가지게 되었고 전문 지식을 통해 IT 산업의 물리적 한계를 돌파하는 '반도체 연구원'을 꿈꾸고 있습니다.",
        motivation: "2학년 진학을 앞두고 제 학업 방향에 대한 확신이 필요해 지원하게 되었습니다. 지방 일반고 특성상 전문적인 공대 진학 컨설팅 기회가 부족해 현재 제 생기부와 성적이 한양대 융합전자공학부 목표에 적합한지 냉정히 진단받고 싶습니다.",
        questionForYoon: "인프라가 부족한 지방 일반고에서 반도체 관련 심화 탐구 역량을 생기부에 효과적으로 드러낼 방법은 무엇인가요?",
        status: 'Pending',
        date: "2026-03-14"
    },
    {
        id: 2,
        name: "민선홍",
        school: "홍천고등학교",
        phone: "1077664890",
        email: "ksuj22@naver.com",
        careerReason: "반도체 및 신소재 공과계열을 희망함. 우리 생활의 질과 밀접한 분야로 다른 사람들에게 도움을 줄 수 있어서",
        motivation: "나에게 맞는 대입전형을 알고싶고 생기부에서 더 보충해야 할 내용을 알아보고 싶다",
        questionForYoon: "생기부에서 보충해야 할 부분을 질문하고 싶다",
        status: 'Pending',
        date: "2026-03-14"
    },
    {
        id: 3,
        name: "강도원",
        school: "홍천고등학교",
        phone: "010-9569-2188",
        email: "Kdowon1219@gmail.com",
        careerReason: "의사 - 어릴때부터 시력이 안 좋아서 대학 병원에 많이 갔었다. 병원의 깔끔한 시설과 의료기기에 매력을 느끼고 의사라는 직업에 관심이 생겼다.",
        motivation: "의대에 가는 것은 어렵다. 이 프로그램에 참여하면 방향성을 찾을 수 있을 거라고 생각해서 지원하게 되었다.",
        questionForYoon: "1학년 생기부가 어떤지 객관적으로 평가받고 싶습니다. 2학년 생기부 방향성과 내신/모의고사 준비 배분에 대해 조언받고 싶습니다.",
        status: 'Pending',
        date: "2026-03-14"
    },
    {
        id: 4,
        name: "강성현",
        school: "홍천고등학교",
        phone: "1026397658",
        email: "rkd080204@naver.com",
        careerReason: "AI엔지니어 - AI는 앞으로 더 크게 발달할 분야이기 때문이다",
        motivation: "미래에 나의 꿈을 이루는것에 도움이 될것같기 때문이다",
        questionForYoon: "이제 3학년인데 생기부를 어떻게 써야할것이 좋을까요?",
        status: 'Pending',
        date: "2026-03-13"
    },
    {
        id: 5,
        name: "김성준",
        school: "홍천고등학교",
        phone: "010-8532-7535",
        email: "seongjun1001@naver.com",
        careerReason: "외교관 - 해외여행을 좋아하며 외교부의 영사업무에 관심을 가지게 되었고 국제정치와 외교관 활동에 관심을 갖게 되었습니다.",
        motivation: "진로에 대해 막연히 꿈만 꾸고 비전을 설정하는 것에 미숙해 조언을 구하고 싶었습니다.",
        questionForYoon: "어떤 학생부가 입학사정관에게 좋은 인상을 남길 수 있는지, 어떤 전략을 짜야 입시에 성공할 수 있는지 질문하고 싶습니다.",
        status: 'Pending',
        date: "2026-03-13"
    },
    {
        id: 6,
        name: "김나현",
        school: "홍천여자고등학교",
        phone: "010-3140-9437",
        email: "nahyun9437@naver.com",
        careerReason: "전기전자공학부 - 과학공부를 하는 과정에서 이 분야에 흥미를 느끼고 있었다는 것을 깨달았습니다.",
        motivation: "특정 기업(sk하이닉스)에 연구원으로 계신 분이 오신다는 소식에 여러가지 질문을 하며 도움을 얻고자 지원하게 되었습니다",
        questionForYoon: "생기부 관리와 세특관리 등에 대해 질문하고 싶습니다.",
        status: 'Pending',
        date: "2026-03-13"
    },
    {
        id: 7,
        name: "김명현",
        school: "홍천고등학교",
        phone: "1057033049",
        email: "kmh081019@gmail.com",
        careerReason: "수학교육과, 전기공학과, 전자공학과",
        motivation: "입시 전형을 잘 알기 위해서",
        questionForYoon: "내 성적에 유리한 전형",
        status: 'Pending',
        date: "2026-03-13"
    },
    {
        id: 8,
        name: "이은지",
        school: "홍천여자고등학교",
        phone: "010-6477-6221",
        email: "ejlee100226@naver.com",
        careerReason: "중·고등학교교사 - 나의 적성과 맞는 것 같고 학생들의 성장과정을 지켜보고 도움을 준다면 뜻깊을 것 같다",
        motivation: "막막한 학교생활을 어떻게 해야할지 도움을 받고싶다",
        questionForYoon: "학생부 준비, 입시 전략 등",
        status: 'Pending',
        date: "2026-03-13"
    },
    {
        id: 9,
        name: "정원지",
        school: "홍천여자고등학교",
        phone: "1089842575",
        email: "wj89842575@gmail.com",
        careerReason: "심리학상담사 - 상대방의 마음을 이해하며 문제를 해결해나가고 심리분석과 가르침에 흥미가 있다",
        motivation: "직업이 나에게 알맞은곳인지 내가 원하는 직업을 갖기위해 무엇을 해야 더 효율적인지를 알고싶기때문이다",
        questionForYoon: "학생부 기록과 나의 직업을 갖기위해 어떤일을 해야하는지 궁금하다",
        status: 'Pending',
        date: "2026-03-13"
    },
    {
        id: 10,
        name: "김가영",
        school: "홍천여자고등학교",
        phone: "010-5316-0759",
        email: "blueduck__@naver.com",
        careerReason: "수의대 - 어렸을 때부터 고민해보다가 진로로 잡게 됐고 의료공학쪽도 관심있어요",
        motivation: "학교에서 홍보하는 걸 보고 생기부나 진로관련 도움을 받고싶어요",
        questionForYoon: "생기부관리나 입시를 어떻게 해야하고 목표로 해야할지 모르겠어요",
        status: 'Pending',
        date: "2026-03-13"
    },
    {
        id: 11,
        name: "정지후",
        school: "홍천고등학교",
        phone: "1092455708",
        email: "jihoo2221@gmail.com",
        careerReason: "일어일문학과 - 평소 일본에 대해 관심이 많았고 내가 좋아하고 잘 할 수 있는 유일한 학문이라고 생각했기 때문에",
        motivation: "3학년이니 뭐든 일단 해보자는 생각으로 지원하려 하고 입시에 대해 더 알아가고 동기부여를 얻고 싶습니다.",
        questionForYoon: "생기부에 진로에 대한 일관성이 없어서 원하는 과에 진학하는데 부정적인 영향을 줄까요?",
        status: 'Pending',
        date: "2026-03-13"
    },
    {
        id: 12,
        name: "박인성",
        school: "홍천고등학교",
        phone: "1055784059",
        email: "ashleyjypinsung@naver.com",
        careerReason: "생명공학과 - 바이오 연구를 해서 신약을 개발하고 싶다",
        motivation: "윤여정 선생님 보고싶어서, 내 진로 관련된 정보들을 직접 보고 듣고 싶어서",
        questionForYoon: "3학년 때 세특 잘 적히려면 활동 뭐 해야하나요?",
        status: 'Pending',
        date: "2026-03-13"
    },
    {
        id: 13,
        name: "이완규",
        school: "홍천고등학교",
        phone: "10448226858",
        email: "",
        careerReason: "경제학과 - 경제는 우리 생활과 사회 전반에 큰 영향을 미치고 경제 현상의 원리를 배우고 싶어 경제학과 진학을 희망하게 되었다.",
        motivation: "나의 학생부를 객관적으로 분석하고 진로와 연계된 방향으로 보완하고 싶어 지원하게 되었다.",
        questionForYoon: "선생님께서 제 학생부를 어떻게 보실지 궁금하고 부족한 점이 있다면 어떤 부분을 보완하면 좋을지 조언을 듣고 싶습니다.",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 14,
        name: "고건호",
        school: "홍천고등학교",
        phone: "1086739771",
        email: "kgh910111@gmail.com",
        careerReason: "방송국 PD - 재밌는 예능이나 영상을 만들고 싶기 때문입니다",
        motivation: "현재 진로와 진학 방향에 대해 고민이 많아 전문가의 도움을 받고 싶어 신청하게 되었습니다.",
        questionForYoon: "진로도 고민이고 생기부도 고민입니다",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 15,
        name: "이은찬",
        school: "홍천고등학교",
        phone: "1094293896",
        email: "chan0114_@naver.com",
        careerReason: "교사 - 누군가를 가르친다는 부분에서 매력을 느꼈고 엄마의 어렸을 적 꿈을 대신 이루어 드리고 싶어서",
        motivation: "고등학교에 입학하며 다양한 경험을 해보고 싶어서 지원하게 됐습니다",
        questionForYoon: "입시 전략에 대해 질문하고 싶습니다",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 16,
        name: "임정욱",
        school: "홍천고등학교",
        phone: "010-8362-4401",
        email: "a01083624401a@gmail.com",
        careerReason: "체육교육과 - 아이들에게 체육을 가르쳐줄때 그 즐거움과 아이들이 건강해질수있다는 자부심이 즐겁다.",
        motivation: "대학교를 어떻게 가야할지 모르겠어서",
        questionForYoon: "대학교 전략을 배우고싶다",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 17,
        name: "전제현",
        school: "홍천고등학교",
        phone: "010-6335-5212",
        email: "wpgusl0315@naver.com",
        careerReason: "경영학과/경제학과 - 취업이 잘된다는 점과 경영,경제에 관심이 있었고 제 성격과 잘 맞는 학과인거 같아서",
        motivation: "고3이 되고나서 대학에 진학하기 위해 정보가 많이 부족하다고 생각해서 도움을 받고자 지원했습니다.",
        questionForYoon: "마지막 3학년 학생부 꿀팁이나 입시정보에 대해 많이 물어보고싶습니다.",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 18,
        name: "권동혁",
        school: "홍천고등학교",
        phone: "1091211679",
        email: "dongtory091110@naver.com",
        careerReason: "건축학과 - 중학교때 기술시간에 스파게티 면으로 구조물 만들기를 하며 건축에 흥미를 느꼈습니다",
        motivation: "생활기록부를 어떻게 꾸며나가야 하는지, 건축학과에 진학하려면 어떤 수업을 들어야 하는지 궁금해서 지원하게 되었습니다.",
        questionForYoon: "생기부를 잘 꾸미는 방법을 여쭤보고 싶습니다.",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 19,
        name: "김민규",
        school: "홍천고등학교",
        phone: "010-4136-4423",
        email: "mingyu090114@naver.com",
        careerReason: "간호사 - 보건선생님을 보고 간호사에 대한 책을 읽고 드라마를 보며 간호사에 대한 진로를 키우게 되었다.",
        motivation: "최근에 공부하기 싫다는 생각이 자꾸 든다. 이 프로그램을 하며 동기부여를 받고 싶다.",
        questionForYoon: "생기부를 어떻게 준비해야 대학교에서 좋게 볼지에 대한 생기부 전략을 알고싶습니다.",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 20,
        name: "김지호",
        school: "홍천고등학교",
        phone: "1027049481",
        email: "misojiho08@gmail.com",
        careerReason: "건축학과 - 설계와 디자인에 관심이 있어서 희망하게 되었다.",
        motivation: "학생 회장의 추천",
        questionForYoon: "학생부 준비랑 갈 수 있는 대학에 대해서 질문하고 싶다",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 21,
        name: "박찬빈",
        school: "홍천고등학교",
        phone: "010-3804-1106",
        email: "a01066261843@icloud.com",
        careerReason: "경영 - 기업이 운영되고 성장하는 과정과 경영 활동이 사회에 미치는 영향에 관심을 가지게 되었다.",
        motivation: "나의 잠재력을 무한대로 펼치기 위해서",
        questionForYoon: "학생부 준비, 입시 전략 등",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 22,
        name: "신은친",
        school: "홍천고등학교",
        phone: "010-8295-1596",
        email: "eun20080523@gmail.com",
        careerReason: "공학쪽 계열 - 가장 먹고 살기 좋을거 같아서",
        motivation: "생기부에 대한 고민이 많았는데 학교에서 지원하라는 글을 보게 되어 지원하게 되었다",
        questionForYoon: "학생생활 기록부 활동을 어떻게 채울지 질문하고 싶다",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 23,
        name: "조건허",
        school: "홍천고등학교",
        phone: "010-2594-4356",
        email: "ghjo1234@naver.com",
        careerReason: "미디어커뮤니케이션학과 - 어릴때 드라마와 영화를 좋아해서 PD와 방송쪽에 관심을 가지게 되었습니다",
        motivation: "훌륭하신분들에게 도움을 받고 싶어서 지원했습니다.",
        questionForYoon: "지금 생기부에서 무엇을 더 해야하는지 어떤 활동을 해야하는지 대학을 어디갈 수 있는지 궁금합니다.",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 24,
        name: "이채현",
        school: "홍천여자고등학교",
        phone: "1063953939",
        email: "hyeun001215@gmail.com",
        careerReason: "이과계열 - 적성에 맞는것같다",
        motivation: "확실하지 않은 진로를 생기부에 어떻게 녹여내는지 궁금하다",
        questionForYoon: "진로가 중간에 바뀌면 어떻게 생기부를 써야하나요?",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 25,
        name: "한보은",
        school: "홍천여자고등학교",
        phone: "1085737544",
        email: "boeunhan1002@gmail.com",
        careerReason: "방송관련 진로 - 초중학교시절 방송부로 활동했었고 촬영이나 편집에 관심이 많기 때문이다",
        motivation: "입시에 대해 잘 알아보고싶고 더 나은 진로 선택을 하고싶기 때문이다",
        questionForYoon: "입시 전략이랑 학생부에 대해 자세히 설명을 듣고싶어요!!",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 26,
        name: "김도하",
        school: "홍천고등학교",
        phone: "010-2380-0214",
        email: "qkrehgk08@gmail.com",
        careerReason: "AI 엔지니어 - 사회적 흐름이 AI로 인해 빠르게 변화하면서 AI 관련 전문가 수요가 증가하고 있고 적성에 맞는 진로라고 생각됩니다.",
        motivation: "AI학과를 희망하지만 학업 계획과 대학 진학 전략에 대해 방향을 잡지 못한 상황입니다. 전문가의 조언을 통해 로드맵을 계획하고자 지원하게 되었습니다.",
        questionForYoon: "AI 엔지니어 진로 목표로 인공지능학과와 컴퓨터공학과 중 어느 학과가 더 적합한지, 고등학교 재학 중 우선적으로 갖추어야 할 역량이 무엇인지 궁금합니다.",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 27,
        name: "이서진",
        school: "홍천여자고등학교",
        phone: "1088391521",
        email: "lseojin0929@naver.com",
        careerReason: "경영 분야 - 사람들과 함께 목표를 세우고 문제를 해결하며 조직을 운영하는 과정에 관심이 있습니다.",
        motivation: "넥스트 펠로우십 프로그램을 통해 다양한 분야의 사람들과 교류하고 새로운 경험을 통해 시야를 넓히고 싶습니다.",
        questionForYoon: "고등학교 1학년 때부터 학생부를 준비할 때 가장 중요하게 생각해야 할 활동이나 태도는 무엇인가요?",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 28,
        name: "김수인",
        school: "홍천여자고등학교",
        phone: "1052686270",
        email: "lingy0882@naver.com",
        careerReason: "경제학과 - 물가 상승, 자원 분배, 소득 격차 같은 경제 문제가 왜 발생하는지 탐구하고 해결 방안을 찾는 과정에 관심을 가지게 되었습니다",
        motivation: "해당 분야의 생생한 이야기에 흥미를 느꼈고 입시에 대한 전략과 생기부 관련 내용에 대해 알고 싶기 때문에 지원하였습니다.",
        questionForYoon: "현재 교육과정의 마지막 입시에서 원서를 어떻게 지원해야 하는지, 생기부와 내신 상황을 고려하면 어느 정도의 대학이 지원 가능한지 궁금합니다",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 29,
        name: "윤은결",
        school: "홍천여자고등학교",
        phone: "010-9598-0775",
        email: "yooneunkyul@gmail.com",
        careerReason: "광고기획자 - 정답이 있는 것보다 내가 직접 생각해내서 해결하는 것이 적성에 맞고 광고가 짧은 시간내에 사람들의 마음을 움직이게 한다는 것이 인상 깊었음",
        motivation: "진로를 위한 구체적인 생기부 관리에 대해 알고 싶고 꿈꾸는 직업에 대해서도 더 자세히 알고싶었어요",
        questionForYoon: "희망 학과는 미디어커뮤니케이션학과인데 꿈은 광고기획자라 생기부나 동아리 등등을 어떻게 해야할지 모르겠어요",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 30,
        name: "전수빈",
        school: "",
        phone: "1046799123",
        email: "jsubin09123@naver.com",
        careerReason: "항공우주공학자 - 누리호 발사를 보며 로켓과 우주기술에 큰 흥미를 느끼게 되었고 항공우주동아리를 운영하며 확신을 가지게 되었습니다.",
        motivation: "산업의 최전선에서 활동하시는 전문가들의 이야기를 통해 막연한 진로를 구체적으로 발전시키고 싶기 때문입니다.",
        questionForYoon: "학생부종합전형 준비 시 어떤 탐구 활동을 중심으로 학생부를 설계하는 것이 효과적인지 궁금합니다.",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 31,
        name: "오리온",
        school: "홍천고등학교",
        phone: "010-6694-8765",
        email: "krohrion@gmail.com",
        careerReason: "게임 개발자 - 초등학교때부터 게임 개발에 관심있어 독자적으로 게임개발하고 있습니다",
        motivation: "진로 적성에 맞는 대학교를 찾고 진로역량을 기르기 위해 지원하게 되었습니다",
        questionForYoon: "성적이 안좋지만 게임개발 업계에선 포트폴리오 및 실기 위주로 선별하는데 이것이 올바른 방법일까요?",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 32,
        name: "원태린",
        school: "홍천여자고등학교",
        phone: "1029233487",
        email: "terin0918@gmail.com",
        careerReason: "공학자 - 과학 개념을 탐구하는 것을 즐기고 평생 좋아하는 일을 하고 싶어서 공학자를 선택했습니다",
        motivation: "고3이 되고 나니 고민은 많아지는데 물어볼 사람이 없어서 이 프로그램에 지원하게 되었습니다.",
        questionForYoon: "고3 생기부를 어떻게 깊게 탐구해야 하는지, 원하는 과를 가려면 어디정도까지 내신을 올려야 하는지 궁금합니다",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 33,
        name: "최아인",
        school: "홍천여자고등학교",
        phone: "1093775376",
        email: "inah940912@gmail.com",
        careerReason: "경영학과 - 스포츠와 연예에 관심이 많아 마케팅 방법에 흥미를 갖게 되었고 경영학과를 희망하게 됨.",
        motivation: "실제 마케팅 업계에서는 어떤 것을 중요시 하는지, 입시 전략에 대해 궁금해서",
        questionForYoon: "생기부 활동들이 맞는 것인지, 앞으로의 생기부를 어떻게 채워야 하는지",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 34,
        name: "김정원",
        school: "홍천여자고등학교",
        phone: "010-8193-0553",
        email: "jeong0553@icloud.com",
        careerReason: "사회계열 - 주변 사람들을 돕는 것에 보람을 느끼고 사회에 도움이 되는 일을 하고 싶습니다.",
        motivation: "다양한 분야의 경험을 해보고 싶어 지원하게 되었고 여러 사람들과 교류하며 시야를 넓히고 싶습니다.",
        questionForYoon: "대학교에 들어가기 위한 많은 전형이 궁금해요.",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 35,
        name: "김태영",
        school: "홍천여자고등학교",
        phone: "0101-7586-6112",
        email: "rokmcc36900@naver.com",
        careerReason: "경찰행정학과 - 타인을 도와주고 사회 질서 유지에 기여하는 모습이 인상적이고 멋있기 때문입니다",
        motivation: "두 분야의 전문가 선생님들의 강의를 잘 듣고 진로 선택에 도움을 받고 싶어 지원하게 되었습니다",
        questionForYoon: "성적이 좋지 않은 편인데 어떻게 하면 가장 잘 대학을 갈 수 있을지, 생기부가 좋은지 나쁜지, 특별전형에 대해 궁금합니다!",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 36,
        name: "김서정",
        school: "홍천여자고등학교",
        phone: "010-8360-2221",
        email: "213sj0@gmail.com",
        careerReason: "중동 사학자 - 세계사에서 중동지역이 제일 흥미있다고 느꼈고 대륙을 잇는 위치라 다문화라 배우는 데에 더 재밌어 보였다.",
        motivation: "지금 가고 있는 길이 맞는지 모르겠어서 혼란스러운 생각에 지원하게 되었습니다!",
        questionForYoon: "농어촌 전형 실효성, 생기부 스토리 연결 방법, 내신과 모고 공부 병행 방법이 궁금합니다.",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 37,
        name: "김예은",
        school: "홍천여자고등학교",
        phone: "010-6413-4104",
        email: "nan247717@gmail.com",
        careerReason: "공연기획자 - 누군가에게는 도피처가 되고 궁금증을 유발하고 깨달음을 줄 수 있는 기획을 하고 싶습니다.",
        motivation: "문화콘텐츠과와 철학과 사이에서 갈피를 못 잡고 있어 도움을 청하고자 지원하게 되었습니다!",
        questionForYoon: "문화콘텐츠과와 철학과 사이에서 생기부를 어떤 식으로 써야할지 감이 잡히지 않아요.",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 38,
        name: "김규경",
        school: "홍천여자고등학교",
        phone: "010-9356-1542",
        email: "kkuu0726@naver.com",
        careerReason: "마케팅 분야 - 아이돌이 세계관으로 이미지를 만들어가는 부분이 흥미로웠고 브랜드의 이미지를 만드는 일을 하고 싶다",
        motivation: "희망 진로에 대해 더 자세히 알고 싶고 현직 종사자들의 자세한 이야기를 듣고 싶어서 지원하게 되었다",
        questionForYoon: "생기부를 어떻게 하면 잘 채울 수 있는지, 세특을 어떤 방식으로 쓰면 좋은지",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 39,
        name: "한보성",
        school: "홍천고등학교",
        phone: "1072745803",
        email: "wter760814@naver.com",
        careerReason: "신소재 연구원 - 통합과학에서 배운 그래핀에 관심을 가지게 되어 신소재 분야를 희망하게 되었습니다.",
        motivation: "나의 성적과 활동을 객관적으로 확인하고 입시에서의 복잡한 전형들을 이해하고자 지원하게 되었습니다.",
        questionForYoon: "나의 성적과 활동을 객관적으로 확인하고 입시에서의 복잡한 전형들을 이해하고 싶습니다.",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 40,
        name: "김현우",
        school: "홍천고등학교",
        phone: "1088744138",
        email: "hwjjang0907@gmail.com",
        careerReason: "식품생명공학 - 미생물, 발효, 생명공학 기술을 활용해 더 안전하고 영양가 높은 식품을 만드는 과정에 큰 흥미를 느꼈습니다.",
        motivation: "진로가 바뀌면서 학교생활기록부를 어떤 방향으로 준비해야 할지 고민이 많아져 전문가의 조언을 받고 싶어 지원하게 되었습니다.",
        questionForYoon: "식품생명공학과 같은 이공계 진로를 목표로 하는 학생이 학생부를 어떻게 준비하면 좋은지 궁금합니다.",
        status: 'Pending',
        date: "2026-03-11"
    },
    {
        id: 41,
        name: "권도하",
        school: "홍천고등학교",
        phone: "1037993331",
        email: "stonecoin.maker@gmail.com",
        careerReason: "내과 의사 - 암과 노화 연구를 위해서",
        motivation: "사랑받는 의사가 될 수 있을지 전문가에게 의견을 들어보고 싶고 의사와 AI를 어떻게 연관시킬 수 있을지 고민해보기 위해서",
        questionForYoon: "진로에 맞는 학교생활기록부 활동이 뭐가 있을지 궁금합니다",
        status: 'Pending',
        date: "2026-03-11"
    },
    {
        id: 42,
        name: "허준열",
        school: "홍천고등학교",
        phone: "1046712146",
        email: "wnsduf0906@gmail.com",
        careerReason: "초등교사 - 중학교때 영어선생님을 보고 감명을 받아 교사의 길을 걷기로 했습니다.",
        motivation: "친구를 통해 알게되었습니다.",
        questionForYoon: "생기부를 잘 채웠는지 궁금하고 생기부 방향을 잡아주시면 좋겠고 어느정도 성적이어야 교대를 갈수있는지 궁금합니다.",
        status: 'Pending',
        date: "2026-03-11"
    },
    {
        id: 43,
        name: "박주영",
        school: "홍천고등학교",
        phone: "1097890311",
        email: "pjy365741@gmail.com",
        careerReason: "비행기 조종사 - 탑건을 감명깊게 보고 희망하게 되었다.",
        motivation: "나의 생기부를 잘 채우고 싶고 입시준비를 어떻게 하면 좋을지 배우고 싶어서 지원했다.",
        questionForYoon: "사관학교 입시는 어떻게 하면 좋나요?",
        status: 'Pending',
        date: "2026-03-11"
    },
    {
        id: 44,
        name: "용규영",
        school: "홍천고등학교",
        phone: "1041352702",
        email: "a01041352702@gmail.com",
        careerReason: "의사 - 높은 소득과 전문직이라는 안정성과 더불어 생명을 지키는 일에서 오는 삶의 의미를 누려보고 싶기 때문입니다",
        motivation: "탐구 활동의 방향성과 조언을 들어보고 싶기 때문입니다",
        questionForYoon: "어떤 학생부가 좋은 것인지, 입시를 어떻게 전략적으로 할 수 있는지",
        status: 'Pending',
        date: "2026-03-11"
    },
    {
        id: 45,
        name: "신기현",
        school: "홍천고등학교",
        phone: "1096644596",
        email: "god100302@gmail.com",
        careerReason: "공군사관학교 공군 장교 - 어렸을 때부터 하늘에 대한 동경과 전투기에 대한 호기심을 가지고 있었습니다.",
        motivation: "제 입시에 엄청난 영향력을 끼칠 것 같았고 동기를 더 견고하게 만들어 줄 것 같았기 때문입니다.",
        questionForYoon: "학생부준비와 꿀팁이나 전략, 진로 로드맵이나 진로관련 활동들을 알려주셨으면 좋겠습니다.",
        status: 'Pending',
        date: "2026-03-11"
    },
    {
        id: 46,
        name: "허준서",
        school: "홍천고등학교",
        phone: "010-2118-2146",
        email: "junseoh731@gmail.com",
        careerReason: "중등·고등 체육교사 - 초등학교때부터 운동을 좋아하고 친구들을 도와주며 체육교사에 가까워졌습니다",
        motivation: "바뀐 고교학점제를 잘 이해하지 못하고 생기부의 방향성을 잘 잡지 못할것 같아 지원하게 되었습니다!",
        questionForYoon: "생기부활동 방향을 알고 싶습니다. 2학년때 선택과목을 어떻게 선택하는것이 대학입시에 유리한지 알고싶습니다!",
        status: 'Pending',
        date: "2026-03-11"
    }
];

export const getApplicants = (): Applicant[] => {
    const saved = localStorage.getItem('fellowship_applicants');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse applicants from local storage", e);
        }
    }
    return initialMockApplicants;
};

export const saveApplicants = (applicants: Applicant[]) => {
    localStorage.setItem('fellowship_applicants', JSON.stringify(applicants));
};

export const addApplicant = (applicantData: Omit<Applicant, 'id' | 'status' | 'date'>) => {
    const currentApplicants = getApplicants();
    const newApplicant: Applicant = {
        ...applicantData,
        id: Date.now(),
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
    };
    saveApplicants([newApplicant, ...currentApplicants]);
};

export const updateApplicantStatus = (id: number | string, status: Applicant['status']) => {
    const applicants = getApplicants();
    const updated = applicants.map(app => app.id === Number(id) ? { ...app, status } : app);
    saveApplicants(updated);
};

// ===== Soft Delete Management =====

export const getDeletedApplicants = (): Applicant[] => {
    const saved = localStorage.getItem('fellowship_deleted_applicants');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse deleted applicants', e);
        }
    }
    return [];
};

export const saveDeletedApplicants = (applicants: Applicant[]) => {
    localStorage.setItem('fellowship_deleted_applicants', JSON.stringify(applicants));
};

export const softDeleteApplicant = (id: number | string) => {
    const applicants = getApplicants();
    const target = applicants.find(app => app.id === Number(id));
    if (!target) return;

    // Add to deleted list with timestamp
    const deleted = getDeletedApplicants();
    deleted.unshift({ ...target, deletedAt: new Date().toISOString() });
    saveDeletedApplicants(deleted);

    // Remove from active list
    const updated = applicants.filter(app => app.id !== Number(id));
    saveApplicants(updated);
};

export const restoreApplicant = (id: number | string) => {
    const deleted = getDeletedApplicants();
    const target = deleted.find(app => app.id === Number(id));
    if (!target) return;

    // Remove deletedAt and add back to active list
    const { deletedAt: _, ...restoredApplicant } = target;
    const applicants = getApplicants();
    applicants.unshift(restoredApplicant as Applicant);
    saveApplicants(applicants);

    // Remove from deleted list
    const updatedDeleted = deleted.filter(app => app.id !== Number(id));
    saveDeletedApplicants(updatedDeleted);
};

export interface Topic {
    id: number;
    title: string;
    description: string;
    votes: number;
    createdAt: string;
    authorName: string;
    authorPhone: string;
}

export interface VoteRecord {
    id: number;
    topicId: number;
    name: string;
    phone: string;
    createdAt: string;
}

const initialTopics: Topic[] = [
    { id: 1, title: "경제,금융", description: "자본주의의 흐름을 읽고 새로운 가치를 창출하는 경제와 금융의 세계.", votes: 0, createdAt: "2026-03-09", authorName: "운영진", authorPhone: "000-0000-0000" },
    { id: 2, title: "자유전공학부", description: "나만의 길을 스스로 설계하는 융합 인재의 시대를 대비합니다.", votes: 0, createdAt: "2026-03-09", authorName: "운영진", authorPhone: "000-0000-0000" },
    { id: 3, title: "교육계열", description: "누군가의 인생과 미래를 빚어내는 가장 가치 있는 일, 교육의 진정한 의미.", votes: 0, createdAt: "2026-03-09", authorName: "운영진", authorPhone: "000-0000-0000" },
    { id: 4, title: "AI분야", description: "우리의 일상을 혁신하고 세상을 바꾸는 인공지능 기술의 오늘과 내일.", votes: 0, createdAt: "2026-03-09", authorName: "운영진", authorPhone: "000-0000-0000" },
    { id: 5, title: "생명화학", description: "인류가 직면한 난제를 해결하는 생명과학과 화학의 무한한 가능성.", votes: 0, createdAt: "2026-03-09", authorName: "운영진", authorPhone: "000-0000-0000" },
    { id: 6, title: "건축", description: "사람의 시간과 공간을 잇고 새로운 뼈대를 세우는 건축의 본질.", votes: 0, createdAt: "2026-03-09", authorName: "운영진", authorPhone: "000-0000-0000" },
    { id: 7, title: "예체능(음악,미술,체육)", description: "한계를 극복하는 열정과 창의성으로 세상에 감동을 전합니다.", votes: 0, createdAt: "2026-03-09", authorName: "운영진", authorPhone: "000-0000-0000" },
    { id: 8, title: "보건(간호)", description: "생명의 가장 가까이에서 돌봄과 헌신의 가치를 실천하는 의료 복지.", votes: 0, createdAt: "2026-03-09", authorName: "운영진", authorPhone: "000-0000-0000" }
];

export const getTopics = (): Topic[] => {
    let topics = initialTopics;
    const saved = localStorage.getItem('fellowship_topics');
    if (saved) {
        try {
            topics = JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse topics", e);
        }
    }

    // Recalculate true votes based on actual vote records to ensure data integrity
    const allVotes = getTopicVotes();
    return topics.map(topic => ({
        ...topic,
        votes: allVotes.filter(v => v.topicId === topic.id).length
    }));
};

export const saveTopics = (topics: Topic[]) => {
    localStorage.setItem('fellowship_topics', JSON.stringify(topics));
};

export const addTopic = (topicData: { title: string; description: string; authorName: string; authorPhone: string }) => {
    const currentTopics = getTopics();
    const newTopic: Topic = {
        ...topicData,
        id: Date.now(),
        votes: 1, // Author's vote counts as 1 automatically
        createdAt: new Date().toISOString()
    };
    saveTopics([newTopic, ...currentTopics]);

    // Automatically record the author's vote to prevent double voting on their own topic
    addTopicVote(newTopic.id, topicData.authorName, topicData.authorPhone);
};

export const getTopicVotes = (): VoteRecord[] => {
    const saved = localStorage.getItem('fellowship_topic_votes');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) { }
    }
    return [];
};

export const saveTopicVotes = (votes: VoteRecord[]) => {
    localStorage.setItem('fellowship_topic_votes', JSON.stringify(votes));
};

export const addTopicVote = (topicId: number, name: string, phone: string) => {
    const currentVotes = getTopicVotes();

    // Duplication Check: Same name and phone for the same topic
    const hasVoted = currentVotes.some(v => v.topicId === topicId && v.name === name && v.phone === phone);
    if (hasVoted) {
        throw new Error("이미 이 주제에 신청(투표)하셨습니다.");
    }

    const newVote: VoteRecord = {
        id: Date.now(),
        topicId,
        name,
        phone,
        createdAt: new Date().toISOString()
    };
    saveTopicVotes([newVote, ...currentVotes]);

    // Update the vote count in the Topic object
    const currentTopics = getTopics();
    const updatedTopics = currentTopics.map(t =>
        t.id === topicId ? { ...t, votes: t.votes + 1 } : t
    );
    saveTopics(updatedTopics);
};

export const mockGallery = [
    { id: 1, title: "오리엔테이션 스케치", type: "이미지", date: "2026-03-01", status: "게시됨" },
    { id: 2, title: "반도체 vs 마케팅 하이라이트", type: "유튜브", date: "2026-03-22", status: "게시됨" },
    { id: 3, title: "참여자 네트워킹 데이", type: "이미지", date: "2026-03-25", status: "비공개" }
];

export const getTargetCapacity = (): number => {
    const saved = localStorage.getItem('fellowship_target_capacity');
    if (saved) {
        return parseInt(saved, 10) || 50;
    }
    return 50;
};

export const saveTargetCapacity = (capacity: number) => {
    localStorage.setItem('fellowship_target_capacity', capacity.toString());
};
