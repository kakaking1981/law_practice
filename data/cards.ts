import { LawCard, Category, Subcategory } from '@/types';

export const categories: Category[] = [
  { id: 'civil', name: '民法', icon: 'scale', color: 'bg-blue-500', count: 5, readCount: 2 },
  { id: 'criminal', name: '刑法', icon: 'shield', color: 'bg-red-500', count: 4, readCount: 1 },
  { id: 'criminal-procedure', name: '刑诉法', icon: 'file-text', color: 'bg-purple-500', count: 3, readCount: 0 },
  { id: 'admin', name: '行政法', icon: 'building', color: 'bg-yellow-500', count: 4, readCount: 3 },
  { id: 'economic', name: '经济法', icon: 'trending-up', color: 'bg-green-500', count: 3, readCount: 1 },
  { id: 'triple-i', name: '三国法', icon: 'globe', color: 'bg-indigo-500', count: 4, readCount: 0 },
];

export const subcategories: Subcategory[] = [
  { id: 'civil-rights', name: '权利主体', categoryId: 'civil', count: 2 },
  { id: 'civil-acts', name: '法律行为', categoryId: 'civil', count: 2 },
  { id: 'civil-property', name: '物权', categoryId: 'civil', count: 1 },
  { id: 'criminal-general', name: '刑法总论', categoryId: 'criminal', count: 2 },
  { id: 'criminal-special', name: '刑法分则', categoryId: 'criminal', count: 2 },
  { id: 'criminal-procedure-general', name: '总则', categoryId: 'criminal-procedure', count: 1 },
  { id: 'criminal-procedure-special', name: '分则', categoryId: 'criminal-procedure', count: 2 },
];

export const dummyCards: LawCard[] = [
  {
    id: '1',
    title: '物权变动的公示原则',
    content: '甲将其房屋出售给乙，双方签订了买卖合同，但未办理过户登记。后甲又将该房屋出售给丙，并办理了过户登记。乙得知后，向法院起诉要求确认房屋归其所有。',
    analysis: [
      '物权变动的公示原则要求不动产所有权转移必须办理登记',
      '甲乙之间的买卖合同有效，但未登记不发生物权变动效力',
      '甲丙之间办理了登记，丙取得房屋所有权',
      '乙只能依据合同向甲主张违约责任',
      '登记是不动产物权变动的生效要件'
    ],
    tags: ['物权', '公示', '登记'],
    category: 'civil',
    subcategory: 'civil-property',
    chapter: '物权法 - 物权变动',
    createdAt: '2024-01-15',
    readCount: 3,
    lastReadAt: '2024-01-20',
    masteryLevel: 4,
    isRead: true
  },
  {
    id: '2',
    title: '善意取得制度',
    content: '甲将其收藏的一幅名画借给乙观赏，乙擅自将该画以市场价卖给不知情的丙，丙已支付价款并取得该画。甲发现后要求丙返还。',
    analysis: [
      '善意取得需满足：处分人无权处分、受让人善意、支付合理对价、完成公示',
      '乙系无权处分，但丙符合善意取得要件',
      '丙取得名画所有权，甲无权要求返还',
      '甲可向乙主张侵权或违约责任',
      '善意取得制度保护交易安全'
    ],
    tags: ['物权', '善意取得', '无权处分'],
    category: 'civil',
    subcategory: 'civil-property',
    chapter: '物权法 - 所有权',
    createdAt: '2024-01-16',
    readCount: 2,
    lastReadAt: '2024-01-19',
    masteryLevel: 3,
    isRead: true
  },
  {
    id: '3',
    title: '抵押权的设立',
    content: '甲向银行借款100万元，以其房屋作为抵押担保，但未办理抵押登记。借款到期后甲无力偿还，银行主张行使抵押权。',
    analysis: [
      '不动产抵押需办理登记才设立',
      '未登记的抵押权不生效',
      '银行无法行使抵押权',
      '抵押合同有效，银行可主张违约责任',
      '登记是不动产抵押的生效要件'
    ],
    tags: ['物权', '抵押', '担保'],
    category: 'civil',
    subcategory: '待定',
    chapter: '物权法 - 担保物权',
    createdAt: '2024-01-17',
    readCount: 1,
    lastReadAt: null,
    masteryLevel: 0,
    isRead: false
  },
  {
    id: '4',
    title: '合同的效力',
    content: '甲（15周岁）与乙签订了一份价值5万元的电脑买卖合同，甲的父母事后拒绝追认。乙要求甲履行合同。',
    analysis: [
      '限制民事行为能力人订立的合同效力待定',
      '法定代理人拒绝追认，合同无效',
      '乙无权要求甲履行合同',
      '甲需返还电脑或价款',
      '合同无效不影响争议解决条款的效力'
    ],
    tags: ['合同', '效力', '民事行为能力'],
    category: 'civil',
    subcategory: 'civil-acts',
    chapter: '合同法 - 合同效力',
    createdAt: '2024-01-18',
    readCount: 0,
    lastReadAt: null,
    masteryLevel: 0,
    isRead: false
  },
  {
    id: '5',
    title: '违约责任',
    content: '甲与乙签订货物买卖合同，约定甲于2024年1月10日前交货。甲因生产设备故障未能按时交货，导致乙损失2万元。',
    analysis: [
      '甲未按时交货构成违约',
      '违约责任的归责原则是严格责任',
      '乙可要求甲赔偿损失',
      '损失赔偿范围包括直接损失和可得利益',
      '双方可约定违约金或定金'
    ],
    tags: ['合同', '违约', '损害赔偿'],
    category: 'civil',
    subcategory: 'civil-acts',
    chapter: '合同法 - 违约责任',
    createdAt: '2024-01-19',
    readCount: 0,
    lastReadAt: null,
    masteryLevel: 0,
    isRead: false
  },
  {
    id: '6',
    title: '犯罪构成要件',
    content: '甲持刀抢劫乙的财物，在抢劫过程中致乙重伤。',
    analysis: [
      '抢劫罪的构成要件：主体、主观、客体、客观',
      '甲的行为构成抢劫罪',
      '抢劫致人重伤属于结果加重犯',
      '法定刑升格，处十年以上有期徒刑',
      '不另定故意伤害罪'
    ],
    tags: ['刑法', '抢劫罪', '结果加重犯'],
    category: 'criminal',
    subcategory: 'criminal-special',
    chapter: '刑法分则 - 侵犯财产罪',
    createdAt: '2024-01-20',
    readCount: 2,
    lastReadAt: '2024-01-22',
    masteryLevel: 4,
    isRead: true
  },
  {
    id: '7',
    title: '正当防卫',
    content: '甲遭乙持刀追杀，在逃跑过程中捡起石块砸伤乙的头部，致乙重伤。',
    analysis: [
      '正当防卫需满足：存在不法侵害、正在进行、针对不法侵害人、限度适当',
      '甲的行为构成正当防卫',
      '面对严重暴力犯罪，防卫限度可适当放宽',
      '甲无需承担刑事责任',
      '正当防卫是法定免责事由'
    ],
    tags: ['刑法', '正当防卫', '违法阻却'],
    category: 'criminal',
    subcategory: 'criminal-general',
    chapter: '刑法总论 - 正当行为',
    createdAt: '2024-01-21',
    readCount: 1,
    lastReadAt: null,
    masteryLevel: 0,
    isRead: false
  },
  {
    id: '8',
    title: '共同犯罪',
    content: '甲、乙共谋盗窃，甲负责望风，乙负责入户盗窃，窃得财物价值5万元。',
    analysis: [
      '共同犯罪需具备共同故意和共同行为',
      '甲、乙构成盗窃罪的共犯',
      '甲系从犯，可从轻、减轻处罚',
      '乙系主犯，按全部罪行处罚',
      '共同犯罪人对共同犯罪结果承担连带责任'
    ],
    tags: ['刑法', '共同犯罪', '主从犯'],
    category: 'criminal',
    subcategory: 'criminal-general',
    chapter: '刑法总论 - 共同犯罪',
    createdAt: '2024-01-22',
    readCount: 0,
    lastReadAt: null,
    masteryLevel: 0,
    isRead: false
  },
  {
    id: '9',
    title: '累犯',
    content: '甲因盗窃罪被判处有期徒刑3年，刑满释放后第2年又犯抢劫罪。',
    analysis: [
      '累犯构成要件：前罪有期徒刑以上、执行完毕5年内、后罪有期徒刑以上',
      '甲构成一般累犯',
      '累犯应从重处罚',
      '累犯不适用缓刑和假释',
      '特殊累犯不受时间限制'
    ],
    tags: ['刑法', '累犯', '量刑'],
    category: 'criminal',
    subcategory: 'criminal-general',
    chapter: '刑法总论 - 刑罚裁量',
    createdAt: '2024-01-23',
    readCount: 0,
    lastReadAt: null,
    masteryLevel: 0,
    isRead: false
  },
  {
    id: '10',
    title: '取保候审',
    content: '甲涉嫌诈骗罪被公安机关立案侦查，甲提出取保候审申请。',
    analysis: [
      '取保候审适用于可能判处管制、拘役或独立适用附加刑的情形',
      '需提供保证人或交纳保证金',
      '取保候审由公安机关执行',
      '被取保候审人需遵守相关规定',
      '违反规定可能被取消取保候审'
    ],
    tags: ['刑诉', '强制措施', '取保候审'],
    category: 'criminal-procedure',
    subcategory: 'criminal-procedure-general',
    chapter: '刑事诉讼法 - 强制措施',
    createdAt: '2024-01-24',
    readCount: 0,
    lastReadAt: null,
    masteryLevel: 0,
    isRead: false
  },
  {
    id: '11',
    title: '不起诉决定',
    content: '检察机关审查起诉后，认为犯罪嫌疑人甲的行为情节轻微，依照刑法规定不需要判处刑罚。',
    analysis: [
      '不起诉包括法定不起诉、酌定不起诉、证据不足不起诉',
      '本案属于酌定不起诉',
      '不起诉决定需公开宣布',
      '被不起诉人可申诉',
      '被害人可向上一级检察院申诉或直接起诉'
    ],
    tags: ['刑诉', '不起诉', '审查起诉'],
    category: 'criminal-procedure',
    subcategory: 'criminal-procedure-special',
    chapter: '刑事诉讼法 - 审查起诉',
    createdAt: '2024-01-25',
    readCount: 0,
    lastReadAt: null,
    masteryLevel: 0,
    isRead: false
  },
  {
    id: '12',
    title: '二审程序',
    content: '被告人甲对一审判决不服，向上一级法院提起上诉。',
    analysis: [
      '上诉期限：判决10日，裁定5日',
      '二审法院应当开庭审理',
      '二审可以维持、改判或发回重审',
      '上诉不加刑原则',
      '二审判决为终审判决'
    ],
    tags: ['刑诉', '二审', '上诉'],
    category: 'criminal-procedure',
    subcategory: 'criminal-procedure-special',
    chapter: '刑事诉讼法 - 第二审程序',
    createdAt: '2024-01-26',
    readCount: 0,
    lastReadAt: null,
    masteryLevel: 0,
    isRead: false
  },
  {
    id: '13',
    title: '行政许可',
    content: '甲向市工商局申请营业执照，工商局逾期未作出决定。',
    analysis: [
      '行政许可需遵循法定程序',
      '申请材料齐全的应当受理',
      '逾期未决定视为准予许可',
      '申请人可申请行政复议或提起行政诉讼',
      '行政许可不得擅自转让'
    ],
    tags: ['行政', '许可', '程序'],
    category: 'admin',
    subcategory: '待定',
    chapter: '行政法 - 行政许可',
    createdAt: '2024-01-27',
    readCount: 3,
    lastReadAt: '2024-01-30',
    masteryLevel: 5,
    isRead: true
  },
  {
    id: '14',
    title: '行政处罚',
    content: '甲因违法经营被工商局罚款5万元，甲不服提起行政诉讼。',
    analysis: [
      '行政处罚需遵循法定程序',
      '告知当事人权利',
      '听取当事人陈述和申辩',
      '重大处罚需听证',
      '罚款金额需符合法定幅度'
    ],
    tags: ['行政', '处罚', '程序'],
    category: 'admin',
    subcategory: '待定',
    chapter: '行政法 - 行政处罚',
    createdAt: '2024-01-28',
    readCount: 2,
    lastReadAt: '2024-01-29',
    masteryLevel: 4,
    isRead: true
  },
  {
    id: '15',
    title: '行政复议',
    content: '甲对区政府的行政决定不服，向市政府申请行政复议。',
    analysis: [
      '行政复议申请期限为60日',
      '复议机关为上级主管部门或同级政府',
      '复议期间原行政行为不停止执行',
      '复议可以作出维持、撤销、变更决定',
      '对复议决定不服可提起行政诉讼'
    ],
    tags: ['行政', '复议', '救济'],
    category: 'admin',
    subcategory: '待定',
    chapter: '行政法 - 行政复议',
    createdAt: '2024-01-29',
    readCount: 2,
    lastReadAt: '2024-01-31',
    masteryLevel: 4,
    isRead: true
  },
  {
    id: '16',
    title: '政府信息公开',
    content: '甲向市发改委申请公开某项政府信息，发改委以涉及商业秘密为由拒绝公开。',
    analysis: [
      '政府信息以公开为原则，不公开为例外',
      '涉及国家秘密、商业秘密、个人隐私的可不公开',
      '申请人可申请复议或诉讼',
      '公开方式包括主动公开和依申请公开',
      '需在法定期限内答复'
    ],
    tags: ['行政', '信息公开', '公民权利'],
    category: 'admin',
    subcategory: '待定',
    chapter: '行政法 - 政府信息公开',
    createdAt: '2024-01-30',
    readCount: 0,
    lastReadAt: null,
    masteryLevel: 0,
    isRead: false
  },
  {
    id: '17',
    title: '消费者权益保护',
    content: '甲在商场购买了一台电视机，使用3天后出现故障，商场拒绝退换。',
    analysis: [
      '消费者享有七天无理由退货权',
      '商品质量问题商家需承担三包责任',
      '可向消费者协会投诉',
      '可向市场监管部门举报',
      '可提起诉讼要求赔偿'
    ],
    tags: ['经济法', '消费者', '维权'],
    category: 'economic',
    subcategory: '待定',
    chapter: '消费者权益保护法',
    createdAt: '2024-02-01',
    readCount: 1,
    lastReadAt: null,
    masteryLevel: 0,
    isRead: false
  },
  {
    id: '18',
    title: '不正当竞争',
    content: '甲公司在广告中声称其产品优于乙公司的同类产品，经查不实。',
    analysis: [
      '虚假宣传构成不正当竞争',
      '违反诚实信用原则',
      '监督检查部门可责令停止违法行为',
      '可处以罚款',
      '受害人可要求赔偿'
    ],
    tags: ['经济法', '竞争', '广告'],
    category: 'economic',
    subcategory: '待定',
    chapter: '反不正当竞争法',
    createdAt: '2024-02-02',
    readCount: 0,
    lastReadAt: null,
    masteryLevel: 0,
    isRead: false
  },
  {
    id: '19',
    title: '劳动合同',
    content: '甲公司与乙签订劳动合同，约定试用期6个月，但未约定试用期工资。',
    analysis: [
      '试用期工资不得低于同岗位最低工资或约定工资的80%',
      '试用期期限与劳动合同期限挂钩',
      '同一用人单位同一劳动者只能约定一次试用期',
      '试用期包含在劳动合同期限内',
      '试用期内用人单位可解除劳动合同的情形'
    ],
    tags: ['经济法', '劳动合同', '劳动'],
    category: 'economic',
    subcategory: '待定',
    chapter: '劳动合同法',
    createdAt: '2024-02-03',
    readCount: 0,
    lastReadAt: null,
    masteryLevel: 0,
    isRead: false
  },
  {
    id: '20',
    title: '国际私法冲突规范',
    content: '甲国公民与乙国公民在中国结婚，后因离婚诉至中国法院。',
    analysis: [
      '结婚适用婚姻缔结地法律',
      '离婚适用法院地法律',
      '涉外民事关系适用法律需根据冲突规范确定',
      '中国法院有管辖权',
      '公共秩序保留原则'
    ],
    tags: ['三国法', '国际私法', '冲突规范'],
    category: 'triple-i',
    subcategory: '待定',
    chapter: '国际私法 - 婚姻家庭',
    createdAt: '2024-02-04',
    readCount: 0,
    lastReadAt: null,
    masteryLevel: 0,
    isRead: false
  },
  {
    id: '21',
    title: '国际公法国家主权',
    content: '甲国军舰未经乙国同意进入乙国领海。',
    analysis: [
      '国家对其领土享有主权',
      '领海属于国家领土的一部分',
      '外国军舰进入领海需经沿海国同意',
      '甲国行为违反国际法',
      '乙国可采取必要措施'
    ],
    tags: ['三国法', '国际公法', '主权'],
    category: 'triple-i',
    subcategory: '待定',
    chapter: '国际公法 - 国家领土',
    createdAt: '2024-02-05',
    readCount: 0,
    lastReadAt: null,
    masteryLevel: 0,
    isRead: false
  },
  {
    id: '22',
    title: '国际贸易术语',
    content: '中国公司与美国公司签订货物买卖合同，约定采用FOB上海术语。',
    analysis: [
      'FOB即船上交货',
      '风险在货物越过船舷时转移',
      '卖方负责办理出口清关',
      '买方负责安排运输和保险',
      '交货地点为装运港'
    ],
    tags: ['三国法', '国际经济法', '贸易术语'],
    category: 'triple-i',
    subcategory: '待定',
    chapter: '国际经济法 - 国际贸易',
    createdAt: '2024-02-06',
    readCount: 0,
    lastReadAt: null,
    masteryLevel: 0,
    isRead: false
  },
  {
    id: '23',
    title: 'WTO规则',
    content: '甲国对乙国进口商品征收反倾销税。',
    analysis: [
      '反倾销税需符合WTO反倾销协定',
      '需证明存在倾销、损害及因果关系',
      '反倾销税金额不得超过倾销幅度',
      '可通过WTO争端解决机制解决',
      '反倾销措施需遵循正当程序'
    ],
    tags: ['三国法', '国际经济法', 'WTO'],
    category: 'triple-i',
    subcategory: '待定',
    chapter: '国际经济法 - WTO',
    createdAt: '2024-02-07',
    readCount: 0,
    lastReadAt: null,
    masteryLevel: 0,
    isRead: false
  }
];
