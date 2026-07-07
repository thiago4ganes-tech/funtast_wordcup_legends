/**
 * LEGION — Narration Event Mapper
 *
 * Converte evento técnico em texto narrável.
 */

export class NarrationEventMapper {
  constructor(templates = {}, rng = Math.random) {
    this.templates = templates.templates || templates || {};
    this.rng = rng;
  }

  mapEvent(event, labels = {}) {
    const eventType = event.event_type || event.eventType;
    const outcome = event.outcome;
    const pool = this.templates?.[eventType]?.[outcome] || this.defaultTemplate(eventType, outcome);
    const template = Array.isArray(pool) ? pool[Math.floor(this.rng() * pool.length)] : pool;

    const text = this.interpolate(template, {
      actor: labels[event.actor_wc_id] || event.actor_name || 'O jogador',
      support_actor: labels[event.support_actor_wc_id] || event.support_actor_name || 'o companheiro',
      defender: labels[event.defender_wc_id] || event.defender_name || 'a defesa',
      goalkeeper: labels[event.goalkeeper_wc_id] || event.goalkeeper_name || 'o goleiro',
      team: labels[event.team_wc_id] || event.team_name || 'a equipe'
    });

    return {
      minute: event.minute,
      type: outcome === 'goal' ? 'goal' : eventType,
      importance: this.inferImportance(eventType, outcome),
      text: `${event.minute ?? ''}' ${text}`.trim(),
      raw_event: event
    };
  }

  defaultTemplate(eventType, outcome) {
    if (outcome === 'goal') return ['GOL! A jogada se desenvolve com precisão e termina com a bola no fundo da rede.'];
    if (outcome === 'save') return ['Finalização perigosa, mas o goleiro faz a defesa.'];
    if (outcome === 'miss') return ['A jogada termina em finalização, mas a bola sai sem direção.'];
    if (outcome === 'blocked') return ['A defesa bloqueia a tentativa e corta o perigo.'];
    return [`A jogada passa por ${eventType || 'uma disputa'} e termina em ${outcome || 'posse disputada'}.`];
  }

  interpolate(template, data) {
    return template.replace(/\{(\w+)\}/g, (_, key) => data[key] ?? '');
  }

  inferImportance(eventType, outcome) {
    if (outcome === 'goal') return 'goal';
    if (['save', 'miss', 'blocked'].includes(outcome) && ['box_shot', 'header_attempt', 'penalty'].includes(eventType)) return 'high';
    if (['cross', 'through_ball', 'corner', 'free_kick_direct'].includes(eventType)) return 'medium';
    return 'low';
  }
}
