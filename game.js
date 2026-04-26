const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const muteButton = document.getElementById("muteButton");
const bgmToggleButton = document.getElementById("bgmToggleButton");
const bgmVolumeSlider = document.getElementById("bgmVolumeSlider");
const bgmVolumeValue = document.getElementById("bgmVolumeValue");
const multiplayerRoomInput = document.getElementById("multiplayerRoomInput");
const multiplayerToggleButton = document.getElementById("multiplayerToggleButton");
const multiplayerStatus = document.getElementById("multiplayerStatus");
const difficultySelect = document.getElementById("difficultySelect");
const screenModeSelect = document.getElementById("screenModeSelect");
const controlModeSelect = document.getElementById("controlModeSelect");
const stageSelect = document.getElementById("stageSelect");
const languageSelect = document.getElementById("languageSelect");
const stageLockText = document.getElementById("stageLockText");
const playButton = document.getElementById("playButton");
const lobbyButton = document.getElementById("lobbyButton");
const lobbyOverlay = document.getElementById("lobbyOverlay");
const authPanel = document.getElementById("authPanel");
const lobbyPanel = document.getElementById("lobbyPanel");
const loginNicknameInput = document.getElementById("loginNickname");
const loginPasswordInput = document.getElementById("loginPassword");
const signupNicknameInput = document.getElementById("signupNickname");
const signupPasswordInput = document.getElementById("signupPassword");
const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");
const logoutButton = document.getElementById("logoutButton");
const authMessage = document.getElementById("authMessage");
const accountSummary = document.getElementById("accountSummary");
const accountTitleBadge = document.getElementById("accountTitleBadge");
const openPatchNotesButton = document.getElementById("openPatchNotesButton");
const patchNotesPanel = document.getElementById("patchNotesPanel");
const closePatchNotesButton = document.getElementById("closePatchNotesButton");
const patchNotesList = document.getElementById("patchNotesList");
const betaRewardPanel = document.getElementById("betaRewardPanel");
const betaRewardStatus = document.getElementById("betaRewardStatus");
const betaRewardCharacterList = document.getElementById("betaRewardCharacterList");
const betaRewardSkinList = document.getElementById("betaRewardSkinList");
const claimBetaRewardButton = document.getElementById("claimBetaRewardButton");
const openShopButton = document.getElementById("openShopButton");
const shopStatus = document.getElementById("shopStatus");
const coinBalance = document.getElementById("coinBalance");
const shopSeasonBadge = document.getElementById("shopSeasonBadge");
const shopPanel = document.getElementById("shopPanel");
const shopCatalogList = document.getElementById("shopCatalogList");
const shopTabCharacters = document.getElementById("shopTabCharacters");
let shopTabSkins = document.getElementById("shopTabSkins");
const shopTabBoxes = document.getElementById("shopTabBoxes");
const characterCollection = document.getElementById("characterCollection");
const skinCollection = document.getElementById("skinCollection");
const equippedCharacterBadge = document.getElementById("equippedCharacterBadge");
const equippedSkinBadge = document.getElementById("equippedSkinBadge");
const lootboxPanel = document.getElementById("lootboxPanel");
const lootboxStage = document.getElementById("lootboxStage");
const lootboxBox = document.getElementById("lootboxBox");
const lootboxStageText = document.getElementById("lootboxStageText");
const lootboxResults = document.getElementById("lootboxResults");
const closeLootboxButton = document.getElementById("closeLootboxButton");
const lootboxSummary = document.getElementById("lootboxSummary");
const lootboxResultGrid = document.getElementById("lootboxResultGrid");
const metaDescription = document.getElementById("metaDescription");

shopTabSkins?.remove();
shopTabSkins = null;

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;
const TILE = 32;
const FLOOR_Y = 15 * TILE;
const GRAVITY = 2000;
const SERPENT_POOL_SURFACE_OFFSET = 18;
const SERPENT_POOL_BOTTOM_MARGIN = 2;
const PLAYER_STAND_H = 30;
const PLAYER_CROUCH_H = 20;
const ACCOUNT_KEY = "starling-sprint-accounts-v1";
const CURRENT_ACCOUNT_KEY = "starling-sprint-current-account-v1";
const LANGUAGE_KEY = "starling-sprint-language-v1";
const BGM_SETTINGS_KEY = "starling-sprint-bgm-settings-v1";
const MULTIPLAYER_CLIENT_KEY = "starling-sprint-multiplayer-client-v1";
const MULTIPLAYER_ROOM_KEY = "starling-sprint-multiplayer-room-v1";
const BETA_REWARDS_ACTIVE = true;
const STARLING_JUMP_MULTIPLIER = 1.12;
const MAX_MONSTER_SPAWNS = 14;
const PATCH_NOTES = [
  {
    version: "Beta v0.8",
    date: "2026-04-26",
    items: [
      "신규 스킨 오버기어: 프로토타입 B-08 추가",
      "오버기어 B-08 전용 녹슨 브론즈 기계 팔레트와 하늘색 전기 이펙트 적용",
      "전기 이펙트가 6~8초마다 짧게 꺼졌다 켜지고, 각성 중에는 강하게 유지되도록 조정",
      "상점 스킨 탭 제거 및 상자/보유 스킨 흐름 유지",
      "모든 난이도 기본 점프 횟수를 트리플 점프로 통일하고 점프 높이 상향",
      "인게임 평화로운 배경음악 추가",
      "BGM ON/OFF와 볼륨 설정 추가 및 저장 지원",
      "라이트너 E 번개장 기절 시간을 5초로 조정하고 기절 중인 적의 접촉 피해 제거",
      "라이트너 E 번개장 기절 종료 후 적이 다시 움직이도록 수정",
    ],
  },
  {
    version: "Beta v0.7",
    date: "2026-04-25",
    items: [
      "신규 캐릭터 라이트너 추가: 스파크 앵커, 체인 라이트닝 필드, 각성 스킬 구현",
      "모바일 조작에 X 스킬 버튼 추가",
      "모든 캐릭터 픽셀 스프라이트 디테일과 식별성을 개선",
      "라이트너 이미지 에셋 렌더링을 제거하고 기존 코드 스프라이트로 복구",
      "라이트너 픽셀 스프라이트가 보유 스킨 팔레트와 특수 스킨 효과를 반영하도록 수정",
      "4스테이지 하드 댄스머신 시스템 제거: 하드 모드는 기존 하드 이벤트 흐름으로 복귀",
      "8스테이지 정글 추가: 바나나 수집/운반, 원숭이 제출, 화남 예고 공격 시스템 구현",
      "원숭이 정글에서는 모든 난이도에서 펜타 점프가 가능하도록 변경",
      "신규 캐릭터 와일드헌터 추가: 사냥 본능, 헌트 블래스트, 내려찍기, 짐승화 구현",
      "몬스터 최대 소환 수를 14마리로 제한하고 와일드헌터 짐승화 조건을 5킬로 완화",
    ],
  },
  {
    version: "Beta v0.6",
    date: "2026-04-25",
    items: [
      "모바일 터치 조작 버튼 추가: 이동, 점프, 웅크리기, 스킬, 재시작 지원",
      "모바일 방향 버튼을 드래그형 조이스틱 조작으로 변경",
      "모바일 조이스틱 감지와 터치 이벤트 호환성 개선",
      "로비에서 컴퓨터 버전과 모바일 버전을 직접 선택하는 설정 추가",
      "모바일 Q 버튼으로 어쌔신 연타 QTE를 진행할 수 있도록 수정",
      "모바일 조이스틱 시각 요소를 숨기고 화면 드래그 방향으로 조작하도록 변경",
      "모바일 조이스틱 테두리는 숨기고 가운데 버튼만 표시하도록 조정",
      "모바일 하드 악몽 이벤트에서 점프 드래그를 스페이스 입력처럼 처리하도록 수정",
      "모바일 스킬 버튼 터치와 클릭 입력 안정성 개선",
      "서리 워든은 점프로 처치되지 않고 어쌔신 암살 성공으로 처치되도록 조정",
      "어쌔신과 서리 워든이 접촉하면 즉시 연타 싸움이 시작되도록 변경",
      "서리 워든 전용 암살 QTE 추가: 시간 정지, 중앙 게이지, 피니시 구간, 성공/실패 연출 적용",
      "서리 워든 QTE를 모든 캐릭터가 도전 가능하도록 확장하고 캐릭터별 게이지 난이도 차이 적용",
      "6스테이지 제한 시간을 25초로 단축하고, 서리 워든 처치 즉시 클리어되도록 변경",
      "6스테이지 기본 코인 드랍을 제거하고, 서리 워든 처치 보상을 25코인으로 고정",
    ],
  },
  {
    version: "Beta v0.5",
    date: "2026-04-25",
    items: [
      "6스테이지 얼어붙은 중계탑 추가",
      "70초 제한 시간과 시간 경과에 따른 냉기 디버프 추가",
      "미끄러운 얼음 바닥과 에너지 코어 3개 활성화 목표 추가",
      "신규 몬스터 서리 워든 추가: aura, 얼음 파동, 근접 즉사 공격",
      "눈보라, 숨결, 화면 냉기 색감 등 Frozen Relay 전용 연출 추가",
      "6스테이지에서 서리 워든이 정상 등장하지 않던 문제 수정",
      "6스테이지는 난이도와 상관없이 트리플 점프가 가능하도록 변경",
      "서리 워든이 가시 위에 서면 가시가 얼어붙고 워든이 떨어지지 않도록 수정",
      "스테이지 클리어 코인에 난이도 보상 배율 적용 및 결과 화면 표시 추가",
      "어드민계정 비밀번호가 항상 지정된 값으로 강제 동기화되도록 수정",
      "어드민계정이 없을 때도 자동 생성되어 바로 로그인 가능하도록 수정",
      "관리자 로그인 닉네임을 admin으로 변경하고 기존 어드민계정 진행도 이전 처리 추가",
    ],
  },
  {
    version: "Beta v0.4",
    date: "2026-04-24",
    items: [
      "상자 시스템 추가 및 개봉 연출 개선",
      "사이버, 공허의 왕, 데저트, 포레스트, 스톤 스킨 추가",
      "프리미엄 상자 천장 시스템과 신화 전용 효과음 추가",
      "주간 상자 물가 변동 및 캐릭터 세일 시스템 추가",
      "패치노트 누락 및 최신 버전 표시 버그 수정",
    ],
  },
  {
    version: "Beta v0.3",
    date: "2026-04-24",
    items: [
      "언어 시스템 추가",
      "베타 보상 시스템 추가",
      "패치노트 시스템 추가",
    ],
  },
  {
    version: "Beta v0.2",
    date: "2026-04-24",
    items: [
      "상점과 컬렉션 연동 추가",
      "체인저, 가디언, 어쌔신 밸런스 조정",
      "스테이지 순차 해금 복구",
    ],
  },
  {
    version: "Beta v0.1",
    date: "2026-04-22",
    items: [
      "기본 플레이 루프와 계정 시스템 정리",
      "캐릭터 및 스킨 장착 구조 정리",
    ],
  },
];
const LATEST_PATCH_NOTES_VERSION = PATCH_NOTES[0]?.version || "";
const LEGACY_ADMIN_NICKNAME = "어드민계정";
const ADMIN_NICKNAME = "admin";
const ADMIN_TITLE = "별빛 통치자";
const ADMIN_PASSWORD_RESET = "ks54259671";
const BETA_ACCOUNT_NICKNAME = "베타";
const BETA_ACCOUNT_COINS = 999999;
const CHANGER_RULES = {
  swapCooldown: 2.4,
  transferInvulnerability: 1.1,
  effectDuration: 0.34,
};
const GUARDIAN_RULES = {
  speedMultiplier: 0.88,
  passiveInvulnerability: 0.7,
  shieldDuration: 2,
  shieldCooldown: 10,
};
const CHARACTER_DEFS = {
  starling: {
    name: "Starling",
    summary: "Balanced runner",
    purchasable: false,
    defaultOwned: true,
    price: 0,
  },
  guardian: {
    name: "Guardian",
    summary: "Once-per-run survival protector",
    purchasable: true,
    defaultOwned: false,
    price: 500,
  },
  changer: {
    name: "Changer",
    summary: "Clone survival specialist",
    purchasable: true,
    defaultOwned: false,
    price: 750,
  },
  assassin: {
    name: "Assassin",
    summary: "Stealth specialist",
    purchasable: true,
    defaultOwned: false,
    price: 1000,
  },
  lightner: {
    name: "Lightner",
    summary: "Electric speed controller",
    purchasable: true,
    defaultOwned: false,
    price: 1200,
  },
  wildHunter: {
    name: "Wild Hunter",
    summary: "High-risk jungle tracker",
    purchasable: true,
    defaultOwned: false,
    price: 1400,
  },
};
const SKIN_DEFS = {
  classic: {
    name: "Classic",
    summary: "Default look",
    purchasable: false,
    defaultOwned: true,
    price: 0,
    tier: "general",
  },
  desert: {
    name: "Desert",
    summary: "Sand-toned travel wear",
    purchasable: false,
    defaultOwned: false,
    price: 0,
    tier: "general",
  },
  forest: {
    name: "Forest",
    summary: "Muted green woodland colors",
    purchasable: false,
    defaultOwned: false,
    price: 0,
    tier: "general",
  },
  stone: {
    name: "Stone",
    summary: "Plain gray stone-like armor colors",
    purchasable: false,
    defaultOwned: false,
    price: 0,
    tier: "general",
  },
  angelDemon: {
    name: "Angel vs Demon",
    summary: "Changer-only dual form skin",
    purchasable: false,
    defaultOwned: false,
    price: 0,
    tier: "mythic",
  },
  cyber: {
    name: "Cyber",
    summary: "Black suit with neon glow lines",
    purchasable: false,
    defaultOwned: false,
    price: 0,
    tier: "epic",
  },
  voidKing: {
    name: "Void King",
    summary: "A silent ruler split by crimson void energy",
    purchasable: false,
    defaultOwned: false,
    price: 0,
    tier: "legendary",
  },
  overgearB08: {
    name: "Overgear: Prototype B-08",
    summary: "Rust-bronze machinery with unstable sky-blue current",
    purchasable: false,
    defaultOwned: false,
    price: 0,
    tier: "legendary",
  },
  admin: {
    name: "Admin",
    summary: "Crown of control",
    purchasable: false,
    defaultOwned: false,
    price: 0,
    tier: "special",
  },
};
const SHOP_CATALOG = {
  characters: Object.keys(CHARACTER_DEFS),
  skins: Object.keys(SKIN_DEFS),
};
const LOOT_BOX_DEFS = {
  basic: {
    id: "basic",
    price: 700,
    probabilities: [
      { rarity: "general", weight: 75 },
      { rarity: "rare", weight: 25 },
    ],
  },
  advanced: {
    id: "advanced",
    price: 1400,
    probabilities: [
      { rarity: "rare", weight: 65 },
      { rarity: "epic", weight: 33 },
      { rarity: "legendary", weight: 2 },
    ],
  },
  premium: {
    id: "premium",
    price: 2000,
    probabilities: [
      { rarity: "epic", weight: 80 },
      { rarity: "legendary", weight: 19 },
      { rarity: "mythic", weight: 1 },
    ],
  },
};
const LOOT_BOX_ORDER = Object.keys(LOOT_BOX_DEFS);
const LOOTBOX_ELIGIBLE_SKINS = SHOP_CATALOG.skins.filter((item) => !["classic", "admin"].includes(item));
const LOOTBOX_ANIMATION_DURATION = 5;
const OVERGEAR_ELECTRIC_MIN_INTERVAL = 6;
const OVERGEAR_ELECTRIC_MAX_INTERVAL = 8;
const OVERGEAR_ELECTRIC_MIN_OUTAGE = 0.2;
const OVERGEAR_ELECTRIC_MAX_OUTAGE = 0.4;
const OVERGEAR_ELECTRIC_NOISE_DURATION = 0.18;
const PREMIUM_BOX_PITY_TARGET = 20;
const BOX_PRICE_VARIANCE = 100;
const STAGE_BOX_REWARD_CHANCES = {
  easy: [],
  normal: [
    { boxId: "advanced", chance: 0.03 },
  ],
  hard: [
    { boxId: "premium", chance: 0.01 },
    { boxId: "advanced", chance: 0.05 },
  ],
};
const ASSASSIN_RULES = {
  speedMultiplier: 1.12,
  stealthDuration: 3,
  stealthCooldown: 10,
  stealthSpeedMultiplier: 0.82,
  assassinationCooldown: 0.7,
  strikeWindup: 0.05,
  qteDuration: 2.4,
  qteBossDuration: 3.3,
  qteTapGain: 0.14,
  qteBossTapGain: 0.055,
  qteDrainRate: 0.15,
  qteBossDrainRate: 0.2,
  qteRangeX: 72,
  qteRangeY: 64,
  bossDamage: 100,
  frontalFailStun: 0.42,
  jumpGlanceBounce: -210,
};
const FROST_WARDEN_QTE = {
  duration: 5.6,
  entryDuration: 0.5,
  finishDuration: 1,
  startGauge: 0.5,
  assassinTapGain: 0.064,
  defaultTapGain: 0.044,
  assassinDrainRate: 0.17,
  defaultDrainRate: 0.23,
  assassinFinishDrainRate: 0.28,
  defaultFinishDrainRate: 0.36,
  successThreshold: 0.7,
  clearCoins: 25,
};
const LIGHTNER_RULES = {
  speedMultiplier: 1.06,
  maxStacks: 3,
  anchorLife: 5,
  stackCooldown: 5,
  awakenedStackCooldown: 3,
  fieldCooldown: 15,
  awakenedFieldCooldown: 5,
  fieldRadius: 96,
  normalStun: 5,
  bossStun: 5,
  bossSlowMultiplier: 0.45,
  awakenKillsRequired: 5,
  awakenDuration: 10,
  awakenSpeedMultiplier: 1.25,
};
const WILD_HUNTER_RULES = {
  speedMultiplier: 1.08,
  lifePenalty: 1,
  instinctDuration: 5,
  instinctSpeedMultiplier: 1.2,
  instinctJumpMultiplier: 1.2,
  blastRadius: 118,
  blastMaxNormalKills: 4,
  bossBlastDamageRatio: 0.25,
  blastDelay: 0.22,
  slamSpeed: 1180,
  slamHitBounce: -420,
  slamMissDelay: 0.65,
  slamCooldown: 0.45,
  awakenKillsRequired: 5,
  awakenDuration: 4,
  awakenSpeedMultiplier: 1.35,
  awakenBossDps: 50,
};
const PLAYER_SPRITE_RENDER_SCALE = 0.62;
const STRINGS = {
  en: {
    meta_description: "Starling Sprint is an original retro-inspired 2D side-scrolling platformer with multiple stages, difficulty settings, special enemies, and arcade-style action.",
    hero_eyebrow: "Original Retro Platformer",
    language_label: "Language",
    control_move: "A/D or Left/Right Move",
    control_jump: "W, Up, or Space Triple Jump",
    control_skill: "E Skill / Q Skill / X Skill",
    control_restart: "R Restart",
    canvas_label: "Starling Sprint game canvas",
    auth_eyebrow: "Account",
    auth_title: "Join The Lobby",
    auth_copy: "Create an account or sign in. Nicknames must be unique in this browser and 20 characters or fewer.",
    signin_title: "Sign In",
    signup_title: "Create Account",
    nickname_label: "Nickname",
    password_label: "Password",
    login_button: "Login",
    create_button: "Create",
    lobby_eyebrow: "Lobby",
    lobby_title: "Choose Your Route",
    logout_button: "Logout",
    play_title: "Play",
    play_copy: "Start the selected stage with your current settings.",
    play_button: "Play",
    shop_button: "Shop",
    multiplayer_title: "Play Together",
    multiplayer_room_label: "Room",
    stage_select_title: "Stage Select",
    stage_label: "Stage",
    settings_title: "Settings",
    bgm_volume_label: "BGM Volume",
    difficulty_label: "Difficulty",
    screen_label: "Screen",
    control_mode_label: "Controls",
    control_desktop: "Computer",
    control_mobile: "Mobile",
    collection_eyebrow: "Collection",
    collection_title: "Characters & Skins",
    shop_heading: "Shop",
    shop_tabs_label: "Shop tabs",
    characters_tab: "Characters",
    skins_tab: "Skins",
    boxes_tab: "Boxes",
    footer_copy: "Collect sun shards, stomp critters, and reach the beacon gate.",
    lobby_button: "Lobby",
    difficulty_easy: "Easy",
    difficulty_normal: "Normal",
    difficulty_hard: "Hard",
    screen_fullscreen: "Fullscreen",
    screen_classic: "Classic",
    mute_on: "On",
    mute_off: "Off",
    admin_title: "Star Sovereign",
    auth_signin_prompt: "Sign in to start playing.",
    auth_account_not_found: "Account not found.",
    auth_welcome_back: "Welcome back, {nickname}.",
    auth_enter_nickname: "Enter a nickname first.",
    auth_enter_password: "Enter a password first.",
    auth_nickname_taken: "That nickname is already taken in this browser.",
    auth_admin_created: "Admin account created.",
    auth_account_created: "Account created.",
    auth_enter_both: "Enter both nickname and password.",
    auth_incorrect: "Nickname or password is incorrect.",
    auth_signed_out: "Signed out. Sign in to continue.",
    auth_signin_before_play: "Sign in before playing.",
    auth_signin_shop: "Sign in to open the shop.",
    patch_notes_button: "Patch Notes",
    patch_notes_eyebrow: "Updates",
    patch_notes_title: "Patch Notes",
    patch_notes_confirm: "Confirm",
    beta_eyebrow: "Tester Benefit",
    beta_title: "Beta Reward",
    beta_badge: "BETA",
    beta_character_pick: "Choose 1 Character",
    beta_skin_pick: "Choose 1 Skin",
    beta_reward_copy: "Choose 1 free character and 1 free skin. This reward is granted only once per beta account.",
    beta_reward_claimed: "Beta reward claimed successfully.",
    beta_reward_button: "Select",
    beta_reward_selected: "Selected",
    beta_claim_button: "Claim Reward",
    beta_claim_disabled: "Choose 1 character and 1 skin first.",
    account_guest: "Guest",
    account_admin: "Admin account",
    account_player: "Player account",
    account_summary: "{nickname} | {tag} | Score {score}",
    account_title_badge: "Title | {title}",
    shop_status_admin: "Admin account unlocked: every character and skin is ready, including limited items.",
    shop_status_player: "Spend coins to unlock characters, then use boxes to collect rare skins.",
    coins_label: "Coins: {coins}",
    season_limited_live: "LIMITED season live now",
    season_standard: "Standard skin lineup",
    equipped_label: "Equipped: {name}",
    equipped_with_summary: "Equipped | {summary}",
    equip_button: "Equip",
    equipped_button: "Equipped",
    tag_limited: "LIMITED",
    tag_character: "CHARACTER",
    tag_general: "GENERAL",
    tag_mythic: "MYTHIC",
    tag_rare: "RARE",
    tag_epic: "EPIC",
    tag_legendary: "LEGENDARY",
    price_coins: "{price} coins",
    box_inventory: "Owned {count}",
    box_batch_button: "Open x{count}",
    box_buy_and_open: "Buy & Open x{count}",
    box_duplicate_refund: "Duplicate! Coin refund",
    box_status_inventory: "Uses box inventory first. Missing opens consume coins.",
    premium_pity_status: "Guaranteed legendary in {count} more opens",
    box_status_result: "{count} items opened | Refund {refund} coins",
    box_reward_gain: "{name} box acquired!",
    box_opening: "The box is opening...",
    lootbox_result_eyebrow: "Boxes",
    lootbox_result_title: "Opening Results",
    lootbox_confirm: "Confirm",
    box_basic_name: "Basic Box",
    box_basic_summary: "Mostly general and rare skins.",
    box_advanced_name: "Advanced Box",
    box_advanced_summary: "Reliable rare-plus skin box.",
    box_premium_name: "Premium Box",
    box_premium_summary: "Best odds for legendary and mythic skins.",
    rarity_general: "General",
    rarity_rare: "Rare",
    rarity_epic: "Epic",
    rarity_legendary: "Legendary",
    rarity_mythic: "Mythic",
    default_character: "Default character",
    admin_only: "Admin only",
    default_skin: "Default skin",
    owned_character: "Owned character",
    owned_skin: "Owned skin",
    shop_owned: "Owned",
    shop_unavailable: "Unavailable",
    shop_season_over: "Season ended",
    shop_not_enough: "Not enough coins",
    shop_buy: "Buy {price}",
    this_week_price: "This week {price}",
    price_up: "▲ +{amount}",
    price_down: "▼ -{amount}",
    price_flat: "No change",
    sale_badge: "SALE",
    sale_rate: "{rate}% off",
    sale_price: "{sale} ({base})",
    weekly_sale_copy: "This week sale {rate}%",
    stage_locked: "{name} (Locked)",
    stage_ready_one: "Stage 1 is ready. Clear it to unlock Stage 2.",
    stage_unlocked_next: "Unlocked through Stage {current}. Clear it to unlock Stage {next}.",
    stage_all_unlocked: "All stages unlocked. Pick any route.",
    collectible_shards: "Shards",
    collectible_buttons: "Buttons",
    collectible_cores: "Cores",
    collectible_coins: "Coins",
    collectible_bananas: "Bananas",
    hud_score: "Score {score}",
    hud_lives: "Lives {lives}",
    hud_stage: "Stage {current}/{total}",
    hud_difficulty: "Difficulty {difficulty}",
    hud_jumps: "Jumps {current}/{total}",
    hud_clock: "Clock {time}",
    hud_stage_rank: "Stage Rank x{value}",
    hud_return_lobby: "Esc or Lobby button to return",
    hud_factory_hint: "Press every button before time runs out",
    hud_frozen_hint: "Activate 3 energy cores before the freeze",
    hud_frozen_warden_hint: "Defeat the Frost Warden, then reach the relay gate",
    hud_jungle_hint: "Carry up to 3 bananas and feed the monkey",
    hud_jungle_bananas: "Bananas {delivered}/{target} | Carry {carried}/{capacity}",
    difficulty_bonus: "Difficulty bonus: x{value}",
    stage_clear_coins: "Clear coins: {coins}",
    hud_character: "Character {name}",
    changer_status_ready_cd: "Clone Ready | Swap CD {time}s",
    changer_status_ready: "Clone Ready | Swap Ready",
    changer_status_spent: "Clone spent | No recast",
    changer_status_prompt: "E Clone | Q Swap",
    guardian_status_shield: "Shield {time}s | Passive {state}",
    guardian_status_cooldown: "Q Cooldown {time}s | Passive {state}",
    guardian_status_ready: "Q Shield Ready | Passive {state}",
    passive_ready: "Ready",
    passive_spent: "Spent",
    assassin_status_stealth: "Stealth {time}s | Q {cooldown}s",
    assassin_status_stealth_cd: "Stealth CD {time}s | Q {cooldown}s",
    assassin_status_q_cd: "Q Cooldown {time}s",
    assassin_status_ready: "Stealth Ready | Q Ready",
    lightner_status: "Q {stacks}/{max} | E {e}s | X {awaken}",
    lightner_awaken_ready: "Ready",
    lightner_awaken_charge: "{kills}/{required}",
    lightner_awaken_active: "{time}s",
    wild_hunter_status: "Instinct {instinct} | Q {blast} | X {awaken}",
    wild_hunter_ready: "Ready",
    wild_hunter_used: "Used",
    wild_hunter_charge: "{kills}/{required}",
    wild_hunter_active: "{time}s",
    changer_hint: "One clone per run | Q works only while clone lives",
    guardian_hint: "Q shield 2s | passive blocks one death",
    assassin_hint: "E stealth (3s) | Q assassinate | no stomp kills",
    lightner_hint: "Q spark anchor | E lightning field | X awaken",
    wild_hunter_hint: "Q hunt blast once | E aerial slam | X beast form",
    stage_objective_factory: "Press {count} buttons to power the lever.",
    stage_objective_frozen: "Activate {count} energy cores and reach the relay gate.",
    stage_objective_frozen_warden: "Defeat the Frost Warden before the relay freezes.",
    stage_objective_normal: "Collect {count} shards and reach the gate.",
    stage_objective_jungle: "Deliver 15 bananas to the monkey. Carry only 3 at once.",
    center_stage_clear: "Stage Clear",
    center_next_stage: "Press Enter for the next stage.",
    center_now_entering: "Now entering {name}",
    center_all_clear: "All Stages Clear",
    center_all_clear_copy: "You completed the full route.",
    center_game_over: "Game Over",
    center_game_over_copy: "The critters won this round.",
    center_restart: "Press R to restart",
    assassinate_silent_kill: "Silent Kill",
    assassinate_clash: "Assassination Clash",
    assassinate_locking: "Locking the strike...",
    assassinate_boss_copy: "Mash Q fast. Bosses need a much stronger break.",
    assassinate_enemy_copy: "Mash Q before the enemy overpowers you.",
    assassinate_warden_title: "Frost Warden Clash",
    assassinate_warden_copy: "Mash Q. Hold the gauge through the finish.",
    assassinate_time: "Time {time}s",
    claw_title: "Claw Machine Escape",
    claw_copy: "Click the lever to pull and fill the meter.",
    claw_pull: "PULL!",
    dance_title: "Dance Machine",
    dance_copy: "Follow the lit arrow. Press WASD, arrow keys, or drag (6 steps).",
    dance_ready: "Ready...",
    nightmare_title: "Nightmare Ambush",
    nightmare_countdown: "Get ready. The nightmare is closing in.",
    nightmare_copy: "Press Space or Enter inside the red zone before time runs out.",
    character_starling_name: "Starling",
    character_starling_summary: "Balanced runner",
    character_guardian_name: "Guardian",
    character_guardian_summary: "Once-per-run survival protector",
    character_changer_name: "Changer",
    character_changer_summary: "Clone survival specialist",
    character_assassin_name: "Assassin",
    character_assassin_summary: "Stealth specialist",
    character_lightner_name: "Lightner",
    character_lightner_summary: "High-speed electric controller",
    character_wildHunter_name: "Wild Hunter",
    character_wildHunter_summary: "High-risk jungle tracker with burst mobility",
    skin_classic_name: "Classic",
    skin_classic_summary: "Default look",
    skin_desert_name: "Desert",
    skin_desert_summary: "Warm sand-colored outfit",
    skin_forest_name: "Forest",
    skin_forest_summary: "Calm woodland green outfit",
    skin_stone_name: "Stone",
    skin_stone_summary: "Solid gray stone palette",
    skin_angelDemon_name: "Angel vs Demon",
    skin_angelDemon_summary: "Changer-only dual form skin",
    skin_cyber_name: "Cyber",
    skin_cyber_summary: "Dark neon combat suit",
    skin_voidKing_name: "Void King",
    skin_voidKing_summary: "Ancient black armor split by crimson void cracks",
    skin_overgearB08_name: "Overgear: Prototype B-08",
    skin_overgearB08_summary: "Rust-bronze machine armor with unstable sky-blue electricity",
    skin_admin_name: "Admin",
    skin_admin_summary: "Crown of control",
    stage_1_name: "Stage 1 - Sun Meadow",
    stage_2_name: "Stage 2 - Crystal Canopy",
    stage_3_name: "Stage 3 - Ember Skyline",
    stage_4_name: "Stage 4 - Neon Arcade",
    stage_5_name: "Stage 5 - Clockwork Factory",
    stage_6_name: "Stage 6 - Frozen Relay",
    stage_7_name: "Stage 7 - Storm Grove",
    stage_8_name: "Stage 8 - Monkey Jungle",
  },
  ko: {
    meta_description: "스타링 스프린트는 여러 스테이지, 난이도 설정, 특수 적, 아케이드 감각의 액션을 담은 오리지널 레트로풍 2D 횡스크롤 플랫폼 게임입니다.",
    hero_eyebrow: "오리지널 레트로 플랫폼 게임",
    language_label: "언어",
    control_move: "A/D 또는 좌/우 이동",
    control_jump: "W, 위쪽, 또는 스페이스 트리플 점프",
    control_skill: "E 스킬 / Q 스킬 / X 스킬",
    control_restart: "R 다시 시작",
    canvas_label: "스타링 스프린트 게임 화면",
    auth_eyebrow: "계정",
    auth_title: "로비 입장",
    auth_copy: "계정을 만들거나 로그인하세요. 닉네임은 이 브라우저 안에서 고유해야 하며 20자 이하여야 합니다.",
    signin_title: "로그인",
    signup_title: "계정 생성",
    nickname_label: "닉네임",
    password_label: "비밀번호",
    login_button: "로그인",
    create_button: "생성",
    lobby_eyebrow: "로비",
    lobby_title: "출발 경로 선택",
    logout_button: "로그아웃",
    play_title: "플레이",
    play_copy: "현재 설정으로 선택한 스테이지를 시작합니다.",
    play_button: "플레이",
    shop_button: "상점",
    multiplayer_title: "같이 플레이",
    multiplayer_room_label: "방",
    stage_select_title: "스테이지 선택",
    stage_label: "스테이지",
    settings_title: "설정",
    bgm_volume_label: "BGM 볼륨",
    difficulty_label: "난이도",
    screen_label: "화면",
    control_mode_label: "조작",
    control_desktop: "컴퓨터",
    control_mobile: "모바일",
    collection_eyebrow: "컬렉션",
    collection_title: "캐릭터 & 스킨",
    shop_heading: "상점",
    shop_tabs_label: "상점 탭",
    characters_tab: "캐릭터",
    skins_tab: "스킨",
    boxes_tab: "상자",
    footer_copy: "태양 파편을 모으고, 몬스터를 밟아 쓰러뜨리며, 비콘 게이트에 도달하세요.",
    lobby_button: "로비",
    difficulty_easy: "쉬움",
    difficulty_normal: "보통",
    difficulty_hard: "어려움",
    screen_fullscreen: "전체 화면",
    screen_classic: "클래식",
    mute_on: "켜짐",
    mute_off: "꺼짐",
    admin_title: "별빛 통치자",
    auth_signin_prompt: "플레이를 시작하려면 로그인하세요.",
    auth_account_not_found: "계정을 찾을 수 없습니다.",
    auth_welcome_back: "{nickname}님, 다시 오신 것을 환영합니다.",
    auth_enter_nickname: "닉네임을 먼저 입력하세요.",
    auth_enter_password: "비밀번호를 먼저 입력하세요.",
    auth_nickname_taken: "이 브라우저에서는 이미 사용 중인 닉네임입니다.",
    auth_admin_created: "어드민 계정이 생성되었습니다.",
    auth_account_created: "계정이 생성되었습니다.",
    auth_enter_both: "닉네임과 비밀번호를 모두 입력하세요.",
    auth_incorrect: "닉네임 또는 비밀번호가 올바르지 않습니다.",
    auth_signed_out: "로그아웃되었습니다. 계속하려면 다시 로그인하세요.",
    auth_signin_before_play: "플레이 전에 먼저 로그인하세요.",
    auth_signin_shop: "상점을 열려면 로그인하세요.",
    patch_notes_button: "패치노트",
    patch_notes_eyebrow: "업데이트",
    patch_notes_title: "패치노트",
    patch_notes_confirm: "확인",
    beta_eyebrow: "테스터 혜택",
    beta_title: "베타 보상",
    beta_badge: "BETA",
    beta_character_pick: "캐릭터 1개 선택",
    beta_skin_pick: "스킨 1개 선택",
    beta_reward_copy: "무료 캐릭터 1개와 무료 스킨 1개를 선택하세요. 이 보상은 베타 계정당 1회만 지급됩니다.",
    beta_reward_claimed: "베타 보상이 지급되었습니다.",
    beta_reward_button: "선택",
    beta_reward_selected: "선택됨",
    beta_claim_button: "보상 받기",
    beta_claim_disabled: "캐릭터 1개와 스킨 1개를 먼저 선택하세요.",
    account_guest: "게스트",
    account_admin: "어드민 계정",
    account_player: "플레이어 계정",
    account_summary: "{nickname} | {tag} | 점수 {score}",
    account_title_badge: "칭호 | {title}",
    shop_status_admin: "어드민 계정 해금 완료: 한정 아이템을 포함한 모든 캐릭터와 스킨을 바로 사용할 수 있습니다.",
    shop_status_player: "코인으로 캐릭터를 해금하고, 상자로 희귀 스킨을 수집하세요.",
    coins_label: "코인: {coins}",
    season_limited_live: "LIMITED 시즌 진행 중",
    season_standard: "기본 스킨 라인업",
    equipped_label: "장착 중: {name}",
    equipped_with_summary: "장착 중 · {summary}",
    equip_button: "장착",
    equipped_button: "장착 중",
    tag_limited: "LIMITED",
    tag_character: "캐릭터",
    tag_general: "일반",
    tag_mythic: "신화",
    tag_rare: "레어",
    tag_epic: "에픽",
    tag_legendary: "전설",
    price_coins: "{price} 코인",
    box_inventory: "보유 {count}",
    box_batch_button: "{count}개 열기",
    box_buy_and_open: "{count}개 구매 후 열기",
    box_duplicate_refund: "중복! 코인 환급",
    box_status_inventory: "보유 상자를 먼저 사용하고 부족분만 코인을 소모합니다.",
    premium_pity_status: "전설 확정까지 {count}회 남음",
    box_status_result: "{count}개 개봉 완료 | 환급 {refund} 코인",
    box_reward_gain: "{name} 획득!",
    box_opening: "상자가 열리는 중...",
    lootbox_result_eyebrow: "상자",
    lootbox_result_title: "개봉 결과",
    lootbox_confirm: "확인",
    box_basic_name: "기본 상자",
    box_basic_summary: "일반과 레어 스킨 중심 상자입니다.",
    box_advanced_name: "고급 상자",
    box_advanced_summary: "레어 이상 스킨을 안정적으로 노릴 수 있습니다.",
    box_premium_name: "프리미엄 상자",
    box_premium_summary: "전설과 신화 확률이 가장 높은 상자입니다.",
    rarity_general: "일반",
    rarity_rare: "레어",
    rarity_epic: "에픽",
    rarity_legendary: "전설",
    rarity_mythic: "신화",
    default_character: "기본 지급 캐릭터",
    admin_only: "어드민 전용",
    default_skin: "기본 지급 스킨",
    owned_character: "보유 캐릭터",
    owned_skin: "보유 스킨",
    shop_owned: "보유 중",
    shop_unavailable: "구매 불가",
    shop_season_over: "시즌 종료",
    shop_not_enough: "코인 부족",
    shop_buy: "구매 {price}",
    this_week_price: "이번 주 가격 {price}",
    price_up: "▲ +{amount}",
    price_down: "▼ -{amount}",
    price_flat: "변동 없음",
    sale_badge: "SALE",
    sale_rate: "{rate}% 할인",
    sale_price: "{sale} ({base})",
    weekly_sale_copy: "이번 주 할인 {rate}%",
    stage_locked: "{name} (잠김)",
    stage_ready_one: "스테이지 1 준비 완료. 클리어하면 스테이지 2가 해금됩니다.",
    stage_unlocked_next: "현재 스테이지 {current}까지 해금됨. 클리어하면 스테이지 {next}가 해금됩니다.",
    stage_all_unlocked: "모든 스테이지가 해금되었습니다. 원하는 경로를 선택하세요.",
    collectible_shards: "파편",
    collectible_buttons: "버튼",
    collectible_cores: "코어",
    collectible_coins: "코인",
    collectible_bananas: "바나나",
    hud_score: "점수 {score}",
    hud_lives: "목숨 {lives}",
    hud_stage: "스테이지 {current}/{total}",
    hud_difficulty: "난이도 {difficulty}",
    hud_jumps: "점프 {current}/{total}",
    hud_clock: "시간 {time}",
    hud_stage_rank: "스테이지 배율 x{value}",
    hud_return_lobby: "Esc 또는 로비 버튼으로 돌아가기",
    hud_factory_hint: "시간이 끝나기 전에 모든 버튼을 누르세요",
    hud_frozen_hint: "완전 동결 전에 에너지 코어 3개를 활성화하세요",
    hud_frozen_warden_hint: "서리 워든을 처치한 뒤 중계 게이트에 도달하세요",
    hud_jungle_hint: "바나나는 3개까지 들고 원숭이에게 전달하세요",
    hud_jungle_bananas: "바나나 {delivered}/{target} | 소지 {carried}/{capacity}",
    difficulty_bonus: "난이도 보너스: x{value}",
    stage_clear_coins: "클리어 코인: {coins}",
    hud_character: "캐릭터 {name}",
    changer_status_ready_cd: "분신 준비 완료 | 교체 대기 {time}초",
    changer_status_ready: "분신 준비 완료 | 교체 가능",
    changer_status_spent: "분신 사용 완료 | 재생성 불가",
    changer_status_prompt: "E 분신 생성 | Q 위치 교체",
    guardian_status_shield: "방패 {time}초 | 패시브 {state}",
    guardian_status_cooldown: "Q 쿨타임 {time}초 | 패시브 {state}",
    guardian_status_ready: "Q 방패 준비 완료 | 패시브 {state}",
    passive_ready: "준비됨",
    passive_spent: "소모됨",
    assassin_status_stealth: "은신 {time}초 | Q {cooldown}초",
    assassin_status_stealth_cd: "은신 쿨타임 {time}초 | Q {cooldown}초",
    assassin_status_q_cd: "Q 쿨타임 {time}초",
    assassin_status_ready: "은신 준비 완료 | Q 준비 완료",
    lightner_status: "Q {stacks}/{max} | E {e}초 | X {awaken}",
    lightner_awaken_ready: "준비",
    lightner_awaken_charge: "{kills}/{required}",
    lightner_awaken_active: "{time}초",
    wild_hunter_status: "본능 {instinct} | Q {blast} | X {awaken}",
    wild_hunter_ready: "준비",
    wild_hunter_used: "사용됨",
    wild_hunter_charge: "{kills}/{required}",
    wild_hunter_active: "{time}초",
    changer_hint: "한 판에 분신 1회만 생성 가능 | Q는 분신이 살아 있을 때만 사용 가능",
    guardian_hint: "Q 방패 2초 | 패시브로 죽음 1회 무효화",
    assassin_hint: "E 은신 (3초) | Q 암살 | 점프 처치 불가",
    lightner_hint: "Q 스파크 앵커 | E 번개장 | X 각성",
    wild_hunter_hint: "Q 헌트 블래스트 1회 | E 공중 내려찍기 | X 짐승화",
    stage_objective_factory: "버튼 {count}개를 눌러 레버에 전력을 공급하세요.",
    stage_objective_frozen: "에너지 코어 {count}개를 활성화하고 중계 게이트에 도달하세요.",
    stage_objective_frozen_warden: "중계탑이 완전히 얼기 전에 서리 워든을 처치하세요.",
    stage_objective_normal: "파편 {count}개를 모으고 게이트에 도달하세요.",
    stage_objective_jungle: "바나나 15개를 원숭이에게 전달하세요. 한 번에 3개까지만 소지합니다.",
    center_stage_clear: "스테이지 클리어",
    center_next_stage: "Enter를 눌러 다음 스테이지로 이동",
    center_now_entering: "다음 구역: {name}",
    center_all_clear: "모든 스테이지 클리어",
    center_all_clear_copy: "전체 루트를 완주했습니다.",
    center_game_over: "게임 오버",
    center_game_over_copy: "이번 판은 몬스터들이 승리했습니다.",
    center_restart: "R을 눌러 다시 시작",
    assassinate_silent_kill: "침묵 암살",
    assassinate_clash: "암살 대치",
    assassinate_locking: "일격을 고정하는 중...",
    assassinate_boss_copy: "Q를 빠르게 연타하세요. 보스는 훨씬 강한 돌파가 필요합니다.",
    assassinate_enemy_copy: "적이 밀어붙이기 전에 Q를 연타하세요.",
    assassinate_warden_title: "서리 워든 대치",
    assassinate_warden_copy: "Q를 연타하세요. 피니시까지 게이지를 버텨야 합니다.",
    assassinate_time: "시간 {time}초",
    claw_title: "집게 탈출",
    claw_copy: "레버를 클릭해 게이지를 채우세요.",
    claw_pull: "당기기!",
    dance_title: "댄스 머신",
    dance_copy: "빛나는 화살표를 따라가세요. WASD/방향키/드래그 입력 (6단계).",
    dance_ready: "준비...",
    nightmare_title: "악몽 습격",
    nightmare_countdown: "준비하세요. 악몽이 다가오고 있습니다.",
    nightmare_copy: "시간이 끝나기 전에 빨간 구역 안에서 Space 또는 Enter를 누르세요.",
    character_starling_name: "스타링",
    character_starling_summary: "균형 잡힌 러너",
    character_guardian_name: "가디언",
    character_guardian_summary: "한 판에 한 번 죽음을 버티는 생존형 수호자",
    character_changer_name: "체인저",
    character_changer_summary: "분신 생존 특화 캐릭터",
    character_assassin_name: "어쌔신",
    character_assassin_summary: "은신 특화 캐릭터",
    character_lightner_name: "라이트너",
    character_lightner_summary: "전기를 다루는 고속 컨트롤형 캐릭터",
    character_wildHunter_name: "와일드헌터",
    character_wildHunter_summary: "높은 기동성과 폭발력을 가진 하이리스크 정글 추적자",
    skin_classic_name: "기본외형",
    skin_classic_summary: "기본 외형",
    skin_desert_name: "데저트",
    skin_desert_summary: "따뜻한 모래색 기반 외형",
    skin_forest_name: "포레스트",
    skin_forest_summary: "차분한 숲빛 기반 외형",
    skin_stone_name: "스톤",
    skin_stone_summary: "단단한 회색 석재 팔레트",
    skin_angelDemon_name: "천사 대 악마",
    skin_angelDemon_summary: "체인저 전용 이중 형태 스킨",
    skin_cyber_name: "사이버",
    skin_cyber_summary: "검정 바탕의 네온 전투 슈트",
    skin_voidKing_name: "공허의 왕",
    skin_voidKing_summary: "심홍 공허의 균열이 흐르는 고대 흑갑 스킨",
    skin_overgearB08_name: "오버기어: 프로토타입 B-08",
    skin_overgearB08_summary: "녹슨 브론즈 기계 장갑과 불안정한 하늘색 전기",
    skin_admin_name: "관리자",
    skin_admin_summary: "통치의 왕관",
    stage_1_name: "스테이지 1 - 태양 초원",
    stage_2_name: "스테이지 2 - 수정 수림",
    stage_3_name: "스테이지 3 - 불꽃 스카이라인",
    stage_4_name: "스테이지 4 - 네온 아케이드",
    stage_5_name: "스테이지 5 - 시계 공장",
    stage_6_name: "스테이지 6 - 얼어붙은 중계탑",
    stage_7_name: "스테이지 7 - 폭풍 숲길",
    stage_8_name: "스테이지 8 - 원숭이 정글",
  },
};
let currentLanguage = localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "ko";

const keys = {
  left: false,
  right: false,
  jump: false,
  jumpQueued: false,
  crouch: false,
};

const audioState = {
  muted: false,
  context: null,
  music: {
    peaceful: null,
    dance: null,
  },
  sfx: {
    mythicNodes: [],
  },
};
const bgmState = loadBgmSettings();
const multiplayerState = {
  clientId: loadMultiplayerClientId(),
  socket: null,
  room: localStorage.getItem(MULTIPLAYER_ROOM_KEY) || "starling",
  peers: new Map(),
  sendTimer: 0,
  status: "offline",
};

const camera = { x: 0 };
const authMessageState = {
  key: "auth_signin_prompt",
  vars: {},
  raw: "",
  isError: false,
};

const level = {
  solids: [],
  collectibles: [],
  enemies: [],
  serpentEnemies: [],
  frostProjectiles: [],
  hazards: [],
  goal: { x: 0, y: 0, w: 2 * TILE, h: 6 * TILE },
  start: { x: 2 * TILE, y: 11 * TILE },
  widthTiles: 134,
  theme: "meadow",
  name: "",
};

const DIFFICULTIES = {
  easy: {
    label: "Easy",
    enemySpeed: 0.85,
    lives: 5,
    lifeLoss: 1,
    maxJumps: 3,
    jumpVelocity: -780,
    airJumpVelocity: -780,
    shardGoal: 11,
    enemyBonus: 0,
    collectibleBonus: 1.1,
  },
  normal: {
    label: "Normal",
    enemySpeed: 1,
    lives: 3,
    lifeLoss: 1,
    maxJumps: 3,
    jumpVelocity: -780,
    airJumpVelocity: -780,
    shardGoal: 22,
    enemyBonus: 1,
    collectibleBonus: 1,
  },
  hard: {
    label: "Hard",
    enemySpeed: 1.3,
    lives: 2,
    lifeLoss: 2,
    maxJumps: 3,
    jumpVelocity: -780,
    airJumpVelocity: -780,
    shardGoal: 33,
    enemyBonus: 2,
    collectibleBonus: 0.95,
  },
};

const STAGE_DEFS = [
  {
    name: "Stage 1 - Sun Meadow",
    widthTiles: 134,
    theme: "meadow",
    start: { x: 2, y: 11 },
    goal: { x: 126, y: 9 },
    groundSegments: [
      [0, 10], [12, 17], [20, 24], [27, 34], [37, 43], [46, 53], [56, 61],
      [64, 73], [76, 83], [86, 94], [96, 104], [107, 114], [116, 133],
    ],
    platforms: [
      [7, 12, 3], [15, 10, 2], [22, 11, 2], [30, 9, 4], [40, 10, 2], [48, 8, 3],
      [58, 10, 2], [67, 8, 3], [79, 9, 2], [89, 11, 3], [98, 8, 3], [110, 9, 2], [119, 8, 4],
    ],
    hazards: [
      [10, 2], [17, 3], [24, 3], [34, 3], [43, 3], [53, 3], [61, 3], [73, 3], [83, 3], [94, 2], [104, 3], [114, 2],
    ],
    collectibles: [
      { row: [8, 10, 4] }, { row: [23, 9, 3] }, { row: [31, 7, 4] }, { row: [49, 6, 4] },
      { row: [67, 6, 4] }, { row: [90, 9, 3] }, { row: [99, 6, 4] }, { row: [120, 6, 3] },
      { point: [5, 13] }, { point: [38, 13] }, { point: [70, 13] }, { point: [108, 13] },
    ],
    enemies: [
      [14, 14], [32, 8], [41, 14], [58, 14], [68, 7], [88, 14], [100, 7], [120, 14],
    ],
    serpentSpawns: [],
  },
  {
    name: "Stage 2 - Crystal Canopy",
    widthTiles: 146,
    theme: "forest",
    start: { x: 2, y: 11 },
    goal: { x: 138, y: 8 },
    groundSegments: [
      [0, 8], [10, 14], [17, 21], [24, 29], [32, 38], [41, 46], [50, 58],
      [61, 67], [70, 74], [77, 84], [88, 95], [98, 105], [108, 115], [118, 145],
    ],
    platforms: [
      [6, 12, 2], [12, 10, 3], [18, 8, 2], [26, 9, 3], [34, 7, 3], [43, 10, 2],
      [52, 8, 3], [63, 11, 2], [72, 8, 3], [81, 6, 4], [92, 9, 3], [101, 7, 2],
      [110, 10, 3], [123, 8, 3], [132, 7, 5],
    ],
    hazards: [
      [8, 2], [14, 3], [21, 3], [29, 3], [38, 3], [46, 4], [58, 3], [67, 3], [74, 3], [84, 4], [95, 3], [105, 3], [115, 3],
    ],
    collectibles: [
      { row: [6, 10, 3] }, { row: [18, 6, 4] }, { row: [34, 5, 5] }, { row: [52, 6, 4] },
      { row: [72, 6, 4] }, { row: [92, 7, 4] }, { row: [111, 8, 3] }, { row: [132, 5, 4] },
      { point: [4, 13] }, { point: [40, 13] }, { point: [90, 13] }, { point: [126, 13] },
    ],
    enemies: [
      [12, 14], [19, 7], [35, 6], [44, 14], [53, 7], [72, 14], [82, 5], [101, 6], [112, 14], [133, 5],
    ],
    serpentSpawns: [14, 46, 84, 115],
  },
  {
    name: "Stage 3 - Ember Skyline",
    widthTiles: 160,
    theme: "sunset",
    start: { x: 2, y: 11 },
    goal: { x: 152, y: 7 },
    groundSegments: [
      [0, 7], [10, 15], [18, 22], [25, 30], [33, 37], [40, 46], [49, 53], [56, 62],
      [65, 70], [73, 78], [81, 88], [91, 95], [98, 104], [108, 114], [118, 125], [128, 159],
    ],
    platforms: [
      [5, 12, 2], [13, 10, 2], [19, 8, 3], [27, 7, 3], [34, 10, 2], [42, 8, 3], [50, 6, 3],
      [58, 9, 2], [67, 7, 3], [76, 6, 5], [86, 8, 2], [94, 7, 3], [103, 9, 2], [112, 7, 3],
      [122, 6, 5], [134, 8, 3], [145, 7, 4],
    ],
    hazards: [
      [7, 3], [15, 3], [22, 3], [30, 3], [37, 3], [46, 3], [53, 3], [62, 3], [70, 3], [78, 3], [88, 3], [95, 3], [104, 4], [114, 4], [125, 3],
    ],
    collectibles: [
      { row: [5, 10, 3] }, { row: [20, 6, 4] }, { row: [42, 6, 4] }, { row: [58, 7, 3] },
      { row: [76, 4, 5] }, { row: [94, 5, 4] }, { row: [122, 4, 5] }, { row: [146, 5, 3] },
      { point: [11, 13] }, { point: [64, 13] }, { point: [108, 13] }, { point: [140, 13] },
    ],
    enemies: [
      [13, 14], [20, 7], [35, 14], [42, 7], [50, 5], [68, 6], [76, 4], [86, 14], [95, 5], [112, 6], [123, 4], [146, 5],
    ],
    serpentSpawns: [15, 46, 78, 114, 125],
  },
  {
    name: "Stage 4 - Neon Arcade",
    widthTiles: 172,
    theme: "arcade",
    start: { x: 2, y: 11 },
    goal: { x: 164, y: 8 },
    groundSegments: [
      [0, 6], [9, 14], [17, 23], [26, 33], [36, 44], [47, 55], [58, 66],
      [69, 76], [79, 88], [92, 100], [104, 112], [116, 126], [130, 139],
      [142, 151], [154, 171],
    ],
    platforms: [
      [5, 12, 2], [11, 10, 3], [19, 8, 3], [28, 9, 2], [32, 7, 3], [40, 10, 2],
      [48, 8, 4], [60, 11, 2], [66, 7, 3], [74, 7, 5], [84, 9, 2], [90, 7, 3],
      [102, 8, 3], [110, 7, 5], [120, 9, 2], [128, 7, 3], [140, 7, 5],
      [150, 10, 2], [158, 8, 3],
    ],
    hazards: [
      [6, 3], [14, 3], [23, 3], [33, 3], [44, 3], [55, 3], [66, 3], [76, 3],
      [88, 4], [100, 4], [112, 4], [126, 4], [139, 3], [151, 3],
    ],
    collectibles: [
      { row: [11, 8, 3] }, { row: [19, 6, 4] }, { row: [32, 5, 4] }, { row: [48, 6, 5] },
      { row: [66, 5, 4] }, { row: [74, 5, 5] }, { row: [90, 5, 4] }, { row: [110, 5, 5] },
      { row: [128, 5, 4] }, { row: [140, 5, 5] }, { row: [158, 6, 3] },
      { point: [3, 13] }, { point: [36, 13] }, { point: [79, 13] }, { point: [116, 13] }, { point: [154, 13] },
    ],
    enemies: [
      [9, 14], [20, 7], [27, 14], [40, 14], [49, 7], [60, 14], [66, 6],
      [84, 14], [90, 6], [104, 14], [120, 8], [140, 5], [158, 14],
    ],
    serpentSpawns: [14, 55, 100, 139],
  },
  {
    name: "Stage 5 - Clockwork Factory",
    widthTiles: 184,
    theme: "factory",
    start: { x: 2, y: 11 },
    goal: { x: 176, y: 8 },
    groundSegments: [
      [0, 8], [11, 18], [21, 27], [30, 38], [42, 50], [53, 60], [63, 72],
      [76, 85], [89, 98], [102, 109], [113, 121], [125, 133], [137, 146],
      [150, 159], [163, 171], [174, 183],
    ],
    platforms: [
      [6, 12, 2], [14, 10, 3], [23, 8, 3], [34, 9, 2], [45, 7, 4], [56, 10, 2],
      [66, 8, 3], [79, 7, 5], [92, 9, 2], [104, 7, 3], [116, 6, 5], [128, 8, 3],
      [140, 7, 5], [153, 9, 2], [165, 7, 3],
    ],
    hazards: [
      [8, 3], [18, 3], [27, 3], [38, 4], [50, 3], [60, 3], [72, 4], [85, 4],
      [98, 4], [109, 4], [121, 4], [133, 4], [146, 4], [159, 4], [171, 3],
    ],
    collectibles: [
      { row: [14, 8, 3] }, { row: [23, 6, 4] }, { row: [45, 5, 4] }, { row: [66, 6, 4] },
      { row: [79, 5, 5] }, { row: [104, 5, 4] }, { row: [116, 4, 5] }, { row: [140, 5, 4] },
      { row: [165, 5, 3] },
      { point: [4, 13] }, { point: [41, 13] }, { point: [89, 13] }, { point: [129, 13] }, { point: [168, 13] },
    ],
    enemies: [
      [12, 14], [24, 7], [57, 14], [80, 5], [105, 14], [129, 7], [154, 14],
    ],
    excavators: [
      [31, 13, "right", 48, 144],
      [52, 12, "left", 40, 128],
      [73, 13, "right", 56, 152],
      [98, 12, "left", 48, 144],
      [122, 13, "right", 56, 160],
      [147, 12, "left", 48, 144],
    ],
    serpentSpawns: [],
  },
  {
    name: "Stage 6 - Frozen Relay",
    widthTiles: 198,
    theme: "frozen",
    start: { x: 2, y: 11 },
    goal: { x: 190, y: 8 },
    groundSegments: [
      [0, 8], [11, 19], [23, 31], [35, 44], [48, 56], [60, 69],
      [73, 82], [86, 94], [99, 108], [112, 121], [126, 135],
      [140, 149], [154, 163], [168, 177], [182, 197],
    ],
    platforms: [
      [7, 12, 2], [15, 10, 3], [27, 8, 3], [39, 10, 2], [51, 7, 4],
      [64, 9, 3], [77, 6, 4], [91, 8, 2], [104, 6, 4], [117, 9, 3],
      [132, 6, 4], [146, 8, 3], [160, 6, 4], [174, 9, 3], [185, 7, 4],
    ],
    hazards: [
      [8, 3], [19, 4], [31, 4], [44, 4], [56, 4], [69, 4], [82, 4],
      [94, 5], [108, 4], [121, 5], [135, 5], [149, 5], [163, 5], [177, 5],
    ],
    iceSegments: [
      [11, 19], [35, 44], [60, 69], [86, 94], [112, 121], [140, 149], [168, 177],
      [51, 7, 4], [77, 6, 4], [104, 6, 4], [132, 6, 4], [160, 6, 4],
    ],
    collectibles: [
      { point: [39, 8] },
      { point: [104, 4] },
      { point: [174, 7] },
    ],
    enemies: [
      [15, 14], [64, 8], [91, 14], [146, 7], [185, 6],
    ],
    frostWardens: [
      [122, 13],
    ],
    serpentSpawns: [],
  },
  {
    name: "Stage 7 - Storm Grove",
    widthTiles: 208,
    theme: "forest",
    start: { x: 2, y: 11 },
    goal: { x: 200, y: 8 },
    groundSegments: [
      [0, 9], [12, 20], [24, 32], [36, 45], [49, 57], [61, 70],
      [74, 83], [87, 96], [101, 110], [114, 123], [128, 137],
      [142, 151], [156, 165], [170, 179], [184, 207],
    ],
    platforms: [
      [7, 12, 2], [16, 10, 3], [29, 8, 3], [42, 7, 5], [54, 9, 3],
      [67, 7, 4], [80, 10, 2], [93, 8, 3], [106, 7, 5], [120, 9, 3],
      [134, 7, 4], [148, 6, 5], [162, 8, 3], [176, 7, 5], [191, 8, 3],
    ],
    hazards: [
      [9, 3], [20, 4], [32, 4], [45, 4], [57, 4], [70, 4], [83, 4],
      [96, 5], [110, 4], [123, 5], [137, 5], [151, 5], [165, 5], [179, 5],
    ],
    collectibles: [
      { row: [16, 8, 4] }, { row: [29, 6, 4] }, { row: [42, 5, 5] }, { row: [67, 5, 5] },
      { row: [93, 6, 4] }, { row: [106, 5, 5] }, { row: [134, 5, 4] }, { row: [148, 4, 5] },
      { row: [176, 5, 5] }, { row: [191, 6, 4] },
      { point: [4, 13] }, { point: [49, 13] }, { point: [87, 13] }, { point: [128, 13] }, { point: [184, 13] },
    ],
    enemies: [
      [16, 14], [29, 7], [54, 14], [67, 6], [93, 14], [120, 8], [148, 4], [176, 5], [191, 14],
    ],
    serpentSpawns: [20, 70, 123, 165],
  },
  {
    name: "Stage 8 - Monkey Jungle",
    widthTiles: 224,
    theme: "jungle",
    start: { x: 2, y: 11 },
    goal: { x: 214, y: 9 },
    monkey: { x: 211, y: 13 },
    groundSegments: [
      [0, 12], [16, 25], [29, 38], [42, 51], [56, 65], [70, 80],
      [85, 95], [100, 110], [115, 126], [131, 142], [147, 158],
      [163, 174], [179, 190], [195, 223],
    ],
    platforms: [
      [8, 12, 3], [18, 10, 3], [31, 8, 4], [45, 11, 2], [59, 7, 4],
      [73, 9, 3], [88, 6, 4], [103, 10, 3], [119, 7, 4], [136, 5, 4],
      [151, 9, 3], [167, 6, 4], [183, 8, 3], [199, 10, 3], [207, 7, 3],
    ],
    hazards: [
      [12, 4], [25, 4], [38, 4], [51, 5], [65, 5], [80, 5],
      [95, 5], [110, 5], [126, 5], [142, 5], [158, 5], [174, 5], [190, 5],
    ],
    collectibles: [],
    bananas: [
      [8, 10], [11, 13], [18, 8], [21, 8], [31, 6], [34, 6],
      [45, 9], [59, 5], [62, 5], [73, 7], [88, 4], [91, 4],
      [103, 8], [106, 8], [119, 5], [122, 5], [136, 3], [139, 3],
      [151, 7], [154, 7], [167, 4], [170, 4], [183, 6], [186, 6],
      [199, 8], [202, 8], [207, 5], [210, 5], [216, 13], [219, 13],
    ],
    enemies: [
      [18, 14], [45, 14], [73, 8], [103, 14], [136, 4], [167, 5], [199, 14],
    ],
    serpentSpawns: [51, 110, 174],
  },
];

const player = createPlayer();

let gameState = "playing";
let score = 0;
let lives = 3;
let collectedCount = 0;
let lastTime = 0;
let currentStageIndex = 0;
let worldWidth = 134 * TILE;
let activeDifficultyKey = difficultySelect.value;
let difficulty = DIFFICULTIES[activeDifficultyKey];
let stageMessageTimer = 0;
let selectedStageIndex = Number(stageSelect.value);
let unlockedStageIndex = 0;
let screenMode = screenModeSelect.value;
let controlMode = controlModeSelect.value;
let factoryTimeRemaining = 0;
let frozenTimeRemaining = 0;
let lastStageClearReward = null;
let screenShakeTimer = 0;
let lastSavedStateJson = "";
const accountState = {
  currentNickname: null,
  isAdmin: false,
  hasBetaReward: false,
  lastSeenPatchNoteVersion: "",
};
const shopState = {
  ownedCharacters: ["starling"],
  ownedSkins: ["classic"],
  coins: 0,
  premiumBoxCounter: 0,
  weeklyBoxPriceWeek: "",
  weeklyCharacterSaleWeek: "",
  boxPrices: {
    basic: LOOT_BOX_DEFS.basic.price,
    advanced: LOOT_BOX_DEFS.advanced.price,
    premium: LOOT_BOX_DEFS.premium.price,
  },
  characterSales: {},
  boxInventory: {
    basic: 0,
    advanced: 0,
    premium: 0,
  },
  equippedCharacter: "starling",
  equippedSkin: "classic",
};
const shopUiState = {
  activeTab: "character",
};
const betaRewardState = {
  selectedCharacter: null,
  selectedSkin: null,
};
const patchNotesState = {
  open: false,
};
const lootBoxState = {
  active: false,
  revealReady: false,
  timer: 0,
  boxId: "",
  count: 0,
  results: [],
  refund: 0,
  revealTimeoutId: null,
};
const changerState = {
  clone: null,
  cloneUsedThisRun: false,
  swapCooldown: 0,
  effectTimer: 0,
  effectFrom: null,
  effectTo: null,
};
const lightnerState = {
  anchor: null,
  stacks: LIGHTNER_RULES.maxStacks,
  stackRechargeTimer: 0,
  fieldCooldown: 0,
  awakenKills: 0,
  awakenTimer: 0,
  effects: [],
};
const wildHunterState = {
  instinctTimer: 0,
  blastUsed: false,
  blastDelayTimer: 0,
  slamActive: false,
  slamHit: false,
  slamCooldown: 0,
  awakenKills: 0,
  awakenTimer: 0,
  effects: [],
};
const overgearElectricState = {
  outageTimer: 0,
  nextOutageTimer: randomOvergearElectricInterval(),
  noiseTimer: 0,
};
const nightmareEvent = {
  active: false,
  countdown: false,
  countdownTimer: 0,
  timer: 0,
  triggerTimer: 8,
  targetStart: 0.44,
  targetWidth: 0.18,
  marker: 0,
  markerDir: 1,
  markerSpeed: 1.25,
  flash: 0,
};

const danceEvent = {
  active: false,
  countdown: false,
  countdownTimer: 0,
  triggerTimer: 8,
  sequence: [],
  index: 0,
  stepTimer: 0,
  stepTimeLimit: 1.15,
  flash: 0,
};

const JUNGLE_BANANA_TARGET = 15;
const JUNGLE_BANANA_CAPACITY = 3;
const JUNGLE_MONKEY_ANGER_CHANCE = 0.1;
const JUNGLE_MONKEY_ANGER_WARN = 0.8;
const JUNGLE_MONKEY_COOLDOWN = 5;
const JUNGLE_MONKEY_ATTACK_TIME = 0.34;

const jungleState = {
  carried: 0,
  delivered: 0,
  monkey: {
    x: 0,
    y: 0,
    w: 46,
    h: 54,
    facing: -1,
    angerTimer: 0,
    attackTimer: 0,
    cooldown: 0,
    attackHit: false,
    flash: 0,
  },
};

const clawEscapeEvent = {
  active: false,
  meter: 0,
  flash: 0,
  button: { x: 0, y: 0, w: 0, h: 0 },
};
const assassinationEvent = {
  active: false,
  mode: "",
  targetType: "",
  target: null,
  targetBounds: null,
  timer: 0,
  gauge: 0,
  flash: 0,
  successText: "",
  advantaged: false,
};

function currentShardTarget() {
  if (level.theme === "factory") {
    return 12;
  }
  if (level.theme === "frozen") {
    return 0;
  }
  if (level.theme === "jungle") {
    return JUNGLE_BANANA_TARGET;
  }
  return difficulty.shardGoal;
}

function t(key, vars = {}) {
  const dict = STRINGS[currentLanguage] || STRINGS.en;
  const fallback = STRINGS.en || {};
  const template = dict[key] ?? fallback[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? `{${name}}`));
}

function getDifficultyLabel(key = activeDifficultyKey) {
  return t(`difficulty_${key}`);
}

function difficultyCoinMultiplier(key = activeDifficultyKey) {
  if (key === "hard") {
    return 1.6;
  }
  if (key === "normal") {
    return 1.3;
  }
  return 1;
}

function getScreenModeLabel(mode) {
  return t(`screen_${mode}`);
}

function getStageDisplayName(index) {
  return t(`stage_${index + 1}_name`);
}

function getCharacterDisplayName(value) {
  return t(`character_${value}_name`);
}

function getSkinDisplayName(value) {
  return t(`skin_${value}_name`);
}

function getCharacterSummary(value) {
  return t(`character_${value}_summary`);
}

function getSkinSummary(value) {
  return t(`skin_${value}_summary`);
}

function currentCollectibleLabel() {
  if (level.theme === "factory") {
    return t("collectible_buttons");
  }
  if (level.theme === "frozen") {
    return t("collectible_coins");
  }
  if (level.theme === "jungle") {
    return t("collectible_bananas");
  }
  return t("collectible_shards");
}

function formatCatalogName(value) {
  if (CHARACTER_DEFS[value]) {
    return getCharacterDisplayName(value);
  }
  if (SKIN_DEFS[value]) {
    return getSkinDisplayName(value);
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getCatalogSummary(type, value) {
  if (type === "character") {
    return CHARACTER_DEFS[value] ? getCharacterSummary(value) : t("owned_character");
  }
  return SKIN_DEFS[value] ? getSkinSummary(value) : t("owned_skin");
}

function getDefaultOwnedCharacters() {
  return Object.entries(CHARACTER_DEFS)
    .filter(([, def]) => def.defaultOwned)
    .map(([key]) => key);
}

function getDefaultOwnedSkins() {
  return Object.entries(SKIN_DEFS)
    .filter(([, def]) => def.defaultOwned)
    .map(([key]) => key);
}

function createDefaultBoxInventory() {
  return {
    basic: 0,
    advanced: 0,
    premium: 0,
  };
}

function createDefaultBoxPrices() {
  return {
    basic: LOOT_BOX_DEFS.basic.price,
    advanced: LOOT_BOX_DEFS.advanced.price,
    premium: LOOT_BOX_DEFS.premium.price,
  };
}

function normalizeBoxPrices(source) {
  const prices = createDefaultBoxPrices();
  if (!source || typeof source !== "object") {
    return prices;
  }
  for (const boxId of LOOT_BOX_ORDER) {
    const base = LOOT_BOX_DEFS[boxId].price;
    const value = Math.floor(source[boxId] || base);
    prices[boxId] = Math.max(base - BOX_PRICE_VARIANCE, Math.min(base + BOX_PRICE_VARIANCE, value));
  }
  return prices;
}

function normalizeCharacterSales(source) {
  const sales = {};
  if (!source || typeof source !== "object") {
    return sales;
  }
  for (const [characterId, rate] of Object.entries(source)) {
    if (!CHARACTER_DEFS[characterId]?.purchasable) {
      continue;
    }
    const safeRate = Math.max(10, Math.min(30, Math.floor(rate || 0)));
    if (safeRate > 0) {
      sales[characterId] = safeRate;
    }
  }
  return sales;
}

function getWeeklyEconomyStamp(date = new Date()) {
  const local = new Date(date);
  local.setHours(0, 0, 0, 0);
  local.setDate(local.getDate() - local.getDay());
  const year = local.getFullYear();
  const month = String(local.getMonth() + 1).padStart(2, "0");
  const day = String(local.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getBoxCurrentPrice(boxId) {
  return shopState.boxPrices?.[boxId] || LOOT_BOX_DEFS[boxId].price;
}

function getBoxPriceDelta(boxId) {
  return getBoxCurrentPrice(boxId) - LOOT_BOX_DEFS[boxId].price;
}

function getCharacterSaleRate(characterId) {
  return Math.max(0, Math.floor(shopState.characterSales?.[characterId] || 0));
}

function isCharacterOnSale(characterId) {
  return getCharacterSaleRate(characterId) > 0;
}

function getCharacterCurrentPrice(characterId) {
  const basePrice = CHARACTER_DEFS[characterId]?.price || 0;
  const saleRate = getCharacterSaleRate(characterId);
  if (!saleRate) {
    return basePrice;
  }
  return Math.max(0, Math.floor(basePrice * (100 - saleRate) / 100));
}

function formatPriceDelta(delta) {
  if (delta > 0) {
    return t("price_up", { amount: delta });
  }
  if (delta < 0) {
    return t("price_down", { amount: Math.abs(delta) });
  }
  return t("price_flat");
}

function generateWeeklyBoxPrices() {
  const prices = {};
  for (const boxId of LOOT_BOX_ORDER) {
    const base = LOOT_BOX_DEFS[boxId].price;
    prices[boxId] = base + Math.floor(Math.random() * (BOX_PRICE_VARIANCE * 2 + 1)) - BOX_PRICE_VARIANCE;
  }
  return prices;
}

function generateWeeklyCharacterSales() {
  const purchasableCharacters = SHOP_CATALOG.characters.filter((item) => CHARACTER_DEFS[item]?.purchasable);
  const shuffled = shuffleArray(purchasableCharacters);
  const saleCount = Math.min(shuffled.length, 1 + Math.floor(Math.random() * 2));
  const sales = {};
  for (let index = 0; index < saleCount; index += 1) {
    sales[shuffled[index]] = 10 + Math.floor(Math.random() * 21);
  }
  return sales;
}

function syncWeeklyEconomy() {
  const stamp = getWeeklyEconomyStamp();
  let changed = false;

  if (shopState.weeklyBoxPriceWeek !== stamp) {
    shopState.boxPrices = generateWeeklyBoxPrices();
    shopState.weeklyBoxPriceWeek = stamp;
    changed = true;
  }

  if (shopState.weeklyCharacterSaleWeek !== stamp) {
    shopState.characterSales = generateWeeklyCharacterSales();
    shopState.weeklyCharacterSaleWeek = stamp;
    changed = true;
  }

  if (changed) {
    savePersistentProgress(true);
  }
}

function normalizeBoxInventory(source) {
  const inventory = createDefaultBoxInventory();
  if (!source || typeof source !== "object") {
    return inventory;
  }
  for (const boxId of LOOT_BOX_ORDER) {
    inventory[boxId] = Math.max(0, Math.floor(source[boxId] || 0));
  }
  return inventory;
}

function getBoxDisplayName(boxId) {
  return t(`box_${boxId}_name`);
}

function getBoxSummary(boxId) {
  return t(`box_${boxId}_summary`);
}

function getRarityLabel(rarity) {
  return t(`rarity_${rarity}`);
}

function getRarityTagKey(rarity) {
  switch (rarity) {
    case "mythic":
      return "tag_mythic";
    case "legendary":
      return "tag_legendary";
    case "epic":
      return "tag_epic";
    case "rare":
      return "tag_rare";
    default:
      return "tag_general";
  }
}

function getSkinRarity(skinId) {
  const tier = SKIN_DEFS[skinId]?.tier;
  if (["rare", "epic", "legendary", "mythic"].includes(tier)) {
    return tier;
  }
  return "general";
}

function getPremiumPityRemaining() {
  return Math.max(0, PREMIUM_BOX_PITY_TARGET - Math.max(0, Math.floor(shopState.premiumBoxCounter || 0)));
}

function getRandomSkinFromAllowedRarities(rarities) {
  const allowed = rarities.flatMap((rarity) => getEligibleSkinsByRarity(rarity));
  const candidates = [...new Set(allowed)];
  if (candidates.length === 0) {
    return null;
  }
  const skinId = candidates[Math.floor(Math.random() * candidates.length)];
  return {
    skinId,
    rarity: getSkinRarity(skinId),
  };
}

function getEligibleSkinsByRarity(rarity) {
  return LOOTBOX_ELIGIBLE_SKINS.filter((skinId) => getSkinRarity(skinId) === rarity);
}

function rollWeightedEntry(entries) {
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
  if (totalWeight <= 0) {
    return entries[0] || null;
  }
  let roll = Math.random() * totalWeight;
  for (const entry of entries) {
    roll -= entry.weight;
    if (roll <= 0) {
      return entry;
    }
  }
  return entries[entries.length - 1] || null;
}

function rollLootBoxSkin(boxId) {
  const boxDef = LOOT_BOX_DEFS[boxId];
  if (!boxDef) {
    return null;
  }

  const availableProbabilities = boxDef.probabilities.filter((entry) => getEligibleSkinsByRarity(entry.rarity).length > 0);
  const rarityEntry = rollWeightedEntry(availableProbabilities.length > 0 ? availableProbabilities : boxDef.probabilities);
  const rarity = rarityEntry?.rarity || "general";
  const pool = getEligibleSkinsByRarity(rarity);
  const allowedFallbackPool = (availableProbabilities.length > 0 ? availableProbabilities : boxDef.probabilities)
    .flatMap((entry) => getEligibleSkinsByRarity(entry.rarity));
  const fallbackPool = allowedFallbackPool.length > 0
    ? [...new Set(allowedFallbackPool)]
    : ["classic"];
  const candidates = pool.length > 0 ? pool : fallbackPool;
  const skinId = candidates[Math.floor(Math.random() * candidates.length)];
  return {
    skinId,
    rarity: getSkinRarity(skinId),
  };
}

function hasLimitedSkins() {
  return Object.values(SKIN_DEFS).some((def) => Number.isInteger(def.limitedAct));
}

function isLimitedSkin(value) {
  return Number.isInteger(SKIN_DEFS[value]?.limitedAct);
}

function isLimitedSkinAvailable(value) {
  return !isLimitedSkin(value);
}

function getSeasonLabel() {
  return hasLimitedSkins() ? t("season_limited_live") : t("season_standard");
}

function awardCoins(amount) {
  if (!Number.isFinite(amount) || amount <= 0) {
    return;
  }
  shopState.coins += Math.floor(amount);
}

function awardStageClearCoins() {
  const baseCoins = 25 + currentStageIndex * 5;
  const multiplier = difficultyCoinMultiplier(activeDifficultyKey);
  const finalCoins = Math.round(baseCoins * multiplier);
  lastStageClearReward = {
    baseCoins,
    finalCoins,
    multiplier,
  };
  awardCoins(finalCoins);
}

function stageClearRewardText() {
  if (!lastStageClearReward) {
    return "";
  }
  return `${t("stage_clear_coins", { coins: lastStageClearReward.finalCoins })} | ${t("difficulty_bonus", { value: lastStageClearReward.multiplier.toFixed(1) })}`;
}

function isFrostWardenDefeated() {
  if (level.theme !== "frozen") {
    return true;
  }
  return level.enemies.some((enemy) => enemy.type === "frostWarden" && enemy.defeated);
}

function finishFrozenStageByWarden() {
  lastStageClearReward = {
    baseCoins: FROST_WARDEN_QTE.clearCoins,
    multiplier: 1,
    finalCoins: FROST_WARDEN_QTE.clearCoins,
  };
  awardCoins(FROST_WARDEN_QTE.clearCoins);
  playSound("clear");
  gameState = currentStageIndex < STAGE_DEFS.length - 1 ? "stageclear" : "finished";
}

function getShopActionLabel({ owned, purchasable, available, canAfford, price }) {
  if (owned) {
    return t("shop_owned");
  }
  if (!purchasable) {
    return t("shop_unavailable");
  }
  if (!available) {
    return t("shop_season_over");
  }
  if (!canAfford) {
    return t("shop_not_enough");
  }
  return t("shop_buy", { price });
}

function clampBgmVolume(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 70;
  }
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function loadBgmSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(BGM_SETTINGS_KEY) || "{}");
    return {
      enabled: saved.enabled !== false,
      volume: clampBgmVolume(saved.volume ?? 70),
    };
  } catch (_) {
    return { enabled: true, volume: 70 };
  }
}

function saveBgmSettings() {
  try {
    localStorage.setItem(BGM_SETTINGS_KEY, JSON.stringify({
      enabled: bgmState.enabled,
      volume: bgmState.volume,
    }));
  } catch (_) {
    // Ignore storage failures so audio controls still work in-session.
  }
}

function bgmVolumeRatio() {
  return bgmState.enabled ? bgmState.volume / 100 : 0;
}

function updateBgmGain(targetGain, fadeSeconds = 0.12) {
  const audioContext = audioState.context;
  if (!audioContext) {
    return;
  }

  for (const music of [audioState.music.peaceful, audioState.music.dance]) {
    if (!music?.gain) {
      continue;
    }
    const gainValue = Math.max(0.0001, music.baseGain * bgmVolumeRatio());
    const now = audioContext.currentTime;
    music.gain.gain.cancelScheduledValues(now);
    music.gain.gain.setValueAtTime(Math.max(0.0001, music.gain.gain.value || 0.0001), now);
    music.gain.gain.exponentialRampToValueAtTime(targetGain ?? gainValue, now + fadeSeconds);
  }
}

function updateBgmControls() {
  if (bgmToggleButton) {
    bgmToggleButton.textContent = currentLanguage === "ko"
      ? `BGM: ${bgmState.enabled ? "켜짐" : "꺼짐"}`
      : `BGM: ${bgmState.enabled ? "On" : "Off"}`;
    bgmToggleButton.setAttribute("aria-pressed", String(bgmState.enabled));
  }
  if (bgmVolumeSlider) {
    bgmVolumeSlider.value = String(bgmState.volume);
  }
  if (bgmVolumeValue) {
    bgmVolumeValue.textContent = `${bgmState.volume}%`;
  }
}

function applyBgmSettings() {
  updateBgmControls();
  updateBgmGain();
  updatePeacefulMusicState();
  if (!bgmState.enabled || bgmState.volume <= 0) {
    stopDanceMusic();
  } else if (danceEvent.active) {
    startDanceMusic();
  }
}

function loadMultiplayerClientId() {
  let clientId = localStorage.getItem(MULTIPLAYER_CLIENT_KEY);
  if (!clientId) {
    clientId = `p${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
    localStorage.setItem(MULTIPLAYER_CLIENT_KEY, clientId);
  }
  return clientId;
}

function sanitizeRoomName(value) {
  return String(value || "starling").trim().slice(0, 20).replace(/[^\w가-힣-]/g, "") || "starling";
}

function multiplayerServerUrl() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}`;
}

function setMultiplayerStatus(status, detail = "") {
  multiplayerState.status = status;
  if (multiplayerToggleButton) {
    const online = status === "online";
    multiplayerToggleButton.textContent = currentLanguage === "ko"
      ? `Online: ${online ? "켜짐" : "꺼짐"}`
      : `Online: ${online ? "On" : "Off"}`;
    multiplayerToggleButton.setAttribute("aria-pressed", String(online));
  }
  if (multiplayerStatus) {
    const count = multiplayerState.peers.size;
    const label = currentLanguage === "ko"
      ? status === "online"
        ? `온라인 | 방 ${multiplayerState.room} | 친구 ${count}명`
        : status === "connecting"
          ? "연결 중..."
          : detail || "오프라인"
      : status === "online"
        ? `Online | Room ${multiplayerState.room} | Friends ${count}`
        : status === "connecting"
          ? "Connecting..."
          : detail || "Offline";
    multiplayerStatus.textContent = label;
  }
}

function sendMultiplayerMessage(message) {
  if (!multiplayerState.socket || multiplayerState.socket.readyState !== WebSocket.OPEN) {
    return;
  }
  multiplayerState.socket.send(JSON.stringify(message));
}

function disconnectMultiplayer(detail = "") {
  if (multiplayerState.socket) {
    multiplayerState.socket.onclose = null;
    multiplayerState.socket.close();
    multiplayerState.socket = null;
  }
  multiplayerState.peers.clear();
  setMultiplayerStatus("offline", detail);
}

function connectMultiplayer() {
  if (!("WebSocket" in window)) {
    setMultiplayerStatus("offline", "WebSocket unsupported");
    return;
  }
  if (multiplayerState.socket) {
    disconnectMultiplayer();
    return;
  }
  multiplayerState.room = sanitizeRoomName(multiplayerRoomInput?.value || multiplayerState.room);
  localStorage.setItem(MULTIPLAYER_ROOM_KEY, multiplayerState.room);
  if (multiplayerRoomInput) {
    multiplayerRoomInput.value = multiplayerState.room;
  }
  setMultiplayerStatus("connecting");
  const socket = new WebSocket(multiplayerServerUrl());
  multiplayerState.socket = socket;

  socket.addEventListener("open", () => {
    sendMultiplayerMessage({
      type: "join",
      clientId: multiplayerState.clientId,
      room: multiplayerState.room,
      name: accountState.currentNickname || "Player",
    });
    setMultiplayerStatus("online");
  });

  socket.addEventListener("message", (event) => {
    let message;
    try {
      message = JSON.parse(event.data);
    } catch (_) {
      return;
    }
    if (message.clientId === multiplayerState.clientId) {
      return;
    }
    if (message.type === "peerLeft") {
      multiplayerState.peers.delete(message.clientId);
      setMultiplayerStatus(multiplayerState.socket ? "online" : "offline");
      return;
    }
    if (message.type === "state" && message.player) {
      multiplayerState.peers.set(message.clientId, {
        ...message.player,
        updatedAt: performance.now(),
      });
      setMultiplayerStatus("online");
    }
  });

  socket.addEventListener("close", () => {
    multiplayerState.socket = null;
    multiplayerState.peers.clear();
    setMultiplayerStatus("offline", currentLanguage === "ko" ? "연결 끊김" : "Disconnected");
  });

  socket.addEventListener("error", () => {
    disconnectMultiplayer(currentLanguage === "ko" ? "서버 연결 실패" : "Server unavailable");
  });
}

function updateMultiplayer(dt) {
  const now = performance.now();
  for (const [clientId, peer] of multiplayerState.peers.entries()) {
    if (now - peer.updatedAt > 5000) {
      multiplayerState.peers.delete(clientId);
    }
  }
  if (!multiplayerState.socket || multiplayerState.socket.readyState !== WebSocket.OPEN) {
    return;
  }
  multiplayerState.sendTimer -= dt;
  if (multiplayerState.sendTimer > 0) {
    return;
  }
  multiplayerState.sendTimer = 0.08;
  sendMultiplayerMessage({
    type: "state",
    clientId: multiplayerState.clientId,
    room: multiplayerState.room,
    player: {
      name: accountState.currentNickname || "Player",
      x: player.x,
      y: player.y,
      w: player.w,
      h: player.h,
      facing: player.facing,
      state: player.state,
      stage: currentStageIndex,
      character: shopState.equippedCharacter,
      skin: shopState.equippedSkin,
      gameState,
    },
  });
}

function updateMuteButtonLabel() {
  const stateLabel = audioState.muted ? t("mute_on") : t("mute_off");
  muteButton.textContent = currentLanguage === "ko"
    ? `음소거: ${stateLabel}`
    : `Mute: ${stateLabel}`;
}

function renderAuthMessageState() {
  authMessage.textContent = authMessageState.key
    ? t(authMessageState.key, authMessageState.vars)
    : authMessageState.raw;
  authMessage.style.color = authMessageState.isError ? "#ffb6a8" : "#fff2ad";
}

function applyLanguage(nextLanguage) {
  currentLanguage = nextLanguage === "en" ? "en" : "ko";
  localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  document.documentElement.lang = currentLanguage;
  document.title = "Starling Sprint";
  if (metaDescription) {
    metaDescription.setAttribute("content", t("meta_description"));
  }
  if (languageSelect) {
    languageSelect.value = currentLanguage;
    languageSelect.querySelector('option[value="en"]').textContent = "English";
    languageSelect.querySelector('option[value="ko"]').textContent = "\uD55C\uAD6D\uC5B4";
  }

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel));
  });

  difficultySelect.querySelector('option[value="easy"]').textContent = getDifficultyLabel("easy");
  difficultySelect.querySelector('option[value="normal"]').textContent = getDifficultyLabel("normal");
  difficultySelect.querySelector('option[value="hard"]').textContent = getDifficultyLabel("hard");
  screenModeSelect.querySelector('option[value="fullscreen"]').textContent = getScreenModeLabel("fullscreen");
  screenModeSelect.querySelector('option[value="classic"]').textContent = getScreenModeLabel("classic");
  controlModeSelect.querySelector('option[value="desktop"]').textContent = t("control_desktop");
  controlModeSelect.querySelector('option[value="mobile"]').textContent = t("control_mobile");
  updateMuteButtonLabel();
  updateBgmControls();
  setMultiplayerStatus(multiplayerState.status);

  for (const option of stageSelect.options) {
    option.textContent = getStageDisplayName(Number(option.value));
  }

  if (shopTabCharacters?.parentElement) {
    shopTabCharacters.parentElement.setAttribute("aria-label", t("shop_tabs_label"));
  }

  if (Number.isInteger(currentStageIndex) && STAGE_DEFS[currentStageIndex]) {
    level.name = getStageDisplayName(currentStageIndex);
  }

  renderAuthMessageState();
  updateStageSelectLocks();
  syncLobbyAccountUI();
  if (lootBoxState.active) {
    if (lootBoxState.revealReady) {
      renderLootBoxResultGrid();
    } else if (lootboxStageText) {
      lootboxStageText.textContent = `${getBoxDisplayName(lootBoxState.boxId)} · ${t("box_opening")}`;
    }
  } else if (lootboxStageText) {
    lootboxStageText.textContent = t("box_opening");
  }
}

function isAssassinEquipped() {
  return shopState.equippedCharacter === "assassin";
}

function isChangerEquipped() {
  return shopState.equippedCharacter === "changer";
}

function isGuardianEquipped() {
  return shopState.equippedCharacter === "guardian";
}

function isLightnerEquipped() {
  return shopState.equippedCharacter === "lightner";
}

function isWildHunterEquipped() {
  return shopState.equippedCharacter === "wildHunter";
}

function isChangerAngelDemonSkinEquipped() {
  return isChangerEquipped() && shopState.equippedSkin === "angelDemon";
}

function isCyberSkinEquipped() {
  return shopState.equippedSkin === "cyber";
}

function isVoidKingSkinEquipped() {
  return shopState.equippedSkin === "voidKing";
}

function isOvergearB08SkinEquipped() {
  return shopState.equippedSkin === "overgearB08";
}

function isAwakenedStateActive() {
  return lightnerState.awakenTimer > 0 || wildHunterState.awakenTimer > 0;
}

function randomOvergearElectricInterval() {
  return OVERGEAR_ELECTRIC_MIN_INTERVAL + Math.random() * (OVERGEAR_ELECTRIC_MAX_INTERVAL - OVERGEAR_ELECTRIC_MIN_INTERVAL);
}

function randomOvergearElectricOutage() {
  return OVERGEAR_ELECTRIC_MIN_OUTAGE + Math.random() * (OVERGEAR_ELECTRIC_MAX_OUTAGE - OVERGEAR_ELECTRIC_MIN_OUTAGE);
}

function updateOvergearElectricState(dt) {
  if (!isOvergearB08SkinEquipped()) {
    overgearElectricState.outageTimer = 0;
    overgearElectricState.noiseTimer = 0;
    overgearElectricState.nextOutageTimer = Math.min(overgearElectricState.nextOutageTimer, randomOvergearElectricInterval());
    return;
  }

  if (isAwakenedStateActive()) {
    overgearElectricState.outageTimer = 0;
    overgearElectricState.noiseTimer = 0;
    overgearElectricState.nextOutageTimer = Math.max(overgearElectricState.nextOutageTimer, OVERGEAR_ELECTRIC_MIN_INTERVAL);
    return;
  }

  if (overgearElectricState.outageTimer > 0) {
    overgearElectricState.outageTimer = Math.max(0, overgearElectricState.outageTimer - dt);
    if (overgearElectricState.outageTimer <= 0) {
      overgearElectricState.noiseTimer = OVERGEAR_ELECTRIC_NOISE_DURATION;
      overgearElectricState.nextOutageTimer = randomOvergearElectricInterval();
    }
    return;
  }

  overgearElectricState.noiseTimer = Math.max(0, overgearElectricState.noiseTimer - dt);
  overgearElectricState.nextOutageTimer -= dt;
  if (overgearElectricState.nextOutageTimer <= 0) {
    overgearElectricState.outageTimer = randomOvergearElectricOutage();
    overgearElectricState.noiseTimer = 0;
  }
}

function getSimpleSkinPalette() {
  if (shopState.equippedSkin === "overgearB08") {
    return {
      primary: "#8f5d32",
      secondary: "#5e3a24",
      dark: "#241915",
      accent: "#b88745",
      glow: "#8fefff",
    };
  }
  if (shopState.equippedSkin === "desert") {
    return {
      primary: "#c89256",
      secondary: "#8d6236",
      dark: "#4c3725",
      accent: "#e6c58a",
      glow: "#fff0c8",
    };
  }
  if (shopState.equippedSkin === "forest") {
    return {
      primary: "#4f8a57",
      secondary: "#355f3c",
      dark: "#1d3524",
      accent: "#9fc47d",
      glow: "#dff2c7",
    };
  }
  if (shopState.equippedSkin === "stone") {
    return {
      primary: "#8f98a4",
      secondary: "#67707b",
      dark: "#313740",
      accent: "#c9d0d8",
      glow: "#eef3f7",
    };
  }
  return null;
}

function getLightnerSkinPalette() {
  if (shopState.equippedSkin === "overgearB08") {
    return {
      hood: "#211613",
      coat: "#8f5d32",
      coatDark: "#5e3a24",
      mask: "#160f0d",
      pants: "#241915",
      arm: "#6b4327",
      trim: "#b88745",
      eye: "#8fefff",
      lightningRgb: "143, 239, 255",
      lightningSolid: "#8fefff",
      awakenRgb: "175, 248, 255",
    };
  }

  const simpleSkin = getSimpleSkinPalette();
  if (simpleSkin) {
    return {
      hood: simpleSkin.dark,
      coat: simpleSkin.primary,
      coatDark: simpleSkin.secondary,
      mask: simpleSkin.dark,
      pants: simpleSkin.dark,
      arm: simpleSkin.secondary,
      trim: simpleSkin.accent,
      eye: simpleSkin.glow,
      lightningRgb: "255, 215, 0",
      lightningSolid: simpleSkin.glow,
      awakenRgb: "255, 223, 45",
    };
  }

  if (shopState.equippedSkin === "cyber") {
    return {
      hood: "#05070e",
      coat: "#10172a",
      coatDark: "#1e2750",
      mask: "#05070e",
      pants: "#070a14",
      arm: "#18204a",
      trim: "#9d67ff",
      eye: "#77eaff",
      lightningRgb: "119, 234, 255",
      lightningSolid: "#77eaff",
      awakenRgb: "157, 103, 255",
    };
  }

  if (shopState.equippedSkin === "voidKing") {
    return {
      hood: "#050507",
      coat: "#111116",
      coatDark: "#1c1b23",
      mask: "#050507",
      pants: "#08080a",
      arm: "#2e0a0d",
      trim: "#611318",
      eye: "#ff9b9b",
      lightningRgb: "210, 30, 40",
      lightningSolid: "#ff9b9b",
      awakenRgb: "255, 76, 76",
    };
  }

  if (shopState.equippedSkin === "admin") {
    return {
      hood: "#090806",
      coat: "#1d1720",
      coatDark: "#352315",
      mask: "#050506",
      pants: "#08080a",
      arm: "#2c2012",
      trim: "#d3901d",
      eye: "#fff7b3",
      lightningRgb: "255, 217, 94",
      lightningSolid: "#fff7b3",
      awakenRgb: "255, 247, 179",
    };
  }

  if (shopState.equippedSkin === "angelDemon") {
    return {
      hood: "#121018",
      coat: "#f0e7da",
      coatDark: "#3b235c",
      mask: "#090711",
      pants: "#110c1a",
      arm: "#33204f",
      trim: "#f3c66b",
      eye: "#ffe69a",
      lightningRgb: "169, 78, 255",
      lightningSolid: "#f3c66b",
      awakenRgb: "243, 198, 107",
    };
  }

  return {
    hood: "#020304",
    coat: "#0a0c0f",
    coatDark: "#121315",
    mask: "#050506",
    pants: "#050506",
    arm: "#0d0d0f",
    trim: "#ffd700",
    eye: "#ffd700",
    lightningRgb: "255, 215, 0",
    lightningSolid: "#ffd700",
    awakenRgb: "255, 223, 45",
  };
}

function getStartingLives() {
  if (isAssassinEquipped() && difficulty.label !== "Hard") {
    return Math.max(1, difficulty.lives - 1);
  }
  if (isWildHunterEquipped()) {
    return Math.max(1, difficulty.lives - WILD_HUNTER_RULES.lifePenalty);
  }
  return difficulty.lives;
}

function normalizeNickname(value) {
  return value.trim().slice(0, 20);
}

function readAuthFieldValue(input) {
  return typeof input?.value === "string" ? input.value : "";
}

function getAuthDom() {
  return {
    loginNickname: document.getElementById("loginNickname"),
    loginPassword: document.getElementById("loginPassword"),
    signupNickname: document.getElementById("signupNickname"),
    signupPassword: document.getElementById("signupPassword"),
    loginButton: document.getElementById("loginButton"),
    signupButton: document.getElementById("signupButton"),
    logoutButton: document.getElementById("logoutButton"),
  };
}

function getLoginCredentials() {
  const authDom = getAuthDom();
  return {
    nickname: normalizeNickname(readAuthFieldValue(authDom.loginNickname)),
    password: readAuthFieldValue(authDom.loginPassword).trim().slice(0, 20),
  };
}

function getSignupCredentials() {
  const authDom = getAuthDom();
  return {
    nickname: normalizeNickname(readAuthFieldValue(authDom.signupNickname)),
    password: readAuthFieldValue(authDom.signupPassword).trim().slice(0, 20),
  };
}

function getAccountByNickname(accounts, nickname) {
  if (!nickname || !accounts || typeof accounts !== "object") {
    return null;
  }
  return accounts[nickname] || null;
}

function readAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    if (!raw) {
      return {};
    }
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") {
      return {};
    }
    let changed = false;
    for (const account of Object.values(data)) {
      changed = ensureAccountMeta(account) || changed;
    }
    if (changed) {
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(data));
    }
    return syncAdminAccountPassword(syncBetaAccountCoins(data));
  } catch (_) {
    return {};
  }
}

function writeAccounts(accounts) {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
}

function syncAdminAccountPassword(accounts) {
  if (!accounts || typeof accounts !== "object") {
    return accounts;
  }
  const legacyAdminAccount = accounts[LEGACY_ADMIN_NICKNAME];
  if (!accounts[ADMIN_NICKNAME] || typeof accounts[ADMIN_NICKNAME] !== "object") {
    accounts[ADMIN_NICKNAME] = {
      password: ADMIN_PASSWORD_RESET,
      isAdmin: true,
      hasBetaReward: Boolean(legacyAdminAccount?.hasBetaReward),
      lastSeenPatchNoteVersion: legacyAdminAccount?.lastSeenPatchNoteVersion || "",
      progress: legacyAdminAccount?.progress && typeof legacyAdminAccount.progress === "object"
        ? legacyAdminAccount.progress
        : createDefaultProgress(),
    };
    writeAccounts(accounts);
    return accounts;
  }

  const adminAccount = accounts[ADMIN_NICKNAME];
  let changed = false;
  if (legacyAdminAccount && typeof legacyAdminAccount === "object") {
    if (!adminAccount.progress || typeof adminAccount.progress !== "object") {
      adminAccount.progress = legacyAdminAccount.progress && typeof legacyAdminAccount.progress === "object"
        ? legacyAdminAccount.progress
        : createDefaultProgress();
      changed = true;
    }
    if (!adminAccount.hasBetaReward && legacyAdminAccount.hasBetaReward) {
      adminAccount.hasBetaReward = true;
      changed = true;
    }
    if (!adminAccount.lastSeenPatchNoteVersion && legacyAdminAccount.lastSeenPatchNoteVersion) {
      adminAccount.lastSeenPatchNoteVersion = legacyAdminAccount.lastSeenPatchNoteVersion;
      changed = true;
    }
  }
  if (adminAccount.password !== ADMIN_PASSWORD_RESET) {
    adminAccount.password = ADMIN_PASSWORD_RESET;
    changed = true;
  }
  if (!adminAccount.isAdmin) {
    adminAccount.isAdmin = true;
    changed = true;
  }
  changed = ensureAccountMeta(adminAccount) || changed;
  if (!adminAccount.progress || typeof adminAccount.progress !== "object") {
    adminAccount.progress = createDefaultProgress();
    changed = true;
  }
  if (!changed) {
    return accounts;
  }
  writeAccounts(accounts);
  return accounts;
}

function ensureAccountMeta(account) {
  if (!account || typeof account !== "object") {
    return false;
  }
  let changed = false;
  if (typeof account.hasBetaReward !== "boolean") {
    account.hasBetaReward = false;
    changed = true;
  }
  if (typeof account.lastSeenPatchNoteVersion !== "string") {
    account.lastSeenPatchNoteVersion = "";
    changed = true;
  }
  return changed;
}

function syncBetaAccountCoins(accounts) {
  const betaAccount = accounts?.[BETA_ACCOUNT_NICKNAME];
  if (!betaAccount || typeof betaAccount !== "object") {
    return accounts;
  }

  betaAccount.progress = betaAccount.progress || createDefaultProgress();
  betaAccount.progress.shopState = betaAccount.progress.shopState || createDefaultProgress().shopState;

  if ((betaAccount.progress.shopState.coins || 0) >= BETA_ACCOUNT_COINS) {
    return accounts;
  }

  betaAccount.progress.shopState.coins = BETA_ACCOUNT_COINS;
  writeAccounts(accounts);
  return accounts;
}

function createDefaultProgress() {
  return {
    score: 0,
    unlockedStageIndex: 0,
    selectedStageIndex: 0,
    activeDifficultyKey: difficultySelect.value,
    screenMode: screenModeSelect.value,
    controlMode: controlModeSelect.value,
    shopState: {
      ownedCharacters: getDefaultOwnedCharacters(),
      ownedSkins: getDefaultOwnedSkins(),
      coins: 0,
      premiumBoxCounter: 0,
      weeklyBoxPriceWeek: "",
      weeklyCharacterSaleWeek: "",
      boxPrices: createDefaultBoxPrices(),
      characterSales: {},
      boxInventory: createDefaultBoxInventory(),
      equippedCharacter: "starling",
      equippedSkin: "classic",
    },
  };
}

function setAuthMessage(message, isError = false) {
  authMessageState.key = null;
  authMessageState.vars = {};
  authMessageState.raw = message;
  authMessageState.isError = isError;
  renderAuthMessageState();
}

function setAuthMessageKey(key, vars = {}, isError = false) {
  authMessageState.key = key;
  authMessageState.vars = vars;
  authMessageState.raw = "";
  authMessageState.isError = isError;
  renderAuthMessageState();
}

function applyShopEntitlements() {
  shopState.boxInventory = normalizeBoxInventory(shopState.boxInventory);
  shopState.boxPrices = normalizeBoxPrices(shopState.boxPrices);
  shopState.characterSales = normalizeCharacterSales(shopState.characterSales);
  shopState.premiumBoxCounter = Math.max(0, Math.floor(shopState.premiumBoxCounter || 0));
  shopState.weeklyBoxPriceWeek = typeof shopState.weeklyBoxPriceWeek === "string" ? shopState.weeklyBoxPriceWeek : "";
  shopState.weeklyCharacterSaleWeek = typeof shopState.weeklyCharacterSaleWeek === "string" ? shopState.weeklyCharacterSaleWeek : "";
  if (accountState.isAdmin) {
    shopState.ownedCharacters = [...SHOP_CATALOG.characters];
    shopState.ownedSkins = [...SHOP_CATALOG.skins];
    shopState.coins = Math.max(0, Math.floor(shopState.coins || 0));
    shopState.equippedSkin = "admin";
  } else {
    shopState.ownedCharacters = shopState.ownedCharacters.filter((item) => SHOP_CATALOG.characters.includes(item));
    shopState.ownedSkins = shopState.ownedSkins.filter((item) => SHOP_CATALOG.skins.includes(item));
    shopState.coins = Math.max(0, Math.floor(shopState.coins || 0));
    if (shopState.ownedCharacters.length === 0) {
      shopState.ownedCharacters = getDefaultOwnedCharacters();
    }
    if (shopState.ownedSkins.length === 0) {
      shopState.ownedSkins = getDefaultOwnedSkins();
    }
  }

  if (!shopState.ownedCharacters.includes(shopState.equippedCharacter)) {
    shopState.equippedCharacter = shopState.ownedCharacters[0];
  }
  if (!shopState.ownedSkins.includes(shopState.equippedSkin)) {
    shopState.equippedSkin = shopState.ownedSkins[0];
  }
}

function syncLobbyAccountUI() {
  const nickname = accountState.currentNickname || t("account_guest");
  const adminTag = accountState.isAdmin ? t("account_admin") : t("account_player");
  shopStatus.textContent = accountState.isAdmin
    ? t("shop_status_admin")
    : t("shop_status_player");
  accountSummary.textContent = t("account_summary", {
    nickname,
    tag: adminTag,
    score: score.toString().padStart(5, "0"),
  });
  accountTitleBadge.textContent = accountState.isAdmin
    ? t("account_title_badge", { title: t("admin_title") })
    : "";
  accountTitleBadge.classList.toggle("hidden", !accountState.isAdmin);
  openPatchNotesButton?.classList.toggle("hidden", !accountState.currentNickname);
  coinBalance.textContent = t("coins_label", { coins: shopState.coins });
  shopSeasonBadge.textContent = getSeasonLabel();
  shopSeasonBadge.classList.toggle("hidden", !hasLimitedSkins());
  equippedCharacterBadge.textContent = t("equipped_label", { name: formatCatalogName(shopState.equippedCharacter) });
  equippedSkinBadge.textContent = t("equipped_label", { name: formatCatalogName(shopState.equippedSkin) });
  renderBetaRewardPanel();
  renderCollectionList(characterCollection, shopState.ownedCharacters, shopState.equippedCharacter, "character");
  renderCollectionList(skinCollection, shopState.ownedSkins, shopState.equippedSkin, "skin");
  syncWeeklyEconomy();
  renderShopCatalog();
}

function showAuthPanel(showAuth) {
  authPanel.classList.toggle("hidden", !showAuth);
  lobbyPanel.classList.toggle("hidden", showAuth);
}

function renderCollectionList(container, ownedItems, equippedItem, type) {
  if (!container) {
    return;
  }

  container.innerHTML = "";
  for (const item of ownedItems) {
    const card = document.createElement("div");
    card.className = `collection-item${item === equippedItem ? " active" : ""}`;

    const meta = document.createElement("div");
    meta.className = "collection-meta";
    const title = document.createElement("strong");
    title.textContent = formatCatalogName(item);
    const sub = document.createElement("span");
    if (item === equippedItem) {
      sub.textContent = t("equipped_with_summary", { summary: getCatalogSummary(type, item) });
    }
    sub.textContent = item === equippedItem
      ? t("equipped_with_summary", { summary: getCatalogSummary(type, item) })
      : getCatalogSummary(type, item);
    meta.append(title, sub);
    if (item === equippedItem) {
      sub.textContent = t("equipped_with_summary", { summary: getCatalogSummary(type, item) });
    }

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = item === equippedItem ? t("equipped_button") : t("equip_button");
    button.disabled = item === equippedItem;
    button.addEventListener("click", () => {
      if (type === "character") {
        shopState.equippedCharacter = item;
      } else {
        shopState.equippedSkin = item;
      }
      syncLobbyAccountUI();
      savePersistentProgress(true);
    });

    card.append(meta, button);
    container.append(card);
  }
}

function renderShopCatalog() {
  if (!shopCatalogList) {
    return;
  }

  if (shopUiState.activeTab === "skin" && !shopTabSkins) {
    shopUiState.activeTab = "character";
  }

  const isCharacterTab = shopUiState.activeTab === "character";
  const isSkinTab = shopUiState.activeTab === "skin";
  const isBoxTab = shopUiState.activeTab === "box";

  shopTabCharacters.classList.toggle("active", isCharacterTab);
  shopTabCharacters.setAttribute("aria-pressed", String(isCharacterTab));
  shopTabSkins?.classList.toggle("active", isSkinTab);
  shopTabSkins?.setAttribute("aria-pressed", String(isSkinTab));
  shopTabBoxes?.classList.toggle("active", isBoxTab);
  shopTabBoxes?.setAttribute("aria-pressed", String(isBoxTab));
  shopCatalogList.classList.toggle("box-catalog", isBoxTab);
  shopCatalogList.innerHTML = "";

  if (isBoxTab) {
    renderLootBoxShopCatalog();
    return;
  }

  const defs = isCharacterTab ? CHARACTER_DEFS : SKIN_DEFS;
  const items = isCharacterTab ? SHOP_CATALOG.characters : SHOP_CATALOG.skins;
  const ownedItems = isCharacterTab ? shopState.ownedCharacters : shopState.ownedSkins;
  for (const item of items) {
    const def = defs[item];
    const owned = accountState.isAdmin || ownedItems.includes(item);
    const limited = !isCharacterTab && isLimitedSkin(item);
    const available = accountState.isAdmin || !limited || isLimitedSkinAvailable(item);

    const card = document.createElement("div");
    card.className = `store-item${def.tier === "special" || def.tier === "mythic" ? " premium" : ""}`;

    const meta = document.createElement("div");
    meta.className = "store-meta";

    const titleRow = document.createElement("div");
    titleRow.className = "store-title-row";
    const title = document.createElement("strong");
    title.textContent = formatCatalogName(item);
    titleRow.append(title);

    const typeTag = document.createElement("span");
    typeTag.className = `tag ${limited ? "limited" : "general"}`;
    typeTag.textContent = limited
      ? t("tag_limited")
      : isCharacterTab
        ? t("tag_character")
        : t(getRarityTagKey(getSkinRarity(item)));
    titleRow.append(typeTag);

    const subline = document.createElement("div");
    subline.className = "store-subline";
    const summary = document.createElement("span");
    summary.textContent = getCatalogSummary(shopUiState.activeTab, item);
    subline.append(summary);

    const price = document.createElement("span");
    price.className = "store-price";
    if (def.purchasable) {
      if (isCharacterTab && isCharacterOnSale(item)) {
        price.textContent = t("sale_price", {
          sale: t("price_coins", { price: getCharacterCurrentPrice(item) }),
          base: t("price_coins", { price: def.price }),
        });
      } else {
        price.textContent = t("price_coins", { price: def.price });
      }
    } else {
      price.textContent = isCharacterTab ? t("default_character") : item === "admin" ? t("admin_only") : t("default_skin");
    }
    subline.append(price);

    if (isCharacterTab && isCharacterOnSale(item)) {
      const saleTag = document.createElement("span");
      saleTag.className = "tag limited";
      saleTag.textContent = `${t("sale_badge")} · ${t("sale_rate", { rate: getCharacterSaleRate(item) })}`;
      subline.append(saleTag);
    }

    meta.append(titleRow, subline);

    const action = document.createElement("button");
    action.type = "button";
    if (owned) {
      action.textContent = "\uBCF4\uC720 \uC911";
      action.disabled = true;
    } else if (!def.purchasable) {
      action.textContent = "\uAD6C\uB9E4 \uBD88\uAC00";
      action.disabled = true;
    } else if (!available) {
      action.textContent = "\uC2DC\uC98C \uC885\uB8CC";
      action.disabled = true;
    } else if (!accountState.isAdmin && shopState.coins < (isCharacterTab ? getCharacterCurrentPrice(item) : def.price)) {
      action.textContent = "\uCF54\uC778 \uBD80\uC871";
      action.disabled = true;
    } else {
      action.textContent = `\uAD6C\uB9E4 ${def.price}`;
      action.addEventListener("click", () => purchaseShopItem(shopUiState.activeTab, item));
    }

    action.textContent = getShopActionLabel({
      owned,
      purchasable: def.purchasable,
      available,
      canAfford: accountState.isAdmin || shopState.coins >= (isCharacterTab ? getCharacterCurrentPrice(item) : def.price),
      price: isCharacterTab ? getCharacterCurrentPrice(item) : def.price,
    });
    card.append(meta, action);
    shopCatalogList.append(card);
  }
}

function renderLootBoxShopCatalog() {
  for (const boxId of LOOT_BOX_ORDER) {
    const def = LOOT_BOX_DEFS[boxId];
    const card = document.createElement("article");
    card.className = `lootbox-shop-card ${boxId}`;

    const headerPlate = document.createElement("div");
    headerPlate.className = "lootbox-shop-header";
    const title = document.createElement("strong");
    title.textContent = getBoxDisplayName(boxId);
    headerPlate.append(title);

    const rarityPlate = document.createElement("div");
    rarityPlate.className = "lootbox-shop-rarity";
    rarityPlate.textContent = def.probabilities.map((entry) => getRarityLabel(entry.rarity)).join(" / ");

    const artWrap = document.createElement("div");
    artWrap.className = "lootbox-shop-art";
    const aura = document.createElement("div");
    aura.className = "lootbox-shop-aura";
    const box = document.createElement("div");
    box.className = `lootbox-shop-box ${boxId}`;
    box.innerHTML = `
      <span class="box-lid"></span>
      <span class="box-body"></span>
      <span class="box-band left"></span>
      <span class="box-band right"></span>
      <span class="box-rivet tl"></span>
      <span class="box-rivet tr"></span>
      <span class="box-rivet bl"></span>
      <span class="box-rivet br"></span>
      <span class="box-core"></span>
      <span class="box-side-glow"></span>
    `;
    artWrap.append(aura, box);

    const summary = document.createElement("p");
    summary.className = "lootbox-shop-summary";
    summary.textContent = getBoxSummary(boxId);

    const statPanel = document.createElement("div");
    statPanel.className = "lootbox-shop-stat";
    const price = document.createElement("span");
    price.className = "store-price";
    const currentPrice = getBoxCurrentPrice(boxId);
    price.textContent = t("this_week_price", { price: t("price_coins", { price: currentPrice }) });
    const owned = document.createElement("span");
    owned.className = "store-price";
    owned.textContent = t("box_inventory", {
      count: shopState.boxInventory[boxId] || 0,
    });
    statPanel.append(price, owned);

    const infoPanel = document.createElement("div");
    infoPanel.className = "lootbox-shop-info";
    const weeklyPriceCopy = formatPriceDelta(getBoxPriceDelta(boxId));
    infoPanel.textContent = boxId === "premium"
      ? `${t("box_status_inventory")} · ${weeklyPriceCopy} · ${t("premium_pity_status", { count: getPremiumPityRemaining() })}`
      : `${t("box_status_inventory")} · ${weeklyPriceCopy}`;

    const actions = document.createElement("div");
    actions.className = `store-actions lootbox-shop-actions ${boxId}`;
    for (const count of [1, 5, 10]) {
      const ownedBoxes = shopState.boxInventory[boxId] || 0;
      const missingCount = Math.max(0, count - ownedBoxes);
      const requiredCoins = missingCount * currentPrice;
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = ownedBoxes >= count
        ? t("box_batch_button", { count })
        : t("box_buy_and_open", { count });
      button.disabled = !accountState.isAdmin && shopState.coins < requiredCoins;
      button.addEventListener("click", () => {
        openLootBoxes(boxId, count);
      });
      actions.append(button);
    }

    card.append(headerPlate, rarityPlate, artWrap, summary, statPanel, infoPanel, actions);
    shopCatalogList.append(card);
  }
}

function purchaseShopItem(type, item) {
  const defs = type === "character" ? CHARACTER_DEFS : SKIN_DEFS;
  const ownedItems = type === "character" ? shopState.ownedCharacters : shopState.ownedSkins;
  const def = defs[item];
  if (!def || !def.purchasable || ownedItems.includes(item)) {
    return;
  }
  if (type === "skin" && isLimitedSkin(item) && !accountState.isAdmin && !isLimitedSkinAvailable(item)) {
    return;
  }
  const currentPrice = type === "character" ? getCharacterCurrentPrice(item) : def.price;
  if (!accountState.isAdmin && shopState.coins < currentPrice) {
    return;
  }

  if (!accountState.isAdmin) {
    shopState.coins -= currentPrice;
  }

  ownedItems.push(item);
  if (type === "character") {
    shopState.equippedCharacter = item;
  } else {
    shopState.equippedSkin = item;
  }

  syncLobbyAccountUI();
  savePersistentProgress(true);
}

function openLootBoxes(boxId, count) {
  if (!accountState.currentNickname || lootBoxState.active || !LOOT_BOX_DEFS[boxId] || count <= 0) {
    return;
  }

  const boxDef = LOOT_BOX_DEFS[boxId];
  const ownedBoxes = shopState.boxInventory[boxId] || 0;
  const consumeFromInventory = Math.min(count, ownedBoxes);
  const purchaseCount = count - consumeFromInventory;
  const currentPrice = getBoxCurrentPrice(boxId);
  const requiredCoins = purchaseCount * currentPrice;
  if (!accountState.isAdmin && shopState.coins < requiredCoins) {
    return;
  }

  if (!accountState.isAdmin) {
    shopState.coins -= requiredCoins;
    shopState.boxInventory[boxId] = ownedBoxes - consumeFromInventory;
  }

  const tempOwned = new Set(shopState.ownedSkins);
  const results = [];
  let refund = 0;
  let premiumCounter = Math.max(0, Math.floor(shopState.premiumBoxCounter || 0));
  for (let index = 0; index < count; index += 1) {
    let roll = null;
    if (boxId === "premium") {
      premiumCounter += 1;
      if (premiumCounter >= PREMIUM_BOX_PITY_TARGET) {
        roll = getRandomSkinFromAllowedRarities(["legendary"]);
      }
    }
    roll = roll || rollLootBoxSkin(boxId);
    if (!roll) {
      continue;
    }

    if (boxId === "premium") {
      if (["legendary", "mythic"].includes(roll.rarity)) {
        premiumCounter = 0;
      }
    }

    const duplicate = accountState.isAdmin || tempOwned.has(roll.skinId);
    if (duplicate) {
      refund += Math.floor(currentPrice * 0.55);
    } else {
      tempOwned.add(roll.skinId);
    }
    results.push({
      ...roll,
      duplicate,
    });
  }
  if (boxId === "premium") {
    shopState.premiumBoxCounter = premiumCounter;
  }

  lootBoxState.active = true;
  lootBoxState.revealReady = false;
  lootBoxState.timer = LOOTBOX_ANIMATION_DURATION;
  lootBoxState.boxId = boxId;
  lootBoxState.count = count;
  lootBoxState.results = results;
  lootBoxState.refund = refund;

  lootboxPanel?.classList.remove("hidden");
  lootboxStage?.classList.remove("hidden");
  lootboxResults?.classList.add("hidden");
  if (lootboxBox) {
    lootboxBox.className = `lootbox-box ${boxId} shake`;
    lootboxBox.innerHTML = `
      <span class="box-lid"></span>
      <span class="box-body"></span>
      <span class="box-band left"></span>
      <span class="box-band right"></span>
      <span class="box-rivet tl"></span>
      <span class="box-rivet tr"></span>
      <span class="box-rivet bl"></span>
      <span class="box-rivet br"></span>
      <span class="box-core"></span>
      <span class="box-side-glow"></span>
      <span class="box-stage-aura"></span>
    `;
  }
  if (lootboxStageText) {
    lootboxStageText.textContent = `${getBoxDisplayName(boxId)} · ${t("box_opening")}`;
  }
  playSound("boxShake");
  syncLobbyAccountUI();
  savePersistentProgress(true);
}

function revealLootBoxResults() {
  if (!lootBoxState.active || lootBoxState.revealReady) {
    return;
  }

  lootBoxState.revealReady = true;
  if (lootboxBox) {
    lootboxBox.classList.remove("shake");
    lootboxBox.classList.add("open");
  }
  playSound("boxOpen");

  for (const result of lootBoxState.results) {
    if (!result.duplicate && !accountState.isAdmin && !shopState.ownedSkins.includes(result.skinId)) {
      shopState.ownedSkins.push(result.skinId);
    }
  }
  if (!accountState.isAdmin) {
    shopState.coins += lootBoxState.refund;
  }

  renderLootBoxResultGrid();
  if (lootBoxState.revealTimeoutId) {
    clearTimeout(lootBoxState.revealTimeoutId);
  }
  lootBoxState.revealTimeoutId = setTimeout(() => {
    lootboxStage?.classList.add("hidden");
    lootboxResults?.classList.remove("hidden");
    const revealSound = getLootBoxRevealSound(lootBoxState.results);
    playSound("resultReveal");
    if (revealSound !== "resultReveal") {
      playSound(revealSound);
    }
    lootBoxState.revealTimeoutId = null;
  }, 280);
  syncLobbyAccountUI();
  savePersistentProgress(true);
}

function renderLootBoxResultGrid() {
  if (!lootboxResultGrid || !lootboxSummary) {
    return;
  }

  lootboxResultGrid.innerHTML = "";
  for (const result of lootBoxState.results) {
    const card = document.createElement("div");
    card.className = `lootbox-result-card ${result.rarity}`;

    const title = document.createElement("strong");
    title.textContent = getSkinDisplayName(result.skinId);

    const rarity = document.createElement("span");
    rarity.textContent = getRarityLabel(result.rarity);

    card.append(title, rarity);

    if (result.duplicate) {
      const refund = document.createElement("span");
      refund.textContent = `${t("box_duplicate_refund")} +${Math.floor(getBoxCurrentPrice(lootBoxState.boxId) * 0.55)}`;
      card.append(refund);
    }

    lootboxResultGrid.append(card);
  }

  lootboxSummary.textContent = t("box_status_result", {
    count: lootBoxState.results.length,
    refund: lootBoxState.refund,
  });
}

function closeLootBoxPanel() {
  if (lootBoxState.revealTimeoutId) {
    clearTimeout(lootBoxState.revealTimeoutId);
  }
  stopMythicRevealSound();
  lootBoxState.active = false;
  lootBoxState.revealReady = false;
  lootBoxState.timer = 0;
  lootBoxState.boxId = "";
  lootBoxState.count = 0;
  lootBoxState.results = [];
  lootBoxState.refund = 0;
  lootBoxState.revealTimeoutId = null;
  lootboxPanel?.classList.add("hidden");
  lootboxStage?.classList.remove("hidden");
  lootboxResults?.classList.add("hidden");
  if (lootboxBox) {
    lootboxBox.className = "lootbox-box";
    lootboxBox.innerHTML = "";
  }
}

function skipLootBoxAnimation() {
  if (!lootBoxState.active) {
    return;
  }
  lootBoxState.timer = 0;
  revealLootBoxResults();
}

function updateLootBoxAnimation(dt) {
  if (!lootBoxState.active || lootBoxState.revealReady) {
    return;
  }
  lootBoxState.timer = Math.max(0, lootBoxState.timer - dt);
  if (lootBoxState.timer <= 0) {
    revealLootBoxResults();
  }
}

function awardLootBox(boxId, amount = 1) {
  if (!LOOT_BOX_DEFS[boxId] || amount <= 0) {
    return;
  }
  shopState.boxInventory[boxId] = (shopState.boxInventory[boxId] || 0) + amount;
  setAuthMessage(t("box_reward_gain", { name: getBoxDisplayName(boxId) }));
  savePersistentProgress(true);
}

function rollStageClearBoxReward() {
  const rewards = STAGE_BOX_REWARD_CHANCES[activeDifficultyKey] || [];
  for (const reward of rewards) {
    if (Math.random() < reward.chance) {
      awardLootBox(reward.boxId, 1);
      break;
    }
  }
}

function getLootBoxRevealSound(results) {
  let bestRank = -1;
  let bestType = "resultReveal";
  const rarityRanks = {
    general: 0,
    rare: 1,
    epic: 2,
    legendary: 3,
    mythic: 4,
  };
  const raritySoundMap = {
    general: "resultReveal",
    rare: "resultReveal",
    epic: "resultRevealEpic",
    legendary: "resultRevealLegendary",
    mythic: "resultRevealMythic",
  };

  for (const result of results) {
    const rank = rarityRanks[result.rarity] ?? 0;
    if (rank > bestRank) {
      bestRank = rank;
      bestType = raritySoundMap[result.rarity] || "resultReveal";
    }
  }

  return bestType;
}

function createSaveData() {
  return {
    score,
    unlockedStageIndex,
    selectedStageIndex,
    activeDifficultyKey,
    screenMode,
    controlMode,
    shopState: {
      ownedCharacters: [...shopState.ownedCharacters],
      ownedSkins: [...shopState.ownedSkins],
      coins: shopState.coins,
      premiumBoxCounter: shopState.premiumBoxCounter,
      weeklyBoxPriceWeek: shopState.weeklyBoxPriceWeek,
      weeklyCharacterSaleWeek: shopState.weeklyCharacterSaleWeek,
      boxPrices: { ...normalizeBoxPrices(shopState.boxPrices) },
      characterSales: { ...normalizeCharacterSales(shopState.characterSales) },
      boxInventory: { ...normalizeBoxInventory(shopState.boxInventory) },
      equippedCharacter: shopState.equippedCharacter,
      equippedSkin: shopState.equippedSkin,
    },
  };
}

function savePersistentProgress(force = false) {
  if (!accountState.currentNickname) {
    return;
  }

  try {
    const nextStateJson = JSON.stringify(createSaveData());
    if (!force && nextStateJson === lastSavedStateJson) {
      return;
    }
    const accounts = readAccounts();
    const account = accounts[accountState.currentNickname];
    if (!account) {
      return;
    }
    account.progress = JSON.parse(nextStateJson);
    writeAccounts(accounts);
    lastSavedStateJson = nextStateJson;
  } catch (_) {
    // Ignore storage failures so gameplay keeps working.
  }
}

function loadPersistentProgress() {
  try {
    let currentNickname = localStorage.getItem(CURRENT_ACCOUNT_KEY);
    const accounts = syncAdminAccountPassword(readAccounts());
    if (currentNickname === LEGACY_ADMIN_NICKNAME && accounts[ADMIN_NICKNAME]) {
      currentNickname = ADMIN_NICKNAME;
      localStorage.setItem(CURRENT_ACCOUNT_KEY, ADMIN_NICKNAME);
    }
    if (!currentNickname || !accounts[currentNickname]) {
      accountState.currentNickname = null;
      accountState.isAdmin = false;
      accountState.hasBetaReward = false;
      accountState.lastSeenPatchNoteVersion = "";
      applyShopEntitlements();
      setAuthMessageKey("auth_signin_prompt");
      lastSavedStateJson = "";
      return;
    }

    accountState.currentNickname = currentNickname;
    accountState.isAdmin = Boolean(accounts[currentNickname].isAdmin);
    accountState.hasBetaReward = Boolean(accounts[currentNickname].hasBetaReward);
    accountState.lastSeenPatchNoteVersion = accounts[currentNickname].lastSeenPatchNoteVersion || "";
    const data = accounts[currentNickname].progress || createDefaultProgress();
    if (typeof data.score === "number") {
      score = Math.max(0, Math.floor(data.score));
    }
    if (typeof data.unlockedStageIndex === "number") {
      unlockedStageIndex = Math.max(0, Math.min(STAGE_DEFS.length - 1, Math.floor(data.unlockedStageIndex)));
    }
    if (typeof data.selectedStageIndex === "number") {
      selectedStageIndex = Math.max(0, Math.min(STAGE_DEFS.length - 1, Math.floor(data.selectedStageIndex)));
    }
    if (typeof data.activeDifficultyKey === "string" && DIFFICULTIES[data.activeDifficultyKey]) {
      activeDifficultyKey = data.activeDifficultyKey;
      difficulty = DIFFICULTIES[activeDifficultyKey];
    }
    if (typeof data.screenMode === "string" && ["fullscreen", "classic"].includes(data.screenMode)) {
      screenMode = data.screenMode;
    }
    if (typeof data.controlMode === "string" && ["desktop", "mobile"].includes(data.controlMode)) {
      controlMode = data.controlMode;
    }

    if (data.shopState && typeof data.shopState === "object") {
      if (Array.isArray(data.shopState.ownedCharacters) && data.shopState.ownedCharacters.length > 0) {
        shopState.ownedCharacters = [...new Set(data.shopState.ownedCharacters)];
      }
      if (Array.isArray(data.shopState.ownedSkins) && data.shopState.ownedSkins.length > 0) {
        shopState.ownedSkins = [...new Set(data.shopState.ownedSkins)];
      }
      if (typeof data.shopState.coins === "number") {
        shopState.coins = Math.max(0, Math.floor(data.shopState.coins));
      }
      if (typeof data.shopState.premiumBoxCounter === "number") {
        shopState.premiumBoxCounter = Math.max(0, Math.floor(data.shopState.premiumBoxCounter));
      }
      if (typeof data.shopState.weeklyBoxPriceWeek === "string") {
        shopState.weeklyBoxPriceWeek = data.shopState.weeklyBoxPriceWeek;
      }
      if (typeof data.shopState.weeklyCharacterSaleWeek === "string") {
        shopState.weeklyCharacterSaleWeek = data.shopState.weeklyCharacterSaleWeek;
      }
      if (data.shopState.boxPrices && typeof data.shopState.boxPrices === "object") {
        shopState.boxPrices = normalizeBoxPrices(data.shopState.boxPrices);
      }
      if (data.shopState.characterSales && typeof data.shopState.characterSales === "object") {
        shopState.characterSales = normalizeCharacterSales(data.shopState.characterSales);
      }
      if (data.shopState.boxInventory && typeof data.shopState.boxInventory === "object") {
        shopState.boxInventory = normalizeBoxInventory(data.shopState.boxInventory);
      }
      if (typeof data.shopState.equippedCharacter === "string") {
        shopState.equippedCharacter = data.shopState.equippedCharacter;
      }
      if (typeof data.shopState.equippedSkin === "string") {
        shopState.equippedSkin = data.shopState.equippedSkin;
      }
    }

    applyShopEntitlements();

    difficultySelect.value = activeDifficultyKey;
    screenModeSelect.value = screenMode;
    controlModeSelect.value = controlMode;
    stageSelect.value = String(selectedStageIndex);
    showAuthPanel(false);
    syncLobbyAccountUI();
    lastSavedStateJson = JSON.stringify(createSaveData());
  } catch (_) {
    accountState.currentNickname = null;
    accountState.isAdmin = false;
    accountState.hasBetaReward = false;
    accountState.lastSeenPatchNoteVersion = "";
    applyShopEntitlements();
    setAuthMessageKey("auth_signin_prompt");
    lastSavedStateJson = "";
  }
}

function resetProgressState() {
  score = 0;
  lives = getStartingLives();
  collectedCount = 0;
  currentStageIndex = 0;
  selectedStageIndex = 0;
  unlockedStageIndex = 0;
  screenMode = screenModeSelect.value;
  controlMode = controlModeSelect.value;
  factoryTimeRemaining = 0;
  shopState.ownedCharacters = getDefaultOwnedCharacters();
  shopState.ownedSkins = getDefaultOwnedSkins();
  shopState.coins = 0;
  shopState.premiumBoxCounter = 0;
  shopState.weeklyBoxPriceWeek = "";
  shopState.weeklyCharacterSaleWeek = "";
  shopState.boxPrices = createDefaultBoxPrices();
  shopState.characterSales = {};
  shopState.boxInventory = createDefaultBoxInventory();
  shopState.equippedCharacter = "starling";
  shopState.equippedSkin = "classic";
  accountState.hasBetaReward = false;
  accountState.lastSeenPatchNoteVersion = "";
  betaRewardState.selectedCharacter = null;
  betaRewardState.selectedSkin = null;
  clearGuardianState(true);
  clearChangerState(true);
  clearLightnerState(true);
  clearWildHunterState(true);
  resetNightmareEvent();
  resetAssassinationEvent();
}

function applyAccountProgress(progress) {
  score = Math.max(0, Math.floor(progress.score ?? 0));
  unlockedStageIndex = Math.max(0, Math.min(STAGE_DEFS.length - 1, Math.floor(progress.unlockedStageIndex ?? 0)));
  selectedStageIndex = Math.max(0, Math.min(STAGE_DEFS.length - 1, Math.floor(progress.selectedStageIndex ?? 0)));
  activeDifficultyKey = typeof progress.activeDifficultyKey === "string" && DIFFICULTIES[progress.activeDifficultyKey]
    ? progress.activeDifficultyKey
    : difficultySelect.value;
  difficulty = DIFFICULTIES[activeDifficultyKey];
  screenMode = typeof progress.screenMode === "string" && ["fullscreen", "classic"].includes(progress.screenMode)
    ? progress.screenMode
    : screenModeSelect.value;
  controlMode = typeof progress.controlMode === "string" && ["desktop", "mobile"].includes(progress.controlMode)
    ? progress.controlMode
    : controlModeSelect.value;

  const savedShopState = progress.shopState || {};
  shopState.ownedCharacters = Array.isArray(savedShopState.ownedCharacters) ? [...new Set(savedShopState.ownedCharacters)] : getDefaultOwnedCharacters();
  shopState.ownedSkins = Array.isArray(savedShopState.ownedSkins) ? [...new Set(savedShopState.ownedSkins)] : getDefaultOwnedSkins();
  shopState.coins = typeof savedShopState.coins === "number" ? Math.max(0, Math.floor(savedShopState.coins)) : 0;
  shopState.premiumBoxCounter = typeof savedShopState.premiumBoxCounter === "number" ? Math.max(0, Math.floor(savedShopState.premiumBoxCounter)) : 0;
  shopState.weeklyBoxPriceWeek = typeof savedShopState.weeklyBoxPriceWeek === "string" ? savedShopState.weeklyBoxPriceWeek : "";
  shopState.weeklyCharacterSaleWeek = typeof savedShopState.weeklyCharacterSaleWeek === "string" ? savedShopState.weeklyCharacterSaleWeek : "";
  shopState.boxPrices = normalizeBoxPrices(savedShopState.boxPrices);
  shopState.characterSales = normalizeCharacterSales(savedShopState.characterSales);
  shopState.boxInventory = normalizeBoxInventory(savedShopState.boxInventory);
  shopState.equippedCharacter = typeof savedShopState.equippedCharacter === "string" ? savedShopState.equippedCharacter : "starling";
  shopState.equippedSkin = typeof savedShopState.equippedSkin === "string" ? savedShopState.equippedSkin : "classic";
  applyShopEntitlements();

  difficultySelect.value = activeDifficultyKey;
  screenModeSelect.value = screenMode;
  controlModeSelect.value = controlMode;
  stageSelect.value = String(selectedStageIndex);
  updateStageSelectLocks();
  applyScreenMode();
  applyControlMode();
  syncLobbyAccountUI();
  lastSavedStateJson = JSON.stringify(createSaveData());
}

function loginToAccount(nickname) {
  const accounts = readAccounts();
  const account = getAccountByNickname(accounts, nickname);
  if (!account) {
    setAuthMessageKey("auth_account_not_found", {}, true);
    return;
  }

  account.isAdmin = Boolean(account.isAdmin) || nickname === ADMIN_NICKNAME;
  ensureAccountMeta(account);
  writeAccounts(accounts);
  accountState.currentNickname = nickname;
  accountState.isAdmin = Boolean(account.isAdmin);
  accountState.hasBetaReward = Boolean(account.hasBetaReward);
  accountState.lastSeenPatchNoteVersion = account.lastSeenPatchNoteVersion || "";
  localStorage.setItem(CURRENT_ACCOUNT_KEY, nickname);
  applyAccountProgress(account.progress || createDefaultProgress());
  lives = getStartingLives();
  gameState = "lobby";
  stageMessageTimer = 0;
  showAuthPanel(false);
  setAuthMessageKey("auth_welcome_back", { nickname });
  loginPasswordInput.value = "";
  signupPasswordInput.value = "";
  openLobby();
  savePersistentProgress(true);
}

function registerAccount() {
  const { nickname, password } = getSignupCredentials();
  if (!nickname) {
    setAuthMessageKey("auth_enter_nickname", {}, true);
    return;
  }
  if (!password) {
    setAuthMessageKey("auth_enter_password", {}, true);
    return;
  }

  const accounts = readAccounts();
  if (getAccountByNickname(accounts, nickname)) {
    setAuthMessageKey("auth_nickname_taken", {}, true);
    return;
  }

  accounts[nickname] = {
    password: nickname === ADMIN_NICKNAME ? ADMIN_PASSWORD_RESET : password,
    isAdmin: nickname === ADMIN_NICKNAME,
    hasBetaReward: false,
    lastSeenPatchNoteVersion: "",
    progress: createDefaultProgress(),
  };
  writeAccounts(accounts);
  signupNicknameInput.value = "";
  signupPasswordInput.value = "";
  setAuthMessageKey(accounts[nickname].isAdmin ? "auth_admin_created" : "auth_account_created");
  loginToAccount(nickname);
}

function attemptLogin() {
  const { nickname, password } = getLoginCredentials();
  if (!nickname || !password) {
    setAuthMessageKey("auth_enter_both", {}, true);
    return;
  }

  const accounts = readAccounts();
  const account = getAccountByNickname(accounts, nickname);
  if (!account || account.password !== password) {
    setAuthMessageKey("auth_incorrect", {}, true);
    return;
  }

  loginToAccount(nickname);
}

function logoutAccount() {
  savePersistentProgress(true);
  accountState.currentNickname = null;
  accountState.isAdmin = false;
  accountState.hasBetaReward = false;
  accountState.lastSeenPatchNoteVersion = "";
  betaRewardState.selectedCharacter = null;
  betaRewardState.selectedSkin = null;
  localStorage.removeItem(CURRENT_ACCOUNT_KEY);
  resetProgressState();
  applyShopEntitlements();
  showAuthPanel(true);
  setAuthMessageKey("auth_signed_out");
  loginNicknameInput.value = "";
  loginPasswordInput.value = "";
  openLobby();
}

function handleLoginSubmit() {
  attemptLogin();
}

function handleRegisterSubmit() {
  registerAccount();
}

function bindEnterKey(input, handler) {
  if (!input) {
    return;
  }
  input.onkeydown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handler();
    }
  };
}

function renderPatchNotes() {
  if (!patchNotesList) {
    return;
  }
  patchNotesList.innerHTML = "";

  for (const note of PATCH_NOTES) {
    const card = document.createElement("article");
    card.className = "patch-note-entry";

    const title = document.createElement("h4");
    title.textContent = note.version;
    card.append(title);

    if (note.date) {
      const date = document.createElement("p");
      date.textContent = note.date;
      card.append(date);
    }

    const list = document.createElement("ul");
    for (const item of note.items) {
      const li = document.createElement("li");
      li.textContent = item;
      list.append(li);
    }
    card.append(list);
    patchNotesList.append(card);
  }
}

function setLastSeenPatchNotes(version) {
  if (!accountState.currentNickname) {
    return;
  }
  accountState.lastSeenPatchNoteVersion = version;
  const accounts = readAccounts();
  const account = getAccountByNickname(accounts, accountState.currentNickname);
  if (!account) {
    return;
  }
  account.lastSeenPatchNoteVersion = version;
  writeAccounts(accounts);
}

function openPatchNotes(markSeen = false) {
  if (!patchNotesPanel) {
    return;
  }
  renderPatchNotes();
  patchNotesState.open = true;
  patchNotesPanel.classList.remove("hidden");
  if (markSeen && LATEST_PATCH_NOTES_VERSION) {
    setLastSeenPatchNotes(LATEST_PATCH_NOTES_VERSION);
  }
}

function closePatchNotes(markSeen = true) {
  if (!patchNotesPanel) {
    return;
  }
  patchNotesState.open = false;
  patchNotesPanel.classList.add("hidden");
  if (markSeen && LATEST_PATCH_NOTES_VERSION) {
    setLastSeenPatchNotes(LATEST_PATCH_NOTES_VERSION);
  }
}

function maybeShowLatestPatchNotes() {
  if (!accountState.currentNickname || !LATEST_PATCH_NOTES_VERSION) {
    return;
  }
  if (accountState.lastSeenPatchNoteVersion === LATEST_PATCH_NOTES_VERSION) {
    return;
  }
  openPatchNotes(false);
}

function isBetaRewardPending() {
  return Boolean(
    BETA_REWARDS_ACTIVE &&
    accountState.currentNickname &&
    !accountState.isAdmin &&
    !accountState.hasBetaReward
  );
}

function getBetaRewardCharacterOptions() {
  return SHOP_CATALOG.characters.filter((item) => CHARACTER_DEFS[item]?.purchasable);
}

function getBetaRewardSkinOptions() {
  return SHOP_CATALOG.skins.filter((item) => item !== "admin" && item !== "classic");
}

function renderBetaRewardChoices(container, options, selectedValue, type) {
  if (!container) {
    return;
  }
  container.innerHTML = "";

  for (const item of options) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `beta-choice-item${selectedValue === item ? " active" : ""}`;
    button.addEventListener("click", () => {
      if (type === "character") {
        betaRewardState.selectedCharacter = item;
      } else {
        betaRewardState.selectedSkin = item;
      }
      renderBetaRewardPanel();
    });

    const meta = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = formatCatalogName(item);
    const summary = document.createElement("span");
    summary.textContent = getCatalogSummary(type, item);
    meta.append(title, summary);

    const check = document.createElement("span");
    check.className = "beta-choice-check";
    check.textContent = selectedValue === item ? "OK" : "+";

    button.append(meta, check);
    container.append(button);
  }
}

function renderBetaRewardPanel() {
  if (!betaRewardPanel) {
    return;
  }

  const visible = isBetaRewardPending();
  betaRewardPanel.classList.toggle("hidden", !visible);
  if (!visible) {
    return;
  }

  const characterOptions = getBetaRewardCharacterOptions();
  const skinOptions = getBetaRewardSkinOptions();
  if (!characterOptions.includes(betaRewardState.selectedCharacter)) {
    betaRewardState.selectedCharacter = null;
  }
  if (!skinOptions.includes(betaRewardState.selectedSkin)) {
    betaRewardState.selectedSkin = null;
  }

  betaRewardStatus.textContent = t("beta_reward_copy");
  renderBetaRewardChoices(betaRewardCharacterList, characterOptions, betaRewardState.selectedCharacter, "character");
  renderBetaRewardChoices(betaRewardSkinList, skinOptions, betaRewardState.selectedSkin, "skin");
  claimBetaRewardButton.textContent = t("beta_claim_button");
  claimBetaRewardButton.disabled = !betaRewardState.selectedCharacter || !betaRewardState.selectedSkin;
  claimBetaRewardButton.title = claimBetaRewardButton.disabled ? t("beta_claim_disabled") : "";
}

function claimBetaReward() {
  if (!isBetaRewardPending() || !betaRewardState.selectedCharacter || !betaRewardState.selectedSkin) {
    return;
  }

  if (!shopState.ownedCharacters.includes(betaRewardState.selectedCharacter)) {
    shopState.ownedCharacters.push(betaRewardState.selectedCharacter);
  }
  if (!shopState.ownedSkins.includes(betaRewardState.selectedSkin)) {
    shopState.ownedSkins.push(betaRewardState.selectedSkin);
  }

  shopState.equippedCharacter = betaRewardState.selectedCharacter;
  shopState.equippedSkin = betaRewardState.selectedSkin;
  accountState.hasBetaReward = true;
  betaRewardState.selectedCharacter = null;
  betaRewardState.selectedSkin = null;

  const accounts = readAccounts();
  const account = getAccountByNickname(accounts, accountState.currentNickname);
  if (account) {
    account.hasBetaReward = true;
    account.progress = createSaveData();
    writeAccounts(accounts);
  }

  setAuthMessageKey("beta_reward_claimed");
  applyShopEntitlements();
  syncLobbyAccountUI();
  savePersistentProgress(true);
}

function initializeAuthControls() {
  const authDom = getAuthDom();
  if (authDom.loginButton) {
    authDom.loginButton.onclick = () => {
      handleLoginSubmit();
    };
  }
  if (authDom.signupButton) {
    authDom.signupButton.onclick = () => {
      handleRegisterSubmit();
    };
  }
  if (authDom.logoutButton) {
    authDom.logoutButton.onclick = () => {
      logoutAccount();
    };
  }
  if (openPatchNotesButton) {
    openPatchNotesButton.onclick = () => {
      openPatchNotes(false);
    };
  }
  if (closePatchNotesButton) {
    closePatchNotesButton.onclick = () => {
      closePatchNotes(true);
    };
  }
  if (claimBetaRewardButton) {
    claimBetaRewardButton.onclick = () => {
      claimBetaReward();
    };
  }
  bindEnterKey(authDom.loginNickname, handleLoginSubmit);
  bindEnterKey(authDom.loginPassword, handleLoginSubmit);
  bindEnterKey(authDom.signupNickname, handleRegisterSubmit);
  bindEnterKey(authDom.signupPassword, handleRegisterSubmit);
}

function formatStageTimer(totalSeconds) {
  const safeSeconds = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function stageDifficultyFactor(stageIndex) {
  return 1 + stageIndex * 0.1;
}

function applyScreenMode() {
  document.body.classList.toggle("classic-mode", screenMode === "classic");
}

function applyControlMode() {
  document.body.classList.toggle("touch-controls-enabled", controlMode === "mobile");
  if (controlMode !== "mobile") {
    resetMobileJoystick();
  }
}

function resetNightmareEvent() {
  nightmareEvent.active = false;
  nightmareEvent.countdown = false;
  nightmareEvent.countdownTimer = 0;
  nightmareEvent.timer = 0;
  nightmareEvent.triggerTimer = 7 + Math.random() * 8;
  nightmareEvent.targetStart = 0.4 + Math.random() * 0.22;
  nightmareEvent.targetWidth = 0.18;
  nightmareEvent.marker = Math.random();
  nightmareEvent.markerDir = Math.random() > 0.5 ? 1 : -1;
  nightmareEvent.markerSpeed = 1 + Math.random() * 0.25;
  nightmareEvent.flash = 0;

  resetDanceEvent();
}

function isArcadeHardDanceStage() {
  return false;
}

function triggerNightmareEvent() {
  nightmareEvent.countdown = true;
  nightmareEvent.countdownTimer = 3;
  nightmareEvent.active = false;
  nightmareEvent.timer = 10;
  nightmareEvent.targetStart = 0.38 + Math.random() * 0.28;
  nightmareEvent.targetWidth = 0.2;
  nightmareEvent.marker = Math.random();
  nightmareEvent.markerDir = Math.random() > 0.5 ? 1 : -1;
  nightmareEvent.markerSpeed = 1.05 + Math.random() * 0.25;
  nightmareEvent.flash = 1;
  playSound("nightmare");
}

function resolveNightmareEvent(success) {
  if (!nightmareEvent.active && !nightmareEvent.countdown) {
    return;
  }

  nightmareEvent.active = false;
  nightmareEvent.countdown = false;
  if (success) {
    score += 600 + currentStageIndex * 100;
    if (level.theme !== "frozen") {
      awardCoins(18 + currentStageIndex * 2);
    }
    player.invulnerableTime = Math.max(player.invulnerableTime, 1.4);
    resetNightmareEvent();
    return;
  }

  if (consumeGuardianPassive()) {
    resetNightmareEvent();
    return;
  }

  lives = 0;
  gameState = "gameover";
  player.vx = 0;
  player.vy = 0;
  resetNightmareEvent();
}

function attemptNightmareInput() {
  if (!nightmareEvent.active) {
    return false;
  }
  const marker = nightmareEvent.marker;
  const success =
    marker >= nightmareEvent.targetStart &&
    marker <= nightmareEvent.targetStart + nightmareEvent.targetWidth;
  resolveNightmareEvent(success);
  return true;
}

function resetDanceEvent() {
  danceEvent.active = false;
  danceEvent.countdown = false;
  danceEvent.countdownTimer = 0;
  danceEvent.triggerTimer = 0;
  danceEvent.sequence.length = 0;
  danceEvent.index = 0;
  danceEvent.stepTimer = 0;
  danceEvent.flash = 0;
  stopDanceMusic();
}

function triggerDanceEvent() {
  if (!isArcadeHardDanceStage() || danceEvent.active || danceEvent.countdown || gameState !== "playing") {
    return;
  }
  danceEvent.countdown = true;
  danceEvent.countdownTimer = 3;
  danceEvent.active = false;
  danceEvent.sequence.length = 0;
  danceEvent.index = 0;
  danceEvent.flash = 1;

  keys.left = false;
  keys.right = false;
  keys.jump = false;
  keys.jumpQueued = false;
  keys.crouch = false;

  const steps = ["left", "up", "down", "right"];
  let previousStep = null;
  for (let i = 0; i < 6; i += 1) {
    const candidates = steps.filter((step) => step !== previousStep);
    const next = candidates[Math.floor(Math.random() * candidates.length)];
    danceEvent.sequence.push(next);
    previousStep = next;
  }
  playSound("coin");
}

function directionFromDanceKey(key, code) {
  if (["a", "A", "ArrowLeft"].includes(key) || code === "KeyA") {
    return "left";
  }
  if (["d", "D", "ArrowRight"].includes(key) || code === "KeyD") {
    return "right";
  }
  if (["w", "W", "ArrowUp", " ", "Spacebar"].includes(key) || code === "KeyW" || code === "Space") {
    return "up";
  }
  if (["s", "S", "ArrowDown"].includes(key) || code === "KeyS") {
    return "down";
  }
  return null;
}

function submitDanceInput(dir) {
  if (!danceEvent.active || !dir) {
    return false;
  }

  if (dir === danceEvent.sequence[danceEvent.index]) {
    danceEvent.index += 1;
    danceEvent.stepTimer = danceEvent.stepTimeLimit;
    danceEvent.flash = 1;
    playSound("stomp");
    if (danceEvent.index >= danceEvent.sequence.length) {
      resolveDanceEvent(true);
    }
  } else {
    resolveDanceEvent(false);
  }
  return true;
}

function resolveDanceEvent(success) {
  if (!danceEvent.active && !danceEvent.countdown) {
    return;
  }

  danceEvent.active = false;
  danceEvent.countdown = false;
  stopDanceMusic();

  if (success) {
    score += 650 + currentStageIndex * 110;
    awardCoins(20 + currentStageIndex * 2);
    player.invulnerableTime = Math.max(player.invulnerableTime, 1.4);
    resetDanceEvent();
    danceEvent.triggerTimer = 9;
    return;
  }

  if (consumeGuardianPassive()) {
    resetDanceEvent();
    return;
  }

  lives = 0;
  gameState = "gameover";
  player.vx = 0;
  player.vy = 0;
  resetDanceEvent();
}

function resetJungleState() {
  jungleState.carried = 0;
  jungleState.delivered = 0;
  jungleState.monkey.x = 0;
  jungleState.monkey.y = 0;
  jungleState.monkey.w = 46;
  jungleState.monkey.h = 54;
  jungleState.monkey.facing = -1;
  jungleState.monkey.angerTimer = 0;
  jungleState.monkey.attackTimer = 0;
  jungleState.monkey.cooldown = 0;
  jungleState.monkey.attackHit = false;
  jungleState.monkey.flash = 0;
}

function setupJungleState(stageDef) {
  resetJungleState();
  if (level.theme !== "jungle") {
    return;
  }
  const monkey = stageDef.monkey || stageDef.goal;
  jungleState.monkey.x = monkey.x * TILE + 2;
  jungleState.monkey.y = monkey.y * TILE;
  jungleState.monkey.facing = -1;
}

function addBanana(tileX, tileY) {
  level.collectibles.push({
    x: tileX * TILE + 8,
    y: tileY * TILE + 8,
    w: 18,
    h: 28,
    bob: Math.random() * Math.PI * 2,
    collected: false,
    style: "banana",
  });
}

function addDroppedBanana(x, y, bobOffset = 0) {
  level.collectibles.push({
    x: Math.max(0, Math.min(worldWidth - 20, x)),
    y: Math.max(40, Math.min(FLOOR_Y - 24, y)),
    w: 18,
    h: 28,
    bob: Math.random() * Math.PI * 2 + bobOffset,
    collected: false,
    style: "banana",
    dropped: true,
  });
}

function getJungleMonkeyDeliveryRect() {
  const monkey = jungleState.monkey;
  return {
    x: monkey.x - 58,
    y: monkey.y - 18,
    w: monkey.w + 86,
    h: monkey.h + 40,
  };
}

function getJungleMonkeyAttackRect() {
  const monkey = jungleState.monkey;
  return {
    x: monkey.x - 94,
    y: monkey.y + 12,
    w: 92,
    h: 34,
  };
}

function collectJungleBananas() {
  if (level.theme !== "jungle" || jungleState.carried >= JUNGLE_BANANA_CAPACITY) {
    return;
  }

  for (const collectible of level.collectibles) {
    if (collectible.collected || collectible.style !== "banana") {
      continue;
    }
    if (!overlaps(player, collectible)) {
      continue;
    }
    collectible.collected = true;
    jungleState.carried = Math.min(JUNGLE_BANANA_CAPACITY, jungleState.carried + 1);
    score += 40;
    playSound("coin");
    if (jungleState.carried >= JUNGLE_BANANA_CAPACITY) {
      break;
    }
  }
}

function dropJungleBananas() {
  if (level.theme !== "jungle" || jungleState.carried <= 0) {
    return;
  }
  const dropCount = jungleState.carried;
  jungleState.carried = 0;
  for (let i = 0; i < dropCount; i += 1) {
    const offset = (i - (dropCount - 1) / 2) * 18;
    addDroppedBanana(player.x + player.w * 0.5 + offset, player.y + player.h - 24 - i * 4, i);
  }
}

function submitJungleBananas() {
  if (level.theme !== "jungle" || jungleState.carried <= 0 || jungleState.delivered >= JUNGLE_BANANA_TARGET) {
    return;
  }
  if (!overlaps(player, getJungleMonkeyDeliveryRect())) {
    return;
  }

  const amount = Math.min(jungleState.carried, JUNGLE_BANANA_TARGET - jungleState.delivered);
  jungleState.carried -= amount;
  jungleState.delivered += amount;
  collectedCount = jungleState.delivered;
  score += amount * 90;
  playSound("button");

  if (jungleState.delivered >= JUNGLE_BANANA_TARGET) {
    awardStageClearCoins();
    rollStageClearBoxReward();
    playSound("clear");
    gameState = currentStageIndex < STAGE_DEFS.length - 1 ? "stageclear" : "finished";
    return;
  }

  const monkey = jungleState.monkey;
  const canAnger = monkey.cooldown <= 0 && monkey.angerTimer <= 0 && monkey.attackTimer <= 0;
  if (canAnger && Math.random() < JUNGLE_MONKEY_ANGER_CHANCE) {
    monkey.angerTimer = JUNGLE_MONKEY_ANGER_WARN;
    monkey.cooldown = JUNGLE_MONKEY_COOLDOWN + JUNGLE_MONKEY_ANGER_WARN;
    monkey.flash = 1;
    playSound("nightmare");
  }
}

function updateJungleStage(dt) {
  if (level.theme !== "jungle") {
    return;
  }

  collectJungleBananas();
  submitJungleBananas();

  const monkey = jungleState.monkey;
  monkey.cooldown = Math.max(0, monkey.cooldown - dt);
  monkey.flash = Math.max(0, monkey.flash - dt * 1.8);

  if (monkey.angerTimer > 0) {
    monkey.angerTimer -= dt;
    monkey.flash = Math.max(monkey.flash, 0.45);
    if (monkey.angerTimer <= 0) {
      monkey.attackTimer = JUNGLE_MONKEY_ATTACK_TIME;
      monkey.attackHit = false;
      screenShakeTimer = Math.max(screenShakeTimer, 0.22);
      playSound("stomp");
    }
  }

  if (monkey.attackTimer > 0) {
    monkey.attackTimer -= dt;
    if (!monkey.attackHit && overlaps(player, getJungleMonkeyAttackRect())) {
      monkey.attackHit = true;
      loseLife();
    }
    if (monkey.attackTimer <= 0) {
      monkey.attackHit = false;
    }
  }
}

function resetClawEscapeEvent() {
  clawEscapeEvent.active = false;
  clawEscapeEvent.meter = 0;
  clawEscapeEvent.flash = 0;
  clawEscapeEvent.button = { x: 0, y: 0, w: 0, h: 0 };
}

function triggerClawEscapeEvent() {
  clawEscapeEvent.active = true;
  clawEscapeEvent.meter = 0;
  clawEscapeEvent.flash = 1;
  playSound("coin");
}

function resolveClawEscapeEvent() {
  if (!clawEscapeEvent.active) {
    return;
  }
  clawEscapeEvent.active = false;
  playSound("clear");
  gameState = currentStageIndex < STAGE_DEFS.length - 1 ? "stageclear" : "finished";
  resetClawEscapeEvent();
}

function createPlayer() {
  return {
    x: 0,
    y: 0,
    w: 26,
    h: PLAYER_STAND_H,
    vx: 0,
    vy: 0,
    speed: 250,
    jumpVelocity: -780,
    airJumpVelocity: -780,
    onGround: false,
    facing: 1,
    stompBounce: -420,
    invulnerableTime: 0,
    stunTimer: 0,
    animationTime: 0,
    state: "idle",
    maxJumps: 3,
    jumpsRemaining: 3,
    standH: PLAYER_STAND_H,
    crouchH: PLAYER_CROUCH_H,
    crouching: false,
    stealthActive: false,
    stealthTimer: 0,
    stealthCooldown: 0,
    assassinationCooldown: 0,
    guardianPassiveReady: true,
    guardianShieldTimer: 0,
    guardianShieldCooldown: 0,
    guardianFlash: 0,
    cloneTransferFlash: 0,
    frostSlowTimer: 0,
    iceSlideTimer: 0,
  };
}

function clearChangerState(resetUsage = false) {
  changerState.clone = null;
  if (resetUsage) {
    changerState.cloneUsedThisRun = false;
  }
  changerState.swapCooldown = 0;
  changerState.effectTimer = 0;
  changerState.effectFrom = null;
  changerState.effectTo = null;
}

function clearGuardianState(resetPassive = false) {
  if (resetPassive) {
    player.guardianPassiveReady = true;
  }
  player.guardianShieldTimer = 0;
  player.guardianShieldCooldown = 0;
  player.guardianFlash = 0;
}

function clearLightnerState(resetCombat = false) {
  lightnerState.anchor = null;
  lightnerState.stacks = LIGHTNER_RULES.maxStacks;
  lightnerState.stackRechargeTimer = 0;
  lightnerState.fieldCooldown = 0;
  lightnerState.awakenTimer = 0;
  lightnerState.effects.length = 0;
  if (resetCombat) {
    lightnerState.awakenKills = 0;
  }
}

function clearWildHunterState(resetCombat = false) {
  wildHunterState.instinctTimer = 0;
  wildHunterState.blastDelayTimer = 0;
  wildHunterState.slamActive = false;
  wildHunterState.slamHit = false;
  wildHunterState.slamCooldown = 0;
  wildHunterState.awakenTimer = 0;
  wildHunterState.effects.length = 0;
  if (resetCombat) {
    wildHunterState.blastUsed = false;
    wildHunterState.awakenKills = 0;
  }
}

function resetPlayerPosition() {
  player.speed = isGuardianEquipped()
    ? 250 * GUARDIAN_RULES.speedMultiplier
    : isAssassinEquipped()
      ? 250 * ASSASSIN_RULES.speedMultiplier
      : isLightnerEquipped()
        ? 250 * LIGHTNER_RULES.speedMultiplier
        : isWildHunterEquipped()
          ? 250 * WILD_HUNTER_RULES.speedMultiplier
          : 250;
  if (isLightnerEquipped() && lightnerState.awakenTimer > 0) {
    player.speed *= LIGHTNER_RULES.awakenSpeedMultiplier;
  }
  player.maxJumps = difficulty.maxJumps;
  if (level.theme === "frozen") {
    player.maxJumps = 3;
  } else if (level.theme === "jungle") {
    player.maxJumps = 5;
  }
  player.jumpVelocity = difficulty.jumpVelocity;
  player.airJumpVelocity = difficulty.airJumpVelocity;
  if (shopState.equippedCharacter === "starling") {
    player.jumpVelocity *= STARLING_JUMP_MULTIPLIER;
    player.airJumpVelocity *= STARLING_JUMP_MULTIPLIER;
  }
  player.x = level.start.x;
  player.y = level.start.y;
  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  player.invulnerableTime = 1.2;
  player.stunTimer = 0;
  player.jumpsRemaining = player.maxJumps;
  player.crouching = false;
  player.h = player.standH;
  player.stealthActive = false;
  player.stealthTimer = 0;
  player.stealthCooldown = 0;
  player.assassinationCooldown = 0;
  player.frostSlowTimer = 0;
  player.iceSlideTimer = 0;
  clearGuardianState();
  player.cloneTransferFlash = 0;
  clearChangerState();
  if (!isLightnerEquipped()) {
    clearLightnerState(true);
  }
  if (!isWildHunterEquipped()) {
    clearWildHunterState(true);
  }
}

function loadStage(stageIndex, preserveScore = true) {
  currentStageIndex = stageIndex;
  selectedStageIndex = stageIndex;
  stageSelect.value = String(stageIndex);
  const stageDef = STAGE_DEFS[stageIndex];

  level.solids.length = 0;
  level.collectibles.length = 0;
  level.enemies.length = 0;
  level.serpentEnemies.length = 0;
  level.frostProjectiles.length = 0;
  level.hazards.length = 0;

  level.widthTiles = stageDef.widthTiles;
  level.theme = stageDef.theme;
  level.name = getStageDisplayName(stageIndex);
  level.start = { x: stageDef.start.x * TILE, y: stageDef.start.y * TILE };
  level.goal = { x: stageDef.goal.x * TILE, y: stageDef.goal.y * TILE, w: 2 * TILE, h: 6 * TILE };
  worldWidth = level.widthTiles * TILE;

  if (!preserveScore) {
    score = 0;
  }
  collectedCount = 0;
  factoryTimeRemaining = level.theme === "factory" ? 80 : 0;
  frozenTimeRemaining = level.theme === "frozen" ? 25 : 0;
  setupJungleState(stageDef);

  // Each stage is defined as data so we can scale the route count cleanly.
  for (const [start, end] of stageDef.groundSegments) {
    addGround(start, end);
  }
  for (const [x, y, width] of stageDef.platforms) {
    addPlatform(x, y, width);
  }
  markIceSolids(stageDef.iceSegments || []);
  for (const [x, width] of stageDef.hazards) {
    addHazard(x, width);
  }
  for (const item of stageDef.collectibles) {
    if (level.theme === "frozen") {
      break;
    }
    if (level.theme === "factory" && level.collectibles.length >= currentShardTarget()) {
      break;
    }
    if (item.row) {
      const remaining = currentShardTarget() - level.collectibles.length;
      addCollectibleRow(item.row[0], item.row[1], level.theme === "factory" ? Math.min(item.row[2], remaining) : item.row[2]);
    } else {
      addCollectible(item.point[0], item.point[1]);
    }
  }
  for (const banana of stageDef.bananas || []) {
    addBanana(banana[0], banana[1]);
  }

  for (const enemy of stageDef.enemies) {
    addEnemy(enemy[0], enemy[1]);
  }
  for (const excavator of stageDef.excavators || []) {
    addExcavatorEnemy(excavator[0], excavator[1], excavator[2], excavator[3], excavator[4]);
  }
  for (const warden of stageDef.frostWardens || []) {
    addFrostWarden(warden[0], warden[1]);
  }
  for (const serpentSpawn of stageDef.serpentSpawns || []) {
    addSerpentEnemy(serpentSpawn);
  }

  // Difficulty tweaks enemy count without needing a separate copy of every map.
  const bonusEnemies = difficulty.enemyBonus;
  for (let i = 0; i < bonusEnemies && stageDef.enemies.length > 0; i += 1) {
    const seed = stageDef.enemies[(i * 2 + stageIndex) % stageDef.enemies.length];
    addEnemy(seed[0] + 2 + i * 3, Math.max(5, seed[1]));
  }

  clearLightnerState(true);
  clearWildHunterState(true);
  resetNightmareEvent();
  resetPlayerPosition();
  camera.x = 0;
  screenShakeTimer = 0;
  stageMessageTimer = 2.2;
}

function addGround(startTile, endTile) {
  const topOffset = level.theme === "factory" ? 8 : 0;
  const topHeight = level.theme === "factory" ? TILE - topOffset : TILE;
  for (let x = startTile; x <= endTile; x += 1) {
    level.solids.push({ x: x * TILE, y: FLOOR_Y + topOffset, w: TILE, h: topHeight });
    level.solids.push({ x: x * TILE, y: FLOOR_Y + TILE, w: TILE, h: TILE });
    level.solids.push({ x: x * TILE, y: FLOOR_Y + TILE * 2, w: TILE, h: TILE });
  }
}

function addPlatform(tileX, tileY, widthTiles) {
  const topOffset = level.theme === "factory" ? 10 : 0;
  const topHeight = level.theme === "factory" ? TILE - topOffset : TILE;
  for (let x = 0; x < widthTiles; x += 1) {
    level.solids.push({ x: (tileX + x) * TILE, y: tileY * TILE + topOffset, w: TILE, h: topHeight });
  }
}

function markIceSolids(iceSegments) {
  for (const [tileX, tileYOrEnd, widthTiles] of iceSegments) {
    for (const solid of level.solids) {
      const solidTileX = Math.round(solid.x / TILE);
      const solidTileY = Math.round(solid.y / TILE);
      const isGroundSegment = widthTiles === undefined && solid.y >= FLOOR_Y && solidTileX >= tileX && solidTileX <= tileYOrEnd;
      const isPlatformSegment = widthTiles !== undefined && solidTileY === tileYOrEnd && solidTileX >= tileX && solidTileX < tileX + widthTiles;
      if (isGroundSegment || isPlatformSegment) {
        solid.ice = true;
      }
    }
  }
}

function addHazard(startTile, widthTiles) {
  level.hazards.push({
    x: startTile * TILE,
    y: FLOOR_Y + TILE * 0.75,
    w: widthTiles * TILE,
    h: TILE * 1.5,
  });
}

function addCollectible(tileX, tileY) {
  if (level.theme === "factory") {
    const x = tileX * TILE + 6;
    const hintY = tileY * TILE;
    let surfaceY = FLOOR_Y;
    for (const solid of level.solids) {
      const overlapsColumn = x + 10 >= solid.x && x + 10 <= solid.x + solid.w;
      if (!overlapsColumn || solid.y < hintY) {
        continue;
      }
      surfaceY = Math.min(surfaceY, solid.y);
    }

    level.collectibles.push({
      x,
      y: surfaceY - 14,
      w: 20,
      h: 14,
      bob: Math.random() * Math.PI * 2,
      collected: false,
      style: "button",
    });
    return;
  }

    if (level.theme === "frozen") {
      level.collectibles.push({
        x: tileX * TILE + 2,
        y: tileY * TILE + 2,
        w: 24,
        h: 24,
        bob: Math.random() * Math.PI * 2,
        collected: false,
        style: "coin",
      });
      return;
    }

  level.collectibles.push({
    x: tileX * TILE + 6,
    y: tileY * TILE + 6,
    w: 20,
    h: 20,
    bob: Math.random() * Math.PI * 2,
    collected: false,
  });
}

function addCollectibleRow(startTileX, tileY, count) {
  for (let i = 0; i < count; i += 1) {
    addCollectible(startTileX + i, tileY);
  }
}

function currentMonsterSpawnCount() {
  return level.enemies.length + level.serpentEnemies.length;
}

function canAddMonsterSpawn() {
  return currentMonsterSpawnCount() < MAX_MONSTER_SPAWNS;
}

function addEnemy(tileX, tileY) {
  if (!canAddMonsterSpawn()) {
    return;
  }

  const x = tileX * TILE + 3;
  const y = tileY * TILE + 2;
  const stageFactor = stageDifficultyFactor(currentStageIndex);
  level.enemies.push({
    type: "walker",
    x,
    y,
    w: 26,
    h: 26,
    vx: 70 * difficulty.enemySpeed * stageFactor,
    patrolSpeed: 70 * difficulty.enemySpeed * stageFactor,
    vy: 0,
    leftBound: x - TILE * 2,
    rightBound: x + TILE * 2,
    alive: true,
    squishTimer: 0,
    animationTime: Math.random() * 2,
  });
}

function isHazardColumn(tileX) {
  const sampleX = tileX * TILE + TILE * 0.5;
  const sampleY = FLOOR_Y + TILE;
  return hasHazardAt(sampleX, sampleY);
}

function findSafeExcavatorTile(tileX) {
  const searchOffsets = [0, -1, 1, -2, 2, -3, 3];
  for (const offset of searchOffsets) {
    const candidateTileX = tileX + offset;
    if (candidateTileX < 0 || candidateTileX >= level.widthTiles) {
      continue;
    }

    const bodyTiles = [candidateTileX, candidateTileX + 1];
    const blocked = bodyTiles.some((bodyTileX) => isHazardColumn(bodyTileX));
    if (!blocked) {
      return candidateTileX;
    }
  }
  return null;
}

function addExcavatorEnemy(tileX, tileY, facing = "right", minRange = 48, maxRange = 144) {
  if (!canAddMonsterSpawn()) {
    return;
  }

  const safeTileX = findSafeExcavatorTile(tileX);
  if (safeTileX === null) {
    return;
  }

  const x = safeTileX * TILE;
  const y = tileY * TILE + TILE - 8;
  const direction = facing === "left" ? -1 : 1;
  const armBaseY = y + 16;
  level.enemies.push({
    type: "excavator",
    x,
    y,
    w: 40,
    h: 40,
    facing: direction,
    minRange,
    maxRange,
    armLength: minRange * 0.35,
    targetArmLength: minRange * 0.35,
    attackArmLength: maxRange,
    armSpeed: 170,
    state: "idle",
    cooldown: 0.8 + Math.random() * 0.45,
    telegraphTimer: 0,
    animationTime: Math.random() * 2,
    alive: true,
    squishTimer: 0,
    armBaseY,
    reachY: armBaseY - 24,
  });
}

function addFrostWarden(tileX, tileY) {
  if (!canAddMonsterSpawn()) {
    return;
  }

  const x = tileX * TILE;
  const y = tileY * TILE - 32;
  const stageFactor = stageDifficultyFactor(currentStageIndex);
  level.enemies.push({
    type: "frostWarden",
    isBoss: true,
    x,
    y,
    w: 72,
    h: 88,
    vx: 0,
    vy: 0,
    speed: 46 * difficulty.enemySpeed * stageFactor,
    facing: -1,
    alive: true,
    defeated: false,
    hp: 400,
    maxHp: 400,
    squishTimer: 0,
    animationTime: Math.random() * 2,
    state: "idle",
    cooldown: 1.4,
    telegraphTimer: 0,
    attackType: "",
  auraPulse: 0,
  qteMeltTimer: 0,
  });
}

function addSerpentEnemy(tileX) {
  if (!canAddMonsterSpawn()) {
    return;
  }

  const stageFactor = stageDifficultyFactor(currentStageIndex);
  level.serpentEnemies.push({
    type: "seaMonster",
    x: tileX * TILE + TILE * 0.5,
    homeX: tileX * TILE + TILE * 0.5,
    baseY: FLOOR_Y + TILE * 1.45,
    waterTop: FLOOR_Y + TILE * 0.75 + SERPENT_POOL_SURFACE_OFFSET,
    w: 58,
    h: 140,
    phase: Math.random() * Math.PI * 2,
    rise: 0,
    maxRise: 104 + currentStageIndex * 14,
    speed: (2 + currentStageIndex * 0.2) * difficulty.enemySpeed * stageFactor,
    state: "idle",
    alive: true,
    cooldown: 0.4 + Math.random() * 1.1,
    stunTimer: 0,
    animationTime: Math.random() * 2,
    strikeX: tileX * TILE + TILE * 0.5,
    strikeY: FLOOR_Y - 56,
    strikeProgress: 0,
    retreatSpeed: 170,
    aggroWidth: 54 + currentStageIndex * 10,
  });
}

function getSerpentHitbox(serpent) {
  const headX = serpent.homeX + (serpent.strikeX - serpent.homeX) * serpent.strikeProgress;
  const headY = serpent.baseY - serpent.rise + (serpent.strikeY - (serpent.baseY - serpent.rise)) * serpent.strikeProgress;
  return {
    x: headX - 32,
    y: headY - 34,
    w: 64,
    h: 54,
  };
}

function hazardHasSerpent(hazard) {
  return level.serpentEnemies.some((serpent) => serpent.homeX >= hazard.x && serpent.homeX <= hazard.x + hazard.w);
}

function restartGame() {
  ensureAudioContext();
  activeDifficultyKey = DIFFICULTIES[difficultySelect.value] ? difficultySelect.value : activeDifficultyKey;
  difficulty = DIFFICULTIES[activeDifficultyKey];
  score = 0;
  collectedCount = 0;
  lives = getStartingLives();
  gameState = "playing";
  clearGuardianState(true);
  clearChangerState(true);
  clearWildHunterState(true);
  resetNightmareEvent();
  resetAssassinationEvent();
  loadStage(Math.min(selectedStageIndex, currentSelectableStageMax()), true);
}

function nextStage() {
  if (currentStageIndex < STAGE_DEFS.length - 1) {
    unlockedStageIndex = Math.max(unlockedStageIndex, currentStageIndex + 1);
    updateStageSelectLocks();
    gameState = "playing";
    clearGuardianState(true);
    clearChangerState(true);
    clearWildHunterState(true);
    resetNightmareEvent();
    loadStage(currentStageIndex + 1, true);
  } else {
    unlockedStageIndex = STAGE_DEFS.length - 1;
    updateStageSelectLocks();
    resetNightmareEvent();
    gameState = "finished";
  }
}

function openLobby() {
  gameState = "lobby";
  stopPeacefulMusic();
  lobbyOverlay.classList.remove("hidden");
  resetNightmareEvent();
  resetAssassinationEvent();
  if (!lootBoxState.active) {
    closeLootBoxPanel();
  }
  showAuthPanel(!accountState.currentNickname);
  syncLobbyAccountUI();
  if (accountState.currentNickname) {
    maybeShowLatestPatchNotes();
  } else {
    closePatchNotes(false);
    closeLootBoxPanel();
  }
}

function closeLobby() {
  lobbyOverlay.classList.add("hidden");
}

function currentSelectableStageMax() {
  return accountState.isAdmin ? STAGE_DEFS.length - 1 : unlockedStageIndex;
}

function updateStageSelectLocks() {
  const selectableMax = currentSelectableStageMax();
  for (const option of stageSelect.options) {
    const stageIndex = Number(option.value);
    option.disabled = stageIndex > selectableMax;
    option.textContent = stageIndex > selectableMax
      ? t("stage_locked", { name: getStageDisplayName(stageIndex) })
      : getStageDisplayName(stageIndex);
  }

  if (selectedStageIndex > selectableMax) {
    selectedStageIndex = selectableMax;
    stageSelect.value = String(selectedStageIndex);
  }

  if (accountState.isAdmin || selectableMax >= STAGE_DEFS.length - 1) {
    stageLockText.textContent = t("stage_all_unlocked");
  } else if (unlockedStageIndex === 0) {
    stageLockText.textContent = t("stage_ready_one");
  } else if (unlockedStageIndex < STAGE_DEFS.length - 1) {
    stageLockText.textContent = t("stage_unlocked_next", {
      current: unlockedStageIndex + 1,
      next: unlockedStageIndex + 2,
    });
  } else {
    stageLockText.textContent = t("stage_all_unlocked");
  }
}

function ensureAudioContext() {
  if (!audioState.context) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioState.context = new AudioContext();
    }
  }

  if (audioState.context && audioState.context.state === "suspended") {
    audioState.context.resume().catch(() => {});
  }
}

function midiToHz(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function stopPeacefulMusic() {
  const existing = audioState.music.peaceful;
  if (!existing) {
    return;
  }

  if (existing.timerId) {
    clearInterval(existing.timerId);
  }

  const audioContext = audioState.context;
  if (audioContext && existing.gain) {
    const now = audioContext.currentTime;
    try {
      existing.gain.gain.cancelScheduledValues(now);
      existing.gain.gain.setValueAtTime(existing.gain.gain.value || 0.0001, now);
      existing.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    } catch (_) {
      // Ignore if the node has already been disconnected.
    }
  }

  audioState.music.peaceful = null;
}

function shouldPlayPeacefulMusic() {
  return gameState === "playing" && !danceEvent.active && !danceEvent.countdown && bgmState.enabled && bgmState.volume > 0;
}

function startPeacefulMusic() {
  if (!shouldPlayPeacefulMusic() || audioState.music.peaceful) {
    return;
  }

  ensureAudioContext();
  const audioContext = audioState.context;
  if (!audioContext) {
    return;
  }

  const masterGain = audioContext.createGain();
  masterGain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.045 * bgmVolumeRatio()), audioContext.currentTime + 0.8);
  masterGain.connect(audioContext.destination);

  const tempo = 84;
  const beatSeconds = 60 / tempo;
  const stepSeconds = beatSeconds * 0.5;
  const scheduleAheadSeconds = 0.4;
  const chords = [
    [60, 64, 67, 72],
    [57, 60, 64, 69],
    [55, 59, 62, 67],
    [53, 57, 60, 65],
  ];

  const state = {
    baseGain: 0.045,
    gain: masterGain,
    timerId: null,
    nextTime: audioContext.currentTime + 0.05,
    stepIndex: 0,
  };

  function scheduleTone(time, midi, duration, type, volume) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(midiToHz(midi), time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  function scheduler() {
    if (!shouldPlayPeacefulMusic()) {
      stopPeacefulMusic();
      return;
    }

    while (state.nextTime < audioContext.currentTime + scheduleAheadSeconds) {
      const chord = chords[Math.floor(state.stepIndex / 8) % chords.length];
      const chordStep = state.stepIndex % 8;
      const note = chord[chordStep % chord.length] + (chordStep >= 4 ? 12 : 0);
      const root = chord[0] - 12;

      scheduleTone(state.nextTime, note, stepSeconds * 1.8, "sine", 0.018);
      if (chordStep === 0 || chordStep === 4) {
        scheduleTone(state.nextTime, root, beatSeconds * 3.2, "triangle", 0.026);
      }
      if (chordStep === 2 || chordStep === 6) {
        scheduleTone(state.nextTime + stepSeconds * 0.15, chord[2] + 12, beatSeconds * 1.4, "sine", 0.012);
      }

      state.nextTime += stepSeconds;
      state.stepIndex += 1;
    }
  }

  state.timerId = setInterval(scheduler, 80);
  audioState.music.peaceful = state;
}

function updatePeacefulMusicState() {
  if (shouldPlayPeacefulMusic()) {
    startPeacefulMusic();
  } else {
    stopPeacefulMusic();
  }
}

function stopDanceMusic() {
  const existing = audioState.music.dance;
  if (!existing) {
    return;
  }

  if (existing.timerId) {
    clearInterval(existing.timerId);
  }

  const audioContext = audioState.context;
  if (audioContext && existing.gain) {
    const now = audioContext.currentTime;
    try {
      existing.gain.gain.cancelScheduledValues(now);
      existing.gain.gain.setValueAtTime(existing.gain.gain.value || 0.0001, now);
      existing.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    } catch (_) {
      // Ignore if the node has already been disconnected.
    }
  }

  audioState.music.dance = null;
}

function startDanceMusic() {
  if (!bgmState.enabled || bgmState.volume <= 0) {
    return;
  }

  stopPeacefulMusic();
  ensureAudioContext();
  const audioContext = audioState.context;
  if (!audioContext) {
    return;
  }

  if (audioState.music.dance) {
    return;
  }

  const masterGain = audioContext.createGain();
  masterGain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.08 * bgmVolumeRatio()), audioContext.currentTime + 0.06);
  masterGain.connect(audioContext.destination);

  const tempo = 132;
  const stepSeconds = 60 / tempo / 4; // 16th notes
  const scheduleAheadSeconds = 0.12;

  const bass = [48, 48, 55, 55, 57, 57, 55, 55]; // C2 G2 A2 G2 (arcade loop)
  const melody = [72, 74, 76, 79, 76, 74, 72, 67]; // C5 D5 E5 G5 ...
  const hats = [1, 0, 1, 0, 1, 0, 1, 0];

  const state = {
    baseGain: 0.08,
    gain: masterGain,
    timerId: null,
    nextTime: audioContext.currentTime + 0.02,
    stepIndex: 0,
  };

  function scheduleTone(time, freq, duration, type, volume) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(time);
    osc.stop(time + duration + 0.02);
  }

  function scheduleKick(time) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, time);
    osc.frequency.exponentialRampToValueAtTime(52, time + 0.09);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.11, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.11);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(time);
    osc.stop(time + 0.14);
  }

  function scheduleHat(time) {
    const bufferSize = 0.03;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(880 + Math.random() * 140, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.035, time + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + bufferSize);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(time);
    osc.stop(time + bufferSize + 0.01);
  }

  function scheduler() {
    if (!bgmState.enabled || bgmState.volume <= 0 || !danceEvent.active) {
      stopDanceMusic();
      return;
    }

    while (state.nextTime < audioContext.currentTime + scheduleAheadSeconds) {
      const step = state.stepIndex % 16;
      const barStep = state.stepIndex % 8;

      if (step % 4 === 0) {
        scheduleKick(state.nextTime);
      }

      if (hats[barStep]) {
        scheduleHat(state.nextTime);
      }

      const bassNote = bass[barStep];
      scheduleTone(state.nextTime, midiToHz(bassNote), stepSeconds * 0.95, "triangle", 0.055);

      const melodyNote = melody[barStep];
      scheduleTone(state.nextTime + stepSeconds * 0.5, midiToHz(melodyNote), stepSeconds * 0.7, "square", 0.03);

      state.nextTime += stepSeconds;
      state.stepIndex += 1;
    }
  }

  state.timerId = setInterval(scheduler, 25);
  audioState.music.dance = state;
}

function stopMythicRevealSound() {
  const audioContext = audioState.context;
  if (!audioContext || !audioState.sfx.mythicNodes.length) {
    audioState.sfx.mythicNodes.length = 0;
    return;
  }

  const now = audioContext.currentTime;
  for (const entry of audioState.sfx.mythicNodes) {
    try {
      entry.gain.gain.cancelScheduledValues(now);
      entry.gain.gain.setValueAtTime(Math.max(0.0001, entry.gain.gain.value || 0.0001), now);
      entry.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
      entry.osc.stop(now + 0.04);
    } catch (_) {
      // Ignore nodes that already ended.
    }
  }
  audioState.sfx.mythicNodes.length = 0;
}

function playSound(type) {
  if (audioState.muted) {
    return;
  }

  ensureAudioContext();
  const audioContext = audioState.context;
  if (!audioContext) {
    return;
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  const now = audioContext.currentTime;
  gain.gain.setValueAtTime(0.0001, now);

  // Short oscillator envelopes keep the sound retro and dependency-free.
  if (type === "jump") {
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(420, now);
    oscillator.frequency.exponentialRampToValueAtTime(620, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    oscillator.start(now);
    oscillator.stop(now + 0.12);
    return;
  }

  if (type === "doubleJump") {
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(540, now);
    oscillator.frequency.exponentialRampToValueAtTime(860, now + 0.09);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    oscillator.start(now);
    oscillator.stop(now + 0.14);
    return;
  }

  if (type === "coin") {
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(660, now);
    oscillator.frequency.exponentialRampToValueAtTime(990, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    oscillator.start(now);
    oscillator.stop(now + 0.16);
    return;
  }

  if (type === "button") {
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(820, now);
    oscillator.frequency.exponentialRampToValueAtTime(620, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.055, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    oscillator.start(now);
    oscillator.stop(now + 0.1);
    return;
  }

  if (type === "ice") {
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(940, now);
    oscillator.frequency.exponentialRampToValueAtTime(360, now + 0.16);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    oscillator.start(now);
    oscillator.stop(now + 0.22);
    return;
  }

  if (type === "lightning") {
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    oscillator.type = "sawtooth";
    osc2.type = "square";
    oscillator.frequency.setValueAtTime(1180, now);
    oscillator.frequency.exponentialRampToValueAtTime(180, now + 0.18);
    osc2.frequency.setValueAtTime(72, now);
    osc2.frequency.exponentialRampToValueAtTime(46, now + 0.22);
    osc2.connect(gain2);
    gain2.connect(audioContext.destination);
    gain2.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.008);
    gain2.gain.exponentialRampToValueAtTime(0.055, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    oscillator.start(now);
    osc2.start(now);
    oscillator.stop(now + 0.22);
    osc2.stop(now + 0.3);
    return;
  }

  if (type === "stomp") {
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(180, now);
    oscillator.frequency.exponentialRampToValueAtTime(90, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    oscillator.start(now);
    oscillator.stop(now + 0.18);
    return;
  }

  if (type === "clear") {
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(520, now);
    oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.22);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    oscillator.start(now);
    oscillator.stop(now + 0.28);
    return;
  }

  if (type === "boxShake") {
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(132, now);
    oscillator.frequency.exponentialRampToValueAtTime(94, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    oscillator.start(now);
    oscillator.stop(now + 0.22);
    return;
  }

  if (type === "boxOpen") {
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(240, now);
    oscillator.frequency.exponentialRampToValueAtTime(410, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.065, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    oscillator.start(now);
    oscillator.stop(now + 0.18);
    return;
  }

  if (type === "resultReveal") {
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(460, now);
    oscillator.frequency.exponentialRampToValueAtTime(720, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    oscillator.start(now);
    oscillator.stop(now + 0.22);
    return;
  }

  if (type === "resultRevealEpic") {
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    oscillator.type = "triangle";
    osc2.type = "sine";
    oscillator.frequency.setValueAtTime(520, now);
    oscillator.frequency.exponentialRampToValueAtTime(920, now + 0.22);
    osc2.frequency.setValueAtTime(780, now + 0.02);
    osc2.frequency.exponentialRampToValueAtTime(1180, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.01);
    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.exponentialRampToValueAtTime(0.032, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
    osc2.connect(gain2);
    gain2.connect(audioContext.destination);
    oscillator.start(now);
    osc2.start(now);
    oscillator.stop(now + 0.3);
    osc2.stop(now + 0.28);
    return;
  }

  if (type === "resultRevealLegendary") {
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    oscillator.type = "triangle";
    osc2.type = "sawtooth";
    oscillator.frequency.setValueAtTime(210, now);
    oscillator.frequency.exponentialRampToValueAtTime(420, now + 0.28);
    osc2.frequency.setValueAtTime(320, now + 0.02);
    osc2.frequency.exponentialRampToValueAtTime(220, now + 0.34);
    gain.gain.exponentialRampToValueAtTime(0.075, now + 0.01);
    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.exponentialRampToValueAtTime(0.038, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
    osc2.connect(gain2);
    gain2.connect(audioContext.destination);
    oscillator.start(now);
    osc2.start(now);
    oscillator.stop(now + 0.44);
    osc2.stop(now + 0.4);
    return;
  }

  if (type === "resultRevealMythic") {
    stopMythicRevealSound();
    const osc2 = audioContext.createOscillator();
    const osc3 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    const gain3 = audioContext.createGain();
    oscillator.type = "sine";
    osc2.type = "triangle";
    osc3.type = "sine";

    oscillator.frequency.setValueAtTime(96, now);
    oscillator.frequency.exponentialRampToValueAtTime(132, now + 0.46);
    osc2.frequency.setValueAtTime(320, now + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(880, now + 0.54);
    osc3.frequency.setValueAtTime(1180, now + 0.32);
    osc3.frequency.exponentialRampToValueAtTime(1580, now + 0.56);

    gain.gain.setValueAtTime(0.0001, now);
    gain2.gain.setValueAtTime(0.0001, now);
    gain3.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.055, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.026, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.048, now + 0.22);
    gain2.gain.exponentialRampToValueAtTime(0.024, now + 0.56);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.96);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    gain3.gain.exponentialRampToValueAtTime(0.03, now + 0.42);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

    osc2.connect(gain2);
    osc3.connect(gain3);
    gain2.connect(audioContext.destination);
    gain3.connect(audioContext.destination);

    audioState.sfx.mythicNodes.push(
      { osc: oscillator, gain },
      { osc: osc2, gain: gain2 },
      { osc: osc3, gain: gain3 },
    );

    oscillator.start(now);
    osc2.start(now);
    osc3.start(now);
    oscillator.stop(now + 1.12);
    osc2.stop(now + 0.98);
    osc3.stop(now + 0.92);
    setTimeout(() => {
      audioState.sfx.mythicNodes = audioState.sfx.mythicNodes.filter((entry) => ![oscillator, osc2, osc3].includes(entry.osc));
    }, 1200);
    return;
  }

  if (type === "nightmare") {
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    oscillator.type = "sawtooth";
    osc2.type = "triangle";
    oscillator.frequency.setValueAtTime(92, now);
    oscillator.frequency.exponentialRampToValueAtTime(54, now + 0.9);
    osc2.frequency.setValueAtTime(148, now);
    osc2.frequency.exponentialRampToValueAtTime(88, now + 0.7);
    oscillator.connect(gain);
    osc2.connect(gain2);
    gain.connect(audioContext.destination);
    gain2.connect(audioContext.destination);
    gain.gain.setValueAtTime(0.0001, now);
    gain2.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.075, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.05, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);
    oscillator.start(now);
    osc2.start(now);
    oscillator.stop(now + 1.2);
    osc2.stop(now + 0.95);
  }
}

function resetAssassinationEvent() {
  assassinationEvent.active = false;
  assassinationEvent.mode = "";
  assassinationEvent.targetType = "";
  assassinationEvent.target = null;
  assassinationEvent.targetBounds = null;
  assassinationEvent.timer = 0;
  assassinationEvent.gauge = 0;
  assassinationEvent.flash = 0;
  assassinationEvent.successText = "";
  assassinationEvent.advantaged = false;
}

function breakAssassinStealth() {
  const wasActive = player.stealthActive;
  player.stealthActive = false;
  player.stealthTimer = 0;
  if (wasActive) {
    player.stealthCooldown = Math.max(player.stealthCooldown, ASSASSIN_RULES.stealthCooldown);
  }
}

function activateAssassinStealth() {
  if (!isAssassinEquipped() || player.stealthActive || player.stealthCooldown > 0 || gameState !== "playing") {
    return;
  }
  if (nightmareEvent.active || nightmareEvent.countdown || danceEvent.active || danceEvent.countdown || clawEscapeEvent.active) {
    return;
  }
  player.stealthActive = true;
  player.stealthTimer = ASSASSIN_RULES.stealthDuration;
  playSound("button");
}

function createChangerClone() {
  if (!isChangerEquipped() || gameState !== "playing") {
    return;
  }
  if (changerState.cloneUsedThisRun) {
    return;
  }
  if (nightmareEvent.active || nightmareEvent.countdown || danceEvent.active || danceEvent.countdown || clawEscapeEvent.active || assassinationEvent.active) {
    return;
  }

  changerState.clone = {
    x: player.x,
    y: player.y,
    w: player.w,
    h: player.h,
    facing: player.facing,
    crouching: player.crouching,
    state: player.state,
    animationTime: player.animationTime,
  };
  changerState.cloneUsedThisRun = true;
  changerState.effectFrom = { x: player.x, y: player.y };
  changerState.effectTo = { x: player.x, y: player.y };
  changerState.effectTimer = CHANGER_RULES.effectDuration * 0.7;
  playSound("button");
}

function consumeGuardianPassive() {
  if (!isGuardianEquipped() || !player.guardianPassiveReady) {
    return false;
  }
  player.guardianPassiveReady = false;
  player.guardianFlash = GUARDIAN_RULES.passiveInvulnerability;
  player.guardianShieldTimer = Math.max(player.guardianShieldTimer, GUARDIAN_RULES.passiveInvulnerability);
  player.invulnerableTime = Math.max(player.invulnerableTime, GUARDIAN_RULES.passiveInvulnerability);
  playSound("clear");
  return true;
}

function activateGuardianShield() {
  if (!isGuardianEquipped() || gameState !== "playing" || player.guardianShieldTimer > 0 || player.guardianShieldCooldown > 0) {
    return;
  }
  if (nightmareEvent.active || nightmareEvent.countdown || danceEvent.active || danceEvent.countdown || clawEscapeEvent.active || assassinationEvent.active) {
    return;
  }
  player.guardianShieldTimer = GUARDIAN_RULES.shieldDuration;
  player.guardianShieldCooldown = GUARDIAN_RULES.shieldCooldown;
  player.guardianFlash = GUARDIAN_RULES.shieldDuration;
  playSound("clear");
}

function currentLightnerStackCooldown() {
  return lightnerState.awakenTimer > 0 ? LIGHTNER_RULES.awakenedStackCooldown : LIGHTNER_RULES.stackCooldown;
}

function currentLightnerFieldCooldown() {
  return lightnerState.awakenTimer > 0 ? LIGHTNER_RULES.awakenedFieldCooldown : LIGHTNER_RULES.fieldCooldown;
}

function registerLightnerKill() {
  if (!isLightnerEquipped() || lightnerState.awakenTimer > 0) {
    return;
  }
  lightnerState.awakenKills = Math.min(LIGHTNER_RULES.awakenKillsRequired, lightnerState.awakenKills + 1);
}

function registerWildHunterKill(source = "skill") {
  if (!isWildHunterEquipped()) {
    return;
  }
  if (wildHunterState.awakenTimer <= 0) {
    wildHunterState.awakenKills = Math.min(WILD_HUNTER_RULES.awakenKillsRequired, wildHunterState.awakenKills + 1);
  }
  if (source === "stomp" || source === "slam") {
    wildHunterState.instinctTimer = WILD_HUNTER_RULES.instinctDuration;
  }
}

function registerCombatKill(source = "skill") {
  registerLightnerKill();
  registerWildHunterKill(source);
}

function addLightnerEffect(type, x, y, duration = 0.45, extra = {}) {
  lightnerState.effects.push({ type, x, y, duration, timer: duration, ...extra });
}

function addWildHunterEffect(type, x, y, duration = 0.45, extra = {}) {
  wildHunterState.effects.push({ type, x, y, duration, timer: duration, ...extra });
}

function activateLightnerAnchor() {
  if (!isLightnerEquipped() || gameState !== "playing" || assassinationEvent.active || nightmareEvent.active || nightmareEvent.countdown || danceEvent.active || danceEvent.countdown || clawEscapeEvent.active) {
    return;
  }

  if (lightnerState.anchor) {
    const anchor = lightnerState.anchor;
    if (anchor.x >= camera.x && anchor.x <= camera.x + GAME_WIDTH && anchor.y >= -40 && anchor.y <= GAME_HEIGHT + 40) {
      addLightnerEffect("teleport", player.x + player.w * 0.5, player.y + player.h * 0.5, 0.52, { toX: anchor.x, toY: anchor.y });
      player.x = Math.max(0, Math.min(worldWidth - player.w, anchor.x - player.w * 0.5));
      player.y = Math.max(0, Math.min(GAME_HEIGHT - player.h, anchor.y - player.h * 0.5));
      player.vx = 0;
      player.vy = 0;
      player.invulnerableTime = Math.max(player.invulnerableTime, 0.25);
      lightnerState.anchor = null;
      screenShakeTimer = Math.max(screenShakeTimer, 0.12);
      playSound("lightning");
    }
    return;
  }

  if (lightnerState.stacks <= 0) {
    return;
  }
  lightnerState.stacks -= 1;
  if (lightnerState.stackRechargeTimer <= 0) {
    lightnerState.stackRechargeTimer = currentLightnerStackCooldown();
  }
  lightnerState.anchor = {
    x: player.x + player.w * 0.5,
    y: player.y + player.h * 0.5,
    timer: LIGHTNER_RULES.anchorLife,
  };
  addLightnerEffect("anchor", lightnerState.anchor.x, lightnerState.anchor.y, LIGHTNER_RULES.anchorLife);
  playSound("button");
}

function stunEnemyWithLightner(enemy, duration, slow = false) {
  if (enemy.type === "walker") {
    const direction = Math.sign(enemy.vx) || Math.sign(enemy.lightnerResumeVx) || 1;
    enemy.lightnerResumeVx = direction * (enemy.patrolSpeed || Math.abs(enemy.vx) || 70);
  }
  enemy.lightnerStunTimer = Math.max(enemy.lightnerStunTimer || 0, duration);
  if (slow) {
    enemy.lightnerSlowTimer = Math.max(enemy.lightnerSlowTimer || 0, duration + 2);
  }
  enemy.vx = 0;
  if (enemy.type === "frostWarden") {
    enemy.state = "idle";
    enemy.cooldown = Math.max(enemy.cooldown || 0, 0.65);
  }
}

function isEnemyStunnedByLightner(enemy) {
  return (enemy?.lightnerStunTimer || 0) > 0;
}

function recoverEnemyFromLightnerStun(enemy) {
  if (enemy.type === "walker") {
    enemy.vx = enemy.lightnerResumeVx || enemy.patrolSpeed || 70;
    enemy.lightnerResumeVx = 0;
  } else if (enemy.type === "excavator") {
    enemy.state = "idle";
    enemy.cooldown = Math.max(enemy.cooldown || 0, 0.35);
  } else if (enemy.type === "frostWarden") {
    enemy.state = "idle";
    enemy.cooldown = Math.max(enemy.cooldown || 0, 0.65);
  }
}

function activateLightnerField() {
  if (!isLightnerEquipped() || gameState !== "playing" || lightnerState.fieldCooldown > 0 || assassinationEvent.active || nightmareEvent.active || nightmareEvent.countdown || danceEvent.active || danceEvent.countdown || clawEscapeEvent.active) {
    return;
  }
  const cx = player.x + player.w * 0.5;
  const cy = player.y + player.h * 0.5;
  const radius = LIGHTNER_RULES.fieldRadius;
  for (const enemy of level.enemies) {
    if (!enemy.alive || enemy.defeated) {
      continue;
    }
    const ex = enemy.x + enemy.w * 0.5;
    if (Math.abs(ex - cx) > radius) {
      continue;
    }
    const boss = isBossEntity(enemy, enemy.type);
    stunEnemyWithLightner(enemy, boss ? LIGHTNER_RULES.bossStun : LIGHTNER_RULES.normalStun, boss);
  }
  for (const serpent of level.serpentEnemies) {
    if (serpent.defeated || !serpent.alive) {
      continue;
    }
    const hitbox = getSerpentHitbox(serpent);
    const sx = hitbox.x + hitbox.w * 0.5;
    if (Math.abs(sx - cx) <= radius) {
      serpent.alive = false;
      serpent.stunTimer = Math.max(serpent.stunTimer || 0, LIGHTNER_RULES.normalStun);
      serpent.state = "stunned";
    }
  }
  lightnerState.fieldCooldown = currentLightnerFieldCooldown();
  addLightnerEffect("field", cx, cy, 0.72, { radius });
  screenShakeTimer = Math.max(screenShakeTimer, 0.28);
  playSound("lightning");
}

function activateLightnerAwaken() {
  if (!isLightnerEquipped() || gameState !== "playing" || lightnerState.awakenTimer > 0 || lightnerState.awakenKills < LIGHTNER_RULES.awakenKillsRequired || assassinationEvent.active) {
    return;
  }
  lightnerState.awakenTimer = LIGHTNER_RULES.awakenDuration;
  lightnerState.awakenKills = 0;
  if (lightnerState.stackRechargeTimer > LIGHTNER_RULES.awakenedStackCooldown) {
    lightnerState.stackRechargeTimer = LIGHTNER_RULES.awakenedStackCooldown;
  }
  if (lightnerState.fieldCooldown > LIGHTNER_RULES.awakenedFieldCooldown) {
    lightnerState.fieldCooldown = LIGHTNER_RULES.awakenedFieldCooldown;
  }
  if (lightnerState.stacks > 0) {
    lightnerState.stacks = Math.min(LIGHTNER_RULES.maxStacks, lightnerState.stacks + 1);
  }
  addLightnerEffect("awaken", player.x + player.w * 0.5, player.y + player.h * 0.5, LIGHTNER_RULES.awakenDuration);
  playSound("clear");
}

function getWildHunterJumpMultiplier() {
  return isWildHunterEquipped() && wildHunterState.instinctTimer > 0 ? WILD_HUNTER_RULES.instinctJumpMultiplier : 1;
}

function isWildHunterSkillLocked() {
  return gameState !== "playing" ||
    assassinationEvent.active ||
    nightmareEvent.active ||
    nightmareEvent.countdown ||
    danceEvent.active ||
    danceEvent.countdown ||
    clawEscapeEvent.active ||
    player.stunTimer > 0 ||
    wildHunterState.blastDelayTimer > 0 ||
    wildHunterState.slamActive;
}

function getEnemyCenter(entity) {
  return {
    x: entity.x + entity.w * 0.5,
    y: entity.y + entity.h * 0.5,
  };
}

function damageBossByWildHunter(enemy, damage) {
  if (!enemy || enemy.defeated || enemy.alive === false) {
    return false;
  }
  enemy.maxHp = enemy.maxHp || (enemy.type === "frostWarden" ? 400 : 200);
  enemy.hp = Math.max(0, (enemy.hp ?? enemy.maxHp) - damage);
  enemy.lightnerStunTimer = Math.max(enemy.lightnerStunTimer || 0, 0.18);
  enemy.vx = (enemy.x + enemy.w * 0.5 < player.x + player.w * 0.5 ? -1 : 1) * 130;
  if (enemy.hp > 0) {
    return false;
  }
  enemy.alive = false;
  enemy.defeated = true;
  enemy.qteMeltTimer = Math.max(enemy.qteMeltTimer || 0, 1.2);
  registerWildHunterKill("skill");
  if (enemy.type === "frostWarden" && level.theme === "frozen") {
    finishFrozenStageByWarden();
  }
  return true;
}

function defeatNormalEnemyByWildHunter(enemy, source = "skill") {
  if (!enemy || !enemy.alive || enemy.defeated || isBossEntity(enemy, enemy.type)) {
    return false;
  }
  enemy.alive = false;
  enemy.squishTimer = 0.35;
  enemy.vx = (enemy.x + enemy.w * 0.5 < player.x + player.w * 0.5 ? -1 : 1) * 220;
  enemy.vy = -240;
  score += 280 + currentStageIndex * 55;
  if (level.theme !== "frozen") {
    awardCoins(8 + currentStageIndex);
  }
  registerCombatKill(source);
  return true;
}

function defeatSerpentByWildHunter(serpent, source = "skill") {
  if (!serpent || serpent.defeated || !serpent.alive || serpent.type === "seaMonster") {
    return false;
  }
  serpent.alive = false;
  serpent.stunTimer = 1.2;
  serpent.state = "stunned";
  serpent.strikeProgress = 0;
  score += 420 + currentStageIndex * 80;
  if (level.theme !== "frozen") {
    awardCoins(10 + currentStageIndex);
  }
  registerCombatKill(source);
  return true;
}

function activateWildHunterBlast() {
  if (!isWildHunterEquipped() || wildHunterState.blastUsed || isWildHunterSkillLocked()) {
    return;
  }
  wildHunterState.blastUsed = true;
  wildHunterState.blastDelayTimer = WILD_HUNTER_RULES.blastDelay;
  const cx = player.x + player.w * 0.5;
  const cy = player.y + player.h * 0.5;
  const radius = WILD_HUNTER_RULES.blastRadius;
  let normalKills = 0;

  for (const enemy of level.enemies) {
    if (!enemy.alive || enemy.defeated) {
      continue;
    }
    const center = getEnemyCenter(enemy);
    if (Math.hypot(center.x - cx, center.y - cy) > radius) {
      continue;
    }
    if (isBossEntity(enemy, enemy.type)) {
      const maxHp = enemy.maxHp || (enemy.type === "frostWarden" ? 400 : 200);
      damageBossByWildHunter(enemy, maxHp * WILD_HUNTER_RULES.bossBlastDamageRatio);
    } else if (normalKills < WILD_HUNTER_RULES.blastMaxNormalKills && defeatNormalEnemyByWildHunter(enemy, "skill")) {
      normalKills += 1;
    }
  }

  for (const serpent of level.serpentEnemies) {
    if (normalKills >= WILD_HUNTER_RULES.blastMaxNormalKills || serpent.defeated || !serpent.alive) {
      continue;
    }
    const hitbox = getSerpentHitbox(serpent);
    const sx = hitbox.x + hitbox.w * 0.5;
    const sy = hitbox.y + hitbox.h * 0.5;
    if (Math.hypot(sx - cx, sy - cy) <= radius && defeatSerpentByWildHunter(serpent, "skill")) {
      normalKills += 1;
    }
  }

  addWildHunterEffect("blast", cx, cy, 0.42, { radius });
  screenShakeTimer = Math.max(screenShakeTimer, 0.24);
  playSound("stomp");
}

function activateWildHunterSlam() {
  if (!isWildHunterEquipped() || isWildHunterSkillLocked() || player.onGround || wildHunterState.slamCooldown > 0) {
    return;
  }
  wildHunterState.slamActive = true;
  wildHunterState.slamHit = false;
  wildHunterState.slamCooldown = WILD_HUNTER_RULES.slamCooldown;
  player.vy = WILD_HUNTER_RULES.slamSpeed;
  player.vx *= 0.55;
  addWildHunterEffect("slamStart", player.x + player.w * 0.5, player.y + player.h * 0.5, 0.22);
  playSound("button");
}

function activateWildHunterAwaken() {
  if (!isWildHunterEquipped() || isWildHunterSkillLocked() || wildHunterState.awakenTimer > 0 || wildHunterState.awakenKills < WILD_HUNTER_RULES.awakenKillsRequired) {
    return;
  }
  wildHunterState.awakenTimer = WILD_HUNTER_RULES.awakenDuration;
  wildHunterState.awakenKills = 0;
  wildHunterState.instinctTimer = Math.max(wildHunterState.instinctTimer, WILD_HUNTER_RULES.instinctDuration);
  addWildHunterEffect("awaken", player.x + player.w * 0.5, player.y + player.h * 0.5, WILD_HUNTER_RULES.awakenDuration);
  screenShakeTimer = Math.max(screenShakeTimer, 0.35);
  playSound("clear");
}

function swapChangerWithClone() {
  if (!isChangerEquipped() || gameState !== "playing" || !changerState.clone || changerState.swapCooldown > 0) {
    return;
  }

  const clone = changerState.clone;
  const from = { x: player.x, y: player.y };
  const to = { x: clone.x, y: clone.y };

  changerState.clone = {
    x: player.x,
    y: player.y,
    w: player.w,
    h: player.h,
    facing: player.facing,
    crouching: player.crouching,
    state: player.state,
    animationTime: player.animationTime,
  };

  player.x = clone.x;
  player.y = clone.y;
  player.vx = 0;
  player.vy = 0;
  player.facing = clone.facing;
  player.crouching = clone.crouching;
  player.h = clone.crouching ? player.crouchH : player.standH;
  player.onGround = false;
  changerState.swapCooldown = CHANGER_RULES.swapCooldown;
  changerState.effectFrom = from;
  changerState.effectTo = to;
  changerState.effectTimer = CHANGER_RULES.effectDuration;
  player.invulnerableTime = Math.max(player.invulnerableTime, 0.2);
  playSound("clear");
}

function transferToChangerClone() {
  if (!isChangerEquipped() || !changerState.clone) {
    return false;
  }

  const clone = changerState.clone;
  const origin = { x: player.x, y: player.y };
  player.x = clone.x;
  player.y = clone.y;
  player.vx = 0;
  player.vy = 0;
  player.facing = clone.facing;
  player.h = player.standH;
  player.crouching = false;
  player.onGround = false;
  player.jumpsRemaining = Math.max(1, player.maxJumps - 1);
  player.invulnerableTime = Math.max(player.invulnerableTime, CHANGER_RULES.transferInvulnerability);
  player.cloneTransferFlash = CHANGER_RULES.effectDuration;
  changerState.effectFrom = origin;
  changerState.effectTo = { x: clone.x, y: clone.y };
  changerState.effectTimer = CHANGER_RULES.effectDuration;
  changerState.clone = null;
  changerState.swapCooldown = 0;
  playSound("clear");
  return true;
}

function getEnemyBounds(entity, type) {
  if (type === "serpent") {
    return getSerpentHitbox(entity);
  }
  return {
    x: entity.x,
    y: entity.y,
    w: entity.w,
    h: entity.h,
  };
}

function getEnemyFacingDirection(entity, type) {
  if (type === "excavator") {
    return entity.facing || 1;
  }
  if (type === "serpent") {
    return Math.sign((entity.strikeX || entity.homeX) - entity.homeX) || 1;
  }
  if (type === "boss") {
    return entity.facing || 1;
  }
  return Math.sign(entity.vx) || entity.facing || 1;
}

function isBossEntity(entity, type) {
  return type === "boss" || entity.type === "boss" || entity.isBoss;
}

function isSeaMonsterEntity(entity, type) {
  return type === "seaMonster" || type === "serpent" || entity?.type === "seaMonster";
}

function canAssassinTargetEntity(entity, type) {
  if (!entity || entity.defeated) {
    return false;
  }
  if (isSeaMonsterEntity(entity, type)) {
    return false;
  }
  if (type === "serpent") {
    return entity.alive;
  }
  return entity.alive !== false || isBossEntity(entity, type);
}

function findAssassinationTarget() {
  if (!isAssassinEquipped() || gameState !== "playing") {
    return null;
  }

  const playerCenterX = player.x + player.w * 0.5;
  const playerCenterY = player.y + player.h * 0.5;
  let bestTarget = null;
  let bestDistance = Infinity;

  const considerTarget = (entity, type) => {
    if (!canAssassinTargetEntity(entity, type)) {
      return;
    }

    const bounds = getEnemyBounds(entity, type);
    const targetCenterX = bounds.x + bounds.w * 0.5;
    const targetCenterY = bounds.y + bounds.h * 0.5;
    const deltaX = targetCenterX - playerCenterX;
    const deltaY = targetCenterY - playerCenterY;

    if (Math.abs(deltaX) > ASSASSIN_RULES.qteRangeX || Math.abs(deltaY) > ASSASSIN_RULES.qteRangeY) {
      return;
    }

    const distance = Math.hypot(deltaX, deltaY);
    if (distance >= bestDistance) {
      return;
    }

    const facing = getEnemyFacingDirection(entity, type);
    const behind = facing > 0 ? playerCenterX < targetCenterX - 4 : playerCenterX > targetCenterX + 4;

    bestDistance = distance;
    bestTarget = {
      entity,
      type: isBossEntity(entity, type) ? "boss" : type,
      bounds,
      behind,
    };
  };

  for (const enemy of level.enemies) {
    considerTarget(enemy, enemy.type);
  }
  for (const serpent of level.serpentEnemies) {
    considerTarget(serpent, "serpent");
  }

  return bestTarget;
}

function finishAssassination(success) {
  const target = assassinationEvent.target;
  const targetType = assassinationEvent.targetType;
  const eventMode = assassinationEvent.mode;
  const failedFrontAttack = eventMode === "qte" || eventMode === "wardenQte";
  resetAssassinationEvent();

  if (!target) {
    return;
  }

  if (!success) {
    if (eventMode === "wardenQte") {
      lives = 0;
      gameState = "gameover";
      player.vx = 0;
      player.vy = 0;
      playSound("nightmare");
      return;
    }
    player.stunTimer = Math.max(player.stunTimer, failedFrontAttack ? ASSASSIN_RULES.frontalFailStun : 0.2);
    player.invulnerableTime = Math.max(player.invulnerableTime, 0.3);
    player.vx = 0;
    playSound("nightmare");
    return;
  }

  if (targetType === "boss") {
    const damage = target.type === "frostWarden" ? 999 : ASSASSIN_RULES.bossDamage;
    target.hp = Math.max(0, (target.hp ?? 100) - damage);
    if (target.hp <= 0) {
      target.alive = false;
      target.defeated = true;
      registerLightnerKill();
      if (target.type === "frostWarden") {
        target.qteMeltTimer = 1.2;
        target.vx = 0;
        target.vy = 0;
        screenShakeTimer = 0.55;
        playSound("ice");
        playSound("coin");
        finishFrozenStageByWarden();
        return;
      }
    }
    score += 900 + currentStageIndex * 120;
    awardCoins(28 + currentStageIndex * 3);
  } else if (targetType === "serpent") {
    target.alive = false;
    target.defeated = true;
    registerLightnerKill();
    target.stunTimer = 0;
    target.rise = 0;
    target.state = "stunned";
    score += 550 + currentStageIndex * 90;
    if (level.theme !== "frozen") {
      awardCoins(16 + currentStageIndex * 2);
    }
  } else {
    target.alive = false;
    target.defeated = true;
    registerLightnerKill();
    target.squishTimer = 0.3;
    score += target.type === "excavator" ? 650 + currentStageIndex * 100 : 450 + currentStageIndex * 70;
    if (level.theme !== "frozen") {
      awardCoins(target.type === "excavator" ? 18 + currentStageIndex * 2 : 12 + currentStageIndex * 2);
    }
  }

  player.invulnerableTime = Math.max(player.invulnerableTime, 0.7);
  player.assassinationCooldown = ASSASSIN_RULES.assassinationCooldown;
  playSound("clear");
}

function beginAssassination() {
  if (!isAssassinEquipped() || assassinationEvent.active || player.stunTimer > 0 || player.assassinationCooldown > 0 || gameState !== "playing") {
    return;
  }
  if (nightmareEvent.active || nightmareEvent.countdown || danceEvent.active || danceEvent.countdown || clawEscapeEvent.active) {
    return;
  }

  const target = findAssassinationTarget();
  if (!target) {
    return;
  }

  breakAssassinStealth();
  player.vx = 0;
  player.assassinationCooldown = ASSASSIN_RULES.assassinationCooldown;

  assassinationEvent.active = true;
  assassinationEvent.target = target.entity;
  assassinationEvent.targetType = target.type;
  assassinationEvent.targetBounds = target.bounds;
  assassinationEvent.flash = 1;
  assassinationEvent.gauge = target.entity?.type === "frostWarden" ? FROST_WARDEN_QTE.startGauge : 0;

  if (target.entity?.type === "frostWarden") {
    assassinationEvent.mode = "wardenQte";
    assassinationEvent.timer = FROST_WARDEN_QTE.duration;
    assassinationEvent.successText = "Frost Clash";
    assassinationEvent.advantaged = true;
  } else if (target.behind && target.type !== "boss") {
    assassinationEvent.mode = "backstab";
    assassinationEvent.timer = ASSASSIN_RULES.strikeWindup;
    assassinationEvent.successText = "Backstab";
  } else {
    const bossFight = target.type === "boss";
    assassinationEvent.mode = "qte";
    assassinationEvent.timer = bossFight ? ASSASSIN_RULES.qteBossDuration : ASSASSIN_RULES.qteDuration;
    assassinationEvent.successText = bossFight ? "Boss Break" : "Front Clash";
  }

  playSound("stomp");
}

function findNearbyFrostWarden() {
  if (level.theme !== "frozen") {
    return null;
  }
  const playerCenterX = player.x + player.w * 0.5;
  const playerCenterY = player.y + player.h * 0.5;
  let best = null;
  let bestDistance = Infinity;
  for (const enemy of level.enemies) {
    if (enemy.type !== "frostWarden" || enemy.defeated || enemy.alive === false) {
      continue;
    }
    const bounds = getEnemyBounds(enemy, enemy.type);
    const enemyCenterX = bounds.x + bounds.w * 0.5;
    const enemyCenterY = bounds.y + bounds.h * 0.5;
    const dx = Math.abs(playerCenterX - enemyCenterX);
    const dy = Math.abs(playerCenterY - enemyCenterY);
    if (dx <= 120 && dy <= 96) {
      const distance = dx + dy;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = enemy;
      }
    }
  }
  return best;
}

function tryBeginFrostWardenSkillClash() {
  return beginFrostWardenClash(findNearbyFrostWarden());
}

function beginFrostWardenClash(enemy) {
  if (assassinationEvent.active || !enemy || enemy.defeated || enemy.alive === false || gameState !== "playing") {
    return false;
  }
  if (nightmareEvent.active || nightmareEvent.countdown || danceEvent.active || danceEvent.countdown || clawEscapeEvent.active) {
    return false;
  }
  if (isAssassinEquipped()) {
    breakAssassinStealth();
    player.assassinationCooldown = ASSASSIN_RULES.assassinationCooldown;
  }
  player.vx = 0;
  player.vy = Math.min(player.vy, 0);
  player.invulnerableTime = Math.max(player.invulnerableTime, 0.35);

  assassinationEvent.active = true;
  assassinationEvent.mode = "wardenQte";
  assassinationEvent.target = enemy;
  assassinationEvent.targetType = "boss";
  assassinationEvent.targetBounds = getEnemyBounds(enemy, enemy.type);
  assassinationEvent.timer = FROST_WARDEN_QTE.duration;
  assassinationEvent.gauge = FROST_WARDEN_QTE.startGauge;
  assassinationEvent.flash = 1;
  assassinationEvent.successText = "Frost Clash";
  assassinationEvent.advantaged = isAssassinEquipped();
  playSound("stomp");
  return true;
}

function tapAssassinationQte() {
  if (!assassinationEvent.active || !["qte", "wardenQte"].includes(assassinationEvent.mode)) {
    return;
  }
  const bossFight = assassinationEvent.targetType === "boss";
  const tapGain = assassinationEvent.mode === "wardenQte"
    ? assassinationEvent.advantaged
      ? FROST_WARDEN_QTE.assassinTapGain
      : FROST_WARDEN_QTE.defaultTapGain
    : bossFight
      ? ASSASSIN_RULES.qteBossTapGain
      : ASSASSIN_RULES.qteTapGain;
  assassinationEvent.gauge = Math.min(
    1,
    assassinationEvent.gauge + tapGain
  );
  assassinationEvent.flash = 1;
  playSound("button");
  if (assassinationEvent.mode !== "wardenQte" && assassinationEvent.gauge >= 1) {
    finishAssassination(true);
  }
}

function updateAssassinationEvent(dt) {
  if (!assassinationEvent.active) {
    return;
  }

  assassinationEvent.flash = Math.max(0, assassinationEvent.flash - dt * 1.8);
  assassinationEvent.timer -= dt;

  if (assassinationEvent.mode === "backstab") {
    if (assassinationEvent.timer <= 0) {
      finishAssassination(true);
    }
    return;
  }

  if (assassinationEvent.mode === "wardenQte") {
    const elapsed = FROST_WARDEN_QTE.duration - assassinationEvent.timer;
    const inEntry = elapsed < FROST_WARDEN_QTE.entryDuration;
    const inFinish = assassinationEvent.timer <= FROST_WARDEN_QTE.finishDuration;
    if (!inEntry) {
      const drainRate = assassinationEvent.advantaged
        ? inFinish
          ? FROST_WARDEN_QTE.assassinFinishDrainRate
          : FROST_WARDEN_QTE.assassinDrainRate
        : inFinish
          ? FROST_WARDEN_QTE.defaultFinishDrainRate
          : FROST_WARDEN_QTE.defaultDrainRate;
      assassinationEvent.gauge = Math.max(0, assassinationEvent.gauge - drainRate * dt);
    }
    if (assassinationEvent.timer <= 0) {
      finishAssassination(assassinationEvent.gauge >= FROST_WARDEN_QTE.successThreshold);
    }
    return;
  }

  const bossFight = assassinationEvent.targetType === "boss";
  assassinationEvent.gauge = Math.max(
    0,
    assassinationEvent.gauge - (bossFight ? ASSASSIN_RULES.qteBossDrainRate : ASSASSIN_RULES.qteDrainRate) * dt
  );

  if (assassinationEvent.timer <= 0) {
    finishAssassination(false);
  }
}

function handleInput(event, pressed) {
  if (lootBoxState.active) {
    if (pressed) {
      if (lootBoxState.revealReady) {
        closeLootBoxPanel();
      } else {
        skipLootBoxAnimation();
      }
    }
    return;
  }

  const arcadeHardDanceLive =
    isArcadeHardDanceStage() &&
    (danceEvent.active || danceEvent.countdown);

  if (arcadeHardDanceLive) {
    if (pressed && danceEvent.active) {
      const dir = directionFromDanceKey(event.key, event.code);
      if (submitDanceInput(dir)) {
        return;
      }
    }

    if (pressed && ["r", "R"].includes(event.key)) {
      restartGame();
    }
    if (pressed && ["Escape"].includes(event.key)) {
      openLobby();
    }
    return;
  }

  if (pressed && nightmareEvent.active && [" ", "Spacebar", "Enter"].includes(event.key)) {
    attemptNightmareInput();
    return;
  }

  if (assassinationEvent.active) {
    if (pressed && ["q", "Q"].includes(event.key)) {
      tapAssassinationQte();
      return;
    }
    if (pressed && ["r", "R"].includes(event.key)) {
      restartGame();
    }
    if (pressed && ["Escape"].includes(event.key)) {
      openLobby();
    }
    return;
  }

  if (["ArrowLeft", "a", "A"].includes(event.key)) {
    keys.left = pressed;
  }
  if (["ArrowRight", "d", "D"].includes(event.key)) {
    keys.right = pressed;
  }
  if (["ArrowUp", "w", "W", " "].includes(event.key)) {
    if (pressed && !keys.jump) {
      keys.jumpQueued = true;
    }
    keys.jump = pressed;
  }

  const isShift = event.key === "Shift" || event.code === "ShiftLeft" || event.code === "ShiftRight";
  const isSKey = event.key === "s" || event.key === "S" || event.code === "KeyS";
  if (isShift || isSKey) {
    keys.crouch = level.theme === "arcade" && gameState !== "lobby" ? pressed : false;
  }

  if (pressed && ["r", "R"].includes(event.key)) {
    restartGame();
  }
  if (pressed && ["Enter"].includes(event.key) && gameState === "stageclear") {
    nextStage();
  }
  if (pressed && ["e", "E"].includes(event.key)) {
    if (tryBeginFrostWardenSkillClash()) {
      return;
    }
    if (isChangerEquipped()) {
      createChangerClone();
    } else if (isLightnerEquipped()) {
      activateLightnerField();
    } else if (isWildHunterEquipped()) {
      activateWildHunterSlam();
    } else {
      activateAssassinStealth();
    }
  }
  if (pressed && ["q", "Q"].includes(event.key)) {
    if (tryBeginFrostWardenSkillClash()) {
      return;
    }
    if (isGuardianEquipped()) {
      activateGuardianShield();
    } else if (isChangerEquipped()) {
      swapChangerWithClone();
    } else if (isLightnerEquipped()) {
      activateLightnerAnchor();
    } else if (isWildHunterEquipped()) {
      activateWildHunterBlast();
    } else {
      beginAssassination();
    }
  }
  if (pressed && ["x", "X"].includes(event.key)) {
    if (isWildHunterEquipped()) {
      activateWildHunterAwaken();
    } else {
      activateLightnerAwaken();
    }
  }
  if (pressed && ["Escape"].includes(event.key)) {
    openLobby();
  }
}

document.addEventListener("keydown", (event) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "Enter", "Escape", "Spacebar"].includes(event.key)) {
    event.preventDefault();
  }
  handleInput(event, true);
});

document.addEventListener("keyup", (event) => {
  handleInput(event, false);
});

canvas.addEventListener("pointerdown", ensureAudioContext);
canvas.addEventListener("pointerdown", (event) => {
  if (!clawEscapeEvent.active) {
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;

  const btn = clawEscapeEvent.button;
  const inside =
    x >= btn.x &&
    x <= btn.x + btn.w &&
    y >= btn.y &&
    y <= btn.y + btn.h;

  if (!inside) {
    return;
  }

  clawEscapeEvent.meter = Math.min(1, clawEscapeEvent.meter + 0.02);
  clawEscapeEvent.flash = 1;
  playSound("stomp");
  if (clawEscapeEvent.meter >= 1) {
    resolveClawEscapeEvent();
  }
});

function setMobileButtonActive(button, active) {
  button.classList.toggle("active", active);
}

const mobileJoystick = document.getElementById("mobileJoystick");
const mobileJoystickKnob = document.getElementById("mobileJoystickKnob");
const mobileJoystickState = {
  active: false,
  pointerId: null,
  touchId: null,
  originX: 0,
  originY: 0,
  jumped: false,
  danceDir: null,
};

function resetMobileJoystick() {
  keys.left = false;
  keys.right = false;
  keys.crouch = false;
  keys.jump = false;
  mobileJoystickState.active = false;
  mobileJoystickState.pointerId = null;
  mobileJoystickState.touchId = null;
  mobileJoystickState.originX = 0;
  mobileJoystickState.originY = 0;
  mobileJoystickState.jumped = false;
  mobileJoystickState.danceDir = null;
  if (mobileJoystickKnob) {
    mobileJoystickKnob.style.transform = "translate(-50%, -50%)";
  }
}

function updateMobileJoystick(event) {
  if (!mobileJoystick) {
    return;
  }
  ensureAudioContext();
  const rect = mobileJoystick.getBoundingClientRect();
  const centerX = mobileJoystickState.originX || rect.left + rect.width * 0.5;
  const centerY = mobileJoystickState.originY || rect.top + rect.height * 0.5;
  const maxDistance = Math.max(34, rect.width * 0.34);
  const dx = event.clientX - centerX;
  const dy = event.clientY - centerY;
  const distance = Math.min(maxDistance, Math.hypot(dx, dy));
  const angle = Math.atan2(dy, dx);
  const knobX = Math.cos(angle) * distance;
  const knobY = Math.sin(angle) * distance;
  const normalizedX = maxDistance > 0 ? knobX / maxDistance : 0;
  const normalizedY = maxDistance > 0 ? knobY / maxDistance : 0;

  if (mobileJoystickKnob) {
    mobileJoystickKnob.style.transform = `translate(-50%, -50%) translate(${knobX}px, ${knobY}px)`;
  }

  const arcadeHardDanceLive =
    isArcadeHardDanceStage() &&
    (danceEvent.active || danceEvent.countdown);

  if (arcadeHardDanceLive) {
    keys.left = false;
    keys.right = false;
    keys.crouch = false;
    keys.jump = false;
    keys.jumpQueued = false;

    let dir = null;
    if (danceEvent.active && Math.hypot(normalizedX, normalizedY) > 0.42) {
      if (Math.abs(normalizedX) > Math.abs(normalizedY)) {
        dir = normalizedX < 0 ? "left" : "right";
      } else {
        dir = normalizedY < 0 ? "up" : "down";
      }
    }

    if (dir && dir !== mobileJoystickState.danceDir) {
      submitDanceInput(dir);
    }
    mobileJoystickState.danceDir = dir;
    return;
  }

  keys.left = normalizedX < -0.32;
  keys.right = normalizedX > 0.32;
  keys.crouch = normalizedY > 0.45 && level.theme === "arcade" && gameState !== "lobby";
  const wantsJump = normalizedY < -0.48;
  if (wantsJump && !mobileJoystickState.jumped && !keys.jump) {
    if (attemptNightmareInput()) {
      keys.jump = false;
      mobileJoystickState.jumped = true;
      return;
    }
    keys.jumpQueued = true;
    if (gameState === "stageclear") {
      nextStage();
    }
  }
  keys.jump = wantsJump;
  mobileJoystickState.jumped = wantsJump;
}

function startMobileDrag(clientX, clientY, pointerId = null, touchId = null) {
  if (controlMode !== "mobile" || gameState === "lobby" || clawEscapeEvent.active || lootBoxState.active) {
    return false;
  }
  ensureAudioContext();
  mobileJoystickState.active = true;
  mobileJoystickState.pointerId = pointerId;
  mobileJoystickState.touchId = touchId;
  mobileJoystickState.originX = clientX;
  mobileJoystickState.originY = clientY;
  mobileJoystickState.jumped = false;
  mobileJoystickState.danceDir = null;
  updateMobileJoystick({ clientX, clientY });
  return true;
}

mobileJoystick?.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  mobileJoystick.setPointerCapture?.(event.pointerId);
  startMobileDrag(event.clientX, event.clientY, event.pointerId, null);
});

mobileJoystick?.addEventListener("pointermove", (event) => {
  if (!mobileJoystickState.active || event.pointerId !== mobileJoystickState.pointerId) {
    return;
  }
  event.preventDefault();
  updateMobileJoystick(event);
});

mobileJoystick?.addEventListener("pointerup", (event) => {
  event.preventDefault();
  resetMobileJoystick();
});

mobileJoystick?.addEventListener("pointercancel", (event) => {
  event.preventDefault();
  resetMobileJoystick();
});

mobileJoystick?.addEventListener("lostpointercapture", resetMobileJoystick);

function findActiveJoystickTouch(touches) {
  for (const touch of touches) {
    if (touch.identifier === mobileJoystickState.touchId) {
      return touch;
    }
  }
  return null;
}

mobileJoystick?.addEventListener("touchstart", (event) => {
  event.preventDefault();
  const touch = event.changedTouches[0];
  if (!touch) {
    return;
  }
  startMobileDrag(touch.clientX, touch.clientY, null, touch.identifier);
}, { passive: false });

mobileJoystick?.addEventListener("touchmove", (event) => {
  const touch = findActiveJoystickTouch(event.changedTouches);
  if (!mobileJoystickState.active || !touch) {
    return;
  }
  event.preventDefault();
  updateMobileJoystick(touch);
}, { passive: false });

mobileJoystick?.addEventListener("touchend", (event) => {
  const touch = findActiveJoystickTouch(event.changedTouches);
  if (!touch) {
    return;
  }
  event.preventDefault();
  resetMobileJoystick();
}, { passive: false });

mobileJoystick?.addEventListener("touchcancel", (event) => {
  const touch = findActiveJoystickTouch(event.changedTouches);
  if (!touch) {
    return;
  }
  event.preventDefault();
  resetMobileJoystick();
}, { passive: false });

canvas.addEventListener("pointerdown", (event) => {
  if (event.target?.closest?.("[data-mobile-action]") || controlMode !== "mobile" || gameState === "lobby") {
    return;
  }
  event.preventDefault();
  canvas.setPointerCapture?.(event.pointerId);
  startMobileDrag(event.clientX, event.clientY, event.pointerId, null);
});

canvas.addEventListener("pointermove", (event) => {
  if (!mobileJoystickState.active || event.pointerId !== mobileJoystickState.pointerId || controlMode !== "mobile") {
    return;
  }
  event.preventDefault();
  updateMobileJoystick(event);
});

canvas.addEventListener("pointerup", (event) => {
  if (event.pointerId !== mobileJoystickState.pointerId) {
    return;
  }
  event.preventDefault();
  resetMobileJoystick();
});

canvas.addEventListener("pointercancel", (event) => {
  if (event.pointerId !== mobileJoystickState.pointerId) {
    return;
  }
  event.preventDefault();
  resetMobileJoystick();
});

canvas.addEventListener("touchstart", (event) => {
  if (controlMode !== "mobile" || gameState === "lobby") {
    return;
  }
  const touch = event.changedTouches[0];
  if (!touch) {
    return;
  }
  event.preventDefault();
  startMobileDrag(touch.clientX, touch.clientY, null, touch.identifier);
}, { passive: false });

canvas.addEventListener("touchmove", (event) => {
  const touch = findActiveJoystickTouch(event.changedTouches);
  if (!mobileJoystickState.active || !touch || controlMode !== "mobile") {
    return;
  }
  event.preventDefault();
  updateMobileJoystick(touch);
}, { passive: false });

canvas.addEventListener("touchend", (event) => {
  const touch = findActiveJoystickTouch(event.changedTouches);
  if (!touch) {
    return;
  }
  event.preventDefault();
  resetMobileJoystick();
}, { passive: false });

canvas.addEventListener("touchcancel", (event) => {
  const touch = findActiveJoystickTouch(event.changedTouches);
  if (!touch) {
    return;
  }
  event.preventDefault();
  resetMobileJoystick();
}, { passive: false });

function applyMobileAction(action, pressed) {
  ensureAudioContext();
  if (!pressed) {
    return;
  }
  if (action === "skill-e") {
    if (tryBeginFrostWardenSkillClash()) {
      return;
    }
    if (isChangerEquipped()) {
      createChangerClone();
    } else if (isLightnerEquipped()) {
      activateLightnerField();
    } else if (isWildHunterEquipped()) {
      activateWildHunterSlam();
    } else {
      activateAssassinStealth();
    }
  } else if (action === "skill-q") {
    if (assassinationEvent.active) {
      tapAssassinationQte();
      return;
    }
    if (tryBeginFrostWardenSkillClash()) {
      return;
    }
    if (isGuardianEquipped()) {
      activateGuardianShield();
    } else if (isChangerEquipped()) {
      swapChangerWithClone();
    } else if (isLightnerEquipped()) {
      activateLightnerAnchor();
    } else if (isWildHunterEquipped()) {
      activateWildHunterBlast();
    } else {
      beginAssassination();
    }
  } else if (action === "skill-x") {
    if (isWildHunterEquipped()) {
      activateWildHunterAwaken();
    } else {
      activateLightnerAwaken();
    }
  } else if (action === "restart") {
    restartGame();
  }
}

document.querySelectorAll("[data-mobile-action]").forEach((button) => {
  const action = button.dataset.mobileAction;
  let handledTouch = false;
  let lastTriggerTime = 0;
  const trigger = () => {
    const now = performance.now();
    if (now - lastTriggerTime < 90) {
      return;
    }
    lastTriggerTime = now;
    applyMobileAction(action, true);
  };
  button.addEventListener("pointerdown", (event) => {
    if (handledTouch) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    button.setPointerCapture?.(event.pointerId);
    setMobileButtonActive(button, true);
    trigger();
  });
  const release = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setMobileButtonActive(button, false);
    applyMobileAction(action, false);
  };
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", () => {
    setMobileButtonActive(button, false);
    applyMobileAction(action, false);
  });
  button.addEventListener("touchstart", (event) => {
    handledTouch = true;
    event.preventDefault();
    event.stopPropagation();
    setMobileButtonActive(button, true);
    trigger();
  }, { passive: false });
  button.addEventListener("touchend", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setMobileButtonActive(button, false);
    applyMobileAction(action, false);
    window.setTimeout(() => {
      handledTouch = false;
    }, 0);
  }, { passive: false });
  button.addEventListener("touchcancel", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setMobileButtonActive(button, false);
    applyMobileAction(action, false);
    window.setTimeout(() => {
      handledTouch = false;
    }, 0);
  }, { passive: false });
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setMobileButtonActive(button, true);
    trigger();
    window.setTimeout(() => {
      setMobileButtonActive(button, false);
    }, 80);
  });
});
muteButton.addEventListener("click", () => {
  audioState.muted = !audioState.muted;
  updateMuteButtonLabel();
});

bgmToggleButton?.addEventListener("click", () => {
  bgmState.enabled = !bgmState.enabled;
  saveBgmSettings();
  applyBgmSettings();
});

bgmVolumeSlider?.addEventListener("input", () => {
  bgmState.volume = clampBgmVolume(bgmVolumeSlider.value);
  saveBgmSettings();
  applyBgmSettings();
});

multiplayerToggleButton?.addEventListener("click", () => {
  connectMultiplayer();
});

multiplayerRoomInput?.addEventListener("change", () => {
  multiplayerState.room = sanitizeRoomName(multiplayerRoomInput.value);
  multiplayerRoomInput.value = multiplayerState.room;
  localStorage.setItem(MULTIPLAYER_ROOM_KEY, multiplayerState.room);
  if (multiplayerState.socket) {
    disconnectMultiplayer();
    connectMultiplayer();
  }
});

languageSelect?.addEventListener("change", () => {
  applyLanguage(languageSelect.value);
});

difficultySelect.addEventListener("change", () => {
  activeDifficultyKey = difficultySelect.value;
  difficulty = DIFFICULTIES[activeDifficultyKey];
});

stageSelect.addEventListener("change", () => {
  selectedStageIndex = Number(stageSelect.value);
});

screenModeSelect.addEventListener("change", () => {
  screenMode = screenModeSelect.value;
  applyScreenMode();
});

controlModeSelect.addEventListener("change", () => {
  controlMode = controlModeSelect.value;
  applyControlMode();
});

playButton.addEventListener("click", () => {
  if (!accountState.currentNickname) {
    setAuthMessageKey("auth_signin_before_play", {}, true);
    showAuthPanel(true);
    return;
  }
  closeLobby();
  restartGame();
});

openShopButton.addEventListener("click", () => {
  if (!accountState.currentNickname) {
    setAuthMessageKey("auth_signin_shop", {}, true);
    showAuthPanel(true);
    return;
  }
  shopPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
});

shopTabCharacters.addEventListener("click", () => {
  shopUiState.activeTab = "character";
  renderShopCatalog();
});

shopTabBoxes?.addEventListener("click", () => {
  shopUiState.activeTab = "box";
  renderShopCatalog();
});

closeLootboxButton?.addEventListener("click", () => {
  if (lootBoxState.revealReady) {
    closeLootBoxPanel();
  } else {
    skipLootBoxAnimation();
  }
});

lootboxPanel?.addEventListener("pointerdown", () => {
  if (!lootBoxState.active) {
    return;
  }
  if (lootBoxState.revealReady) {
    closeLootBoxPanel();
  } else {
    skipLootBoxAnimation();
  }
});

lobbyButton.addEventListener("click", () => {
  openLobby();
});

initializeAuthControls();

function overlaps(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function pointInRect(px, py, rect) {
  return px >= rect.x && px <= rect.x + rect.w && py >= rect.y && py <= rect.y + rect.h;
}

function hasSolidAt(px, py) {
  for (const solid of level.solids) {
    if (pointInRect(px, py, solid)) {
      return true;
    }
  }
  return false;
}

function hasHazardAt(px, py) {
  for (const hazard of level.hazards) {
    if (pointInRect(px, py, hazard)) {
      return true;
    }
  }
  return false;
}

function moveTowards(current, target, maxStep) {
  if (current < target) {
    return Math.min(target, current + maxStep);
  }
  return Math.max(target, current - maxStep);
}

function getExcavatorClawHitbox(enemy) {
  const clawW = 18;
  const clawH = 18;
  const armAnchorX = enemy.facing > 0 ? enemy.x + enemy.w - 8 : enemy.x + 8;
  const verticalReach = enemy.reachY - enemy.armBaseY;
  const horizontalReach = Math.sqrt(Math.max(0, enemy.armLength ** 2 - verticalReach ** 2));
  const clawX = armAnchorX + enemy.facing * horizontalReach - clawW * 0.5;
  const clawY = enemy.reachY - clawH * 0.5;
  return {
    x: clawX,
    y: clawY,
    w: clawW,
    h: clawH,
  };
}

function canPlayerStandUp() {
  const bottomY = player.y + player.h;
  const targetY = bottomY - player.standH;
  const standRect = { x: player.x, y: targetY, w: player.w, h: player.standH };
  for (const solid of level.solids) {
    if (overlaps(standRect, solid)) {
      return false;
    }
  }
  return true;
}

function currentExcavatorStunDuration() {
  if (difficulty.label === "Easy") {
    return 5;
  }
  if (difficulty.label === "Hard") {
    return 17.5;
  }
  return 10;
}

function stunPlayerByExcavator(enemy) {
  if (player.invulnerableTime > 0 || gameState !== "playing") {
    return;
  }

  breakAssassinStealth();
  resetAssassinationEvent();
  const stunDuration = currentExcavatorStunDuration();
  player.stunTimer = stunDuration;
  player.invulnerableTime = Math.max(player.invulnerableTime, stunDuration + 0.2);
  player.vx = 0;
  player.vy = Math.min(player.vy, 0);
  enemy.alive = false;
  enemy.squishTimer = 0;
}

function applyPlayerCrouch(desiredCrouch) {
  if (level.theme !== "arcade") {
    desiredCrouch = false;
  }

  if (desiredCrouch) {
    if (!player.crouching) {
      const bottomY = player.y + player.h;
      player.h = player.crouchH;
      player.y = bottomY - player.h;
      player.crouching = true;
    }
    return;
  }

  if (player.crouching && canPlayerStandUp()) {
    const bottomY = player.y + player.h;
    player.h = player.standH;
    player.y = bottomY - player.h;
    player.crouching = false;
  }
}

function frozenPressureLevel() {
  if (level.theme !== "frozen") {
    return 1;
  }
  if (frozenTimeRemaining <= 10) {
    return 3;
  }
  if (frozenTimeRemaining <= 30) {
    return 2;
  }
  return 1;
}

function frozenSpeedMultiplier() {
  if (level.theme !== "frozen") {
    return 1;
  }
  let multiplier = frozenPressureLevel() >= 2 ? 0.88 : 1;
  if (player.frostSlowTimer > 0) {
    multiplier *= 0.72;
  }
  return multiplier;
}

function frozenJumpMultiplier() {
  return level.theme === "frozen" && frozenPressureLevel() >= 3 ? 0.82 : 1;
}

function isPlayerOnIce() {
  if (level.theme !== "frozen" || !player.onGround) {
    return false;
  }
  const footY = player.y + player.h + 2;
  const leftX = player.x + 4;
  const rightX = player.x + player.w - 4;
  return level.solids.some((solid) => solid.ice && footY >= solid.y && footY <= solid.y + 8 && rightX > solid.x && leftX < solid.x + solid.w);
}

function updatePlayer(dt) {
  if (gameState !== "playing" || nightmareEvent.active) {
    player.animationTime += dt;
    return;
  }

  if (danceEvent.active || danceEvent.countdown) {
    player.animationTime += dt;
    player.vx = 0;
    player.vy = 0;
    return;
  }

  if (clawEscapeEvent.active) {
    player.animationTime += dt;
    player.vx = 0;
    player.vy = 0;
    return;
  }

  if (assassinationEvent.active) {
    player.animationTime += dt;
    player.vx = 0;
    player.vy = 0;
    return;
  }

  if (isWildHunterEquipped() && wildHunterState.blastDelayTimer > 0) {
    player.animationTime += dt;
    player.vx = 0;
    player.vy = 0;
    return;
  }

  player.animationTime += dt;
  player.invulnerableTime = Math.max(0, player.invulnerableTime - dt);
  player.stunTimer = Math.max(0, player.stunTimer - dt);
  player.stealthCooldown = Math.max(0, player.stealthCooldown - dt);
  player.assassinationCooldown = Math.max(0, player.assassinationCooldown - dt);
  player.guardianShieldTimer = Math.max(0, player.guardianShieldTimer - dt);
  player.guardianShieldCooldown = Math.max(0, player.guardianShieldCooldown - dt);
  player.guardianFlash = Math.max(0, player.guardianFlash - dt);
  player.frostSlowTimer = Math.max(0, player.frostSlowTimer - dt);
  player.iceSlideTimer = Math.max(0, player.iceSlideTimer - dt);
  if (player.stealthActive) {
    player.stealthTimer = Math.max(0, player.stealthTimer - dt);
    if (player.stealthTimer <= 0) {
      breakAssassinStealth();
    }
  }

  if (player.stunTimer > 0) {
    player.vx = 0;
    player.vy += GRAVITY * dt * stageDifficultyFactor(currentStageIndex);
    player.x += player.vx * dt;
    resolveSolidCollisions("x");
    player.y += player.vy * dt;
    player.onGround = false;
    resolveSolidCollisions("y");
    if (player.onGround) {
      player.jumpsRemaining = player.maxJumps;
    }
    if (player.y > GAME_HEIGHT + 300) {
      loseLife();
    }
    player.state = "stun";
    keys.jumpQueued = false;
    return;
  }

  applyPlayerCrouch(keys.crouch);

  const inputX = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  let moveSpeed = (player.stealthActive ? player.speed * ASSASSIN_RULES.stealthSpeedMultiplier : player.speed) * frozenSpeedMultiplier();
  if (isLightnerEquipped() && lightnerState.awakenTimer > 0) {
    moveSpeed *= LIGHTNER_RULES.awakenSpeedMultiplier;
  }
  if (isWildHunterEquipped()) {
    if (wildHunterState.instinctTimer > 0) {
      moveSpeed *= WILD_HUNTER_RULES.instinctSpeedMultiplier;
    }
    if (wildHunterState.awakenTimer > 0) {
      moveSpeed *= WILD_HUNTER_RULES.awakenSpeedMultiplier;
    }
  }
  if (level.theme === "frozen") {
    const targetVx = inputX * moveSpeed;
    const slippery = isPlayerOnIce() || player.iceSlideTimer > 0;
    const accel = slippery ? 900 : 3200;
    const decel = slippery ? (player.frostSlowTimer > 0 ? 170 : 260) : 3600;
    player.vx = moveTowards(player.vx, targetVx, (inputX === 0 ? decel : accel) * dt);
  } else {
    player.vx = inputX * moveSpeed;
  }
  if (inputX !== 0) {
    player.facing = inputX;
  }

  if (keys.jumpQueued && player.jumpsRemaining > 0) {
    const usedAirJump = !player.onGround && player.jumpsRemaining === 1;
    player.vy = (usedAirJump ? player.airJumpVelocity : player.jumpVelocity) * frozenJumpMultiplier() * getWildHunterJumpMultiplier();
    player.onGround = false;
    player.jumpsRemaining -= 1;
    playSound(usedAirJump ? "doubleJump" : "jump");
  }

  player.vy += GRAVITY * dt * stageDifficultyFactor(currentStageIndex);

  // Horizontal and vertical resolution stay separate to keep platform collisions stable.
  player.x += player.vx * dt;
  resolveSolidCollisions("x");

  player.y += player.vy * dt;
  player.onGround = false;
  resolveSolidCollisions("y");

  if (player.onGround) {
    player.jumpsRemaining = player.maxJumps;
  }

  if (player.y > GAME_HEIGHT + 300) {
    loseLife();
  }

  for (const hazard of level.hazards) {
    if (overlaps(player, hazard)) {
      loseLife();
      break;
    }
  }

  if (level.theme !== "jungle") {
    for (const collectible of level.collectibles) {
      if (!collectible.collected && overlaps(player, collectible)) {
        collectible.collected = true;
        score += Math.round(100 * difficulty.collectibleBonus);
        if (level.theme !== "frozen") {
          awardCoins(level.theme === "factory" ? 8 : 6);
        }
        collectedCount += 1;
        playSound(level.theme === "factory" ? "button" : "coin");
      }
    }
  }

  if (!player.stealthActive) {
    for (const enemy of level.enemies) {
      if (!enemy.alive || enemy.defeated || isEnemyStunnedByLightner(enemy) || !overlaps(player, enemy)) {
        continue;
      }

      if (isWildHunterEquipped() && wildHunterState.awakenTimer > 0) {
        if (isBossEntity(enemy, enemy.type)) {
          damageBossByWildHunter(enemy, WILD_HUNTER_RULES.awakenBossDps * dt);
        } else {
          defeatNormalEnemyByWildHunter(enemy, "skill");
        }
        continue;
      }

      if (enemy.type === "excavator") {
        loseLife();
        break;
      }

      if (enemy.type === "frostWarden") {
        if (beginFrostWardenClash(enemy)) {
          break;
        }
        loseLife();
        break;
      }

      const playerBottom = player.y + player.h;
      const enemyTop = enemy.y + 6;
      const fallingFastEnough = player.vy > 120;

      if (fallingFastEnough && playerBottom - player.vy * dt <= enemyTop) {
        if (isAssassinEquipped()) {
          breakAssassinStealth();
          player.vy = ASSASSIN_RULES.jumpGlanceBounce;
          player.vx = -player.facing * 90;
          player.invulnerableTime = Math.max(player.invulnerableTime, 0.2);
          playSound("jump");
        } else {
          enemy.alive = false;
          enemy.squishTimer = 0.35;
          registerCombatKill("stomp");
          player.vy = player.stompBounce;
          player.jumpsRemaining = Math.max(player.jumpsRemaining, 1);
          score += 250 + currentStageIndex * 50;
          if (level.theme !== "frozen") {
            awardCoins(7 + currentStageIndex);
          }
          playSound("stomp");
        }
      } else {
        loseLife();
        break;
      }
    }

    for (const serpent of level.serpentEnemies) {
      if (!serpent.alive || serpent.defeated) {
        continue;
      }

      const serpentHitbox = getSerpentHitbox(serpent);

      if (!overlaps(player, serpentHitbox)) {
        continue;
      }

      if (isWildHunterEquipped() && wildHunterState.awakenTimer > 0) {
        defeatSerpentByWildHunter(serpent, "skill");
        continue;
      }

      const fallingFastEnough = player.vy > 140;
      const playerBottom = player.y + player.h;
      const serpentTop = serpentHitbox.y + 10;

      if (fallingFastEnough && playerBottom - player.vy * dt <= serpentTop) {
        if (serpent.type === "seaMonster") {
          loseLife();
          break;
        } else if (isAssassinEquipped()) {
          breakAssassinStealth();
          player.vy = ASSASSIN_RULES.jumpGlanceBounce;
          player.vx = -player.facing * 110;
          player.invulnerableTime = Math.max(player.invulnerableTime, 0.22);
          serpent.stunTimer = Math.max(serpent.stunTimer, 0.35);
          playSound("jump");
        } else {
          serpent.alive = false;
          serpent.stunTimer = 1.2;
          serpent.state = "stunned";
          registerCombatKill("stomp");
          serpent.strikeProgress = 0;
          player.vy = player.stompBounce;
          player.jumpsRemaining = Math.max(player.jumpsRemaining, 1);
          score += 400 + currentStageIndex * 75;
          if (level.theme !== "frozen") {
            awardCoins(10 + currentStageIndex);
          }
          playSound("stomp");
        }
      } else {
        loseLife();
        break;
      }
    }
  }

  const canUseGoal = level.theme === "frozen" || level.theme === "jungle" ? false : collectedCount >= currentShardTarget();
  if (gameState === "playing" && overlaps(player, level.goal) && canUseGoal) {
    awardStageClearCoins();
    rollStageClearBoxReward();
    if (level.theme === "arcade") {
      triggerClawEscapeEvent();
    } else {
      playSound("clear");
      gameState = currentStageIndex < STAGE_DEFS.length - 1 ? "stageclear" : "finished";
    }
  }

  if (player.crouching && level.theme === "arcade") {
    player.state = "crouch";
  } else if (!player.onGround) {
    player.state = "jump";
  } else if (Math.abs(player.vx) > 0) {
    player.state = "run";
  } else {
    player.state = "idle";
  }

  keys.jumpQueued = false;
}

function resolveSolidCollisions(axis) {
  for (const solid of level.solids) {
    if (!overlaps(player, solid)) {
      continue;
    }

    if (axis === "x") {
      if (player.vx > 0) {
        player.x = solid.x - player.w;
      } else if (player.vx < 0) {
        player.x = solid.x + solid.w;
      }
      player.vx = 0;
    } else {
      if (player.vy > 0) {
        player.y = solid.y - player.h;
        player.vy = 0;
        player.onGround = true;
      } else if (player.vy < 0) {
        player.y = solid.y + solid.h;
        player.vy = 0;
      }
    }
  }
}

function updateEnemies(dt) {
  for (const enemy of level.enemies) {
    enemy.animationTime += dt;
    const wasLightnerStunned = (enemy.lightnerStunTimer || 0) > 0;
    enemy.lightnerStunTimer = Math.max(0, (enemy.lightnerStunTimer || 0) - dt);
    enemy.lightnerSlowTimer = Math.max(0, (enemy.lightnerSlowTimer || 0) - dt);
    if (!enemy.alive || enemy.defeated) {
      enemy.squishTimer = Math.max(0, enemy.squishTimer - dt);
      if (enemy.type === "frostWarden") {
        enemy.qteMeltTimer = Math.max(0, (enemy.qteMeltTimer || 0) - dt);
      }
      continue;
    }

    if (wasLightnerStunned && enemy.lightnerStunTimer <= 0) {
      recoverEnemyFromLightnerStun(enemy);
    }

    if (enemy.lightnerStunTimer > 0) {
      enemy.vx = 0;
      if (enemy.type !== "frostWarden") {
        enemy.vy += GRAVITY * dt;
        enemy.y += enemy.vy * dt;
        for (const solid of level.solids) {
          if (!overlaps(enemy, solid)) {
            continue;
          }
          if (enemy.vy > 0) {
            enemy.y = solid.y - enemy.h;
            enemy.vy = 0;
          } else if (enemy.vy < 0) {
            enemy.y = solid.y + solid.h;
            enemy.vy = 0;
          }
        }
      }
      continue;
    }

    if (enemy.type === "excavator") {
      updateExcavatorEnemy(enemy, dt);
      continue;
    }

    if (enemy.type === "frostWarden") {
      updateFrostWardenEnemy(enemy, dt);
      continue;
    }

    enemy.vy += GRAVITY * dt;
    enemy.x += enemy.vx * dt;

    if (enemy.x <= enemy.leftBound) {
      enemy.x = enemy.leftBound;
      enemy.vx *= -1;
    } else if (enemy.x >= enemy.rightBound) {
      enemy.x = enemy.rightBound;
      enemy.vx *= -1;
    }

    enemy.y += enemy.vy * dt;

    let onFloor = false;
    for (const solid of level.solids) {
      if (!overlaps(enemy, solid)) {
        continue;
      }
      if (enemy.vy > 0) {
        enemy.y = solid.y - enemy.h;
        enemy.vy = 0;
        onFloor = true;
      } else if (enemy.vy < 0) {
        enemy.y = solid.y + solid.h;
        enemy.vy = 0;
      }
    }

    if (onFloor) {
      const direction = Math.sign(enemy.vx) || 1;
      const probeX = direction > 0 ? enemy.x + enemy.w + 2 : enemy.x - 2;
      const probeY = enemy.y + enemy.h + 2;
      const steppingIntoHazard = hasHazardAt(probeX, enemy.y + enemy.h - 2) || hasHazardAt(probeX, probeY);
      const noGroundAhead = !hasSolidAt(probeX, probeY);
      if (steppingIntoHazard || noGroundAhead) {
        enemy.vx *= -1;
        enemy.x += Math.sign(enemy.vx) * 2;
      }
    }

    if (!onFloor && enemy.y > GAME_HEIGHT + 300) {
      enemy.alive = false;
      enemy.squishTimer = 0;
    }
  }

  updateFrostProjectiles(dt);

  for (const serpent of level.serpentEnemies) {
    serpent.animationTime += dt;

    if (serpent.defeated) {
      continue;
    }
    if (!serpent.alive) {
      serpent.stunTimer -= dt;
      if (serpent.stunTimer <= 0) {
        serpent.alive = true;
        serpent.cooldown = 1.4 + Math.random() * 1.2;
        serpent.state = "idle";
      }
      serpent.rise = Math.max(0, serpent.rise - 220 * dt);
      serpent.strikeProgress = Math.max(0, serpent.strikeProgress - 2.8 * dt);
      continue;
    }

    const playerInZone = !player.stealthActive && Math.abs(player.x + player.w * 0.5 - serpent.homeX) < serpent.aggroWidth;
    const playerNearSurface = player.y + player.h > serpent.waterTop - 44;

    if (serpent.state === "idle") {
      serpent.cooldown -= dt;
      serpent.rise = Math.max(0, serpent.rise - serpent.retreatSpeed * dt);
      serpent.strikeProgress = Math.max(0, serpent.strikeProgress - 3.2 * dt);
      if (serpent.cooldown <= 0 && playerInZone && playerNearSurface) {
        serpent.state = "telegraph";
        serpent.cooldown = 0.18;
        serpent.strikeX = player.x + player.w * 0.5 + Math.sign(player.vx || 1) * 16;
        serpent.strikeY = Math.min(player.y + 8, serpent.waterTop - 18);
      }
      continue;
    }

    if (serpent.state === "telegraph") {
      serpent.rise = Math.min(serpent.maxRise * 0.42, serpent.rise + serpent.speed * 70 * dt);
      serpent.cooldown -= dt;
      if (serpent.cooldown <= 0) {
        serpent.state = "strike";
      }
      continue;
    }

    if (serpent.state === "strike") {
      serpent.rise = Math.min(serpent.maxRise, serpent.rise + serpent.speed * 180 * dt);
      serpent.strikeProgress = Math.min(1, serpent.strikeProgress + serpent.speed * 1.8 * dt);
      if (serpent.strikeProgress >= 1) {
        serpent.state = "recover";
        serpent.cooldown = 0.35;
      }
      continue;
    }

    if (serpent.state === "recover") {
      serpent.cooldown -= dt;
      serpent.strikeProgress = Math.max(0, serpent.strikeProgress - serpent.speed * 1.35 * dt);
      serpent.rise = Math.max(0, serpent.rise - serpent.retreatSpeed * dt);
      if (serpent.cooldown <= 0 && serpent.rise <= 8 && serpent.strikeProgress <= 0.02) {
        serpent.state = "idle";
        serpent.cooldown = 0.7 + Math.random() * 1.2;
      }
    }
  }
}

function updateExcavatorEnemy(enemy, dt) {
  const neutralVertical = enemy.reachY - enemy.armBaseY;
  const neutralArmLength = Math.max(enemy.minRange * 0.35, Math.hypot(enemy.minRange * 0.35, neutralVertical));
  if (player.stealthActive) {
    enemy.targetArmLength = neutralArmLength;
    enemy.armLength = moveTowards(enemy.armLength, enemy.targetArmLength, enemy.armSpeed * dt);
    enemy.reachY = moveTowards(enemy.reachY, enemy.armBaseY - 24, 110 * dt);
    enemy.state = "idle";
    enemy.cooldown = Math.max(enemy.cooldown, 0.5);
    return;
  }
  const playerCenterX = player.x + player.w * 0.5;
  const playerCenterY = player.y + player.h * 0.5;
  const armAnchorX = enemy.facing > 0 ? enemy.x + enemy.w - 8 : enemy.x + 8;
  const deltaX = (playerCenterX - armAnchorX) * enemy.facing;
  const targetReachY = playerCenterY;
  enemy.reachY = moveTowards(enemy.reachY, targetReachY, 110 * dt);

  const playerInBand = deltaX >= enemy.minRange && deltaX <= enemy.maxRange;
  const strikeLength = Math.max(
    enemy.minRange * 0.7,
    Math.hypot(Math.max(enemy.minRange, deltaX), targetReachY - enemy.armBaseY)
  );

  enemy.armLength = moveTowards(enemy.armLength, enemy.targetArmLength, enemy.armSpeed * dt);

  if (enemy.state === "idle") {
    enemy.cooldown -= dt;
    enemy.targetArmLength = neutralArmLength;
    if (enemy.cooldown <= 0 && playerInBand) {
      enemy.state = "telegraph";
      enemy.telegraphTimer = 0.42;
      enemy.targetArmLength = Math.max(neutralArmLength + 16, strikeLength * 0.72);
    }
    return;
  }

  if (enemy.state === "telegraph") {
    enemy.telegraphTimer -= dt;
    enemy.targetArmLength = Math.max(neutralArmLength + 20, strikeLength * 0.8);
    if (enemy.telegraphTimer <= 0) {
      enemy.state = "strike";
      enemy.targetArmLength = strikeLength;
    }
  } else if (enemy.state === "strike") {
    enemy.targetArmLength = strikeLength;
    if (Math.abs(enemy.armLength - enemy.targetArmLength) < 8) {
      enemy.state = "recover";
      enemy.cooldown = 0.95 + Math.random() * 0.45;
    }
  } else if (enemy.state === "recover") {
    enemy.targetArmLength = neutralArmLength;
    if (Math.abs(enemy.armLength - neutralArmLength) < 6) {
      enemy.state = "idle";
    }
  }

  if (enemy.state === "strike") {
    const clawHitbox = getExcavatorClawHitbox(enemy);
    if (overlaps(player, clawHitbox)) {
      stunPlayerByExcavator(enemy);
    }
  }
}

function updateFrostWardenEnemy(enemy, dt) {
  const playerCenterX = player.x + player.w * 0.5;
  const enemyCenterX = enemy.x + enemy.w * 0.5;
  const dx = playerCenterX - enemyCenterX;
  const distance = Math.abs(dx);
  enemy.facing = dx < 0 ? -1 : 1;
  enemy.auraPulse = Math.max(0, 1 - distance / 360);
  enemy.vy += GRAVITY * dt;

  if (player.stealthActive) {
    enemy.vx = 0;
    enemy.state = "idle";
    enemy.cooldown = Math.max(enemy.cooldown, 0.8);
  } else if (enemy.state === "idle") {
    enemy.cooldown -= dt;
    const speedMultiplier = enemy.lightnerSlowTimer > 0 ? LIGHTNER_RULES.bossSlowMultiplier : 1;
    enemy.vx = distance < 520 ? Math.sign(dx) * enemy.speed * speedMultiplier : 0;
    if (enemy.cooldown <= 0 && distance < 360) {
      enemy.state = "telegraph";
      enemy.attackType = distance < 88 ? "melee" : "wave";
      enemy.telegraphTimer = enemy.attackType === "melee" ? 0.42 : 0.55;
      enemy.vx = 0;
    }
  } else if (enemy.state === "telegraph") {
    enemy.vx = 0;
    enemy.telegraphTimer -= dt;
    enemy.auraPulse = 1.35;
    if (enemy.telegraphTimer <= 0) {
      if (enemy.attackType === "melee") {
        const hitbox = {
          x: enemy.facing > 0 ? enemy.x + enemy.w - 4 : enemy.x - 44,
          y: enemy.y + 18,
          w: 48,
          h: 54,
        };
        if (overlaps(player, hitbox)) {
          lives = 0;
          gameState = "gameover";
          player.vx = 0;
          player.vy = 0;
        }
      } else {
        spawnFrostWave(enemy);
      }
      enemy.state = "recover";
      enemy.cooldown = 0.7;
    }
  } else if (enemy.state === "recover") {
    enemy.vx = 0;
    enemy.cooldown -= dt;
    if (enemy.cooldown <= 0) {
      enemy.state = "idle";
      enemy.cooldown = 1.1 + Math.random() * 0.5;
    }
  }

  enemy.x += enemy.vx * dt;
  enemy.y += enemy.vy * dt;

  resolveFrostWardenFrozenSpikes(enemy, dt);

  for (const solid of level.solids) {
    if (!overlaps(enemy, solid)) {
      continue;
    }
    if (enemy.vy > 0) {
      enemy.y = solid.y - enemy.h;
      enemy.vy = 0;
    } else if (enemy.vy < 0) {
      enemy.y = solid.y + solid.h;
      enemy.vy = 0;
    }
  }
}

function resolveFrostWardenFrozenSpikes(enemy, dt) {
  if (level.theme !== "frozen" || enemy.vy < 0) {
    return;
  }

  const previousBottom = enemy.y + enemy.h - enemy.vy * dt;
  const currentBottom = enemy.y + enemy.h;
  for (const hazard of level.hazards) {
    const horizontalOverlap = enemy.x + enemy.w > hazard.x + 6 && enemy.x < hazard.x + hazard.w - 6;
    const crossingTop = previousBottom <= hazard.y + 8 && currentBottom >= hazard.y;
    if (!horizontalOverlap || !crossingTop) {
      continue;
    }

    hazard.frozenByWarden = true;
    enemy.y = hazard.y - enemy.h;
    enemy.vy = 0;
    return;
  }
}

function spawnFrostWave(enemy) {
  const waveW = 42;
  level.frostProjectiles.push({
    x: enemy.facing > 0 ? enemy.x + enemy.w - 4 : enemy.x - waveW + 4,
    y: enemy.y + 34,
    w: waveW,
    h: 22,
    vx: enemy.facing * 260,
    life: 2.4,
    phase: Math.random() * Math.PI * 2,
  });
  playSound("ice");
}

function updateFrostProjectiles(dt) {
  for (const projectile of level.frostProjectiles) {
    projectile.x += projectile.vx * dt;
    projectile.life -= dt;
    projectile.phase += dt * 10;
    if (overlaps(player, projectile)) {
      player.frostSlowTimer = Math.max(player.frostSlowTimer, 3.2);
      player.iceSlideTimer = Math.max(player.iceSlideTimer, 3.2);
      projectile.life = 0;
      playSound("ice");
    }
  }
  for (let i = level.frostProjectiles.length - 1; i >= 0; i -= 1) {
    if (level.frostProjectiles[i].life <= 0) {
      level.frostProjectiles.splice(i, 1);
    }
  }
}

function updateCamera() {
  const target = player.x - GAME_WIDTH * 0.35;
  camera.x += (target - camera.x) * 0.1;
  camera.x = Math.max(0, Math.min(camera.x, Math.max(0, worldWidth - GAME_WIDTH)));
}

function loseLife() {
  if (player.invulnerableTime > 0 || player.guardianShieldTimer > 0 || gameState !== "playing") {
    return;
  }
  if (isWildHunterEquipped() && wildHunterState.awakenTimer > 0) {
    return;
  }

  if (consumeGuardianPassive()) {
    return;
  }

  if (transferToChangerClone()) {
    return;
  }

  breakAssassinStealth();
  resetAssassinationEvent();
  dropJungleBananas();
  lives -= difficulty.lifeLoss;
  if (lives <= 0) {
    lives = 0;
    gameState = "gameover";
    player.vx = 0;
    player.vy = 0;
    return;
  }

  resetPlayerPosition();
}

function update(dt) {
  updateLootBoxAnimation(dt);
  updatePeacefulMusicState();
  updateMultiplayer(dt);
  updatePlayer(dt);
  changerState.swapCooldown = Math.max(0, changerState.swapCooldown - dt);
  changerState.effectTimer = Math.max(0, changerState.effectTimer - dt);
  updateLightnerState(dt);
  updateWildHunterState(dt);
  updateOvergearElectricState(dt);
  player.cloneTransferFlash = Math.max(0, player.cloneTransferFlash - dt);
  screenShakeTimer = Math.max(0, screenShakeTimer - dt);
  if (gameState === "playing") {
    if (assassinationEvent.active) {
      updateAssassinationEvent(dt);
      if (assassinationEvent.active && assassinationEvent.mode === "wardenQte") {
        updateCamera();
        savePersistentProgress();
        return;
      }
    }
    if (level.theme === "factory") {
      factoryTimeRemaining = Math.max(0, factoryTimeRemaining - dt);
      if (factoryTimeRemaining <= 0) {
        if (consumeGuardianPassive()) {
          factoryTimeRemaining = 3;
          updateCamera();
          return;
        }
        lives = 0;
        gameState = "gameover";
        player.vx = 0;
        player.vy = 0;
        updateCamera();
        return;
      }
    }

    if (level.theme === "frozen") {
      frozenTimeRemaining = Math.max(0, frozenTimeRemaining - dt);
      if (frozenTimeRemaining <= 0) {
        lives = 0;
        gameState = "gameover";
        player.vx = 0;
        player.vy = 0;
        updateCamera();
        return;
      }
    }

    if (level.theme === "jungle") {
      updateJungleStage(dt);
      if (gameState !== "playing") {
        updateCamera();
        return;
      }
    }

    if (!assassinationEvent.active && !clawEscapeEvent.active && !danceEvent.active && !danceEvent.countdown && !nightmareEvent.active && !nightmareEvent.countdown) {
      updateEnemies(dt);
    }
    if (!clawEscapeEvent.active && !assassinationEvent.active) {
      updateNightmareEvent(dt);
    }
    if (clawEscapeEvent.active) {
      updateClawEscapeEvent(dt);
    }
  }
  if (stageMessageTimer > 0) {
    stageMessageTimer = Math.max(0, stageMessageTimer - dt);
  }
  updateCamera();
  savePersistentProgress();
}

function updateLightnerState(dt) {
  if (assassinationEvent.active) {
    return;
  }
  for (const effect of lightnerState.effects) {
    effect.timer = Math.max(0, effect.timer - dt);
  }
  for (let i = lightnerState.effects.length - 1; i >= 0; i -= 1) {
    if (lightnerState.effects[i].timer <= 0) {
      lightnerState.effects.splice(i, 1);
    }
  }
  if (!isLightnerEquipped()) {
    return;
  }
  lightnerState.fieldCooldown = Math.max(0, lightnerState.fieldCooldown - dt);
  lightnerState.awakenTimer = Math.max(0, lightnerState.awakenTimer - dt);
  if (lightnerState.anchor) {
    lightnerState.anchor.timer -= dt;
    if (lightnerState.anchor.timer <= 0) {
      lightnerState.anchor = null;
    }
  }
  if (lightnerState.stacks < LIGHTNER_RULES.maxStacks) {
    lightnerState.stackRechargeTimer -= dt;
    if (lightnerState.stackRechargeTimer <= 0) {
      lightnerState.stacks += 1;
      lightnerState.stackRechargeTimer = lightnerState.stacks < LIGHTNER_RULES.maxStacks ? currentLightnerStackCooldown() : 0;
    }
  } else {
    lightnerState.stackRechargeTimer = 0;
  }
}

function updateWildHunterState(dt) {
  for (const effect of wildHunterState.effects) {
    effect.timer = Math.max(0, effect.timer - dt);
  }
  for (let i = wildHunterState.effects.length - 1; i >= 0; i -= 1) {
    if (wildHunterState.effects[i].timer <= 0) {
      wildHunterState.effects.splice(i, 1);
    }
  }

  if (!isWildHunterEquipped() || assassinationEvent.active) {
    return;
  }

  wildHunterState.instinctTimer = Math.max(0, wildHunterState.instinctTimer - dt);
  wildHunterState.blastDelayTimer = Math.max(0, wildHunterState.blastDelayTimer - dt);
  wildHunterState.slamCooldown = Math.max(0, wildHunterState.slamCooldown - dt);
  wildHunterState.awakenTimer = Math.max(0, wildHunterState.awakenTimer - dt);

  if (wildHunterState.slamActive) {
    let hit = false;
    for (const enemy of level.enemies) {
      if (!enemy.alive || enemy.defeated || !overlaps(player, enemy)) {
        continue;
      }
      if (isBossEntity(enemy, enemy.type)) {
        hit = damageBossByWildHunter(enemy, 90) || true;
      } else {
        hit = defeatNormalEnemyByWildHunter(enemy, "slam") || hit;
      }
      enemy.vx = player.facing * 260;
      enemy.vy = -280;
    }
    for (const serpent of level.serpentEnemies) {
      if (serpent.defeated || !serpent.alive || !overlaps(player, getSerpentHitbox(serpent))) {
        continue;
      }
      hit = defeatSerpentByWildHunter(serpent, "slam") || hit;
    }
    if (hit) {
      wildHunterState.slamHit = true;
      wildHunterState.slamActive = false;
      player.vy = WILD_HUNTER_RULES.slamHitBounce;
      player.jumpsRemaining = Math.max(player.jumpsRemaining, 1);
      addWildHunterEffect("slamHit", player.x + player.w * 0.5, player.y + player.h, 0.36, { radius: 76 });
      screenShakeTimer = Math.max(screenShakeTimer, 0.28);
      playSound("stomp");
    } else if (player.onGround) {
      wildHunterState.slamActive = false;
      player.stunTimer = Math.max(player.stunTimer, WILD_HUNTER_RULES.slamMissDelay);
      addWildHunterEffect("slamMiss", player.x + player.w * 0.5, player.y + player.h, 0.3, { radius: 52 });
      screenShakeTimer = Math.max(screenShakeTimer, 0.18);
      playSound("button");
    }
  }

  if (wildHunterState.awakenTimer > 0) {
    const contactDamage = WILD_HUNTER_RULES.awakenBossDps * dt;
    for (const enemy of level.enemies) {
      if (!enemy.alive || enemy.defeated || !overlaps(player, enemy)) {
        continue;
      }
      if (isBossEntity(enemy, enemy.type)) {
        damageBossByWildHunter(enemy, contactDamage);
      } else {
        defeatNormalEnemyByWildHunter(enemy, "skill");
      }
    }
    for (const serpent of level.serpentEnemies) {
      if (serpent.defeated || !serpent.alive || !overlaps(player, getSerpentHitbox(serpent))) {
        continue;
      }
      defeatSerpentByWildHunter(serpent, "skill");
    }
  }
}

function updateClawEscapeEvent(dt) {
  clawEscapeEvent.flash = Math.max(0, clawEscapeEvent.flash - dt * 1.6);
  clawEscapeEvent.meter = Math.max(0, clawEscapeEvent.meter - dt * 0.08);
}

function updateNightmareEvent(dt) {
  if (activeDifficultyKey !== "hard") {
    return;
  }

  if (nightmareEvent.countdown) {
    nightmareEvent.countdownTimer -= dt;
    nightmareEvent.flash = Math.max(0, nightmareEvent.flash - dt * 0.7);
    if (nightmareEvent.countdownTimer <= 0) {
      nightmareEvent.countdown = false;
      nightmareEvent.active = true;
      nightmareEvent.timer = 10;
      nightmareEvent.flash = 1;
    }
    return;
  }

  if (!nightmareEvent.active) {
    nightmareEvent.triggerTimer -= dt;
    if (nightmareEvent.triggerTimer <= 0) {
      triggerNightmareEvent();
    }
    return;
  }

  nightmareEvent.timer -= dt;
  nightmareEvent.flash = Math.max(0, nightmareEvent.flash - dt * 1.6);
  nightmareEvent.marker += nightmareEvent.markerDir * nightmareEvent.markerSpeed * dt;

  if (nightmareEvent.marker >= 1) {
    nightmareEvent.marker = 1;
    nightmareEvent.markerDir = -1;
  } else if (nightmareEvent.marker <= 0) {
    nightmareEvent.marker = 0;
    nightmareEvent.markerDir = 1;
  }

  if (nightmareEvent.timer <= 0) {
    resolveNightmareEvent(false);
  }
}

function updateDanceEvent(dt) {
  if (danceEvent.countdown) {
    danceEvent.countdownTimer -= dt;
    danceEvent.flash = Math.max(0, danceEvent.flash - dt * 0.7);
    if (danceEvent.countdownTimer <= 0) {
      danceEvent.countdown = false;
      danceEvent.active = true;
      danceEvent.index = 0;
      danceEvent.stepTimer = danceEvent.stepTimeLimit;
      danceEvent.flash = 1;
      playSound("clear");
      startDanceMusic();
    }
    return;
  }

  if (!danceEvent.active) {
    return;
  }

  danceEvent.stepTimer -= dt;
  danceEvent.flash = Math.max(0, danceEvent.flash - dt * 1.6);
  if (danceEvent.stepTimer <= 0) {
    resolveDanceEvent(false);
  }
}

function getThemeColors() {
  if (level.theme === "jungle") {
    return {
      skyTop: "#173824",
      skyMid: "#2f6a3f",
      skyBottom: "#91d56a",
      hillBack: "#1d4c2d",
      hillFront: "#12391f",
      cloud: "rgba(211, 255, 196, 0.36)",
      platformTop: "#9bd45a",
      groundTop: "#5fa332",
      hazardMain: "#31501d",
      hazardGlow: "#d7ff84",
      goal: "#ffd94f",
    };
  }

  if (level.theme === "forest") {
    return {
      skyTop: "#6ed8d3",
      skyMid: "#9ef1cf",
      skyBottom: "#e6f48f",
      hillBack: "#45876d",
      hillFront: "#235d4e",
      cloud: "rgba(240, 255, 245, 0.82)",
      platformTop: "#7fe38c",
      groundTop: "#4bc178",
      hazardMain: "#5776ff",
      hazardGlow: "#bdcbff",
      goal: "#8ef9ff",
    };
  }

  if (level.theme === "arcade") {
    return {
      skyTop: "#0b0621",
      skyMid: "#1b0a3d",
      skyBottom: "#240a3a",
      hillBack: "#0a0d18",
      hillFront: "#05070f",
      cloud: "rgba(255, 255, 255, 0)",
      platformTop: "#ff4df5",
      groundTop: "#45f8ff",
      hazardMain: "#ff2a5a",
      hazardGlow: "#ffd3e3",
      goal: "#a7ff70",
    };
  }

  if (level.theme === "factory") {
    return {
      skyTop: "#2d3242",
      skyMid: "#505a6d",
      skyBottom: "#d7a663",
      hillBack: "#59606d",
      hillFront: "#2f353f",
      cloud: "rgba(230, 232, 236, 0.32)",
      platformTop: "#f7c84f",
      groundTop: "#b5c3cf",
      hazardMain: "#c9482f",
      hazardGlow: "#ffd7a1",
      goal: "#ffe07a",
    };
  }

  if (level.theme === "frozen") {
    return {
      skyTop: "#071221",
      skyMid: "#123454",
      skyBottom: "#8ccdf1",
      hillBack: "#284d70",
      hillFront: "#163653",
      cloud: "rgba(226, 248, 255, 0.5)",
      platformTop: "#bdf3ff",
      groundTop: "#81d8ff",
      hazardMain: "#23446d",
      hazardGlow: "#b9f7ff",
      goal: "#8eeeff",
    };
  }

  if (level.theme === "sunset") {
    return {
      skyTop: "#ff9966",
      skyMid: "#ffc066",
      skyBottom: "#ffe5a0",
      hillBack: "#945d44",
      hillFront: "#5e3428",
      cloud: "rgba(255, 240, 220, 0.72)",
      platformTop: "#ffd65a",
      groundTop: "#ff9f68",
      hazardMain: "#8b2d39",
      hazardGlow: "#ffb28d",
      goal: "#fff0a6",
    };
  }

  return {
    skyTop: "#78d7ff",
    skyMid: "#99edff",
    skyBottom: "#f5d66e",
    hillBack: "#76b95e",
    hillFront: "#4c9342",
    cloud: "rgba(255, 255, 255, 0.8)",
    platformTop: "#7dcc55",
    groundTop: "#66b14f",
    hazardMain: "#7145c4",
    hazardGlow: "#c8a3ff",
    goal: "#7fe0ff",
  };
}

function drawBackground() {
  if (level.theme === "jungle") {
    drawJungleBackground();
    return;
  }

  if (level.theme === "arcade") {
    drawArcadeBackground();
    return;
  }

  if (level.theme === "factory") {
    drawFactoryBackground();
    return;
  }

  if (level.theme === "frozen") {
    drawFrozenBackground();
    return;
  }

  const palette = getThemeColors();
  const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  gradient.addColorStop(0, palette.skyTop);
  gradient.addColorStop(0.55, palette.skyMid);
  gradient.addColorStop(1, palette.skyBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Stage themes change the background mood while the game systems stay shared.
  drawParallaxHills(0.18, palette.hillBack, 320, 380, 120);
  drawParallaxHills(0.32, palette.hillFront, 380, 430, 150);
  drawCloud(120, 90, 1, palette.cloud);
  drawCloud(420, 120, 0.9, palette.cloud);
  drawCloud(760, 80, 1.1, palette.cloud);
}

function drawJungleBackground() {
  const palette = getThemeColors();
  const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  gradient.addColorStop(0, palette.skyTop);
  gradient.addColorStop(0.58, palette.skyMid);
  gradient.addColorStop(1, palette.skyBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  drawParallaxHills(0.12, palette.hillBack, 300, 390, 140);
  drawParallaxHills(0.26, palette.hillFront, 360, 440, 170);

  const vineScroll = (camera.x * 0.18) % 180;
  for (let i = -1; i < 8; i += 1) {
    const x = i * 180 - vineScroll;
    ctx.fillStyle = "rgba(20, 72, 34, 0.72)";
    ctx.fillRect(x + 28, 0, 10, 210 + (i % 3) * 35);
    ctx.fillStyle = "rgba(96, 168, 70, 0.58)";
    ctx.fillRect(x + 34, 34, 24, 8);
    ctx.fillRect(x + 12, 92, 28, 8);
    ctx.fillRect(x + 36, 150, 30, 8);
  }

  const mist = 0.08 + Math.sin(lastTime * 0.002) * 0.02;
  ctx.fillStyle = `rgba(223, 255, 196, ${mist})`;
  ctx.fillRect(0, 150, GAME_WIDTH, 90);
}

function drawFactoryBackground() {
  const palette = getThemeColors();
  const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  gradient.addColorStop(0, palette.skyTop);
  gradient.addColorStop(0.6, palette.skyMid);
  gradient.addColorStop(1, palette.skyBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  drawParallaxHills(0.14, palette.hillBack, 330, 395, 150);
  drawParallaxHills(0.28, palette.hillFront, 380, 448, 170);

  const smokeScroll = (camera.x * 0.08) % (GAME_WIDTH + 180);
  for (let i = -1; i < 5; i += 1) {
    const x = i * 250 - smokeScroll;
    ctx.fillStyle = "rgba(40, 43, 52, 0.7)";
    ctx.fillRect(x + 40, 170, 40, 190);
    ctx.fillRect(x + 126, 130, 54, 230);
    ctx.fillStyle = "rgba(215, 219, 223, 0.14)";
    ctx.fillRect(x + 48, 178, 8, 140);
    ctx.fillRect(x + 138, 138, 10, 170);

    for (let p = 0; p < 4; p += 1) {
      const puffY = 118 - p * 22 + Math.sin(lastTime * 0.002 + i + p) * 4;
      ctx.fillStyle = `rgba(230, 232, 236, ${0.18 - p * 0.03})`;
      ctx.fillRect(x + 34 - p * 6, puffY, 48 + p * 8, 14);
      ctx.fillRect(x + 120 - p * 8, puffY - 18, 64 + p * 10, 16);
    }
  }

  const beamOffset = (camera.x * 0.24) % 120;
  ctx.fillStyle = "rgba(255, 210, 110, 0.12)";
  for (let i = -1; i < 10; i += 1) {
    ctx.fillRect(i * 120 - beamOffset, 420, 18, 120);
  }
}

function drawFrozenBackground() {
  const palette = getThemeColors();
  const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  gradient.addColorStop(0, palette.skyTop);
  gradient.addColorStop(0.58, palette.skyMid);
  gradient.addColorStop(1, palette.skyBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  drawParallaxHills(0.12, palette.hillBack, 300, 390, 170);
  drawParallaxHills(0.26, palette.hillFront, 360, 448, 150);

  const towerScroll = (camera.x * 0.16) % 320;
  for (let i = -1; i < 5; i += 1) {
    const x = i * 320 - towerScroll;
    ctx.fillStyle = "rgba(5, 18, 34, 0.55)";
    ctx.fillRect(x + 120, 88, 34, 320);
    ctx.fillRect(x + 84, 170, 106, 16);
    ctx.fillRect(x + 98, 250, 78, 14);
    ctx.strokeStyle = "rgba(155, 234, 255, 0.24)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 137, 88);
    ctx.lineTo(x + 72, 236);
    ctx.moveTo(x + 137, 88);
    ctx.lineTo(x + 206, 236);
    ctx.stroke();
  }
}

function drawArcadeBackground() {
  const palette = getThemeColors();
  const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  gradient.addColorStop(0, palette.skyTop);
  gradient.addColorStop(0.55, palette.skyMid);
  gradient.addColorStop(1, palette.skyBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Neon grid floor.
  const horizonY = 260;
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = "rgba(90, 245, 255, 0.35)";
  ctx.lineWidth = 2;
  for (let i = -2; i <= 18; i += 1) {
    const t = i / 18;
    const y = horizonY + t * t * 320;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(GAME_WIDTH, y);
    ctx.stroke();
  }
  for (let i = -8; i <= 24; i += 1) {
    const x = i * 60 - (camera.x * 0.2) % 60;
    ctx.beginPath();
    ctx.moveTo(GAME_WIDTH / 2, horizonY);
    ctx.lineTo(x, GAME_HEIGHT);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Cabinet silhouettes + marquee lights.
  const scroll = (camera.x * 0.22) % 220;
  const baseY = 360;
  for (let i = -1; i < 7; i += 1) {
    const x = i * 220 - scroll;
    ctx.fillStyle = "rgba(5, 6, 12, 0.92)";
    ctx.fillRect(x + 16, baseY, 78, 140);
    ctx.fillRect(x + 110, baseY + 18, 90, 122);

    const flicker = 0.85 + Math.sin(lastTime * 0.004 + i * 1.7) * 0.12;
    ctx.fillStyle = `rgba(255, 77, 245, ${0.24 * flicker})`;
    ctx.fillRect(x + 26, baseY + 18, 58, 42);
    ctx.fillStyle = `rgba(69, 248, 255, ${0.18 * flicker})`;
    ctx.fillRect(x + 120, baseY + 36, 70, 38);

    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.fillRect(x + 16, baseY + 118, 78, 4);
    ctx.fillRect(x + 110, baseY + 112, 90, 4);
  }

  // Overhead neon ticker.
  const tickerX = 40 - (camera.x * 0.12) % (GAME_WIDTH + 220);
  ctx.fillStyle = "rgba(6, 6, 10, 0.7)";
  ctx.fillRect(tickerX, 44, 260, 28);
  ctx.fillStyle = "rgba(255, 220, 120, 0.32)";
  for (let i = 0; i < 26; i += 1) {
    const pulse = Math.sin(lastTime * 0.006 + i * 0.7) > 0 ? 1 : 0;
    ctx.fillRect(tickerX + 10 + i * 10, 52, 6, 6 + pulse);
  }
  ctx.fillStyle = "rgba(255, 77, 245, 0.24)";
  ctx.fillRect(tickerX + 10, 72, 240, 3);
}

function drawParallaxHills(speed, color, baseY, maxY, size) {
  ctx.fillStyle = color;
  for (let i = -1; i < 8; i += 1) {
    const x = i * 180 - (camera.x * speed) % 180;
    ctx.beginPath();
    ctx.moveTo(x, maxY);
    ctx.quadraticCurveTo(x + size * 0.35, baseY, x + size * 0.7, maxY);
    ctx.quadraticCurveTo(x + size * 1.05, baseY - 10, x + size * 1.4, maxY);
    ctx.lineTo(x + size * 1.4, GAME_HEIGHT);
    ctx.lineTo(x, GAME_HEIGHT);
    ctx.closePath();
    ctx.fill();
  }
}

function drawCloud(x, y, scale, color) {
  const px = x - (camera.x * 0.1) % (GAME_WIDTH + 140);
  ctx.fillStyle = color;
  ctx.fillRect(px, y, 40 * scale, 18 * scale);
  ctx.fillRect(px + 10 * scale, y - 10 * scale, 36 * scale, 22 * scale);
  ctx.fillRect(px + 30 * scale, y + 4 * scale, 28 * scale, 14 * scale);
}

function drawWorld() {
  ctx.save();
  ctx.translate(-camera.x, 0);
  drawHazards();
  drawFrostProjectiles();
  drawSerpentEnemies();
  drawGoal();
  drawSolids();
  drawCollectibles();
  drawEnemies();
  drawChangerClone();
  drawLightnerEffects();
  drawWildHunterEffects();
  drawPlayer();
  drawRemotePlayers();
  drawJungleCarryStack();
  drawFrozenPlayerEffect();
  drawChangerSwapEffect();
  drawJungleGrassOverlay();
  ctx.restore();
}

function drawLightnerEffects() {
  if (!isLightnerEquipped() && lightnerState.effects.length === 0) {
    return;
  }
  ctx.save();
  if (lightnerState.anchor) {
    const anchor = lightnerState.anchor;
    const pulse = 0.7 + Math.sin(lastTime * 0.025) * 0.18;
    ctx.strokeStyle = `rgba(255, 215, 0, ${0.75 * pulse})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(anchor.x, anchor.y, 18 + pulse * 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = `rgba(255, 215, 0, ${0.18 * pulse})`;
    ctx.fillRect(anchor.x - 5, anchor.y - 30, 10, 60);
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(anchor.x - 2, anchor.y - 18, 4, 36);
    ctx.fillRect(anchor.x - 12, anchor.y - 2, 24, 4);
  }

  for (const effect of lightnerState.effects) {
    const t = Math.max(0, Math.min(1, effect.timer / effect.duration));
    if (effect.type === "anchor") {
      ctx.strokeStyle = `rgba(255, 215, 0, ${0.5 * t})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(effect.x - 18, effect.y + 34);
      ctx.lineTo(effect.x, effect.y - 30);
      ctx.lineTo(effect.x + 16, effect.y + 16);
      ctx.stroke();
    } else if (effect.type === "teleport") {
      ctx.strokeStyle = `rgba(255, 215, 0, ${0.78 * t})`;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(effect.x, effect.y);
      ctx.lineTo(effect.toX, effect.toY);
      ctx.stroke();
      ctx.strokeStyle = `rgba(255, 246, 158, ${0.9 * t})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(effect.toX - 18, 0);
      ctx.lineTo(effect.toX + 4, effect.toY - 38);
      ctx.lineTo(effect.toX - 8, effect.toY - 8);
      ctx.lineTo(effect.toX + 14, effect.toY + 26);
      ctx.stroke();
      ctx.strokeStyle = `rgba(255, 215, 0, ${0.55 * t})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(effect.x + 12, effect.y - 36);
      ctx.lineTo(effect.x - 5, effect.y - 8);
      ctx.lineTo(effect.x + 9, effect.y + 22);
      ctx.stroke();
      ctx.fillStyle = `rgba(255, 215, 0, ${0.22 * t})`;
      ctx.fillRect(effect.x - 10, effect.y - 34, 20, 68);
      ctx.fillRect(effect.toX - 10, effect.toY - 34, 20, 68);
    } else if (effect.type === "field") {
      const radius = effect.radius;
      const groundY = Math.min(FLOOR_Y, effect.y + 72);
      ctx.strokeStyle = `rgba(255, 246, 158, ${0.92 * t})`;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(effect.x - 22, 0);
      ctx.lineTo(effect.x + 8, groundY - 108);
      ctx.lineTo(effect.x - 14, groundY - 42);
      ctx.lineTo(effect.x + 6, groundY);
      ctx.stroke();
      ctx.fillStyle = `rgba(255, 215, 0, ${0.12 * t})`;
      ctx.fillRect(effect.x - radius, groundY - 8, radius * 2, 16);
      ctx.strokeStyle = `rgba(255, 215, 0, ${0.78 * t})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(effect.x - radius, groundY);
      ctx.lineTo(effect.x + radius, groundY);
      ctx.stroke();
      for (let i = 0; i < 7; i += 1) {
        const side = i % 2 === 0 ? -1 : 1;
        const offset = (i + 1) * radius / 8 * side;
        ctx.strokeStyle = `rgba(255, 225, 70, ${0.62 * t})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(effect.x, groundY);
        ctx.lineTo(effect.x + offset, groundY + (i % 3 - 1) * 8);
        ctx.lineTo(effect.x + offset + side * 18, groundY + 10);
        ctx.stroke();
      }
    } else if (effect.type === "awaken") {
      ctx.strokeStyle = `rgba(255, 215, 0, ${0.34 + Math.sin(lastTime * 0.026) * 0.12})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(player.x + player.w * 0.5, player.y + player.h * 0.5, 34, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawJungleCarryStack() {
  if (level.theme !== "jungle" || jungleState.carried <= 0) {
    return;
  }
  const baseX = player.x + player.w * 0.5 - jungleState.carried * 5;
  const baseY = player.y - 16;
  for (let i = 0; i < jungleState.carried; i += 1) {
    drawBananaSprite(baseX + i * 12, baseY - i * 2, 0.9);
  }
}

function drawJungleGrassOverlay() {
  if (level.theme !== "jungle") {
    return;
  }
  const start = Math.max(0, Math.floor((camera.x - 80) / 38));
  const end = Math.ceil((camera.x + GAME_WIDTH + 80) / 38);
  for (let i = start; i <= end; i += 1) {
    const x = i * 38 + (i % 2) * 8;
    const height = 34 + (i % 5) * 7;
    ctx.fillStyle = i % 3 === 0 ? "rgba(14, 75, 29, 0.52)" : "rgba(28, 105, 38, 0.44)";
    ctx.beginPath();
    ctx.moveTo(x, FLOOR_Y + 12);
    ctx.lineTo(x + 12, FLOOR_Y + 12 - height);
    ctx.lineTo(x + 24, FLOOR_Y + 12);
    ctx.closePath();
    ctx.fill();
  }
}

function drawWildHunterEffects() {
  if (!isWildHunterEquipped() && wildHunterState.effects.length === 0) {
    return;
  }
  ctx.save();
  for (const effect of wildHunterState.effects) {
    const p = effect.duration > 0 ? effect.timer / effect.duration : 0;
    const alpha = Math.max(0, Math.min(1, p));
    if (effect.type === "blast") {
      ctx.strokeStyle = `rgba(210, 255, 90, ${0.72 * alpha})`;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, (effect.radius || 110) * (1 - alpha * 0.32), 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = `rgba(86, 176, 48, ${0.14 * alpha})`;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius || 110, 0, Math.PI * 2);
      ctx.fill();
    } else if (effect.type === "slamStart") {
      ctx.strokeStyle = `rgba(255, 238, 115, ${0.7 * alpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(effect.x - 18, effect.y - 10);
      ctx.lineTo(effect.x, effect.y + 18);
      ctx.lineTo(effect.x + 18, effect.y - 10);
      ctx.stroke();
    } else if (effect.type === "slamHit" || effect.type === "slamMiss") {
      ctx.fillStyle = `rgba(100, 74, 35, ${0.25 * alpha})`;
      ctx.fillRect(effect.x - (effect.radius || 56), effect.y - 7, (effect.radius || 56) * 2, 14);
      ctx.strokeStyle = `rgba(230, 255, 120, ${0.6 * alpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, (effect.radius || 56) * (1 - alpha * 0.3), Math.PI, Math.PI * 2);
      ctx.stroke();
    } else if (effect.type === "awaken") {
      const radius = 34 + Math.sin(lastTime * 0.018) * 5;
      ctx.strokeStyle = `rgba(255, 210, 70, ${0.42 + alpha * 0.2})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(player.x + player.w * 0.5, player.y + player.h * 0.5, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawSolids() {
  const palette = getThemeColors();
  for (const solid of level.solids) {
    const isGround = solid.y >= FLOOR_Y;
    if (level.theme === "arcade") {
      ctx.fillStyle = isGround ? "#1b1633" : "#231a3a";
    } else if (level.theme === "factory") {
      ctx.fillStyle = isGround ? "#565b66" : "#787f8a";
    } else if (level.theme === "frozen") {
      ctx.fillStyle = solid.ice ? "#7dcdeb" : (isGround ? "#31516d" : "#4f7895");
    } else if (level.theme === "jungle") {
      ctx.fillStyle = isGround ? "#4f3b25" : "#6a4b24";
    } else {
      ctx.fillStyle = isGround ? "#7f5c43" : "#9a733f";
    }
    ctx.fillRect(solid.x, solid.y, solid.w, solid.h);
    if (level.theme === "arcade") {
      ctx.fillStyle = isGround ? "#0e0a1b" : "#120c22";
    } else if (level.theme === "factory") {
      ctx.fillStyle = isGround ? "#2d3139" : "#4a515c";
    } else if (level.theme === "frozen") {
      ctx.fillStyle = solid.ice ? "#3a87ad" : "#203b52";
    } else if (level.theme === "jungle") {
      ctx.fillStyle = isGround ? "#2f2418" : "#3d2c17";
    } else {
      ctx.fillStyle = isGround ? "#5b3e2a" : "#6d512c";
    }
    ctx.fillRect(solid.x, solid.y + solid.h - 6, solid.w, 6);
    ctx.fillStyle = isGround ? palette.groundTop : palette.platformTop;
    ctx.fillRect(solid.x, solid.y, solid.w, 6);

    if (level.theme === "arcade") {
      const blink = Math.sin(lastTime * 0.01 + solid.x * 0.02) > 0 ? 1 : 0;
      ctx.fillStyle = "rgba(255,255,255,0.10)";
      ctx.fillRect(solid.x + 4, solid.y + 8, 6, 6);
      if (blink) {
        ctx.fillStyle = "rgba(69, 248, 255, 0.22)";
        ctx.fillRect(solid.x + 18, solid.y + 14, 5, 5);
      }
    } else if (level.theme === "factory") {
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(solid.x + 4, solid.y + 8, 6, 4);
      ctx.fillRect(solid.x + 18, solid.y + 14, 5, 4);
      ctx.fillStyle = "rgba(50, 55, 64, 0.4)";
      ctx.fillRect(solid.x + 12, solid.y + 6, 2, solid.h - 12);
    } else if (level.theme === "frozen") {
      ctx.fillStyle = solid.ice ? "rgba(235,255,255,0.42)" : "rgba(210,244,255,0.18)";
      ctx.fillRect(solid.x + 3, solid.y + 8, 12, 3);
      ctx.fillRect(solid.x + 17, solid.y + 14, 9, 2);
      if (solid.ice) {
        ctx.fillStyle = "rgba(255,255,255,0.22)";
        ctx.fillRect(solid.x, solid.y + 2, solid.w, 2);
      }
    } else if (level.theme === "jungle") {
      ctx.fillStyle = "rgba(23, 84, 34, 0.34)";
      ctx.fillRect(solid.x + 2, solid.y + 7, 7, solid.h - 12);
      ctx.fillStyle = "rgba(208, 245, 112, 0.22)";
      ctx.fillRect(solid.x + 12, solid.y + 8, 10, 4);
      ctx.fillRect(solid.x + 20, solid.y + 14, 8, 3);
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(solid.x + 4, solid.y + 8, 6, 6);
      ctx.fillRect(solid.x + 18, solid.y + 14, 5, 5);
    }
  }
}

function drawHazards() {
  const palette = getThemeColors();
  for (const hazard of level.hazards) {
    const serpentPool = hazardHasSerpent(hazard);
    if (serpentPool) {
      const waterTop = hazard.y + SERPENT_POOL_SURFACE_OFFSET;
      const waterHeight = Math.max(0, hazard.h - (SERPENT_POOL_SURFACE_OFFSET + SERPENT_POOL_BOTTOM_MARGIN));
      const waterGradient = ctx.createLinearGradient(0, waterTop, 0, waterTop + waterHeight);
      waterGradient.addColorStop(0, "rgba(112, 229, 255, 0.88)");
      waterGradient.addColorStop(0.45, "rgba(24, 132, 186, 0.9)");
      waterGradient.addColorStop(1, "rgba(8, 56, 101, 0.98)");
      ctx.fillStyle = waterGradient;
      ctx.fillRect(hazard.x, waterTop, hazard.w, waterHeight);

      ctx.fillStyle = "rgba(220, 252, 255, 0.75)";
      for (let i = 0; i < hazard.w; i += 18) {
        const wave = Math.sin((i + lastTime * 0.02) * 0.08) * 2;
        ctx.fillRect(hazard.x + i, waterTop + wave, 12, 3);
      }

      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.fillRect(hazard.x, waterTop + 4, hazard.w, 4);
    }

    for (let i = 0; i < hazard.w; i += 16) {
      ctx.fillStyle = serpentPool ? "#163963" : palette.hazardMain;
      ctx.beginPath();
      ctx.moveTo(hazard.x + i, hazard.y + hazard.h);
      ctx.lineTo(hazard.x + i + 8, hazard.y);
      ctx.lineTo(hazard.x + i + 16, hazard.y + hazard.h);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = serpentPool ? "#8be3ff" : palette.hazardGlow;
      ctx.fillRect(hazard.x + i + 6, hazard.y + 12, 4, 8);
    }

    if (hazard.frozenByWarden) {
      ctx.fillStyle = "rgba(194, 247, 255, 0.78)";
      ctx.fillRect(hazard.x, hazard.y - 4, hazard.w, 10);
      ctx.fillStyle = "rgba(255, 255, 255, 0.44)";
      for (let i = 4; i < hazard.w; i += 24) {
        ctx.fillRect(hazard.x + i, hazard.y - 2, 12, 3);
      }
      ctx.strokeStyle = "rgba(104, 218, 255, 0.68)";
      ctx.lineWidth = 2;
      ctx.strokeRect(hazard.x, hazard.y - 4, hazard.w, 10);
    }
  }
}

function drawFrostProjectiles() {
  if (level.theme !== "frozen") {
    return;
  }
  for (const projectile of level.frostProjectiles) {
    const wave = Math.sin(projectile.phase) * 4;
    ctx.fillStyle = "rgba(154, 238, 255, 0.32)";
    ctx.fillRect(projectile.x - 8, projectile.y - 8 + wave, projectile.w + 16, projectile.h + 16);
    ctx.fillStyle = "#d7fbff";
    ctx.beginPath();
    ctx.moveTo(projectile.x, projectile.y + projectile.h * 0.5);
    ctx.lineTo(projectile.x + projectile.w * 0.65, projectile.y);
    ctx.lineTo(projectile.x + projectile.w, projectile.y + projectile.h * 0.5);
    ctx.lineTo(projectile.x + projectile.w * 0.65, projectile.y + projectile.h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#54cfff";
    ctx.fillRect(projectile.x + 8, projectile.y + 8, projectile.w - 16, 5);
  }
}

function drawSerpentEnemies() {
  for (const serpent of level.serpentEnemies) {
    if (serpent.defeated) {
      continue;
    }
    if (serpent.rise <= 4 && serpent.alive && serpent.state === "idle") {
      continue;
    }

    const neckBaseX = serpent.homeX;
    const neckBaseY = serpent.baseY - serpent.rise;
    const headX = serpent.homeX + (serpent.strikeX - serpent.homeX) * serpent.strikeProgress;
    const headY = serpent.baseY - serpent.rise + (serpent.strikeY - (serpent.baseY - serpent.rise)) * serpent.strikeProgress;
    const sway = Math.sin(serpent.animationTime * 4 + serpent.phase) * (serpent.state === "strike" ? 2 : 6);
    const jaw = serpent.alive ? (Math.sin(serpent.animationTime * 11) > 0 ? 5 : 1) : 0;
    const crestWave = Math.sin(serpent.animationTime * 9 + serpent.phase) * 2;

    ctx.save();
    ctx.strokeStyle = serpent.alive ? "#091a33" : "#426b7f";
    ctx.lineWidth = 24;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(neckBaseX, neckBaseY);
    ctx.quadraticCurveTo(neckBaseX + 10 + sway * 0.3, neckBaseY - 36, headX - 8, headY + 18);
    ctx.stroke();

    ctx.strokeStyle = serpent.alive ? "#0e4a72" : "#7bb1ba";
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(neckBaseX + 1, neckBaseY + 2);
    ctx.quadraticCurveTo(neckBaseX + 5 + sway * 0.2, neckBaseY - 30, headX - 6, headY + 18);
    ctx.stroke();

    ctx.strokeStyle = serpent.alive ? "#8ae8ff" : "#9fc0ca";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(neckBaseX + 4, neckBaseY + 7);
    ctx.quadraticCurveTo(neckBaseX + 10, neckBaseY - 22, headX - 4, headY + 20);
    ctx.stroke();

    for (let i = 0; i < 7; i += 1) {
      const spineT = i / 6;
      const finX = neckBaseX + (headX - neckBaseX) * spineT - 4;
      const finY = neckBaseY + (headY - neckBaseY) * spineT - 8;
      ctx.fillStyle = serpent.alive ? "#301744" : "#6a7782";
      ctx.beginPath();
      ctx.moveTo(finX, finY + 10);
      ctx.lineTo(finX - 12, finY - 10 - crestWave);
      ctx.lineTo(finX + 5, finY - 2);
      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = serpent.alive ? "#0f5f83" : "#5f7983";
    ctx.beginPath();
    ctx.moveTo(headX - 30, headY + 4);
    ctx.lineTo(headX - 12, headY - 20);
    ctx.lineTo(headX + 12, headY - 18);
    ctx.lineTo(headX + 34, headY - 6);
    ctx.lineTo(headX + 28, headY + 4);
    ctx.lineTo(headX + 8, headY + 14 + jaw);
    ctx.lineTo(headX - 22, headY + 16);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = serpent.alive ? "#dbefe6" : "#9cadb6";
    ctx.beginPath();
    ctx.moveTo(headX - 14, headY + 8);
    ctx.lineTo(headX + 16, headY + 14 + jaw);
    ctx.lineTo(headX + 8, headY + 24 + jaw);
    ctx.lineTo(headX - 22, headY + 16);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = serpent.alive ? "#42255b" : "#5a6870";
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.moveTo(headX - 24 + i * 10, headY - 6);
      ctx.lineTo(headX - 18 + i * 10, headY - 26 - (i % 2) * 6);
      ctx.lineTo(headX - 10 + i * 10, headY - 8);
      ctx.closePath();
      ctx.fill();
    }

    if (serpent.alive) {
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 6; i += 1) {
        ctx.beginPath();
        ctx.moveTo(headX - 12 + i * 5, headY + 11);
        ctx.lineTo(headX - 9 + i * 5, headY + 20 + jaw);
        ctx.lineTo(headX - 6 + i * 5, headY + 11);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.fillStyle = serpent.alive ? "#ffcf87" : "#bcc5c8";
    ctx.fillRect(headX + 8, headY - 1, 5, 5);
    ctx.fillStyle = serpent.alive ? "#ea5b54" : "#798085";
    ctx.fillRect(headX + 9, headY, 3, 3);
    ctx.fillStyle = serpent.alive ? "#0c1022" : "#475057";
    ctx.fillRect(headX + 10, headY + 1, 1, 1);

    if (serpent.state === "telegraph") {
      ctx.fillStyle = "rgba(255, 110, 110, 0.35)";
      ctx.beginPath();
      ctx.arc(headX + 4, headY + 2, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

function drawCollectibles() {
  for (const collectible of level.collectibles) {
    if (collectible.collected) {
      continue;
    }
    const bobY = level.theme === "factory" ? 0 : Math.sin(player.animationTime * 4 + collectible.bob) * 3;
    const x = collectible.x;
    const y = collectible.y + bobY;

    if (collectible.style === "banana") {
      drawBananaSprite(x, y, 1);
    } else if (level.theme === "factory") {
      const pulse = 0.82 + Math.sin(lastTime * 0.01 + collectible.bob) * 0.08;
      ctx.fillStyle = "#d8dadd";
      ctx.fillRect(x, y + 8, 20, 6);
      ctx.fillRect(x + 2, y + 6, 16, 2);

      ctx.fillStyle = "#f4f5f6";
      ctx.fillRect(x + 1, y + 4, 18, 4);
      ctx.fillStyle = "#c3c7cb";
      ctx.fillRect(x + 2, y + 11, 16, 2);

      ctx.fillStyle = `rgba(196, 18, 18, ${0.95 * pulse})`;
      ctx.fillRect(x + 4, y + 1, 12, 8);
      ctx.fillRect(x + 3, y + 3, 14, 5);
      ctx.fillStyle = `rgba(239, 68, 68, ${0.95 * pulse})`;
      ctx.fillRect(x + 5, y + 2, 10, 3);
      ctx.fillStyle = "rgba(255,255,255,0.42)";
      ctx.fillRect(x + 6, y + 2, 5, 1);
    } else if (level.theme === "arcade") {
      const flicker = 0.85 + Math.sin(lastTime * 0.01 + collectible.bob) * 0.15;
      ctx.fillStyle = `rgba(255, 214, 92, ${0.9 * flicker})`;
      ctx.fillRect(x + 2, y + 2, 16, 16);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.18 * flicker})`;
      ctx.fillRect(x + 4, y + 4, 12, 12);
      ctx.fillStyle = `rgba(255, 77, 245, ${0.45 * flicker})`;
      ctx.fillRect(x + 7, y + 6, 6, 8);
      ctx.fillStyle = `rgba(12, 8, 20, ${0.85 * flicker})`;
      ctx.fillRect(x + 8, y + 8, 4, 2);
      ctx.fillRect(x + 8, y + 10, 2, 2);
      ctx.fillRect(x + 10, y + 10, 2, 2);
    } else if (level.theme === "frozen") {
      const pulse = 0.78 + Math.sin(lastTime * 0.009 + collectible.bob) * 0.18;
      ctx.fillStyle = `rgba(255, 224, 80, ${0.24 * pulse})`;
      ctx.beginPath();
      ctx.arc(x + 12, y + 12, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#d58b1f";
      ctx.fillRect(x + 5, y + 2, 14, 20);
      ctx.fillRect(x + 2, y + 5, 20, 14);
      ctx.fillStyle = `rgba(255, 239, 125, ${0.98 * pulse})`;
      ctx.fillRect(x + 7, y + 4, 10, 16);
      ctx.fillRect(x + 4, y + 7, 16, 10);
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.fillRect(x + 8, y + 5, 4, 3);
    } else {
      ctx.fillStyle = "#ffe14d";
      ctx.fillRect(x + 4, y, 12, 20);
      ctx.fillRect(x, y + 4, 20, 12);
      ctx.fillStyle = "#fff3a0";
      ctx.fillRect(x + 6, y + 2, 4, 4);
      ctx.fillRect(x + 10, y + 6, 4, 4);
      ctx.fillStyle = "#d68a1b";
      ctx.fillRect(x + 14, y + 4, 2, 10);
    }
  }
}

function drawEnemySprite(enemy) {
  if (enemy.type === "excavator" && !enemy.alive) {
    return;
  }

  if (enemy.type === "excavator") {
    drawExcavatorSprite(enemy);
    return;
  }

  if (enemy.type === "frostWarden") {
    drawFrostWardenSprite(enemy);
    return;
  }

  const bounce = Math.sin(enemy.animationTime * 8) > 0 ? 1 : 0;
  const x = enemy.x;
  const y = enemy.y;

  if (!enemy.alive && enemy.squishTimer <= 0) {
    return;
  }

  if (!enemy.alive) {
    ctx.fillStyle = "#9f4e3a";
    ctx.fillRect(x, y + 16, enemy.w, 10);
    ctx.fillStyle = "#f6d38f";
    ctx.fillRect(x + 4, y + 18, 6, 4);
    ctx.fillRect(x + 16, y + 18, 6, 4);
    return;
  }

  ctx.fillStyle = "#9f4e3a";
  ctx.fillRect(x + 2, y + 10, 22, 14);
  ctx.fillStyle = "#e9c189";
  ctx.fillRect(x + 4, y + 4, 18, 12);
  ctx.fillRect(x + 4, y + 24, 6, 2 + bounce);
  ctx.fillRect(x + 16, y + 24, 6, 2 + (1 - bounce));
  ctx.fillStyle = "#40211b";
  ctx.fillRect(x + 7, y + 8, 2, 2);
  ctx.fillRect(x + 17, y + 8, 2, 2);
  ctx.fillRect(x + 10, y + 12, 6, 2);
}

function drawExcavatorSprite(enemy) {
  const x = enemy.x;
  const y = enemy.y;
  const bodyW = enemy.w;
  const armAnchorX = enemy.facing > 0 ? x + bodyW - 6 : x + 6;
  const armAnchorY = enemy.armBaseY;
  const elbowX = armAnchorX + enemy.facing * Math.max(18, enemy.armLength * 0.52);
  const claw = getExcavatorClawHitbox(enemy);
  const clawCenterY = claw.y + claw.h * 0.5;
  const elbowY = armAnchorY + (clawCenterY - armAnchorY) * 0.42 - 14;
  const telegraphPulse = enemy.state === "telegraph" ? (Math.sin(lastTime * 0.03) > 0 ? 1 : 0.45) : 0.35;

  ctx.save();
  ctx.strokeStyle = "#3a2414";
  ctx.lineWidth = 11;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(armAnchorX, armAnchorY);
  ctx.lineTo(elbowX, elbowY);
  ctx.lineTo(claw.x + claw.w * 0.5, claw.y + claw.h * 0.5);
  ctx.stroke();

  ctx.strokeStyle = "#c37b2e";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(armAnchorX, armAnchorY);
  ctx.lineTo(elbowX, elbowY);
  ctx.lineTo(claw.x + claw.w * 0.5, claw.y + claw.h * 0.5);
  ctx.stroke();

  ctx.fillStyle = "#f0a93a";
  ctx.fillRect(x + 8, y + 10, 26, 18);
  ctx.fillRect(x + 4, y + 26, 34, 10);
  ctx.fillStyle = "#66411d";
  ctx.fillRect(x + 12, y + 14, 10, 8);
  ctx.fillStyle = "#9bd7ff";
  ctx.fillRect(x + 22, y + 14, 8, 8);

  ctx.fillStyle = "#2a2e35";
  ctx.fillRect(x + 3, y + 36, 36, 6);
  ctx.fillStyle = "#646d77";
  ctx.fillRect(x + 4, y + 38, 8, 4);
  ctx.fillRect(x + 16, y + 38, 8, 4);
  ctx.fillRect(x + 28, y + 38, 8, 4);

  ctx.fillStyle = enemy.state === "telegraph" || enemy.state === "strike"
    ? `rgba(255, 88, 88, ${telegraphPulse})`
    : "rgba(255, 239, 160, 0.55)";
  ctx.fillRect(x + 28, y + 8, 6, 6);

  ctx.fillStyle = "#3a2414";
  ctx.fillRect(claw.x + 2, claw.y + 4, claw.w - 4, claw.h - 8);
  ctx.fillStyle = "#d5dee5";
  ctx.fillRect(claw.x, claw.y, 5, claw.h);
  ctx.fillRect(claw.x + claw.w - 5, claw.y, 5, claw.h);
  ctx.restore();
}

function drawFrostWardenSprite(enemy) {
  if (enemy.defeated) {
    if ((enemy.qteMeltTimer || 0) <= 0) {
      return;
    }
    const x = enemy.x;
    const y = enemy.y + 52;
    const melt = Math.max(0, Math.min(1, enemy.qteMeltTimer / 1.2));
    const steam = (0.45 + Math.sin(lastTime * 0.01) * 0.16) * melt;
    ctx.save();
    ctx.fillStyle = `rgba(124, 224, 255, ${0.22 * melt})`;
    ctx.fillRect(x + 8, y + 26, 58, 10);
    ctx.fillStyle = `rgba(213, 250, 255, ${0.62 * melt})`;
    ctx.fillRect(x + 16, y + 18, 16, 8);
    ctx.fillRect(x + 38, y + 20, 20, 7);
    ctx.fillStyle = `rgba(206, 248, 255, ${steam})`;
    ctx.fillRect(x + 18, y - 6, 5, 12);
    ctx.fillRect(x + 34, y - 16, 6, 18);
    ctx.fillRect(x + 52, y - 8, 5, 14);
    for (let i = 0; i < 5; i += 1) {
      const coinX = x + 12 + i * 11;
      const coinY = y + 18 + Math.sin(lastTime * 0.006 + i) * 3;
      ctx.fillStyle = `rgba(255, 213, 75, ${0.82 * melt})`;
      ctx.beginPath();
      ctx.arc(coinX, coinY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255, 249, 177, ${0.7 * melt})`;
      ctx.fillRect(coinX - 1, coinY - 3, 2, 6);
    }
    ctx.strokeStyle = "rgba(126, 225, 255, 0.68)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 6, y + 34);
    ctx.lineTo(x + 16, y + 26);
    ctx.lineTo(x + 36, y + 36);
    ctx.lineTo(x + 70, y + 24);
    ctx.stroke();
    ctx.restore();
    return;
  }
  if (!enemy.alive) {
    return;
  }
  const x = enemy.x;
  const y = enemy.y;
  const pulse = 0.72 + Math.sin(enemy.animationTime * 5) * 0.12;
  const telegraph = enemy.state === "telegraph" ? 0.55 + Math.sin(lastTime * 0.04) * 0.25 : 0;
  const auraAlpha = Math.min(0.82, 0.16 + enemy.auraPulse * 0.32 + telegraph);

  ctx.save();
  ctx.fillStyle = `rgba(97, 218, 255, ${auraAlpha})`;
  ctx.beginPath();
  ctx.ellipse(x + enemy.w * 0.5, y + enemy.h * 0.55, 76, 96, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#071522";
  ctx.fillRect(x + 18, y + 24, 38, 46);
  ctx.fillRect(x + 12, y + 52, 48, 22);
  ctx.fillStyle = "#24384f";
  ctx.fillRect(x + 20, y + 18, 34, 42);
  ctx.fillRect(x + 8, y + 44, 18, 34);
  ctx.fillRect(x + 48, y + 44, 18, 34);
  ctx.fillStyle = "#d7efff";
  ctx.fillRect(x + 15, y + 8, 42, 16);
  ctx.fillRect(x + 21, y + 2, 9, 16);
  ctx.fillRect(x + 42, y, 9, 18);
  ctx.fillStyle = "#8ddfff";
  ctx.fillRect(x + 25, y + 28, 22, 8);
  ctx.fillRect(x + 30, y + 38, 12, 18);
  ctx.fillStyle = `rgba(101, 220, 255, ${0.88 * pulse + telegraph})`;
  ctx.fillRect(x + 27, y + 18, 5, 5);
  ctx.fillRect(x + 42, y + 18, 5, 5);
  ctx.fillRect(x + 30, y + 30, 12, 3);
  ctx.fillStyle = "#06101c";
  ctx.fillRect(x + 16, y + 74, 18, 12);
  ctx.fillRect(x + 40, y + 74, 18, 12);

  if (enemy.state === "telegraph") {
    ctx.strokeStyle = "rgba(213, 251, 255, 0.82)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(x + enemy.w * 0.5, y + enemy.h * 0.55, 82, 102, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawEnemies() {
  for (const enemy of level.enemies) {
    drawEnemySprite(enemy);
  }
}

function drawBananaSprite(x, y, scale = 1) {
  const w = 20 * scale;
  const h = 16 * scale;
  ctx.fillStyle = "rgba(36, 47, 16, 0.22)";
  ctx.fillRect(x + 3 * scale, y + 14 * scale, w - 4 * scale, 3 * scale);
  ctx.fillStyle = "#6b451b";
  ctx.fillRect(x + 1 * scale, y + 7 * scale, 4 * scale, 4 * scale);
  ctx.fillStyle = "#f4c431";
  ctx.beginPath();
  ctx.ellipse(x + 10 * scale, y + 8 * scale, 9 * scale, h * 0.42, -0.45, 0.1, Math.PI * 1.12);
  ctx.strokeStyle = "#f4c431";
  ctx.lineWidth = Math.max(3, 4 * scale);
  ctx.stroke();
  ctx.fillStyle = "#ffe76a";
  ctx.fillRect(x + 7 * scale, y + 4 * scale, 8 * scale, 3 * scale);
  ctx.fillStyle = "#9a651f";
  ctx.fillRect(x + 16 * scale, y + 4 * scale, 3 * scale, 3 * scale);
}

function drawPlayer() {
  const flicker = player.invulnerableTime > 0 && Math.floor(player.invulnerableTime * 18) % 2 === 0;
  if (flicker) {
    return;
  }

  const x = player.x;
  const y = player.y;
  const frame = Math.floor(player.animationTime * 10) % 2;

  ctx.save();
  if (player.facing < 0) {
    ctx.translate(x + player.w + 2, y - 5);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(x - 2, y - 5);
  }
  ctx.scale(PLAYER_SPRITE_RENDER_SCALE, PLAYER_SPRITE_RENDER_SCALE);

  const legOffset = player.state === "run" ? (frame === 0 ? 0 : 2) : player.state === "jump" ? 1 : 0;
  const armOffset = player.state === "run" ? (frame === 0 ? 2 : -1) : player.state === "jump" ? -2 : 0;
  const scarfOffset = player.state === "jump" ? -2 : frame;
  const r = (dx, dy, dw, dh) => ctx.fillRect(dx * 2, dy * 2, dw * 2, dh * 2);

  if (isChangerEquipped()) {
    drawChangerPlayerSprite(legOffset, armOffset, scarfOffset, false);
    ctx.restore();
    return;
  }

  if (isGuardianEquipped()) {
    drawGuardianPlayerSprite(legOffset, armOffset);
    ctx.restore();
    return;
  }

  if (isAssassinEquipped()) {
    drawAssassinPlayerSprite(legOffset, armOffset, scarfOffset);
    ctx.restore();
    return;
  }

  if (isLightnerEquipped()) {
    drawLightnerPlayerSprite(legOffset, armOffset, scarfOffset);
    ctx.restore();
    return;
  }

  if (isWildHunterEquipped()) {
    drawWildHunterPlayerSprite(legOffset, armOffset, scarfOffset);
    ctx.restore();
    return;
  }

  if (player.state === "stun") {
    ctx.fillStyle = "#0e1830";
    r(7, 4, 12, 7);
    r(8, 11, 10, 3);
    ctx.fillStyle = "#ff9d54";
    r(6, 6, 14, 8);
    ctx.fillStyle = "#ffbf7d";
    r(8, 8, 3, 3);
    r(16, 8, 2, 2);
    ctx.fillStyle = "#1a2238";
    r(9, 9, 8, 6);
    ctx.fillStyle = "#6fd2ff";
    r(12, 11, 2, 2);
    r(16, 11, 1, 2);
    ctx.fillStyle = "#173f7a";
    r(5, 17, 17, 8);
    ctx.fillStyle = "#2e6eb5";
    r(6, 18, 15, 4);
    ctx.fillStyle = "#ffd24d";
    r(18, 19, 5, 2);
    ctx.fillStyle = "#ff8a4c";
    r(5, 25, 6, 4);
    r(15, 25, 6, 4);
    ctx.fillStyle = "#efbb8d";
    r(3, 18, 2, 7);
    r(22, 18, 2, 7);
    ctx.fillStyle = "#ffe98a";
    r(3, 2, 2, 4);
    r(21, 4, 2, 3);
    ctx.restore();
    return;
  }

  if (player.crouching && level.theme === "arcade") {
    const crouchPulse = Math.sin(player.animationTime * 10) > 0 ? 1 : 0;
    ctx.fillStyle = "#101b32";
    r(7, 6, 12, 6);
    r(8, 12, 9, 2);
    ctx.fillStyle = "#ff9647";
    r(6, 8, 14, 7);
    ctx.fillStyle = "#ffd5a4";
    r(9, 11, 2, 2);
    ctx.fillStyle = "#182337";
    r(9, 11, 8, 5);
    ctx.fillStyle = "#74d6ff";
    r(13, 12, 2, 2);
    ctx.fillStyle = "#214a86";
    r(4, 18, 18, 7);
    ctx.fillStyle = "#2f74bc";
    r(5, 19, 16, 3);
    ctx.fillStyle = "#ffd24d";
    r(18, 19 + crouchPulse, 5, 2);
    ctx.fillStyle = "#ff8945";
    r(5, 25, 6, 3);
    r(15, 25, 6, 3);
    ctx.fillStyle = "#efbb8d";
    r(3, 19, 2, 6);
    r(21, 19, 2, 6);
    ctx.restore();
    return;
  }

  const simpleSkin = getSimpleSkinPalette();
  const cyberSkin = isCyberSkinEquipped();
  const voidSkin = isVoidKingSkinEquipped();
  const voidPulse = 0.82 + Math.sin(lastTime * 0.01) * 0.18;
  ctx.fillStyle = "#0f1731";
  if (voidSkin) {
    ctx.fillStyle = "#050507";
  } else if (simpleSkin) {
    ctx.fillStyle = simpleSkin.dark;
  } else if (cyberSkin) {
    ctx.fillStyle = "#070a12";
  }
  r(8, 2, 10, 6);
  r(9, 0, 7, 3);
  r(7, 7, 12, 2);
  ctx.fillStyle = voidSkin ? "#0b0b10" : simpleSkin ? simpleSkin.primary : cyberSkin ? "#111626" : "#ff9445";
  r(6, 5, 14, 10);
  ctx.fillStyle = voidSkin ? "#16161e" : simpleSkin ? simpleSkin.accent : cyberSkin ? "#1b223a" : "#ffc98c";
  r(8, 8, 3, 4);
  r(16, 8, 2, 3);
  ctx.fillStyle = voidSkin ? "#2b2b33" : simpleSkin ? simpleSkin.accent : cyberSkin ? "#2f3b63" : "#ffd0a0";
  r(10, 7, 6, 3);
  ctx.fillStyle = voidSkin ? "#050507" : simpleSkin ? simpleSkin.dark : cyberSkin ? "#0d1220" : "#171f35";
  r(9, 9, 8, 8);
  ctx.fillStyle = voidSkin ? `rgba(255, 66, 66, ${voidPulse})` : simpleSkin ? simpleSkin.glow : cyberSkin ? "#7fefff" : "#66d2ff";
  r(12, 11, 2, 2);
  r(16, 11, 1, 2);
  ctx.fillStyle = voidSkin ? "#ffcaca" : simpleSkin ? simpleSkin.accent : cyberSkin ? "#ffffff" : "#f7fbff";
  r(13, 11, 1, 1);
  r(16, 11, 1, 1);
  ctx.fillStyle = voidSkin ? "#111116" : simpleSkin ? simpleSkin.secondary : cyberSkin ? "#171c35" : "#1a447b";
  r(5, 17, 16, 10);
  ctx.fillStyle = voidSkin ? "#1c1b23" : simpleSkin ? simpleSkin.primary : cyberSkin ? "#232c4f" : "#2f74bc";
  r(6, 18, 14, 4);
  r(8, 22, 10, 2);
  ctx.fillStyle = voidSkin ? "#66151b" : simpleSkin ? simpleSkin.glow : cyberSkin ? "#7fefff" : "#79d9ff";
  r(8, 18, 1, 6);
  r(17, 18, 1, 6);
  r(10, 20, 6, 1);
  ctx.fillStyle = voidSkin ? "#09090d" : simpleSkin ? simpleSkin.dark : cyberSkin ? "#11182b" : "#18345e";
  r(9, 18, 3, 8);
  r(14, 18, 4, 8);
  ctx.fillStyle = voidSkin ? "#611318" : simpleSkin ? simpleSkin.accent : cyberSkin ? "#9b63ff" : "#ffd24d";
  r(18, 18 + scarfOffset, 5, 2);
  r(20, 20 + scarfOffset, 3, 1);
  ctx.fillStyle = voidSkin ? "#08080a" : simpleSkin ? simpleSkin.dark : cyberSkin ? "#0b0e17" : "#ff8b47";
  r(4, 27, 7, 4 + legOffset);
  r(15, 27, 7, 4 + (2 - legOffset));
  ctx.fillStyle = voidSkin ? "#2e0a0d" : simpleSkin ? simpleSkin.secondary : cyberSkin ? "#4e5fff" : "#efbb8d";
  r(2, 19 + armOffset, 2, 8);
  r(22, 19 - armOffset, 2, 8);
  ctx.fillStyle = voidSkin ? "#ff9b9b" : simpleSkin ? simpleSkin.glow : cyberSkin ? "#d5b6ff" : "#f7fbff";
  r(12, 11, 1, 1);
  r(16, 11, 1, 1);
  if (voidSkin) {
    ctx.fillStyle = `rgba(174, 28, 35, ${0.52 + Math.sin(lastTime * 0.012) * 0.1})`;
    r(10, 17, 1, 8);
    r(15, 17, 1, 8);
    r(11, 20, 4, 1);
    r(7, 6, 2, 3);
    r(18, 6, 2, 3);
  }
  drawPlayerSkinAccent();
  ctx.restore();
}

function drawRemotePlayers() {
  if (multiplayerState.peers.size === 0) {
    return;
  }
  ctx.save();
  ctx.font = "12px 'Press Start 2P', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  for (const peer of multiplayerState.peers.values()) {
    if (peer.stage !== currentStageIndex || peer.gameState !== "playing") {
      continue;
    }
    const alpha = Math.max(0.25, 1 - (performance.now() - peer.updatedAt) / 5000);
    const x = Number(peer.x) || 0;
    const y = Number(peer.y) || 0;
    const w = Number(peer.w) || 26;
    const h = Number(peer.h) || PLAYER_STAND_H;
    const facing = Number(peer.facing) || 1;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(118, 234, 255, 0.22)";
    ctx.fillRect(x - 5, y - 8, w + 10, h + 12);
    ctx.strokeStyle = "rgba(118, 234, 255, 0.82)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 4, y - 7, w + 8, h + 10);
    ctx.fillStyle = peer.skin === "overgearB08" ? "#8f5d32" : peer.skin === "voidKing" ? "#171117" : "#2e6eb5";
    ctx.fillRect(x + 4, y + 9, w - 8, h - 9);
    ctx.fillStyle = peer.character === "lightner" ? "#8fefff" : "#ffeaa4";
    ctx.fillRect(x + (facing > 0 ? w - 8 : 5), y + 7, 5, 4);
    ctx.fillStyle = "rgba(247, 251, 255, 0.95)";
    ctx.fillText(String(peer.name || "Friend").slice(0, 12), x + w * 0.5, y - 10);
  }
  ctx.restore();
}

function drawWildHunterPlayerSprite(legOffset, armOffset, scarfOffset) {
  const awakened = wildHunterState.awakenTimer > 0;
  const instinct = wildHunterState.instinctTimer > 0;
  const simpleSkin = getSimpleSkinPalette();
  const cyberSkin = isCyberSkinEquipped();
  const voidSkin = isVoidKingSkinEquipped();
  const pulse = 0.72 + Math.sin(lastTime * 0.018) * 0.18;
  const r = (dx, dy, dw, dh) => ctx.fillRect(dx * 2, dy * 2, dw * 2, dh * 2);
  ctx.save();

  const hood = voidSkin ? "#08070a" : simpleSkin ? simpleSkin.dark : cyberSkin ? "#070b10" : "#1a2b16";
  const vest = voidSkin ? "#171018" : simpleSkin ? simpleSkin.primary : cyberSkin ? "#16252d" : "#315b27";
  const vestDark = voidSkin ? "#2f0d16" : simpleSkin ? simpleSkin.secondary : cyberSkin ? "#203946" : "#223f1d";
  const fur = voidSkin ? "#d9b0b0" : simpleSkin ? simpleSkin.accent : cyberSkin ? "#9eeaff" : "#d7b46a";
  const glow = awakened ? "#ffcc45" : instinct ? "#d7ff5a" : voidSkin ? "#ff7474" : cyberSkin ? "#79eaff" : "#f2e36a";

  ctx.fillStyle = hood;
  r(7, 2, 12, 6);
  r(6, 6, 14, 4);
  ctx.fillStyle = fur;
  r(5, 7, 4, 5);
  r(17, 7, 4, 5);
  ctx.fillStyle = "#2a160f";
  r(8, 8, 10, 7);
  ctx.fillStyle = "#c58b5a";
  r(9, 9, 8, 5);
  ctx.fillStyle = hood;
  r(9, 12, 8, 4);
  ctx.fillStyle = glow;
  r(11, 11, 2, 2);
  r(16, 11, 2, 2);

  ctx.fillStyle = vest;
  r(5, 17, 17, 10);
  ctx.fillStyle = vestDark;
  r(7, 18, 13, 5);
  ctx.fillStyle = fur;
  r(5, 17, 3, 10);
  r(19, 17, 3, 10);
  ctx.fillStyle = glow;
  r(12, 18, 3, 2);
  r(14, 20, 1, 5);

  ctx.fillStyle = "#1b1712";
  r(4, 27, 7, 4 + legOffset);
  r(15, 27, 7, 4 + (2 - legOffset));
  ctx.fillStyle = vestDark;
  r(2, 19 + armOffset, 2, 8);
  r(22, 19 - armOffset, 2, 8);
  ctx.fillStyle = fur;
  r(2, 25 + armOffset, 3, 2);
  r(21, 25 - armOffset, 3, 2);

  ctx.fillStyle = glow;
  r(18, 18 + scarfOffset, 5, 2);
  r(20, 20 + scarfOffset, 3, 1);
  if (awakened || instinct) {
    ctx.fillStyle = `rgba(255, 225, 70, ${0.26 + pulse * 0.18})`;
    r(3, 7, 2, 3);
    r(21, 8, 2, 3);
    r(10, 2, 1, 3);
    r(17, 3, 1, 2);
  }
  drawPlayerSkinAccent();
  ctx.restore();
}

function drawLightnerPlayerSprite(legOffset, armOffset, scarfOffset) {
  const awakened = lightnerState.awakenTimer > 0;
  const pulse = awakened ? 0.82 + Math.sin(lastTime * 0.03) * 0.18 : 0.62 + Math.sin(lastTime * 0.014) * 0.12;
  const palette = getLightnerSkinPalette();
  const spark = (alpha) => `rgba(${palette.lightningRgb}, ${alpha})`;
  const awakenSpark = (alpha) => `rgba(${palette.awakenRgb}, ${alpha})`;
  const r = (dx, dy, dw, dh) => ctx.fillRect(dx * 2, dy * 2, dw * 2, dh * 2);
  ctx.save();

  ctx.fillStyle = palette.hood;
  r(7, 2, 12, 6);
  r(6, 6, 14, 4);
  ctx.fillStyle = palette.coat;
  r(5, 8, 16, 9);
  ctx.fillStyle = palette.coatDark;
  r(8, 8, 10, 5);
  ctx.fillStyle = palette.mask;
  r(9, 10, 8, 7);
  ctx.fillStyle = spark(pulse);
  r(11, 11, 2, 2);
  r(16, 11, 2, 2);
  r(13, 15, 4, 1);

  ctx.fillStyle = palette.pants;
  r(5, 17, 17, 10);
  ctx.fillStyle = palette.coatDark;
  r(6, 18, 15, 4);
  r(8, 22, 11, 2);
  ctx.fillStyle = spark(0.85 * pulse);
  r(9, 18, 1, 4);
  r(13, 18, 1, 7);
  r(17, 18, 2, 1);
  r(18, 18 + scarfOffset, 5, 2);
  r(20, 20 + scarfOffset, 3, 1);

  ctx.fillStyle = palette.pants;
  r(4, 27, 7, 4 + legOffset);
  r(15, 27, 7, 4 + (2 - legOffset));
  ctx.fillStyle = spark(0.72 * pulse);
  r(6, 28, 2, 1);
  r(17, 28, 2, 1);

  ctx.fillStyle = palette.arm;
  r(2, 19 + armOffset, 2, 8);
  r(22, 19 - armOffset, 2, 8);
  ctx.fillStyle = spark(0.78 * pulse);
  r(3, 20 + armOffset, 1, 4);
  r(22, 20 - armOffset, 1, 4);

  if (shopState.equippedSkin === "angelDemon") {
    ctx.fillStyle = "#f0e7da";
    r(6, 18, 5, 5);
    ctx.fillStyle = "#3b235c";
    r(16, 18, 5, 5);
    ctx.fillStyle = spark(0.74 * pulse);
    r(13, 18, 1, 7);
    r(17, 18, 2, 1);
  }

  if (awakened) {
    ctx.fillStyle = awakenSpark(0.28 + pulse * 0.2);
    r(3, 5, 2, 2);
    r(20, 6, 2, 2);
    r(11, 2, 1, 3);
    r(18, 15, 3, 1);
  }
  drawPlayerSkinAccent();
  ctx.restore();
}

function drawFrozenPlayerEffect() {
  if (level.theme !== "frozen") {
    return;
  }
  const coldStage = frozenPressureLevel();
  const breathX = player.facing > 0 ? player.x + player.w + 6 : player.x - 14;
  const breathY = player.y + 8 + Math.sin(player.animationTime * 3) * 2;
  ctx.fillStyle = "rgba(223, 250, 255, 0.38)";
  ctx.fillRect(breathX, breathY, 10, 5);
  ctx.fillRect(breathX + player.facing * 8, breathY - 3, 8, 4);

  if (coldStage >= 3 || player.frostSlowTimer > 0) {
    const alpha = coldStage >= 3 ? 0.42 : 0.26;
    ctx.strokeStyle = `rgba(173, 241, 255, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.strokeRect(player.x - 2, player.y - 2, player.w + 4, player.h + 4);
    ctx.fillStyle = `rgba(218, 252, 255, ${alpha * 0.5})`;
    ctx.fillRect(player.x + 4, player.y + 3, 6, 2);
    ctx.fillRect(player.x + player.w - 10, player.y + 14, 7, 2);
  }
}

function drawChangerClone() {
  if (!changerState.clone) {
    return;
  }

  const clone = changerState.clone;
  const frame = Math.floor((clone.animationTime || lastTime * 0.001) * 10) % 2;
  const legOffset = clone.state === "run" ? (frame === 0 ? 0 : 2) : clone.state === "jump" ? 1 : 0;
  const armOffset = clone.state === "run" ? (frame === 0 ? 2 : -1) : clone.state === "jump" ? -2 : 0;
  const scarfOffset = clone.state === "jump" ? -2 : frame;

  ctx.save();
  if ((clone.facing || 1) < 0) {
    ctx.translate(clone.x + clone.w + 2, clone.y - 5);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(clone.x - 2, clone.y - 5);
  }
  ctx.scale(PLAYER_SPRITE_RENDER_SCALE, PLAYER_SPRITE_RENDER_SCALE);
  drawChangerPlayerSprite(legOffset, armOffset, scarfOffset, true);
  ctx.restore();
}

function drawChangerPlayerSprite(legOffset, armOffset, scarfOffset, isClone) {
  const angelDemonSkin = isChangerAngelDemonSkinEquipped();
  const cyberSkin = isCyberSkinEquipped();
  const voidSkin = isVoidKingSkinEquipped();
  const simpleSkin = getSimpleSkinPalette();
  const voidPulse = 0.8 + Math.sin(lastTime * 0.011 + (isClone ? 1.2 : 0)) * 0.2;
  const borderColor = angelDemonSkin
    ? (isClone ? "#6f2fc7" : "#d2a24b")
    : voidSkin
      ? (isClone ? "#351117" : "#09090b")
    : simpleSkin
      ? simpleSkin.dark
    : cyberSkin
      ? (isClone ? "#5a2cc8" : "#12182d")
    : (isClone ? "#ff8a4c" : "#173d77");
  const hoodColor = angelDemonSkin
    ? (isClone ? "#4d285f" : "#f3efe6")
    : voidSkin
      ? (isClone ? "#240b11" : "#0f0f13")
    : simpleSkin
      ? simpleSkin.primary
    : cyberSkin
      ? (isClone ? "#18122f" : "#090c16")
    : (isClone ? "#4079ff" : "#ff8a39");
  const glowColor = angelDemonSkin
    ? (isClone ? "#d44dff" : "#ffe6a8")
    : voidSkin
      ? (isClone ? `rgba(214, 72, 84, ${voidPulse})` : `rgba(255, 74, 74, ${voidPulse})`)
    : simpleSkin
      ? simpleSkin.glow
    : cyberSkin
      ? (isClone ? "#bd78ff" : "#6ce1ff")
    : (isClone ? "#8bc6ff" : "#ffd24d");
  const bodyColor = angelDemonSkin
    ? (isClone ? "#3d213f" : "#f5f2ec")
    : voidSkin
      ? (isClone ? "#31131d" : "#15151c")
    : simpleSkin
      ? simpleSkin.secondary
    : cyberSkin
      ? (isClone ? "#2a2354" : "#181c35")
    : (isClone ? "#3455bf" : "#24314f");
  const darkBodyColor = angelDemonSkin
    ? (isClone ? "#201222" : "#b89f66")
    : voidSkin
      ? (isClone ? "#18070c" : "#060608")
    : simpleSkin
      ? simpleSkin.dark
    : cyberSkin
      ? (isClone ? "#140f2a" : "#070913")
    : (isClone ? "#20357f" : "#111724");
  const eyeColor = angelDemonSkin
    ? (isClone ? "#ff7ac7" : "#6eb6ff")
    : voidSkin
      ? (isClone ? "#ff626c" : "#ff3939")
    : simpleSkin
      ? simpleSkin.glow
    : cyberSkin
      ? (isClone ? "#de8dff" : "#88f0ff")
    : (isClone ? "#b9ecff" : "#fff3de");
  const trimColor = angelDemonSkin
    ? (isClone ? "#a834e1" : "#caa14d")
    : voidSkin
      ? "#5b0f16"
    : simpleSkin
      ? simpleSkin.accent
    : cyberSkin
      ? glowColor
    : hoodColor;
  const r = (dx, dy, dw, dh) => ctx.fillRect(dx * 2, dy * 2, dw * 2, dh * 2);

  ctx.save();
  ctx.globalAlpha = isClone ? 0.76 : 1;

  if (player.state === "stun" && !isClone) {
    ctx.fillStyle = borderColor;
    r(4, 2, 18, 28);
    ctx.fillStyle = hoodColor;
    r(7, 4, 12, 8);
    ctx.fillStyle = bodyColor;
    r(7, 12, 12, 11);
    ctx.fillStyle = darkBodyColor;
    r(8, 23, 10, 4);
    ctx.fillStyle = eyeColor;
    r(11, 10, 6, 2);
    if (angelDemonSkin) {
      ctx.fillStyle = isClone ? "#d65bff" : "#e6ca77";
      r(9, 2, 2, 3);
      r(17, 2, 2, 3);
      r(12, 1, 3, 2);
    } else if (voidSkin) {
      ctx.fillStyle = "#191920";
      r(6, 4, 2, 4);
      r(18, 4, 2, 4);
      r(7, 3, 3, 2);
      r(16, 3, 3, 2);
    }
    drawPlayerSkinAccent();
    ctx.restore();
    return;
  }

  ctx.fillStyle = borderColor;
  r(4, 2, 18, 28);
  r(6, 0, 14, 4);
  ctx.fillStyle = hoodColor;
  r(8, 4, 10, 8);
  r(7, 8, 12, 5);
  ctx.fillStyle = darkBodyColor;
  r(9, 9, 8, 8);
  ctx.fillStyle = bodyColor;
  r(6, 16, 14, 10);
  ctx.fillStyle = angelDemonSkin
    ? (isClone ? "#6f3b7e" : "#e9e2d7")
    : voidSkin
      ? (isClone ? "#4b1823" : "#24242c")
    : simpleSkin
      ? simpleSkin.primary
    : cyberSkin
      ? (isClone ? "#443891" : "#22284f")
    : (isClone ? "#5a84dd" : "#314b76");
  r(8, 17, 10, 3);
  ctx.fillStyle = glowColor;
  r(18, 17 + scarfOffset, 4, 3);
  r(5, 20, 2, 3);
  ctx.fillStyle = trimColor;
  r(6, 26, 5, 4 + legOffset);
  r(15, 26, 5, 4 + (2 - legOffset));
  ctx.fillStyle = angelDemonSkin
    ? (isClone ? "#8b5cb7" : "#f0d8b1")
    : voidSkin
      ? "#3c0c12"
    : simpleSkin
      ? simpleSkin.accent
    : (isClone ? "#9fc1ff" : "#f4c9a3");
  r(4, 18 + armOffset, 2, 8);
  r(20, 18 - armOffset, 2, 8);
  ctx.fillStyle = eyeColor;
  r(11, 11, 2, 2);
  r(16, 11, 2, 2);
  ctx.fillStyle = "#ffffff";
  r(12, 11, 1, 1);
  r(17, 11, 1, 1);
  ctx.fillStyle = isClone ? "#081b4b" : "#070d1a";
  r(12, 12, 5, 1);
  ctx.fillStyle = glowColor;
  r(9, 16, 1, 10);
  r(17, 16, 1, 9);
  r(10, 19, 7, 1);
  if (cyberSkin) {
    ctx.fillStyle = glowColor;
    r(10, 17, 1, 8);
    r(15, 17, 1, 8);
    r(11, 20, 4, 1);
    r(8, 8, 1, 6);
    r(17, 8, 1, 6);
  }
  if (voidSkin) {
    ctx.fillStyle = glowColor;
    r(10, 17, 1, 8);
    r(15, 17, 1, 8);
    r(11, 20, 4, 1);
    r(7, 9, 1, 7);
    r(18, 9, 1, 7);
  }
  if (angelDemonSkin) {
    ctx.fillStyle = isClone ? "#9129cf" : "#dcb661";
    r(12, 2, 3, 2);
    if (isClone) {
      r(7, 4, 2, 4);
      r(17, 4, 2, 4);
    } else {
      r(5, 10, 2, 10);
      r(19, 10, 2, 10);
    }
  }

  if (isClone) {
    ctx.fillStyle = angelDemonSkin
      ? "rgba(176, 86, 255, 0.85)"
      : cyberSkin
        ? "rgba(167, 101, 255, 0.8)"
        : "rgba(118, 204, 255, 0.85)";
    r(2, 29, 22, 2);
    if (angelDemonSkin) {
      ctx.fillStyle = "rgba(222, 118, 255, 0.75)";
      r(1, 8, 3, 12);
      r(22, 8, 3, 12);
      r(0, 12, 3, 8);
      r(23, 12, 3, 8);
    } else if (voidSkin) {
      ctx.fillStyle = `rgba(58, 8, 12, ${0.75 * voidPulse})`;
      r(1, 28, 24, 3);
    }
  } else {
    if (player.cloneTransferFlash > 0) {
      ctx.fillStyle = `rgba(132, 214, 255, ${Math.min(0.55, player.cloneTransferFlash)})`;
      r(1, 0, 24, 31);
    }
    if (angelDemonSkin) {
      ctx.fillStyle = "rgba(255, 236, 176, 0.9)";
      r(0, 9, 4, 12);
      r(22, 9, 4, 12);
      r(1, 6, 3, 10);
      r(22, 6, 3, 10);
      ctx.fillStyle = "rgba(206, 176, 94, 0.75)";
      r(11, 1, 4, 3);
      r(9, 3, 2, 2);
      r(15, 3, 2, 2);
    } else if (voidSkin) {
      ctx.fillStyle = "#1a1a20";
      r(4, 6, 3, 10);
      r(19, 6, 3, 10);
      r(2, 8, 3, 10);
      r(21, 8, 3, 10);
    }
    drawPlayerSkinAccent();
  }
  ctx.restore();
}

function drawChangerSwapEffect() {
  if (changerState.effectTimer <= 0 || !changerState.effectFrom || !changerState.effectTo) {
    return;
  }

  const alpha = changerState.effectTimer / CHANGER_RULES.effectDuration;
  const positions = [changerState.effectFrom, changerState.effectTo];
  const outerColor = isChangerAngelDemonSkinEquipped() ? "#f3c66b" : "#7cc8ff";
  const innerColor = isChangerAngelDemonSkinEquipped() ? "#a94eff" : "#ff9c59";
  for (const pos of positions) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha * 0.55);
    ctx.strokeStyle = outerColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(pos.x - 6, pos.y - 6, player.w + 12, player.h + 12);
    ctx.strokeStyle = innerColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(pos.x - 2, pos.y - 2, player.w + 4, player.h + 4);
    ctx.restore();
  }
}

function getGuardianPalette() {
  if (shopState.equippedSkin === "overgearB08") {
    return {
      border: "#241915",
      hood: "#8f5d32",
      cloak: "#5e3a24",
      cloth: "#6d4224",
      metal: "#8a8175",
      trim: "#b88745",
      glow: "#8fefff",
    };
  }
  if (shopState.equippedSkin === "admin") {
    return {
      border: "#441214",
      hood: "#e0d3b0",
      cloak: "#8b1f22",
      cloth: "#a12a2d",
      metal: "#6e6460",
      trim: "#d6a233",
      glow: "#ffe28a",
    };
  }
  if (shopState.equippedSkin === "angelDemon") {
    return {
      border: "#5a4822",
      hood: "#f6f2ea",
      cloak: "#e7e0d2",
      cloth: "#ffffff",
      metal: "#d0c7b7",
      trim: "#e1b95a",
      glow: "#8dd8ff",
    };
  }
  if (shopState.equippedSkin === "cyber") {
    return {
      border: "#12172c",
      hood: "#090c14",
      cloak: "#37276f",
      cloth: "#171c35",
      metal: "#444f6d",
      trim: "#7a4fff",
      glow: "#69e2ff",
    };
  }
  if (shopState.equippedSkin === "desert") {
    return {
      border: "#4c3725",
      hood: "#c89256",
      cloak: "#8d6236",
      cloth: "#a97744",
      metal: "#b9aa8b",
      trim: "#e6c58a",
      glow: "#fff0c8",
    };
  }
  if (shopState.equippedSkin === "forest") {
    return {
      border: "#1d3524",
      hood: "#4f8a57",
      cloak: "#355f3c",
      cloth: "#426f49",
      metal: "#89937f",
      trim: "#9fc47d",
      glow: "#dff2c7",
    };
  }
  if (shopState.equippedSkin === "stone") {
    return {
      border: "#313740",
      hood: "#8f98a4",
      cloak: "#67707b",
      cloth: "#7b8490",
      metal: "#c9d0d8",
      trim: "#dbe2e8",
      glow: "#eef3f7",
    };
  }
  if (shopState.equippedSkin === "voidKing") {
    return {
      border: "#09090b",
      hood: "#121217",
      cloak: "#14080b",
      cloth: "#1d1c24",
      metal: "#3a3942",
      trim: "#5a1017",
      glow: "#ff4a4a",
    };
  }
  return {
    border: "#23324c",
    hood: "#6b4b32",
    cloak: "#214b9b",
    cloth: "#2d68bf",
    metal: "#90939b",
    trim: "#d6a233",
    glow: "#7fc3ff",
  };
}

function drawGuardianPlayerSprite(legOffset, armOffset) {
  const palette = getGuardianPalette();
  const voidSkin = isVoidKingSkinEquipped();
  const voidPulse = 0.78 + Math.sin(lastTime * 0.012) * 0.18;
  const shieldGlow = player.guardianShieldTimer > 0 ? 0.85 : player.guardianFlash > 0 ? 0.55 : 0;
  const r = (dx, dy, dw, dh) => ctx.fillRect(dx * 2, dy * 2, dw * 2, dh * 2);

  ctx.save();

  if (shieldGlow > 0) {
    ctx.fillStyle = `rgba(86, 172, 255, ${shieldGlow * 0.45})`;
    r(1, 0, 24, 31);
    ctx.strokeStyle = `rgba(102, 192, 255, ${shieldGlow})`;
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 48, 60);
  }

  ctx.fillStyle = palette.border;
  r(6, 2, 14, 28);
  r(5, 7, 16, 4);
  ctx.fillStyle = palette.hood;
  r(8, 4, 10, 8);
  r(7, 8, 12, 4);
  ctx.fillStyle = voidSkin ? "#060608" : "#1a2234";
  r(9, 10, 8, 8);
  ctx.fillStyle = voidSkin ? `rgba(255, 76, 76, ${voidPulse})` : "#efe7d8";
  r(11, 11, 2, 2);
  r(15, 11, 2, 2);
  ctx.fillStyle = palette.glow;
  r(12, 11, 1, 1);
  r(16, 11, 1, 1);
  ctx.fillStyle = palette.metal;
  r(7, 16, 12, 10);
  r(5, 17, 3, 8);
  r(18, 17, 3, 8);
  ctx.fillStyle = palette.cloth;
  r(10, 17, 6, 8);
  ctx.fillStyle = palette.trim;
  r(9, 17, 1, 8);
  r(16, 17, 1, 8);
  r(11, 19, 4, 2);
  ctx.fillStyle = palette.cloak;
  r(3, 14 + armOffset, 4, 12);
  r(4, 23, 3, 5);
  ctx.fillStyle = palette.trim;
  r(3, 15 + armOffset, 1, 9);
  ctx.fillStyle = palette.metal;
  r(4, 18 + armOffset, 2, 7);

  ctx.fillStyle = palette.border;
  r(16, 15, 8, 15);
  r(15, 14, 10, 3);
  ctx.fillStyle = palette.trim;
  r(17, 16, 6, 13);
  ctx.fillStyle = voidSkin ? "#16161c" : "#254d9e";
  r(18, 17, 4, 11);
  ctx.fillStyle = palette.glow;
  r(19, 19, 2, 7);
  r(18, 22, 4, 1);
  if (shopState.equippedSkin === "cyber") {
    ctx.fillStyle = "#9d8bff";
    r(10, 10, 1, 8);
    r(15, 10, 1, 8);
    r(11, 20, 4, 1);
  } else if (voidSkin) {
    ctx.fillStyle = `rgba(205, 38, 44, ${0.54 + Math.sin(lastTime * 0.013) * 0.1})`;
    r(10, 10, 1, 8);
    r(15, 10, 1, 8);
    r(11, 20, 4, 1);
    r(18, 17, 1, 11);
  }

  ctx.fillStyle = palette.metal;
  r(7, 26, 4, 5 + legOffset);
  r(14, 26, 4, 5 + (2 - legOffset));
  ctx.fillStyle = palette.border;
  r(7, 30, 4, 2);
  r(14, 30, 4, 2);

  if (shopState.equippedSkin === "angelDemon") {
    ctx.fillStyle = "rgba(255, 238, 182, 0.85)";
    r(4, 7, 2, 10);
    r(21, 7, 2, 10);
    ctx.fillStyle = "rgba(223, 194, 112, 0.75)";
    r(11, 1, 4, 2);
  } else if (voidSkin) {
    ctx.fillStyle = "#1a1a20";
    r(4, 7, 2, 10);
    r(21, 7, 2, 10);
    r(3, 9, 2, 8);
    r(22, 9, 2, 8);
  }

  drawPlayerSkinAccent();
  ctx.restore();
}

function drawAssassinPlayerSprite(legOffset, armOffset, cloakOffset) {
  const alpha = player.stealthActive ? 0.34 : 1;
  const simpleSkin = getSimpleSkinPalette();
  const cyberSkin = isCyberSkinEquipped();
  const voidSkin = isVoidKingSkinEquipped();
  const voidPulse = 0.8 + Math.sin(lastTime * 0.014) * 0.2;
  const r = (dx, dy, dw, dh) => ctx.fillRect(dx * 2, dy * 2, dw * 2, dh * 2);
  ctx.save();
  ctx.globalAlpha = alpha;

  if (player.state === "stun") {
    ctx.fillStyle = voidSkin ? "#060608" : simpleSkin ? simpleSkin.dark : "#090d16";
    r(7, 5, 12, 8);
    ctx.fillStyle = voidSkin ? "#121218" : simpleSkin ? simpleSkin.secondary : "#161d2c";
    r(5, 14, 16, 10);
    ctx.fillStyle = voidSkin ? "#1f1d24" : simpleSkin ? simpleSkin.primary : "#28344c";
    r(6, 24, 14, 4);
    ctx.fillStyle = voidSkin ? `rgba(255, 70, 70, ${voidPulse})` : simpleSkin ? simpleSkin.glow : "#7fd0ff";
    r(12, 10, 2, 2);
    r(16, 10, 2, 2);
    ctx.fillStyle = voidSkin ? "#ffb0b0" : simpleSkin ? simpleSkin.accent : "#b8f0ff";
    r(13, 10, 1, 1);
    r(17, 10, 1, 1);
    ctx.fillStyle = voidSkin ? "#09090b" : simpleSkin ? simpleSkin.dark : "#0c1220";
    r(6, 28, 5, 2);
    r(15, 28, 5, 2);
    drawPlayerSkinAccent();
    ctx.restore();
    return;
  }

  if (player.crouching && level.theme === "arcade") {
    ctx.fillStyle = "#090d16";
    r(8, 7, 10, 7);
    ctx.fillStyle = "#161d2c";
    r(5, 14, 16, 10);
    ctx.fillStyle = "#2c3750";
    r(6, 22, 14, 4);
    ctx.fillStyle = "#87e5ff";
    r(12, 11, 2, 2);
    r(16, 11, 2, 2);
    ctx.fillStyle = "#0c1220";
    r(6, 26, 5, 2);
    r(15, 26, 5, 2);
    ctx.fillStyle = "#8fe7ff";
    r(4, 17, 2, 7);
    r(20, 17, 2, 7);
    drawPlayerSkinAccent();
    ctx.restore();
    return;
  }

  ctx.fillStyle = voidSkin ? "#050507" : simpleSkin ? simpleSkin.dark : cyberSkin ? "#05070e" : "#060910";
  r(7, 2, 12, 7);
  r(8, 0, 9, 3);
  r(6, 7, 14, 4);
  ctx.fillStyle = voidSkin ? "#0d0d12" : simpleSkin ? simpleSkin.primary : cyberSkin ? "#0d1220" : "#111724";
  r(7, 10, 12, 6);
  ctx.fillStyle = voidSkin ? "#17161d" : simpleSkin ? simpleSkin.secondary : cyberSkin ? "#151a31" : "#202a3c";
  r(6, 16, 14, 10);
  ctx.fillStyle = voidSkin ? "#221f27" : simpleSkin ? simpleSkin.primary : cyberSkin ? "#20264a" : "#2d3851";
  r(7, 20, 12, 4);
  ctx.fillStyle = voidSkin ? "#5b0f17" : simpleSkin ? simpleSkin.accent : cyberSkin ? "#2d3470" : "#34415f";
  r(8, 16, 10, 3);
  ctx.fillStyle = voidSkin ? "#0b0b0e" : simpleSkin ? simpleSkin.dark : cyberSkin ? "#080b14" : "#09101d";
  r(9, 11, 8, 3);
  ctx.fillStyle = voidSkin ? "#7a141c" : simpleSkin ? simpleSkin.glow : cyberSkin ? "#77efff" : "#62d9ff";
  r(11, 17, 1, 9);
  r(16, 17, 1, 8);
  ctx.fillStyle = voidSkin ? `rgba(255, 66, 66, ${voidPulse})` : simpleSkin ? simpleSkin.glow : cyberSkin ? "#77efff" : "#62d9ff";
  r(10, 8, 4, 1);
  r(15, 8, 4, 1);
  r(12, 9, 2, 2);
  r(16, 9, 2, 2);
  ctx.fillStyle = voidSkin ? "#ffc0c0" : simpleSkin ? simpleSkin.accent : cyberSkin ? "#ddb5ff" : "#baf4ff";
  r(13, 9, 1, 1);
  r(17, 9, 1, 1);
  ctx.fillStyle = voidSkin ? "#430c13" : simpleSkin ? simpleSkin.secondary : cyberSkin ? "#6c4fff" : "#394766";
  r(4, 18 + armOffset, 2, 8);
  r(20, 18 - armOffset, 2, 8);
  ctx.fillStyle = voidSkin ? "#08080a" : simpleSkin ? simpleSkin.dark : cyberSkin ? "#070a14" : "#0a0f1c";
  r(6, 26, 5, 4 + legOffset);
  r(15, 26, 5, 4 + (2 - legOffset));
  ctx.fillStyle = voidSkin ? "#2f0b10" : simpleSkin ? simpleSkin.accent : cyberSkin ? "#9d67ff" : "#84f0ff";
  r(19, 16 + cloakOffset, 4, 7);
  ctx.fillStyle = voidSkin ? "#26080c" : simpleSkin ? simpleSkin.secondary : cyberSkin ? "#3a4dd5" : "#405070";
  r(5, 19, 2, 4);
  ctx.fillStyle = voidSkin ? `rgba(200, 35, 40, ${0.55 + Math.sin(lastTime * 0.016) * 0.12})` : simpleSkin ? simpleSkin.glow : cyberSkin ? "#78efff" : "#d7f9ff";
  r(5, 20 + armOffset, 1, 4);
  if (cyberSkin) {
    ctx.fillStyle = "#78efff";
    r(10, 17, 1, 8);
    r(15, 17, 1, 8);
    r(11, 20, 4, 1);
  } else if (voidSkin) {
    ctx.fillStyle = `rgba(200, 35, 40, ${0.58 + Math.sin(lastTime * 0.016) * 0.12})`;
    r(10, 17, 1, 8);
    r(15, 17, 1, 8);
    r(11, 20, 4, 1);
    r(7, 8, 1, 6);
    r(18, 8, 1, 6);
  }
  drawPlayerSkinAccent();
  ctx.restore();
}

function drawPlayerSkinAccent() {
  const r = (dx, dy, dw, dh) => ctx.fillRect(dx * 2, dy * 2, dw * 2, dh * 2);

  if (shopState.equippedSkin === "overgearB08") {
    const awakened = isAwakenedStateActive();
    const outage = overgearElectricState.outageTimer > 0 && !awakened;
    const noise = overgearElectricState.noiseTimer > 0 && !awakened;
    const weakFlicker = 0.72 + Math.sin(lastTime * 0.041) * 0.12 + (Math.sin(lastTime * 0.127) > 0.72 ? 0.1 : -0.06);
    const pulse = awakened ? 1 : Math.max(0.42, Math.min(0.92, weakFlicker));
    const electricAlpha = outage ? 0 : awakened ? 0.95 : pulse;
    const sparkColor = (alpha) => `rgba(143, 239, 255, ${alpha})`;

    ctx.fillStyle = "#6d4224";
    r(6, 3, 14, 2);
    r(4, 17, 18, 2);
    r(8, 25, 11, 2);
    ctx.fillStyle = "#b88745";
    r(7, 2, 3, 2);
    r(16, 3, 3, 2);
    r(6, 18, 2, 7);
    r(18, 18, 2, 7);
    ctx.fillStyle = "#3a2319";
    r(5, 29, 17, 2);

    if (outage) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      r(1, 0, 24, 31);
      ctx.fillStyle = "#241915";
      r(11, 11, 2, 2);
      r(16, 11, 2, 2);
      r(9, 18, 1, 4);
      r(13, 18, 1, 7);
      r(17, 18, 2, 1);
      r(18, 18, 5, 3);
      r(6, 28, 2, 1);
      r(17, 28, 2, 1);
      r(3, 20, 1, 4);
      r(22, 20, 1, 4);
      ctx.fillStyle = "#3a2319";
      r(12, 18, 3, 2);
      return;
    }

    ctx.fillStyle = sparkColor(0.45 * electricAlpha);
    r(9, 10, 9, 4);
    r(10, 17, 7, 5);
    ctx.fillStyle = sparkColor(electricAlpha);
    r(11, 11, 2, 2);
    r(16, 11, 2, 2);
    r(12, 18, 3, 2);
    r(13, 20, 1, 4);
    r(3, 20, 2, 2);
    r(21, 20, 2, 2);
    r(6, 27, 2, 2);
    r(17, 27, 2, 2);
    ctx.fillStyle = sparkColor((awakened ? 0.62 : 0.34) * electricAlpha);
    r(2, 19, 1, 5);
    r(23, 18, 1, 5);
    r(8, 28, 4, 1);
    r(15, 28, 4, 1);

    if (awakened || noise) {
      const noiseAlpha = awakened ? 0.88 : overgearElectricState.noiseTimer / OVERGEAR_ELECTRIC_NOISE_DURATION;
      ctx.fillStyle = sparkColor(0.72 * noiseAlpha);
      r(6, 8, 1, 2);
      r(19, 7, 1, 3);
      r(9, 15, 1, 3);
      r(17, 15, 1, 3);
      r(5, 24, 3, 1);
      r(18, 24, 3, 1);
      ctx.fillStyle = sparkColor(0.34 * noiseAlpha);
      r(1, 6, 2, 12);
      r(23, 7, 2, 11);
    }
    return;
  }

  if (shopState.equippedSkin === "voidKing") {
    const pulse = 0.6 + Math.sin(lastTime * 0.015) * 0.16;
    ctx.fillStyle = `rgba(210, 30, 40, ${pulse})`;
    r(11, 9, 1, 6);
    r(17, 9, 1, 6);
    r(12, 18, 2, 7);
    r(14, 18, 2, 7);
    r(10, 21, 8, 1);
    ctx.fillStyle = `rgba(52, 8, 12, ${0.72 + Math.sin(lastTime * 0.012) * 0.08})`;
    r(2, 30, 22, 2);
    return;
  }

  if (shopState.equippedSkin === "cyber") {
    ctx.fillStyle = "#77eaff";
    r(11, 9, 1, 6);
    r(17, 9, 1, 6);
    r(12, 18, 2, 7);
    ctx.fillStyle = "#9d67ff";
    r(14, 18, 2, 7);
    r(10, 21, 8, 1);
    return;
  }

  if (shopState.equippedSkin !== "admin") {
    return;
  }

  ctx.fillStyle = "#d3901d";
  r(6, -1, 14, 3);
  r(7, -3, 2, 2);
  r(12, -5, 2, 4);
  r(17, -3, 2, 2);

  ctx.fillStyle = "#ffd95e";
  r(8, -4, 2, 3);
  r(11, -6, 4, 5);
  r(16, -4, 2, 3);

  ctx.fillStyle = "#fff7b3";
  r(12, -5, 2, 1);
}

function drawGoal() {
  const palette = getThemeColors();
  const { x, y, h } = level.goal;
  if (level.theme === "factory") {
    const doorOpen = collectedCount >= currentShardTarget();
    const pulse = 0.7 + Math.sin(lastTime * 0.008) * 0.18;

    ctx.fillStyle = "#313640";
    ctx.fillRect(x + 6, y, 52, h);
    ctx.fillStyle = "#1f232a";
    ctx.fillRect(x + 10, y + 6, 44, h - 12);

    if (doorOpen) {
      ctx.fillStyle = "rgba(255, 224, 122, 0.18)";
      ctx.fillRect(x + 18, y + 12, 28, h - 24);
      ctx.fillStyle = "rgba(255, 239, 180, 0.28)";
      ctx.fillRect(x + 24, y + 16, 16, h - 32);
    } else {
      ctx.fillStyle = "#5a606a";
      ctx.fillRect(x + 12, y + 8, 40, h - 16);
      ctx.fillStyle = "#464c55";
      for (let i = 0; i < 5; i += 1) {
        ctx.fillRect(x + 15, y + 14 + i * 26, 34, 8);
      }
    }

    ctx.fillStyle = "#2d3139";
    ctx.fillRect(x - 20, y + h - 36, 22, 28);
    ctx.fillStyle = doorOpen ? `rgba(255, 224, 122, ${0.65 * pulse})` : "rgba(247, 90, 70, 0.65)";
    ctx.fillRect(x - 16, y + h - 30, 14, 10);
    ctx.strokeStyle = doorOpen ? `rgba(255, 224, 122, ${0.8 * pulse})` : "rgba(247, 120, 90, 0.8)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 9, y + h - 20);
    ctx.lineTo(x + 10, doorOpen ? y + h - 38 : y + h - 10);
    ctx.stroke();
    return;
  }

  if (level.theme === "frozen") {
    const doorOpen = isFrostWardenDefeated();
    const pulse = 0.7 + Math.sin(lastTime * 0.008) * 0.18;
    ctx.fillStyle = "#10243a";
    ctx.fillRect(x + 6, y, 52, h);
    ctx.fillStyle = doorOpen ? "rgba(108, 235, 255, 0.26)" : "rgba(22, 60, 92, 0.88)";
    ctx.fillRect(x + 14, y + 10, 36, h - 20);
    ctx.fillStyle = doorOpen ? `rgba(154, 244, 255, ${0.5 * pulse})` : "rgba(190, 238, 255, 0.32)";
    for (let i = 0; i < 5; i += 1) {
      ctx.fillRect(x + 18, y + 18 + i * 24, 28, 4);
    }
    ctx.fillStyle = doorOpen ? `rgba(126, 238, 255, ${0.65 * pulse})` : "rgba(75, 149, 190, 0.72)";
    ctx.beginPath();
    ctx.arc(x + 56, y + 18, 9, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (level.theme === "jungle") {
    drawJungleMonkey();
    return;
  }

  if (level.theme === "arcade") {
    const pulse = 0.7 + Math.sin(lastTime * 0.008) * 0.18;

    // Claw machine cabinet
    ctx.fillStyle = "rgba(10, 8, 18, 0.95)";
    ctx.fillRect(x + 6, y + 6, 56, h - 6);
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.fillRect(x + 10, y + 10, 48, 44);

    // Glass + neon trim
    ctx.strokeStyle = `rgba(69, 248, 255, ${0.55 * pulse})`;
    ctx.lineWidth = 4;
    ctx.strokeRect(x + 6, y + 6, 56, h - 6);
    ctx.strokeStyle = `rgba(255, 77, 245, ${0.42 * pulse})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 12, y + 12, 44, 32);

    // Prize plush blocks
    for (let i = 0; i < 6; i += 1) {
      ctx.fillStyle = i % 2 === 0 ? "rgba(255, 214, 92, 0.55)" : "rgba(167, 255, 112, 0.45)";
      ctx.fillRect(x + 16 + (i % 3) * 14, y + 18 + Math.floor(i / 3) * 14, 10, 10);
    }

    // Control panel + lever light
    ctx.fillStyle = `rgba(255, 77, 245, ${0.18 * pulse})`;
    ctx.fillRect(x + 12, y + h - 34, 44, 16);
    ctx.fillStyle = palette.goal;
    ctx.beginPath();
    ctx.arc(x + 58, y + h - 26, 8, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = "#5d4632";
    ctx.fillRect(x + 12, y, 8, h);
    ctx.fillStyle = palette.goal;
    ctx.fillRect(x + 20, y + 10, 28, 18);
    ctx.fillStyle = "#dff9ff";
    ctx.fillRect(x + 26, y + 14, 10, 6);
    ctx.fillStyle = "#ffe66d";
    ctx.beginPath();
    ctx.arc(x + 52, y + 16, 10, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHud() {
  ctx.fillStyle = "rgba(7, 19, 33, 0.75)";
  ctx.fillRect(16, 16, 410, 136);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
  ctx.strokeRect(16, 16, 410, 136);

  ctx.fillStyle = "#fef8d4";
  ctx.font = "bold 22px Verdana";
  ctx.fillText(t("hud_score", { score: score.toString().padStart(5, "0") }), 30, 46);
  ctx.fillText(t("hud_lives", { lives }), 30, 76);
  ctx.fillText(t("hud_stage", { current: currentStageIndex + 1, total: STAGE_DEFS.length }), 30, 106);

  ctx.fillStyle = "#d8fbff";
  ctx.font = "16px Verdana";
  const collectibleText = level.theme === "jungle"
    ? t("hud_jungle_bananas", {
      delivered: jungleState.delivered,
      target: JUNGLE_BANANA_TARGET,
      carried: jungleState.carried,
      capacity: JUNGLE_BANANA_CAPACITY,
    })
    : level.theme === "frozen"
      ? `${currentCollectibleLabel()} ${collectedCount}`
      : `${currentCollectibleLabel()} ${collectedCount}/${currentShardTarget()}`;
  ctx.fillText(collectibleText, 190, 46);
  ctx.fillText(t("hud_difficulty", { difficulty: getDifficultyLabel(activeDifficultyKey) }), 190, 76);
  ctx.fillText(t("hud_jumps", { current: player.jumpsRemaining, total: player.maxJumps }), 190, 106);
  const stealthStatus = isChangerEquipped()
    ? changerState.clone
      ? changerState.swapCooldown > 0
        ? t("changer_status_ready_cd", { time: changerState.swapCooldown.toFixed(1) })
        : t("changer_status_ready")
      : changerState.cloneUsedThisRun
        ? t("changer_status_spent")
        : t("changer_status_prompt")
    : isGuardianEquipped()
      ? player.guardianShieldTimer > 0
        ? t("guardian_status_shield", {
          time: player.guardianShieldTimer.toFixed(1),
          state: t(player.guardianPassiveReady ? "passive_ready" : "passive_spent"),
        })
        : player.guardianShieldCooldown > 0
          ? t("guardian_status_cooldown", {
            time: player.guardianShieldCooldown.toFixed(1),
            state: t(player.guardianPassiveReady ? "passive_ready" : "passive_spent"),
          })
          : t("guardian_status_ready", {
            state: t(player.guardianPassiveReady ? "passive_ready" : "passive_spent"),
          })
    : isLightnerEquipped()
      ? t("lightner_status", {
        stacks: lightnerState.stacks,
        max: LIGHTNER_RULES.maxStacks,
        e: lightnerState.fieldCooldown.toFixed(1),
        awaken: lightnerState.awakenTimer > 0
          ? t("lightner_awaken_active", { time: lightnerState.awakenTimer.toFixed(1) })
          : lightnerState.awakenKills >= LIGHTNER_RULES.awakenKillsRequired
            ? t("lightner_awaken_ready")
            : t("lightner_awaken_charge", {
              kills: lightnerState.awakenKills,
              required: LIGHTNER_RULES.awakenKillsRequired,
            }),
      })
    : isWildHunterEquipped()
      ? t("wild_hunter_status", {
        instinct: wildHunterState.instinctTimer > 0
          ? t("wild_hunter_active", { time: wildHunterState.instinctTimer.toFixed(1) })
          : "-",
        blast: wildHunterState.blastUsed ? t("wild_hunter_used") : t("wild_hunter_ready"),
        awaken: wildHunterState.awakenTimer > 0
          ? t("wild_hunter_active", { time: wildHunterState.awakenTimer.toFixed(1) })
          : wildHunterState.awakenKills >= WILD_HUNTER_RULES.awakenKillsRequired
            ? t("wild_hunter_ready")
            : t("wild_hunter_charge", {
              kills: wildHunterState.awakenKills,
              required: WILD_HUNTER_RULES.awakenKillsRequired,
            }),
      })
    : !isAssassinEquipped()
      ? t("hud_character", { name: formatCatalogName(shopState.equippedCharacter) })
      : player.stealthActive
        ? t("assassin_status_stealth", {
          time: player.stealthTimer.toFixed(1),
          cooldown: player.assassinationCooldown.toFixed(1),
        })
        : player.stealthCooldown > 0
          ? t("assassin_status_stealth_cd", {
            time: player.stealthCooldown.toFixed(1),
            cooldown: player.assassinationCooldown.toFixed(1),
          })
          : player.assassinationCooldown > 0
            ? t("assassin_status_q_cd", { time: player.assassinationCooldown.toFixed(1) })
            : t("assassin_status_ready");
  ctx.fillText(stealthStatus, 190, 130);

  ctx.fillStyle = "#fff6ca";
  ctx.font = "bold 18px Verdana";
  ctx.fillText(level.name, 470, 40);
  if (level.theme === "factory") {
    ctx.fillText(t("hud_clock", { time: formatStageTimer(factoryTimeRemaining) }), 470, 68);
    ctx.fillText(t("hud_factory_hint"), 470, 96);
  } else if (level.theme === "frozen") {
    ctx.fillText(t("hud_clock", { time: formatStageTimer(frozenTimeRemaining) }), 470, 68);
    ctx.fillText(t("hud_frozen_warden_hint"), 470, 96);
  } else if (level.theme === "jungle") {
    ctx.fillText(t("hud_jungle_hint"), 470, 68);
    ctx.fillText(t("hud_return_lobby"), 470, 96);
  } else {
    ctx.fillText(t("hud_stage_rank", { value: stageDifficultyFactor(currentStageIndex).toFixed(1) }), 470, 68);
    ctx.fillText(t("hud_return_lobby"), 470, 96);
  }
  if (isChangerEquipped()) {
    ctx.fillText(t("changer_hint"), 470, 124);
  } else if (isGuardianEquipped()) {
    ctx.fillText(t("guardian_hint"), 470, 124);
  } else if (isAssassinEquipped()) {
    ctx.fillText(t("assassin_hint"), 470, 124);
  } else if (isLightnerEquipped()) {
    ctx.fillText(t("lightner_hint"), 470, 124);
  } else if (isWildHunterEquipped()) {
    ctx.fillText(t("wild_hunter_hint"), 470, 124);
  }

  if (stageMessageTimer > 0) {
    if (level.theme === "factory") {
      drawCenterPanel(level.name, t("stage_objective_factory", { count: currentShardTarget() }), "");
    } else if (level.theme === "frozen") {
      drawCenterPanel(level.name, t("stage_objective_frozen_warden"), "");
    } else if (level.theme === "jungle") {
      drawCenterPanel(level.name, t("stage_objective_jungle"), "");
    } else {
      drawCenterPanel(level.name, t("stage_objective_normal", { count: currentShardTarget() }), "");
    }
  }

  if (gameState === "stageclear") {
    drawCenterPanel(
      t("center_stage_clear"),
      t("center_next_stage"),
      t("center_now_entering", { name: getStageDisplayName(currentStageIndex + 1) }),
      stageClearRewardText()
    );
  } else if (gameState === "finished") {
    drawCenterPanel(t("center_all_clear"), t("center_all_clear_copy"), stageClearRewardText(), t("center_restart"));
  } else if (gameState === "gameover") {
    drawCenterPanel(t("center_game_over"), t("center_game_over_copy"), t("center_restart"));
  }
}

function drawJungleMonkey() {
  const monkey = jungleState.monkey;
  const pulse = 0.7 + Math.sin(lastTime * 0.012) * 0.18;
  const angry = monkey.angerTimer > 0;
  const attacking = monkey.attackTimer > 0;
  const x = monkey.x;
  const y = monkey.y;

  if (angry || attacking) {
    const rect = getJungleMonkeyAttackRect();
    ctx.fillStyle = attacking ? "rgba(255, 78, 54, 0.28)" : `rgba(255, 220, 65, ${0.14 + pulse * 0.08})`;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    ctx.strokeStyle = attacking ? "rgba(255, 96, 72, 0.75)" : "rgba(255, 230, 90, 0.52)";
    ctx.lineWidth = 3;
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  }

  ctx.fillStyle = "rgba(28, 48, 20, 0.5)";
  ctx.fillRect(x - 12, y + monkey.h - 3, monkey.w + 24, 8);

  ctx.strokeStyle = "#6d4326";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(x + 6, y + 28, 20, Math.PI * 0.65, Math.PI * 1.55);
  ctx.stroke();

  ctx.fillStyle = angry ? "#8d3d24" : "#7a4a28";
  ctx.fillRect(x + 8, y + 18, 30, 30);
  ctx.fillStyle = angry ? "#b75a31" : "#9a6336";
  ctx.fillRect(x + 4, y + 7, 36, 28);
  ctx.fillStyle = "#f3c68d";
  ctx.fillRect(x + 12, y + 16, 18, 14);
  ctx.fillStyle = angry ? "#ffef5f" : "#fff0bf";
  ctx.fillRect(x + 10, y + 14, 5, 5);
  ctx.fillRect(x + 28, y + 14, 5, 5);
  ctx.fillStyle = angry ? "#d82323" : "#1d130c";
  ctx.fillRect(x + 12, y + 16, 2, 2);
  ctx.fillRect(x + 30, y + 16, 2, 2);
  ctx.fillStyle = angry ? "#3a160e" : "#4b2b19";
  ctx.fillRect(x + 17, y + 27, 11, 3);

  ctx.fillStyle = "#5f351d";
  ctx.fillRect(x - 3, y + 21, 10, 22);
  ctx.fillRect(x + 37, y + 21, 10, 22);
  ctx.fillStyle = "#3a2316";
  ctx.fillRect(x + 11, y + 46, 9, 11);
  ctx.fillRect(x + 26, y + 46, 9, 11);

  if (attacking) {
    ctx.strokeStyle = "rgba(255, 230, 112, 0.82)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x + 2, y + 31);
    ctx.lineTo(x - 28, y + 26);
    ctx.lineTo(x - 64, y + 31);
    ctx.stroke();
  }

  for (let i = 0; i < Math.min(3, jungleState.delivered); i += 1) {
    drawBananaSprite(x + 8 + i * 12, y - 18, 0.75);
  }
}

function drawCenterPanel(title, line1, line2, line3) {
  ctx.fillStyle = "rgba(7, 19, 33, 0.72)";
  ctx.fillRect(180, 140, 600, line3 ? 220 : 190);
  ctx.strokeStyle = "#ffe98a";
  ctx.lineWidth = 4;
  ctx.strokeRect(180, 140, 600, line3 ? 220 : 190);
  ctx.fillStyle = "#fff6ca";
  ctx.textAlign = "center";
  ctx.font = "bold 40px Verdana";
  ctx.fillText(title, GAME_WIDTH / 2, 200);
  ctx.font = "20px Verdana";
  ctx.fillText(line1, GAME_WIDTH / 2, 242);
  if (line2) {
    ctx.fillText(line2, GAME_WIDTH / 2, 278);
  }
  if (line3) {
    ctx.fillText(line3, GAME_WIDTH / 2, 314);
  }
  ctx.textAlign = "left";
}

function render() {
  ctx.save();
  if (screenShakeTimer > 0) {
    const shake = Math.ceil(screenShakeTimer * 10);
    ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
  }
  drawBackground();
  if (assassinationEvent.active && assassinationEvent.mode === "wardenQte") {
    ctx.save();
    ctx.translate(GAME_WIDTH / 2, GAME_HEIGHT / 2);
    ctx.scale(1.08, 1.08);
    ctx.translate(-GAME_WIDTH / 2, -GAME_HEIGHT / 2);
    drawWorld();
    ctx.restore();
  } else {
    drawWorld();
  }
  drawFrozenAtmosphere();
  drawHud();
  if (assassinationEvent.active) {
    drawAssassinationOverlay();
  } else if (clawEscapeEvent.active) {
    drawClawEscapeOverlay();
  } else if (danceEvent.active || danceEvent.countdown) {
    drawDanceOverlay();
  } else if (nightmareEvent.active || nightmareEvent.countdown) {
    drawNightmareOverlay();
  }
  ctx.restore();
}

function drawFrozenAtmosphere() {
  if (level.theme !== "frozen") {
    return;
  }
  const coldStage = frozenPressureLevel();
  const blueAlpha = coldStage === 1 ? 0.04 : coldStage === 2 ? 0.13 : 0.24;
  ctx.fillStyle = `rgba(72, 166, 255, ${blueAlpha})`;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.fillStyle = "rgba(231, 252, 255, 0.66)";
  const snowCount = coldStage === 3 ? 86 : 58;
  for (let i = 0; i < snowCount; i += 1) {
    const x = (i * 73 + lastTime * 0.025 + camera.x * 0.12) % (GAME_WIDTH + 20) - 10;
    const y = (i * 41 + lastTime * (0.035 + (i % 5) * 0.004)) % (GAME_HEIGHT + 24) - 12;
    const size = 1 + (i % 3);
    ctx.fillRect(x, y, size, size);
  }

  if (coldStage >= 3) {
    ctx.strokeStyle = "rgba(218, 252, 255, 0.24)";
    ctx.lineWidth = 4;
    for (let i = 0; i < 9; i += 1) {
      const x = 40 + i * 112 + Math.sin(lastTime * 0.002 + i) * 12;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x - 38, 82);
      ctx.stroke();
    }
  }
}

function drawAssassinationOverlay() {
  const bossFight = assassinationEvent.targetType === "boss";
  const wardenFight = assassinationEvent.mode === "wardenQte";
  const panelAlpha = 0.48 + assassinationEvent.flash * 0.18;
  ctx.fillStyle = wardenFight ? `rgba(2, 10, 22, ${Math.min(0.82, panelAlpha + 0.14)})` : `rgba(4, 7, 16, ${panelAlpha})`;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  if (wardenFight && assassinationEvent.target) {
    const bounds = assassinationEvent.targetBounds || getEnemyBounds(assassinationEvent.target, assassinationEvent.target.type);
    const focusX = bounds.x + bounds.w * 0.5 - camera.x;
    const focusY = bounds.y + bounds.h * 0.45;
    if (assassinationEvent.timer <= 0.5) {
      const tension = 1 - Math.max(0, assassinationEvent.timer / 0.5);
      ctx.fillStyle = `rgba(153, 230, 255, ${0.12 + tension * 0.18})`;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
    ctx.fillStyle = "rgba(112, 229, 255, 0.2)";
    ctx.beginPath();
    ctx.ellipse(focusX, focusY, 108, 124, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(208, 252, 255, 0.52)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(focusX, focusY, 116, 132, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(10, 15, 28, 0.86)";
  ctx.fillRect(180, 146, 600, 204);
  ctx.strokeStyle = wardenFight
    ? `rgba(126, 229, 255, ${0.62 + assassinationEvent.flash * 0.22})`
    : `rgba(136, 255, 228, ${0.52 + assassinationEvent.flash * 0.2})`;
  ctx.lineWidth = 4;
  ctx.strokeRect(180, 146, 600, 204);

  ctx.fillStyle = "#f7f9ff";
  ctx.textAlign = "center";
  ctx.font = "bold 30px Verdana";
  ctx.fillText(
    wardenFight ? t("assassinate_warden_title") : assassinationEvent.mode === "backstab" ? t("assassinate_silent_kill") : t("assassinate_clash"),
    GAME_WIDTH / 2,
    188
  );
  ctx.font = "18px Verdana";
  ctx.fillStyle = "#d5efff";
  ctx.fillText(
    wardenFight
      ? t("assassinate_warden_copy")
      : assassinationEvent.mode === "backstab"
      ? t("assassinate_locking")
      : bossFight
        ? t("assassinate_boss_copy")
        : t("assassinate_enemy_copy"),
    GAME_WIDTH / 2,
    220
  );

  const meterX = 238;
  const meterY = 248;
  const meterW = 484;
  const meterH = 24;
  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  ctx.fillRect(meterX, meterY, meterW, meterH);
  ctx.fillStyle = wardenFight
    ? "rgba(107, 222, 255, 0.78)"
    : assassinationEvent.mode === "backstab" ? "rgba(136, 255, 228, 0.7)" : "rgba(255, 110, 110, 0.7)";
  const fillAmount = assassinationEvent.mode === "backstab"
    ? 1 - Math.max(0, assassinationEvent.timer / ASSASSIN_RULES.strikeWindup)
    : assassinationEvent.gauge;
  ctx.fillRect(meterX, meterY, meterW * fillAmount, meterH);
  if (wardenFight) {
    const markerX = meterX + meterW * FROST_WARDEN_QTE.successThreshold;
    ctx.fillStyle = "rgba(255, 245, 180, 0.72)";
    ctx.fillRect(markerX - 3, meterY - 7, 6, meterH + 14);
    ctx.fillStyle = "rgba(255, 110, 110, 0.56)";
    ctx.fillRect(meterX, meterY, meterW * 0.5, 3);
  }
  ctx.strokeStyle = "rgba(255, 241, 173, 0.7)";
  ctx.lineWidth = 2;
  ctx.strokeRect(meterX, meterY, meterW, meterH);

  ctx.fillStyle = "#fff5cd";
  ctx.font = "bold 22px Verdana";
  ctx.fillText(assassinationEvent.successText, GAME_WIDTH / 2, 308);
  ctx.font = "17px Verdana";
  if (assassinationEvent.mode === "qte" || wardenFight) {
    ctx.fillText(t("assassinate_time", { time: assassinationEvent.timer.toFixed(1) }), GAME_WIDTH / 2, 334);
  }
  ctx.textAlign = "left";
}

function drawClawEscapeOverlay() {
  const alpha = 0.54 + clawEscapeEvent.flash * 0.22;
  ctx.fillStyle = `rgba(7, 5, 16, ${alpha})`;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.fillStyle = "rgba(38, 8, 48, 0.24)";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.fillStyle = "rgba(7, 19, 33, 0.78)";
  ctx.fillRect(180, 130, 600, 260);
  ctx.strokeStyle = "rgba(69, 248, 255, 0.52)";
  ctx.lineWidth = 4;
  ctx.strokeRect(180, 130, 600, 260);
  ctx.strokeStyle = "rgba(255, 77, 245, 0.34)";
  ctx.lineWidth = 2;
  ctx.strokeRect(188, 138, 584, 244);

  ctx.fillStyle = "#fff5d6";
  ctx.textAlign = "center";
  ctx.font = "bold 34px Verdana";
  ctx.fillText(t("claw_title"), GAME_WIDTH / 2, 176);
  ctx.font = "18px Verdana";
  ctx.fillStyle = "#d8fbff";
  ctx.fillText(t("claw_copy"), GAME_WIDTH / 2, 206);

  // Meter
  const meterX = 250;
  const meterY = 232;
  const meterW = 460;
  const meterH = 20;
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(meterX, meterY, meterW, meterH);
  ctx.fillStyle = "rgba(167, 255, 112, 0.7)";
  ctx.fillRect(meterX, meterY, meterW * clawEscapeEvent.meter, meterH);
  ctx.strokeStyle = "rgba(255, 214, 92, 0.55)";
  ctx.lineWidth = 2;
  ctx.strokeRect(meterX, meterY, meterW, meterH);

  // Lever button
  const btnW = 280;
  const btnH = 64;
  const btnX = GAME_WIDTH / 2 - btnW / 2;
  const btnY = 290;
  clawEscapeEvent.button = { x: btnX, y: btnY, w: btnW, h: btnH };

  const pulse = 0.7 + Math.sin(lastTime * 0.01) * 0.18 + clawEscapeEvent.flash * 0.12;
  ctx.fillStyle = "rgba(12, 10, 18, 0.9)";
  ctx.fillRect(btnX, btnY, btnW, btnH);
  ctx.strokeStyle = `rgba(255, 77, 245, ${0.55 * pulse})`;
  ctx.lineWidth = 4;
  ctx.strokeRect(btnX, btnY, btnW, btnH);
  ctx.strokeStyle = `rgba(69, 248, 255, ${0.4 * pulse})`;
  ctx.lineWidth = 2;
  ctx.strokeRect(btnX + 6, btnY + 6, btnW - 12, btnH - 12);

  ctx.fillStyle = `rgba(69, 248, 255, ${0.18 * pulse})`;
  ctx.fillRect(btnX + 18, btnY + 18, btnW - 36, btnH - 36);

  ctx.fillStyle = "#fff6ca";
  ctx.font = "bold 26px Verdana";
  ctx.fillText(t("claw_pull"), GAME_WIDTH / 2, btnY + 42);

  ctx.textAlign = "left";
}

function drawDanceOverlay() {
  const alpha = 0.54 + danceEvent.flash * 0.22;
  ctx.fillStyle = `rgba(7, 5, 16, ${alpha})`;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.fillStyle = "rgba(38, 8, 48, 0.24)";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.fillStyle = "rgba(7, 19, 33, 0.78)";
  ctx.fillRect(180, 140, 600, 230);
  ctx.strokeStyle = "rgba(255, 77, 245, 0.62)";
  ctx.lineWidth = 4;
  ctx.strokeRect(180, 140, 600, 230);
  ctx.strokeStyle = "rgba(69, 248, 255, 0.38)";
  ctx.lineWidth = 2;
  ctx.strokeRect(188, 148, 584, 214);

  ctx.fillStyle = "#fff5d6";
  ctx.textAlign = "center";
  ctx.font = "bold 34px Verdana";
  ctx.fillText(t("dance_title"), GAME_WIDTH / 2, 186);
  ctx.font = "18px Verdana";
  ctx.fillStyle = "#d8fbff";
  ctx.fillText(t("dance_copy"), GAME_WIDTH / 2, 216);

  if (danceEvent.countdown) {
    const countdownValue = Math.max(1, Math.ceil(danceEvent.countdownTimer));
    ctx.font = "bold 72px Verdana";
    ctx.fillStyle = "#ffb3b3";
    ctx.fillText(String(countdownValue), GAME_WIDTH / 2, 290);
    ctx.font = "18px Verdana";
    ctx.fillStyle = "#fff6ca";
    ctx.fillText(t("dance_ready"), GAME_WIDTH / 2, 326);
    ctx.textAlign = "left";
    return;
  }

  const current = danceEvent.sequence[danceEvent.index] || "up";
  const arrowX = GAME_WIDTH / 2;
  const arrowY = 292;
  drawDanceArrow(arrowX, arrowY, current, true);
  ctx.font = "bold 18px Verdana";
  ctx.fillStyle = "#fff6ca";
  ctx.fillText(`${danceEvent.index + 1}/${danceEvent.sequence.length}`, GAME_WIDTH / 2, 352);

  const barX = 240;
  const barY = 318;
  const barW = 480;
  const barH = 16;
  const t = Math.max(0, Math.min(1, danceEvent.stepTimer / danceEvent.stepTimeLimit));
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(barX, barY, barW, barH);
  ctx.fillStyle = "rgba(69, 248, 255, 0.55)";
  ctx.fillRect(barX, barY, barW * t, barH);
  ctx.strokeStyle = "rgba(255, 214, 92, 0.55)";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barY, barW, barH);

  ctx.textAlign = "left";
}

function drawDanceArrow(cx, cy, dir, lit) {
  const size = 44;
  const half = size / 2;
  const glow = lit ? 0.95 : 0.28;
  const base = "rgba(12, 10, 18, 0.88)";
  const edge = lit ? `rgba(255, 77, 245, ${0.7 * glow})` : "rgba(255,255,255,0.18)";
  const fill = lit ? `rgba(69, 248, 255, ${0.52 * glow})` : "rgba(69, 248, 255, 0.14)";

  ctx.fillStyle = base;
  ctx.fillRect(cx - half, cy - half, size, size);
  ctx.strokeStyle = edge;
  ctx.lineWidth = 4;
  ctx.strokeRect(cx - half, cy - half, size, size);

  ctx.save();
  ctx.translate(cx, cy);
  const angle =
    dir === "up" ? -Math.PI / 2 :
    dir === "down" ? Math.PI / 2 :
    dir === "left" ? Math.PI :
    0;
  ctx.rotate(angle);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(14, 0);
  ctx.lineTo(-2, -12);
  ctx.lineTo(-2, -6);
  ctx.lineTo(-16, -6);
  ctx.lineTo(-16, 6);
  ctx.lineTo(-2, 6);
  ctx.lineTo(-2, 12);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = lit ? `rgba(255, 214, 92, ${0.4 * glow})` : "rgba(255, 214, 92, 0.12)";
  ctx.fillRect(-10, -2, 14, 4);
  ctx.restore();
}

function drawNightmareOverlay() {
  const alpha = 0.54 + nightmareEvent.flash * 0.22;
  ctx.fillStyle = `rgba(7, 5, 16, ${alpha})`;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.fillStyle = "rgba(38, 8, 48, 0.24)";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  const centerX = GAME_WIDTH / 2;
  const centerY = 210;
  const pulse = Math.sin(lastTime * 0.02) * 4;
  const clawPulse = Math.sin(lastTime * 0.03) * 5;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.fillStyle = "rgba(8, 8, 14, 0.96)";
  ctx.beginPath();
  ctx.moveTo(-156, 136);
  ctx.quadraticCurveTo(-120, 28, -112, -24);
  ctx.quadraticCurveTo(-102, -86, -64, -142);
  ctx.quadraticCurveTo(-30, -184, 0, -154);
  ctx.quadraticCurveTo(34, -182, 70, -138);
  ctx.quadraticCurveTo(104, -88, 114, -16);
  ctx.quadraticCurveTo(124, 42, 154, 136);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#04060b";
  ctx.beginPath();
  ctx.moveTo(-120, 54);
  ctx.lineTo(-94, 122);
  ctx.lineTo(-46, 156);
  ctx.lineTo(0, 168);
  ctx.lineTo(46, 156);
  ctx.lineTo(94, 122);
  ctx.lineTo(120, 54);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
  ctx.beginPath();
  ctx.moveTo(-152, 126);
  ctx.lineTo(-214, 108 + clawPulse);
  ctx.lineTo(-186, 68);
  ctx.lineTo(-228, 52);
  ctx.lineTo(-186, 28);
  ctx.lineTo(-136, 58);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(152, 126);
  ctx.lineTo(214, 108 - clawPulse);
  ctx.lineTo(186, 68);
  ctx.lineTo(228, 52);
  ctx.lineTo(186, 28);
  ctx.lineTo(136, 58);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#6fe8ff";
  ctx.beginPath();
  ctx.ellipse(-38, -18, 30, 15 + pulse * 0.18, 0.12, 0, Math.PI * 2);
  ctx.ellipse(38, -18, 30, 15 + pulse * 0.18, -0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(111, 232, 255, 0.28)";
  ctx.beginPath();
  ctx.ellipse(-38, -18, 46, 22, 0.12, 0, Math.PI * 2);
  ctx.ellipse(38, -18, 46, 22, -0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#eefcff";
  ctx.fillRect(-48, -22, 6, 6);
  ctx.fillRect(30, -22, 6, 6);

  ctx.fillStyle = "#07090e";
  ctx.beginPath();
  ctx.moveTo(-48, 12);
  ctx.lineTo(-16, 24);
  ctx.lineTo(0, 22);
  ctx.lineTo(16, 24);
  ctx.lineTo(48, 12);
  ctx.lineTo(34, 54);
  ctx.lineTo(0, 70);
  ctx.lineTo(-34, 54);
  ctx.closePath();
  ctx.fill();

  for (let i = 0; i < 9; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? "#ece6d8" : "#d0c7bb";
    ctx.beginPath();
    ctx.moveTo(-60 + i * 15, 18);
    ctx.lineTo(-54 + i * 15, 66 + (i % 2) * 8);
    ctx.lineTo(-48 + i * 15, 18);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = "rgba(111, 232, 255, 0.16)";
  ctx.fillRect(-86, 96, 172, 34);
  ctx.restore();

  ctx.fillStyle = "#fff5d6";
  ctx.textAlign = "center";
  ctx.font = "bold 34px Verdana";
  ctx.fillText(t("nightmare_title"), GAME_WIDTH / 2, 84);
  ctx.font = "18px Verdana";
  if (nightmareEvent.countdown) {
    ctx.fillText(t("nightmare_countdown"), GAME_WIDTH / 2, 116);
  } else {
    ctx.fillText(t("nightmare_copy"), GAME_WIDTH / 2, 116);
  }

  if (nightmareEvent.countdown) {
    const countdownValue = Math.max(1, Math.ceil(nightmareEvent.countdownTimer));
    ctx.font = "bold 72px Verdana";
    ctx.fillStyle = "#ffb3b3";
    ctx.fillText(String(countdownValue), GAME_WIDTH / 2, 170);
  } else {
    const timerText = nightmareEvent.timer.toFixed(1);
    ctx.font = "bold 28px Verdana";
    ctx.fillStyle = "#ffb3b3";
    ctx.fillText(`${timerText}s`, GAME_WIDTH / 2, 150);
  }

  const barX = 200;
  const barY = 430;
  const barW = 560;
  const barH = 26;
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(barX, barY, barW, barH);
  ctx.strokeStyle = "#f5e4c5";
  ctx.lineWidth = 3;
  ctx.strokeRect(barX, barY, barW, barH);

  if (!nightmareEvent.countdown) {
    ctx.fillStyle = "rgba(214, 24, 35, 0.9)";
    ctx.fillRect(
      barX + barW * nightmareEvent.targetStart,
      barY + 2,
      barW * nightmareEvent.targetWidth,
      barH - 4
    );

    const markerX = barX + barW * nightmareEvent.marker;
    ctx.fillStyle = "#fff8d8";
    ctx.fillRect(markerX - 4, barY - 8, 8, barH + 16);
  }
}

function gameLoop(timestamp) {
  const dt = Math.min(0.0167 * 2, (timestamp - lastTime) / 1000 || 0);
  lastTime = timestamp;
  update(dt);
  render();
  requestAnimationFrame(gameLoop);
}

applyLanguage(currentLanguage);
loadPersistentProgress();
updateStageSelectLocks();
applyScreenMode();
applyControlMode();
openLobby();
initializeAuthControls();
if (multiplayerRoomInput) {
  multiplayerRoomInput.value = multiplayerState.room;
}
setMultiplayerStatus("offline");
savePersistentProgress(true);
requestAnimationFrame(gameLoop);
