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
        name: "정하늘",
        school: "홍천고등학교",
        phone: "010-5678-9012",
        email: "haneul.j@email.com",
        careerReason: "데이터 분석가 - 숫자 뒤에 숨겨진 이야기를 찾는 것이 재미있습니다.",
        motivation: "빅데이터 시대에 필요한 역량을 현직자에게 직접 듣고 싶습니다.",
        questionForYoon: "수학과와 통계학과 중 데이터 분석에 더 적합한 전공은 무엇인가요?",
        status: 'Pending',
        date: "2026-03-04"
    },
    {
        id: 2,
        name: "한소희",
        school: "홍천여자고등학교",
        phone: "010-6789-0123",
        email: "sohee.h@email.com",
        careerReason: "간호사 - 아픈 사람들을 가장 가까이에서 돌보는 직업에 소명감을 느낍니다.",
        motivation: "보건 분야의 다양한 진로 가능성을 탐색하고 싶습니다.",
        questionForYoon: "간호학과의 입시 전략과 면접 준비 팁이 궁금합니다.",
        status: 'Selected',
        date: "2026-03-04"
    },
    {
        id: 3,
        name: "오태양",
        school: "홍천고등학교",
        phone: "010-7890-1234",
        email: "taeyang.o@email.com",
        careerReason: "소프트웨어 개발자 - 코딩으로 세상의 불편함을 해결하고 싶습니다.",
        motivation: "IT 업계 현직자의 생생한 이야기를 듣고 진로를 확정하고 싶습니다.",
        questionForYoon: "컴퓨터공학과 소프트웨어학과의 차이점이 궁금합니다.",
        status: 'Pending',
        date: "2026-03-05"
    },
    {
        id: 4,
        name: "윤채원",
        school: "홍천여자고등학교",
        phone: "010-8901-2345",
        email: "chaewon.y@email.com",
        careerReason: "심리상담사 - 타인의 마음을 이해하고 치유하는 일에 관심이 있습니다.",
        motivation: "심리학의 실제 적용 분야를 넓게 알아보고 싶습니다.",
        questionForYoon: "심리학과의 취업 전망과 대학원 진학의 필요성이 궁금합니다.",
        status: 'Pending',
        date: "2026-03-05"
    },
    {
        id: 5,
        name: "강도현",
        school: "양덕중고등학교",
        phone: "010-9012-3456",
        email: "dohyun.k@email.com",
        careerReason: "건축가 - 사람이 사는 공간을 아름답고 기능적으로 설계하고 싶습니다.",
        motivation: "건축 분야의 현실적인 진로 경로를 알고 싶습니다.",
        questionForYoon: "건축학과 5년제와 4년제의 차이, 어느 쪽이 유리한가요?",
        status: 'Selected',
        date: "2026-03-05"
    },
    {
        id: 6,
        name: "서예진",
        school: "홍천여자고등학교",
        phone: "010-1122-3344",
        email: "yejin.s@email.com",
        careerReason: "외교관 - 국제 무대에서 한국을 대표하는 사람이 되고 싶습니다.",
        motivation: "글로벌 시대에 필요한 역량이 무엇인지 전문가에게 배우고 싶습니다.",
        questionForYoon: "외교학과 vs 정치외교학과, 진로에 맞는 학과 선택이 고민됩니다.",
        status: 'Pending',
        date: "2026-03-05"
    },
    {
        id: 7,
        name: "문지호",
        school: "홍천고등학교",
        phone: "010-2233-4455",
        email: "jiho.m@email.com",
        careerReason: "환경공학자 - 기후변화 시대에 지구를 지키는 기술을 개발하고 싶습니다.",
        motivation: "환경 분야와 공학의 융합에 대해 깊이 이해하고 싶습니다.",
        questionForYoon: "환경공학과의 실제 취업 분야와 전망이 궁금합니다.",
        status: 'Pending',
        date: "2026-03-06"
    },
    {
        id: 8,
        name: "임수빈",
        school: "홍천여자고등학교",
        phone: "010-3344-5566",
        email: "subin.l@email.com",
        careerReason: "약사 - 사람들의 건강을 약학 지식으로 돕고 싶습니다.",
        motivation: "약학대학 진학을 위한 구체적인 준비 전략을 알고 싶습니다.",
        questionForYoon: "약학대학 PEET 준비를 고등학교 때부터 어떻게 시작해야 하나요?",
        status: 'Waitlist',
        date: "2026-03-06"
    },
    {
        id: 9,
        name: "유승호",
        school: "홍천고등학교",
        phone: "010-4455-6677",
        email: "seungho.y@email.com",
        careerReason: "항공우주공학자 - 우주 탐사 기술 개발에 꿈을 가지고 있습니다.",
        motivation: "공학 분야의 다양한 가능성을 탐색하고 영감을 얻고 싶습니다.",
        questionForYoon: "항공우주공학과 진학 시 수학/물리 어느 과목에 집중해야 하나요?",
        status: 'Pending',
        date: "2026-03-06"
    },
    {
        id: 10,
        name: "배지민",
        school: "양덕중고등학교",
        phone: "010-5566-7788",
        email: "jimin.b@email.com",
        careerReason: "생명과학 연구원 - 유전자 기술로 난치병을 치료하는 연구를 하고 싶습니다.",
        motivation: "최신 바이오 기술 동향과 연구자의 삶이 궁금합니다.",
        questionForYoon: "생명과학과에서 대학원까지 가는 로드맵이 궁금합니다.",
        status: 'Pending',
        date: "2026-03-06"
    },
    {
        id: 11,
        name: "조하은",
        school: "홍천여자고등학교",
        phone: "010-6677-8899",
        email: "haeun.c@email.com",
        careerReason: "디자이너 - 시각적 표현으로 메시지를 전달하는 일에 매력을 느낍니다.",
        motivation: "디자인 분야의 실무와 학교 교육의 차이를 알고 싶습니다.",
        questionForYoon: "시각디자인과 산업디자인 중 어떤 분야가 더 전망이 좋을까요?",
        status: 'Selected',
        date: "2026-03-07"
    },
    {
        id: 12,
        name: "장우진",
        school: "홍천고등학교",
        phone: "010-7788-9900",
        email: "woojin.j@email.com",
        careerReason: "금융 애널리스트 - 경제 흐름을 분석하고 투자 전략을 세우는 일이 흥미롭습니다.",
        motivation: "경제/금융 분야의 현직자에게 실질적인 조언을 듣고 싶습니다.",
        questionForYoon: "경영학과와 경제학과 중 금융 분야에 더 적합한 전공이 궁금합니다.",
        status: 'Pending',
        date: "2026-03-07"
    },
    {
        id: 13,
        name: "신예림",
        school: "홍천여자고등학교",
        phone: "010-8899-0011",
        email: "yerim.s@email.com",
        careerReason: "교사 - 학생들에게 꿈과 희망을 심어주는 교육자가 되고 싶습니다.",
        motivation: "교육 분야의 다양한 접근법과 교사의 현실을 알고 싶습니다.",
        questionForYoon: "사범대와 교육대학원 중 어느 경로가 교사 임용에 유리한가요?",
        status: 'Pending',
        date: "2026-03-07"
    },
    {
        id: 14,
        name: "홍성민",
        school: "홍천고등학교",
        phone: "010-9900-1122",
        email: "sungmin.h@email.com",
        careerReason: "로봇공학자 - 사람을 도와주는 로봇을 만들고 싶습니다.",
        motivation: "기술 혁신이 실제 삶에 미치는 영향을 배우고 싶습니다.",
        questionForYoon: "기계공학과 전자공학 중 로봇 분야에 더 맞는 전공이 있을까요?",
        status: 'Pending',
        date: "2026-03-07"
    },
    {
        id: 15,
        name: "노지현",
        school: "양덕중고등학교",
        phone: "010-1010-2020",
        email: "jihyun.n@email.com",
        careerReason: "수의사 - 말 못하는 동물들의 아픔을 치료해주고 싶습니다.",
        motivation: "생명과 관련된 다양한 직업군을 탐색하고 싶습니다.",
        questionForYoon: "수의대 입시에서 생기부 활동은 어떤 것을 해야 유리한가요?",
        status: 'Waitlist',
        date: "2026-03-07"
    },
    {
        id: 16,
        name: "권서준",
        school: "홍천고등학교",
        phone: "010-2020-3030",
        email: "seojun.k@email.com",
        careerReason: "AI 연구원 - 인공지능이 인간의 삶을 어떻게 바꿀지 연구하고 싶습니다.",
        motivation: "AI 분야의 전문가를 만나 최신 트렌드를 배우고 싶습니다.",
        questionForYoon: "AI 관련 학과 선택 시 수학과 코딩 중 어떤 역량이 더 중요한가요?",
        status: 'Selected',
        date: "2026-03-08"
    },
    {
        id: 17,
        name: "안지윤",
        school: "홍천여자고등학교",
        phone: "010-3030-4040",
        email: "jiyun.a@email.com",
        careerReason: "방송PD - 영상 콘텐츠로 사람들에게 감동과 재미를 주고 싶습니다.",
        motivation: "미디어 산업의 변화와 새로운 기회에 대해 알고 싶습니다.",
        questionForYoon: "미디어커뮤니케이션학과의 실제 커리큘럼은 어떤가요?",
        status: 'Pending',
        date: "2026-03-08"
    },
    {
        id: 18,
        name: "송태민",
        school: "홍천고등학교",
        phone: "010-4040-5050",
        email: "taemin.s@email.com",
        careerReason: "화학공학자 - 신소재 개발로 산업 혁신에 기여하고 싶습니다.",
        motivation: "화학과 공학의 접점에서 어떤 일을 할 수 있는지 알고 싶습니다.",
        questionForYoon: "화학과와 화학공학과의 차이가 정확히 무엇인가요?",
        status: 'Pending',
        date: "2026-03-08"
    },
    {
        id: 19,
        name: "전다은",
        school: "홍천여자고등학교",
        phone: "010-5050-6060",
        email: "daeun.j@email.com",
        careerReason: "사회복지사 - 소외된 이웃을 위해 일하는 삶을 살고 싶습니다.",
        motivation: "사회적 가치를 추구하는 다양한 직업에 대해 알고 싶습니다.",
        questionForYoon: "사회복지학과 졸업 후 실제 어떤 곳에서 일할 수 있나요?",
        status: 'Pending',
        date: "2026-03-08"
    },
    {
        id: 20,
        name: "황도윤",
        school: "양덕중고등학교",
        phone: "010-6060-7070",
        email: "doyun.hw@email.com",
        careerReason: "전기공학자 - 에너지 효율화 기술로 지속가능한 미래를 만들고 싶습니다.",
        motivation: "공학 분야의 현실적인 진로와 연봉 등 솔직한 이야기가 듣고 싶습니다.",
        questionForYoon: "전기공학과와 전자공학과의 차이가 궁금합니다.",
        status: 'Pending',
        date: "2026-03-08"
    },
    {
        id: 21,
        name: "류하린",
        school: "홍천여자고등학교",
        phone: "010-7070-8080",
        email: "harin.r@email.com",
        careerReason: "국어교사 - 학생들에게 글의 아름다움을 전하고 싶습니다.",
        motivation: "교육 분야 전문가의 경험담을 통해 진로를 구체화하고 싶습니다.",
        questionForYoon: "국어교육과 입시에서 독서 활동은 어떻게 정리해야 할까요?",
        status: 'Selected',
        date: "2026-03-09"
    },
    {
        id: 22,
        name: "남현우",
        school: "홍천고등학교",
        phone: "010-8080-9090",
        email: "hyunwoo.n@email.com",
        careerReason: "기계공학자 - 자동차 엔진과 기계 시스템에 매력을 느낍니다.",
        motivation: "기계공학의 미래와 자동화 시대의 전망을 알고 싶습니다.",
        questionForYoon: "기계공학과 졸업 후 취업이 잘 되는 분야가 어디인가요?",
        status: 'Pending',
        date: "2026-03-09"
    },
    {
        id: 23,
        name: "구민서",
        school: "홍천여자고등학교",
        phone: "010-9090-1010",
        email: "minseo.g@email.com",
        careerReason: "영양사 - 올바른 식생활로 사람들의 건강을 지키고 싶습니다.",
        motivation: "식품영양 분야의 진로와 자격증에 대해 알고 싶습니다.",
        questionForYoon: "식품영양학과의 진로 범위가 어디까지인지 궁금합니다.",
        status: 'Pending',
        date: "2026-03-09"
    },
    {
        id: 24,
        name: "차승재",
        school: "홍천고등학교",
        phone: "010-1111-2222",
        email: "seungjae.c@email.com",
        careerReason: "법률가 - 정의로운 사회를 만드는 데 기여하고 싶습니다.",
        motivation: "법학 분야의 다양한 진로와 로스쿨 준비에 대해 알고 싶습니다.",
        questionForYoon: "법학과와 로스쿨 진학, 어떤 준비를 해야 하나요?",
        status: 'Pending',
        date: "2026-03-09"
    },
    {
        id: 25,
        name: "고은서",
        school: "홍천여자고등학교",
        phone: "010-2222-3333",
        email: "eunseo.go@email.com",
        careerReason: "작곡가 - 음악으로 사람들의 마음을 치유하고 싶습니다.",
        motivation: "예체능 분야의 현실적인 진로와 생존 전략이 궁금합니다.",
        questionForYoon: "음악 전공자의 실제 경력 경로가 어떻게 되나요?",
        status: 'Waitlist',
        date: "2026-03-09"
    },
    {
        id: 26,
        name: "하준혁",
        school: "양덕중고등학교",
        phone: "010-3333-4444",
        email: "junhyuk.h@email.com",
        careerReason: "스포츠 과학자 - 운동 선수들의 퍼포먼스를 과학적으로 향상시키고 싶습니다.",
        motivation: "체육과 과학의 융합 분야에 대해 알고 싶습니다.",
        questionForYoon: "스포츠과학과와 체육교육과의 차이점이 궁금합니다.",
        status: 'Pending',
        date: "2026-03-10"
    },
    {
        id: 27,
        name: "양수아",
        school: "홍천여자고등학교",
        phone: "010-4444-5555",
        email: "sua.y@email.com",
        careerReason: "통역사 - 언어로 문화의 다리를 놓는 사람이 되고 싶습니다.",
        motivation: "글로벌 인재가 되기 위한 준비가 무엇인지 듣고 싶습니다.",
        questionForYoon: "통번역학과의 입시에서 어학 실력은 어느 수준이어야 하나요?",
        status: 'Pending',
        date: "2026-03-10"
    },
    {
        id: 28,
        name: "민재원",
        school: "홍천고등학교",
        phone: "010-5555-6666",
        email: "jaewon.m@email.com",
        careerReason: "도시계획가 - 사람들이 더 살기 좋은 도시를 만들고 싶습니다.",
        motivation: "건축과 도시 분야의 실제 이야기를 듣고 영감을 얻고 싶습니다.",
        questionForYoon: "도시공학과와 건축학과의 진로 차이가 궁금합니다.",
        status: 'Pending',
        date: "2026-03-10"
    },
    {
        id: 29,
        name: "주하영",
        school: "홍천여자고등학교",
        phone: "010-6666-7777",
        email: "hayoung.j@email.com",
        careerReason: "제약연구원 - 새로운 약을 개발하여 환자들에게 희망을 주고 싶습니다.",
        motivation: "바이오/제약 업계의 최신 동향과 진로 경로를 알고 싶습니다.",
        questionForYoon: "생명화학 분야에서 석사/박사가 필수인가요?",
        status: 'Selected',
        date: "2026-03-10"
    },
    {
        id: 30,
        name: "피세진",
        school: "홍천고등학교",
        phone: "010-7777-8888",
        email: "sejin.p@email.com",
        careerReason: "게임 개발자 - 사람들에게 즐거움을 주는 게임을 만들고 싶습니다.",
        motivation: "IT/소프트웨어 분야의 다양한 직업군을 탐색하고 싶습니다.",
        questionForYoon: "게임 개발을 위해 컴퓨터공학과 외에 추천 전공이 있나요?",
        status: 'Pending',
        date: "2026-03-10"
    },
    {
        id: 31,
        name: "탁민지",
        school: "홍천여자고등학교",
        phone: "010-8888-9999",
        email: "minji.t@email.com",
        careerReason: "임상심리사 - 사람들의 마음 건강을 전문적으로 돌보고 싶습니다.",
        motivation: "심리학과 의학의 경계에서 할 수 있는 일을 알고 싶습니다.",
        questionForYoon: "임상심리 전공을 위한 대학/대학원 로드맵이 궁금합니다.",
        status: 'Pending',
        date: "2026-03-10"
    },
    {
        id: 32,
        name: "공시후",
        school: "양덕중고등학교",
        phone: "010-1212-3434",
        email: "sihoo.g@email.com",
        careerReason: "토목공학자 - 사회 인프라를 설계하고 건설하는 일에 관심이 있습니다.",
        motivation: "공학의 다양한 분야를 비교하고 자신에게 맞는 길을 찾고 싶습니다.",
        questionForYoon: "토목공학과 졸업 후 공기업 취업이 잘 되나요?",
        status: 'Pending',
        date: "2026-03-11"
    },
    {
        id: 33,
        name: "성예나",
        school: "홍천여자고등학교",
        phone: "010-3434-5656",
        email: "yena.s@email.com",
        careerReason: "패션디자이너 - 옷으로 사람들의 개성과 아름다움을 표현하고 싶습니다.",
        motivation: "예술과 산업의 교차점에서 일하는 전문가를 만나고 싶습니다.",
        questionForYoon: "패션디자인 전공 시 포트폴리오 준비는 어떻게 하나요?",
        status: 'Pending',
        date: "2026-03-11"
    },
    {
        id: 34,
        name: "엄태준",
        school: "홍천고등학교",
        phone: "010-5656-7878",
        email: "taejun.e@email.com",
        careerReason: "경영 컨설턴트 - 기업의 문제를 해결하고 성장을 돕는 일이 하고 싶습니다.",
        motivation: "경영/경제 분야의 실무 경험을 간접적으로라도 체험하고 싶습니다.",
        questionForYoon: "경영학과 졸업 후 컨설팅 업계 진출은 어렵나요?",
        status: 'Pending',
        date: "2026-03-11"
    },
    {
        id: 35,
        name: "우서영",
        school: "홍천여자고등학교",
        phone: "010-7878-9090",
        email: "seoyoung.w@email.com",
        careerReason: "물리치료사 - 재활을 통해 환자들의 일상 복귀를 돕고 싶습니다.",
        motivation: "보건 분야의 다양한 직업을 비교해보고 결정하고 싶습니다.",
        questionForYoon: "물리치료학과의 입시 경쟁률과 취업률이 궁금합니다.",
        status: 'Waitlist',
        date: "2026-03-11"
    },
    {
        id: 36,
        name: "봉현서",
        school: "홍천고등학교",
        phone: "010-1313-2424",
        email: "hyunseo.b@email.com",
        careerReason: "드론 엔지니어 - 드론 기술로 물류와 농업을 혁신하고 싶습니다.",
        motivation: "첨단 기술 분야의 전망과 준비 방법을 알고 싶습니다.",
        questionForYoon: "드론/무인항공 관련 학과가 있는 대학이 궁금합니다.",
        status: 'Pending',
        date: "2026-03-11"
    },
    {
        id: 37,
        name: "표지아",
        school: "홍천여자고등학교",
        phone: "010-2424-3535",
        email: "jia.p@email.com",
        careerReason: "출판 편집자 - 좋은 책을 세상에 내놓는 일을 하고 싶습니다.",
        motivation: "문과 분야의 실제 직업과 진로에 대해 더 알고 싶습니다.",
        questionForYoon: "국문학과의 진로 범위와 취업 현실이 궁금합니다.",
        status: 'Pending',
        date: "2026-03-11"
    },
    {
        id: 38,
        name: "도승원",
        school: "양덕중고등학교",
        phone: "010-3535-4646",
        email: "seungwon.d@email.com",
        careerReason: "해양생물학자 - 바다 생태계를 연구하고 보전하고 싶습니다.",
        motivation: "자연과학 분야의 다양한 연구 주제를 알고 싶습니다.",
        questionForYoon: "해양학과 진학을 위한 생기부 활동 추천이 궁금합니다.",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 39,
        name: "편소율",
        school: "홍천여자고등학교",
        phone: "010-4646-5757",
        email: "soyul.py@email.com",
        careerReason: "치과위생사 - 사람들의 구강 건강을 전문적으로 관리하고 싶습니다.",
        motivation: "보건 분야의 안정적인 직업에 대해 알고 싶습니다.",
        questionForYoon: "치위생학과의 취업 현황과 미래 전망이 궁금합니다.",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 40,
        name: "길준서",
        school: "홍천고등학교",
        phone: "010-5757-6868",
        email: "junseo.g@email.com",
        careerReason: "사이버보안 전문가 - 디지털 세상을 안전하게 지키는 일을 하고 싶습니다.",
        motivation: "IT 보안 분야의 현직자에게 실무 이야기를 듣고 싶습니다.",
        questionForYoon: "정보보안학과와 컴퓨터공학과 중 어디가 보안 분야에 유리한가요?",
        status: 'Selected',
        date: "2026-03-12"
    },
    {
        id: 41,
        name: "나윤아",
        school: "홍천여자고등학교",
        phone: "010-6868-7979",
        email: "yuna.n@email.com",
        careerReason: "유아교육 교사 - 아이들의 성장과 발달을 도와주고 싶습니다.",
        motivation: "교육 분야의 보람과 어려움을 현직 교사에게 듣고 싶습니다.",
        questionForYoon: "유아교육과의 커리큘럼과 실습은 어떤가요?",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 42,
        name: "진우성",
        school: "홍천고등학교",
        phone: "010-7979-8080",
        email: "woosung.ji@email.com",
        careerReason: "식품공학자 - 안전하고 건강한 식품을 개발하고 싶습니다.",
        motivation: "식품과학의 실제 연구 분야와 산업 전망을 알고 싶습니다.",
        questionForYoon: "식품공학과와 식품영양학과의 차이가 궁금합니다.",
        status: 'Pending',
        date: "2026-03-12"
    },
    {
        id: 43,
        name: "빈예원",
        school: "홍천여자고등학교",
        phone: "010-8080-9191",
        email: "yewon.b@email.com",
        careerReason: "미술치료사 - 예술로 사람들의 마음을 치유하고 싶습니다.",
        motivation: "예술과 심리학의 융합 분야에 관심이 있어 탐색하고 싶습니다.",
        questionForYoon: "미술치료를 전공하려면 어떤 학과에 가야 하나요?",
        status: 'Pending',
        date: "2026-03-13"
    },
    {
        id: 44,
        name: "석한결",
        school: "양덕중고등학교",
        phone: "010-9191-0202",
        email: "hangyul.s@email.com",
        careerReason: "농업생명과학자 - 첨단 기술로 농업을 혁신하고 싶습니다.",
        motivation: "홍천 지역에서 농업 관련 진로의 가능성을 알고 싶습니다.",
        questionForYoon: "농업생명과학대학의 진로와 취업 전망이 궁금합니다.",
        status: 'Pending',
        date: "2026-03-13"
    },
    {
        id: 45,
        name: "채서하",
        school: "홍천여자고등학교",
        phone: "010-0202-1313",
        email: "seoha.ch@email.com",
        careerReason: "광고기획자 - 창의적 아이디어로 브랜드의 가치를 높이고 싶습니다.",
        motivation: "마케팅과 광고 분야의 실무를 간접 체험하고 싶습니다.",
        questionForYoon: "광고홍보학과의 입시 준비와 진로가 궁금합니다.",
        status: 'Selected',
        date: "2026-03-13"
    },
    {
        id: 46,
        name: "마경민",
        school: "홍천고등학교",
        phone: "010-1414-2525",
        email: "kyungmin.m@email.com",
        careerReason: "천문학자 - 우주의 신비를 밝히는 연구가 되고 싶습니다.",
        motivation: "과학 분야의 다양한 진로를 탐색하고 영감을 얻고 싶습니다.",
        questionForYoon: "천문학과가 있는 대학이 적은데 어떤 준비를 해야 하나요?",
        status: 'Pending',
        date: "2026-03-13"
    },
    {
        id: 47,
        name: "방시윤",
        school: "홍천여자고등학교",
        phone: "010-2525-3636",
        email: "siyun.ba@email.com",
        careerReason: "응급구조사 - 생명을 구하는 최전선에서 일하고 싶습니다.",
        motivation: "생명을 다루는 직업의 현실과 보람을 알고 싶습니다.",
        questionForYoon: "응급구조학과의 체력 기준과 취업 현황이 궁금합니다.",
        status: 'Pending',
        date: "2026-03-13"
    },
    {
        id: 48,
        name: "윤기범",
        school: "홍천고등학교",
        phone: "010-3636-4747",
        email: "kibum.yu@email.com",
        careerReason: "신재생에너지 엔지니어 - 태양광과 풍력으로 깨끗한 에너지를 만들고 싶습니다.",
        motivation: "에너지 분야의 미래와 취업 전망에 대해 알고 싶습니다.",
        questionForYoon: "에너지공학과 진학을 위한 생기부 방향이 궁금합니다.",
        status: 'Pending',
        date: "2026-03-14"
    },
    {
        id: 49,
        name: "태소정",
        school: "홍천여자고등학교",
        phone: "010-4747-5858",
        email: "sojeong.t@email.com",
        careerReason: "호텔경영인 - 세계적인 호텔에서 최고의 서비스를 제공하고 싶습니다.",
        motivation: "관광/호텔 산업의 미래와 필요한 역량을 알고 싶습니다.",
        questionForYoon: "호텔경영학과와 관광경영학과의 차이가 궁금합니다.",
        status: 'Pending',
        date: "2026-03-14"
    },
    {
        id: 50,
        name: "복한솔",
        school: "양덕중고등학교",
        phone: "010-5858-6969",
        email: "hansol.b@email.com",
        careerReason: "산림과학자 - 숲과 자연을 연구하고 보전하는 일을 하고 싶습니다.",
        motivation: "홍천의 자연 환경과 연결된 진로를 탐색하고 싶습니다.",
        questionForYoon: "산림과학과 졸업 후 진로가 어떤 것들이 있나요?",
        status: 'Pending',
        date: "2026-03-14"
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

