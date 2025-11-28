# Testing

Version: 1.0.0
Last Updated: 2025-11-27

Test Types:
- Unit: AI decisions and engine evaluation
- Flow: Street progression and showdown sequences
- Engine Cases: Wheels, kickers, ties
- Probabilistic: Draw hit-rate sanity checks

Commands:
- `npm run test:ai`

Coverage Files:
- `tests/ai/poker-ai.test.ts`
- `tests/ai/flow-sim.test.ts`
- `tests/ai/engine-cases.test.ts`
- `tests/ai/probabilistic.test.ts`

Debugging:
- Use `DEBUG=true` to enable logger in engine/AI
- Clear caches for repeatability: `clearHandEvaluationCache()` at `lib/poker-engine.ts:486`
