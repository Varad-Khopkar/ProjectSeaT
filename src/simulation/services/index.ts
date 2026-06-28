/**
 * Services layer placeholders to manage API sync, logs loading, and data persistence
 * for maritime simulations. Business logic will be implemented in future phases.
 */

export class MissionService {
  static async fetchMissionById(id: string): Promise<any> {
    // TODO: Connect to backend API. Returning placeholder promise.
    console.log(`[MissionService] Fetching mission ID: ${id}`);
    return Promise.resolve({ id });
  }

  static async listAvailableMissions(): Promise<any[]> {
    // TODO: Connect to API to list missions.
    return Promise.resolve([]);
  }
}

export class SceneService {
  static prefetchSceneAssets(sceneId: string): void {
    // TODO: Prefetch images and interactive layouts.
    console.log(`[SceneService] Prefetching assets for scene: ${sceneId}`);
  }
}

export class EventService {
  static dispatchSimulationEvent(eventId: string, payload: Record<string, any>): void {
    // TODO: Dispatch actions to analytics / logging trackers.
    console.log(`[EventService] Dispatched event ${eventId} with payload:`, payload);
  }
}

export class DialogueService {
  static fetchDialogueTree(dialogueId: string): Promise<any> {
    // TODO: Fetch branching dialogue nodes.
    return Promise.resolve({ dialogueId });
  }
}

export class RewardService {
  static async distributeMissionRewards(missionId: string, score: number): Promise<any> {
    // TODO: Post scores, update XP totals, and push badges to seafarer profiles.
    console.log(`[RewardService] Posting score ${score} for mission ${missionId}`);
    return Promise.resolve({ success: true });
  }
}

export class ProgressService {
  static async saveSimulationCheckpoint(missionId: string, sceneId: string, score: number): Promise<void> {
    // TODO: Save active seafarer state checkpoints to indexedDB / remote storage.
    console.log(`[ProgressService] Checkpoint saved: Mission=${missionId}, Scene=${sceneId}, Score=${score}`);
    return Promise.resolve();
  }
}
