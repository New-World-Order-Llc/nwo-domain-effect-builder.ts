import { DomainEffectSchema } from "beast-contracts/domain";
import { publishEvent } from "../data/EventPublisher";

export class DomainEffectBuilder {
  build(validatedResult) {
    const valid = DomainEffectSchema.safeParse(validatedResult);
    if (!valid.success) throw new Error("Invalid domain effect envelope");

    const { workflow, phase, context, result } = valid.data;

    const effect = {
      id: crypto.randomUUID(),
      workflow: workflow.workflow,
      phase,
      context,
      effect: this.deriveEffect(result),
      builtAt: new Date().toISOString()
    };

    publishEvent("domain.effect.built", effect);
    return effect;
  }

  deriveEffect(result) {
    return {
      type: result.status === "executed" ? "domain.update" : "domain.init",
      payload: result.data
    };
  }
}
