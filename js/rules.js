"use strict";
(function (root) {
  function getRelationship(friendship) { if (friendship >= 60) return "亲密"; if (friendship >= 40) return "朋友"; if (friendship >= 20) return "熟悉"; return "陌生"; }
  function getRelationshipUpgrade(previousFriendship, nextFriendship, npcName) {
    const before = getRelationship(previousFriendship); const after = getRelationship(nextFriendship);
    if (before === after) return null;
    if (after === "熟悉") return { level: after, message: `你和 ${npcName} 变得熟悉起来了。` };
    if (after === "朋友") return { level: after, message: `你和 ${npcName} 成为了朋友。` };
    if (after === "亲密") return { level: after, message: `你已经真正了解 ${npcName} 了。` };
    return null;
  }
  function getClueLevel(friendship) { return friendship >= 60 ? "current" : friendship >= 40 ? "plan" : friendship >= 20 ? "habit" : "unknown"; }
  function canTriggerEmmaEvent({ friendship, period, location, triggered }) { return friendship >= 40 && (period === "afternoon" || period === "dusk") && location === "square" && !triggered; }
  function canTriggerRelationEvent({ friendship, day, period, location, triggered }, event) { return friendship >= 40 && day === event.day && period === event.period && location === event.location && !triggered; }
  const rules = { getRelationship, getRelationshipUpgrade, getClueLevel, canTriggerEmmaEvent, canTriggerRelationEvent }; root.GameRules = Object.freeze(rules);
  if (typeof module !== "undefined" && module.exports) module.exports = rules;
})(typeof globalThis !== "undefined" ? globalThis : window);

