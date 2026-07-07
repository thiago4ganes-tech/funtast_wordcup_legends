/**
 * LEGION — Historical Evidence Adapter
 *
 * Camada de leitura dos arquivos derivados da Etapa C.
 * O motor deve consultar modificadores e perfis por meio deste adaptador.
 */

export class HistoricalEvidenceAdapter {
  constructor({
    playerAttributes = [],
    teamProfiles = [],
    playerModifiers = [],
    teamModifiers = []
  } = {}) {
    this.playerAttributes = new Map(playerAttributes.map(p => [p.player_wc_id, p]));
    this.teamProfiles = new Map(teamProfiles.map(t => [t.team_wc_id, t]));
    this.playerModifiers = new Map(playerModifiers.map(p => [p.player_wc_id, p]));
    this.teamModifiers = new Map(teamModifiers.map(t => [t.team_wc_id, t]));
  }

  getPlayerAttributes(player_wc_id) {
    return this.playerAttributes.get(player_wc_id)?.attributes || {};
  }

  getPlayerModifiers(player_wc_id) {
    return this.playerModifiers.get(player_wc_id)?.modifiers || {};
  }

  getTeamProfiles(team_wc_id) {
    return this.teamProfiles.get(team_wc_id)?.profiles || {};
  }

  getTeamModifiers(team_wc_id) {
    return this.teamModifiers.get(team_wc_id)?.modifiers || {};
  }

  getModifier(entityType, id, modifierName) {
    if (entityType === 'player') return this.getPlayerModifiers(id)[modifierName] || 0;
    if (entityType === 'team') return this.getTeamModifiers(id)[modifierName] || 0;
    return 0;
  }
}
