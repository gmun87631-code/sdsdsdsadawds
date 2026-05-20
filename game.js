const CHOICES = {
  scissors: {
    key: "scissors",
    name: "가위",
    symbol: "✌",
    beats: "paper",
    losesTo: "rock",
    color: "#38bdf8",
    rule: "기준 패가 가위면 보를 낸 참가자가 탈락합니다.",
  },
  rock: {
    key: "rock",
    name: "바위",
    symbol: "●",
    beats: "scissors",
    losesTo: "paper",
    color: "#facc15",
    rule: "기준 패가 바위면 가위를 낸 참가자가 탈락합니다.",
  },
  paper: {
    key: "paper",
    name: "보",
    symbol: "▰",
    beats: "rock",
    losesTo: "scissors",
    color: "#4ade80",
    rule: "기준 패가 보면 바위를 낸 참가자가 탈락합니다.",
  },
};

const CHOICE_ORDER = ["scissors", "rock", "paper"];
const MAX_PLAYERS = 10;
const PATCH_VERSION = "0.7";
const AI_NAMES = ["민준", "서연", "도윤", "하린", "지우", "현우", "유나", "준서", "가온"];

function choiceName(choice) {
  return CHOICES[choice]?.name || "없음";
}

function choiceSymbol(choice) {
  return CHOICES[choice]?.symbol || "?";
}

function createCountMap(players) {
  return CHOICE_ORDER.reduce((counts, choice) => {
    counts[choice] = players.filter((player) => player.pick === choice).length;
    return counts;
  }, {});
}

function formatCounts(counts) {
  return `가위 ${counts.scissors}명 / 바위 ${counts.rock}명 / 보 ${counts.paper}명`;
}

function selectMayorFromVotes({ votes, candidates, random = Math.random }) {
  const candidateIds = new Set(candidates.map((candidate) => candidate.id));
  const tally = candidates.reduce((acc, candidate) => {
    acc[candidate.id] = 0;
    return acc;
  }, {});

  for (const vote of votes) {
    if (!candidateIds.has(vote.voterId) || !candidateIds.has(vote.candidateId)) continue;
    if (vote.voterId === vote.candidateId) continue;
    tally[vote.candidateId] += 1;
  }

  const highest = Math.max(...Object.values(tally));
  const topCandidateIds = Object.entries(tally)
    .filter(([, count]) => count === highest)
    .map(([id]) => Number(id));
  const mayorId = topCandidateIds[Math.floor(random() * topCandidateIds.length)];

  return {
    mayorId,
    tally,
    tiedCandidateIds: topCandidateIds,
  };
}

function resolveMajorityRound({ players, mayorId, protectedIds = [] }) {
  const alivePlayers = players.filter((player) => player.alive);
  const counts = createCountMap(alivePlayers);
  const protectedSet = new Set(protectedIds);
  if (alivePlayers.length === 2 && protectedSet.size === 0) {
    const [first, second] = alivePlayers;
    let baseChoice = null;
    let losingChoice = null;
    let eliminatedIds = [];
    let reason = "최종 2인전에서는 시장 권한을 사용하지 않습니다.";

    if (first.pick === second.pick) {
      reason = "최종 2인전에서 두 참가자가 같은 패를 냈으므로 아무도 탈락하지 않습니다.";
    } else if (CHOICES[first.pick].beats === second.pick) {
      baseChoice = first.pick;
      losingChoice = second.pick;
      eliminatedIds = [second.id];
      reason = `최종 2인전: ${choiceName(first.pick)}가 ${choiceName(second.pick)}를 이겼습니다.`;
    } else {
      baseChoice = second.pick;
      losingChoice = first.pick;
      eliminatedIds = [first.id];
      reason = `최종 2인전: ${choiceName(second.pick)}가 ${choiceName(first.pick)}를 이겼습니다.`;
    }

    return {
      counts,
      topChoices: [],
      baseChoice,
      losingChoice,
      eliminatedIds,
      decidedByMayor: false,
      finalDuel: true,
      reason,
      mayorChoice: null,
    };
  }

  const maxCount = Math.max(...CHOICE_ORDER.map((choice) => counts[choice]));
  const topChoices = CHOICE_ORDER.filter((choice) => counts[choice] === maxCount);
  const usedChoices = CHOICE_ORDER.filter((choice) => counts[choice] > 0);
  const mayor = alivePlayers.find((player) => player.id === mayorId);
  const mayorChoice = mayor?.pick || null;

  let baseChoice = null;
  let decidedByMayor = false;
  let reason = "";

  if (usedChoices.length === 1) {
    reason = "모든 생존자가 같은 패를 냈으므로 아무도 탈락하지 않습니다.";
  } else if (topChoices.length === 1) {
    baseChoice = topChoices[0];
    reason = `단독 최다 선택 패인 ${choiceName(baseChoice)}가 기준 패입니다.`;
  } else if (mayorChoice && topChoices.includes(mayorChoice)) {
    baseChoice = mayorChoice;
    decidedByMayor = true;
    reason = "시장 권한으로 기준 패가 결정되었습니다.";
  } else {
    reason = "최다 선택 패가 동률이고 시장의 선택이 동률 후보에 없어 기준 패를 정하지 못했습니다.";
  }

  const losingChoice = baseChoice ? CHOICES[baseChoice].beats : null;
  const eliminatedIds = baseChoice
    ? alivePlayers
      .filter((player) => player.pick === losingChoice && !protectedSet.has(player.id))
      .map((player) => player.id)
    : [];

  return {
    counts,
    topChoices,
    baseChoice,
    losingChoice,
    eliminatedIds,
    decidedByMayor,
    reason,
    mayorChoice,
  };
}

class BgmPlayer {
  constructor() {
    this.context = null;
    this.master = null;
    this.timer = null;
    this.step = 0;
    this.playing = false;
    this.scale = [261.63, 293.66, 329.63, 392, 440, 392, 329.63, 293.66];
  }

  async toggle() {
    if (this.playing) {
      this.stop();
      return false;
    }

    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = 0.12;
      this.master.connect(this.context.destination);
    }

    await this.context.resume();
    this.playing = true;
    this.playBeat();
    this.timer = window.setInterval(() => this.playBeat(), 380);
    return true;
  }

  async ensureContext() {
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = 0.12;
      this.master.connect(this.context.destination);
    }
    await this.context.resume();
  }

  stop() {
    if (this.timer) window.clearInterval(this.timer);
    this.timer = null;
    this.playing = false;
  }

  async playGunshot() {
    await this.ensureContext();
    const now = this.context.currentTime;
    const duration = 0.18;
    const sampleRate = this.context.sampleRate;
    const buffer = this.context.createBuffer(1, Math.floor(sampleRate * duration), sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i += 1) {
      const decay = 1 - i / data.length;
      data[i] = (Math.random() * 2 - 1) * decay * decay;
    }

    const noise = this.context.createBufferSource();
    const noiseGain = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 700;
    noise.buffer = buffer;
    noiseGain.gain.setValueAtTime(0.42, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.master);
    noise.start(now);
    noise.stop(now + duration);

    this.playTone(90, now, 0.11, "sine", 0.38);
  }

  playBeat() {
    if (!this.context || !this.master) return;
    const now = this.context.currentTime;
    const note = this.scale[this.step % this.scale.length];
    const harmony = this.scale[(this.step + 2) % this.scale.length] / 2;
    this.step += 1;
    this.playTone(note, now, 0.16, "triangle", 0.22);
    if (this.step % 2 === 0) this.playTone(harmony, now, 0.24, "sine", 0.15);
    if (this.step % 4 === 0) this.playKick(now);
  }

  playTone(frequency, start, duration, type, volume) {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  playKick(start) {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(110, start);
    osc.frequency.exponentialRampToValueAtTime(48, start + 0.14);
    gain.gain.setValueAtTime(0.3, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(start);
    osc.stop(start + 0.16);
  }
}

class SurvivalGame {
  constructor() {
    this.phase = "waiting";
    this.round = 1;
    this.players = [];
    this.mayorId = null;
    this.successorIds = [];
    this.successionDuel = null;
    this.royalInspectorIds = [];
    this.inspectorPowerUsedIds = [];
    this.pendingSuccessorIds = [];
    this.logs = [];
    this.lastResult = null;
    this.lastPlayerPick = null;
    this.autoTimer = null;
    this.nextPlayerId = 1;
    this.friends = this.loadFriends();
    this.bgm = new BgmPlayer();
    this.bindElements();
    this.bindEvents();
    this.reset(false);
    this.render();
  }

  bindElements() {
    this.choiceGrid = document.getElementById("choiceGrid");
    this.voteGrid = document.getElementById("voteGrid");
    this.playerGrid = document.getElementById("playerGrid");
    this.logList = document.getElementById("logList");
    this.roundValue = document.getElementById("roundValue");
    this.aliveValue = document.getElementById("aliveValue");
    this.mayorValue = document.getElementById("mayorValue");
    this.phaseValue = document.getElementById("phaseValue");
    this.resultBanner = document.getElementById("resultBanner");
    this.stageEyebrow = document.getElementById("stageEyebrow");
    this.stageTitle = document.getElementById("stageTitle");
    this.startButton = document.getElementById("startButton");
    this.patchNotesButton = document.getElementById("patchNotesButton");
    this.patchModal = document.getElementById("patchModal");
    this.closePatchButton = document.getElementById("closePatchButton");
    this.victoryModal = document.getElementById("victoryModal");
    this.victoryTitle = document.getElementById("victoryTitle");
    this.victoryText = document.getElementById("victoryText");
    this.closeVictoryButton = document.getElementById("closeVictoryButton");
    this.addAiButton = document.getElementById("addAiButton");
    this.lobbyPanel = document.getElementById("lobbyPanel");
    this.lobbyCount = document.getElementById("lobbyCount");
    this.musicButton = document.getElementById("musicButton");
    this.votePanel = document.getElementById("votePanel");
    this.choicePanel = document.getElementById("choicePanel");
    this.playerPick = document.getElementById("playerPick");
    this.basePick = document.getElementById("basePick");
    this.secretPanel = document.getElementById("secretPanel");
    this.secretTitle = document.getElementById("secretTitle");
    this.secretText = document.getElementById("secretText");
    this.successorPanel = document.getElementById("successorPanel");
    this.successorGrid = document.getElementById("successorGrid");
    this.successorHint = document.getElementById("successorHint");
    this.confirmSuccessorsButton = document.getElementById("confirmSuccessorsButton");
    this.inspectorPanel = document.getElementById("inspectorPanel");
    this.inspectorGrid = document.getElementById("inspectorGrid");
    this.inspectorHint = document.getElementById("inspectorHint");
    this.friendForm = document.getElementById("friendForm");
    this.friendInput = document.getElementById("friendInput");
    this.friendList = document.getElementById("friendList");
  }

  bindEvents() {
    this.startButton.addEventListener("click", () => {
      if (this.phase === "over") {
        this.reset(true);
      } else if (this.phase === "waiting") {
        if (this.players.length < 2) {
          this.addLog("참가자가 2명 이상이어야 시작할 수 있습니다.");
        } else {
          this.startElection("게임 시작 전 시장 투표가 시작되었습니다.");
        }
      }
      this.render();
    });

    this.patchNotesButton.addEventListener("click", () => {
      this.openPatchNotes();
    });

    this.closePatchButton.addEventListener("click", () => {
      this.closePatchNotes();
    });

    this.closeVictoryButton.addEventListener("click", () => {
      this.victoryModal.hidden = true;
    });

    this.confirmSuccessorsButton.addEventListener("click", () => {
      this.confirmHumanSuccessors();
    });

    this.patchModal.addEventListener("click", (event) => {
      if (event.target === this.patchModal) this.closePatchNotes();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !this.patchModal.hidden) this.closePatchNotes();
    });

    this.addAiButton.addEventListener("click", () => {
      this.addAiPlayer();
    });

    this.musicButton.addEventListener("click", async () => {
      const playing = await this.bgm.toggle();
      this.addLog(playing ? "BGM이 재생 중입니다." : "BGM을 껐습니다.");
      this.renderMusicButton();
    });

    this.friendForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.addFriend(this.friendInput.value);
    });

    window.setTimeout(() => this.showPatchNotesOnce(), 250);
  }

  reset(clearLogs) {
    this.phase = "waiting";
    this.round = 1;
    this.mayorId = null;
    this.successorIds = [];
    this.successionDuel = null;
    this.royalInspectorIds = [];
    this.inspectorPowerUsedIds = [];
    this.lastResult = null;
    this.lastPlayerPick = null;
    this.nextPlayerId = 1;
    this.clearAutoTimer();
    this.players = [{
      id: 0,
      name: "나",
      alive: true,
      isHuman: true,
      type: "human",
      pick: null,
      vote: null,
    }];
    if (clearLogs) this.logs = [];
    if (!this.logs.length) this.addLog("로비 준비 완료. AI를 추가하거나 친구를 초대하세요.", true);
  }

  startElection(message) {
    this.phase = "voting";
    this.players.forEach((player) => {
      player.vote = null;
      player.pick = null;
    });
    this.lastResult = null;
    this.lastPlayerPick = null;
    this.addLog(message, true);
    this.scheduleAutomation();
  }

  castHumanVote(candidateId) {
    const human = this.human();
    if (this.phase !== "voting" || !human.alive || human.id === candidateId) return;

    const candidates = this.alivePlayers();
    const votes = candidates.map((player) => ({
      voterId: player.id,
      candidateId: player.isHuman ? candidateId : this.randomCandidateId(player.id, candidates),
    }));

    this.applyMayorElection(votes);
  }

  applyMayorElection(votes) {
    const candidates = this.alivePlayers();
    const election = selectMayorFromVotes({ votes, candidates });
    this.mayorId = election.mayorId;
    this.successionDuel = null;
    this.players.forEach((player) => {
      const vote = votes.find((item) => item.voterId === player.id);
      player.vote = vote?.candidateId ?? null;
    });

    const mayor = this.playerById(this.mayorId);
    this.addLog(`새 시장은 ${mayor.name}입니다.`, true);
    this.addLog(`시장 투표 결과: ${this.formatVoteTally(election.tally)}`);
    this.beginSuccessorAssignment();
    this.render();
  }

  choose(choice) {
    if (this.phase !== "choosing" || !this.human().alive) return;

    this.players.forEach((player) => {
      if (!player.alive) return;
      player.pick = player.isHuman ? choice : this.randomChoice();
    });

    this.resolveRound();
  }

  resolveRound() {
    this.phase = "reveal";
    const protectedIds = this.successionDuel?.ids || [];
    const result = resolveMajorityRound({ players: this.players, mayorId: this.mayorId, protectedIds });
    this.lastResult = result;
    this.lastPlayerPick = this.human().pick;

    result.eliminatedIds.forEach((id) => {
      const player = this.playerById(id);
      if (player) player.alive = false;
    });
    if (result.eliminatedIds.length) this.playEliminationSound();

    this.addRoundLogs(result);
    this.successorIds = this.successorIds.filter((id) => this.playerById(id)?.alive);
    if (this.successionDuel) {
      this.resolveSuccessionDuel(result);
    }

    const mayorWasEliminated = result.eliminatedIds.includes(this.mayorId);
    const survivors = this.alivePlayers();

    if (survivors.length <= 1) {
      this.phase = "over";
      if (survivors.length === 1) {
        this.addLog(`${survivors[0].name} 최종 생존. 승리!`, true);
        this.showVictory(survivors[0]);
      } else {
        this.addLog("모두 동시에 탈락했습니다. 생존자가 없습니다.", true);
        this.showVictory(null);
      }
      this.render();
      return;
    }

    this.round += 1;

    window.setTimeout(() => {
      if (this.phase !== "reveal") return;
      this.players.forEach((player) => {
        player.pick = null;
      });
      this.lastPlayerPick = null;

      if (mayorWasEliminated) {
        this.resolveSuccessionAfterMayorDeath();
        if (this.phase !== "successorSelect" && this.phase !== "choosing") {
          this.phase = "choosing";
        }
      } else {
        if (this.alivePlayers().length <= 2 && this.mayorId !== null) {
          this.mayorId = null;
          this.addLog("마지막 2명만 남아 시장 권한이 비활성화됩니다.", true);
        }
        this.phase = "choosing";
      }
      this.render();
    }, 1200);

    this.render();
  }

  scheduleAutomation() {
    if (this.autoTimer || this.human().alive) return;
    if (this.phase !== "voting" && this.phase !== "choosing") return;

    this.autoTimer = window.setTimeout(() => {
      this.autoTimer = null;
      if (this.phase === "voting") {
        const candidates = this.alivePlayers();
        const votes = candidates.map((player) => ({
          voterId: player.id,
          candidateId: this.randomCandidateId(player.id, candidates),
        }));
        this.applyMayorElection(votes);
        return;
      }

      if (this.phase === "choosing") {
        this.players.forEach((player) => {
          if (player.alive) player.pick = this.randomChoice();
        });
        this.resolveRound();
      }
    }, 900);
  }

  clearAutoTimer() {
    if (!this.autoTimer) return;
    window.clearTimeout(this.autoTimer);
    this.autoTimer = null;
  }

  showPatchNotesOnce() {
    const seenVersion = localStorage.getItem("rps-survival-patch-version");
    if (seenVersion === PATCH_VERSION) return;
    this.openPatchNotes();
  }

  openPatchNotes() {
    this.patchModal.hidden = false;
  }

  closePatchNotes() {
    this.patchModal.hidden = true;
    localStorage.setItem("rps-survival-patch-version", PATCH_VERSION);
  }

  playEliminationSound() {
    this.bgm.playGunshot().catch(() => {});
  }

  showVictory(winner) {
    this.victoryTitle.textContent = winner ? "승리" : "무승부";
    this.victoryText.textContent = winner
      ? `${winner.name} 최후의 생존자`
      : "생존자가 없습니다.";
    this.victoryModal.hidden = false;
  }

  assignSuccessors() {
    const mayor = this.playerById(this.mayorId);
    if (!mayor?.alive) {
      this.successorIds = [];
      return;
    }

    const candidates = this.alivePlayers().filter((player) => player.id !== mayor.id);
    this.successorIds = this.shuffle(candidates).slice(0, 2).map((player) => player.id);
    const count = this.successorIds.length;

    if (count > 0) {
      this.addLog(`시장이 비밀 후계자 ${count}명을 지정했습니다.`, true);
      if (this.successorIds.includes(this.human().id)) {
        this.addLog("당신은 비밀 후계자로 지정되었습니다.", true);
      }
    } else {
      this.addLog("지정할 수 있는 비밀 후계자가 없습니다.");
    }
  }

  beginSuccessorAssignment() {
    const mayor = this.playerById(this.mayorId);
    this.pendingSuccessorIds = [];

    if (mayor?.isHuman && mayor.alive) {
      this.phase = "successorSelect";
      this.addLog("당신은 시장입니다. 비밀 후계자를 직접 지정하세요.", true);
      return;
    }

    this.assignSuccessors();
    this.finishSuccessorAssignment();
  }

  finishSuccessorAssignment() {
    if (!this.royalInspectorIds.length) this.assignRoyalInspectors();
    this.phase = "choosing";
  }

  togglePendingSuccessor(candidateId) {
    if (this.phase !== "successorSelect") return;
    const candidates = this.successorCandidates();
    const targetCount = Math.min(2, candidates.length);
    const selected = new Set(this.pendingSuccessorIds);

    if (selected.has(candidateId)) {
      selected.delete(candidateId);
    } else if (selected.size < targetCount) {
      selected.add(candidateId);
    }

    this.pendingSuccessorIds = [...selected];
    this.render();
  }

  confirmHumanSuccessors() {
    if (this.phase !== "successorSelect") return;
    const candidates = this.successorCandidates();
    const targetCount = Math.min(2, candidates.length);
    if (this.pendingSuccessorIds.length < targetCount) {
      this.addLog(`후계자 ${targetCount}명을 선택해야 합니다.`);
      this.render();
      return;
    }

    this.successorIds = this.pendingSuccessorIds.slice(0, targetCount);
    this.pendingSuccessorIds = [];
    const count = this.successorIds.length;
    if (count > 0) this.addLog(`시장이 비밀 후계자 ${count}명을 지정했습니다.`, true);
    this.finishSuccessorAssignment();
    this.render();
  }

  successorCandidates() {
    const mayor = this.playerById(this.mayorId);
    return this.alivePlayers().filter((player) => player.id !== mayor?.id);
  }

  assignRoyalInspectors() {
    const excludedIds = new Set([this.mayorId, ...this.successorIds]);
    const preferred = this.alivePlayers().filter((player) => !excludedIds.has(player.id));
    const fallback = this.alivePlayers().filter((player) => player.id !== this.mayorId);
    const candidates = preferred.length >= 2 ? preferred : fallback;
    this.royalInspectorIds = this.shuffle(candidates).slice(0, 2).map((player) => player.id);
  }

  canUseInspectorPower(viewer = this.human()) {
    const roles = this.viewerRolePayload(viewer);
    return roles.isInspector
      && this.phase !== "waiting"
      && this.phase !== "over"
      && !this.inspectorPowerUsedIds.includes(viewer.id)
      && this.alivePlayers().some((player) => player.id !== viewer.id);
  }

  useInspectorPower(targetId) {
    const inspector = this.human();
    const target = this.playerById(targetId);
    if (!this.canUseInspectorPower(inspector) || !target?.alive || target.id === inspector.id) return;

    this.inspectorPowerUsedIds.push(inspector.id);
    const hitSuccessor = this.successorIds.includes(target.id);
    const eliminated = hitSuccessor ? target : inspector;
    eliminated.alive = false;
    this.playEliminationSound();
    this.successorIds = this.successorIds.filter((id) => this.playerById(id)?.alive);

    if (hitSuccessor) {
      this.addLog(`암행어사가 비밀 후계자 색출에 성공하여 ${target.name} 탈락.`, true);
    } else {
      this.addLog(`암행어사가 비밀 후계자 색출에 실패하여 암행어사 본인이 탈락했습니다.`, true);
    }

    if (eliminated.id === this.mayorId) {
      this.addLog("시장이 암행어사 판정으로 탈락했습니다.", true);
      this.resolveSuccessionAfterMayorDeath();
    }

    const survivors = this.alivePlayers();
    if (survivors.length <= 1) {
      this.phase = "over";
      if (survivors.length === 1) {
        this.addLog(`${survivors[0].name} 최종 생존. 승리!`, true);
        this.showVictory(survivors[0]);
      } else {
        this.addLog("모두 동시에 탈락했습니다. 생존자가 없습니다.", true);
        this.showVictory(null);
      }
    }

    this.render();
  }

  viewerRolePayload(viewer) {
    const isMayor = viewer?.alive && viewer.id === this.mayorId;
    const isSuccessor = viewer?.alive && this.successorIds.includes(viewer.id);
    const isInspector = viewer?.alive && this.royalInspectorIds.includes(viewer.id);

    return {
      isMayor,
      isSuccessor,
      isInspector: isInspector && !isMayor && !isSuccessor,
    };
  }

  shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
  }

  livingSuccessors() {
    const successorSet = new Set(this.successorIds);
    return this.alivePlayers().filter((player) => successorSet.has(player.id));
  }

  resolveSuccessionAfterMayorDeath() {
    const successors = this.livingSuccessors();
    this.mayorId = null;

    if (successors.length >= 2) {
      this.successionDuel = { ids: successors.slice(0, 2).map((player) => player.id) };
      this.successorIds = this.successionDuel.ids;
      this.addLog("시장이 탈락하여 비밀 후계자 결투가 시작됩니다.", true);
      return;
    }

    if (successors.length === 1) {
      this.mayorId = successors[0].id;
      this.successionDuel = null;
      this.addLog("남은 후계자가 새 시장이 되었습니다.", true);
      this.addLog(`새 시장은 ${successors[0].name}입니다.`, true);
      this.beginSuccessorAssignment();
      return;
    }

    const candidates = this.alivePlayers();
    if (!candidates.length) return;
    const randomMayor = candidates[Math.floor(Math.random() * candidates.length)];
    this.mayorId = randomMayor.id;
    this.successionDuel = null;
    this.successorIds = [];
    this.addLog("후계자가 모두 사라져 무작위로 새 시장이 선출되었습니다.", true);
    this.addLog(`새 시장은 ${randomMayor.name}입니다.`, true);
    this.beginSuccessorAssignment();
  }

  resolveSuccessionDuel(result) {
    if (!this.successionDuel) return;
    const duelists = this.successionDuel.ids.map((id) => this.playerById(id)).filter((player) => player?.alive);

    if (duelists.length < 2) {
      this.resolveSuccessionAfterMayorDeath();
      return;
    }

    const [first, second] = duelists;
    if (first.pick === second.pick) {
      this.addLog("후계자 결투가 무승부로 끝났습니다. 다음 라운드에도 결투가 유지됩니다.", true);
      return;
    }

    const winner = CHOICES[first.pick].beats === second.pick ? first : second;
    const loser = winner.id === first.id ? second : first;
    loser.alive = false;
    result.eliminatedIds.push(loser.id);
    this.playEliminationSound();
    this.addLog(`후계자 결투 패배로 ${loser.name} 탈락.`, true);
    this.addLog("후계자 결투 결과, 새 시장이 탄생했습니다.", true);
    this.mayorId = winner.id;
    this.successionDuel = null;
    this.successorIds = [];
    this.addLog(`새 시장은 ${winner.name}입니다.`, true);
    this.beginSuccessorAssignment();
  }

  canEditLobby() {
    return this.phase === "waiting" || this.phase === "over";
  }

  lobbyFull() {
    return this.players.length >= MAX_PLAYERS;
  }

  addAiPlayer() {
    if (this.phase !== "waiting") return;
    if (this.lobbyFull()) {
      this.addLog("로비가 가득 찼습니다.");
      this.render();
      return;
    }

    const usedNames = new Set(this.players.map((player) => player.name));
    const baseName = AI_NAMES.find((name) => !usedNames.has(name)) || `AI ${this.nextPlayerId}`;
    this.players.push({
      id: this.nextPlayerId++,
      name: baseName,
      alive: true,
      isHuman: false,
      type: "ai",
      pick: null,
      vote: null,
    });
    this.addLog(`${baseName} AI가 로비에 참가했습니다.`);
    this.render();
  }

  inviteFriend(friendName) {
    if (this.phase !== "waiting") return;
    if (this.lobbyFull()) {
      this.addLog("로비가 가득 찼습니다.");
      this.render();
      return;
    }
    if (this.players.some((player) => player.name.toLowerCase() === friendName.toLowerCase())) {
      this.addLog(`${friendName}은 이미 로비에 있습니다.`);
      this.render();
      return;
    }

    this.players.push({
      id: this.nextPlayerId++,
      name: friendName,
      alive: true,
      isHuman: false,
      type: "friend",
      pick: null,
      vote: null,
    });
    this.addLog(`${friendName}에게 초대를 보냈고 로비에 참가했습니다.`, true);
    this.render();
  }

  loadFriends() {
    try {
      const stored = JSON.parse(localStorage.getItem("rps-survival-friends") || "[]");
      return Array.isArray(stored) ? stored.filter(Boolean).slice(0, 30) : [];
    } catch {
      return [];
    }
  }

  saveFriends() {
    localStorage.setItem("rps-survival-friends", JSON.stringify(this.friends));
  }

  addFriend(value) {
    const name = String(value || "").trim().replace(/\s+/g, " ").slice(0, 16);
    if (!name) return;
    if (this.friends.some((friend) => friend.toLowerCase() === name.toLowerCase())) {
      this.friendInput.value = "";
      this.addLog(`${name}은 이미 친구 목록에 있습니다.`);
      this.renderFriends();
      return;
    }

    this.friends.unshift(name);
    this.friends = this.friends.slice(0, 30);
    this.friendInput.value = "";
    this.saveFriends();
    this.addLog(`${name}을 친구 목록에 추가했습니다.`);
    this.renderFriends();
    this.renderLogs();
  }

  removeFriend(index) {
    const [removed] = this.friends.splice(index, 1);
    this.saveFriends();
    if (removed) this.addLog(`${removed}을 친구 목록에서 삭제했습니다.`);
    this.renderFriends();
    this.renderLogs();
  }

  addRoundLogs(result) {
    const countsText = formatCounts(result.counts);
    this.addLog(`${this.round}라운드 선택 수: ${countsText}`, true);
    this.addLog(result.reason, result.decidedByMayor);

    if (result.baseChoice) {
      this.addLog(`기준 패: ${choiceName(result.baseChoice)}`, true);
      this.addLog(`탈락 대상 패: ${choiceName(result.losingChoice)}`);
    } else {
      this.addLog("기준 패: 없음");
    }

    if (result.eliminatedIds.length) {
      const names = result.eliminatedIds.map((id) => this.playerById(id).name).join(", ");
      this.addLog(`${choiceName(result.losingChoice)}를 낸 플레이어 탈락: ${names}`, true);
      if (result.eliminatedIds.includes(this.human().id)) {
        this.addLog("당신은 탈락했습니다. 남은 참가자들의 생존전은 자동으로 진행됩니다.", true);
      }
    } else {
      this.addLog("기준 패에게 지는 패를 낸 플레이어가 없어 아무도 탈락하지 않았습니다.");
    }
  }

  randomChoice() {
    return CHOICE_ORDER[Math.floor(Math.random() * CHOICE_ORDER.length)];
  }

  randomCandidateId(voterId, candidates) {
    const available = candidates.filter((candidate) => candidate.id !== voterId);
    return available[Math.floor(Math.random() * available.length)].id;
  }

  formatVoteTally(tally) {
    return Object.entries(tally)
      .map(([id, count]) => `${this.playerById(Number(id)).name} ${count}표`)
      .join(" / ");
  }

  addLog(message, important = false) {
    this.logs.unshift({ message, important });
    this.logs = this.logs.slice(0, 12);
  }

  alivePlayers() {
    return this.players.filter((player) => player.alive);
  }

  human() {
    return this.players[0];
  }

  playerById(id) {
    return this.players.find((player) => player.id === id);
  }

  render() {
    const alive = this.alivePlayers();
    const mayor = this.playerById(this.mayorId);
    this.roundValue.textContent = this.round;
    this.aliveValue.textContent = alive.length;
    const mayorDisabled = this.phase !== "waiting" && this.phase !== "over" && alive.length <= 2;
    this.mayorValue.textContent = mayorDisabled ? "비활성" : mayor?.alive ? mayor.name : "없음";
    this.phaseValue.textContent = this.phaseText();
    this.lobbyCount.textContent = `${this.players.length} / ${MAX_PLAYERS}`;
    this.addAiButton.disabled = this.phase !== "waiting" || this.lobbyFull();
    this.renderStage();
    this.renderSecretInfo();
    this.renderMusicButton();
    this.renderVotes();
    this.renderSuccessorSelection();
    this.renderInspectorAction();
    this.renderChoices();
    this.renderBattleSlots();
    this.renderPlayers();
    this.renderFriends();
    this.renderLogs();
    this.scheduleAutomation();
  }

  renderStage() {
    const isVoting = this.phase === "voting";
    this.lobbyPanel.hidden = this.phase !== "waiting";
    this.votePanel.hidden = !isVoting;
    this.successorPanel.hidden = this.phase !== "successorSelect";
    this.choicePanel.hidden = isVoting || this.phase === "successorSelect";

    if (this.phase === "waiting") {
      this.stageEyebrow.textContent = "로비";
      this.stageTitle.textContent = "참가자를 모으세요";
      this.startButton.textContent = "시작";
      this.startButton.disabled = this.players.length < 2;
      this.resultBanner.textContent = this.players.length < 2
        ? "AI를 추가하거나 친구를 초대하면 게임을 시작할 수 있습니다."
        : "시작 버튼을 누르면 시장 투표 후 생존전이 시작됩니다.";
      return;
    }

    if (isVoting) {
      this.stageEyebrow.textContent = "시장 투표";
      this.stageTitle.textContent = "새 시장을 뽑으세요";
      this.startButton.textContent = "투표 중";
      this.startButton.disabled = true;
      this.resultBanner.textContent = "본인 투표는 금지됩니다. 생존자만 투표하고 생존자만 후보가 됩니다.";
      return;
    }

    if (this.phase === "successorSelect") {
      this.stageEyebrow.textContent = "시장 권한";
      this.stageTitle.textContent = "비밀 후계자를 지정하세요";
      this.startButton.textContent = "후계자 지정 중";
      this.startButton.disabled = true;
      this.resultBanner.textContent = "시장 본인은 후계자가 될 수 없습니다. 가능한 경우 서로 다른 2명을 선택하세요.";
      return;
    }

    if (this.phase === "over") {
      this.stageEyebrow.textContent = "게임 종료";
      this.stageTitle.textContent = "생존전이 끝났습니다";
      this.startButton.textContent = "다시 시작";
      this.startButton.disabled = false;
      this.resultBanner.textContent = this.logs[0]?.message || "게임 종료";
      return;
    }

    this.stageEyebrow.textContent = "다수결 판정";
    this.stageTitle.textContent = "이번 라운드에 낼 패를 고르세요";
    this.startButton.textContent = "진행 중";
    this.startButton.disabled = true;
    this.resultBanner.textContent = this.phase === "reveal"
      ? this.logs[0]?.message || "선택 공개 중입니다."
      : "선택이 공개되면 최다 선택 패가 기준 패가 됩니다.";
  }

  renderMusicButton() {
    this.musicButton.setAttribute("aria-pressed", String(this.bgm.playing));
    this.musicButton.querySelector("span:last-child").textContent = this.bgm.playing ? "BGM 끄기" : "BGM 켜기";
  }

  renderSecretInfo() {
    const human = this.human();
    const mayor = this.playerById(this.mayorId);
    const viewerRoles = this.viewerRolePayload(human);
    const successorNames = this.successorIds
      .map((id) => this.playerById(id))
      .filter((player) => player?.alive)
      .map((player) => player.name);
    const duelActive = Boolean(this.successionDuel);
    const duelNames = (this.successionDuel?.ids || [])
      .map((id) => this.playerById(id))
      .filter((player) => player?.alive)
      .map((player) => player.name);

    this.secretPanel.classList.toggle("urgent", duelActive);

    if (duelActive) {
      this.secretTitle.textContent = "비밀 후계자 결투";
      if (this.successionDuel.ids.includes(human.id)) {
        const opponent = duelNames.find((name) => name !== human.name) || "상대 후계자";
        this.secretText.textContent = `당신은 비밀 후계자입니다. ${opponent}와 결투 중입니다. 이번 라운드의 일반 다수결 탈락 판정에서는 보호됩니다.`;
      } else {
        this.secretText.textContent = "시장 공석: 비밀 후계자 결투 진행 중";
      }
      return;
    }

    if (viewerRoles.isMayor) {
      this.secretTitle.textContent = "시장 전용 정보";
      this.secretText.textContent = successorNames.length
        ? `현재 지정한 비밀 후계자: ${successorNames.join(", ")}`
        : "지정된 비밀 후계자가 없습니다.";
      return;
    }

    if (viewerRoles.isSuccessor) {
      const others = successorNames.filter((name) => name !== human.name);
      this.secretTitle.textContent = "비밀 후계자";
      this.secretText.textContent = others.length
        ? `당신은 비밀 후계자입니다. 다른 후계자: ${others.join(", ")}`
        : "당신은 비밀 후계자입니다. 다른 후계자는 없습니다.";
      return;
    }

    if (viewerRoles.isInspector) {
      this.secretTitle.textContent = "암행어사";
      this.secretText.textContent = this.inspectorPowerUsedIds.includes(human.id)
        ? "당신은 암행어사입니다. 후계자 색출권을 이미 사용했습니다."
        : "당신은 암행어사입니다.";
      return;
    }

    this.secretTitle.textContent = "비밀 후계자";
    this.secretText.textContent = successorNames.length ? "비밀 후계자 지정 완료" : "비밀 후계자 지정 전입니다.";
  }

  renderInspectorAction() {
    this.inspectorGrid.innerHTML = "";
    const canUse = this.canUseInspectorPower();
    this.inspectorPanel.hidden = !canUse;
    if (!canUse) return;

    const targets = this.alivePlayers().filter((player) => player.id !== this.human().id);
    this.inspectorHint.textContent = "비밀 후계자로 의심되는 플레이어 1명을 선택하세요. 맞히면 대상이 탈락하고, 틀리면 암행어사 본인이 탈락합니다.";

    targets.forEach((target) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "vote-card";
      button.innerHTML = `
        <span class="vote-name">${this.escape(target.name)}</span>
        <span class="vote-meta">후계자 의심 대상</span>
      `;
      button.addEventListener("click", () => this.useInspectorPower(target.id));
      this.inspectorGrid.append(button);
    });
  }

  renderVotes() {
    this.voteGrid.innerHTML = "";
    if (this.phase !== "voting") return;

    const human = this.human();
    this.alivePlayers().forEach((candidate) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "vote-card";
      button.disabled = candidate.id === human.id;
      button.innerHTML = `
        <span class="vote-name">${this.escape(candidate.name)}</span>
        <span class="vote-meta">${candidate.id === human.id ? "본인 투표 불가" : "시장 후보"}</span>
      `;
      button.addEventListener("click", () => this.castHumanVote(candidate.id));
      this.voteGrid.append(button);
    });
  }

  renderSuccessorSelection() {
    this.successorGrid.innerHTML = "";
    if (this.phase !== "successorSelect") return;

    const candidates = this.successorCandidates();
    const targetCount = Math.min(2, candidates.length);
    this.successorHint.textContent = targetCount
      ? `후계자로 지정할 생존자 ${targetCount}명을 선택하세요.`
      : "지정할 수 있는 생존자가 없습니다.";
    this.confirmSuccessorsButton.disabled = this.pendingSuccessorIds.length < targetCount;

    candidates.forEach((candidate) => {
      const selected = this.pendingSuccessorIds.includes(candidate.id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `vote-card ${selected ? "selected" : ""}`;
      button.innerHTML = `
        <span class="vote-name">${this.escape(candidate.name)}</span>
        <span class="vote-meta">${selected ? "후계자 선택됨" : "후계자 후보"}</span>
      `;
      button.addEventListener("click", () => this.togglePendingSuccessor(candidate.id));
      this.successorGrid.append(button);
    });
  }

  renderChoices() {
    this.choiceGrid.innerHTML = "";
    CHOICE_ORDER.forEach((choice) => {
      const info = CHOICES[choice];
      const button = document.createElement("button");
      button.type = "button";
      button.className = `choice-card ${this.lastPlayerPick === choice ? "selected" : ""}`;
      button.style.setProperty("--accent", info.color);
      button.disabled = this.phase !== "choosing" || !this.human().alive;
      button.innerHTML = `
        <span class="choice-symbol">${info.symbol}</span>
        <span class="choice-name">${info.name}</span>
        <p class="choice-rule">${info.rule}</p>
      `;
      button.addEventListener("click", () => this.choose(choice));
      this.choiceGrid.append(button);
    });
  }

  renderBattleSlots() {
    this.playerPick.querySelector(".slot-symbol").textContent = this.lastPlayerPick
      ? choiceSymbol(this.lastPlayerPick)
      : "?";
    this.basePick.querySelector(".slot-symbol").textContent = this.lastResult?.baseChoice
      ? choiceSymbol(this.lastResult.baseChoice)
      : "?";
  }

  renderPlayers() {
    this.playerGrid.innerHTML = "";
    this.players.forEach((player) => {
      const div = document.createElement("article");
      div.className = `player-card ${player.alive ? "" : "out"} ${player.id === this.mayorId && player.alive ? "mayor" : ""}`;
      const pick = player.pick ? choiceSymbol(player.pick) : "·";
      div.innerHTML = `
        <div class="player-top">
          <span class="player-name">${this.escape(player.name)}</span>
          ${player.id === this.mayorId && player.alive && this.alivePlayers().length > 2 ? '<span class="mayor-badge">시장</span>' : ""}
          <span class="player-pick">${pick}</span>
        </div>
        <div class="player-state">
          <span>${player.alive ? "생존" : "탈락"} · ${this.playerTypeText(player)}</span>
          <span>${this.phase === "voting" && player.vote !== null ? `투표: ${this.playerById(player.vote).name}` : ""}</span>
        </div>
      `;
      this.playerGrid.append(div);
    });
  }

  renderFriends() {
    this.friendList.innerHTML = "";
    if (!this.friends.length) {
      const empty = document.createElement("div");
      empty.className = "friend-empty";
      empty.textContent = "아직 추가된 친구가 없습니다.";
      this.friendList.append(empty);
      return;
    }

    this.friends.forEach((friend, index) => {
      const invited = this.players.some((player) => player.name.toLowerCase() === friend.toLowerCase());
      const canInvite = this.phase === "waiting" && !invited && !this.lobbyFull();
      const row = document.createElement("div");
      row.className = "friend-row";
      row.innerHTML = `
        <div>
          <span class="friend-name">${this.escape(friend)}</span>
          <span class="friend-status">${invited ? "로비 참가 중" : "초대 가능"}</span>
        </div>
        <button type="button" class="friend-invite" ${canInvite ? "" : "disabled"}>${invited ? "참가" : "초대"}</button>
        <button type="button" class="friend-remove" aria-label="${this.escape(friend)} 삭제">×</button>
      `;
      row.querySelector(".friend-invite").addEventListener("click", () => this.inviteFriend(friend));
      row.querySelector(".friend-remove").addEventListener("click", () => this.removeFriend(index));
      this.friendList.append(row);
    });
  }

  playerTypeText(player) {
    if (player.type === "ai") return "AI";
    if (player.type === "friend") return "친구";
    return "플레이어";
  }

  renderLogs() {
    this.logList.innerHTML = "";
    this.logs.forEach((entry) => {
      const div = document.createElement("div");
      div.className = `log-entry ${entry.important ? "important" : ""}`;
      div.textContent = entry.message;
      this.logList.append(div);
    });
  }

  phaseText() {
    return {
      waiting: "대기",
      voting: "시장 투표",
      successorSelect: "후계자 지정",
      choosing: "선택",
      reveal: "공개",
      over: "종료",
    }[this.phase] || "진행";
  }

  escape(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;",
    }[char]));
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.survivalGame = new SurvivalGame();
});
